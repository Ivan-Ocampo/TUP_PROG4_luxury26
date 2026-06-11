const { Carrito } = require('../models/carrito');
const { Producto } = require('../models/producto');

// ─────────────────────────────────────────────────────────────────────────────
// Función auxiliar reutilizada por obtenerCarrito y por authController (login).
// Recibe el documento carrito ya cargado y devuelve los nombres de los productos
// que fueron eliminados por falta de stock.
// ─────────────────────────────────────────────────────────────────────────────
const verificarYLimpiarStock = async (carrito) => {
  const eliminados = [];

  // Filtramos conservando solo los items con stock suficiente
  const itemsValidos = [];
  for (const item of carrito.items) {
    const producto = await Producto.findById(item.productoId);
    if (!producto || !producto.activo || producto.stock < item.cantidad) {
      // Guardamos el nombre para notificar al usuario
      eliminados.push(producto ? producto.nombre : `Producto ${item.productoId}`);
    } else {
      itemsValidos.push(item);
    }
  }

  if (eliminados.length > 0) {
    carrito.items = itemsValidos;
    carrito.total = itemsValidos.reduce((acc, i) => acc + i.cantidad * i.precioUnitario, 0);
    await carrito.save();
  }

  return eliminados;
};

// Extiende la expiración del carrito 15 minutos desde ahora
const extenderExpiracion = (carrito) => {
  carrito.expiraEn = new Date(Date.now() + 15 * 60 * 1000);
};

const obtenerCarrito = async (req, res) => {
  try {
    const carrito = await Carrito.findOne({ usuarioId: req.params.usuarioId }).populate('items.productoId');
    if (!carrito) return res.status(404).json({ mensaje: 'Carrito no encontrado' });

    // Si el carrito expiró, lo vaciamos
    if (carrito.expiraEn && carrito.expiraEn < new Date()) {
      carrito.items = [];
      carrito.total = 0;
      extenderExpiracion(carrito);
      await carrito.save();
      return res.status(200).json({ ...carrito.toObject(), itemsEliminados: [], carritoExpirado: true });
    }

    // Verificamos stock de cada item y eliminamos los que ya no tienen
    const itemsEliminados = await verificarYLimpiarStock(carrito);

    // Recargamos con populate tras posibles modificaciones
    const carritoActualizado = await Carrito.findOne({ usuarioId: req.params.usuarioId }).populate('items.productoId');

    res.status(200).json({ ...carritoActualizado.toObject(), itemsEliminados });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener carrito', error: error.message });
  }
};

const agregarItemAlCarrito = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { productoId, cantidad } = req.body;

    let carrito = await Carrito.findOne({ usuarioId });
    if (!carrito) {
      carrito = new Carrito({ usuarioId, items: [], total: 0 });
    }

    const producto = await Producto.findById(productoId);
    if (!producto || !producto.activo) return res.status(404).json({ mensaje: 'Producto no disponible' });
    if (producto.stock < cantidad) return res.status(400).json({ mensaje: 'Stock insuficiente' });

    const itemIndex = carrito.items.findIndex(item => item.productoId.toString() === productoId);
    if (itemIndex > -1) {
      carrito.items[itemIndex].cantidad += cantidad;
    } else {
      carrito.items.push({ productoId, cantidad, precioUnitario: producto.precio });
    }

    carrito.total = carrito.items.reduce((acc, item) => acc + item.cantidad * item.precioUnitario, 0);
    extenderExpiracion(carrito); // Cada modificación reinicia el contador de 24h
    await carrito.save();
    res.status(200).json({ mensaje: 'Producto agregado', carrito });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al agregar al carrito', error: error.message });
  }
};

const actualizarCantidadItem = async (req, res) => {
  try {
    const { usuarioId, productoId } = req.params;
    const { cantidad } = req.body;

    const carrito = await Carrito.findOne({ usuarioId });
    if (!carrito) return res.status(404).json({ mensaje: 'Carrito no encontrado' });

    const itemIndex = carrito.items.findIndex(item => item.productoId.toString() === productoId);
    if (itemIndex === -1) return res.status(404).json({ mensaje: 'Item no encontrado en el carrito' });

    const producto = await Producto.findById(productoId);
    if (producto && producto.stock < cantidad) return res.status(400).json({ mensaje: 'Stock insuficiente' });

    carrito.items[itemIndex].cantidad = cantidad;
    carrito.total = carrito.items.reduce((acc, item) => acc + item.cantidad * item.precioUnitario, 0);
    extenderExpiracion(carrito); // Cada modificación reinicia el contador de 24h
    await carrito.save();
    res.status(200).json({ mensaje: 'Cantidad actualizada', carrito });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar cantidad', error: error.message });
  }
};

const removerItemDelCarrito = async (req, res) => {
  try {
    const { usuarioId, productoId } = req.params;
    const carrito = await Carrito.findOne({ usuarioId });
    if (!carrito) return res.status(404).json({ mensaje: 'Carrito no encontrado' });

    carrito.items = carrito.items.filter(item => item.productoId.toString() !== productoId);
    carrito.total = carrito.items.reduce((acc, item) => acc + item.cantidad * item.precioUnitario, 0);
    extenderExpiracion(carrito);
    await carrito.save();
    res.status(200).json({ mensaje: 'Item removido', carrito });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al remover item', error: error.message });
  }
};

const vaciarCarrito = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const carrito = await Carrito.findOne({ usuarioId });
    if (!carrito) return res.status(404).json({ mensaje: 'Carrito no encontrado' });

    carrito.items = [];
    carrito.total = 0;
    extenderExpiracion(carrito);
    await carrito.save();
    res.status(200).json({ mensaje: 'Carrito vaciado', carrito });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al vaciar carrito', error: error.message });
  }
};

module.exports = {
  obtenerCarrito,
  agregarItemAlCarrito,
  actualizarCantidadItem,
  removerItemDelCarrito,
  vaciarCarrito,
  verificarYLimpiarStock  // exportado para usarlo en authController (login)
};
