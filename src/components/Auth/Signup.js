import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../App';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const { username, email, password, confirmPassword } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate form data
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('/api/auth/signup', {
                username,
                email,
                password
            });

            // Destructure token and user data from response
            const { token, user } = response.data;

            // Call login method from context
            login(user, token);

            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            // Handle signup errors
            setError(err.response?.data?.msg || 'Signup failed');
        }
    };

    return (
        <div className="signup-container">
        <div className="signup-card">
        <h2>StudyLeader</h2>
        <h3>Sign Up</h3>

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
        placeholder="Choose a username"
        />
        </div>

        <div className="form-group">
        <label>Email</label>
        <input
        type="email"
        name="email"
        value={email}
        onChange={onChange}
        required
        placeholder="Enter your email"
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
        minLength="6"
        placeholder="Create a password"
        />
        </div>

        <div className="form-group">
        <label>Confirm Password</label>
        <input
        type="password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={onChange}
        required
        minLength="6"
        placeholder="Confirm your password"
        />
        </div>

        <button type="submit" className="signup-button">
        Sign Up
        </button>
        </form>

        <div className="login-link">
        Already have an account?
        <Link to="/login"> Login</Link>
        </div>
        </div>
        </div>
    );
};

export default Signup;
