const { Asiento } = require('../models');

exports.getAsientos = async (req, res) => {
  try {
    const asientos = await Asiento.findAll({
      where: { viajeId: req.params.viajeId },
      order: [['numero', 'ASC']],
    });
    res.json(asientos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};