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
} from "@material-tailwind/react";

export const UserAdressForm = () => {
    const { addressId, id } = useParams();
    const navigate = useNavigate();
    const { addresses, updateAddress, createAddress } = useAdminData();
    const [form, setForm] = useState({
        userId: id,
        calle: "",
        numero: "",
        ciudad: "",
        pais: "",
        codigoPostal: "",
    });
    useEffect(() => {
        const foundAdress = addresses?.find((a) => a.id === addressId);

        if (foundAdress) {
            setForm(foundAdress);
        }
        console.log("Direccion encontrada:", foundAdress);
    }, [addressId, addresses]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        addressId ? updateAddress(form) : createAddress(form);

        console.log("Dirreccion actualizado:", form);
        navigate(`/users/${id}`);
    };


    return (
        <div className="container mx-auto px-4 py-6">
            <Button size='sm' className='mb-4' onClick={() => navigate(`/users/${id}`)}>volver</Button>
            <Card className="max-w-xl mx-auto">
                <CardHeader floated={false} shadow={false} className="bg-blue-gray-50 p-4">
                    <Typography variant="h5" color="blue-gray">
                        {addressId ? "Editar direccion" : "Crear direccion"}
                    </Typography>
                </CardHeader>

                <CardBody>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <Input
                                label="calle"
                                type="text"
                                name="calle"
                                value={form.calle}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Input
                                label="numero"
                                type="text"
                                name="numero"
                                value={form.numero}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Input
                                label="ciudad"
                                type="text"
                                name="ciudad"
                                value={form.ciudad}
                                onChange={handleChange}
                                min={1900}
                                max={2100}
                                required
                            />
                        </div>

                        <div>
                            <Input
                                label="pais"
                                type="string"
                                name="pais"
                                value={form.pais}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <Input
                                label="codigoPostal"
                                type="string"
                                name="codigoPostal"
                                value={form.codigoPostal}
                                onChange={handleChange}
                                min={0o00}
                                max={9999}
                            />
                        </div>

                        <Button type="submit" color="blue">
                            {addressId ? "Actualizar direccion" : "Crear direccion"}
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
};
