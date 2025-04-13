import React, { useEffect, useState } from 'react';
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

export const AdressesSection = () => {
  const { user } = useAuth();
  const [direcciones, setDirecciones] = useState([]);
  const [nuevaDireccion, setNuevaDireccion] = useState({
    userId: user.id,
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
      try {
        console.log(authHeader());
        const res = await fetch(`/api/addresses/${editando.id}`, {
          method: 'PUT',
          headers: authHeader(),
          body: JSON.stringify(nuevaDireccion),
        });

        if (!res.ok) {
          throw new Error(`Error del servidor: ${res.status}`);
        }

        const contentType = res.headers.get("content-type");
        let actualizada = null;

        if (contentType && contentType.includes("application/json")) {
          actualizada = await res.json();
          console.log(actualizada);
          setDirecciones((prev) =>
            prev.map((d) => (d.id === actualizada.id ? actualizada : d))
          );
        } else {
          console.warn("Respuesta sin JSON");
        }

        setEditando(null);
      } catch (error) {
        console.error("Error al actualizar la direccion:", error);
      }

      finally {
        setNuevaDireccion({
          calle: '',
          numero: '',
          ciudad: '',
          pais: '',
          codigoPostal: '',
        });
      }
    } else {
      try {
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

        nueva = await res.json();
        setDirecciones((prev) => [...prev, nueva]);
      } catch (error) {
        console.log('Error al agregar la direccion:', error);
      }
      finally {
        setNuevaDireccion({
          calle: '',
          numero: '',
          ciudad: '',
          pais: '',
          codigoPostal: '',
        });
      }
    }
  }
  const handleEditar = (direccion) => {
    setEditando(direccion);
    setNuevaDireccion(direccion);
  };

  const deleteAddress = async (d) => {
    const id = d.id;
    await fetch(`/api/addresses/${id}`, {
      method: "DELETE",
      headers: authHeader(),
    });
    setDirecciones((prev) => prev.filter((d) => d.id !== id));
  }

  useEffect(() => {
    fetchDirecciones();
  }, []);

  return (
    <section className="container mx-auto px-4 py-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader floated={false} shadow={false} className="bg-blue-gray-50 p-4">
          <Typography variant="h5" color="blue-gray">
            Direcciones
          </Typography>
        </CardHeader>

        <CardBody className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Calle"
              name="calle"
              value={nuevaDireccion.calle}
              onChange={(e) =>
                setNuevaDireccion({ ...nuevaDireccion, calle: e.target.value })
              }
            />
            <Input
              label="Número"
              name="numero"
              value={nuevaDireccion.numero}
              onChange={(e) =>
                setNuevaDireccion({ ...nuevaDireccion, numero: e.target.value })
              }
            />
            <Input
              label="Ciudad"
              name="ciudad"
              value={nuevaDireccion.ciudad}
              onChange={(e) =>
                setNuevaDireccion({ ...nuevaDireccion, ciudad: e.target.value })
              }
            />
            <Input
              label="País"
              name="pais"
              value={nuevaDireccion.pais}
              onChange={(e) =>
                setNuevaDireccion({ ...nuevaDireccion, pais: e.target.value })
              }
            />
            <Input
              label="Código Postal"
              name="codigoPostal"
              value={nuevaDireccion.codigoPostal}
              onChange={(e) =>
                setNuevaDireccion({
                  ...nuevaDireccion,
                  codigoPostal: e.target.value,
                })
              }
            />
          </div>

          <Button color={editando ? "green" : "blue"} onClick={handleAgregar}>
            {editando ? "Actualizar" : "Agregar"}
          </Button>

          <ul className="mt-6 space-y-4">
            {direcciones.map((d) => (
              <li
                key={d.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <Typography variant="paragraph" className="font-medium">
                  {d.calle} {d.numero}, {d.ciudad}, {d.pais} ({d.codigoPostal})
                </Typography>
                <div className="flex gap-2">
                  <IconButton variant="text" color="blue" onClick={() => handleEditar(d)}>
                    <PencilIcon className="h-5 w-5" />
                  </IconButton>
                  <IconButton variant="text" color="red" onClick={() => deleteAddress(d)}>
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
