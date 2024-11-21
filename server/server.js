const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const studySessionRoutes = require('./routes/studySession');
const friendsRoutes = require('./routes/friends');
const leaderboardRoutes = require('./routes/leaderboard');
const app = express();

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/study-session', studySessionRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
