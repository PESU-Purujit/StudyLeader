import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import StudySession from './components/StudySession';
import Leaderboard from './components/Leaderboard';
import Friends from './components/Friends';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
    <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />

    <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
      <Dashboard />
      </ProtectedRoute>
    }
    />

    <Route
    path="/study- session"
    element={
      <ProtectedRoute>
      <StudySession />
      </ProtectedRoute>
    }
    />

    <Route
    path="/leaderboard"
    element={
      <ProtectedRoute>
      <Leaderboard />
      </ProtectedRoute>
    }
    />

    <Route
    path="/friends"
    element={
      <ProtectedRoute>
      <Friends />
      </ProtectedRoute>
    }
    />

    <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
    </Router>
  );
}

export default App;
