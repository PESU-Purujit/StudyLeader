import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

function StudySession() {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Get start time from navigation state
    const startTime = location.state?.startTime
    ? new Date(location.state.startTime)
    : new Date();

    useEffect(() => {
        let interval = null;

        if (isActive) {
            interval = setInterval(() => {
                const currentTime = new Date();
                const elapsed = Math.floor((currentTime - startTime) / 1000);
                setElapsedTime(elapsed);
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, startTime]);

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const stopStudySession = async () => {
        try {
            // Stop the timer
            setIsActive(false);

            // Save study session data
            await axios.post('/api/study-sessions', {
                startTime,
                endTime: new Date(),
                             duration: elapsedTime
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Navigate back to dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error('Error saving study session', error);
            // Navigate back to dashboard even if saving fails
            navigate('/dashboard');
        }
    };

    return (
        <div className="container study-session-container">
        <div className="study-session-content">
        <h2>Study Session</h2>
        <div className="timer">
        <h3>Elapsed Time</h3>
        <div className="elapsed-time">
        {formatTime(elapsedTime)}
        </div>
        </div>

        <div className="session-controls">
        <button
        className="stop-session-btn"
        onClick={stopStudySession}
        >
        Stop Session
        </button>
        </div>
        </div>
        </div>
    );
}

export default StudySession;
