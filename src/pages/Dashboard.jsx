import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getAllUsers,
  createUser,
  updateUser,
  getEstudiosByUserId,
  getDireccionesByUserId,
  deleteUser,
  createEstudio,
  createDireccion,
} from '../api/api';
import '../styles/Dashboard.css';
import Modal from '../components/Modal'; // Asegúrate de crear este componente

export default function Dashboard() {
  const { user, role, token, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [selectedUser, setSelectedUser] = useState(null);
  const [estudios, setEstudios] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [updateEmail, setUpdateEmail] = useState('');
  const [updateRole, setUpdateRole] = useState('');

  useEffect(() => {
    if (role === 'admin') {
      const fetchUsers = async () => {
        try {
          const usersData = await getAllUsers(token);
          setUsers(usersData);
        } catch (err) {
          console.error(err);
          alert('Error al cargar los usuarios.');
        }
      };
      fetchUsers();
    }
  }, [role, token]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const existingUser = users.find((u) => u.email === newEmail);
      if (existingUser) {
        alert('Ya existe un usuario con ese correo.');
        return;
      }

      const newUser = {
        id: users.length + 1,
        email: newEmail,
        password: newPassword,
        role: newRole,
      };
      const created = await createUser(newUser, token);
      setUsers((prev) => [...prev, created]);
      setNewEmail('');
      setNewPassword('');
    } catch (error) {
      console.error(error);
      alert('Error al crear usuario.');
    }
  };

  const handleVerEstudios = async (userId) => {
    try {
      const data = await getEstudiosByUserId(userId, token);
      setSelectedUser(userId);
      setEstudios(data);
    } catch (err) {
      console.error(err);
      alert('Error al obtener estudios.');
    }
  };

  const handleVerDirecciones = async (userId) => {
    try {
      const data = await getDireccionesByUserId(userId, token);
      setSelectedUser(userId);
      setDirecciones(data);
    } catch (err) {
      console.error(err);
      alert('Error al obtener direcciones.');
    }
  };

  const handleCreateEstudio = async (userId, estudioData) => {
    try {
      const newEstudio = await createEstudio({ ...estudioData, userId }, token);
      setEstudios((prev) => [...prev, newEstudio]);
    } catch (err) {
      console.error(err);
      alert('Error al crear el estudio.');
    }
  };

  const handleCreateDireccion = async (userId, direccionData) => {
    try {
      const newDireccion = await createDireccion({ ...direccionData, userId }, token);
      setDirecciones((prev) => [...prev, newDireccion]);
    } catch (err) {
      console.error(err);
      alert('Error al crear la dirección.');
    }
  };

  const openUpdateModal = (user) => {
    setUserToUpdate(user);
    setUpdateEmail(user.email);
    setUpdateRole(user.role);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setUserToUpdate(null);
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleUpdateUser = async () => {
    if (!updateEmail || !updateRole) {
      alert('Debe ingresar un email y un rol válidos.');
      return;
    }

    try {
      const updatedUser = await updateUser(userToUpdate.id, { email: updateEmail, role: updateRole }, token);
      setUsers((prev) =>
        prev.map((user) => (user.id === userToUpdate.id ? { ...user, ...updatedUser } : user))
      );
      alert('Usuario actualizado correctamente.');
      closeUpdateModal();
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el usuario.');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(userToDelete.id, token);
      setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
      alert('Usuario eliminado correctamente.');
      closeDeleteModal();
    } catch (error) {
      console.error(error);
      alert('Error al eliminar el usuario.');
    }
  };

  if (role !== 'admin') {
    return <p>Acceso restringido. Solo para administradores.</p>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>👋 Bienvenido, {user?.email}</h2>
        <button onClick={logout}>Cerrar sesión</button>
      </header>

      <section className="dashboard-users">
        <h3>👥 Usuarios</h3>
        <ul>
          {users.map((u) => (
            <li key={u.id} className="user-card">
              <p><strong>Email:</strong> {u.email}</p>
              <p><strong>Rol:</strong> {u.role}</p>
              <div className="user-actions">
                <button onClick={() => handleVerEstudios(u.id)}>📘 Ver estudios</button>
                <button onClick={() => handleVerDirecciones(u.id)}>🏠 Ver direcciones</button>
                <button onClick={() => openUpdateModal(u)}>✏️ Actualizar</button>
                <button onClick={() => openDeleteModal(u)}>🗑️ Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {selectedUser && (
        <section className="dashboard-details">
          <h4>📘 Estudios del usuario {selectedUser}</h4>
          <ul>
            {estudios.map((e) => (
              <li key={e.id}>{e.titulo} - {e.institucion}</li>
            ))}
          </ul>

          <h4>🏠 Direcciones del usuario {selectedUser}</h4>
          <ul>
            {direcciones.map((d) => (
              <li key={d.id}>{d.calle} {d.numero}, {d.ciudad}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="dashboard-create-user">
        <h3>➕ Crear nuevo usuario</h3>
        <form onSubmit={handleCreateUser}>
          <input
            type="email"
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            <option value="user">Usuario</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Crear</button>
        </form>
      </section>

      <Modal isOpen={isUpdateModalOpen} onClose={closeUpdateModal}>
        <h3>Actualizar Usuario</h3>
        <input
          type="email"
          placeholder="Nuevo Email"
          value={updateEmail}
          onChange={(e) => setUpdateEmail(e.target.value)}
        />
        <select value={updateRole} onChange={(e) => setUpdateRole(e.target.value)}>
          <option value="user">Usuario</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={handleUpdateUser}>Actualizar</button>
        <button onClick={closeUpdateModal}>Cancelar</button>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <h3>Eliminar Usuario</h3>
        <p>¿Está seguro de que desea eliminar al usuario {userToDelete?.email}?</p>
        <button onClick={handleDeleteUser}>Eliminar</button>
        <button onClick={closeDeleteModal}>Cancelar</button>
      </Modal>
    </div>
  );
}