import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from '../../context/AdminDataContext';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  List,
  ListItem,
  ListItemSuffix,
  Alert,
} from "@material-tailwind/react";

export const AditionalInformation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { studies, addresses, fetchUserData, deleteAddress, deleteStudy } = useAdminData();
  const [alert, setAlert] = useState({ type: '', message: '' });
  useEffect(() => {
    fetchUserData(id);
  }, [id]);

  const handleEditStudy = async (study) => {
    navigate(`/users/${id}/studies/${study.id}/edit`);
  }
  const handleEditAdress = async (address) => {
    const addressId = address
    navigate(`/users/${id}/addresses/${addressId}/edit`);
  }
  const handleCreateStudy = async () => {
    navigate(`/users/${id}/studies/create`);
  }

  const handleCreateAddress = async () => {
    navigate(`/users/${id}/addresses/create`);
  }

  const handleDeleteStudy = async (study) => {
    try {
      await deleteStudy(study.id);
      fetchUserData(id);
      setAlert({ type: 'success', message: 'Estudio eliminado correctamente', color: 'green' });
    } catch (error) {
      console.error(error);
      setAlert({ type: 'error', message: 'Error al eliminar el estudio', color: 'red' });
    }
  }

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ type: '', message: '' });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleDeleteAddress = async (address) => {
    try {
      await deleteAddress(address.id);
      fetchUserData(id);
      setAlert({ type: 'success', message: 'Dirección eliminada correctamente', color: 'green' });
    } catch (error) {
      console.error(error);
      setAlert({ type: 'error', message: 'Error al eliminar la direccion', color: 'red' });
    }
  }


  return (
    <>
      {alert.message && (
        <Alert className="fixed top-5 right-5 z-50 w-1/3" timeout={1000} color={alert.color} onClose={() => setAlert({ ...alert, message: '' })}>
          {alert.message}
        </Alert>
      )}
      <div className="container mx-auto px-4 py-6">
        <Button size='sm' className='mb-4' onClick={() => navigate('/dashboard')}>Volver</Button>
        <Typography variant="h4" color="blue-gray" className="mb-6">
          Información adicional del usuario
        </Typography>

        <Card className="mb-8">
          <CardHeader shadow={false} floated={false} className="bg-blue-gray-50 p-4">
            <div className="flex justify-between items-center">
              <Typography variant="h5">Direcciones</Typography>
              <Button color="green" size="sm" onClick={handleCreateAddress}>Cargar nueva direccion</Button>
            </div>
          </CardHeader>
          <CardBody>
            {addresses.length > 0 ? (
              <List>
                {addresses?.map((address) => (
                  <ListItem key={address.id} className="flex justify-between items-center">
                    <div>
                      {address.id}{address.calle}, {address.numero}, {address.ciudad}
                    </div>
                    <ListItemSuffix className="flex gap-2">
                      <Button color="red" size="sm" onClick={() => handleDeleteAddress(address)}>
                        Eliminar
                      </Button>
                      <Button color="blue" size="sm" onClick={() => handleEditAdress(address.id)}>
                        Editar
                      </Button>
                    </ListItemSuffix>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="gray">No se encontraron direcciones.</Typography>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader shadow={false} floated={false} className="bg-blue-gray-50 p-4">
            <div className="flex justify-between items-center">
              <Typography variant="h5">Estudios</Typography>
              <Button color="green" size="sm" onClick={handleCreateStudy}>
                Cargar nuevo estudio
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {studies.length > 0 ? (
              <List>
                {studies.map((study) => (
                  <ListItem key={study.id} className="flex justify-between items-center">
                    <div>
                      {study.nombre} - {study.institucion} ({study.inicio} - {study.fin})
                    </div>
                    <ListItemSuffix className="flex gap-2">
                      <Button color="red" size="sm" onClick={() => handleDeleteStudy(study)}>
                        Eliminar
                      </Button>
                      <Button color="blue" size="sm" onClick={() => handleEditStudy(study)}>
                        Editar
                      </Button>
                    </ListItemSuffix>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="gray">No se encontraron estudios.</Typography>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
};