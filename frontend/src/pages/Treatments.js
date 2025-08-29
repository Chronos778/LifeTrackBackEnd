import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AddTreatmentModal from '../components/AddTreatmentModal';
import { apiService } from '../services/api';

const Treatments = ({ user, onLogout }) => {
  const [userTreatments, setUserTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserTreatments = async () => {
      try {
        const treatmentHistory = await apiService.getUserTreatmentHistory(user.user_id);
        setUserTreatments(treatmentHistory);
      } catch (error) {
        console.error('Error fetching user treatments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTreatments();
  }, [user.user_id]);

  const fetchUserTreatments = async () => {
    try {
      setLoading(true);
      const treatmentHistory = await apiService.getUserTreatmentHistory(user.user_id);
      setUserTreatments(treatmentHistory);
    } catch (error) {
      console.error('Error fetching user treatments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = (message) => {
    setSuccessMessage(message);
    fetchUserTreatments(); // Refresh data
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteTreatment = async (treatmentId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this treatment? This action cannot be undone.');
    
    if (confirmDelete) {
      try {
        await apiService.deleteTreatment(treatmentId);
        setSuccessMessage('Treatment deleted successfully!');
        fetchUserTreatments(); // Refresh the list
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting treatment:', error);
        alert('Error deleting treatment. Please try again.');
      }
    }
  };

  const getTreatmentStatus = (followUpDate) => {
    if (!followUpDate) return 'completed';
    const today = new Date();
    const followUp = new Date(followUpDate);
    return followUp > today ? 'ongoing' : 'followup_due';
  };

  const filteredTreatments = userTreatments.filter(treatment => {
    const searchLower = searchTerm.toLowerCase();
    const status = getTreatmentStatus(treatment.follow_up_date);
    
    const matchesSearch = (
      treatment.medication.toLowerCase().includes(searchLower) ||
      (treatment.procedure && treatment.procedure.toLowerCase().includes(searchLower)) ||
      (treatment.diagnosis && treatment.diagnosis.toLowerCase().includes(searchLower)) ||
      (treatment.doctor_name && treatment.doctor_name.toLowerCase().includes(searchLower))
    );
    
    const matchesStatus = filterStatus === 'all' || status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'ongoing': return 'status-ongoing';
      case 'followup_due': return 'status-due';
      case 'completed': return 'status-completed';
      default: return 'status-unknown';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'ongoing': return 'Ongoing';
      case 'followup_due': return 'Follow-up Due';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'ongoing': return '🔄';
      case 'followup_due': return '⚠️';
      case 'completed': return '✅';
      default: return '❓';
    }
  };

  const groupTreatmentsByCondition = (treatments) => {
    return treatments.reduce((groups, treatment) => {
      const condition = treatment.diagnosis || 'Unknown Condition';
      if (!groups[condition]) {
        groups[condition] = [];
      }
      groups[condition].push(treatment);
      return groups;
    }, {});
  };

  return (
    <div className="treatments-page">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="page-content">
        <div className="page-header">
          <h1>My Treatments</h1>
          <p>Track your medications, procedures, and treatment progress</p>
        </div>

        <div className="treatments-controls">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search treatments by medication, condition, or doctor..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-controls">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Statuses</option>
              <option value="ongoing">Ongoing</option>
              <option value="followup_due">Follow-up Due</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <button 
            className="btn-primary add-treatment-btn"
            onClick={() => setShowAddModal(true)}
          >
            <span className="btn-icon">➕</span>
            Add Treatment
          </button>
        </div>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {loading ? (
          <div className="loading">Loading your treatments...</div>
        ) : (
          <>
            {/* Treatment Summary Cards */}
            <div className="treatment-overview">
              <div className="overview-cards">
                <div className="overview-card ongoing">
                  <div className="card-icon">🔄</div>
                  <div className="card-info">
                    <div className="card-number">
                      {userTreatments.filter(t => getTreatmentStatus(t.follow_up_date) === 'ongoing').length}
                    </div>
                    <div className="card-label">Ongoing Treatments</div>
                  </div>
                </div>
                <div className="overview-card due">
                  <div className="card-icon">⚠️</div>
                  <div className="card-info">
                    <div className="card-number">
                      {userTreatments.filter(t => getTreatmentStatus(t.follow_up_date) === 'followup_due').length}
                    </div>
                    <div className="card-label">Follow-ups Due</div>
                  </div>
                </div>
                <div className="overview-card completed">
                  <div className="card-icon">✅</div>
                  <div className="card-info">
                    <div className="card-number">
                      {userTreatments.filter(t => getTreatmentStatus(t.follow_up_date) === 'completed').length}
                    </div>
                    <div className="card-label">Completed</div>
                  </div>
                </div>
                <div className="overview-card total">
                  <div className="card-icon">💊</div>
                  <div className="card-info">
                    <div className="card-number">{userTreatments.length}</div>
                    <div className="card-label">Total Treatments</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Treatments by Condition */}
            <div className="treatments-by-condition">
              {Object.keys(groupTreatmentsByCondition(filteredTreatments)).length > 0 ? (
                Object.entries(groupTreatmentsByCondition(filteredTreatments)).map(([condition, treatments]) => (
                  <div key={condition} className="condition-group">
                    <div className="condition-header">
                      <h3 className="condition-title">🏥 {condition}</h3>
                      <span className="treatment-count">{treatments.length} treatment{treatments.length > 1 ? 's' : ''}</span>
                    </div>
                    
                    <div className="treatments-grid">
                      {treatments.map(treatment => {
                        const status = getTreatmentStatus(treatment.follow_up_date);
                        
                        return (
                          <div 
                            key={treatment.treatment_id} 
                            className="treatment-card user-treatment"
                            onClick={() => setSelectedTreatment(treatment)}
                          >
                            <div className="treatment-header">
                              <div className="treatment-id">#{treatment.treatment_id}</div>
                              <div className="treatment-header-actions">
                                <span className={`status-badge ${getStatusClass(status)}`}>
                                  {getStatusIcon(status)} {getStatusLabel(status)}
                                </span>
                                <button 
                                  className="delete-btn" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTreatment(treatment.treatment_id);
                                  }}
                                  title="Delete treatment"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                            
                            <div className="treatment-body">
                              <h3 className="medication-name">💊 {treatment.medication}</h3>
                              
                              <div className="treatment-timeline">
                                <div className="timeline-item">
                                  <span className="timeline-icon">📅</span>
                                  <span className="timeline-text">
                                    <strong>Started:</strong> {formatDate(treatment.record_date)}
                                  </span>
                                </div>
                                
                                <div className="timeline-item">
                                  <span className="timeline-icon">�‍⚕️</span>
                                  <span className="timeline-text">
                                    <strong>Prescribed by:</strong> {treatment.doctor_name}
                                  </span>
                                </div>
                                
                                {treatment.doctor_specialization && (
                                  <div className="timeline-item">
                                    <span className="timeline-icon">🏥</span>
                                    <span className="timeline-text">
                                      <strong>Specialty:</strong> {treatment.doctor_specialization}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              {treatment.procedure && (
                                <div className="procedure-info">
                                  <span className="procedure-icon">📋</span>
                                  <span className="procedure-text">{treatment.procedure}</span>
                                </div>
                              )}
                              
                              {treatment.follow_up_date && (
                                <div className="follow-up-info">
                                  <span className="follow-up-icon">🔔</span>
                                  <span className={`follow-up-text ${status === 'followup_due' ? 'overdue' : ''}`}>
                                    <strong>Follow-up:</strong> {formatDate(treatment.follow_up_date)}
                                    {status === 'followup_due' && <span className="overdue-label"> (Overdue)</span>}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="treatment-footer">
                              <button className="view-details-btn">View Details →</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <div className="no-results-icon">💊</div>
                  <h3>No treatments found</h3>
                  <p>
                    {searchTerm || filterStatus !== 'all'
                      ? 'Try adjusting your search or filter criteria' 
                      : 'You don\'t have any treatments recorded yet. Your treatment history will appear here after consultations.'
                    }
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Treatment Details Modal */}
        {selectedTreatment && (
          <div className="modal-overlay" onClick={() => setSelectedTreatment(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Treatment Details</h2>
                <button className="close-btn" onClick={() => setSelectedTreatment(null)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="treatment-detail-grid">
                  <div className="detail-group">
                    <label>Treatment ID</label>
                    <span>#{selectedTreatment.treatment_id}</span>
                  </div>
                  <div className="detail-group">
                    <label>Status</label>
                    <span className={`status-badge ${getStatusClass(getTreatmentStatus(selectedTreatment.follow_up_date))}`}>
                      {getStatusIcon(getTreatmentStatus(selectedTreatment.follow_up_date))} {getStatusLabel(getTreatmentStatus(selectedTreatment.follow_up_date))}
                    </span>
                  </div>
                  <div className="detail-group">
                    <label>Started Date</label>
                    <span>{formatDate(selectedTreatment.record_date)}</span>
                  </div>
                  <div className="detail-group">
                    <label>Follow-up Date</label>
                    <span>{formatDate(selectedTreatment.follow_up_date)}</span>
                  </div>
                  <div className="detail-group full-width">
                    <label>Condition Treated</label>
                    <span>{selectedTreatment.diagnosis}</span>
                  </div>
                  <div className="detail-group full-width">
                    <label>Medication</label>
                    <span>{selectedTreatment.medication}</span>
                  </div>
                  <div className="detail-group">
                    <label>Doctor</label>
                    <span>{selectedTreatment.doctor_name}</span>
                  </div>
                  <div className="detail-group">
                    <label>Specialization</label>
                    <span>{selectedTreatment.doctor_specialization}</span>
                  </div>
                  {selectedTreatment.procedure && (
                    <div className="detail-group full-width">
                      <label>Procedure/Instructions</label>
                      <span>{selectedTreatment.procedure}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AddTreatmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
        user={user}
      />
    </div>
  );
};

export default Treatments;
