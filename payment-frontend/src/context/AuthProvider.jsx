import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

// A helper function to parse the JWT payload
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
  console.error("Failed to parse token:", e);
  return null;
}
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null); // New state for user info
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decodedUser = parseJwt(token);
      setUser(decodedUser.user); // The payload is nested in a 'user' object
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    const decodedUser = parseJwt(newToken);
    if (decodedUser.user.role === 'employee') {
      navigate('/employee-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  // Provide the user object along with the token and functions
  const value = { token, user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};