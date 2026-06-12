const { OrdenCompra} = require('../models/ordenCompra'); 
const {Carrito} = require('../models/carrito');
const { Producto } = require ('../models/producto');

const generarOrden = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    
    // 1. Buscamos el carrito del usuario
    const carrito = await Carrito.findOne({ usuarioId });
    if (!carrito || carrito.items.length === 0) {
      return res.status(400).json({ mensaje: 'El carrito está vacío' });
    }

    // Arreglo temporal donde construiremos los documentos embebidos
    const itemsEmbebidosParaLaOrden = [];
    const stockDescontado = []; // para rollback si algo falla a mitad

    // 3. Descuento atómico de stock: el check y el $inc ocurren en una sola
    // operación, eliminando la ventana de concurrencia (TOCTOU).
    for (let item of carrito.items) {
      const producto = await Producto.findOneAndUpdate(
        { _id: item.productoId, activo: true, stock: { $gte: item.cantidad } },
        { $inc: { stock: -item.cantidad } },
        { new: false } // devuelve el doc ANTES del update para leer nombre/precio
      );

      if (!producto) {
        // Rollback: restaurar el stock de los productos ya descontados
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
      itemsEmbebidosParaLaOrden.push({
        productoId: producto._id,
        nombre: producto.nombre,  
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario
      });
    }

    // 3. Creamos la Orden de Compra inyectando los items embebidos
    const nuevaOrden = new OrdenCompra({
      usuarioId: carrito.usuarioId,
      items: itemsEmbebidosParaLaOrden,
      total: carrito.total
    });
    
    await nuevaOrden.save();

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
    // Buscamos las órdenes del cliente. 
    const ordenes = await OrdenCompra.find({ usuarioId: req.params.usuarioId });
    
    res.status(200).json(ordenes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el historial de compras', error: error.message });
  }
};

// ==========================================
// 3. Consultar todas las ventas (Para Administradores)
// ==========================================
const obtenerTodasLasOrdenes = async (req, res) => {
  try {
    // Aquí sí poblamos el usuarioId para que el admin pueda ver el nombre o email de quien compró,
    // pero mantenemos los ítems sin poblar por su inmutabilidad.
    const ordenes = await OrdenCompra.find().populate('usuarioId', 'nombre email'); 
    
    res.status(200).json(ordenes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al consultar las órdenes', error: error.message });
  }
};

// Export
module.exports = { generarOrden, obtenerOrdenesPorUsuario, obtenerTodasLasOrdenes};