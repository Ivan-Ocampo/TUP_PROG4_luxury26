const { Producto } = require('../models/producto');

const crearProducto = async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();
    res.status(201).json({ mensaje: 'Producto creado', producto: nuevoProducto });
  } catch (error) {
    console.error("🔥 EXPLOTÓ EL BACKEND AL CREAR. Detalles:", error);
    res.status(500).json({ mensaje: 'Error al crear producto', error: error.message });
  }
};

const obtenerProductosActivos = async (req, res) => {
  try {
    // populate() trae los datos de la categoría en lugar de solo mostrar el ID
    const productos = await Producto.find({ activo: true }).populate('categoriaId');
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el catálogo', error: error.message });
  }
};

const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id).populate('categoriaId');
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el producto', error: error.message });
  }
};

const modificarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ mensaje: 'Producto modificado', producto });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al modificar', error: error.message });
  }
};

const bajaLogicaProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, { activo: false }, { new: true });
    res.status(200).json({ mensaje: 'Producto retirado del catálogo', producto });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al dar de baja', error: error.message });
  }
};

module.exports = { crearProducto, obtenerProductosActivos, obtenerProductoPorId, modificarProducto, bajaLogicaProducto };