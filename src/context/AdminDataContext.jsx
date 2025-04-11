import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext"; // ajustá el path si hace falta

const AdminDataContext = createContext();

export const AdminDataProvider = ({ children }) => {
  const { token } = useAuth();
  const [studies, setStudies] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const fetchUserData = async (userId) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setStudies(data.studies);
      setAddresses(data.addresses);
    } catch (error) {
      console.error("Error al cargar información del usuario:", error);
    }
  };

  const updateStudy = async (updatedStudy) => {
    setStudies((prev) =>
      prev.map((study) => (study.id === updatedStudy.id ? updatedStudy : study))
    );
    await fetch(`/api/studies/${updatedStudy.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedStudy),
    });
  };

  const createStudy = async (newStudy) => {
    const res = await fetch(`/api/studies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newStudy),
    });
    const created = await res.json();
    setStudies((prev) => [...prev, created]);
  };

  const deleteStudy = async (id) => {
    await fetch(`/api/studies/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setStudies((prev) => prev.filter((s) => s.id !== id));
  };

  // Repetí la lógica para direcciones (createAddress, updateAddress, etc.)

  return (
    <AdminDataContext.Provider
      value={{
        studies,
        addresses,
        fetchUserData,
        updateStudy,
        createStudy,
        deleteStudy,
        setAddresses,
        setStudies,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => useContext(AdminDataContext);
