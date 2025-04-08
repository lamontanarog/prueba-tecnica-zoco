import { useEffect, useState } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { getAllUsers, createUser } from '../api/mockApi';

export default function Dashboard() {
  const { user, role, token, logout } = AuthProvider();
  const [users, setUsers] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('user');

  useEffect(() => {
    if (role === 'admin') {
        console.log(token);
        console.log(getAllUsers(token));
      getAllUsers(token)?.then(setUsers)?.catch(console.error);
    }
  }, [role, token]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const newUser = {
      email: newEmail,
      password: newPassword,
      role: newRole
    };
    const created = await createUser(newUser, token);
    setUsers((prev) => [...prev, created]);
    setNewEmail('');
    setNewPassword('');
  };

  if (role !== 'admin') {
    return <p>Acceso restringido</p>;
  }

  return (
    <div>
      <h2>Bienvenido, {user.email}</h2>
      <button onClick={logout}>Cerrar sesión</button>

      <h3>👥 Lista de usuarios</h3>
      <ul>
        {users?.map((u) => (
          <li key={u?.id}>
            {u?.email} - Rol: {u?.role}
            {/* Aquí podrías poner botones para ver/editar estudios o direcciones */}
          </li>
        ))}
      </ul>

      <h3>➕ Crear nuevo usuario</h3>
      <form onSubmit={handleCreateUser}>
        <input
          type="email"
          placeholder="Email"
          value={newEmail}
          onChange={e => setNewEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <select value={newRole} onChange={e => setNewRole(e.target.value)}>
          <option value="user">Usuario</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Crear</button>
      </form>
    </div>
  );
}
