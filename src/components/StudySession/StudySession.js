import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudySession = () => {
    const [isActive, setIsActive] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [backgroundMusic, setBackgroundMusic] = useState(null);
    const [background, setBackground] = useState(null);

    const startSession = async () => {
        setIsActive(true);
        // Start backend tracking
        await axios.post('/api/study-session/start');
    };

    const stopSession = async () => {
        setIsActive(false);
        // Stop backend tracking
        await axios.post('/api/study-session/stop', { duration: elapsedTime });
    };

    useEffect(() => {
        let interval;
        if (isActive) {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    return (
        <div>
        <div>Elapsed Time: {elapsedTime} seconds</div>
        {!isActive ? (
            <button onClick={startSession}>Start Session</button>
        ) : (
            <button onClick={stopSession}>Stop Session</button>
        )}
        {/* Music and background selection */}
        </div>
    );
};

export default StudySession;
