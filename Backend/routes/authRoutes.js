const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register/email', authController.registerEmail);
router.post('/verify/email', authController.verifyEmail);
router.post('/register/phone', authController.registerPhone);
router.post('/login/google', authController.googleLogin);

module.exports = router;