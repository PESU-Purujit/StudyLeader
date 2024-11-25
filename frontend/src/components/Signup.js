import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import './styles.css'; // Link to the CSS file


function Signup() {

    const [formData, setFormData] = useState({

        username: '',

        email: '',

        password: '',

        confirmPassword: ''

    });


    const [errors, setErrors] = useState({});

    const navigate = useNavigate();


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prevState => ({

            ...prevState,

            [name]: value

        }));

    };


    const validateForm = () => {

        const newErrors = {};

        if (!formData.username) {

            newErrors.username = 'Username is required';

        } else if (formData.username.length < 3) {

            newErrors.username = 'Username must be at least 3 characters long';

        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email) {

            newErrors.email = 'Email is required';

        } else if (!emailRegex.test(formData.email)) {

            newErrors.email = 'Invalid email format';

        }

        if (!formData.password) {

            newErrors.password = 'Password is required';

        } else if (formData.password.length < 6) {

            newErrors.password = 'Password must be at least 6 characters long';

        }

        if (formData.password !== formData.confirmPassword) {

            newErrors.confirmPassword = 'Passwords do not match';

        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validateForm()) {

            return;

        }

        try {

            const { confirmPassword, ...signupData } = formData;

            const response = await axios.post('http://localhost:5000/api/auth/signup', signupData);

            alert('Signup successful! Please login.');

            navigate('/login');

        } catch (error) {

            alert(error.response?.data.message || 'Signup failed');

        }

    };


    return (

        <div className="container">

        <h2>Create an Account</h2>

        <form onSubmit={handleSubmit}>

        <div className="form-group">

        <label>Username</label>

        <input

        type="text"

        name="username"

        value={formData.username}

        onChange={handleChange}

        placeholder="Choose a username"

        />

        {errors.username && <span className="error">{errors.username}</span>}

        </div>

        <div className="form-group">

        <label>Email</label>

        <input

        type="email"

        name="email"

        value={formData.email}

        onChange={handleChange}

        placeholder="Enter your email"

        />

        {errors.email && <span className="error">{errors.email}</span>}

        </div>

        <div className="form-group">

        <label>Password</label>

        <input

        type="password"

        name="password"

        value={formData.password}

        onChange={handleChange}

        placeholder="Create a password"

        />

        {errors.password && <span className="error">{errors.password}</span>}

        </div>

        <div className="form-group">

        <label>Confirm Password</label>

        <input

        type="password"

        name="confirmPassword"

        value={formData.confirmPassword}

        onChange={handleChange}

        placeholder="Confirm your password"

        />

        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}

        </div>

        <button type="submit" className="signup-button">Sign Up</button>

        </form>

        <div className="login-redirect">

        Already have an account?

        <button onClick={() => navigate('/login')} className="login-link">Login</button>

        </div>

        </div>

    );

}


export default Signup;
