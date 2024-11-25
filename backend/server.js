require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Enhanced CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Ensure data directory exists
const fs = require('fs');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir);
}

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', {
        message: err.message,
        stack: err.stack,
        body: req.body,
        method: req.method,
        url: req.url
    });

    res.status(500).json({
        message: 'Unexpected server error',
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;