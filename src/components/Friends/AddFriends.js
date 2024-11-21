import React, { useState } from 'react';
import axios from 'axios';
import './addFriends.css';

const AddFriends = () => {
    const [username, setUsername] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');

    const searchUsers = async () => {
        setError('');

        if (!username) {
            setError('Please enter a username');
            return;
        }

        try {
            const response = await axios.get(`/api/friends/search?username=${username}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            setSearchResults(response.data);
        } catch (error) {
            setError(error.response?.data?.msg || 'Error searching users');
        }
    };

    const sendFriendRequest = async (userId) => {
        try {
            await axios.post('/api/friends/request',
                             { userId },
                             {
                                 headers: {
                                     'Authorization': `Bearer ${localStorage.getItem('token')}`
                                 }
                             }
            );

            // Update UI to show request sent
            setSearchResults(prev =>
            prev.map(user =>
            user._id === userId
            ? {...user, requestSent: true}
            : user
            )
            );
        } catch (error) {
            setError(error.response?.data?.msg || 'Error sending friend request');
        }
    };

    return (
        <div className="add-friends-container">
        <h2>Add Friends</h2>

        <div className="search-container">
        <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={searchUsers}>Search</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="search-results">
        {searchResults.map(user => (
            <div key={user._id} className="search-result-item">
            <div className="user-info">
            <span className="username">{user.username}</span>
            <span className="email">{user.email}</span>
            </div>
            <button
            onClick={() => sendFriendRequest(user._id)}
            disabled={user.requestSent}
            >
            {user.requestSent ? 'Request Sent' : 'Add Friend'}
            </button>
            </div>
        ))}
        </div>
        </div>
    );
};

export default AddFriends;
