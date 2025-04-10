import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserById, getEstudiosByUserId, getDireccionesByUserId, createEstudio, createDireccion } from '../api/api';

const Profile = () => {
  const { user, token } = useAuth();
  const [estudios, setEstudios] = useState([]);
  const [direcciones, setDirecciones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const estudiosData = await getEstudiosByUserId(user.id, token);
        const direccionesData = await getDireccionesByUserId(user.id, token);
        setEstudios(estudiosData);
        setDirecciones(direccionesData);
      } catch (err) {
        console.error(err);
        alert('Error al cargar los datos del perfil.');
      }
    };
    if (user && user.id) {
      fetchData();
    }
  }, [user, token]);

  const handleCreateEstudio = async (estudioData) => {
    try {
      const newEstudio = await createEstudio({ ...estudioData, userId: user.id }, token);
      setEstudios((prev) => [...prev, newEstudio]);
    } catch (err) {
      console.error(err);
      alert('Error al crear el estudio.');
    }
  };

  const handleCreateDireccion = async (direccionData) => {
    try {
      const newDireccion = await createDireccion({ ...direccionData, userId: user.id }, token);
      setDirecciones((prev) => [...prev, newDireccion]);
    } catch (err) {
      console.error(err);
      alert('Error al crear la dirección.');
    }
  };

  return (
    <div>
      <h1>Perfil de {user.email}</h1>
      <h2>Estudios</h2>
      <ul>
        {estudios.map((e) => (
          <li key={e.id}>{e.titulo} - {e.institucion}</li>
        ))}
      </ul>
      <h2>Direcciones</h2>
      <ul>
        {direcciones.map((d) => (
          <li key={d.id}>{d.calle} {d.numero}, {d.ciudad}</li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
