const express = require('express');
const router = express.Router();
const studySessionController = require('../controllers/studySessionController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to create a new study session
router.post('/', authMiddleware, studySessionController.createStudySession);

// Route to get user's study sessions
router.get('/', authMiddleware, studySessionController.getUserStudySessions);

module.exports = router;