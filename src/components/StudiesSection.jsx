// components/EstudiosSection.jsx
import React, { useState, useEffect } from 'react';
import { authHeader } from '../utils/AuthHeader';
import { useAuth } from '../context/AuthContext';
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export const StudiesSection = () => {
  const [estudios, setEstudios] = useState([]);
  const { user } = useAuth();
  const [nuevoEstudio, setNuevoEstudio] = useState({ nombre: '', inicio: 0, fin: 0, institucion: '' });
  const [editando, setEditando] = useState(null);

  const fetchEstudios = async () => {
    const res = await fetch('/api/studies', { headers: authHeader() });
    console.log({ res })
    setEstudios(await res.json());
  };

  const handleAgregar = async () => {
    if (editando) {
      try {
        const res = await fetch(`/api/studies/${editando?.id}`, {
          method: 'PUT',
          headers: authHeader(),
          body: JSON.stringify(nuevoEstudio),
        });
        const updated = await res.json();
        console.log({ updated })
        setEstudios((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
        setEditando(null);
      } catch (error) {
        console.error("Error al actualizar el estudio:", error);
      }
      finally {
        setNuevoEstudio({
          nombre: '',
          inicio: 0,
          fin: 0,
          institucion: '',
        });
      }
    }
    else {
      try {
        const res = await fetch('/api/studies', {
          method: 'POST',
          headers: authHeader(),
          body: JSON.stringify(nuevoEstudio),
        });
        const newStudy = await res.json();
        setEstudios((prev) => [...prev, newStudy]);
        console.log(user.id)
        const infoUser = { id: user.id, estudios: estudios };
        setNuevoEstudio({ infoUser });
      } catch (error) {
        console.error("Error al crear el estudio:", error);
      }
      finally {
        setNuevoEstudio({
          nombre: '',
          inicio: 0,
          fin: 0,
          institucion: '',
        });
      }
    }
  };

  const handleEditar = (estudio) => {
    console.log("handleEditar", estudio);
    setEditando(estudio);
    setNuevoEstudio(estudio);
  };

  const deleteStudy = async (e) => {
    const id = e.id;
    console.log("deleteStudy", id);
    await fetch(`/api/studies/${id}`, {
      method: "DELETE",
      headers: authHeader(),
    });
    setEstudios((prev) => prev.filter((s) => s.id !== id));
  };

  useEffect(() => {
    fetchEstudios();
  }, []);

  return (
    <section className="container mx-auto px-4 py-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader floated={false} shadow={false} className="bg-blue-gray-50 p-4">
          <Typography variant="h5" color="blue-gray">
            Estudios
          </Typography>
        </CardHeader>

        <CardBody className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre"
              name="nombre"
              value={nuevoEstudio.nombre}
              onChange={(e) =>
                setNuevoEstudio({ ...nuevoEstudio, nombre: e.target.value })
              }
            />
            <Input
              label="Institución"
              name="institucion"
              value={nuevoEstudio.institucion}
              onChange={(e) =>
                setNuevoEstudio({ ...nuevoEstudio, institucion: e.target.value })
              }
            />
            <Input
              label="Año inicio"
              name="inicio"
              type="number"
              value={nuevoEstudio.inicio}
              onChange={(e) =>
                setNuevoEstudio({ ...nuevoEstudio, inicio: e.target.value })
              }
            />
            <Input
              label="Año fin"
              name="fin"
              type="number"
              value={nuevoEstudio.fin}
              onChange={(e) =>
                setNuevoEstudio({ ...nuevoEstudio, fin: e.target.value })
              }
            />
          </div>

          <Button color={editando ? "green" : "blue"} onClick={handleAgregar}>
            {editando ? "Actualizar" : "Agregar"}
          </Button>

          <ul className="mt-6 space-y-4">
            {estudios.map((e) => (
              <li
                key={e.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <Typography variant="paragraph" className="font-medium">
                    {e.nombre} ({e.inicio} - {e.fin}) - {e.institucion}
                  </Typography>
                </div>
                <div className="flex gap-2">
                  <IconButton variant="text" color="blue" onClick={() => handleEditar(e)}>
                    <PencilIcon className="h-5 w-5" />
                  </IconButton>
                  <IconButton variant="text" color="red" onClick={() => deleteStudy(e)}>
                    <TrashIcon className="h-5 w-5" />
                  </IconButton>
                </div>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </section>
  );
};
