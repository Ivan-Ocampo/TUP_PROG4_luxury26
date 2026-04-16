const express = require('express');
const cors = require('cors');


//rutas
const usuarioRoutes = require('./routes/usuarioRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const productoRoutes = require('./routes/productoRoutes');
const carritoRoutes = require('./routes/carritoRoutes');
const ordenCompraRoutes = require('./routes/ordenCompraRoutes');

const app = express();

app.use(cors({origin: 'http://localhost:5173'})); // Permitir solicitudes desde el frontend en localhost:3000

app.use(express.json());




app.use('/api/usuarios', usuarioRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/ordenes', ordenCompraRoutes);


module.exports = app;