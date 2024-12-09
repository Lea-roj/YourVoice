import React, { useEffect, useState } from 'react';
import { Box, Button, Text, VStack, Spinner } from '@chakra-ui/react';
import {Post} from "../interfaces/Post";

const Prijave: React.FC = () => {
    const [reportedPosts, setReportedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3000/reported-posts')
            .then((response) => {
                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Fetched reported posts:', data);
                setReportedPosts(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching reported posts:', error);
                setLoading(false);
            });
    }, []);




    const handleDeletePost = (postId: string) => {
        fetch(`http://localhost:3000/post/${postId}`, {
            method: 'DELETE',
        })
            .then(() => {
                setReportedPosts((prevPosts) =>
                    prevPosts.filter((post) => post._id !== postId)
                );
            })
            .catch((error) => {
                console.error('Napaka pri brisanju objave:', error);
            });
    };

    const handleDismissReport = (postId: string) => {
        fetch(`http://localhost:3000/post/${postId}/dismiss-report`, {
            method: 'POST',
        })
            .then(() => {
                setReportedPosts((prevPosts) =>
                    prevPosts.filter((post) => post._id !== postId)
                );
            })
            .catch((error) => {
                console.error('Napaka pri zavrnitvi prijave:', error);
            });
    };

    if (loading) {
        return <Spinner size="xl" />;
    }

    return (
        <Box p={8} maxW="container.md" mx="auto">
            <VStack spacing={4} align="stretch">
                {reportedPosts && reportedPosts.length > 0 ? (
                    reportedPosts.map((post) => (
                        <Box key={post._id} p={4} borderWidth="1px" borderRadius="md">
                            <Text fontWeight="bold" fontSize="lg">{post.title}</Text>
                            <Text>{post.content}</Text>
                            <Button colorScheme="red" mt={2} onClick={() => handleDeletePost(post._id)}>
                                Izbriši objavo
                            </Button>
                            <Button colorScheme="yellow" mt={2} ml={3} onClick={() => handleDismissReport(post._id)}>
                                Zavrni prijavo
                            </Button>
                        </Box>
                    ))
                ) : (
                    <Text color="gray.500">Ni prijavljenih objav.</Text>
                )}
            </VStack>

        </Box>
    );
};

export default Prijave;
