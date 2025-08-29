import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AddRecordModal from '../components/AddRecordModal';
import { apiService } from '../services/api';

const Records = ({ user, onLogout }) => {
  const [userRecords, setUserRecords] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [timelineView, setTimelineView] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recordsData, doctorsData] = await Promise.all([
          apiService.getUserHealthRecords(user.user_id),
          apiService.getDoctors()
        ]);
        
        setUserRecords(recordsData);
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error fetching user records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.user_id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recordsData, doctorsData] = await Promise.all([
        apiService.getUserHealthRecords(user.user_id),
        apiService.getDoctors()
      ]);
      
      setUserRecords(recordsData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Error fetching user records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = (message) => {
    setSuccessMessage(message);
    fetchData(); // Refresh data
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteRecord = async (recordId) => {
    if (window.confirm('Are you sure you want to delete this health record? This will also delete all associated treatments.')) {
      try {
        await apiService.deleteHealthRecord(recordId);
        setSuccessMessage('Health record deleted successfully');
        fetchData(); // Refresh data
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setSuccessMessage(`Error: ${error.message}`);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    }
  };

  const getDoctorName = (doctorId) => {
    const foundDoctor = doctors.find(d => d.doctor_id === doctorId);
    return foundDoctor ? foundDoctor.name : `Doctor ${doctorId}`;
  };

  const getDoctorSpecialization = (doctorId) => {
    const foundDoctor = doctors.find(d => d.doctor_id === doctorId);
    return foundDoctor ? foundDoctor.specialization : 'General Practice';
  };

  const filteredRecords = userRecords.filter(record => {
    const searchLower = searchTerm.toLowerCase();
    return (
      record.diagnosis.toLowerCase().includes(searchLower) ||
      getDoctorName(record.doctor_id).toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimelineDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getSeverityClass = (diagnosis) => {
    const criticalConditions = ['hypertension', 'diabetes', 'heart', 'cancer', 'stroke'];
    const moderateConditions = ['asthma', 'allergies', 'migraine', 'arthritis'];
    
    const diagnosisLower = diagnosis.toLowerCase();
    
    if (criticalConditions.some(condition => diagnosisLower.includes(condition))) {
      return 'critical';
    } else if (moderateConditions.some(condition => diagnosisLower.includes(condition))) {
      return 'moderate';
    }
    return 'mild';
  };

  const groupRecordsByYear = (records) => {
    return records.reduce((groups, record) => {
      const year = new Date(record.record_date).getFullYear();
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(record);
      return groups;
    }, {});
  };

  return (
    <div className="records-page">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="page-content">
        <div className="page-header">
          <h1>My Health Records</h1>
          <p>Your complete health timeline and medical history</p>
        </div>

        <div className="records-controls">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search your records by condition or doctor..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="view-toggles">
            <button 
              className={`view-toggle ${timelineView ? 'active' : ''}`}
              onClick={() => setTimelineView(true)}
            >
              <span className="btn-icon">📅</span>
              Timeline
            </button>
            <button 
              className={`view-toggle ${!timelineView ? 'active' : ''}`}
              onClick={() => setTimelineView(false)}
            >
              <span className="btn-icon">📋</span>
              List
            </button>
          </div>

          <button 
            className="btn-primary add-record-btn"
            onClick={() => setShowAddModal(true)}
          >
            <span className="btn-icon">➕</span>
            Add Record
          </button>
        </div>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {loading ? (
          <div className="loading">Loading your health records...</div>
        ) : (
          <>
            {timelineView ? (
              <div className="timeline-container">
                {Object.keys(groupRecordsByYear(filteredRecords))
                  .sort((a, b) => b - a)
                  .map(year => (
                  <div key={year} className="timeline-year">
                    <h2 className="year-header">{year}</h2>
                    <div className="timeline-records">
                      {groupRecordsByYear(filteredRecords)[year].map((record, index) => (
                        <div 
                          key={record.record_id} 
                          className={`timeline-item ${getSeverityClass(record.diagnosis)}`}
                          onClick={() => setSelectedRecord(record)}
                        >
                          <div className="timeline-marker">
                            <div className="timeline-dot"></div>
                            {index < groupRecordsByYear(filteredRecords)[year].length - 1 && (
                              <div className="timeline-line"></div>
                            )}
                          </div>
                          <div className="timeline-content">
                            <div className="timeline-date">
                              {formatTimelineDate(record.record_date)}
                            </div>
                            <div className="timeline-card">
                              <div className="record-header-actions">
                                <div>
                                  <h3 className="diagnosis">{record.diagnosis}</h3>
                                  <div className="doctor-info">
                                    <span className="doctor-name">👨‍⚕️ {getDoctorName(record.doctor_id)}</span>
                                    <span className="specialization">{getDoctorSpecialization(record.doctor_id)}</span>
                                  </div>
                                </div>
                                <button 
                                  className="delete-btn"
                                  onClick={() => handleDeleteRecord(record.record_id)}
                                  title="Delete Record"
                                >
                                  🗑️
                                </button>
                              </div>
                              {record.file_path && (
                                <div className="file-attachment">
                                  <span className="file-icon">📎</span>
                                  <span>Report Available</span>
                                </div>
                              )}
                              <span className={`severity-indicator ${getSeverityClass(record.diagnosis)}`}>
                                {getSeverityClass(record.diagnosis).toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="records-list">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map(record => (
                    <div 
                      key={record.record_id} 
                      className={`record-card ${getSeverityClass(record.diagnosis)}`}
                      onClick={() => setSelectedRecord(record)}
                    >
                      <div className="record-header">
                        <div className="record-id">#{record.record_id}</div>
                        <div className="record-date">{formatDate(record.record_date)}</div>
                        <div className="record-header-actions">
                          <button 
                            className="delete-btn" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRecord(record.record_id);
                            }}
                            title="Delete record"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      
                      <div className="record-body">
                        <h3 className="diagnosis">{record.diagnosis}</h3>
                        <div className="record-details">
                          <div className="detail-item">
                            <span className="detail-icon">�‍⚕️</span>
                            <span><strong>Doctor:</strong> {getDoctorName(record.doctor_id)}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-icon">🏥</span>
                            <span><strong>Specialization:</strong> {getDoctorSpecialization(record.doctor_id)}</span>
                          </div>
                          {record.file_path && (
                            <div className="detail-item">
                              <span className="detail-icon">📎</span>
                              <span><strong>File:</strong> {record.file_path}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="record-footer">
                        <span className={`severity-badge ${getSeverityClass(record.diagnosis)}`}>
                          {getSeverityClass(record.diagnosis).toUpperCase()}
                        </span>
                        <button className="view-details-btn">View Details →</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <div className="no-results-icon">📋</div>
                    <h3>No health records found</h3>
                    <p>
                      {searchTerm 
                        ? 'Try adjusting your search criteria' 
                        : 'You don\'t have any health records yet. Your medical history will appear here after consultations.'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="records-summary">
              <div className="summary-stats">
                <div className="summary-card">
                  <div className="summary-number">{userRecords.length}</div>
                  <div className="summary-label">Total Records</div>
                </div>
                <div className="summary-card">
                  <div className="summary-number">{filteredRecords.length}</div>
                  <div className="summary-label">Showing</div>
                </div>
                <div className="summary-card">
                  <div className="summary-number">
                    {userRecords.filter(r => getSeverityClass(r.diagnosis) === 'critical').length}
                  </div>
                  <div className="summary-label">Critical</div>
                </div>
                <div className="summary-card">
                  <div className="summary-number">
                    {[...new Set(userRecords.map(r => r.doctor_id))].length}
                  </div>
                  <div className="summary-label">Doctors</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Record Details Modal */}
        {selectedRecord && (
          <div className="modal-overlay" onClick={() => setSelectedRecord(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Health Record Details</h2>
                <button className="close-btn" onClick={() => setSelectedRecord(null)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="record-detail-grid">
                  <div className="detail-group">
                    <label>Record ID</label>
                    <span>#{selectedRecord.record_id}</span>
                  </div>
                  <div className="detail-group">
                    <label>Date</label>
                    <span>{formatDate(selectedRecord.record_date)}</span>
                  </div>
                  <div className="detail-group">
                    <label>Doctor</label>
                    <span>{getDoctorName(selectedRecord.doctor_id)}</span>
                  </div>
                  <div className="detail-group">
                    <label>Specialization</label>
                    <span>{getDoctorSpecialization(selectedRecord.doctor_id)}</span>
                  </div>
                  <div className="detail-group full-width">
                    <label>Diagnosis</label>
                    <span>{selectedRecord.diagnosis}</span>
                  </div>
                  <div className="detail-group">
                    <label>Severity</label>
                    <span className={`severity-badge ${getSeverityClass(selectedRecord.diagnosis)}`}>
                      {getSeverityClass(selectedRecord.diagnosis).toUpperCase()}
                    </span>
                  </div>
                  {selectedRecord.file_path && (
                    <div className="detail-group full-width">
                      <label>Attached File</label>
                      <span>{selectedRecord.file_path}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AddRecordModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
        user={user}
      />
    </div>
  );
};

export default Records;
