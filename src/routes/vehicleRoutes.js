const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const upload = require('../middlewares/upload');
const { validateJWT, checkRole } = require('../middlewares/auth.middleware');



router.get('/dealers/:id', vehicleController.getAllByDealer);
router.get('/dealers/:id/:vehicleId', vehicleController.getById);
router.post('/', validateJWT,  checkRole('dealer'), upload.array('images', 10), vehicleController.createVehicle);
router.put('/:id/:vehicleId', validateJWT,  checkRole('dealer'), upload.array('images', 10), vehicleController.updateVehicle);
router.delete('/dealers/:id/:vehicleId', validateJWT,  checkRole('dealer'),  vehicleController.deleteVehicle);


module.exports = router;