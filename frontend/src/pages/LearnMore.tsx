import {
    Box,
    Button,
    Heading,
    Stack,
    Text,
    Icon,
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
    return (
        <Box p={6} bg="gray.50">
            <Box bg="blue.100" py={10} textAlign="center">
                <Heading as="h1" size="2xl" mb={4} color="blue.800">
                    Odkrijte forum YourVoice
                </Heading>
                <Text fontSize="lg" color="gray.700" maxW="container.md" mx="auto">
                    YourVoice je več kot samo forum – je skupnost, kjer ideje oživijo, glasovi so slišani in nastajajo smiselne povezave.
                </Text>
            </Box>

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
                        <Icon as={FontAwesomeIcon} icon={faComments} boxSize={16} color="blue.500" mb={4} />
                        <Text fontWeight="bold" fontSize="lg" mb={2}>
                            Interaktivne razprave
                        </Text>
                        <Text color="gray.600">
                            Sodelujte v živahnih razpravah, delite svoje ideje in sodelujte z osebami s podobnimi interesi.
                        </Text>
                    </Box>
                    <Box textAlign="center" maxW="300px">
                        <Icon as={FontAwesomeIcon} icon={faUsers} boxSize={16} color="blue.500" mb={4} />
                        <Text fontWeight="bold" fontSize="lg" mb={2}>
                            Močna skupnost
                        </Text>
                        <Text color="gray.600">
                            Ustvarite trajne povezave z podporno in aktivno skupnostjo uporabnikov.
                        </Text>
                    </Box>
                    <Box textAlign="center" maxW="300px">
                        <Icon as={FontAwesomeIcon} icon={faSearch} boxSize={16} color="blue.500" mb={4} />
                        <Text fontWeight="bold" fontSize="lg" mb={2}>
                            Napredna orodja
                        </Text>
                        <Text color="gray.600">
                            Uporabite napredno iskanje in filtre, da najdete vsebine, ki so vam najbolj pomembne.
                        </Text>
                    </Box>
                    <Box textAlign="center" maxW="300px">
                        <Icon as={FontAwesomeIcon} icon={faShieldAlt} boxSize={16} color="blue.500" mb={4} />
                        <Text fontWeight="bold" fontSize="lg" mb={2}>
                            Varno in zaupanja vredno
                        </Text>
                        <Text color="gray.600">
                            Vaši podatki in razprave so zaščiteni z vrhunskimi varnostnimi ukrepi.
                        </Text>
                    </Box>
                </Stack>
            </Box>

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
                        bg="white"
                        shadow="md"
                        borderRadius="lg"
                        maxW="400px"
                        textAlign="left"
                    >
                        <Text color="gray.700" mb={4}>
                            "YourVoice je popolnoma spremenil način, kako se povezujem z drugimi prek spleta. Orodja so izjemna, skupnost pa zelo gostoljubna!"
                        </Text>
                        <Text fontWeight="bold" color="blue.600">
                            - Janez Novak
                        </Text>
                    </Box>
                    <Box
                        p={6}
                        bg="white"
                        shadow="md"
                        borderRadius="lg"
                        maxW="400px"
                        textAlign="left"
                    >
                        <Text color="gray.700" mb={4}>
                            "Obožujem napredne funkcije iskanja in kako enostavno je najti relevantne razprave. Zelo priporočam!"
                        </Text>
                        <Text fontWeight="bold" color="blue.600">
                            - Ana Horvat
                        </Text>
                    </Box>
                </Stack>
            </Box>

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
