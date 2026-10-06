const ClienteModel = require('../models/clienteModel');

/**
 * POST /api/clientes
 */
async function crearCliente(req, res) {
  try {
    const { nombre, apellido, numero_identificacion, telefono } = req.body;

    if (!nombre || !apellido || !numero_identificacion) {
      return res.status(400).json({
        mensaje: 'nombre, apellido y numero_identificacion son obligatorios',
      });
    }

    const existente = await ClienteModel.buscarPorIdentificacion(numero_identificacion);
    if (existente) {
      return res.status(409).json({ mensaje: 'Ya existe un cliente con ese numero de identificacion' });
    }

    const cliente = await ClienteModel.crear({ nombre, apellido, numero_identificacion, telefono });
    return res.status(201).json(cliente);
  } catch (error) {
    console.error('Error al crear cliente:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

/**
 * GET /api/clientes
 */
async function listarClientes(req, res) {
  try {
    const clientes = await ClienteModel.listar();
    return res.json(clientes);
  } catch (error) {
    console.error('Error al listar clientes:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

/**
 * GET /api/clientes/:id
 */
async function obtenerCliente(req, res) {
  try {
    const cliente = await ClienteModel.buscarPorId(req.params.id);
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    return res.json(cliente);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

/**
 * PUT /api/clientes/:id
 */
async function actualizarCliente(req, res) {
  try {
    const { nombre, apellido, numero_identificacion, telefono } = req.body;

    const clienteExistente = await ClienteModel.buscarPorId(req.params.id);
    if (!clienteExistente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    const clienteActualizado = await ClienteModel.actualizar(req.params.id, {
      nombre: nombre ?? clienteExistente.nombre,
      apellido: apellido ?? clienteExistente.apellido,
      numero_identificacion: numero_identificacion ?? clienteExistente.numero_identificacion,
      telefono: telefono ?? clienteExistente.telefono,
    });

    return res.json(clienteActualizado);
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

/**
 * DELETE /api/clientes/:id
 */
async function eliminarCliente(req, res) {
  try {
    const eliminado = await ClienteModel.eliminar(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    return res.json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

module.exports = {
  crearCliente,
  listarClientes,
  obtenerCliente,
  actualizarCliente,
  eliminarCliente,
};
