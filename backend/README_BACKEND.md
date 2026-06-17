# Backend — Luxury Joyería

API REST de la aplicación **Luxury Joyería**, desarrollada como parte del Trabajo Práctico
Integrador de Programación IV (UTN FRCU). Gestiona autenticación, usuarios, productos,
categorías, carrito, órdenes de compra y notificaciones, con persistencia en MongoDB.

---

## 🛠️ Tecnologías

- **Node.js** + **Express 5** — servidor y enrutamiento.
- **MongoDB Atlas** + **Mongoose** — base de datos NoSQL y modelado de objetos.
- **JSON Web Tokens (jsonwebtoken)** — autenticación basada en tokens.
- **bcrypt / bcryptjs** — encriptación de contraseñas.
- **Nodemailer** — envío de correos (recuperación de contraseña).
- **CORS** — control de acceso cross-origin.
- **dotenv** — manejo de variables de entorno.

---

## 📂 Estructura del proyecto

```
backend/
└── src/
    ├── app.js              → Configuración de Express y montaje de rutas
    ├── server.js           → Conexión a MongoDB y arranque del servidor
    ├── controllers/        → Lógica de negocio
    ├── models/             → Esquemas de Mongoose
    ├── routes/             → Definición de endpoints
    ├── middleware/         → Autenticación y autorización
    └── utils/              → Utilidades (mailer)
```

---

## ✅ Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior.
- Una base de datos en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (o MongoDB local).
- Credenciales SMTP para el envío de correos.

---

## 🔐 Variables de entorno

Crear un archivo `.env` en la carpeta `backend/` (podés copiar `.env.example`):

```env
# Servidor
PORT=3000

# Base de datos
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/luxury

# Autenticación
JWT_SECRET=un_secreto_largo_y_aleatorio

# Recuperación de contraseña
FRONTEND_URL=http://localhost:5173

# Correo (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tucuenta@gmail.com
SMTP_PASS=contraseña_de_aplicacion
MAIL_FROM="Luxury Joyería <no-reply@luxury.com>"
```

---

## 📦 Dependencias

| Producción | Desarrollo |
|------------|------------|
| express, mongoose, jsonwebtoken, bcrypt, bcryptjs, nodemailer, cors, dotenv | nodemon |

Se instalan todas con un solo comando:

```bash
npm install
```

---

## ▶️ Instalación y ejecución

```bash
cd backend
npm install
# crear y completar el archivo .env

# modo desarrollo (con recarga automática vía nodemon)
npm run dev

# modo producción
npm start
```

El servidor corre en **http://localhost:3000**.

---

## 🔑 Autenticación y roles

- La autenticación se realiza con **JWT**. Tras el login se devuelve un `token` que el
  frontend debe enviar en el header: `Authorization: Bearer <token>`.
- Roles disponibles: **`cliente`** (por defecto) y **`administrador`**.
- Middlewares:
  - `authMiddleware` → exige un token válido.
  - `adminMiddleware` → exige además rol `administrador`.

En las tablas de endpoints, la columna **Acceso** indica:
- 🌐 **Público** — no requiere token.
- 🔒 **Auth** — requiere usuario autenticado.
- 👑 **Admin** — requiere rol administrador.

---

## 📚 Documentación de endpoints

> URL base: `http://localhost:3000`

### 🔑 Autenticación — `/api/auth`

| Método | Ruta | Acceso | Descripción | Body |
|--------|------|--------|-------------|------|
| POST | `/api/auth/login` | 🌐 | Inicia sesión y devuelve el JWT. | `{ email, password }` |
| POST | `/api/auth/forgot-password` | 🌐 | Solicita el correo de recuperación. | `{ email }` |
| POST | `/api/auth/reset-password/:token` | 🌐 | Restablece la contraseña con el token. | `{ password }` |

### 👤 Usuarios — `/api/usuarios`

| Método | Ruta | Acceso | Descripción | Body |
|--------|------|--------|-------------|------|
| POST | `/api/usuarios` | 🌐 | Registra un nuevo usuario (crea su carrito). | `{ nombre, apellido, email, password, dni, ... }` |
| GET | `/api/usuarios` | 👑 | Lista todos los usuarios. | — |
| GET | `/api/usuarios/perfil` | 🔒 | Datos del usuario autenticado. | — |
| PUT | `/api/usuarios/perfil` | 🔒 | Edita el perfil propio (y contraseña). | `{ nombre, email, ..., passwordActual?, nuevaPassword? }` |
| PATCH | `/api/usuarios/perfil` | 🔒 | Baja lógica de la cuenta propia. | — |
| GET | `/api/usuarios/:id` | 🌐 | Obtiene un usuario por id. | — |
| PUT | `/api/usuarios/:id` | 👑 | Edita un usuario (rol, estado, etc.). | `{ nombre, email, rol, activo }` |
| DELETE | `/api/usuarios/:id` | 👑 | Elimina un usuario de forma definitiva. | — |

