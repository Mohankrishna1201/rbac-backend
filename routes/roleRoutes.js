const express = require('express');
const userController = require('../controllers/userController');
const { authorizeAdmin, verifyToken, authenticate } = require('../middleware/authMiddleware')
const router = express.Router();

// Routes for roles
router.get('/roles', userController.getAllRoles); // Assuming a function to fetch all roles is implemented

// Routes for managing user roles
router.post('/user/role', authenticate, authorizeAdmin, userController.updateUserRole); // Update user role
router.delete('/user/role', authenticate, authorizeAdmin, userController.removeUserRole); // Remove user role

// Routes for user permissions
router.get('/user/:userId/permissions', authenticate, authorizeAdmin, userController.getUserPermissions); // Get all permissions for a user
router.post('/user/permissions', authenticate, authorizeAdmin, userController.addPermissionToUser); // Add a permission to a user
router.put('/user/permissions', authenticate, authorizeAdmin, userController.updateUserPermissions); // Update user permissions
router.delete('/user/permissions', authenticate, authorizeAdmin, userController.removePermissionFromUser); // Remove a specific permission from a user

// Routes for user details
router.get('/user/:userId', authenticate, authorizeAdmin, userController.getUserDetails); // Get user details
router.post('/user/disable', authenticate, authorizeAdmin, userController.disableUser); // Disable a user

module.exports = router;
