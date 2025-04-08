const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.put('/:id', auth, userController.updateUser);
router.post('/add-friend', auth, userController.addFriend);

module.exports = router;