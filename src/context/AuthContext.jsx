// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginApi } from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [role, setRole] = useState('');

  const isAuthenticated = !!token;

  const decodedToken = (token) => {
    const [id, role] = atob(token).split('-');
    return { id, role };
  }

  useEffect(() => {
    if (token){
      const {role} = decodedToken(token);
      setRole(role);
    }
  }, [token]);

  const login = async ({ email, password }) => {
   try {
    const res = await loginApi({ email, password });
    setUser(res.user);
    setToken(res.token);
    setRole(res.user.role);
    
    // Guardar en sessionStorage
    sessionStorage.setItem('user', JSON.stringify(res.user));
    sessionStorage.setItem('token', res.token);
    sessionStorage.setItem('role', res.user.role); // Guardar el rol
    
   } catch (error) {
    alert('Error al iniciar sesion'+ error.message);
   }
  };

  const logout = () => {
    setUser('');
    setToken('');
    sessionStorage.clear();
    localStorage.clear();
  };

  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    const savedToken = sessionStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, role, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if(!context){
    throw new Error ('UseAuth debe ser usado dentro de un authProvider')
  }
  return context;
}