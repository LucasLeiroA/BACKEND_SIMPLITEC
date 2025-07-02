const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { validateJWT, checkRole } = require('../middlewares/auth.middleware');


router.get(
  '/dealer/:dealerId/leads',
  validateJWT,
  checkRole('dealer'),
  leadController.getLeadsByDealer
);


router.post('/dealer/:dealerId/leads', leadController.createLead);

module.exports = router;
