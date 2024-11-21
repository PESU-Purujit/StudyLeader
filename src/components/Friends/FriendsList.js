import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Friends.css';

const FriendsList = () => {
    const [friends, setFriends] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.get('/api/friends', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setFriends(response.data);
            } catch (error) {
                console.error('Error fetching friends', error);
            }
        };

        fetchFriends();
    }, []);

    const removeFriend = async (friendId) => {
        try {
            await axios.delete(`/api/friends/${friendId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Remove friend from local state
            setFriends(friends.filter(friend => friend._id !== friendId));
        } catch (error) {
            console.error('Error removing friend', error);
        }
    };

    return (
        <div className="friends-container">
        <div className="friends-header">
        <h2>Friends</h2>
        <button
        className="add-friend-btn"
        onClick={() => navigate('/add-friends')}
        >
        Add Friends
        </button>
        </div>

        <div className="friends-list">
        {friends.length === 0 ? (
            <p>No friends added yet</p>
        ) : (
            friends.map(friend => (
                <div key={friend._id} className="friend-item">
                <div className="friend-info">
                <span className="friend-username">{friend.username}</span>
                <span className="friend-study-time">{friend.totalStudyTime} hrs</span>
                </div>
                <button
                className="remove-friend-btn"
                onClick={() => removeFriend(friend._id)}
                >
                Remove
                </button>
                </div>
            ))
        )}
        </div>
        </div>
    );
};

export default FriendsList;
