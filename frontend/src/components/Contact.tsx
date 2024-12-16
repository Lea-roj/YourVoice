import React, {useState} from "react";
import Popup from 'reactjs-popup';
import '../styles.scss'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    useToast, Text,
} from '@chakra-ui/react';

const ContactPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');
    const toast = useToast();

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };
    const onClose = () => {
        setIsOpen(false);
    }
    const handleSubmit = () => {
        const url = 'http://localhost:3000/contact/';
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                subject,
                text,
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
                    title: 'Sporočilo uspešno poslano podpori!',
                    status: 'success',
                });
                setSubject('');
                setText('');
                onClose();
            })
            .catch((error) => {
                console.error('Error adding/updating post:', error);
                toast({
                    title: 'Napaka pri komunikaciji.',
                    status: 'error',
                });
            });
        }

        return (
        <div>
            <button onClick={togglePopup}>Kontakt</button>
            {isOpen && (
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>
                            Kontakt
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <FormControl mb={4}>
                                <FormLabel>Zadeva</FormLabel>
                                <Input
                                    placeholder="Vnesite zadevo"
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Kategorija</FormLabel>
                                <Textarea
                                    placeholder="Sporočilo"
                                    onChange={(e) => setText(e.target.value)}

                                />
                            </FormControl>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" onClick={handleSubmit} mr={3}>
                                Pošlji
                            </Button>
                            <Button onClick={onClose}>Prekliči</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </div>
    );
};

export default ContactPopup;

