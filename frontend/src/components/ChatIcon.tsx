import {Box, Button, Flex, Text} from '@chakra-ui/react';

// @ts-ignore
const ChatIcon = (props) => {
        const handleClick = () => {
            // Handle the button click here, e.g.,
            console.log("Button clicked!");
        };
    console.log(props);
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