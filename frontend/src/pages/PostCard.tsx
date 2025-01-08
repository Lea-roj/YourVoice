import React from 'react';
import { Box, Heading, Text, Button, Flex, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const PostCard: React.FC<{ post: any }> = ({ post }) => {
    const stripHtmlTags = (html: string): string => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    };

    const formatDate = (date: string): string => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return new Date(date).toLocaleDateString('sl-SI', options);
    };

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i}>
          {i <= rating ? (
              <AiFillStar color="#FFD700" size={20} />
          ) : (
              <AiOutlineStar color="#D3D3D3" size={20} />
          )}
        </span>
            );
        }
        return stars;
    };

    const calculateRating = (upvotes: number, downvotes: number): number => {
        const total = upvotes + downvotes;
        if (total === 0) return 0;
        return Math.round((upvotes / total) * 5);
    };

    // Theme-aware colors
    const cardBg = useColorModeValue('white', 'gray.700');
    const frontBg = useColorModeValue('gray.100', 'gray.700');
    const backBg = useColorModeValue('blue.50', 'blue.800');
    const textColor = useColorModeValue('gray.800', 'gray.200');
    const subTextColor = useColorModeValue('gray.600', 'gray.400');

    return (
        <Box
            width="300px"
            height="200px"
            borderRadius="md"
            overflow="hidden"
            bg={cardBg}
            color={textColor}
            sx={{
                perspective: '1000px',
            }}
        >
            <Box
                position="relative"
                width="100%"
                height="100%"
                sx={{
                    transformStyle: 'preserve-3d',
                }}
                transition="transform 0.6s"
                _hover={{
                    transform: 'rotateY(180deg)',
                }}
            >
                {/* Front of the Card */}
                <Box
                    position="absolute"
                    width="100%"
                    height="100%"
                    sx={{
                        backfaceVisibility: 'hidden',
                    }}
                    bg={frontBg}
                    p={4}
                    boxShadow="md"
                    borderRadius="md"
                >
                    <Heading fontSize="lg">{post.title}</Heading>
                    <Text mt={2} fontSize="sm" color={subTextColor}>
                        Kategorija: {post.category}
                    </Text>
                    <Text mt={2} fontSize="sm" color={subTextColor}>
                        Avtor: {post.userId?.username || 'Neznan uporabnik'}
                    </Text>
                    <Text mt={2} fontSize="sm" color={subTextColor}>
                        Datum: {formatDate(post.createdAt)}
                    </Text>
                    <Box mt={2} display="flex" alignItems="center">
                        <Text fontSize="sm" mr={2}>
                            Ocena:
                        </Text>
                        {renderStars(calculateRating(post.upvotes, post.downvotes))}
                    </Box>
                </Box>

                {/* Back of the Card */}
                <Box
                    position="absolute"
                    width="100%"
                    height="100%"
                    bg={backBg}
                    p={4}
                    boxShadow="md"
                    borderRadius="md"
                    sx={{
                        backfaceVisibility: 'hidden',
                    }}
                    transform="rotateY(180deg)"
                >
                    <Heading fontSize="md" mb={2}>
                        Vsebina objave
                    </Heading>
                    <Text noOfLines={4} fontSize="sm" color={textColor} mb={4}>
                        {stripHtmlTags(post.content)}
                    </Text>
                    <Text fontSize="sm" color={subTextColor} mb={2}>
                        Komentarji: {post.comments?.length || 0}
                    </Text>
                    <Flex justify="center" mt={8}>
                        <RouterLink to={`/posts/${post._id}`}>
                            <Button size="sm" colorScheme="blue">
                                Preberi več
                            </Button>
                        </RouterLink>
                    </Flex>
                </Box>
            </Box>
        </Box>
    );
};

export default PostCard;
