import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllUsers } from '../api/api';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (token) {
          const data = await getAllUsers(token);
          setUsers(data);
        }
      } catch (error) {
        console.error('Error al cargar los usuarios:', error);
        alert('Error al cargar los usuarios.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Panel de Administración</h1>
        <Link to="/users/new" className="btn btn-primary">
          ➕ Crear Nuevo Usuario
        </Link>
      </header>

      <section className="dashboard-summary">
        <div className="card">
          <h3>Total de Usuarios</h3>
          <p className="count">{users.length}</p>
          <p>
            {users.filter((user) => user.role === 'admin').length} Admins,{' '}
            {users.filter((user) => user.role === 'user').length} Usuarios
          </p>
        </div>
      </section>

      <section className="dashboard-users">
        <h2>Usuarios</h2>
        <div className="user-grid">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <h3>{user.name || 'Sin Nombre'}</h3>
              <p>{user.email}</p>
              <p className="role">{user.role}</p>
              <div className="actions">
                <Link to={`/users/${user.id}`} className="btn btn-outline">
                  Ver
                </Link>
                <Link to={`/studies?userId=${user.id}`} className="btn btn-ghost">
                  Estudios
                </Link>
                <Link to={`/addresses?userId=${user.id}`} className="btn btn-ghost">
                  Direcciones
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
