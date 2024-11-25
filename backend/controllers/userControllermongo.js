const User = require('../models/User');

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming you're using middleware to attach user to req
        const user = await User.findById(userId).select('-password'); // Exclude password from the response

        if (!user) {
            return res.status(404).json({
                message: 'User  not found'
            });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching user profile',
            error: error.message
        });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming you're using middleware to attach user to req
        const { username, email } = req.body; // You can include other fields as necessary

        // Update user information
        const updatedUser  = await User.findByIdAndUpdate(userId, { username, email }, { new: true, runValidators: true });

        if (!updatedUser ) {
            return res.status(404).json({
                message: 'User  not found'
            });
        }

        res.json({
            message: 'User  profile updated successfully',
            user: updatedUser 
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating user profile',
            error: error.message
        });
    }
};