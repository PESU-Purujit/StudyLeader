const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        console.log('Signup Request Body:', req.body);
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required',
                details: {
                    username: !!username,
                    email: !!email,
                    password: !!password
                }
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists',
                conflictField: existingUser.email === email ? 'email' : 'username'
            });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password
        });

        await user.save();

        res.status(201).json({
            message: 'User created successfully',
            userId: user._id
        });
    } catch (error) {
        console.error('Detailed Signup Error:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            validationErrors: error.errors
        });

        // Handle specific Mongoose validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message
            }));

            return res.status(400).json({
                message: 'Validation Error',
                errors: validationErrors
            });
        }

        res.status(500).json({
            message: 'Server error during signup',
            error: error.message
        });
    }
};
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                message: 'Invalid login credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid login credentials'
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            userId: user._id
        });
    } catch (error) {
        res.status(500).json({
            message: 'Login error',
            error: error.message
        });
    }
};
