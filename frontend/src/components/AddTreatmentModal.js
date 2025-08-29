import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AddTreatmentModal = ({ isOpen, onClose, onSuccess, user }) => {
  const [formData, setFormData] = useState({
    record_id: '',
    medication: '',
    procedure: '',
    follow_up_date: ''
  });
  const [userRecords, setUserRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserRecords = async () => {
      try {
        console.log('Fetching records for user:', user.user_id);
        const recordsData = await apiService.getUserHealthRecords(user.user_id);
        console.log('Fetched records:', recordsData);
        setUserRecords(recordsData);
      } catch (error) {
        console.error('Error fetching user records:', error);
      }
    };

    if (isOpen) {
      fetchUserRecords();
    }
  }, [isOpen, user.user_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const treatmentData = {
        ...formData,
        record_id: parseInt(formData.record_id),
        follow_up_date: formData.follow_up_date || null
      };

      await apiService.addTreatment(treatmentData);
      
      // Reset form
      setFormData({
        record_id: '',
        medication: '',
        procedure: '',
        follow_up_date: ''
      });

      onSuccess('Treatment added successfully!');
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
          <h2>Add New Treatment</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="record_id">Health Record *</label>
            <select
              id="record_id"
              name="record_id"
              value={formData.record_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a health record</option>
              {userRecords.length === 0 ? (
                <option disabled>No health records found for this user</option>
              ) : (
                userRecords.map(record => (
                  <option key={record.record_id} value={record.record_id}>
                    {record.diagnosis} - {new Date(record.record_date).toLocaleDateString()}
                  </option>
                ))
              )}
            </select>
            {userRecords.length === 0 && (
              <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '5px' }}>
                You need to add a health record first before creating a treatment. Go to the Records section to add one.
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="medication">Medication *</label>
            <input
              type="text"
              id="medication"
              name="medication"
              value={formData.medication}
              onChange={handleChange}
              required
              placeholder="Enter medication name and dosage"
            />
          </div>

          <div className="form-group">
            <label htmlFor="procedure">Procedure/Instructions</label>
            <textarea
              id="procedure"
              name="procedure"
              value={formData.procedure}
              onChange={handleChange}
              placeholder="Enter procedure details or instructions"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="follow_up_date">Follow-up Date</label>
            <input
              type="date"
              id="follow_up_date"
              name="follow_up_date"
              value={formData.follow_up_date}
              onChange={handleChange}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Treatment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTreatmentModal;
