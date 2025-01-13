import {Box, Button, Flex, Input, Spinner} from '@chakra-ui/react';
import React, {useContext, useEffect, useState} from "react";
import ChatBubble from "./ChatBubble";
import {ChatContext} from "../contexts/ChatContext";
import ChatIcon from "./ChatIcon";
import {Message} from "../interfaces/Message"

const Chat = () => {
    const [inputValue, setInputValue] = useState('');
    const [chatId, setChatId] = useContext(ChatContext)
    const [messages, setMessages] = useState<Message[]>([])
    // @ts-ignore
    const userData = JSON.parse(localStorage.getItem('user'));
    // const [loading, setLoading] = useState(false);
    // @ts-ignore
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleClick = () => {
        const body = {
            userId: userData._id,
            chatId: chatId,
            content: inputValue,
        }
        fetch('http://localhost:3000/msg/newMessage', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .catch((error) => {
                console.error('Napaka pri pridobivanju objav:', error);
            });
        setInputValue('');
    };
    const loadChat= () =>{
        // setLoading(true);
        const body = {
            chatId: chatId
        }
        if(chatId != 'initial value'){
            fetch('http://localhost:3000/msg/getChatMessages', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    let m : Message[] = []
                    for (let i = 0; i< data.length; i++) {
                        const mInfo : Message = {
                            userId: data[i]._id,
                            content: data[i].content
                        }
                        m.push(mInfo);
                    }
                    setMessages(data);
                    // console.log(messages);
                    // setLoading(false);
                })
                .catch((error) => {
                    console.error('Napaka pri pridobivanju objav:', error);
                });
        }

    }

    useEffect(() => {
        const intervalId = setInterval(loadChat, 200);
        return () => {
            // @ts-ignore
            clearInterval(intervalId);
        }
    }, [chatId]);
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
                <div>
                    {messages.map(msg => <ChatBubble userId={msg.userId} content={msg.content}></ChatBubble>)}
                </div>
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