import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));  

  useEffect(() => {
    const handleTokenExpiry = () => {
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      if (tokenExpiry && new Date(tokenExpiry) < new Date()) {
        logout();
      }
    };

    handleTokenExpiry();
    const intervalId = setInterval(handleTokenExpiry, 60000); 

    return () => clearInterval(intervalId);
  }, []);

  const login = (userData, token, tokenExpiry) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiry', tokenExpiry);
    setUser(userData);
    setToken(token);  
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    setUser(null);
    setToken(null); 
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>  // Pass token here
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
