const { Notificacion } = require('../models/notificacion');

// Obtener todas las notificaciones no eliminadas de un usuario
const obtenerNotificaciones = async (req, res) => {
  try {
    const notificaciones = await Notificacion.find({ usuarioId: req.params.usuarioId })
      .sort({ fechaCreacion: -1 });
    res.status(200).json(notificaciones);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener notificaciones', error: error.message });
  }
};

// El usuario elimina una notificación puntual
const eliminarNotificacion = async (req, res) => {
  try {
    await Notificacion.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensaje: 'Notificación eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar notificación', error: error.message });
  }
};

// El usuario elimina todas sus notificaciones de una vez
const eliminarTodasLasNotificaciones = async (req, res) => {
  try {
    await Notificacion.deleteMany({ usuarioId: req.params.usuarioId });
    res.status(200).json({ mensaje: 'Notificaciones eliminadas' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar notificaciones', error: error.message });
  }
};

module.exports = { obtenerNotificaciones, eliminarNotificacion, eliminarTodasLasNotificaciones };
