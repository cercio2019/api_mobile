const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth');
const {
  crearCliente,
  listarClientes,
  obtenerCliente,
  actualizarCliente,
  eliminarCliente,
} = require('../controllers/clienteController');

// Todas las rutas de clientes requieren estar autenticado.
router.use(verificarToken);

router.post('/', crearCliente);
router.get('/', listarClientes);
router.get('/:id', obtenerCliente);
router.put('/:id', actualizarCliente);
router.delete('/:id', eliminarCliente);

module.exports = router;
