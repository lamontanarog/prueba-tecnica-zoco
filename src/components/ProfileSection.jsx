// components/ProfileSection.jsx
import React, { useState, useEffect } from 'react';
import { authHeader } from '../utils/AuthHeader';

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

  if (!perfil) return <p>Cargando perfil...</p>;

  return (
    <section>
      <h2>Perfil de Usuario</h2>
      {editando ? (
        <>
          <input
            value={datosEditados.name}
            onChange={(e) => setDatosEditados({ ...datosEditados, name: e.target.value })}
            placeholder="Nombre"
          />
          <input
            value={datosEditados.email}
            onChange={(e) => setDatosEditados({ ...datosEditados, email: e.target.value })}
            placeholder="Email"
          />
          <button onClick={handleGuardar}>Guardar</button>
          <button onClick={() => setEditando(false)}>Cancelar</button>
        </>
      ) : (
        <>
          <p><strong>Nombre:</strong> {perfil.name}</p>
          <p><strong>Email:</strong> {perfil.email}</p>
          <p><strong>Rol:</strong> {perfil.role}</p>
          <button onClick={() => setEditando(true)}>Editar</button>
        </>
      )}
    </section>
  );
};
