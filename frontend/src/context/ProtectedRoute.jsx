import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from './AuthContext.jsx';

const ProtectedRoute = () => {
  const { auth, loading } = useContext(AuthContext);

  if (loading) return null; // Or render a spinner if desired

  return auth.isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute; 