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
const modificarUsuario = async (req, res) => {
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ mensaje: 'Usuario actualizado', usuario: usuarioActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar usuario', error: error.message });
  }
};

// Baja Lógica
const bajaLogicaUsuario = async (req, res) => {
  try {
    const usuarioBaja = await Usuario.findByIdAndUpdate(req.params.id, { activo: false }, { new: true });
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
    const { nombre, email, passwordActual, nuevaPassword } = req.body;

    // Buscamos al usuario en la base de datos
    const usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    //Actualizamos los datos básicos
    usuario.nombre = nombre || usuario.nombre;
    usuario.email = email || usuario.email;

    //Si el usuario mandó una contraseña nueva, hacemos el cambio
    if (nuevaPassword) {
      // Verificamos que la contraseña actual que escribió sea correcta
      const passwordCorrecta = await bcrypt.compare(passwordActual, usuario.password);
      
     if (!passwordCorrecta) {
        return res.status(400).json({ mensaje: 'La contraseña actual es incorrecta' });
      }

      
      usuario.password = nuevaPassword
    }

    // Guardamos los cambios en la base de datos
    const usuarioActualizado = await usuario.save();

    // Devolvemos los datos actualizados (sin la contraseña)
    res.json({
      _id: usuarioActualizado._id,
      nombre: usuarioActualizado.nombre,
      email: usuarioActualizado.email,
      mensaje: 'Perfil actualizado con éxito'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el perfil' });
  }
};

module.exports = { crearUsuario, obtenerUsuarios, obtenerUsuarioPorId, modificarUsuario, bajaLogicaUsuario, obtenerPerfil, actualizarPerfil };