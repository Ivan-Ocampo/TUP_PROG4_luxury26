const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');

// Obtener el carrito de un usuario específico
router.get('/:usuarioId', carritoController.obtenerCarrito);

// Agregar un item al carrito (le pasamos el producto y la cantidad por el body)
router.post('/:usuarioId/items', carritoController.agregarItemAlCarrito);

// Actualizar la cantidad de un item específico
router.patch('/:usuarioId/items/:productoId', carritoController.actualizarCantidadItem);

// Remover un item específico del carrito
router.delete('/:usuarioId/items/:productoId', carritoController.removerItemDelCarrito);

// Vaciar el carrito completo
router.delete('/:usuarioId', carritoController.vaciarCarrito);

module.exports = router;
