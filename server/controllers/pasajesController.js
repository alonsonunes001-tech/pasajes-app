const { Pasaje, Asiento, Viaje, Usuario } = require('../models');

exports.comprarPasaje = async (req, res) => {
  try {
    const { viajeId, asientoId } = req.body;
    const usuarioId = req.usuario.id;

    const asiento = await Asiento.findByPk(asientoId);
    if (!asiento)          return res.status(404).json({ error: 'Asiento no encontrado' });
    if (!asiento.disponible) return res.status(409).json({ error: 'El asiento ya está ocupado' });

    const viaje = await Viaje.findByPk(viajeId);
    if (!viaje) return res.status(404).json({ error: 'Viaje no encontrado' });

    await asiento.update({ disponible: false });
    const pasaje = await Pasaje.create({ usuarioId, viajeId, asientoId, precio: viaje.precio });

    res.status(201).json(pasaje);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMisPasajes = async (req, res) => {
  try {
    const pasajes = await Pasaje.findAll({
      where: { usuarioId: req.usuario.id },
      include: [
        { model: Viaje },
        { model: Asiento },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(pasajes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPasaje = async (req, res) => {
  try {
    const pasaje = await Pasaje.findOne({
      where: { id: req.params.id, usuarioId: req.usuario.id },
      include: [
        { model: Viaje },
        { model: Asiento },
        { model: Usuario, attributes: ['nombre', 'email'] },
      ],
    });
    if (!pasaje) return res.status(404).json({ error: 'Pasaje no encontrado' });
    res.json(pasaje);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};