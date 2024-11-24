const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { getUserProfile, disableUser } = require('../controllers/userController');
const { authorizeAdmin, verifyToken } = require('../middleware/authMiddleware')

// User profile (regular users only)
router.get('/profile', authenticate, verifyToken, getUserProfile);  // View user roles and permissions

module.exports = router;
