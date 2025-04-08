// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { loginApi } from '../api/mockApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem('token') || null);
  const [role, setRole] = useState(sessionStorage.getItem('role') || null);

  const login = async ({ email, password }) => {
    const res = await loginApi({ email, password });
    setUser(res.user);
    setToken(res.token);
    setRole(res.user.role);
    sessionStorage.setItem('token', res.token);
    sessionStorage.setItem('user', JSON.stringify(res.user));
    sessionStorage.setItem('role', res.user.role);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.clear();
  };

  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, role }}>
      {children}
    </AuthContext.Provider>
  );
};
