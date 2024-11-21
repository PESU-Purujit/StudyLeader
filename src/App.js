import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';

// Import components
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import StudySession from './components/StudySession/StudySession';
import Leaderboard from './components/Leaderboard/Leaderboard';
import Friends from './components/Friends/FriendsList';
import AddFriends from './components/Friends/AddFriends';

// Context for authentication
export const AuthContext = React.createContext();

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          // Verify token with backend
          const response = await axios.get('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          setIsAuthenticated(true);
          setUser(response.data.user);
        } catch (error) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login handler
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Protected Route Component
  const PrivateRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>; // Or a loading spinner
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      login,
      logout
    }}>
    <Router>
    <div className="App">
    <Routes>
    {/* Authentication Routes */}
    <Route
    path="/login"
    element={
      !isAuthenticated ? (
        <Login onLogin={login} />
      ) : (
        <Navigate to="/dashboard" />
      )
    }
    />
    <Route
    path="/signup"
    element={
      !isAuthenticated ? (
        <Signup onSignup={login} />
      ) : (
        <Navigate to="/dashboard" />
      )
    }
    />

    {/* Protected Routes */}
    <Route
    path="/dashboard"
    element={
      <PrivateRoute>
      <Dashboard />
      </PrivateRoute>
    }
    />

    <Route
    path="/study-session"
    element={
      <PrivateRoute>
      <StudySession />
      </PrivateRoute>
    }
    />

    <Route
    path="/leaderboard"
    element={
      <PrivateRoute>
      <Leaderboard />
      </PrivateRoute>
    }
    />

    <Route
    path="/friends"
    element={
      <PrivateRoute>
      <Friends />
      </PrivateRoute>
    }
    />

    <Route
    path="/add-friends"
    element={
      <PrivateRoute>
      <AddFriends />
      </PrivateRoute>
    }
    />

    {/* Default Route */}
    <Route
    path="/"
    element={
      isAuthenticated ? (
        <Navigate to="/dashboard" />
      ) : (
        <Navigate to="/login" />
      )
    }
    />
    </Routes>
    </div>
    </Router>
    </AuthContext.Provider>
  );
}

export default App;
