const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');


// Crear un usuario (Registro)
router.post('/', usuarioController.crearUsuario);

// Obtener todos los usuarios (solo para administradores)
router.get('/',authMiddleware, adminMiddleware , usuarioController.obtenerUsuarios);

// Obtener perfil del usuario logueado
router.get('/perfil', authMiddleware, usuarioController.obtenerPerfil);

// Actualizar datos del usuario logueado
router.put('/perfil', authMiddleware, usuarioController.actualizarPerfil);

// Obtener un usuario por su ID
router.get('/:id', usuarioController.obtenerUsuarioPorId);

// Modificar datos del usuario
router.put('/:id', usuarioController.modificarUsuario);

// Baja lógica del usuario
router.patch('/:id/baja', usuarioController.bajaLogicaUsuario);



module.exports = router;