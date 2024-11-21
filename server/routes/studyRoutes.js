const express = require('express');
const { createStudySession } = require('../controllers/studySessionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createStudySession);

module.exports = router;
