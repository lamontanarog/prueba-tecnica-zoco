import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, role: requiredRole }) => {
  // useContext(AuthContext)
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Navigate to="/" />;

  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === 'admin' ? "/dashboard" : "/profile"} />;
  }

  if(!requiredRole && !role) {
    return (
      <p>No tienes permisos para acceder a esta pagina.</p>
    )
  }

  return children;
};
