const UserCSVManager = require('../utils/userCSVManager');
const path = require('path');
const fs = require('fs');
const { parse } = require('csv-parser');
const { writeToPath } = require('@fast-csv/format');

exports.getUserProfile = async (req, res) => {
    try {
        const username = req.user.username;
        const user = await UserCSVManager.findUserByUsername(username);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove sensitive information
        const { password, ...userProfile } = user;
        
        res.json({
            username: userProfile.username,
            email: userProfile.email,
            timeStudied: parseInt(userProfile.timeStudied || 0)
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching user profile',
            error: error.message
        });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const username = req.user.username;
        const { email, newUsername } = req.body;

        // Read current users
        const usersFilePath = path.join(__dirname, '../data/users.csv');
        const users = [];
        let userUpdated = false;

        // Read and modify users
        fs.createReadStream(usersFilePath)
            .pipe(parse({ headers: true }))
            .on('data', (data) => {
                if (data.username === username) {
                    // Update email and/or username
                    if (email) data.email = email;
                    if (newUsername) data.username = newUsername;
                    userUpdated = true;
                }
                users.push(data);
            })
            .on('end', () => {
                if (!userUpdated) {
                    return res.status(404).json({ message: 'User not found' });
                }

                // Write updated users back to CSV
                const csvStream = writeToPath(usersFilePath, users, { headers: true });

                csvStream.on('error', (error) => {
                    return res.status(500).json({
                        message: 'Error updating user profile',
                        error: error.message
                    });
                });

                csvStream.on('finish', () => {
                    res.json({
                        message: 'User profile updated successfully',
                        user: { 
                            username: newUsername || username, 
                            email 
                        }
                    });
                });
            });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating user profile',
            error: error.message
        });
    }
};