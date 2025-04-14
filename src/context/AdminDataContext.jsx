import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

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
      setAddresses(data?.addresses);
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

  const createAddress = async (newAddress) => {
    const res = await fetch(`/api/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newAddress),
    });
    const created = await res.json();
    setAddresses((prev) => [...prev, created]);
  }

  const updateAddress = async (updatedAddress) => {
    setAddresses((prev) =>
      prev.map((address) => (address.id === updatedAddress.id ? updatedAddress : address))
    );
    await fetch(`/api/addresses/${updatedAddress.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...updatedAddress, userId: updatedAddress?.userId }),
    });
  };

  const deleteAddress = async (id) => {
    await fetch(`/api/addresses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }

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
        createAddress,
        updateAddress,
        deleteAddress
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => useContext(AdminDataContext);
