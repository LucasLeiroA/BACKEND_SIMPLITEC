const express = require('express');
const router = express.Router();
const accessoryController = require('../controllers/accesoryController');
const { validateJWT, checkRole } = require('../middlewares/auth.middleware');


router.get('/dealer/:dealerId/accessories',accessoryController.getAllAccessories);
router.get('/dealer/:dealerId/accessories/:accessoryId', accessoryController.getAccessoryById);
router.post('/dealer/:dealerId/accessories',  validateJWT,  checkRole('dealer') , accessoryController.createAccessory);
router.put('/dealer/:dealerId/accessories/:accessoryId',  validateJWT,  checkRole('dealer') , accessoryController.updateAccessory);
router.delete('/dealer/:dealerId/accessories/:accessoryId',  validateJWT,  checkRole('dealer') , accessoryController.deleteAccessory);

module.exports = router;