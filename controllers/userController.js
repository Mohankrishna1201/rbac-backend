const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ROLES = ['admin', 'editor', 'basic'];

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
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Toggle the isDisabled field
        user.isDisabled = !user.isDisabled;

        await user.save();

        res.json({
            message: user.isDisabled ? 'User disabled successfully' : 'User enabled successfully',
            isDisabled: user.isDisabled,
        });
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

        const ROLES = ['admin', 'basic', 'editor'];
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



// --- Get All Users ---
exports.getAllUsers = async (req, res) => {
    try {

        const users = await User.find();


        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};



exports.addUser = async (req, res) => {
    const { name, email, password, role, bio, profileImage } = req.body;

    try {
        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }

        // Check if the role is valid
        if (role && !ROLES.includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified.' });
        }

        // Check if email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email is already in use.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'basic', // Default role is 'basic'
            bio: bio || '',
            profileImage: profileImage || '',
            permissions: [], // Default permissions
            isDisabled: false, // Default active state
        });

        // Save user to database
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};


// --- Delete User ---
exports.deleteUser = async (req, res) => {
    const { userId } = req.body; // Expecting `userId` in the request body

    try {
        // Convert userId to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Find and delete the user
        const user = await User.findByIdAndDelete(userObjectId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.addUsersInBulk = async (req, res) => {
    const users = req.body; // Expecting an array of user objects

    try {
        // Validate input
        if (!Array.isArray(users) || users.length === 0) {
            return res.status(400).json({ message: 'Invalid input: an array of users is required.' });
        }

        const errors = [];
        const createdUsers = [];

        for (const user of users) {
            const { name, email, password, role, bio, profileImage } = user;

            // Validate required fields
            if (!name || !email || !password) {
                errors.push({ email, message: 'Name, email, and password are required.' });
                continue;
            }

            // Check if the role is valid
            if (role && !ROLES.includes(role)) {
                errors.push({ email, message: 'Invalid role specified.' });
                continue;
            }

            // Check if email is already in use
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                errors.push({ email, message: 'Email is already in use.' });
                continue;
            }

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create a new user object
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                role: role || 'basic', // Default role is 'basic'
                bio: bio || '',
                profileImage: profileImage || '',
                permissions: [], // Default permissions
                isDisabled: false, // Default active state
            });

            // Save the user
            try {
                const savedUser = await newUser.save();
                createdUsers.push(savedUser);
            } catch (error) {
                errors.push({ email, message: 'Error saving user', error });
            }
        }

        res.status(201).json({
            message: `${createdUsers.length} users created successfully.`,
            createdUsers,
            errors,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};
