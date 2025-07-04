const express = require('express')
const router = express.Router()
const leadController = require('../controllers/leadController')
const { validateJWT, checkRole } = require('../middlewares/auth.middleware')
const optionalAuth = require('../middlewares/optionalAuth')

router.get(
  '/dealer/:dealerId/leads',
  validateJWT,
  checkRole('dealer'),
  leadController.getLeadsByDealer
)

router.post('/dealer/:dealerId/leads', optionalAuth, leadController.createLead)

module.exports = router
