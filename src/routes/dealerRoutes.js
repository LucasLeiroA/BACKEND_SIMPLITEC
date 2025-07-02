const express = require('express');
const router = express.Router();
const dealerController = require('../controllers/dealerController');
const { validateJWT, checkRole } = require('../middlewares/auth.middleware');



router.get('/',  dealerController.getAllDealers);
router.get('/:id',  dealerController.getDealerById);
router.post('/', validateJWT, checkRole('admin'), dealerController.createDealer);
router.put('/:id', validateJWT, checkRole('admin'), dealerController.updateDealer);
router.delete('/:id', validateJWT, checkRole('admin'), dealerController.deleteDealer);

module.exports = router;
