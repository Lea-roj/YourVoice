import {
    Box,
    Button,
    Heading,
    Stack,
    Text,
    Icon,
    useColorModeValue,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faComments,
    faUsers,
    faSearch,
    faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const LearnMore: React.FC = () => {
    // Theme-aware colors
    const bgMain = useColorModeValue('white', 'gray.800');
    const bgHero = useColorModeValue('blue.100', 'blue.900');
    const headingColor = useColorModeValue('blue.800', 'blue.300');
    const textColor = useColorModeValue('gray.700', 'gray.300');
    const featureIconColor = useColorModeValue('blue.500', 'blue.300');
    const testimonialBg = useColorModeValue('white', 'gray.700');
    const testimonialTextColor = useColorModeValue('gray.700', 'gray.200');
    const testimonialNameColor = useColorModeValue('blue.600', 'blue.400');

    return (
        <Box p={6} bg={bgMain}>
            {/* Hero Section */}
            <Box bg={bgHero} py={10} textAlign="center">
                <Heading as="h1" size="2xl" mb={4} color={headingColor}>
                    Odkrijte forum YourVoice
                </Heading>
                <Text fontSize="lg" color={textColor} maxW="container.md" mx="auto">
                    YourVoice je več kot samo forum – je skupnost, kjer ideje oživijo,
                    glasovi so slišani in nastajajo smiselne povezave.
                </Text>
            </Box>

            {/* Features Section */}
            <Box mt={12} textAlign="center">
                <Heading as="h2" size="xl" mb={8}>
                    Zakaj izbrati YourVoice?
                </Heading>
                <Stack
                    direction={{ base: 'column', md: 'row' }}
                    spacing={10}
                    justify="center"
                >
                    <Box textAlign="center" maxW="300px">
                        <Icon
                            as={FontAwesomeIcon}
                            icon={faComments}
                            boxSize={16}
                            color={featureIconColor}
                            mb={4}
                        />
                        <Text fontWeight="bold" fontSize="lg" mb={2}>
                            Interaktivne razprave
                        </Text>
                        <Text color={textColor}>
                            Sodelujte v živahnih razpravah, delite svoje ideje in sodelujte z
                            osebami s podobnimi interesi.
                        </Text>
                    </Box>
                    <Box textAlign="center" maxW="300px">
                        <Icon
                            as={FontAwesomeIcon}
                            icon={faUsers}
                            boxSize={16}
                            color={featureIconColor}
                            mb={4}
                        />
                        <Text fontWeight="bold" fontSize="lg" mb={2}>
                            Močna skupnost
                        </Text>
                        <Text color={textColor}>
                            Ustvarite trajne povezave z podporno in aktivno skupnostjo
                            uporabnikov.
                        </Text>
                    </Box>
                    <Box textAlign="center" maxW="300px">
                        <Icon
                            as={FontAwesomeIcon}
                            icon={faSearch}
                            boxSize={16}
                            color={featureIconColor}
                            mb={4}
                        />
                        <Text fontWeight="bold" fontSize="lg" mb={2}>
                            Napredna orodja
                        </Text>
                        <Text color={textColor}>
                            Uporabite napredno iskanje in filtre, da najdete vsebine, ki so
                            vam najbolj pomembne.
                        </Text>
                    </Box>
                    <Box textAlign="center" maxW="300px">
                        <Icon
                            as={FontAwesomeIcon}
                            icon={faShieldAlt}
                            boxSize={16}
                            color={featureIconColor}
                            mb={4}
                        />
                        <Text fontWeight="bold" fontSize="lg" mb={2}>
                            Varno in zaupanja vredno
                        </Text>
                        <Text color={textColor}>
                            Vaši podatki in razprave so zaščiteni z vrhunskimi varnostnimi
                            ukrepi.
                        </Text>
                    </Box>
                </Stack>
            </Box>

            {/* Testimonials Section */}
            <Box mt={16} textAlign="center">
                <Heading as="h2" size="xl" mb={8}>
                    Kaj pravijo naši uporabniki?
                </Heading>
                <Stack
                    direction={{ base: 'column', md: 'row' }}
                    spacing={8}
                    justify="center"
                >
                    <Box
                        p={6}
                        bg={testimonialBg}
                        color={testimonialTextColor}
                        shadow="md"
                        borderRadius="lg"
                        maxW="400px"
                        textAlign="left"
                    >
                        <Text mb={4}>
                            "YourVoice je popolnoma spremenil način, kako se povezujem z
                            drugimi prek spleta. Orodja so izjemna, skupnost pa zelo
                            gostoljubna!"
                        </Text>
                        <Text fontWeight="bold" color={testimonialNameColor}>
                            - Janez Novak
                        </Text>
                    </Box>
                    <Box
                        p={6}
                        bg={testimonialBg}
                        color={testimonialTextColor}
                        shadow="md"
                        borderRadius="lg"
                        maxW="400px"
                        textAlign="left"
                    >
                        <Text mb={4}>
                            "Obožujem napredne funkcije iskanja in kako enostavno je najti
                            relevantne razprave. Zelo priporočam!"
                        </Text>
                        <Text fontWeight="bold" color={testimonialNameColor}>
                            - Ana Horvat
                        </Text>
                    </Box>
                </Stack>
            </Box>

            {/* Call-to-Action Section */}
            <Box mt={16} textAlign="center" py={10}>
                <Button
                    as={RouterLink}
                    to="/posts"
                    size="lg"
                    colorScheme="blue"
                    px={150}
                >
                    Pridruži se zdaj
                </Button>
            </Box>
        </Box>
    );
};

export default LearnMore;
