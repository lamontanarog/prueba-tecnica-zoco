// components/ProfileSection.jsx
import React, { useState, useEffect } from 'react';
import { authHeader } from '../utils/AuthHeader';
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Typography,
  Alert
} from "@material-tailwind/react";

export const ProfileSection = () => {
  const [perfil, setPerfil] = useState(null);
  const [editando, setEditando] = useState(false);
  const [datosEditados, setDatosEditados] = useState({ name: '', email: '' });
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fetchPerfil = async () => {
    const res = await fetch('/api/profile', {
      headers: authHeader(),
    });
    const data = await res.json();
    setPerfil(data);
    setDatosEditados({ name: data.name, email: data.email });
  };

  const handleGuardar = async () => {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        ...authHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosEditados),
    });
    const actualizado = await res.json();
    try {
      if (datosEditados.name === '' || datosEditados.email === '') {
        setAlert({ type: 'error', message: 'Por favor, completa todos los campos', color: 'red' });
        return;
      }
      setPerfil(actualizado);
      setEditando(false);
      setAlert({ type: 'success', message: 'Perfil actualizado correctamente', color: 'green' });
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      setAlert({ type: 'error', message: 'Error al actualizar el perfil', color: 'red' });
    }
  };

  useEffect(() => {
    fetchPerfil();
  }, []);

  useEffect(() => {
    if (alert.message) {
      setTimeout(() => {
        setAlert({ type: '', message: '' });
      }, 1000);
    }
  }, [alert]);

  if (!perfil) return <p className="text-center text-gray-500">Cargando perfil...</p>;

  return (
    <>
      {alert.message && (
        <Alert
          className="fixed top-5 right-5 z-50 w-[90%] max-w-sm"
          color={alert.color}
          onClose={() => setAlert({ type: '', message: '' })}
        >
          {alert.message}
        </Alert>
      )}

      <section className="px-4 py-6 w-full">
        <Card className="w-full min-h-[300px] shadow-md rounded-2xl">
          <CardHeader floated={false} shadow={false} className="bg-blue-gray-50 p-4 rounded-t-2xl">
            <Typography variant="h5" color="blue-gray">
              Perfil de Usuario
            </Typography>
          </CardHeader>

          <CardBody className="p-4">
            {editando ? (
              <div className="flex flex-col gap-4">
                <Input
                  label="Nombre"
                  value={datosEditados.name}
                  onChange={(e) =>
                    setDatosEditados({ ...datosEditados, name: e.target.value })
                  }
                  required
                />
                <Input
                  label="Email"
                  value={datosEditados.email}
                  onChange={(e) =>
                    setDatosEditados({ ...datosEditados, email: e.target.value })
                  }
                  required
                />
                <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                  <Button color="green" onClick={handleGuardar}>
                    Guardar
                  </Button>
                  <Button color="gray" onClick={() => setEditando(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Typography variant="paragraph">
                  <strong>Nombre:</strong> {perfil.name}
                </Typography>
                <Typography variant="paragraph">
                  <strong>Email:</strong> {perfil.email}
                </Typography>
                <Typography variant="paragraph">
                  <strong>Rol:</strong> {perfil.role}
                </Typography>
                <div className="flex justify-end mt-4">
                  <Button onClick={() => setEditando(true)}>Editar</Button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </section>
    </>
  );

};
