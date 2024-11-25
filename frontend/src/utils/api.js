import axios from 'axios';

// Create an axios instance with base configuration
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Your backend base URL
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// API methods
export default {
    // Study Sessions
    createStudySession: (data) => api.post('/study-sessions', data),
    getUserStudySessions: () => api.get('/study-sessions'),

    // Authentication
    login: (credentials) => api.post('/auth/login', credentials),
    signup: (userData) => api.post('/auth/signup', userData),

    // User Profile
    getUserProfile: () => api.get('/user/profile'),
    updateUserProfile: (userData) => api.put('/user/profile', userData),

    // Leaderboard
    getLeaderboard: () => api.get('/leaderboard'),

    // Friends
    getFriends: () => api.get('/friends'),
    addFriend: (friendData) => api.post('/friends/add', friendData),
    removeFriend: (friendData) => api.post('/friends/remove', friendData)
};