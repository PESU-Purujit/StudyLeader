import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = () => {
    const [leaderboardType, setLeaderboardType] = useState('allTime');
    const [leaderboard, setLeaderboard] = useState({
        allTime: [],
        weekly: [],
        daily: []
    });

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('/api/leaderboard', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setLeaderboard(response.data);
            } catch (error) {
                console.error('Error fetching leaderboard', error);
            }
        };

        fetchLeaderboard();
    }, []);

    const renderLeaderboardType = () => {
        let currentLeaderboard = [];
        switch (leaderboardType) {
            case 'allTime':
                currentLeaderboard = leaderboard.allTime;
                break;
            case 'weekly':
                currentLeaderboard = leaderboard.weekly;
                break;
            case 'daily':
                currentLeaderboard = leaderboard.daily;
                break;
            default:
                currentLeaderboard = leaderboard.allTime;
        }

        return currentLeaderboard.map((user, index) => (
            <div key={user._id} className="leaderboard-item">
            <span className="rank">{index + 1}</span>
            <span className="username">{user.username}</span>
            <span className="study-time">{user.studyTime}</span>
            </div>
        ));
    };

    return (
        <div className="leaderboard-container">
        <h2>Leaderboard</h2>

        <div className="leaderboard-tabs">
        <button
        className={leaderboardType === 'allTime' ? 'active' : ''}
        onClick={() => setLeaderboardType('allTime')}
        >
        All Time
        </button>
        <button
        className={leaderboardType === 'weekly' ? 'active' : ''}
        onClick={() => setLeaderboardType('weekly')}
        >
        Weekly
        </button>
        <button
        className={leaderboardType === 'daily' ? 'active' : ''}
        onClick={() => setLeaderboardType('daily')}
        >
        Daily
        </button>
        </div>

        <div className="leaderboard-list">
        {renderLeaderboardType()}
        </div>
        </div>
    );
};

export default Leaderboard;
