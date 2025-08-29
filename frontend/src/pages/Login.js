import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await apiService.login(formData.email, formData.password);
      onLogin(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="health-icon">
          ✚
        </div>
        <h1 className="login-title">LifeTrack Login</h1>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <span className="input-icon">✉</span>
          <input
            type="email"
            name="email"
            placeholder="Email / User ID"
            className="input-field"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <span className="input-icon">🔒</span>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            className="input-field"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span 
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '👁' : '👁‍🗨'}
          </span>
        </div>

        <div className="remember-me">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            className="checkbox"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <label htmlFor="rememberMe" className="checkbox-label">
            Remember Me
          </label>
        </div>

        <button 
          type="submit" 
          className="login-button"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="login-links">
        <a href="#forgot" className="login-link">Forgot Password?</a>
        <span>|</span>
        <a href="#contact" className="login-link">Contact Admin</a>
      </div>

      <div className="register-links">
        <p>Don't have an account? <Link to="/register" className="login-link">Register here</Link></p>
      </div>
    </div>
  );
};

export default Login;
