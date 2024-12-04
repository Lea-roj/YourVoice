import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Heading,
  Button,
  Stack,
  Text,
  Spinner,
  Input,
  useDisclosure, Select,
} from '@chakra-ui/react';
import { UserContext } from '../userContext';
import AddPostModal from '../components/AddPostModal';
import { Post } from '../interfaces/Post';
import { Link } from 'react-router-dom';

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null); // Track selected post for editing
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [authorQuery, setAuthorQuery] = useState(''); // Author query state
  const [sortOrder, setSortOrder] = useState('newest'); // Sorting state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useContext(UserContext);

  const loadPosts = () => {
    setLoading(true);
    fetch('http://localhost:3000/post')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setPosts(data.reverse());
        setLoading(false);
      })
      .catch((error) => {
        console.error('Napaka pri pridobivanju objav:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handlePostAdded = () => {
    loadPosts();
    setSelectedPost(null); // Reset selected post after adding
  };

  const handleEditPost = (post: Post) => {
    setSelectedPost(post); // Set the selected post for editing
    onOpen(); // Open the modal
  };

  const handleDeletePost = (id: string) => {
    fetch(`http://localhost:3000/post/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          loadPosts(); // Reload posts after deletion
        } else {
          console.error('Napaka pri brisanju objave');
        }
      })
      .catch((error) => {
        console.error('Napaka pri brisanju objave:', error);
      });
  };

  const handleLikePost = async (postId: string) => {


    try {
      const response = await fetch(`http://localhost:3000/post/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user?.username }), // Pošlje trenutno prijavljenega uporabnika
      });

      if (!response.ok) {
        throw new Error('Napaka pri všečkanju objave');
      }

      const updatedPost = await response.json();
      // setPosts((prevPosts) =>
      //   prevPosts.map((post) =>
      //     post._id === updatedPost._id ? updatedPost : post
      //   )
      // );
      loadPosts();

    } catch (error) {
      console.error('Napaka pri všečkanju objave:', error);
    }
  };


  const handleDislikePost = async (postId: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/post/${postId}/dislike`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user?.username }), // Pošlje trenutno prijavljenega uporabnika
      }
    );

    if (!response.ok) {
      throw new Error('Napaka pri nevšečkanju objave');
    }

    const updatedPost = await response.json();
    // setPosts((prevPosts) =>
    //   prevPosts.map((post) =>
    //     post._id === updatedPost._id ? updatedPost : post
    //   )
    // );
    loadPosts();

  } catch (error) {
    console.error('Napaka pri nevšečkanju objave:', error);
  }
};

  const filteredPosts = posts.filter(
      (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          post.userId.username.toLowerCase().includes(authorQuery.toLowerCase())
  );

  const formatDate = (date: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(date).toLocaleDateString('sl-SI', options); // Slovenian locale
  };

  return (
    <Box p={6} maxW="container.lg" mx="auto">
      <Heading as="h2" size="xl" mb={6} textAlign="center">
        Forum - Objave
      </Heading>
      {user && (
        <Button onClick={onOpen} colorScheme="blue" mb={6}>
          Dodaj novo objavo
        </Button>
      )}

        {/* Search Bars */}
        <Input
            placeholder="Išči po naslovu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            mb={4}
        />
        <Input
            placeholder="Išči po avtorju..."
            value={authorQuery}
            onChange={(e) => setAuthorQuery(e.target.value)}
            mb={4}
        />

        {/* Sorting Dropdown */}
        <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            mb={6}
        >
          <option value="newest">Najnovejše</option>
          <option value="oldest">Najstarejše</option>
          <option value="mostLikes">Največ všečkov</option>
          <option value="leastLikes">Najmanj všečkov</option>
        </Select>

        {loading ? (
            <Spinner size="xl" />
        ) : filteredPosts.length === 0 ? (
            <Text fontSize="lg" color="gray.500" textAlign="center" mt={8}>
              Trenutno ni nobenih objav.
            </Text>
        ) : (
            <Stack spacing={6}>
              {filteredPosts
                  .sort((a, b) => {
                    if (sortOrder === 'newest') {
                      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    } else if (sortOrder === 'oldest') {
                      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    } else if (sortOrder === 'mostLikes') {
                      return b.upvotes - a.upvotes;
                    } else if (sortOrder === 'leastLikes') {
                      return a.upvotes - b.upvotes;
                    }
                    return 0;
                  })
          .map((post) => (
              <Box
                  key={post._id}
                  p={5}
                  shadow="md"
                  borderWidth="1px"
                  borderRadius="lg"
                  _hover={{ bg: 'gray.50' }}
              >
              <Heading fontSize="xl">{post.title}</Heading>
              <Text mt={2} fontSize="md" color="gray.600">
                Kategorija: {post.category}
              </Text>
              <Text mt={2} fontSize="sm" color="gray.500">
                Avtor: {post?.userId?.username || 'Neznan uporabnik'}
              </Text>
              <Text mt={2} fontSize="sm" color="gray.500">
                Datum objave: {formatDate(post.createdAt)}
              </Text>
              <Link to={`/posts/${post._id}`}>
                <Button colorScheme="teal" mt={4}>
                  Preberi več
                </Button>
              </Link>
              {user && post.userId && post.userId._id === user._id && (
                <Box mt={4}>
                  <Button
                    colorScheme="green"
                    mr={3}
                    onClick={() => handleEditPost(post)} // Edit post
                  >
                    Uredi
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => handleDeletePost(post._id)} // Delete post
                  >
                    Izbriši
                  </Button>
                </Box>
            )}
      {/* Like and Dislike Buttons */}
      <Box
        mt={4}
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        gap={3}
      >
        {/* Like */}
        <Box
          display="flex"
          alignItems="center"
          bg="green.100"
          borderRadius="full"
          px={3}
          py={1}
        >
          <Button
            size="sm"
            colorScheme="green"
            variant="solid"
            onClick={() => handleLikePost(post._id)}
          >
            Like
          </Button>
          <Text ml={2} fontWeight="bold" color="green.700" fontSize="sm">
            {post.upvotes}
          </Text>
        </Box>

        {/* Dislike */}
        <Box
          display="flex"
          alignItems="center"
          bg="red.100"
          borderRadius="full"
          px={3}
          py={1}
        >
          <Button
            size="sm"
            colorScheme="red"
            variant="solid"
            onClick={() => handleDislikePost(post._id)}
          >
            Dislike
          </Button>
          <Text ml={2} fontWeight="bold" color="red.700" fontSize="sm">
            {post.downvotes}
          </Text>
        </Box>
      </Box>
            </Box>
        ))}
      </Stack>
        )}
      <AddPostModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedPost(null); // Reset selected post when modal closes
        }}
        onPostAdded={handlePostAdded}
        post={selectedPost} // Pass selected post to the modal
      />
    </Box>
  );
};

export default Posts;
