const bcrypt = require('bcryptjs');
const UsuarioModel = require('../models/usuarioModel');

/**
 * POST /api/usuarios
 * Registra un nuevo usuario (username + password). El password se guarda encriptado.
 */
async function crearUsuario(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ mensaje: 'username y password son obligatorios' });
    }

    const existente = await UsuarioModel.buscarPorUsername(username);
    if (existente) {
      return res.status(409).json({ mensaje: 'Ya existe un usuario con ese username' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const nuevoUsuario = await UsuarioModel.crear(username, passwordHash);
    return res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

/**
 * GET /api/usuarios
 * Lista todos los usuarios (sin exponer el password).
 */
async function listarUsuarios(req, res) {
  try {
    const usuarios = await UsuarioModel.listar();
    return res.json(usuarios);
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

/**
 * GET /api/usuarios/:id
 */
async function obtenerUsuario(req, res) {
  try {
    const usuario = await UsuarioModel.buscarPorId(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    return res.json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

/**
 * DELETE /api/usuarios/:id
 */
async function eliminarUsuario(req, res) {
  try {
    const eliminado = await UsuarioModel.eliminar(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    return res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

module.exports = {
  crearUsuario,
  listarUsuarios,
  obtenerUsuario,
  eliminarUsuario,
};
