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
} from "@material-tailwind/react";

export const ProfileSection = () => {
  const [perfil, setPerfil] = useState(null);
  const [editando, setEditando] = useState(false);
  const [datosEditados, setDatosEditados] = useState({ name: '', email: '' });

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
    setPerfil(actualizado);
    setEditando(false);
  };

  useEffect(() => {
    fetchPerfil();
  }, []);

  if (!perfil) return <p className="text-center text-gray-500">Cargando perfil...</p>;

  return (
    <section className="container mx-auto px-4 py-6">
      <Card className="max-w-xl mx-auto">
        <CardHeader floated={false} shadow={false} className="bg-blue-gray-50 p-4">
          <Typography variant="h5" color="blue-gray">
            Perfil de Usuario
          </Typography>
        </CardHeader>
  
        <CardBody>
          {editando ? (
            <div className="flex flex-col gap-4">
              <Input
                label="Nombre"
                value={datosEditados.name}
                onChange={(e) =>
                  setDatosEditados({ ...datosEditados, name: e.target.value })
                }
              />
              <Input
                label="Email"
                value={datosEditados.email}
                onChange={(e) =>
                  setDatosEditados({ ...datosEditados, email: e.target.value })
                }
              />
              <div className="flex justify-end gap-2 mt-4">
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
  );
};
