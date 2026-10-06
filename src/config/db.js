const { Pool } = require('pg');
require('dotenv').config();

// Pool de conexiones a PostgreSQL. Usa las variables definidas en el archivo .env
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Verifica la conexion al iniciar la aplicacion
pool
  .connect()
  .then((client) => {
    console.log('Conexion a PostgreSQL establecida correctamente');
    client.release();
  })
  .catch((err) => {
    console.error('Error al conectar con PostgreSQL:', err.message);
  });

module.exports = pool;
