import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import Records from './pages/Records';
import Treatments from './pages/Treatments';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('healthcare_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('healthcare_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('healthcare_user');
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/home" replace /> : <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/register" 
            element={
              user ? <Navigate to="/home" replace /> : <Register />
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/home" 
            element={
              user ? <Home user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/doctors" 
            element={
              user ? <Doctors user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/records" 
            element={
              user ? <Records user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/treatments" 
            element={
              user ? <Treatments user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
            } 
          />
          
          {/* Default Route */}
          <Route 
            path="/" 
            element={<Navigate to={user ? "/home" : "/login"} replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
