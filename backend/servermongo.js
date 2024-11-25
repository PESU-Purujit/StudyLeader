require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const app = express();
const mongoURI = 'mongodb://localhost:27017/';


//mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
 //   .then(() => {
   //     console.log('MongoDB connected successfully');
    //})
    //.catch(err => {
      //  console.error('MongoDB connection error:', err);
   // });
// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({
        message: 'Unexpected server error',
        error: err.message
    });
});

connectDB();
// Routes
const authRoutes = require('./routes/authRoutesmongo');
const userRoutes = require('./routes/userRoutes');
const studySessionRoutes = require('./routes/studySessionRoutes');
const friendRoutes = require('./routes/friendRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/study-sessions', studySessionRoutes);
app.use('/api/friends', friendRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
