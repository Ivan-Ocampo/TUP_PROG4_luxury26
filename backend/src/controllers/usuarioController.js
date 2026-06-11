const { Usuario } = require('../models/usuario');
const {Carrito} = require('../models/carrito');
const bcrypt = require('bcrypt');

// Alta
const crearUsuario = async (req, res) => {
  try {
    const { email } = req.body;

    // Verificamos si ya existe un usuario con ese email
    const usuarioExistente = await Usuario.findOne({ email });
    
    // Si lo encuentra, cortamos la ejecución acá y devolvemos un error 400
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El email ingresado ya se encuentra registrado.' });
    }

    // 2. Si pasa la validación, procedemos a crearlo
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();

    // Le creamos un carrito automáticamente al registrarse
    const nuevoCarrito = new Carrito({ usuarioId: nuevoUsuario._id, items: [], total: 0 });
    await nuevoCarrito.save();

    res.status(201).json({ mensaje: 'Usuario creado con éxito', usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear usuario', error: error.message });
  }
};

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find(); // El admin vería todos
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
  }
};

const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuario', error: error.message });
  }
};

// Modificación
const actualizarUsuario = async (req, res) => {
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar usuario' });
  }
};

// Baja Lógica desde /mi-Perfil, el usuario se da de baja a sí mismo, no un admin a otro usuario
const bajaLogicaUsuario = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;
    
    const usuarioBaja = await Usuario.findByIdAndUpdate(idUsuario, { activo: false }, { returnDocument: 'after' });

    if (!usuarioBaja) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json({ mensaje: 'Usuario dado de baja exitosamente', usuario: usuarioBaja });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al dar de baja al usuario', error: error.message });
  }
};

//OBTENER PERFIL DEL USUARIO LOGUEADO
const obtenerPerfil = async (req, res) => {
  try {
    // req.usuario.id viene del token de validación (tu middleware de auth)
    const usuario = await Usuario.findById(req.usuario.id).select('-password'); 
    // El .select('-password') es por seguridad, para no enviarle el hash al frontend

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el perfil' });
  }
};

// ACTUALIZAR PERFIL DEL USUARIO LOGUEADO
const actualizarPerfil = async (req, res) => {
  try {
    const {
      nombre, apellido, email, dni, telefono,
      direccionFacturacion, direccionEntrega,
      passwordActual, nuevaPassword
    } = req.body;

    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    if (nombre)    usuario.nombre    = nombre;
    if (apellido)  usuario.apellido  = apellido;
    if (email)     usuario.email     = email;
    if (dni)       usuario.dni       = dni;
    if (telefono !== undefined) usuario.telefono = telefono;
    if (direccionFacturacion) usuario.direccionFacturacion = direccionFacturacion;
    if (direccionEntrega)     usuario.direccionEntrega     = direccionEntrega;

    if (nuevaPassword) {
      const passwordCorrecta = await bcrypt.compare(passwordActual, usuario.password);
      if (!passwordCorrecta) {
        return res.status(400).json({ mensaje: 'La contraseña actual es incorrecta' });
      }
      usuario.password = nuevaPassword;
    }

    const usuarioActualizado = await usuario.save();

    res.json({
      _id:                  usuarioActualizado._id,
      nombre:               usuarioActualizado.nombre,
      apellido:             usuarioActualizado.apellido,
      email:                usuarioActualizado.email,
      dni:                  usuarioActualizado.dni,
      direccionFacturacion: usuarioActualizado.direccionFacturacion,
      direccionEntrega:     usuarioActualizado.direccionEntrega,
      mensaje: 'Perfil actualizado con éxito'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el perfil' });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Usuario eliminado de la base de datos' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar usuario' });
  }
};

module.exports = { crearUsuario, obtenerUsuarios, obtenerUsuarioPorId, actualizarUsuario, bajaLogicaUsuario, obtenerPerfil, actualizarPerfil, eliminarUsuario };