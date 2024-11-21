import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Friends() {
    const [friends, setFriends] = useState([]);
    const [newFriend, setNewFriend] = useState('');

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.get('/api/friends');
                setFriends(response.data);
            } catch (error) {
                console.error('Error fetching friends', error);
            }
        };

        fetchFriends();
    }, []);

    const handleAddFriend = async () => {
        try {
            await axios.post('/api/friends/add', { username: newFriend });
            setNewFriend('');
            // Re-fetch friends after adding a new one
            const response = await axios.get('/api/friends');
            setFriends(response.data);
        } catch (error) {
            console.error('Error adding friend', error);
        }
    };

    return (
        <div>
        <h2>Friends</h2>
        <input
        type="text"
        placeholder="Enter username"
        value={newFriend}
        onChange={(e) => setNewFriend(e.target.value)}
        />
        <button onClick={handleAddFriend}>Add Friend</button>
        <h3>Your Friends</h3>
        <ul>
        {friends.map((friend) => (
            <li key={friend.username}>{friend.username}</li>
        ))}
        </ul>
        </div>
    );
}

export default Friends;
