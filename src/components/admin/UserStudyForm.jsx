import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminData } from '../../context/AdminDataContext';

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

    studyId ? updateStudy(form) : createStudy(form);
    
    console.log("Estudio actualizado:", form);
    navigate(`/users/${form.userId}`);
  };

  return (
    <div className="container">
      <h1>Actualizar estudio</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Institución</label>
          <input
            type="text"
            name="institucion"
            value={form.institucion}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Año de inicio</label>
          <input
            type="number"
            name="inicio"
            value={form.inicio}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Año de finalización</label>
          <input
            type="number"
            name="fin"
            value={form.fin}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Guardar cambios</button>
      </form>
    </div>
  );
};
