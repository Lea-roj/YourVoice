import {Box, Flex, Spinner} from '@chakra-ui/react';
import ChatIcon from "./ChatIcon";
import NewChat from "./NewChat";
import React, {useEffect, useState} from "react";
import {Chat} from "../interfaces/Chat";

const ChatList = () => {
    const [loading, setLoading] = useState(true);
    const [chats, setChats] = useState<Chat[]>([]);
    const loadPosts = () => {
        // @ts-ignore
        const userData = JSON.parse(localStorage.getItem('user'));
        // @ts-ignore
        // console.log(userData._id)
        const body = {
            userId: userData._id
        }
        fetch('http://localhost:3000/chat/getUserChats', {
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
                // console.log(data);
                let c : Chat[] = [];
                for(let i = 0; i < data.length; i++) {
                    var otherId: string = '';
                    var otherUsername: string = '';
                    // console.log(data[i]);
                    // console.log(userData);
                    if(userData._id == data[i].user1.id){
                        otherId = data[i].user2.id;
                        otherUsername = data[i].user2.username;
                    }else{
                        otherId = data[i].user1.id;
                        otherUsername = data[i].user1.username;
                    }

                    const cInfo : Chat = {
                        _id: data[i]._id,
                        name: otherUsername
                    }
                    c.push(cInfo);
                }
                setChats(c);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Napaka pri pridobivanju objav:', error);
                setLoading(false);
            });
    };



    useEffect(() => {
        const intervalId = setInterval(loadPosts, 500);
        return () => clearInterval(intervalId);
    }, []);
    // @ts-ignore
    return (
        <Flex
            flex="0 0 28%"
            flexDirection="column"
            width="28%"
            height="100%"
            bg="gray.100"
            border="1px solid"
            borderColor="gray.200"
            overflowX="hidden"
            overflowY="auto"
        >
            <NewChat></NewChat>
            <div>
                {loading ? (
                    <Spinner size="xl" />
                ) :  (
                    chats.map(chat => <ChatIcon key={Math.random()} id={chat._id} val={chat.name}/>)
                    )}
            </div>

        </Flex>
    );
};

export default ChatList;