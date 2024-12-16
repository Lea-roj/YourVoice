import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

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
  parentId?: string; // parent comment
  children?: Comment[]; // Nested comments
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
  const navigate = useNavigate();
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [nestedComments, setNestedComments] = useState<Comment[]>([]);


  const handleReply = (parentId: string, content: string) => {
    if (!user) {
      alert('Prijavite se za dodajanje komentarja.');
      return;
    }

    if (content.trim() === '') {
      alert('Komentar ne sme biti prazen.');
      return;
    }

    fetch(`http://localhost:3000/post/${id}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        userId: user._id,
        postId: id, // Ensure postId is passed
        parentId, // Associate reply with the parent comment
      }),
    })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Napaka pri dodajanju komentarja');
          }
          return response.json();
        })
        .then(() => {
          fetchPost(); // Reload comments after a successful reply
        })
        .catch((error) => {
          console.error('Napaka pri dodajanju komentarja:', error);
        });
  };



  const CommentItem: React.FC<{
    comment: Comment;
    handleReply: (commentId: string, content: string) => void;
    handleDelete: (commentId: string) => void;
  }> = ({ comment, handleReply, handleDelete }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isOpen, setIsOpen] = useState(true);

    const toggleReplyInput = () => setShowReplyInput((prev) => !prev);
    const toggleChildren = () => setIsOpen((prev) => !prev);

    const submitReply = () => {
      if (replyContent.trim() !== '') {
        handleReply(comment._id, replyContent);
        setReplyContent('');
        setShowReplyInput(false);
      }
    };

    return (
        <Box p={4} borderWidth="1px" borderRadius="md" w="full" ml={comment.parentId ? 4 : 0}>
          <Flex justify="space-between" align="center">
            <Text fontSize="sm" color="gray.500">
              {comment.userId.username} - {new Date(comment.createdAt).toLocaleString()}
            </Text>
            <Flex>
              <Button size="sm" colorScheme="red" onClick={() => handleDelete(comment._id)} mr={2}>
                Delete
              </Button>
              {comment.children && comment.children.length > 0 && (
                  <Button size="sm" variant="ghost" onClick={toggleChildren}>
                    {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                  </Button>
              )}
            </Flex>
          </Flex>

          <Text mt={2}>{comment.content}</Text>

          <Button size="sm" colorScheme="teal" mt={2} onClick={toggleReplyInput}>
            {showReplyInput ? 'Cancel' : 'Reply'}
          </Button>

          {showReplyInput && (
              <Box mt={2}>
                <Textarea
                    placeholder="Enter your reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                />
                <Button size="sm" colorScheme="teal" mt={2} onClick={submitReply}>
                  Post
                </Button>
              </Box>
          )}

          {isOpen && comment.children && comment.children.length > 0 && (
              <VStack spacing={4} align="start" mt={4}>
                {comment.children.map((child) => (
                    <CommentItem
                        key={child._id}
                        comment={child}
                        handleReply={handleReply}
                        handleDelete={handleDelete}
                    />
                ))}
              </VStack>
          )}
        </Box>
    );
  };

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
          setPost(data); // Ensure `comments` is a flat list
          setLoading(false);
        })
        .catch((error) => {
          console.error('Napaka pri pridobivanju objave:', error);
          setLoading(false);
        });
  };


  const nestComments = (comments: Comment[]): Comment[] => {
    const commentMap: Record<string, Comment & { children: Comment[] }> = {};

    // Initialize map with each comment and an empty `children` array
    comments.forEach((comment) => {
      commentMap[comment._id] = { ...comment, children: [] };
    });

    const nestedComments: Comment[] = [];

    // Build the tree by associating children with their parentId
    comments.forEach((comment) => {
      if (comment.parentId) {
        const parent = commentMap[comment.parentId];
        if (parent) {
          parent.children.push(commentMap[comment._id]);
        }
      } else {
        // Top-level comment (no parentId)
        nestedComments.push(commentMap[comment._id]);
      }
    });

    return nestedComments;
  };



  useEffect(() => {
    fetchPost(); // Inicialno naložite podatke o objavi
  }, [id]);

  useEffect(() => {
    if (post?.comments) {
      const nested = nestComments(post.comments);
      setNestedComments(nested);
    }
  }, [post?.comments]);

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
        postId: id, // Ensure postId is passed
        parentId: replyTo || null, // Handle reply-to logic
      }),
    })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Napaka pri dodajanju komentarja');
          }
          return response.json();
        })
        .then(() => {
          setNewComment('');
          onClose();
          setReplyTo(null); // Reset replyTo after submitting
          fetchPost(); // Reload comments
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

          <Divider my={6} />
          <Heading as="h3" size="md" mb={4}>
            Komentarji
          </Heading>

          <Button colorScheme="teal" mb={4} onClick={onOpen}>
            Dodaj komentar
          </Button>

          {post.comments && post.comments.length > 0 ? (
              <VStack spacing={4} align="start">
                {nestedComments.map((comment) => (
                    <CommentItem
                        key={comment._id}
                        comment={comment}
                        handleReply={handleReply}
                        handleDelete={handleCommentDelete}
                    />
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
                {replyTo && (
                    <Text fontSize="sm" mb={2} color="gray.500">
                      Odgovarjate na komentar
                    </Text>
                )}
                <Textarea
                    ref={textareaRef}
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
