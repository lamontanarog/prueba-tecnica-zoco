import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { Login } from './pages/Login'
import { AdminDashboard } from './pages/AdminDashboard'
import { UserDashboard } from './pages/UserDashboard'
import { PrivateRoute } from './routes/PrivateRoute'
import { ManageUsers } from './components/admin/ManageUsers'
import {AditionalInformation} from './components/admin/AditionalInformation'
import { UserStudyForm } from './components/admin/UserStudyForm'

export const App = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              {user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
            </PrivateRoute>
          }
        />
        <Route path={`/users/:id`} element={
          <PrivateRoute>
            {user?.role === 'admin' ? <AditionalInformation /> : <Navigate to="/unauthorized" />}  
          </PrivateRoute>
        } />
        <Route path={`/users/:id/studies/:studyId/edit`} element={
          <PrivateRoute>
            {user?.role === 'admin' ? <UserStudyForm /> : <Navigate to="/unauthorized" />}  
          </PrivateRoute>
        } />
        <Route path={`/users/:id/studies/create`} element={
          <PrivateRoute>
            {user?.role === 'admin' ? <UserStudyForm /> : <Navigate to="/unauthorized" />}  
          </PrivateRoute>
        } />
        <Route path="/unauthorized" element={<div>Unauthorized</div>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}
