# Backend - Luxury Joyería

Este es el servidor de la aplicación Luxury Joyería, desarrollado como parte del Trabajo Práctico Integrador de la Tecnicatura Universitaria en Programación (UTN FRCU). Provee una API REST para la gestión de productos, categorías, usuarios y órdenes de compra.

## Tecnologías utilizadas
* **Node.js** & **Express**
* **MongoDB Atlas** (Persistencia de datos NoSQL)
* **Mongoose** (Modelado de objetos)
* **CORS** (Seguridad en peticiones cross-origin)

## Requisitos previos
Antes de comenzar, asegúrate de tener instalado:
* [Node.js](https://nodejs.org/) (versión 16 o superior)
* Una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) para la base de datos en la nube.

## Configuración del entorno
1.  Clona el repositorio o descarga los archivos.
2.  Crea un archivo llamado `.env` en la raíz del proyecto backend.
3.  Agrega las siguientes variables con tus credenciales:
    ```env
    PORT=3000
    MONGO_URI=tu_cadena_de_conexion_de_mongodb_atlas
    ```

## Instalación y ejecución
1.  Abre una terminal en la carpeta del backend.
2.  Instala las dependencias necesarias:
    ```bash
    npm install
    npm install -D nodemon
    npm install mongoose 
    npm install dotenv
    npm install bcrypt
    npm install cors
    
    ```
3.  Inicia el servidor en modo desarrollo:
    ```bash
    # Si tienes nodemon instalado:
    npm run dev
    # O bien con node:
    node app.js
    ```
    *El servidor debería estar corriendo en: http://localhost:3000*

## Endpoints principales
* `GET /api/productos`: Obtiene la lista completa de joyas.
* `GET /api/productos/:id`: Obtiene el detalle de una joya específica.
* `POST /api/usuarios`: Registra un nuevo usuario.
* `POST /api/ordenes`: Crea una nueva orden de compra.
