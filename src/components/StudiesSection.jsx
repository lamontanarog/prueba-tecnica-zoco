// components/EstudiosSection.jsx
import React, { useState, useEffect } from 'react';
import { authHeader } from '../utils/AuthHeader';
import { useAuth } from '../context/AuthContext';

export const StudiesSection = () => {
  const [estudios, setEstudios] = useState([]);
  const {user} = useAuth();
  const [nuevoEstudio, setNuevoEstudio] = useState({nombre: '', inicio: 0, fin: 0, institucion: '' });
  const [editando, setEditando] = useState(null);

  const fetchEstudios = async () => {
    const res = await fetch('/api/studies', { headers: authHeader() });
    console.log({res})
    setEstudios(await res.json());
  };

  const handleAgregar = async () => {
    if (editando) {
        console.log("adasd",editando.id)
        console.log("adasd",nuevoEstudio)
      const res = await fetch(`/api/studies/${editando?.id}`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(nuevoEstudio),
      });
      const updated = await res.json();
      console.log({updated})
      setEstudios((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      setEditando(null);
    } else {
      const res = await fetch('/api/studies', {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(nuevoEstudio),
      });
      const newStudy = await res.json();
      setEstudios((prev) => [...prev, newStudy]);
    }
    console.log(user.id)
    const infoUser = {id: user.id, estudios: estudios};
    setNuevoEstudio({infoUser});
  };

  const handleEditar = (estudio) => {
    console.log("handleEditar",estudio);
    setEditando(estudio);
    setNuevoEstudio(estudio);
  };

  const handleEliminar = async (id) => {
    await fetch(`/api/studies/${id}`, {
      method: 'DELETE',
      headers: authHeader(),
    });
    setEstudios((prev) => prev.filter((e) => e.id !== id));
  };

  useEffect(() => {
    fetchEstudios();
  }, []);

  return (
    <section>
      <h2>Estudios</h2>
      <input name="nombre" placeholder="Nombre" value={nuevoEstudio.nombre} onChange={(e) => setNuevoEstudio({ ...nuevoEstudio, nombre: e.target.value })} />
      <input name="inicio" placeholder="Año inicio" value={nuevoEstudio.inicio} onChange={(e) => setNuevoEstudio({ ...nuevoEstudio, inicio: e.target.value })} />
      <input name="fin" placeholder="Año fin" value={nuevoEstudio.fin} onChange={(e) => setNuevoEstudio({ ...nuevoEstudio, fin: e.target.value })} />
      <input name="institucion" placeholder="Institución" value={nuevoEstudio.institucion} onChange={(e) => setNuevoEstudio({ ...nuevoEstudio, institucion: e.target.value })} />
      <button onClick={handleAgregar}>{editando ? 'Actualizar' : 'Agregar'}</button>

      <ul>
        {estudios.map((e) => (
          <li key={e.id}>
            {e.id} -{e.nombre} ({e.inicio} - {e.fin}) - {e.institucion}
            <button onClick={() => handleEditar(e)}>✏️</button>
            <button onClick={() => handleEliminar(e.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </section>
  );
};
