import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Image,
  Stack,
  Text,
  Flex,
  Icon,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDoorOpen,
  faComments,
  faUsers,
  faSearch,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Link as RouterLink } from 'react-router-dom';
import { Post } from '../interfaces/Post';
import PostCard from './PostCard';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Theme-aware colors
  const bg = useColorModeValue('white', 'gray.800');
  const color = useColorModeValue('gray.800', 'gray.200');
  const headingColor = useColorModeValue('blue.800', 'blue.300');
  const featureIconColor = useColorModeValue('blue.500', 'blue.300');
  const featureTextColor = useColorModeValue('gray.700', 'gray.300');

  const loadPosts = () => {
    setLoading(true);
    fetch('http://localhost:3000/post')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          setPosts(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Napaka pri pridobivanju objav:', error);
          setLoading(false);
        });
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const topLikedPosts = posts
      .slice()
      .sort((a, b) => b.upvotes - a.upvotes)
      .slice(0, 3);

  return (
      <Box bg={bg} color={color} p={6}>
        <Box flex={1} textAlign={{ base: 'center' }} px={4}>
          <Heading as="h1" size="2xl" mb={4} color={headingColor}>
            Dobrodošli na YourVoice Forumu
          </Heading>
        </Box>

        <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={8}
            align="center"
            justify="space-between"
            maxW="container.xl"
            mx="auto"
        >
          {/* Left Column */}
          <Box flex={1} textAlign={{ base: 'center', md: 'center' }} px={4}>
            <Text fontSize="lg" color={featureTextColor} mb={6}>
              YourVoice je interaktivni forum, zasnovan za izmenjavo informacij in
              povezovanje uporabnikov. Aplikacija omogoča prijavljenim
              uporabnikom, da objavljajo svoje vsebine, komentirajo, ocenjujejo
              objave drugih ter urejajo svoj profil. Prijavljeni uporabniki lahko
              tudi aktivno sodelujejo pri predlogih in ocenjevanju izboljšav
              spletnega foruma. Neprijavljeni uporabniki lahko brskajo po objavah,
              vendar brez možnosti interakcije. Napredne funkcionalnosti
              vključujejo filtriranje in sortiranje objav, napredno iskanje ter
              ostale možnosti. Aplikacija vključuje tudi posebne funkcionalnosti
              ter pravice za moderatorje in administratorje. Za razvoj je
              uporabljen MERN sklad.
            </Text>

            <Flex justify="center" mt={8}>
              <Button
                  as={RouterLink}
                  to="/posts"
                  size="lg"
                  colorScheme="blue"
                  rounded="full"
                  px={6}
                  rightIcon={<FontAwesomeIcon icon={faDoorOpen} />}
                  _hover={{ bg: 'blue.400' }}
                  mr={4}
              >
                Vstopi
              </Button>
              <Button
                  as={RouterLink}
                  to="/about"
                  size="lg"
                  colorScheme="gray"
                  rounded="full"
                  px={6}
                  _hover={{ bg: 'gray.200' }}
              >
                Izvedi več
              </Button>
            </Flex>
          </Box>

          {/* Right Column */}
          <Box flex={1} display="flex" justifyContent="center">
            <Image
                src="images/default.png"
                alt="YourVoice logo"
                boxSize="100%"
                maxW="500px"
                borderRadius="lg"
            />
          </Box>
        </Stack>

        {/* Features Section */}
        <Box mt={12} textAlign="center">
          <Heading as="h2" size="xl" mb={10} color={headingColor}>
            Zakaj smo prava izbira?
          </Heading>
          <Stack
              direction={{ base: 'column', md: 'row' }}
              spacing={10}
              justify="center"
          >
            <Box textAlign="center">
              <Icon
                  as={FontAwesomeIcon}
                  icon={faComments}
                  boxSize={16}
                  color={featureIconColor}
                  mb={4}
              />
              <Text fontWeight="bold" fontSize="lg" color={featureTextColor}>
                Interaktivne razprave
              </Text>
            </Box>
            <Box textAlign="center">
              <Icon
                  as={FontAwesomeIcon}
                  icon={faUsers}
                  boxSize={16}
                  color={featureIconColor}
                  mb={4}
              />
              <Text fontWeight="bold" fontSize="lg" color={featureTextColor}>
                Močna skupnost
              </Text>
            </Box>
            <Box textAlign="center">
              <Icon
                  as={FontAwesomeIcon}
                  icon={faSearch}
                  boxSize={16}
                  color={featureIconColor}
                  mb={4}
              />
              <Text fontWeight="bold" fontSize="lg" color={featureTextColor}>
                Napredna orodja
              </Text>
            </Box>
            <Box textAlign="center">
              <Icon
                  as={FontAwesomeIcon}
                  icon={faShieldAlt}
                  boxSize={16}
                  color={featureIconColor}
                  mb={4}
              />
              <Text fontWeight="bold" fontSize="lg" color={featureTextColor}>
                Varno in zaupanja vredno
              </Text>
            </Box>
          </Stack>
        </Box>

        <Box mt={12}>
          <Heading as="h2" size="xl" mb={10} textAlign="center" color={headingColor}>
            Najbolj popularne objave
          </Heading>
          {loading ? (
              <Spinner size="xl" />
          ) : topLikedPosts.length === 0 ? (
              <Text fontSize="lg" color={featureTextColor} textAlign="center" mt={8}>
                Trenutno ni nobenih objav.
              </Text>
          ) : (
              <Flex justify="center" gap={6} wrap="wrap">
                {topLikedPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                ))}
              </Flex>
          )}
        </Box>
      </Box>
  );
};

export default Home;
