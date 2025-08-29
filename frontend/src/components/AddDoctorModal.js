import React, { useState } from 'react';
import { apiService } from '../services/api';

const AddDoctorModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    contact_number: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiService.addDoctor(formData);
      
      // Reset form
      setFormData({
        name: '',
        specialization: '',
        contact_number: '',
        email: ''
      });

      onSuccess('Doctor added successfully!');
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Doctor</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Doctor Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter doctor's full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="specialization">Specialization</label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="e.g., Cardiologist, General Practice, etc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact_number">Contact Number</label>
            <input
              type="tel"
              id="contact_number"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              placeholder="Enter contact number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorModal;
