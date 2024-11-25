const User = require('../models/User');

exports.createStudySession = async (req, res) => {
    try {
        const { duration } = req.body; // duration in seconds
        const user = req.user;

        // Update user's total time studied
        user.timeStudied += duration;
        user.studySessions.push({ date: new Date(), duration });
        await user.save();

        res.status(201).json({
            message: 'Study session recorded successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error recording study session',
            error: error.message
        });
    }
};
