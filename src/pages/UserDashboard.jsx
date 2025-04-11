import { useState, useEffect } from 'react';
import { getEstudiosByUserId, getDireccionesByUserId } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function UserDashboard() {
  const { user, token } = useAuth();
  const [estudios, setEstudios] = useState([]);
  const [direcciones, setDirecciones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const estudiosData = await getEstudiosByUserId(user.id, token);
      const direccionesData = await getDireccionesByUserId(user.id, token);
      setEstudios(estudiosData);
      setDirecciones(direccionesData);
    };
    fetchData();
  }, [user.id, token]);

  return (
    <div>
      <h2>Mis Estudios</h2>
      <ul>{estudios.map((e) => <li key={e.id}>{e.titulo}</li>)}</ul>
      <h2>Mis Direcciones</h2>
      <ul>{direcciones.map((d) => <li key={d.id}>{d.calle}</li>)}</ul>
    </div>
  );
}
