import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            console.log('Login Attempt:', { username, password }); // Debug log
            
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Login Response:', response.data); // Debug log

            // Store token in localStorage
            localStorage.setItem('token', response.data.token);
            
            // Navigate to dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error('Login Error:', error.response ? error.response.data : error.message);
            
            // Set error message
            setError(
                error.response?.data?.message || 
                'Login failed. Please check your credentials.'
            );
        }
    };

    const handleSignupRedirect = () => {
        navigate('/signup');
    };

    return (
        <div className="container">
            <h2>Login</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button type="submit" className="login-button">Login</button>
            </form>
            <div className="login-redirect">
                Don't have an account?
                <button onClick={handleSignupRedirect} className="login-link">Sign Up</button>
            </div>
        </div>
    );
}

export default Login;