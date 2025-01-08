import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Heading,
  Button,
  Stack,
  Text,
  Spinner,
  Input,
  useDisclosure, Select, Image,
  useColorModeValue,
   Flex,
} from '@chakra-ui/react';
import { UserContext } from '../userContext';
import AddPostModal from '../components/AddPostModal';
import { Post } from '../interfaces/Post';
import { Link } from 'react-router-dom';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { FaEdit, FaThumbsDown } from 'react-icons/fa';
import {FaThumbsUp, FaTrash} from "react-icons/fa6"; // Import the edit icon

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [authorQuery, setAuthorQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('Splošno');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [draftPost, setDraftPost] = useState<Post | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useContext(UserContext);

  const bg = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.200');

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
        console.log(data);
        setPosts(data.reverse());
        setLoading(false);
      })
      .catch((error) => {
        console.error('Napaka pri pridobivanju objav:', error);
        setLoading(false);
      });
  };

  const calculateRating = (upvotes: number, downvotes: number): number => {
    const total = upvotes + downvotes;
    if (total === 0) return 0;
    return Math.round((upvotes / total) * 5);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
          <span key={i}>
        {i <= rating ? (
            <AiFillStar color="#FFD700" size={20} /> // Filled Star
        ) : (
            <AiOutlineStar color="#D3D3D3" size={20} /> // Empty Star
        )}
      </span>
      );
    }
    return stars;
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
    post.userId.username.toLowerCase().includes(authorQuery.toLowerCase()) &&
    (selectedCategory === 'Splošno' || post.category === selectedCategory)
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
      <Box p={6} maxW="container.lg" mx="auto" bg={bg} color={textColor}>
        <Heading as="h2" size="xl" mb={6} textAlign="center">
          Forum - Objave
        </Heading>

        {/* Category Navigation */}
        <Box display="flex" justifyContent="center" mb={6} gap={4}>
          {['Splošno', 'Tehnologija', 'Izobraževanje', 'Šport', 'Zabava'].map(
              (category) => (
                  <Button
                      key={category}
                      variant={selectedCategory === category ? 'solid' : 'outline'}
                      colorScheme="blue"
                      onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
              )
          )}
        </Box>

        {user && (
            <Button onClick={onOpen} colorScheme="blue" mb={6}>
              Dodaj novo objavo
            </Button>
        )}

        {/* Search & Sort */}
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
                    if (sortOrder === 'newest')
                      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    if (sortOrder === 'oldest')
                      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    if (sortOrder === 'mostLikes') return b.upvotes - a.upvotes;
                    if (sortOrder === 'leastLikes') return a.upvotes - b.upvotes;
                    return 0;
                  })
                  .map((post) => (
                      <Box
                          key={post._id}
                          p={5}
                          shadow="md"
                          borderWidth="1px"
                          borderRadius="lg"
                          bg={cardBg}
                      >
                        <Flex align="center" justify="space-between">
                          <Heading fontSize="xl">{post.title}</Heading>
                          {user && post.userId && post.userId._id === user._id && (
                              <Flex gap={2}>
                                {/* Edit Button with Icon */}
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="blue"
                                    onClick={() => handleEditPost(post)}
                                    leftIcon={<FaEdit />}
                                >
                                  Uredi
                                </Button>

                                {/* Delete Button with Icon */}
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="red"
                                    onClick={() => handleDeletePost(post._id)}
                                    leftIcon={<FaTrash />}
                                >
                                  Izbriši
                                </Button>
                              </Flex>
                          )}
                        </Flex>

                        <Text mt={2} fontSize="sm">
                          Kategorija: {post.category}
                        </Text>
                        <Text mt={2} fontSize="sm">
                          Avtor: {post.userId?.username || 'Neznan uporabnik'}
                        </Text>
                        <Text mt={2} fontSize="sm">
                          Datum objave: {formatDate(post.createdAt)}
                        </Text>
                        {post.photoPath && (
            <Box mt={4}>
              <Image
                src={"http://localhost:3000/"+post.photoPath}  // Preveri, da `imagePath` vsebuje pravilno pot do slike
                alt="Post Image"
                boxSize="200px"  // Nastavi želeno velikost
                objectFit="cover"  // Oblikuj sliko za ustrezno obrezovanje
                borderRadius="md"
              />
            </Box>
          )}
                        <Box mt={2} display="flex" alignItems="center">
                          <Text fontSize="sm" mr={2}>
                            Ocena:
                          </Text>
                          {renderStars(calculateRating(post.upvotes, post.downvotes))}
                        </Box>
                        <Link to={`/posts/${post._id}`}>
                          <Button colorScheme="teal" mt={4}>
                            Preberi več
                          </Button>
                        </Link>
                        <Box mt={4} display="flex" justifyContent="flex-end" gap={3}>
                          {/* Thumbs Up Button */}
                          <Button
                              size="sm"
                              variant="outline"
                              colorScheme="green"
                              onClick={() => handleLikePost(post._id)}
                              leftIcon={<FaThumbsUp />}
                          >
                            {post.upvotes}
                          </Button>

                          {/* Thumbs Down Button */}
                          <Button
                              size="sm"
                              variant="outline"
                              colorScheme="red"
                              onClick={() => handleDislikePost(post._id)}
                              leftIcon={<FaThumbsDown />}
                          >
                            {post.downvotes}
                          </Button>
                        </Box>

                      </Box>
                  ))}
            </Stack>
        )}

        <AddPostModal
            isOpen={isOpen}
            onClose={() => {
              onClose();
              setSelectedPost(null);
            }}
            onPostAdded={handlePostAdded}
            post={selectedPost}
            onSaveDraft={setDraftPost}
            draftPost={draftPost}
        />
      </Box>
  );
};

export default Posts;
