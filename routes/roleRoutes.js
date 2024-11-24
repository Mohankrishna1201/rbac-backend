const express = require('express');
const userController = require('../controllers/userController');
const { authorizeAdmin, verifyToken, authenticate } = require('../middleware/authMiddleware')
const router = express.Router();

// Routes for roles
router.get('/roles', userController.getAllRoles); // Assuming a function to fetch all roles is implemented
router.post('/add-user', userController.addUser);
router.post('/deleteUser', userController.deleteUser);
// Routes for managing user roles
router.post('/user/role', userController.updateUserRole); // Update user role
router.delete('/user/role', userController.removeUserRole); // Remove user role
router.post('/users/bulk', userController.addUsersInBulk);

// Routes for user permissions
router.get('/user/:userId/permissions', userController.getUserPermissions); // Get all permissions for a user
router.post('/user/permissions', userController.addPermissionToUser); // Add a permission to a user
router.put('/user/permissions', userController.updateUserPermissions); // Update user permissions
router.delete('/user/permissions', userController.removePermissionFromUser); // Remove a specific permission from a user

// Routes for user details
router.get('/user/:userId', userController.getUserDetails); // Get user details
router.post('/user/disable', userController.disableUser); // Disable a user

router.get('/users', userController.getAllUsers);
module.exports = router;
