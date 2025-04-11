// pages/UserDashboard.jsx
import React from 'react'
import { StudiesSection } from '../components/StudiesSection'
import { AdressesSection } from '../components/AdressesSection'
import { useAuth } from '../context/AuthContext'
import { ProfileSection } from '../components/ProfileSection'

export const UserDashboard = () => {
  const { user, logout } = useAuth()

  return (
    <div>
      <header>
        <h1>Bienvenido, {user?.name}</h1>
        <button onClick={logout}>Cerrar sesión</button>
      </header>

      <main>
        <StudiesSection />
        <AdressesSection />
        <ProfileSection />
      </main>
    </div>
  )
}