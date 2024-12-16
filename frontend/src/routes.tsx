// routes.tsx
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Posts from './pages/Posts';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Statistika from './pages/Statistika';
import Sporocila from './pages/Sporocila';
// import Prijave from './pages/Prijave';
import Obvestila  from './pages/Obvestila';
import { FaBell } from 'react-icons/fa'; // Example: Importing an icon from react-icons

import PostDetail from './components/PostDetail';
import React, {ReactElement} from "react";
import {ReactNode} from "react"; // Dodaj import za PostDetail

export interface RouteType {
  name?: string;
  icon?: ReactNode;
  to: string;
  visible: boolean;
  element: ReactElement;
  role?: string;
}

export const publicRoutes: RouteType[] = [
  { name: 'Domov', to: '/', visible: true, element: <Home /> },
  { name: 'Prijava', to: '/login', visible: true, element: <Login /> },
  {
    name: 'Registracija',
    to: '/register',
    visible: true,
    element: <Register />,
  },
  { name: 'Objave', to: '/posts', visible: true, element: <Posts /> },
];

export const protectedRoutes: RouteType[] = [
  { name: 'Domov', to: '/', visible: true, element: <Home /> },
  { name: 'Objave', to: '/posts', visible: true, element: <Posts /> },
  { name: 'Profil', to: '/profile', visible: true, element: <Profile /> },
  { name: 'Statistika', to: '/statistika', visible: true, element: <Statistika /> },
  { name: 'Sporočila', to: '/sporocila', visible: true, element: <Sporocila /> },
  // { name: 'Prijave', to: '/prijave', visible: true, role: 'admin', element: <Prijave /> },
  { name: 'Odjava', to: '/logout', visible: true, element: <Logout /> },
  { icon: <FaBell />, to: '/obvestila', visible: true, element: <Obvestila /> },

];
