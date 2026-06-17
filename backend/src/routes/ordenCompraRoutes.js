const express = require('express');
const router = express.Router();
const { generarOrden, obtenerOrdenesPorUsuario, marcarEntregada, obtenerOrdenesAdmin } = require('../controllers/ordenCompraController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Panel de administrador (acepta ?estado=&busqueda=&numeroOrden=)
router.get('/admin', authMiddleware, adminMiddleware, obtenerOrdenesAdmin);

// Generar orden a partir del carrito del usuario
router.post('/:usuarioId', authMiddleware, generarOrden);

// Historial del usuario (acepta ?estado=activa|entregada)
router.get('/usuario/:usuarioId', authMiddleware, obtenerOrdenesPorUsuario);

// Marcar una orden como entregada (la usan el cliente en "Mis Compras" y el admin)
router.patch('/:id/entregar', authMiddleware, marcarEntregada);

module.exports = router;
