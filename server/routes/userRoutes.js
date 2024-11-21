const express = require('express');
const { getUser Profile, updateUser Profile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', authMiddleware, getUser Profile);
router.put('/profile', authMiddleware, updateUser Profile);

module.exports = router;
