import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAdminData } from '../context/AdminDataContext';
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

export const AdressesSection = () => {
  const { user } = useAuth();
  const {
    addresses,
    createAddress,
    updateAddress,
    deleteAddress,
    fetchUserData,
  } = useAdminData();

  const [nuevaDireccion, setNuevaDireccion] = useState({
    calle: '',
    numero: '',
    ciudad: '',
    pais: '',
    codigoPostal: '',
  });
  const [editando, setEditando] = useState(null);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const handleAgregar = async () => {
    const direccionConUserId = {
      ...nuevaDireccion,
      userId: user.id,
    };

    try {
      if (nuevaDireccion.calle === '' || nuevaDireccion.numero === '' || nuevaDireccion.ciudad === '' || nuevaDireccion.pais === '' || nuevaDireccion.codigoPostal === '') {
        setAlert({ type: 'error', message: 'Los campos no pueden estar vacios', color: 'red' });
        setEditando(null)
        return;
      } else if (addresses.some((d) => d.calle === nuevaDireccion.calle && d.numero === nuevaDireccion.numero)) {
        setAlert({ type: 'warning', message: 'cuidado, ya existe una dirección con esa calle y número', color: 'orange' });
        setEditando(null)
        return;
      }
      if (editando) {
        await updateAddress(direccionConUserId);
        setEditando(null);
        setAlert({ type: 'success', message: 'Dirección actualizada correctamente', color: 'green' });
        return;
      }
      else {
        await createAddress(direccionConUserId);
        setAlert({ type: 'success', message: 'Dirección creada correctamente', color: 'green' });
      }
    } catch (error) {
      console.error("Error al guardar dirección:", error);
      setAlert({ type: 'error', message: 'Error al guardar dirección', color: 'red' });
    } finally {
      setNuevaDireccion({
        calle: '',
        numero: '',
        ciudad: '',
        pais: '',
        codigoPostal: '',
      });
    }
  };

  const handleEditar = (direccion) => {
    setEditando(direccion);
    setNuevaDireccion(direccion);
  };

  const handleEliminar = async (direccion) => {
    try {
      await deleteAddress(direccion.id);
      setAlert({ type: 'success', message: 'Dirección eliminada correctamente', color: 'green' });
    } catch (error) {
      console.error("Error al eliminar dirección:", error);
      setAlert({ type: 'error', message: 'Error al eliminar dirección', color: 'red' });
    }
    finally {
      setNuevaDireccion({
        calle: '',
        numero: '',
        ciudad: '',
        pais: '',
        codigoPostal: '',
      });
      setEditando(null);
    }

  };

  useEffect(() => {
    if (user?.id) {
      fetchUserData(user.id);
    }
  }, [user?.id]);


  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ type: '', message: '' });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

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
              Direcciones
            </Typography>
          </CardHeader>
  
          <CardBody className="flex flex-col gap-6 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Calle"
                name="calle"
                value={nuevaDireccion.calle}
                onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, calle: e.target.value })}
              />
              <Input
                label="Número"
                name="numero"
                value={nuevaDireccion.numero}
                onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, numero: e.target.value })}
              />
              <Input
                label="Ciudad"
                name="ciudad"
                value={nuevaDireccion.ciudad}
                onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, ciudad: e.target.value })}
              />
              <Input
                label="País"
                name="pais"
                value={nuevaDireccion.pais}
                onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, pais: e.target.value })}
              />
              <Input
                label="Código Postal"
                name="codigoPostal"
                value={nuevaDireccion.codigoPostal}
                onChange={(e) => setNuevaDireccion({ ...nuevaDireccion, codigoPostal: e.target.value })}
              />
            </div>
  
            <div className="flex justify-end">
              <Button className='w-full' color={editando ? 'green' : 'blue'} onClick={handleAgregar}>
                {editando ? 'Actualizar' : 'Agregar'}
              </Button>
            </div>
  
            <ul className="space-y-4">
              {addresses.map((d) => (
                <li
                  key={d.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2"
                >
                  <Typography variant="paragraph" className="font-medium">
                    {d.calle} {d.numero}, {d.ciudad}, {d.pais} ({d.codigoPostal})
                  </Typography>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <IconButton variant="text" color="blue" onClick={() => handleEditar(d)}>
                      <PencilIcon className="h-5 w-5" />
                    </IconButton>
                    <IconButton variant="text" color="red" onClick={() => handleEliminar(d)}>
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
