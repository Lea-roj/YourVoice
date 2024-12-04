import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Heading,
  Button,
  Stack,
  Text,
  Spinner,
  Input,
  useDisclosure,
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

  const filteredPosts = posts.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

    {/* Search Bar */}
    <Input
        placeholder="Išči po naslovu..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        mb={6}
    />

      {loading ? (
        <Spinner size="xl" />
      ) : filteredPosts.length === 0 ? (
        <Text fontSize="lg" color="gray.500" textAlign="center" mt={8}>
          Trenutno ni nobenih objav.
        </Text>
      ) : (
        <Stack spacing={6}>
        {filteredPosts.map((post) => (
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
              {/* Dodani gumbi za like in dislike */}
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
