import {Box, Button, Flex, Input} from '@chakra-ui/react';
import React, {useState} from "react";
import ChatBubble from "./ChatBubble";

const Chat = () => {
    const [inputValue, setInputValue] = useState('');

    // @ts-ignore
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleClick = () => {
        alert(inputValue);
    };
    return (
        <Flex
            flex="1"
            flexDirection="column"
        >
            <Flex
                flex="1 0 93%"
                flexDirection="column-reverse"
                overflowY="auto"
                bg={"gray.100"}
                pl={4}
                pr={4}
                pt={4}
            >
                <ChatBubble></ChatBubble>
                <ChatBubble></ChatBubble>
                <ChatBubble></ChatBubble>
                <ChatBubble></ChatBubble>
                <ChatBubble></ChatBubble>
                <ChatBubble></ChatBubble>
                <ChatBubble></ChatBubble>
                <ChatBubble></ChatBubble>
                <ChatBubble></ChatBubble>
                <ChatBubble></ChatBubble>
                <ChatBubble></ChatBubble>
                <ChatBubble></ChatBubble>
                <ChatBubble></ChatBubble>
            </Flex>
            <Flex
                flex="1 0 7%"
                flexDirection="row"
                bg="gray.200"
                pr={2}
            >
                <Input
                    placeholder="Enter text"
                    bg={"gray.300"}
                    value={inputValue}
                    onChange={handleInputChange}
                    flex="1"
                    m="auto"
                    ml={2}
                    mr={2}
                />
                <Button
                    onClick={handleClick}
                    colorScheme="blue"
                    mr={"2%"}
                    m="auto"
                >
                    Submit
                </Button>
            </Flex>
        </Flex>
    );
};

export default Chat;