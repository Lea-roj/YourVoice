import { Box, Text } from '@chakra-ui/react';

const ChatBubble = () => {
    const x = Math.random();
    return (
        <>
        {x < 0.5 ? (
            <Box
            width="100%"
            >
            <Box
            bg="gray.500"
            color="white"
            borderRadius="lg"
            p={3}
            mb={2}
            float="left"
            maxWidth="60%"
        >
            <Text>MessagMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessagee {x} </Text>
        </Box>
            </Box>

        ) : (
            <Box

                w="100%">
            <Box
            bg="blue.500"
            color="white"
            borderRadius="lg"
            p={3}
            mb={2}
            maxWidth="60%"
            float="right"
        >
            <Text>MessageMessageMessageMessageMessage {x} </Text>
        </Box>
            </Box>
        )}

        </>
    );
};

export default ChatBubble;