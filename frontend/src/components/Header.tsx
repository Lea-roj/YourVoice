import React, { useContext } from 'react';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import { publicRoutes, protectedRoutes } from '../routes';
import { UserContext } from '../userContext';
import {
    Box,
    Flex,
    Heading,
    HStack,
    Button,
    useColorMode,
    useColorModeValue,
    Icon,
} from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';

const Header: React.FC = () => {
    const { user } = useContext(UserContext); // Retrieve user state from context
    const { colorMode, toggleColorMode } = useColorMode();

    // Improved contrast for text and background
    const bg = useColorModeValue('gray.200', 'gray.800');
    const color = useColorModeValue('gray.900', 'gray.100');
    const linkColor = useColorModeValue('gray.700', 'gray.200');
    const linkHoverColor = useColorModeValue('teal.600', 'teal.300');

    // Define visible routes based on user login status
    const routesToShow = user
        ? protectedRoutes.filter(
            (route) =>
                route.visible && (!route.role || user.role === route.role)
        )
        : publicRoutes.filter((route) => route.visible);

    return (
        <Box bg={bg} color={color} p={4}>
            <Flex
                maxW="container.xl"
                mx="auto"
                align="center"
                justify="space-between"
            >
                {/* Logo Section */}
                <RouterLink to="/">
                    <Heading size="lg" color={linkColor}>
                        Your Voice
                    </Heading>
                </RouterLink>

                {/* Navigation Links */}
                <HStack as="nav" spacing={6}>
                    {routesToShow.map((route) => (
                        <NavLink
                            key={route.to}
                            to={route.to}
                            style={({ isActive }) => ({
                                color: isActive ? linkHoverColor : linkColor,
                                textDecoration: 'none',
                                fontWeight: isActive ? 'bold' : 'normal',
                            })}
                        >
                            {route.icon || route.name} {/* Render the icon or name */}
                        </NavLink>
                    ))}
                </HStack>

                {/* Dark Mode Toggle */}
                <Button
                    onClick={toggleColorMode}
                    size="sm"
                    colorScheme="blue"
                    leftIcon={<Icon as={colorMode === 'light' ? FaMoon : FaSun} />}
                >
                    {colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}
                </Button>
            </Flex>
        </Box>
    );
};

export default Header;
