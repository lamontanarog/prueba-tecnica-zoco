import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { App } from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { AdminDataProvider } from './context/AdminDataContext'
import { ThemeProvider } from "@material-tailwind/react";

const { worker } = await import('./mocks/browser')
worker.start()


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AdminDataProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AdminDataProvider>
    </AuthProvider>
  </StrictMode>,
)
