const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  crearProducto,
  listarProductos,
  obtenerProducto,
  actualizarProducto,
  eliminarProducto,
} = require('../controllers/productoController');

// Todas las rutas de productos requieren estar autenticado.
router.use(verificarToken);

// El campo del formulario/form-data para el archivo debe llamarse "imagen".
router.post('/', upload.single('imagen'), crearProducto);
router.get('/', listarProductos);
router.get('/:id', obtenerProducto);
router.put('/:id', upload.single('imagen'), actualizarProducto);
router.delete('/:id', eliminarProducto);

module.exports = router;
