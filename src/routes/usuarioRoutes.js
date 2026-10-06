const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth');
const {
  crearUsuario,
  listarUsuarios,
  obtenerUsuario,
  eliminarUsuario,
} = require('../controllers/usuarioController');

// El registro de usuario queda publico para poder crear el primer usuario del sistema.
router.post('/', crearUsuario);

// El resto de operaciones requieren estar autenticado.
router.get('/', verificarToken, listarUsuarios);
router.get('/:id', verificarToken, obtenerUsuario);
router.delete('/:id', verificarToken, eliminarUsuario);

module.exports = router;
