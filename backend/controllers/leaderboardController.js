const UserCSVManager = require('../utils/userCSVManager');

exports.getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await UserCSVManager.getLeaderboard();

        // Limit to top 10 and format response
        const topUsers = leaderboard.slice(0, 10).map(user => ({
            username: user.username,
            studyTime: user.totalStudyTime,
            // Convert seconds to hours
            studyTimeFormatted: `${Math.floor(user.totalStudyTime / 3600)} hrs`
        }));

        res.json({
            leaderboard: topUsers
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching leaderboard',
            error: error.message
        });
    }
};