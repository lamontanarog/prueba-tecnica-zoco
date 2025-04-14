import React from 'react'
import { StudiesSection } from '../components/StudiesSection'
import { AdressesSection } from '../components/AdressesSection'
import { ProfileSection } from '../components/ProfileSection'

export const UserDashboard = () => {
  return (
    <div >
      <main>
        <ProfileSection />
        <div className="w-full px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <StudiesSection />
          <AdressesSection />
        </div>
      </main>
    </div>
  )
}