import React, { useEffect, useState } from 'react';
import { authHeader } from '../utils/AuthHeader';
import { useAuth } from '../context/AuthContext';

export const AdressesSection = () => {
      const {user} = useAuth();
  const [direcciones, setDirecciones] = useState([]);
  const [nuevaDireccion, setNuevaDireccion] = useState({
    calle: '',
    numero: '',
    ciudad: '',
    pais: '',
    codigoPostal: '',
  });
  const [editando, setEditando] = useState(null);

  const fetchDirecciones = async () => {
    const res = await fetch('/api/addresses', { headers: authHeader() });
    const data = await res.json();
    setDirecciones(data);
  };

  const handleAgregar = async () => {
    let nueva;
  
    if (editando) {
      console.log("editando", editando);
      const res = await fetch(`/api/addresses/${editando?.id}`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(nuevaDireccion),
      });
  
      if (!res.ok) {
        const errText = await res.text();
        console.error("Error actualizando:", res.status, errText);
        return;
      }
  
      const actualizada = await res.json();
      setDirecciones((prev) => prev.map((d) => (d.id === actualizada.id ? actualizada : d)));
      setEditando(null);
    } else {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            userId: nuevaDireccion.userId,
            calle: nuevaDireccion.calle,
            numero: nuevaDireccion.numero,
            ciudad: nuevaDireccion.ciudad,
            pais: nuevaDireccion.pais,
            codigoPostal: nuevaDireccion.codigoPostal,
          }),
      });
  
      if (!res.ok) {
        const errText = await res.text();
        console.error("Error agregando:", res.status, errText);
        return;
      }
  
      nueva = await res.json();
      setDirecciones((prev) => [...prev, nueva]);
    }
  
    // Reset form
    setNuevaDireccion({ calle: '', ciudad: '', provincia: '', pais: '' }); // adaptá a tus campos
  };
  

  const handleEditar = (direccion) => {
    setEditando(direccion);
    setNuevaDireccion(direccion);
  };

  const handleEliminar = async (id) => {
    await fetch(`/api/addresses/${id}`, {
      method: 'DELETE',
      headers: authHeader(),
    });
    setDirecciones((prev) => prev.filter((d) => d.id !== id));
  };

  useEffect(() => {
    fetchDirecciones();
  }, []);

  return (
    <section>
      <h2>Direcciones</h2>
      <input
        name="calle"
        placeholder="Calle"
        value={nuevaDireccion.calle}
        onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, calle: e.target.value })}
      />
      <input
        name="numero"
        placeholder="Número"
        value={nuevaDireccion.numero}
        onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, numero: e.target.value })}
      />
      <input
        name="ciudad"
        placeholder="Ciudad"
        value={nuevaDireccion.ciudad}
        onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, ciudad: e.target.value })}
      />
      <input
        name="pais"
        placeholder="País"
        value={nuevaDireccion.pais}
        onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, pais: e.target.value })}
      />
      <input
        name="codigoPostal"
        placeholder="Código Postal"
        value={nuevaDireccion.codigoPostal}
        onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, codigoPostal: e.target.value })}
      />
      <button onClick={handleAgregar}>{editando ? 'Actualizar' : 'Agregar'}</button>

      <ul>
        {direcciones.map((d) => (
          <li key={d.id}>
            {d.id}{d.calle} {d.numero}, {d.ciudad}, {d.pais} ({d.codigoPostal})
            <button onClick={() => handleEditar(d)}>✏️</button>
            <button onClick={() => handleEliminar(d.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </section>
  );
};
