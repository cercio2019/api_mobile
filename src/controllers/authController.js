const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const UsuarioModel = require('../models/usuarioModel');

/**
 * POST /api/auth/login
 * Recibe username y password, valida las credenciales y devuelve un token JWT.
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ mensaje: 'username y password son obligatorios' });
    }

    const usuario = await UsuarioModel.buscarPorUsername(username);

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales invalidas' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({ mensaje: 'Credenciales invalidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, username: usuario.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    return res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: { id: usuario.id, username: usuario.username },
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

module.exports = { login };
