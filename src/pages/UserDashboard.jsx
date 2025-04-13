// pages/UserDashboard.jsx
import React from 'react'
import { StudiesSection } from '../components/StudiesSection'
import { AdressesSection } from '../components/AdressesSection'
import { useAuth } from '../context/AuthContext'
import { ProfileSection } from '../components/ProfileSection'
import { Button, Typography } from '@material-tailwind/react'

export const UserDashboard = () => {
  const { user, logout } = useAuth()

  return (
    
    <div >
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h2">Dashboard</Typography>
        <Button onClick={logout}>Logout</Button>
      </div>
      <main>
        <ProfileSection />
        <div className="flex justify-between items-center mb-6">
          <StudiesSection />
          <AdressesSection />
        </div>
      </main>
    </div>
  )
}