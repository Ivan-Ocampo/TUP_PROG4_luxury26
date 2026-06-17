const { OrdenCompra } = require('../models/ordenCompra');
const { Carrito } = require('../models/carrito');
const { Producto } = require('../models/producto');
const { Usuario } = require('../models/usuario');
const { Contador } = require('../models/contador');

const generarOrden = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { datosFacturacion, pagos } = req.body;

    const carrito = await Carrito.findOne({ usuarioId });
    if (!carrito || carrito.items.length === 0) {
      return res.status(400).json({ mensaje: 'El carrito está vacío' });
    }

    const itemsEmbebidos = [];
    const stockDescontado = [];

    for (let item of carrito.items) {
      const producto = await Producto.findOneAndUpdate(
        { _id: item.productoId, activo: true, stock: { $gte: item.cantidad } },
        { $inc: { stock: -item.cantidad } },
        { new: false }
      );

      if (!producto) {
        for (let { id, cantidad } of stockDescontado) {
          await Producto.findByIdAndUpdate(id, { $inc: { stock: cantidad } });
        }
        const info = await Producto.findById(item.productoId).select('nombre activo stock');
        const motivo = !info || !info.activo
          ? 'ya no está disponible'
          : `stock insuficiente (disponible: ${info?.stock ?? 0})`;
        return res.status(400).json({ mensaje: `Producto "${info?.nombre ?? item.productoId}": ${motivo}.` });
      }

      stockDescontado.push({ id: producto._id, cantidad: item.cantidad });
      itemsEmbebidos.push({
        productoId: producto._id,
        nombre: producto.nombre,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario
      });
    }

    // Número de orden atómico: $inc en Contador evita duplicados con concurrencia
    const contador = await Contador.findOneAndUpdate(
      { nombre: 'ordenCompra' },
      { $inc: { valor: 1 } },
      { new: true, upsert: true }
    );

    const nuevaOrden = new OrdenCompra({
      usuarioId: carrito.usuarioId,
      items: itemsEmbebidos,
      total: carrito.total,
      datosFacturacion,
      pagos,
      numeroOrden: contador.valor
    });

    await nuevaOrden.save();

    carrito.items = [];
    carrito.total = 0;
    await carrito.save();

    res.status(201).json({ mensaje: 'Orden de compra generada con éxito', orden: nuevaOrden });
  } catch (error) {
    console.error('[generarOrden] Error:', error);
    res.status(500).json({ mensaje: 'Error al generar la orden', error: error.message });
  }
};

const obtenerOrdenesPorUsuario = async (req, res) => {
  try {
    const filtro = { usuarioId: req.params.usuarioId };

    if (req.query.estado === 'activa') {
      // Incluye órdenes con estado='activa' Y las que no tienen el campo (creadas antes del modelo nuevo)
      filtro.$or = [{ estado: 'activa' }, { estado: { $exists: false } }];
    } else if (req.query.estado) {
      filtro.estado = req.query.estado;
    }

    const ordenes = await OrdenCompra.find(filtro).sort({ fechaCreacion: -1 });
    res.status(200).json(ordenes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el historial de compras', error: error.message });
  }
};

const marcarEntregada = async (req, res) => {
  try {
    const orden = await OrdenCompra.findById(req.params.id);
    if (!orden) return res.status(404).json({ mensaje: 'Orden no encontrada' });
    if (orden.estado === 'entregada') {
      return res.status(400).json({ mensaje: 'La orden ya fue marcada como entregada' });
    }

    orden.estado = 'entregada';
    orden.fechaEntrega = new Date();
    await orden.save();

    res.status(200).json({ mensaje: 'Orden marcada como entregada', orden });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al marcar la orden', error: error.message });
  }
};

const obtenerOrdenesAdmin = async (req, res) => {
  try {
    const filtro = {};
    if (req.query.estado)      filtro.estado = req.query.estado;
    if (req.query.numeroOrden) filtro.numeroOrden = Number(req.query.numeroOrden);

    // Búsqueda de usuario por nombre, apellido, email o DNI
    if (req.query.busqueda) {
      const regex = new RegExp(req.query.busqueda.trim(), 'i');
      const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { apellido: regex }, { email: regex }, { dni: regex }]
      }).select('_id');
      filtro.usuarioId = { $in: usuarios.map(u => u._id) };
    }

    const ordenes = await OrdenCompra.find(filtro)
      .populate('usuarioId', 'nombre apellido email dni')
      .sort({ fechaCreacion: -1 });

    res.status(200).json(ordenes);
  } catch (error) {
    console.error('[obtenerOrdenesAdmin] Error:', error);
    res.status(500).json({ mensaje: 'Error al consultar las órdenes', error: error.message });
  }
};

module.exports = { generarOrden, obtenerOrdenesPorUsuario, marcarEntregada, obtenerOrdenesAdmin };
