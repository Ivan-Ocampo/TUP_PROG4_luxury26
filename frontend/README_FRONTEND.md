# Frontend - Luxury Joyería

Interfaz de usuario para el e-commerce Luxury Joyería, construida con React y Vite. Esta aplicación se conecta con el backend para ofrecer un catálogo dinámico y una experiencia de usuario fluida.

## Tecnologías utilizadas
* **React** (Vite)
* **React Router Dom** (Navegación SPA)
* **Axios** (Consumo de API)
* **CSS Puro** (Diseño de componentes y animaciones)

## Requisitos previos
* [Node.js](https://nodejs.org/) instalado.
* El servidor **Backend** debe estar corriendo para que la aplicación muestre datos.

## Configuración del entorno
1.  Navega a la carpeta del frontend.
2.  Crea un archivo llamado `.env` en la raíz de esta carpeta.
3.  Define la URL base de tu API (la dirección de tu backend):
    ```env
    VITE_API_BASE_URL=http://localhost:3000
    ```

## Instalación y ejecución
1.  Instala las dependencias del proyecto:
    ```bash
    npm install
    npm intall axios     
    ```
2.  Inicia la aplicación en modo desarrollo:
    ```bash
    npm run dev
    ```
3.  Abre la URL que te indique la terminal (usualmente http://localhost:5173).

## Características implementadas
* **Catálogo Dinámico:** Renderizado automático de productos desde la base de datos.
* **Detalle de Producto:** Rutas dinámicas para visualizar información técnica de cada joya.
* **Feedback de Usuario:** Spinner de carga personalizado para mejorar la UX durante peticiones asíncronas.
* **Diseño Responsivo:** Grilla de productos adaptable mediante CSS Grid.
