const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const productoRoutes = require('./routes/productoRoutes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sirve las imagenes de productos de forma publica: /uploads/productos/<archivo>
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Ruta de salud
app.get('/', (req, res) => {
  res.json({ mensaje: 'API mobile funcionando correctamente' });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/productos', productoRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Manejador de errores (incluye errores de multer, por ejemplo tipo/tamano de archivo invalido)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ mensaje: err.message || 'Error interno del servidor' });
});

module.exports = app;
