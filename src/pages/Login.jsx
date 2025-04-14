import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";

export const Login = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
    } catch (err) {
      setError('Invalid credentials')
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black w-full">
      <Card className="w-96 shadow-lg">
        <CardBody>
          <Typography variant="h5" className="text-center mb-6">
            Iniciar Sesión
          </Typography>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" fullWidth>
              Ingresar
            </Button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
