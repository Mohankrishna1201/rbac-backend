const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// --- User Registration ---
exports.registerUser = async (req, res) => {
    const { name, email, password, bio } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
            name,
            email,
            password: hashedPassword,
            role: 'user',
            permissions: [],
            bio: bio,
            img: 'https://cdn.dribbble.com/userupload/15281011/file/original-478f20ae88aff1c23f27e5a6ce1ea2a5.png?format=webp&resize=400x300&vertical=center'
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};



exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Step 1: Validate the input
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required',
                error: 'MissingInputError'
            });
        }

        // Step 2: Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'Invalid credentials',
                error: 'UserNotFoundError'
            });
        }

        // Step 3: Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials',
                error: 'PasswordMismatchError'
            });
        }

        // Step 4: Generate JWT with user details
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role, // Assuming role is stored as a string
                permissions: user.permissions, // Assuming permissions is an array
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Step 5: Set the token as an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });

        // Step 6: Send success response
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                permissions: user.permissions,
            },
        });
    } catch (error) {
        // Catch unexpected errors and respond with details
        console.error('Login Error:', error);

        if (error.name === 'ValidationError') {
            res.status(400).json({
                message: 'Validation error occurred',
                error: error.message
            });
        } else if (error.name === 'JsonWebTokenError') {
            res.status(500).json({
                message: 'Error generating token',
                error: error.message
            });
        } else {
            res.status(500).json({
                message: 'Server error',
                error: error.message || error
            });
        }
    }
};



// --- User Logout ---
exports.logoutUser = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
};

