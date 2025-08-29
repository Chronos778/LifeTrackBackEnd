import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    contact_number: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.age || formData.age < 1 || formData.age > 120) return 'Valid age is required';
    if (!formData.contact_number.trim()) return 'Contact number is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.email.includes('@')) return 'Valid email is required';
    if (formData.password.length < 4) return 'Password must be at least 4 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validation = validateForm();
    if (validation) {
      setError(validation);
      setLoading(false);
      return;
    }

    try {
      const userData = {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        gender: formData.gender,
        contact_number: formData.contact_number.trim(),
        email: formData.email.trim(),
        password: formData.password
      };

      await apiService.register(userData);
      setSuccess('Registration successful! You can now login with your credentials.');
      setFormData({
        name: '',
        age: '',
        gender: 'Male',
        contact_number: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <div className="health-icon">
          ✚
        </div>
        <h1 className="register-title">Create Account</h1>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="input-group">
            <span className="input-icon">👤</span>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="input-field"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="input-group half-width">
            <span className="input-icon">🎂</span>
            <input
              type="number"
              name="age"
              placeholder="Age"
              className="input-field"
              value={formData.age}
              onChange={handleChange}
              min="1"
              max="120"
              required
            />
          </div>
          <div className="input-group half-width">
            <span className="input-icon">⚥</span>
            <select
              name="gender"
              className="input-field"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <span className="input-icon">📞</span>
            <input
              type="tel"
              name="contact_number"
              placeholder="Contact Number"
              className="input-field"
              value={formData.contact_number}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <span className="input-icon">✉</span>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="input-field"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input-field"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="input-field"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="register-button"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <div className="register-links">
        <p>Already have an account? <Link to="/login" className="register-link">Login here</Link></p>
      </div>
    </div>
  );
};

export default Register;