### 💍 Productos — `/api/productos`

| Método | Ruta | Acceso | Descripción | Body |
|--------|------|--------|-------------|------|
| GET | `/api/productos` | 🌐 | Lista de productos (con categoría poblada). | — |
| GET | `/api/productos/:id` | 🌐 | Detalle de un producto. | — |
| POST | `/api/productos` | 👑 | Crea un producto. | `{ nombre, descripcion, precio, categoriaId, stock, imagenUrl }` |
| PUT | `/api/productos/:id` | 👑 | Modifica un producto (incluye stock y baja lógica vía `activo`). | `{ ...campos }` |
| PATCH | `/api/productos/:id/baja` | 👑 | Baja lógica del producto. | — |

### 🏷️ Categorías — `/api/categorias`

| Método | Ruta | Acceso | Descripción | Body |
|--------|------|--------|-------------|------|
| GET | `/api/categorias` | 🌐 | Lista de categorías. | — |
| POST | `/api/categorias` | 👑 | Crea una categoría. | `{ nombre, descripcion }` |
| PUT | `/api/categorias/:id` | 🌐 | Modifica una categoría. | `{ nombre, descripcion }` |
| PATCH | `/api/categorias/:id/baja` | 👑 | Baja lógica de la categoría. | — |

### 🛒 Carrito — `/api/carrito` *(todas requieren autenticación)*

| Método | Ruta | Acceso | Descripción | Body |
|--------|------|--------|-------------|------|
| GET | `/api/carrito/:usuarioId` | 🔒 | Obtiene el carrito del usuario. | — |
| POST | `/api/carrito/:usuarioId/items` | 🔒 | Agrega un producto al carrito. | `{ productoId, cantidad }` |
| PATCH | `/api/carrito/:usuarioId/items/:productoId` | 🔒 | Modifica la cantidad de un ítem. | `{ cantidad }` |
| DELETE | `/api/carrito/:usuarioId/items/:productoId` | 🔒 | Elimina un ítem del carrito. | — |
| DELETE | `/api/carrito/:usuarioId` | 🔒 | Vacía el carrito completo. | — |

### 📦 Órdenes de compra — `/api/ordenes`

| Método | Ruta | Acceso | Descripción | Body |
|--------|------|--------|-------------|------|
| POST | `/api/ordenes/:usuarioId` | 🔒 | Genera una orden desde el carrito (descuenta stock). | `{ datosFacturacion, pagos }` |
| GET | `/api/ordenes/usuario/:usuarioId` | 🔒 | Historial del usuario (`?estado=activa\|entregada`). | — |
| GET | `/api/ordenes/admin` | 👑 | Lista todas las órdenes (`?estado=&busqueda=&numeroOrden=`). | — |
| PATCH | `/api/ordenes/:id/entregar` | 👑 | Marca una orden como entregada. | — |

### 🔔 Notificaciones — `/api/notificaciones` *(todas requieren autenticación)*

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/api/notificaciones/:usuarioId` | 🔒 | Notificaciones del usuario. |
| DELETE | `/api/notificaciones/una/:id` | 🔒 | Elimina una notificación. |
| DELETE | `/api/notificaciones/todas/:usuarioId` | 🔒 | Elimina todas las notificaciones del usuario. |

---

## 🗃️ Modelos de datos

| Modelo | Campos principales |
|--------|--------------------|
| **Usuario** | `nombre`, `apellido`, `email` (único), `password` (hash), `dni`, `telefono`, `direccionFacturacion`, `direccionEntrega`, `rol`, `activo`, `resetPasswordToken`, `resetPasswordExpires` |
| **Producto** | `nombre`, `descripcion`, `precio`, `categoriaId` (ref), `stock`, `imagenUrl`, `activo` |
| **Categoria** | `nombre`, `descripcion`, `activo` |
| **Carrito** | `usuarioId` (ref), `items[]` (producto, cantidad, precio), `total`, `expiraEn` |
| **OrdenCompra** | `usuarioId` (ref), `numeroOrden`, `items[]` (embebidos), `total`, `datosFacturacion`, `pagos`, `estado`, `fechaCreacion`, `fechaEntrega` |
| **Contador** | `nombre`, `valor` — secuencia atómica para `numeroOrden` |
| **Notificacion** | `usuarioId` (ref), `tipo`, `mensaje`, `fechaCreacion` |

---

## 🧩 Formato de respuestas

Las respuestas son JSON. En operaciones exitosas se devuelve el recurso y/o un campo
`mensaje`; en errores se devuelve `{ mensaje, error? }` con el código HTTP correspondiente
(`400` validación, `401` no autorizado, `403` sin permisos, `404` no encontrado,
`500` error interno).
