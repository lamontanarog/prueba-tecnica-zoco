import React from "react"
import { useAuth } from "../context/AuthContext"
import { ManageUsers } from "../components/admin/ManageUsers"
export const AdminDashboard = () => {
  const { user, logout } = useAuth()
  return (
    <div>
      <h2>Welcome Admin {user?.email}</h2>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
      <ManageUsers />
    </div>
  )
}