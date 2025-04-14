import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminData } from '../../context/AdminDataContext';
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Typography,
  Button,
  Alert
} from "@material-tailwind/react";

export const UserStudyForm = () => {
  const { studyId, id } = useParams();
  const navigate = useNavigate();
  const { studies, updateStudy, createStudy } = useAdminData();

  const [form, setForm] = useState({
    userId: id,
    nombre: "",
    inicio: 0,
    fin: 0,
    institucion: "",
  });
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
    color: "",
  });

  useEffect(() => {
    const foundStudy = studies.find((s) => s.id === studyId);

    if (foundStudy) {
      setForm(foundStudy);
    }
  }, [studyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // studyId ? updateStudy(form) : createStudy(form);
    if (studyId) {
      if (studyId) {
        if (studies.some((d) => d.nombre === form.nombre && d.institucion === form.institucion && d.id !== studyId && d.userId === id)) {
          setAlert({
            show: true,
            message: "cuidado, ya existe un estudio con ese nombre y institucion",
            type: "warning",
            color: "orange",
          })
          return;
        }
      }
      updateStudy(form);
    }
    else {
      if (!studyId) {
        if (studies.some((d) => d.nombre === form.nombre && d.institucion === form.institucion && d.userId === id && d.id !== studyId)) {
          setAlert({
            show: true,
            message: "cuidado, ya existe un estudio con ese nombre y institucion",
            type: "warning",
            color: "orange",
          })
          return;
        }
        createStudy(form);
      }
    }
    navigate(`/users/${form.userId}`);
  };


  return (
    <>
      {alert.show && (
        <Alert className="mb-4" color={alert.color} onClose={() => setAlert({ ...alert, show: false })}>
          {alert.message}
        </Alert>
      )}
      <div className="container mx-auto px-4 py-6">
        <Button size='sm' className='mb-4' onClick={() => navigate(`/users/${id}`)}>volver</Button>
        <Card className="max-w-xl mx-auto">
          <CardHeader floated={false} shadow={false} className="bg-blue-gray-50 p-4">
            <Typography variant="h5" color="blue-gray">
              {studyId ? "Editar estudio" : "Crear estudio"}
            </Typography>
          </CardHeader>

          <CardBody>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <Input
                  label="Nombre"
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Input
                  label="Institución"
                  type="text"
                  name="institucion"
                  value={form.institucion}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Input
                  label="Año de inicio"
                  type="number"
                  name="inicio"
                  value={form.inicio}
                  onChange={handleChange}
                  min={1950}
                  max={2025}
                  required
                />
              </div>

              <div>
                <Input
                  label="Año de finalización"
                  type="number"
                  name="fin"
                  value={form.fin}
                  onChange={handleChange}
                />
              </div>

              <Button type="submit" color="blue">
                {studyId ? "Actualizar estudio" : "Crear estudio"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  );
};
