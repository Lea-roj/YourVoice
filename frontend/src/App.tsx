// App.tsx
import React, { Dispatch, SetStateAction, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { publicRoutes, protectedRoutes } from './routes';
import { User } from './interfaces/User';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import { UserContext } from './userContext';
import Home from './pages/Home'; // Potrdite pravilno pot
import Posts from './pages/Posts'; // Dodajte direktni import za Posts
import LearnMore from "./pages/LearnMore";
import PostDetail from './components/PostDetail';
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { ColorModeSwitcher } from './components/ColorModeSwitcher'; // A toggle button for color mode
import { ChatContextProvider } from './contexts/ChatContext';

// Chakra UI theme setup
const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

function App() {
  const [chatId, setChatId] = useState('');
  const [user, setUser] = useState<User | null>(
    localStorage.user ? JSON.parse(localStorage.user) : null
  );

  const updateUserData: Dispatch<SetStateAction<User | null>> = (userInfo) => {
    if (typeof userInfo === 'function') {
      const updatedUser = userInfo(user);
      if (updatedUser) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        localStorage.removeItem('user');
      }
      setUser(updatedUser);
    } else {
      if (userInfo) {
        localStorage.setItem('user', JSON.stringify(userInfo));
      } else {
        localStorage.removeItem('user');
      }
      setUser(userInfo);
    }
  };

  return (
      <ChatContextProvider>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <BrowserRouter>
          <UserContext.Provider value={{ user, setUserContext: updateUserData }}>
            <Header />
            <main className="container" style={{ paddingBottom: 100 }}>
              <Routes>
                {/* Stran Home je vedno dostopna */}
                <Route path="/" element={<Home />} />

                {/* Javni Routes - stran Objave vključena za vse */}
                <Route path="/posts" element={<Posts />} />
                <Route path="/posts/:id" element={<PostDetail />} />
                <Route path="/about" element={<LearnMore />} />
                {publicRoutes
                    .filter((route) => route.to !== '/' && route.to !== '/posts') // Home in Objave izvzeti
                    .map((route) => (
                        <Route
                            key={route.to}
                            path={route.to}
                            element={user ? <Navigate to="/" replace /> : route.element}
                        />
                    ))}

                {/* Zaščiteni Routes - samo za prijavljene */}
                {protectedRoutes.map((route) => (
                    <Route
                        key={route.to}
                        path={route.to}
                        element={<ProtectedRoute
                            user={user}
                            element={route.element}
                            isAdmin={route.role}
                        />}
                    />
                ))}
              </Routes>
            </main>
          </UserContext.Provider>
          <Footer />
        </BrowserRouter>
      </ChakraProvider>
      </ChatContextProvider>
  );
}

export default App;
