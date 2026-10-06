const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware que verifica el token JWT enviado en el header Authorization.
 * Formato esperado: Authorization: Bearer <token>
 */
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ mensaje: 'Acceso denegado. No se proporciono un token.' });
  }

  const partes = authHeader.split(' ');
  const token = partes.length === 2 ? partes[1] : partes[0];

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. Token invalido.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // { id, username }
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token invalido o expirado.' });
  }
}

module.exports = verificarToken;
