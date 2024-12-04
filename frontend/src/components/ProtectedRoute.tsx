import React from 'react';
import { Navigate } from 'react-router-dom';
import { User } from '../interfaces/User';

interface ProtectedRouteProps {
  user: User | null;
  element: React.ReactElement;
  isAdmin?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, element, isAdmin }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin && user.role !== isAdmin) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;
