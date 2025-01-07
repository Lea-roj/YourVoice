import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Button,
  Divider,
  Flex,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea,
  useDisclosure,
  Icon,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { UserContext } from '../userContext';
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import { FaTrashAlt } from 'react-icons/fa';

interface User {
  username: string;
  _id: string;
}

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  userId: User;
}

interface Post {
  title: string;
  content: string;
  category: string;
  createdAt: string;
  userId?: User;
  comments?: Comment[];
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useContext(UserContext);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const bg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const cardBg = useColorModeValue('gray.100', 'gray.700');
  const dividerColor = useColorModeValue('gray.200', 'gray.600');

  const fetchPost = () => {
    setLoading(true);
    fetch(`http://localhost:3000/post/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Napaka pri pridobivanju objave:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPost(); // Inicialno naložite podatke o objavi
  }, [id]);

  const handleCommentSubmit = () => {
    if (newComment.trim() === '') {
      alert('Komentar ne sme biti prazen.');
      return;
    }

    if (!user) {
      alert('Prijavite se za dodajanje komentarja.');
      return;
    }

    fetch(`http://localhost:3000/post/${id}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: newComment,
        userId: user._id,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Napaka pri dodajanju komentarja');
        }
        return response.json();
      })
      .then(() => {
        setNewComment(''); // Počistite vnos
        onClose();
        fetchPost(); // Ponovno naložite objavo, da pridobite najnovejše komentarje
      })
      .catch((error) => {
        console.error('Napaka pri dodajanju komentarja:', error);
      });
  };

  const formatCommentDate = (createdAt: string): string => {
    const now = new Date();
    const commentTime = new Date(createdAt);
    const diffInMinutes = Math.floor((now.getTime() - commentTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `pred ${diffInMinutes} min`;
    } else {
      return commentTime.toLocaleString(); // Default full date display
    }
  };

  const handleCommentDelete = (commentId: string) => {
    if (!user) {
      alert('Prijavite se za brisanje komentarja.');
      return;
    }

    fetch(`http://localhost:3000/post/${id}/comment/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Napaka pri brisanju komentarja');
        }
        fetchPost(); // Ponovno naložite objavo, da pridobite najnovejše komentarje
      })
      .catch((error) => {
        console.error('Napaka pri brisanju komentarja:', error);
      });
  };

  return (
      <Box mt={20} p={8} maxW="container.md" mx="auto" bg={bg} color={textColor} borderWidth="1px" borderRadius="lg" shadow="lg">
        <Button onClick={() => navigate('/posts')} colorScheme="teal" mb={6}>Nazaj na objave</Button>
        {loading ? (
            <Spinner size="xl" />
        ) : post ? (
            <>
              <Heading as="h2" size="xl" mb={4} textAlign="center" color="teal.500">{post.title}</Heading>
              <Divider mb={4} borderColor={dividerColor} />
              <Flex justify="space-between" fontSize="sm" mb={6}>
                <Text>Kategorija: <strong>{post.category}</strong></Text>
                <Text>Datum: <b>{new Date(post.createdAt).toLocaleDateString('sl-SI')}</b></Text>
              </Flex>
              <Text fontSize="sm" mb={4}>Avtor: <strong>{post.userId?.username || 'Neznan uporabnik'}</strong></Text>
              <Box fontSize="md" lineHeight="tall"
                  mt={4}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  sx={{
                    h1: { fontSize: '2xl', fontWeight: 'bold', mb: 4, color: 'teal.500' },
                    h2: { fontSize: 'xl', fontWeight: 'semibold', mb: 3, color: 'teal.400' },
                    h3: {fontSize: 'lg', fontWeight: 'medium', marginBottom: '0.5rem', color: 'gray.700'},
                    ul: { ml: 6 },
                    ol: { ml: 6 },
                    li: { mb: 2 },
                    a: { color: 'blue.400', textDecoration: 'underline' },
                  }}
              ></Box>
              <Divider my={6} borderColor={dividerColor} />
              <Heading as="h3" size="md" mb={4}>
                Komentarji
              </Heading>

          <Button colorScheme="teal" mb={4} onClick={onOpen}>
            Dodaj komentar
          </Button>

              <Flex gap={2} justifyContent="flex-end" mb={6}>
                <Button
                    leftIcon={<Icon as={AiOutlineArrowDown} />}
                    size="sm"
                    colorScheme={sortOrder === 'newest' ? 'teal' : 'gray'}
                    onClick={() => setSortOrder('newest')}
                >
                  Najnovejši
                </Button>
                <Button
                    leftIcon={<Icon as={AiOutlineArrowUp} />}
                    size="sm"
                    colorScheme={sortOrder === 'oldest' ? 'teal' : 'gray'}
                    onClick={() => setSortOrder('oldest')}
                >
                  Najstarejši
                </Button>
              </Flex>

              {post.comments && post.comments.length > 0 ? (
                  <VStack spacing={4} align="start">
                    {post.comments
                        .sort((a, b) =>
                            sortOrder === 'newest'
                                ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                                : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                        )
                        .map((comment) => (
                            <Box key={comment._id} p={4} bg={cardBg} borderRadius="md" w="full">
                              <Flex justify="space-between">
                                <Text fontSize="sm">
                                  {comment.userId.username} - {formatCommentDate(comment.createdAt)}
                                </Text>
                                {user?._id === comment.userId._id && (
                                    <IconButton
                                        icon={<FaTrashAlt />}
                                        size="sm"
                                        colorScheme="red"
                                        aria-label="Izbriši komentar"
                                        onClick={() => handleCommentDelete(comment._id)}
                                    />
                                )}
                              </Flex>
                              <Text mt={2}>{comment.content}</Text>
                            </Box>
                        ))}
                  </VStack>
              ) : (
                  <Text>Ni komentarjev. Bodite prvi, ki komentirate!</Text>
              )}

          <Modal
            isOpen={isOpen}
            onClose={onClose}
            initialFocusRef={textareaRef}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Dodaj komentar</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Textarea
                  ref={textareaRef} // Povezava referenc
                  placeholder="Vnesite svoj komentar..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="teal" onClick={handleCommentSubmit}>
                  Objavi
                </Button>
                <Button onClick={onClose} ml={3}>
                  Prekliči
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      ) : (
        <Text color="red.500">Objava ni najdena.</Text>
      )}
    </Box>
  );
};

export default PostDetail;
