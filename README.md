# 💎 Luxury Joyería

Aplicación web full stack de tienda online (e-commerce) de joyería, desarrollada como
**Trabajo Práctico Integrador – Entrega Final** de la cátedra **Programación IV** de la
Tecnicatura Universitaria en Programación (UTN FRCU).

Integra autenticación de usuarios con JWT, recuperación de contraseña por correo, gestión
completa de carrito y órdenes de compra, control de stock, diferenciación de roles
(cliente / administrador) y un panel de administración.

**Integrantes:** Espinosa Ezequiel · Maldonado Carlos · Ocampo Iván · Sanchez Mauricio.

---

## 🧱 Arquitectura

El proyecto sigue una arquitectura cliente-servidor moderna:

```
luxury/
├── backend/     → API REST (Node.js + Express + MongoDB/Mongoose)
└── frontend/    → SPA (React + Vite)
```

| Capa     | Tecnología |
|----------|------------|
| Frontend | React 19, Vite, React Router, Axios, Context API |
| Backend  | Node.js, Express 5, Mongoose, JWT, bcrypt, Nodemailer |
| Base de datos | MongoDB Atlas (NoSQL) |

> 📄 Cada subproyecto tiene su propia documentación detallada:
> - [`backend/README_BACKEND.md`](backend/README_BACKEND.md) — API, endpoints y modelos.
> - [`frontend/README_FRONTEND.md`](frontend/README_FRONTEND.md) — interfaz, rutas y estado global.

---

## ✅ Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior (incluye `npm`).
- Una base de datos en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (o MongoDB local).
- Una cuenta SMTP para el envío de correos de recuperación de contraseña
  (por ejemplo, Gmail con contraseña de aplicación, Mailtrap, etc.).

---

## 🚀 Puesta en marcha rápida

Se necesitan **dos terminales** (una para el backend y otra para el frontend).

### 1. Clonar el repositorio

```bash
git clone https://github.com/Ivan-Ocampo/TUP_PROG4_luxury26.git
cd luxury
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env      # luego completar las variables (ver más abajo)
npm run dev               # arranca en http://localhost:3000
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env      # luego completar VITE_API_BASE_URL
npm run dev               # arranca en http://localhost:5173
```

Abrir el navegador en **http://localhost:5173**.

---

## 🔐 Variables de entorno

### `backend/.env`

| Variable        | Descripción                                                        | Ejemplo |
|-----------------|--------------------------------------------------------------------|---------|
| `PORT`          | Puerto del servidor de la API.                                     | `3000` |
| `MONGODB_URI`   | Cadena de conexión a MongoDB Atlas.                                | `mongodb+srv://usuario:pass@cluster.mongodb.net/luxury` |
| `JWT_SECRET`    | Clave secreta para firmar los tokens JWT.                          | `un_secreto_largo_y_aleatorio` |
| `FRONTEND_URL`  | URL del frontend (usada en el enlace de recuperación de contraseña).| `http://localhost:5173` |
| `SMTP_HOST`     | Host del servidor SMTP.                                            | `smtp.gmail.com` |
| `SMTP_PORT`     | Puerto SMTP.                                                       | `587` |
| `SMTP_SECURE`   | `true` si usa SSL (puerto 465), `false` en caso contrario.        | `false` |
| `SMTP_USER`     | Usuario / cuenta SMTP.                                             | `tucuenta@gmail.com` |
| `SMTP_PASS`     | Contraseña o contraseña de aplicación SMTP.                        | `abcd efgh ijkl mnop` |
| `MAIL_FROM`     | Remitente que figura en los correos enviados.                     | `"Luxury Joyería <no-reply@luxury.com>"` |

### `frontend/.env`

| Variable             | Descripción                          | Ejemplo |
|----------------------|--------------------------------------|---------|
| `VITE_API_BASE_URL`  | URL base del backend.                | `http://localhost:3000` |

---

## ✨ Funcionalidades principales

- **Autenticación y autorización:** registro, login, JWT, encriptación de contraseñas
  (bcrypt), middleware de autenticación y de autorización por roles.
- **Recuperación de contraseña** por correo electrónico (token temporal de un solo uso).
- **Catálogo de productos:** nombre, precio, categoría, descripción y stock.
- **Carrito de compras:** agregar, modificar cantidades, eliminar, vaciar y ver total.
- **Órdenes de compra:** generación, asociación al usuario, descuento de stock, número
  de orden autoincremental, historial y detalle.
- **Perfil de usuario:** ver y editar datos personales, cambiar contraseña.
- **Panel de administrador:** ABM de productos (con baja lógica y stock), gestión de
  usuarios (editar / baja lógica / recuperar) y visualización de órdenes.
- **Estado global** mediante Context API y persistencia de sesión con `localStorage`.

---

## 📦 Entrega

- **Repositorio:** https://github.com/Ivan-Ocampo/TUP_PROG4_luxury26.git
- **Cátedra:** Programación IV — TUP UTN FRCU 2026.
