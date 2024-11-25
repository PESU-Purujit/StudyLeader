const express = require('express');
const { addFriend, removeFriend, getFriends } = require('../controllers/friendController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', authMiddleware, addFriend);
router.post('/remove', authMiddleware, removeFriend);
router.get('/', authMiddleware, getFriends);

module.exports = router;
