const router = require('express').Router();
const { getAsientos } = require('../controllers/asientosController');

router.get('/:viajeId', getAsientos);

module.exports = router;