const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Crear un nuevo producto (Joya)
router.post('/', authMiddleware, adminMiddleware, productoController.crearProducto);

// Obtener el catálogo de productos activos
router.get('/', productoController.obtenerProductos);

// Obtener el detalle de un producto específico
router.get('/:id', productoController.obtenerProductoPorId);

// Modificar un producto
router.put('/:id', authMiddleware, adminMiddleware, productoController.modificarProducto);

// Baja lógica de un producto (Retirarlo del catálogo)
router.patch('/:id/baja', authMiddleware, adminMiddleware, productoController.bajaLogicaProducto);

module.exports = router;