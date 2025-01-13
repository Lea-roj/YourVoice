import { Box, Text } from '@chakra-ui/react';

// @ts-ignore
const ChatBubble = (props) => {
    // @ts-ignore
    const userData = JSON.parse(localStorage.getItem('user'));
    let thisUser;
    if(userData._id === props.userId){
        thisUser = true;
    }else{
        thisUser = false;
    }
    return (
        <>
        {!thisUser ? (
            <>
            <Box
            width="100%"
            float="left"
            height="75px"
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
            <Text>{props.content}</Text>
        </Box>
            </Box>
            <br/>
            </>
        ) : (
            <>
            <Box
                float="right"
                height="75px"
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
                    <Text>{props.content}</Text>
                </Box>
            </Box>
            <br/>
            </>
        )}

        </>
    );
};

export default ChatBubble;