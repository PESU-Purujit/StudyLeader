import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './styles.css';

function StudySession() {
    // State for tracking time
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    // Navigation hook
    const navigate = useNavigate();

    // Timer effect
    useEffect(() => {
        let interval = null;

        if (isActive && !isPaused) {
            interval = setInterval(() => {
                setElapsedTime(prevTime => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [isActive, isPaused]);

    // Format time to HH:MM:SS
    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${
            hours.toString().padStart(2, '0')
        }:${
            minutes.toString().padStart(2, '0')
        }:${
            seconds.toString().padStart(2, '0')
        }`;
    };

    // Pause/Resume handler
    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    // Stop study session
    const stopStudySession = async () => {
        try {
            // Stop the timer
            setIsActive(false);

            // Save study session data
            await api.createStudySession({
                startTime: new Date().toISOString(),
                endTime: new Date().toISOString(),
                duration: elapsedTime
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
                
                {/* Timer Display */}
                <div className="timer">
                    <h3>Elapsed Time</h3>
                    <div className="elapsed-time">
                        {formatTime(elapsedTime)}
                    </div>
                </div>

                {/* Session Controls */}
                <div className="session-controls">
                    {/* Pause/Resume Button */}
                    <button 
                        className="pause-session-btn"
                        onClick={togglePause}
                    >
                        {isPaused ? 'Resume' : 'Pause'}
                    </button>

                    {/* Stop Session Button */}
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