const { Viaje, Asiento } = require('../models');
const { Op } = require('sequelize');

exports.getViajes = async (req, res) => {
  try {
    const { origen, destino, fecha } = req.query;
    const where = {};
    if (origen)  where.origen  = { [Op.iLike]: `%${origen}%` };
    if (destino) where.destino = { [Op.iLike]: `%${destino}%` };
    if (fecha)   where.fecha   = fecha;

    const viajes = await Viaje.findAll({ where, order: [['fecha', 'ASC'], ['hora', 'ASC']] });
    res.json(viajes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createViaje = async (req, res) => {
  try {
    const { origen, destino, fecha, hora, precio, totalAsientos } = req.body;
    const viaje = await Viaje.create({ origen, destino, fecha, hora, precio, totalAsientos: totalAsientos || 40 });

    const asientos = [];
    for (let i = 1; i <= viaje.totalAsientos; i++) {
      asientos.push({ numero: i, disponible: true, viajeId: viaje.id });
    }
    await Asiento.bulkCreate(asientos);

    res.status(201).json(viaje);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateViaje = async (req, res) => {
  try {
    const viaje = await Viaje.findByPk(req.params.id);
    if (!viaje) return res.status(404).json({ error: 'Viaje no encontrado' });
    await viaje.update(req.body);
    res.json(viaje);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteViaje = async (req, res) => {
  try {
    const viaje = await Viaje.findByPk(req.params.id);
    if (!viaje) return res.status(404).json({ error: 'Viaje no encontrado' });
    await viaje.destroy();
    res.json({ mensaje: 'Viaje eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};