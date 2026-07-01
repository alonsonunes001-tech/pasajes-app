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

    if (!origen || !destino || !fecha || !hora || !precio)
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });

    if (precio <= 0)
      return res.status(400).json({ error: 'El precio debe ser mayor a 0' });

    const asientos = parseInt(totalAsientos) || 40;
    if (asientos < 1 || asientos > 40)
      return res.status(400).json({ error: 'El total de asientos debe ser entre 1 y 40' });

    if (origen.trim().toLowerCase() === destino.trim().toLowerCase())
      return res.status(400).json({ error: 'El origen y destino no pueden ser iguales' });

    const viaje = await Viaje.create({ origen, destino, fecha, hora, precio, totalAsientos: asientos });

    const asientosArr = [];
    for (let i = 1; i <= viaje.totalAsientos; i++) {
      asientosArr.push({ numero: i, disponible: true, viajeId: viaje.id });
    }
    await Asiento.bulkCreate(asientosArr);

    res.status(201).json(viaje);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateViaje = async (req, res) => {
  try {
    const viaje = await Viaje.findByPk(req.params.id);
    if (!viaje) return res.status(404).json({ error: 'Viaje no encontrado' });

    const { precio, totalAsientos } = req.body;

    if (precio !== undefined && precio <= 0)
      return res.status(400).json({ error: 'El precio debe ser mayor a 0' });

    if (totalAsientos !== undefined) {
      const asientos = parseInt(totalAsientos);
      if (asientos < 1 || asientos > 40)
        return res.status(400).json({ error: 'El total de asientos debe ser entre 1 y 40' });
    }

    const origenFinal = req.body.origen || viaje.origen;
    const destinoFinal = req.body.destino || viaje.destino;
    if (origenFinal.trim().toLowerCase() === destinoFinal.trim().toLowerCase())
      return res.status(400).json({ error: 'El origen y destino no pueden ser iguales' });

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