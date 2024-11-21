const mongoose = require('mongoose');

const StudySessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    duration: {
        type: Number,
        default: 0
    },
    backgroundMusic: {
        type: String
    },
    background: {
        type: String
    }
});

module.exports = mongoose.model('StudySession', StudySessionSchema);
