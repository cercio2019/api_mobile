const pool = require('../config/db');

/**
 * Modelo de Cliente. Cada funcion ejecuta una consulta contra la tabla "clientes".
 */
const ClienteModel = {
  async crear({ nombre, apellido, numero_identificacion, telefono }) {
    const query = `
      INSERT INTO clientes (nombre, apellido, numero_identificacion, telefono)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [nombre, apellido, numero_identificacion, telefono]);
    return rows[0];
  },

  async listar() {
    const query = 'SELECT * FROM clientes ORDER BY id ASC';
    const { rows } = await pool.query(query);
    return rows;
  },

  async buscarPorId(id) {
    const query = 'SELECT * FROM clientes WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  async buscarPorIdentificacion(numero_identificacion) {
    const query = 'SELECT * FROM clientes WHERE numero_identificacion = $1';
    const { rows } = await pool.query(query, [numero_identificacion]);
    return rows[0];
  },

  async actualizar(id, { nombre, apellido, numero_identificacion, telefono }) {
    const query = `
      UPDATE clientes
      SET nombre = $1, apellido = $2, numero_identificacion = $3, telefono = $4
      WHERE id = $5
      RETURNING *
    `;
    const { rows } = await pool.query(query, [nombre, apellido, numero_identificacion, telefono, id]);
    return rows[0];
  },

  async eliminar(id) {
    const query = 'DELETE FROM clientes WHERE id = $1 RETURNING id';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },
};

module.exports = ClienteModel;
