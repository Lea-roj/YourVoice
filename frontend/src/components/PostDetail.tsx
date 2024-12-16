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
} from '@chakra-ui/react';
import { UserContext } from '../userContext';

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
  _id: any;
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
  const [reportReason, setReportReason] = useState('');
  const [newComment, setNewComment] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isReportOpen, onOpen: onReportOpen, onClose: onReportClose } = useDisclosure();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // Ustvarite ref za textarea
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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

  //!TODO
  const handleReportPost = async () => {

  };

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
    <Box
      p={8}
      maxW="container.md"
      mx="auto"
      borderWidth="1px"
      borderRadius="lg"
      shadow="lg"
    >
      <Button onClick={() => navigate('/posts')} colorScheme="teal" mb={6}>
        Nazaj na objave
      </Button>
      {loading ? (
        <Spinner size="xl" />
      ) : post ? (
        <>
          <Heading as="h2" size="xl" mb={4} textAlign="center" color="teal.600">
            {post.title}
          </Heading>
          <Divider mb={4} />
          <Flex justify="space-between" color="gray.500" fontSize="sm" mb={6}>
            <Text>
              Kategorija: <strong>{post.category}</strong>
            </Text>
            <Text>
              Datum: <b>{new Date(post.createdAt).toLocaleDateString()}</b>
            </Text>
          </Flex>
          <Text color="gray.500" fontSize="sm" mb={4}>
            Avtor:{' '}
            <strong>{post.userId?.username || 'Neznan uporabnik'}</strong>
          </Text>
          <Box
              fontSize="md"
              lineHeight="tall"
              mt={4}
              color="gray.700"
              dangerouslySetInnerHTML={{ __html: post.content }}
              sx={{
                h1: {fontSize: '2xl', fontWeight: 'bold', marginBottom: '1rem', color: 'teal.500'},
                h2: {fontSize: 'xl', fontWeight: 'semibold', marginBottom: '0.75rem', color: 'teal.400'},
                h3: {fontSize: 'lg', fontWeight: 'medium', marginBottom: '0.5rem', color: 'gray.700'},
                ul: {marginLeft: '1.5rem'},
                ol: {marginLeft: '1.5rem'},
                li: {marginLeft: '0.5rem'},
                a: {color: 'blue.500', textDecoration: 'underline'},
              }}
          ></Box>
          <Button colorScheme="red" mt={4} onClick={onReportOpen}>
            Prijavi objavo
          </Button>

          <Modal isOpen={isReportOpen} onClose={onReportClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Prijavite objavo</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>
                  Prosimo, navedite razlog za prijavo te objave:
                </Text>
                <Textarea
                    placeholder="Razlog za prijavo..."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    mt={4}
                />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="red" onClick={handleReportPost}>
                  Pošlji prijavo
                </Button>
                <Button onClick={onReportClose} ml={3}>
                  Prekliči
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>


          <Divider my={6} />
          <Heading as="h3" size="md" mb={4}>
            Komentarji
          </Heading>

          <Button colorScheme="teal" mb={4} onClick={onOpen}>
            Dodaj komentar
          </Button>

          {post.comments && post.comments.length > 0 ? (
            <VStack spacing={4} align="start">
              {post.comments
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((comment) => (
                  <Box
                    key={comment._id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    w="full"
                  >
                    <Text fontSize="sm" color="gray.500">
                      {comment.userId.username} -{' '}
                      {new Date(comment.createdAt).toLocaleString()}
                    </Text>
                    <Text>{comment.content}</Text>
                    {user?._id === comment.userId._id && (
                      <Button
                        colorScheme="red"
                        size="sm"
                        mt={2}
                        onClick={() => handleCommentDelete(comment._id)}
                      >
                        Izbriši
                      </Button>
                    )}
                  </Box>
                ))}
            </VStack>
          ) : (
            <Text color="gray.500">
              Ni komentarjev. Bodite prvi, ki komentirate!
            </Text>
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
