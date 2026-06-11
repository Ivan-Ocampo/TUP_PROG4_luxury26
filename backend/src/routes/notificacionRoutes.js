const express = require('express');
const router = express.Router();
const { obtenerNotificaciones, eliminarNotificacion, eliminarTodasLasNotificaciones } = require('../controllers/notificacionController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Obtener notificaciones del usuario
router.get('/:usuarioId', authMiddleware, obtenerNotificaciones);

// Eliminar una notificación específica
router.delete('/una/:id', authMiddleware, eliminarNotificacion);

// Eliminar todas las notificaciones del usuario
router.delete('/todas/:usuarioId', authMiddleware, eliminarTodasLasNotificaciones);

module.exports = router;
