import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [friendsList, setFriendsList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        };

        // Fetch leaderboard data
        const fetchLeaderboardData = async () => {
            try {
                const response = await axios.get('/api/leaderboard');
                setLeaderboardData(response.data.slice(0, 5)); // Top 5 entries
            } catch (error) {
                console.error('Error fetching leaderboard', error);
            }
        };

        // Fetch friends list
        const fetchFriends = async () => {
            try {
                const response = await axios.get('/api/friends');
                setFriendsList(response.data.slice(0, 5)); // Top 5 friends
            } catch (error) {
                console.error('Error fetching friends', error);
            }
        };

        fetchUserData();
        fetchLeaderboardData();
        fetchFriends();
    }, []);

    const startStudySession = () => {
        // Navigate to study session page
        navigate('/study-session', {
            state: {
                startTime: new Date().toISOString()
            }
        });
    };

    const handleLogout = () => {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="container dashboard-container">
        <div className="dashboard-header">
        <h2>Welcome, {userData?.username || 'Student'}</h2>
        <button
        className="logout-button"
        onClick={handleLogout}
        >
        Logout
        </button>
        </div>

        <div className="study-session-container">
        <div className="session-timer">
        <h3>Start Your Study Session</h3>
        <button
        className="start-session-btn"
        onClick={startStudySession}
        >
        Start New Session
        </button>
        </div>
        </div>

        <div className="dashboard-sections">
        <div className="leaderboard-preview">
        <h3>Leaderboard</h3>
        <ul className="leaderboard-list">
        {leaderboardData.map((entry, index) => (
            <li key={index} className="leaderboard-item">
            <span>{entry.username}</span>
            <span>{entry.studyTime}</span>
            </li>
        ))}
        </ul>
        <button
        className="view-more-btn"
        onClick={() => navigate('/leaderboard')}
        >
        View Full Leaderboard
        </button>
        </div>

        <div className="friends-preview">
        <h3>Friends</h3>
        <ul className="friends-list">
        {friendsList.map((friend, index) => (
            <li key={index} className="friends-item">
            {friend.username}
            </li>
        ))}
        </ul>
        <button
        className="view-more-btn"
        onClick={() => navigate('/friends')}
        >
        View All Friends
        </button>
        </div>
        </div>
        </div>
    );
}

export default Dashboard;
