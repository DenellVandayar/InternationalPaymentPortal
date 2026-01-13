import { createContext, useContext } from 'react';

// 1. Create the context
export const AuthContext = createContext(null);

// 2. Create the custom hook for consuming the context
export const useAuth = () => {
  return useContext(AuthContext);
};