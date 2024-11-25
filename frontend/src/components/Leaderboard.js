import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('/api/study/leaderboard');
                setLeaderboard(response.data);
            } catch (error) {
                console.error('Error fetching leaderboard', error);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div>
        <h2>Leaderboard</h2>
        <h3>All-Time Study Time</h3>
        <ul>
        {leaderboard.map((user) => (
            <li key={user.username}>
            {user.username}: {user.totalStudyTime} seconds
            </li>
        ))}
        </ul>
        </div>
    );
}

export default Leaderboard;
