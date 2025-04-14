# Prueba Técnica - React | Zoco

## Descripción

Este proyecto es una SPA (Single Page Application) construida con React que incluye:
- Autenticación con roles (Admin y Usuario).
- Manejo de sesión con `sessionStorage`.
- Consumo de APIs simuladas.
- Gestión de datos relacionados al usuario autenticado (estudios y direcciones).
- Diseño mobile-first y completamente responsivo.

---

## Características

### Roles de Usuario
1. **Admin**:
   - Puede crear usuarios.
   - Puede ver, editar y crear datos relacionados (estudios, direcciones) de cualquier usuario.
2. **Usuario Normal**:
   - Solo puede ver y gestionar su propio perfil y datos relacionados.

### Funcionalidades
1. **Login**:
   - Formulario de autenticación con `email` y `password`.
   - Simulación de autenticación contra una API mock.
   - Al autenticar:
     - Guarda el token en `sessionStorage`.
     - Guarda información del usuario (incluido el rol) en el contexto.
     - Redirige al dashboard.

2. **Dashboard**:
   - Ruta protegida (`/dashboard`).
   - **Admin**:
     - Ver una lista completa de usuarios.
     - Ver y gestionar los datos relacionados de cada usuario.
     - Crear nuevos usuarios.
   - **Usuario Normal**:
     - Ver solo su información personal.
     - Ver, crear y editar sus propios datos relacionados (estudios, direcciones).

3. **Datos Relacionados**:
   - Cada usuario puede tener múltiples estudios y direcciones.
   - Los datos están relacionados al usuario autenticado.
   - Permite crear y editar estos datos según el rol del usuario.

4. **Logout**:
   - Botón visible en el layout general.
   - Al cerrar sesión:
     - Limpia el token y los datos del contexto.
     - Redirige al login.

5. **Diseño Responsivo**:
   - Mobile-first.
   - Adaptativo para dispositivos móviles y pantallas grandes.

---

## Tecnologías Utilizadas

- **React** con Hooks.
- **React Router DOM** para la navegación.
- **Context API** para el manejo de estado global.
- **Material-Tailwind** para el diseño responsivo.
- **Fetch API** para el consumo de APIs simuladas.
- **sessionStorage** para el manejo de sesión.
- **MSW (Mock Service Worker)** para simular la Api Rest.

---

## Instalación y Ejecución

### Requisitos Previos
- Node.js (v16 o superior).
- npm o yarn instalado.

### Pasos para Ejecutar el Proyecto Localmente
1. Clona el repositorio:
   ```bash
   git clone https://github.com/lamontanarog/prueba-tecnica-zoco.git
   cd prueba-tecnica-zoco


2. instala las dependencias
```
npm install
```

3. Iniciar el servidor de desarrollo.
```
npm start
```

4. abrir la aplicacion en el navegador.

```
http://localhost:5173/
```
### Despliegue
El proyecto está desplegado en Vercel. Puedes acceder a la aplicación en el siguiente enlace:

Demo en Vivo
```
https://prueba-tecnica-zoco.vercel.app/
```
### Estructura del proyecto

```bash
src/
├── components/
│   ├── admin/
│   │   ├── ManageUsers.jsx
│   │   └── AditionalInformation.jsx
│   ├── StudiesSection.jsx
│   ├── AdressesSection.jsx
│   └── Login.jsx
├── context/
│   ├── AuthContext.jsx
│   └── AdminDataContext.jsx
├── routes/
│   └── PrivateRoute.js
├── utils/
│   └── AuthHeader.js
├──mocks/
│    ├── browser.js
│    ├── handlers.js
│    └── data.js
├──pages/
│    ├── AdminDashboard.jsx
│    ├── UserDashboard.jsx
│    └── Login.jsx
│    └── Layout.jsx
├── App.jsx
└── main.jsx
```
### Instrucciones para evaluadores

1. Login:

* Usa las siguientes credenciales para probar la autenticación:

```
Admin:
---- Email: admin@demo.com
---- Password: admin123

```
```
Usuario:
---- Email: user@demo.com
---- Password: user123
```
2. DashBoard:

* Probar las funcionalidades de creación, edición y eliminación de usuarios y su informacion adicional (como Admin).

* Probar la gestión de estudios y direcciones (como Usuario Normal).

3. Diseño responsivo:

* Cambia el tamaño de la ventana del navegador para verificar la adaptabilidad del diseño.
