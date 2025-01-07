// ColorModeSwitcher.tsx
import React from 'react';
import { useColorMode, Button } from '@chakra-ui/react';

export const ColorModeSwitcher: React.FC = () => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Button
            onClick={toggleColorMode}
            position="fixed"
            top="1rem"
            right="1rem"
            zIndex="overlay"
            colorScheme="teal"
        >
            {colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}
        </Button>
    );
};
