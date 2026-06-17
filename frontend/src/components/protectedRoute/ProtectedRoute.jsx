import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../../utils/auth';

// Protege rutas que requieren un usuario autenticado (cualquier rol).
// Si no hay token válido, redirige al login.
const ProtectedRoute = ({ children }) => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
