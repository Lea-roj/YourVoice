import {Box, Button, Flex, Text} from '@chakra-ui/react';
import {ChatContext} from "../contexts/ChatContext";
import {useContext} from "react";

// @ts-ignore
const ChatIcon = (props) => {
    // const chat = ;
    const [chatId, setChatId] = useContext(ChatContext)
    const handleClick = () => {

        console.log(props.id)
        // @ts-ignore
        setChatId(props.id)
        // @ts-ignore
        setChatId(props.id)
        setTimeout(() => {
        }, 1000);
        console.log(chatId)
        console.log("Button clicked!");
        };
    // console.log(props);
    return (
        <Button
            as={Flex}
            d="flex"
            justify="flex-start"
            align="center"
            textAlign="left"
            height="4vh"
            maxWidth="100%"
            bg="white"
            borderRadius="md"
            p={2}
            mb={4}
            border="1px solid"
            borderColor="gray.200"
            m={2}
            onClick={handleClick}
        >
            <Text fontSize="sm">{props.val}</Text>
        </Button>
    );
};

export default ChatIcon;