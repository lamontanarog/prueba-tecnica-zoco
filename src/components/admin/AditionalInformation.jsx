import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authHeader } from '../../utils/AuthHeader';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from '../../context/AdminDataContext';

export const AditionalInformation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { studies, addresses, fetchUserData } = useAdminData();

    useEffect(() => {
        fetchUserData(id);
    }, [id]);

    const handleEditStudy = async (study) => {
        navigate(`/users/${id}/studies/${study.id}/edit`);
    }
    const handleCreateStudy = async () => {
        navigate(`/users/${id}/studies/create`);
    }

    return (
        <div className="container">
            <h2>Información adicional del usuario</h2>

            <div className="section">
                <h3>Direcciones</h3>
                {addresses.length > 0 ? (
                    <ul>
                        {addresses.map((address) => (
                            <li key={address.id}>
                                {address.calle}, {address.numero}, {address.ciudad}
                            <button onClick={() => handleDeleteAddress(address)}>Eliminar</button>
                            <button onClick={() => handleEditAddress(address.id)}>Editar</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No se encontraron direcciones.</p>
                )}
            </div>

            <div className="section">
                <h3>Estudios</h3>
                {studies.length > 0 ? (
                    <ul>
                        {studies.map((study) => (
                            <li key={study.id}>
                                {study.nombre} - {study.institucion}
                                <button onClick={() => handleCreateStudy()}> Crear</button>
                                <button onClick={() => handleDeleteStudy(study)}>Eliminar</button>
                                <button onClick={() => handleEditStudy(study)}>Editar</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No se encontraron estudios.</p>
                )}
            </div>
        </div>
    );
}