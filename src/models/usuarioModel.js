const pool = require('../config/db');

/**
 * Modelo de Usuario. Cada funcion ejecuta una consulta contra la tabla "usuarios".
 */
const UsuarioModel = {
  async crear(username, passwordHash) {
    const query = `
      INSERT INTO usuarios (username, password)
      VALUES ($1, $2)
      RETURNING id, username, creado_en
    `;
    const { rows } = await pool.query(query, [username, passwordHash]);
    return rows[0];
  },

  async buscarPorUsername(username) {
    const query = 'SELECT * FROM usuarios WHERE username = $1';
    const { rows } = await pool.query(query, [username]);
    return rows[0];
  },

  async buscarPorId(id) {
    const query = 'SELECT id, username, creado_en FROM usuarios WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  async listar() {
    const query = 'SELECT id, username, creado_en FROM usuarios ORDER BY id ASC';
    const { rows } = await pool.query(query);
    return rows;
  },

  async eliminar(id) {
    const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING id';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },
};

module.exports = UsuarioModel;
