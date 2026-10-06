const pool = require('../config/db');

/**
 * Modelo de Producto. Cada funcion ejecuta una consulta contra la tabla "productos".
 * El campo "imagen" guarda la URL publica del archivo subido.
 */
const ProductoModel = {
  async crear({ nombre, marca, stock, precio, imagen }) {
    const query = `
      INSERT INTO productos (nombre, marca, stock, precio, imagen)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [nombre, marca, stock, precio, imagen]);
    return rows[0];
  },

  async listar() {
    const query = 'SELECT * FROM productos ORDER BY id ASC';
    const { rows } = await pool.query(query);
    return rows;
  },

  async buscarPorId(id) {
    const query = 'SELECT * FROM productos WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  async actualizar(id, { nombre, marca, stock, precio, imagen }) {
    const query = `
      UPDATE productos
      SET nombre = $1, marca = $2, stock = $3, precio = $4, imagen = $5
      WHERE id = $6
      RETURNING *
    `;
    const { rows } = await pool.query(query, [nombre, marca, stock, precio, imagen, id]);
    return rows[0];
  },

  async eliminar(id) {
    const query = 'DELETE FROM productos WHERE id = $1 RETURNING id, imagen';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },
};

module.exports = ProductoModel;
