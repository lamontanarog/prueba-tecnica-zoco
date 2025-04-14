import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Typography,
  IconButton,
  Alert,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useAdminData } from '../context/AdminDataContext';
import { useAuth } from '../context/AuthContext';

export const StudiesSection = () => {
  const { studies, createStudy, updateStudy, deleteStudy, fetchUserData } = useAdminData();
  const { user } = useAuth();

  const [nuevoEstudio, setNuevoEstudio] = useState({ nombre: '', inicio: 0, fin: 0, institucion: '' });
  const [editando, setEditando] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    if (user?.id) {
      fetchUserData(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ type: '', message: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleAgregar = async () => {
    try {
      if (nuevoEstudio.nombre === '' || nuevoEstudio.inicio === 0 || nuevoEstudio.fin === 0 || nuevoEstudio.institucion === '') {
        setAlert({ type: 'error', message: 'Los campos no pueden estar vacios', color: 'red' });
        setEditando(null)
        return;
      }
      if (nuevoEstudio.inicio > nuevoEstudio.fin) {
        setAlert({ type: 'error', message: 'El año de inicio no puede ser mayor que el año de fin', color: 'red' });
        setEditando(null)
        return;
      }
      if (nuevoEstudio.inicio < 1900 || nuevoEstudio.fin > 2100) {
        setAlert({ type: 'error', message: 'Los años deben estar entre 1900 y 2100', color: 'red' });
        setEditando(null)
        return;
      }
      if (studies.some((e) => e.nombre === nuevoEstudio.nombre && e.institucion === nuevoEstudio.institucion)) {
        setAlert({ type: 'warning', message: 'Ya existe un estudio con ese nombre e institución', color: 'orange' });
        setEditando(null)
        return;
      }
      if (editando) {
        await updateStudy({ ...editando, ...nuevoEstudio });
        setAlert({ type: 'success', message: 'Estudio actualizado correctamente', color: 'green' });
        setEditando(null);
      } else {
        await createStudy({ ...nuevoEstudio, userId: user.id });
        setAlert({ type: 'success', message: 'Estudio creado correctamente', color: 'green' });
      }
    } catch (error) {
      console.error("Error al guardar el estudio:", error);
      setAlert({ type: 'error', message: 'Error al guardar el estudio', color: 'red' });
    } finally {
      setNuevoEstudio({ nombre: '', inicio: 0, fin: 0, institucion: '' });
    }
  };

  const handleEditar = (estudio) => {
    setEditando(estudio);
    setNuevoEstudio({
      nombre: estudio.nombre,
      inicio: estudio.inicio,
      fin: estudio.fin,
      institucion: estudio.institucion,
    });
  };

  const handleEliminar = async (estudio) => {
    try {
      await deleteStudy(estudio.id);
      setAlert({ type: 'success', message: 'Estudio eliminado correctamente', color: 'green' });
    } catch (error) {
      console.error("Error al eliminar el estudio:", error);
      setAlert({ type: 'error', message: 'Error al eliminar el estudio', color: 'red' });
    }
    finally {
      setNuevoEstudio({ nombre: '', inicio: 0, fin: 0, institucion: '' });
      setEditando(null);
    }

  };

  return (
    <>
      {alert.message && (
        <Alert
          className="fixed top-5 right-5 z-50 w-[90%] max-w-sm"
          color={alert.color}
          onClose={() => setAlert({ ...alert, message: '' })}
        >
          {alert.message}
        </Alert>
      )}

      <section className="px-4 py-6 w-full">
        <Card className="w-full min-h-[300px] shadow-md rounded-2xl">

          <CardHeader floated={false} shadow={false} className="bg-blue-gray-50 p-4 rounded-t-2xl">
            <Typography variant="h5" color="blue-gray">
              Estudios
            </Typography>
          </CardHeader>

          <CardBody className="flex flex-col gap-6 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                value={nuevoEstudio.nombre}
                onChange={(e) => setNuevoEstudio({ ...nuevoEstudio, nombre: e.target.value })}
              />
              <Input
                label="Institución"
                value={nuevoEstudio.institucion}
                onChange={(e) => setNuevoEstudio({ ...nuevoEstudio, institucion: e.target.value })}
              />
              <Input
                label="Año inicio"
                type="number"
                min={1900}
                max={2100}
                value={nuevoEstudio.inicio}
                onChange={(e) => setNuevoEstudio({ ...nuevoEstudio, inicio: Number(e.target.value) })}
              />
              <Input
                label="Año fin"
                type="number"
                min={1900}
                max={2100}
                value={nuevoEstudio.fin}
                onChange={(e) => setNuevoEstudio({ ...nuevoEstudio, fin: Number(e.target.value) })}
              />
            </div>

            <div className="flex justify-end">
              <Button className='w-full' color={editando ? 'green' : 'blue'} onClick={handleAgregar}>
                {editando ? 'Actualizar' : 'Agregar'}
              </Button>
            </div>

            <ul className="space-y-4">
              {studies.map((e) => (
                <li
                  key={e.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2"
                >
                  <Typography variant="paragraph" className="font-medium">
                    {e.nombre} ({e.inicio} - {e.fin}) - {e.institucion}
                  </Typography>
                  <div className="flex gap-2 mt-2 sm:mt-0 py-6 px-4">
                    <IconButton variant="text" color="blue" onClick={() => handleEditar(e)}>
                      <PencilIcon className="h-5 w-5" />
                    </IconButton>
                    <IconButton variant="text" color="red" onClick={() => handleEliminar(e)}>
                      <TrashIcon className="h-5 w-5" />
                    </IconButton>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </section>
    </>
  )

};
