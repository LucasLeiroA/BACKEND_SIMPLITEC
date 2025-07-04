const express = require('express');
const router = express.Router();
const { login, register , getAllUsers , updateUser, deleteUser , getUsersByDealerId} = require('../controllers/authController');



router.get('/', getAllUsers);
router.get('/dealer/:dealerId', getUsersByDealerId)
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/login', login);
router.post('/register', register); 

module.exports = router;
