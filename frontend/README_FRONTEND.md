# Frontend — Luxury Joyería

Interfaz de usuario (SPA) del e-commerce **Luxury Joyería**, construida con **React** y
**Vite**. Consume la API REST del backend y ofrece el catálogo, carrito, gestión de
órdenes, perfil de usuario y un panel de administración.

---

## 🛠️ Tecnologías

- **React 19** — librería de interfaz.
- **Vite** — bundler y servidor de desarrollo.
- **React Router DOM 7** — navegación SPA y rutas protegidas.
- **Axios** — consumo de la API.
- **React Icons** — iconografía.
- **Context API** — estado global (carrito y notificaciones).
- **CSS** — estilos por componente.

---

## 📂 Estructura del proyecto

```
frontend/
└── src/
    ├── App.jsx            → Definición de rutas (públicas, protegidas y admin)
    ├── pages/             → Vistas (catálogo, login, carrito, perfil, admin, etc.)
    ├── components/        → Componentes reutilizables (Navbar, ProductCard, guards, etc.)
    ├── context/           → Estado global (CartContext, NotificacionContext)
    ├── services/          → Llamadas a la API con Axios
    └── utils/             → Utilidades (manejo de token JWT, etc.)
```

---

## ✅ Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior.
- El **backend** debe estar corriendo para que la aplicación muestre datos.

---

## 🔐 Variables de entorno

Crear un archivo `.env` en la carpeta `frontend/` (podés copiar `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:3000
```

| Variable             | Descripción                | Ejemplo |
|----------------------|----------------------------|---------|
| `VITE_API_BASE_URL`  | URL base del backend.      | `http://localhost:3000` |

> ℹ️ En Vite, las variables expuestas al navegador **deben** comenzar con el prefijo `VITE_`.

---

## 📦 Dependencias

| Producción | Desarrollo |
|------------|------------|
| react, react-dom, react-router-dom, axios, react-icons | vite, @vitejs/plugin-react, eslint y plugins |

Se instalan todas con un solo comando:

```bash
npm install
```

---

## ▶️ Instalación y ejecución

```bash
cd frontend
npm install
# crear y completar el archivo .env

# servidor de desarrollo
npm run dev

# build de producción
npm run build

# previsualizar el build
npm run preview
```

La aplicación corre en **http://localhost:5173**.

---

## 🗺️ Rutas de la aplicación

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | 🌐 Público | Catálogo de productos. |
| `/producto/:id` | 🌐 Público | Detalle de un producto. |
| `/login` | 🌐 Público | Inicio de sesión. |
| `/registro` | 🌐 Público | Registro de usuario. |
| `/forgot-password` | 🌐 Público | Solicitud de recuperación de contraseña. |
| `/reset-password/:token` | 🌐 Público | Restablecimiento de contraseña. |
| `/carrito` | 🔒 Autenticado | Carrito de compras. |
| `/confirmar-compra` | 🔒 Autenticado | Confirmación y datos de la compra. |
| `/recibo` | 🔒 Autenticado | Recibo de la orden generada. |
| `/mis-compras` | 🔒 Autenticado | Historial de órdenes del cliente. |
| `/mi-Perfil` | 🔒 Autenticado | Ver y editar perfil. |
| `/admin/altaProducto` | 👑 Admin | Alta de producto. |
| `/admin/editarProducto/:id` | 👑 Admin | Edición de producto y stock. |
| `/admin/usuarios` | 👑 Admin | Gestión de usuarios. |
| `/admin/ordenes` | 👑 Admin | Gestión de órdenes. |

Las rutas protegidas se controlan con los componentes `ProtectedRoute` (autenticado) y
`AdminRoute` (rol administrador), que redirigen al login o al inicio según corresponda.

---

## 🌐 Estado global y sesión

- **Context API:** `CartContext` (carrito) y `NotificacionContext` (avisos).
- **Persistencia de sesión:** el token JWT se guarda en `localStorage` y se adjunta en el
  header `Authorization` de las peticiones protegidas.

---

## ✨ Características implementadas

- **Catálogo dinámico** con nombre, precio, categoría, descripción y **stock**.
- **Detalle de producto** con rutas dinámicas.
- **Carrito completo:** agregar, modificar cantidades, eliminar, vaciar y ver total.
- **Flujo de compra:** confirmación, generación de orden y recibo.
- **Perfil de usuario:** edición de datos y cambio de contraseña.
- **Panel de administración:** ABM de productos, gestión de usuarios y órdenes.
- **Recuperación de contraseña** desde la interfaz.
- **Feedback de usuario:** spinners de carga y notificaciones.
- **Diseño responsivo** mediante CSS Grid y media queries.
