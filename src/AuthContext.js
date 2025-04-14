import React, { createContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from './api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const logout = useCallback(() => {
    sessionStorage.clear();
    navigate('/');
  }, [navigate]);

  authService.logout = logout;

  return (
    <AuthContext.Provider value={{ logout }}>
      {children}
    </AuthContext.Provider>
  );
};
