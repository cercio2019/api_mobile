const fs = require('fs');
const path = require('path');
const ProductoModel = require('../models/productoModel');

/**
 * Construye la URL publica de la imagen a partir del archivo guardado por multer.
 */
function construirUrlImagen(req, nombreArchivo) {
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  return `${baseUrl}/uploads/productos/${nombreArchivo}`;
}

/**
 * Elimina un archivo de imagen del disco a partir de su URL guardada en la BD.
 */
function eliminarArchivoImagen(imagenUrl) {
  if (!imagenUrl) return;
  const nombreArchivo = imagenUrl.split('/uploads/productos/')[1];
  if (!nombreArchivo) return;
  const rutaArchivo = path.join(__dirname, '..', '..', 'uploads', 'productos', nombreArchivo);
  fs.unlink(rutaArchivo, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error('No se pudo eliminar el archivo de imagen:', err.message);
    }
  });
}

/**
 * POST /api/productos
 * Crea un producto. Si se envia un archivo (campo "imagen"), se guarda y su URL
 * se almacena en la columna "imagen".
 */
async function crearProducto(req, res) {
  try {
    const { nombre, marca, stock, precio } = req.body;

    if (!nombre || precio === undefined) {
      return res.status(400).json({ mensaje: 'nombre y precio son obligatorios' });
    }

    const imagenUrl = req.file ? construirUrlImagen(req, req.file.filename) : null;

    const producto = await ProductoModel.crear({
      nombre,
      marca: marca || null,
      stock: stock ? Number(stock) : 0,
      precio: Number(precio),
      imagen: imagenUrl,
    });

    return res.status(201).json(producto);
  } catch (error) {
    console.error('Error al crear producto:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

/**
 * GET /api/productos
 */
async function listarProductos(req, res) {
  try {
    const productos = await ProductoModel.listar();
    return res.json(productos);
  } catch (error) {
    console.error('Error al listar productos:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

/**
 * GET /api/productos/:id
 */
async function obtenerProducto(req, res) {
  try {
    const producto = await ProductoModel.buscarPorId(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    return res.json(producto);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

/**
 * PUT /api/productos/:id
 * Si se envia un nuevo archivo, reemplaza la imagen anterior (borrandola del disco).
 */
async function actualizarProducto(req, res) {
  try {
    const productoExistente = await ProductoModel.buscarPorId(req.params.id);
    if (!productoExistente) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    const { nombre, marca, stock, precio } = req.body;
    let imagenUrl = productoExistente.imagen;

    if (req.file) {
      imagenUrl = construirUrlImagen(req, req.file.filename);
      eliminarArchivoImagen(productoExistente.imagen);
    }

    const productoActualizado = await ProductoModel.actualizar(req.params.id, {
      nombre: nombre ?? productoExistente.nombre,
      marca: marca ?? productoExistente.marca,
      stock: stock !== undefined ? Number(stock) : productoExistente.stock,
      precio: precio !== undefined ? Number(precio) : productoExistente.precio,
      imagen: imagenUrl,
    });

    return res.json(productoActualizado);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

/**
 * DELETE /api/productos/:id
 * Elimina el producto y su imagen asociada del disco.
 */
async function eliminarProducto(req, res) {
  try {
    const eliminado = await ProductoModel.eliminar(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    eliminarArchivoImagen(eliminado.imagen);
    return res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

module.exports = {
  crearProducto,
  listarProductos,
  obtenerProducto,
  actualizarProducto,
  eliminarProducto,
};
