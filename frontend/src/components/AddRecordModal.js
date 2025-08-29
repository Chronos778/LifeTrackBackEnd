import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AddRecordModal = ({ isOpen, onClose, onSuccess, user }) => {
  const [formData, setFormData] = useState({
    diagnosis: '',
    doctor_id: '',
    record_date: new Date().toISOString().split('T')[0],
    file_path: ''
  });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorsData = await apiService.getDoctors();
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    if (isOpen) {
      fetchDoctors();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const recordData = {
        ...formData,
        user_id: user.user_id,
        doctor_id: parseInt(formData.doctor_id)
      };

      await apiService.addHealthRecord(recordData);
      
      // Reset form
      setFormData({
        diagnosis: '',
        doctor_id: '',
        record_date: new Date().toISOString().split('T')[0],
        file_path: ''
      });

      onSuccess('Health record added successfully!');
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
          <h2>Add New Health Record</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="diagnosis">Diagnosis *</label>
            <input
              type="text"
              id="diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              required
              placeholder="Enter diagnosis or condition"
            />
          </div>

          <div className="form-group">
            <label htmlFor="doctor_id">Doctor *</label>
            <select
              id="doctor_id"
              name="doctor_id"
              value={formData.doctor_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.doctor_id} value={doctor.doctor_id}>
                  {doctor.name} - {doctor.specialization || 'General Practice'}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="record_date">Record Date *</label>
            <input
              type="date"
              id="record_date"
              name="record_date"
              value={formData.record_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="file_path">File Path (optional)</label>
            <input
              type="text"
              id="file_path"
              name="file_path"
              value={formData.file_path}
              onChange={handleChange}
              placeholder="Enter file path if any"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecordModal;
