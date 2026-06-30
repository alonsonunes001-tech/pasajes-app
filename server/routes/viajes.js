const router = require('express').Router();
const auth   = require('../middlewares/auth');
const {
  getViajes, createViaje, updateViaje, deleteViaje
} = require('../controllers/viajesController');

router.get('/',        getViajes);
router.post('/',       auth, createViaje);
router.put('/:id',     auth, updateViaje);
router.delete('/:id',  auth, deleteViaje);

module.exports = router;