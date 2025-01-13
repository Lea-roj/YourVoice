import React from "react";
import {Box, Flex} from "@chakra-ui/react";
import ChatList from "../components/ChatList";
import Chat from "../components/Chat";
const Sporocila: React.FC = () => {
    return (
        <Flex
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            h={"60vh"}
            mt={"10vh"}
        >
            <ChatList></ChatList>
            <Chat></Chat>
        </Flex>
    );
};

export default Sporocila;
