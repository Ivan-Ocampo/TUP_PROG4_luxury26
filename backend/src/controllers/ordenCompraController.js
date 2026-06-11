const { OrdenCompra } = require('../models/ordenCompra');
const { Carrito } = require('../models/carrito');
const { Producto } = require('../models/producto');

const generarOrden = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    // datosFacturacion y pagos llegan en el body desde la página ConfirmarCompra
    const { datosFacturacion, pagos } = req.body;

    // 1. Buscamos el carrito del usuario
    const carrito = await Carrito.findOne({ usuarioId });
    if (!carrito || carrito.items.length === 0) {
      return res.status(400).json({ mensaje: 'El carrito está vacío' });
    }

    // 2. Validamos que los pagos sumen el total del carrito
    if (pagos && pagos.length > 0) {
      const sumaPagos = pagos.reduce((acc, p) => acc + p.monto, 0);
      if (Math.abs(sumaPagos - carrito.total) > 0.01) {
        return res.status(400).json({ mensaje: 'El monto de los pagos no coincide con el total del carrito' });
      }
    }

    const itemsEmbebidosParaLaOrden = [];

    // 3. Control de stock y construcción de items embebidos
    for (let item of carrito.items) {
      const producto = await Producto.findById(item.productoId);

      if (!producto || !producto.activo) {
        return res.status(404).json({ mensaje: 'Un producto del carrito ya no está disponible.' });
      }
      // Verificación de stock al momento de confirmar: si otro usuario agotó el stock
      // entre que este usuario agregó el producto y ahora, se bloquea la compra.
      if (producto.stock < item.cantidad) {
        return res.status(400).json({ mensaje: `Stock insuficiente para: ${producto.nombre}` });
      }

      itemsEmbebidosParaLaOrden.push({
        productoId:     producto._id,
        nombre:         producto.nombre,
        cantidad:       item.cantidad,
        precioUnitario: item.precioUnitario
      });
    }

    // 4. Creamos la Orden de Compra con datos de facturación y pagos
    const nuevaOrden = new OrdenCompra({
      usuarioId:        carrito.usuarioId,
      items:            itemsEmbebidosParaLaOrden,
      total:            carrito.total,
      datosFacturacion: datosFacturacion || {},
      pagos:            pagos || []
    });

    await nuevaOrden.save();

    // 5. Descontamos el stock — en este momento se "confirma" la preferencia:
    // el primer usuario en llegar hasta aquí descuenta el stock real.
    for (let item of carrito.items) {
      await Producto.findByIdAndUpdate(item.productoId, {
        $inc: { stock: -item.cantidad }
      });
    }

    // 6. Vaciamos el carrito
    carrito.items = [];
    carrito.total = 0;
    await carrito.save();

    res.status(201).json({
      mensaje: 'Orden de compra generada con éxito',
      orden: nuevaOrden
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al generar la orden', error: error.message });
  }
};

const obtenerOrdenesPorUsuario = async (req, res) => {
  try {
    const ordenes = await OrdenCompra.find({ usuarioId: req.params.usuarioId });
    res.status(200).json(ordenes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el historial de compras', error: error.message });
  }
};

const obtenerTodasLasOrdenes = async (req, res) => {
  try {
    const ordenes = await OrdenCompra.find().populate('usuarioId', 'nombre email');
    res.status(200).json(ordenes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al consultar las órdenes', error: error.message });
  }
};

module.exports = { generarOrden, obtenerOrdenesPorUsuario, obtenerTodasLasOrdenes };
