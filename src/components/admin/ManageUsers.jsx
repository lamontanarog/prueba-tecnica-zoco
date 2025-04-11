import React, { useEffect, useState } from 'react';
import {
  Input,
  Button,
  Select,
  Option,
  Card,
  CardBody,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { authHeader } from '../../utils/AuthHeader';
import { useNavigate } from 'react-router-dom';

export const ManageUsers = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [editData, setEditData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchUsuarios = async () => {
    const res = await fetch('/api/users', {
      headers: authHeader(),
    });

    if (!res.ok) {
      setError('No autorizado o error al cargar usuarios');
      return;
    }

    const data = await res.json();
    setUsuarios(data);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleCrearUsuario = async () => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        ...authHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoUsuario),
    });

    if (!res.ok) {
      setError('Error al crear usuario');
      return;
    }

    const creado = await res.json();
    setUsuarios((prev) => [...prev, creado]);
    setNuevoUsuario({ name: '', email: '', password: '', role: 'user' });
  };

  const handleSelectUserToEdit = (user) => {
    setEditData({
      id: user.id,
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
  };

  const handleConfirmEditUser = async () => {
    const res = await fetch(`/api/users/${editData.id}`, {
      method: 'PUT',
      headers: {
        ...authHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editData),
    });

    if (!res.ok) {
      setError('Error al editar usuario');
      return;
    }

    setEditData(null);
    setError('');
    fetchUsuarios();
  };

  const handleDeleteUser = async (id) => {
    const res = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: authHeader(),
    });

    if (!res.ok) {
      setError('Error al eliminar usuario');
      return;
    }

    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  const handleVerInformacionAdicional = (id) => {
    navigate(`/users/${id}`);
  };

  return (
    <section className="p-6 max-w-6xl mx-auto">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Panel de Administración de Usuarios
      </Typography>

      {error && (
        <Typography color="red" className="mb-4">
          {error}
        </Typography>
      )}

      <Card className="mb-6 p-4">
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h5">
            {editData ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre"
              value={editData ? editData.name : nuevoUsuario.name}
              onChange={(e) =>
                editData
                  ? setEditData({ ...editData, name: e.target.value })
                  : setNuevoUsuario({ ...nuevoUsuario, name: e.target.value })
              }
            />
            <Input
              label="Email"
              type="email"
              value={editData ? editData.email : nuevoUsuario.email}
              onChange={(e) =>
                editData
                  ? setEditData({ ...editData, email: e.target.value })
                  : setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })
              }
            />
            <Input
              label="Contraseña"
              type="password"
              value={editData ? editData.password : nuevoUsuario.password}
              onChange={(e) =>
                editData
                  ? setEditData({ ...editData, password: e.target.value })
                  : setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
              }
            />
            <Select
              label="Rol"
              value={editData ? editData.role : nuevoUsuario.role}
              onChange={(val) =>
                editData
                  ? setEditData({ ...editData, role: val })
                  : setNuevoUsuario({ ...nuevoUsuario, role: val })
              }
            >
              <Option value="user">Usuario</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </div>

          <div className="flex gap-4 mt-4">
            {editData ? (
              <>
                <Button onClick={handleConfirmEditUser}>Guardar cambios</Button>
                <Button variant="outlined" onClick={() => setEditData(null)}>
                  Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={handleCrearUsuario}>Crear</Button>
            )}
          </div>
        </CardBody>
      </Card>

      <Typography variant="h5" className="mb-4">Usuarios existentes</Typography>

      <div className="overflow-x-auto">
        <table className="w-full text-left table-auto border rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Nombre</th>
              <th className="p-4">Email</th>
              <th className="p-4">Rol</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="p-4">{u.id}</td>
                <td className="p-4">{u.name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4 capitalize">{u.role}</td>
                <td className="p-4 flex gap-2">
                  <IconButton
                    variant="text"
                    onClick={() => handleSelectUserToEdit(u)}
                  >
                    <PencilIcon className="h-5 w-5 text-blue-600" />
                  </IconButton>
                  <IconButton
                    variant="text"
                    onClick={() => handleDeleteUser(u.id)}
                  >
                    <TrashIcon className="h-5 w-5 text-red-500" />
                  </IconButton>
                  <IconButton
                    variant="text"
                    onClick={() => handleVerInformacionAdicional(u.id)}
                  >
                    <EyeIcon className="h-5 w-5 text-green-600" />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
