const { Pasaje, Asiento, Viaje, Usuario, sequelize } = require('../models');

exports.comprarPasaje = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { viajeId, asientoId } = req.body;
    const usuarioId = req.usuario.id;

    // Bloquea la fila del asiento hasta que termine la transacción,
    // para que dos compras simultáneas no pasen el chequeo al mismo tiempo.
    const asiento = await Asiento.findByPk(asientoId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!asiento) {
      await t.rollback();
      return res.status(404).json({ error: 'Asiento no encontrado' });
    }

    if (!asiento.disponible) {
      await t.rollback();
      return res.status(409).json({ error: 'El asiento ya está ocupado' });
    }

    const viaje = await Viaje.findByPk(viajeId, { transaction: t });
    if (!viaje) {
      await t.rollback();
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }

    await asiento.update({ disponible: false }, { transaction: t });

    const pasaje = await Pasaje.create(
      { usuarioId, viajeId, asientoId, precio: viaje.precio },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json(pasaje);
  } catch (err) {
    await t.rollback();
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