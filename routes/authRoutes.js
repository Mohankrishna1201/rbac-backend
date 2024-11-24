const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');

// Register a new user
router.post('/register', registerUser);

// User login
router.post('/login', loginUser);

// User logout
router.post('/logout', logoutUser);

module.exports = router;
