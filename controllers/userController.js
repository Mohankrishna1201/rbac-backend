const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ROLES = ['admin', 'user', 'manager'];

exports.getAllRoles = (req, res) => {
    res.json(ROLES);
};


// --- View User Profile with Roles and Permissions ---
exports.getUserProfile = async (req, res) => {
    try {
        const userObjectId = new mongoose.Types.ObjectId(req.user.id);

        const user = await User.findById(userObjectId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            name: user.name,
            email: user.email,
            bio: user.bio,
            profileImage: user.img,
            roles: user.role,
            permissions: user.permissions

        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// --- Disable User ---
exports.disableUser = async (req, res) => {
    const { userId } = req.body;

    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const user = await User.findById(userObjectId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.isDisabled = true; // Add an `isDisabled` field in the `User` model
        await user.save();

        res.json({ message: 'User disabled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// --- Update User Role ---
exports.updateUserRole = async (req, res) => {
    const { userId, role } = req.body;

    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const user = await User.findById(userObjectId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const ROLES = ['admin', 'user', 'manager'];
        if (!ROLES.includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        user.role = role;
        await user.save();

        res.json({ message: 'User role updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// --- Get all permissions for a user ---
exports.getUserPermissions = async (req, res) => {
    const { userId } = req.params;

    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const user = await User.findById(userObjectId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ permissions: user.permissions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};



exports.addPermissionToUser = async (req, res) => {
    const { userId, permissions } = req.body;

    try {
        // Convert id to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Find user by ObjectId
        const user = await User.findById(userObjectId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Add permission if not already present
        if (!user.permissions.includes(permissions)) {
            user.permissions.push(permissions);
        }

        await user.save();
        res.json({ message: 'Permission added successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// --- Update user permissions ---
exports.updateUserPermissions = async (req, res) => {
    const { userId, permissions } = req.body;

    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const user = await User.findById(userObjectId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.permissions = permissions;
        await user.save();

        res.json({ message: 'User permissions updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// --- Remove user role ---
exports.removeUserRole = async (req, res) => {
    const { userId } = req.body;

    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const user = await User.findById(userObjectId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.role = null;
        await user.save();

        res.json({ message: 'User role removed successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// --- Remove a specific permission from a user ---
exports.removePermissionFromUser = async (req, res) => {
    const { userId, permissions } = req.body;

    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const user = await User.findById(userObjectId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.permissions = user.permissions.filter((perm) => perm !== permissions);
        await user.save();

        res.json({ message: 'Permission removed successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// --- Get user details ---
exports.getUserDetails = async (req, res) => {
    const { userId } = req.params;

    try {
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const user = await User.findById(userObjectId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};
