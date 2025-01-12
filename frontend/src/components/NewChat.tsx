import {
    Box,
    Button,
    Flex, Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay, useDisclosure
} from '@chakra-ui/react';
import {useState} from "react";

const NewChat = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [inputValue, setInputValue] = useState('');

    // @ts-ignore
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleConfirm = () => {
        console.log('New chat: ', inputValue);
        setInputValue('');
        onClose();
    };
    return (
        <>
        <Box

            width="100%"
            bg="gray.200"
            p={2}
        >
            <Flex justifyContent="center">
                <Button
                    w="100%"
                    colorScheme="blue"
                    onClick={onOpen}
                >
                    New Chat
                </Button>
            </Flex>
        </Box>
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p={3}>
            <ModalHeader>New Chat</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Input
                    placeholder="Enter username"
                    value={inputValue}
                    onChange={handleInputChange}
                />
            </ModalBody>

            <Flex justifyContent="flex-end">
                <Button colorScheme="blue" onClick={handleConfirm}>
                    Confirm
                </Button>
            </Flex>
        </ModalContent>
    </Modal>
        </>
    );
};

export default NewChat;