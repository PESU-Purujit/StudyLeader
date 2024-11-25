const UserCSVManager = require('../utils/userCSVManager');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        console.log('Signup Request Body:', req.body);
        const { username, email, password } = req.body;

        // Comprehensive input validation
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

        // Validate username length
        if (username.length < 3) {
            return res.status(400).json({
                message: 'Username must be at least 3 characters long'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Invalid email format'
            });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long'
            });
        }

        // Attempt to create user
        const newUser = await UserCSVManager.createUser({ 
            username, 
            email, 
            password 
        });

        res.status(201).json({
            message: 'User created successfully',
            user: {
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error('Signup Error:', {
            message: error.message,
            stack: error.stack
        });

        // Handle specific error messages
        if (error.message.includes('already exists')) {
            return res.status(400).json({
                message: error.message
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
        console.log('Login Request Body:', req.body);
        const { username, password } = req.body;

        // Input validation
        if (!username || !password) {
            return res.status(400).json({
                message: 'Username and password are required'
            });
        }

        // Authenticate user
        const user = await UserCSVManager.authenticateUser(username, password);

        // Generate JWT
        const token = jwt.sign(
            { 
                username: user.username,
                email: user.email 
            },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login Error:', {
            message: error.message,
            stack: error.stack
        });

        // Handle specific error messages
        if (error.message === 'User not found' || error.message === 'Invalid password') {
            return res.status(401).json({
                message: 'Invalid login credentials'
            });
        }

        res.status(500).json({
            message: 'Login error',
            error: error.message
        });
    }
};