import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    role: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // On initial load, check localStorage for an existing token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Optional: Check if token is expired
        if (decoded.exp * 1000 > Date.now()) {
          setAuth({
            token,
            role: decoded.role,
            isAuthenticated: true,
          });
        } else {
          // Token is expired
          localStorage.removeItem('token');
        }
      } catch (e) {
        // Invalid token
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Tries officer login, falls back to admin
    const tryLogin = async (role) => {
      const response = await fetch(`/api/auth/${role}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error(`Login failed for ${role}`);
      return response.json();
    };

    try {
      let data;
      let role;
      try {
        data = await tryLogin('officer');
        role = 'officer';
      } catch (officerError) {
        data = await tryLogin('admin');
        role = 'admin';
      }

      localStorage.setItem('token', data.token);
      setAuth({
        token: data.token,
        role: role,
        isAuthenticated: true,
      });
      // Redirect based on role using navigate
      if (role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      setAuth({ token: null, role: null, isAuthenticated: false });
      throw error; // Re-throw to be caught by the component
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ token: null, role: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 