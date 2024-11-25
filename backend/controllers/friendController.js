const User = require('../models/User');

exports.addFriend = async (req, res) => {
    try {
        const { friendId } = req.body;
        const user = req.user;

        await user.addFriend(friendId);
        res.status(200).json({
            message: 'Friend added successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error adding friend',
            error: error.message
        });
    }
};

exports.removeFriend = async (req, res) => {
    try {
        const { friendId } = req.body;
        const user = req.user;

        await user.removeFriend(friendId);
        res.status(200).json({
            message: 'Friend removed successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error removing friend',
            error: error.message
        });
    }
};

exports.getFriends = async (req, res) => {
    try {
        const user = req.user;
        const friends = await User.find({ _id: { $in: user.friends } });
        res.status(200).json(friends);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching friends',
            error: error.message
        });
    }
};
