const UserCSVManager = require('../utils/userCSVManager');
const path = require('path');
const fs = require('fs').promises;
const { parse } = require('csv-parse/sync');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Create a new study session
exports.createStudySession = async (req, res) => {
    try {
        const { startTime, endTime, duration } = req.body;
        const username = req.user.username;

        // Validate input
        if (!startTime || !endTime || !duration) {
            return res.status(400).json({
                message: 'Missing required session data'
            });
        }

        // Ensure duration is a number
        const sessionDuration = parseInt(duration, 10);

        // Prepare session data
        const sessionData = {
            USERNAME: username,
            START_TIME: startTime,
            END_TIME: endTime,
            DURATION: sessionDuration.toString()
        };

        // Get sessions file path
        const sessionsFilePath = path.join(__dirname, '../data/study_sessions.csv');

        // Ensure sessions file exists
        await ensureSessionFileExists(sessionsFilePath);

        // Create CSV writer
        const csvWriter = createCsvWriter({
            path: sessionsFilePath,
            header: [
                {id: 'USERNAME', title: 'USERNAME'},
                {id: 'START_TIME', title: 'START_TIME'},
                {id: 'END_TIME', title: 'END_TIME'},
                {id: 'DURATION', title: 'DURATION'}
            ],
            append: true
        });

        // Write session to CSV
        await csvWriter.writeRecords([sessionData]);

        // Update user's total study time
        await UserCSVManager.updateStudyTime(username, sessionDuration);

        res.status(201).json({
            message: 'Study session recorded successfully',
            session: sessionData
        });
    } catch (error) {
        console.error('Error creating study session:', error);
        res.status(500).json({
            message: 'Error creating study session',
            error: error.message
        });
    }
};

// Get user's study sessions
exports.getUserStudySessions = async (req, res) => {
    try {
        const username = req.user.username;
        
        // Get sessions file path
        const sessionsFilePath = path.join(__dirname, '../data/study_sessions.csv');

        // Ensure sessions file exists
        await ensureSessionFileExists(sessionsFilePath);

        // Read file content
        const fileContent = await fs.readFile(sessionsFilePath, 'utf8');
        const sessions = parse(fileContent, { 
            columns: true,
            skip_empty_lines: true
        });

        // Filter sessions for the specific user
        const userSessions = sessions.filter(session => session.USERNAME === username);

        // Sort sessions by start time (most recent first)
        userSessions.sort((a, b) => new Date(b.START_TIME) - new Date(a.START_TIME));

        res.json({
            sessions: userSessions
        });
    } catch (error) {
        console.error('Error fetching study sessions:', error);
        res.status(500).json({
            message: 'Error fetching study sessions',
            error: error.message
        });
    }
};

// Get user's total study time
exports.getUserTotalStudyTime = async (req, res) => {
    try {
        const username = req.user.username;
        
        // Get sessions file path
        const sessionsFilePath = path.join(__dirname, '../data/study_sessions.csv');

        // Ensure sessions file exists
        await ensureSessionFileExists(sessionsFilePath);

        // Read file content
        const fileContent = await fs.readFile(sessionsFilePath, 'utf8');
        const sessions = parse(fileContent, { 
            columns: true,
            skip_empty_lines: true
        });

        // Filter sessions for the specific user and calculate total time
        const totalStudyTime = sessions
            .filter(session => session.USERNAME === username)
            .reduce((total, session) => total + parseInt(session.DURATION), 0);

        res.json({
            totalStudyTime,
            totalStudyTimeFormatted: formatSeconds(totalStudyTime)
        });
    } catch (error) {
        console.error('Error calculating total study time:', error);
        res.status(500).json({
            message: 'Error calculating total study time',
            error: error.message
        });
    }
};

// Helper function to format seconds into readable format
function formatSeconds(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
}

// Ensure session file exists
async function ensureSessionFileExists(filePath) {
    try {
        await fs.access(filePath).catch(async () => {
            // File doesn't exist, create it with headers
            await fs.writeFile(
                filePath, 
                'USERNAME,START_TIME,END_TIME,DURATION\n', 
                'utf8'
            );
        });
    } catch (error) {
        console.error('Error ensuring sessions file exists:', error);
        throw error;
    }
}