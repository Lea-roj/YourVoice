import {Box, Flex} from '@chakra-ui/react';
import ChatIcon from "./ChatIcon";
import NewChat from "./NewChat";

const ChatList = () => {
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
                <ChatIcon></ChatIcon>
                <ChatIcon></ChatIcon>
                <ChatIcon></ChatIcon>
                <ChatIcon></ChatIcon>
            </div>

        </Flex>
    );
};

export default ChatList;