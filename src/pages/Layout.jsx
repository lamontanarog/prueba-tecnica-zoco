import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Typography, Button } from '@material-tailwind/react';

function Layout() {
  const { isAuthenticated, logout, user } = useAuth();

  const checkAuth = () => {
    if (!isAuthenticated) {
      return (
        <div className="p-3">
          <Typography variant="h2" color="blue-gray">
            Inicia sesión para acceder a la plataforma
          </Typography>
        </div>
      );
    }
    return (
      <div className="flex justify-between items-center mb-6 p-6">
        <Typography variant="h2">Dashboard de {user.name}</Typography>
        <Button onClick={logout}>Logout</Button>
      </div>
    );
  };

  return checkAuth();
}

export default Layout;
