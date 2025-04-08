import { Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

export const ProtectedRoute = ({ children, role: requiredRole }) => {
  const { isAuthenticated, role } = AuthProvider();

  if (!isAuthenticated) return <Navigate to="/" />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/dashboard" />;

  return children;
};
