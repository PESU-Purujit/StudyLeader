import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css'; // Link to the CSS file

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/login', {
                username,
                password
            });

            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (error) {
            alert('Login failed');
        }
    };

    const handleSignupRedirect = () => {
        navigate('/signup');
    };

    return (
        <div className="container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
        <div className="form-group">
        <label>Username</label>
        <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
        />
        </div>
        <div className="form-group">
        <label>Password</label>
        <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
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
