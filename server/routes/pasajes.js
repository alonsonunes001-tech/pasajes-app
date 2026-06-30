const router = require('express').Router();
const auth   = require('../middlewares/auth');
const {
  comprarPasaje, getMisPasajes, getPasaje
} = require('../controllers/pasajesController');

router.post('/',              auth, comprarPasaje);
router.get('/mis-pasajes',    auth, getMisPasajes);
router.get('/:id',            auth, getPasaje);

module.exports = router;