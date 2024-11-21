import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../App';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const { username, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('/api/auth/login', {
                username,
                password
            });

            // Destructure token and user data from response
            const { token, user } = response.data;

            // Call login method from context
            login(user, token);

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            // Handle login errors
            setError(err.response?.data?.msg || 'Login failed');
        }
    };

    return (
        <div className="login-container">
        <div className="login-card">
        <h2>StudyLeader</h2>
        <h3>Login</h3>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={onSubmit}>
        <div className="form-group">
        <label>Username</label>
        <input
        type="text"
        name="username"
        value={username}
        onChange={onChange}
        required
        placeholder="Enter your username"
        />
        </div>

        <div className="form-group">
        <label>Password</label>
        <input
        type="password"
        name="password"
        value={password}
        onChange={onChange}
        required
        placeholder="Enter your password"
        />
        </div>

        <button type="submit" className="login-button">
        Login
        </button>
        </form>

        <div className="signup-link">
        Don't have an account?
        <Link to="/signup"> Sign Up</Link>
        </div>
        </div>
        </div>
    );
};

export default Login;
