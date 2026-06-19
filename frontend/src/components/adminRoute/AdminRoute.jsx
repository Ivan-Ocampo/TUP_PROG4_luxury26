import React from 'react';
import { Navigate } from 'react-router-dom';
// Importamos utilidad
import { getUserRolFromToken, getToken } from '../../utils/auth';

const AdminRoute = ({ children }) => {
  const token = getToken();

  // 1. Si no hay token, al login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // 2. Usamos función 
  const rol = getUserRolFromToken();
  
  // 3. Chequeamos si es administrador
  if (rol === 'administrador') {
    return children;
  } else {
    // Si no es admin (o el token era inválido y devolvió null), vuelve al inicio
    return <Navigate to="/" />;
  }
};

export default AdminRoute;