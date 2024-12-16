// components/Profile.tsx
import React, {useContext, useEffect, useState} from 'react';
import {
    Box,
    Heading,
    Text,
    Button,
    Stack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton, ModalBody, FormControl, FormLabel, Input, Textarea, ModalFooter, Checkbox, useToast
} from '@chakra-ui/react';
import { UserContext } from '../userContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [commentNotif, setCommentNotif] = useState(false);
    const [messageNotif, setMessageNotif] = useState(false);
    const toast = useToast();
    useEffect(() => {
        if (user) {
            setCommentNotif(user.notifications.comment);
            setMessageNotif(user.notifications.message);
        } else {

        }
    }, [user]);

    const togglePopup = () => {
        setIsOpen(!isOpen);
        // console.log(user);
    };
    const onClose = () => {
        setIsOpen(false);
    }
    const update = () => {

    }
    const save = () => {
        if(user) {
            const url = `http://localhost:3000/user/updateNotif/${user._id}`;
            fetch(url, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    notifications: {
                        comment: commentNotif,
                        message: messageNotif
                    }
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(() => {
                    toast({
                        title: 'Nastavitve uspešno posodobljene!',
                        status: 'success',
                    });
                    user.notifications.message = messageNotif;
                    user.notifications.comment = commentNotif;
                    onClose();
                })
                .catch((error) => {
                    console.error('Error updating settings:', error);
                    toast({
                        title: 'Napaka pri komunikaciji.',
                        status: 'error',
                    });
                });
        }
    }

  if (!user) {
    return (
      <Box p={6} textAlign="center">
        <Heading as="h2" size="xl" mb={6}>
          Profil uporabnika
        </Heading>
        <Text>Za ogled profila se morate prijaviti.</Text>
        <Button mt={4} colorScheme="teal" onClick={() => navigate('/login')}>
          Prijava
        </Button>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="container.md" mx="auto">
      <Heading as="h2" size="xl" mb={6} textAlign="center">
        Profil uporabnika
      </Heading>
      <Stack spacing={4}>
        <Box>
          <Text fontSize="lg" fontWeight="bold">
            Ime:
          </Text>
          <Text fontSize="md">{user.username}</Text>
        </Box>
        <Box>
          <Text fontSize="lg" fontWeight="bold">
            E-pošta:
          </Text>
          <Text fontSize="md">{user.email}</Text>
        </Box>
        <Box>
          <Text fontSize="lg" fontWeight="bold">
            Datum registracije:
          </Text>
          <Text fontSize="md">
            {new Date(user.createdAt).toLocaleDateString()}
          </Text>
        </Box>
      </Stack>
        <Button mt={6} mr={6} colorScheme="blue" onClick={togglePopup}>
            Nastavitve
        </Button>
        {isOpen && (
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Nastavitve
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl mb={4}>
                            <FormLabel>Obvestila</FormLabel>
                            { user.notifications.comment ?
                                <Checkbox defaultChecked onChange={(e: any) => setCommentNotif(e.target.checked)}>Ob novih komentarjih</Checkbox>
                                :
                                <Checkbox onChange={(e: any) => setCommentNotif(e.target.checked)}>Ob novih komentarjih</Checkbox>
                            }
                                <br/>
                            { user.notifications.message ?
                                <Checkbox defaultChecked onChange={(e: any) => setMessageNotif(e.target.checked)}>Ob novih sporočilih</Checkbox>
                                :
                                <Checkbox onChange={(e: any) => setMessageNotif(e.target.checked)}>Ob novih sporočilih</Checkbox>
                            }
                        </FormControl>

                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={save} mr={3}>
                            Shrani
                        </Button>
                        <Button onClick={onClose}>Prekliči</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        )}
      <Button mt={6} colorScheme="teal" onClick={() => navigate('/')}>
        Domov
      </Button>
    </Box>

  );
};

export default Profile;
