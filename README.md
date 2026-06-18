# Luxury Joyería

Aplicación web full stack de tienda online (e-commerce) de joyería, desarrollada como Trabajo Práctico Integrador de la cátedra Programación IV de la Tecnicatura Universitaria en Programación (UTN FRCU).

Integra autenticación de usuarios con JWT, recuperación de contraseña por correo, gestión completa de carrito y órdenes de compra, control de stock, diferenciación de roles (cliente / administrador) y un panel de administración.

Integrantes: Espinosa Ezequiel, Maldonado Carlos, Ocampo Iván y Sanchez Mauricio.


## Arquitectura

El proyecto sigue una arquitectura cliente-servidor:

    luxury/
    ├── backend/     API REST (Node.js + Express + MongoDB/Mongoose)
    └── frontend/    SPA (React + Vite)

Tecnologías utilizadas:

- Frontend: React 19, Vite, React Router, Axios, Context API.
- Backend: Node.js, Express 5, Mongoose, JWT, bcrypt, Nodemailer.
- Base de datos: MongoDB Atlas (NoSQL).


## Requisitos previos

- Node.js v18 o superior (incluye npm).
- Una base de datos en MongoDB Atlas (o MongoDB local).
- Una cuenta SMTP para el envío de correos de recuperación de contraseña
  (por ejemplo, Gmail con contraseña de aplicación, Mailtrap, etc.).


## Puesta en marcha

Se necesitan dos terminales (una para el backend y otra para el frontend).

1. Clonar el repositorio:

    git clone https://github.com/Ivan-Ocampo/TUP_PROG4_luxury26.git
    cd luxury

2. Backend:

    cd backend
    npm install
    cp .env.example .env      (luego completar las variables, ver más abajo)
    npm run dev               (arranca en http://localhost:3000)

3. Frontend:

    cd frontend
    npm install
    cp .env.example .env      (luego completar VITE_API_BASE_URL)
    npm run dev               (arranca en http://localhost:5173)

Abrir el navegador en http://localhost:5173


## Variables de entorno

Archivo backend/.env:

- PORT: puerto del servidor de la API. Ejemplo: 3000
- MONGODB_URI: cadena de conexión a MongoDB Atlas.
- JWT_SECRET: clave secreta para firmar los tokens JWT.
- FRONTEND_URL: URL del frontend (usada en el enlace de recuperación de contraseña).
- SMTP_HOST: host del servidor SMTP.
- SMTP_PORT: puerto SMTP.
- SMTP_SECURE: true si usa SSL (puerto 465), false en caso contrario.
- SMTP_USER: usuario o cuenta SMTP.
- SMTP_PASS: contraseña o contraseña de aplicación SMTP.
- MAIL_FROM: remitente que figura en los correos enviados.

Archivo frontend/.env:

- VITE_API_BASE_URL: URL base del backend. Ejemplo: http://localhost:3000


## Funcionalidades principales

- Autenticación y autorización: registro, login, JWT, encriptación de contraseñas (bcrypt), middleware de autenticación y de autorización por roles.
- Recuperación de contraseña por correo electrónico (token temporal de un solo uso).
- Catálogo de productos: nombre, precio, categoría, descripción y stock.
- Carrito de compras: agregar, modificar cantidades, eliminar, vaciar y ver total.
  Si un producto queda con stock insuficiente, se conserva en el carrito resaltado
  mostrando el stock disponible para ajustar la cantidad (solo se eliminan los
  productos dados de baja o inactivos).
- Órdenes de compra: generación, asociación al usuario, descuento de stock, número
  de orden autoincremental, historial y detalle. La confirmación valida el stock de
  todo el carrito de forma atómica: si algún producto no alcanza, la compra se
  bloquea, se avisa al usuario con el detalle de los faltantes y el carrito se
  conserva intacto.
- Perfil de usuario: ver y editar datos personales, cambiar contraseña.
- Panel de administrador: ABM de productos (con baja lógica y stock), gestión de usuarios (editar, baja lógica y recuperar) y visualización de órdenes.
- Estado global mediante Context API y persistencia de sesión con localStorage.


## Entrega

- Repositorio: https://github.com/Ivan-Ocampo/TUP_PROG4_luxury26.git
- Cátedra: Programación IV - TUP UTN FRCU 2026.
