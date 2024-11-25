const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET || 'fallback_secret'
        );

        // Add user to request object
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token Verification Error:', {
            message: error.message,
            stack: error.stack
        });

        res.status(401).json({ 
            message: 'Token is not valid',
            error: error.message 
        });
    }
};

module.exports = authMiddleware;