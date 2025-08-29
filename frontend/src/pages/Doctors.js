import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { apiService } from '../services/api';
import { healthDataManager } from '../utils/dataStructures';

const Doctors = ({ user, onLogout }) => {
  const [visitedDoctors, setVisitedDoctors] = useState([]);
  const [visitHistory, setVisitHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [medicalSuggestions, setMedicalSuggestions] = useState([]);
  const [doctorAnalytics, setDoctorAnalytics] = useState(null);

  const fetchVisitedDoctors = async () => {
    try {
      setLoading(true);
      // Fetch all doctors + user health records in parallel
      const [allDoctors, userRecords] = await Promise.all([
        apiService.getDoctors(),
        apiService.getUserHealthRecords(user.user_id)
      ]);

      // Add doctors to our advanced data structure
      allDoctors.forEach(doctor => {
        healthDataManager.addDoctor(doctor);
      });

      // Add health records to our data structures
      userRecords.forEach(record => {
        healthDataManager.addHealthRecord(record);
      });

      // Use Set data structure for unique doctor IDs
      const visitedDoctorIds = [...new Set(userRecords.map(r => r.doctor_id))];
      let derivedVisitedDoctors = allDoctors.filter(d => visitedDoctorIds.includes(d.doctor_id));

      // Fallback: if user has no records yet, still show all doctors so newly added ones appear
      if (derivedVisitedDoctors.length === 0) {
        derivedVisitedDoctors = allDoctors;
      }

      setVisitedDoctors(derivedVisitedDoctors);

      // Build visit history with doctor details using our hash table for fast lookups
      const history = userRecords.map(record => {
        const doctor = healthDataManager.getDoctor(record.doctor_id) || 
                     allDoctors.find(d => d.doctor_id === record.doctor_id);
        return {
          ...record,
          doctor_name: doctor?.name || 'Unknown Doctor',
          doctor_specialization: doctor?.specialization || 'General Practice'
        };
      });

      setVisitHistory(history);

      // Get analytics using our advanced data structures
      const analytics = healthDataManager.getDoctorAnalytics();
      setDoctorAnalytics(analytics);

    } catch (error) {
      console.error('Error fetching doctors data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitedDoctors();
  }, [user.user_id]);

  const handleDeleteDoctor = async (doctorId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this doctor? This will also delete all associated health records and treatments. This action cannot be undone.');
    
    if (confirmDelete) {
      try {
        await apiService.deleteDoctor(doctorId);
        setSuccessMessage('Doctor deleted successfully!');
        fetchVisitedDoctors(); // Refresh the list
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting doctor:', error);
        alert('Error deleting doctor. Please try again.');
      }
    }
  };

  // Enhanced search using our data structures
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Get medical term suggestions using Trie
    if (value.length > 1) {
      const suggestions = healthDataManager.getMedialSuggestions(value);
      setMedicalSuggestions(suggestions);
    } else {
      setMedicalSuggestions([]);
    }
  };

  // Enhanced filtering using hash table and search structures
  const filteredDoctors = visitedDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doctor.specialization && doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialization = !selectedSpecialization || doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  // Use Set for unique specializations
  const specializations = [...new Set(visitedDoctors.map(doctor => doctor.specialization).filter(Boolean))];

  // Optimized visit count using our data structures
  const getVisitCount = (doctorId) => {
    return visitHistory.filter(visit => visit.doctor_id === doctorId).length;
  };

  const getLastVisit = (doctorId) => {
    const visits = visitHistory.filter(visit => visit.doctor_id === doctorId);
    if (visits.length === 0) return null;
    
    const lastVisit = visits.sort((a, b) => new Date(b.record_date) - new Date(a.record_date))[0];
    return new Date(lastVisit.record_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getVisitConditions = (doctorId) => {
    const visits = visitHistory.filter(visit => visit.doctor_id === doctorId);
    return [...new Set(visits.map(visit => visit.diagnosis))];
  };

  return (
    <div className="doctors-page">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="page-content">
        {successMessage && (
          <div className="toast-message success">
            {successMessage}
          </div>
        )}
        
        <div className="page-header">
          <h1>My Doctors</h1>
          <p>Medical professionals you have consulted</p>
        </div>

        <div className="filters-section">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search your doctors by name or specialization..."
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {medicalSuggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {medicalSuggestions.map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="suggestion-item"
                    onClick={() => {
                      setSearchTerm(suggestion);
                      setMedicalSuggestions([]);
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="filter-dropdown">
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="specialization-filter"
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading your doctors...</div>
        ) : (
          <>
            <div className="doctors-grid">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map(doctor => (
                  <div key={doctor.doctor_id} className="doctor-card visited">
                    <div className="doctor-header">
                      <div className="doctor-avatar">
                        👨‍⚕️
                      </div>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteDoctor(doctor.doctor_id)}
                        title="Delete doctor"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="doctor-info">
                      <h3 className="doctor-name">{doctor.name}</h3>
                      <p className="doctor-specialization">
                        {doctor.specialization || 'General Practice'}
                      </p>
                      
                      <div className="visit-summary">
                        <div className="visit-stats">
                          <div className="stat-item">
                            <span className="stat-number">{getVisitCount(doctor.doctor_id)}</span>
                            <span className="stat-label">Visits</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-date">Last: {getLastVisit(doctor.doctor_id)}</span>
                          </div>
                        </div>
                        
                        <div className="conditions-treated">
                          <h4>Conditions Treated:</h4>
                          <div className="condition-tags">
                            {getVisitConditions(doctor.doctor_id).map((condition, index) => (
                              <span key={index} className="condition-tag">
                                {condition}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="doctor-contact">
                        <div className="contact-item">
                          <span className="contact-icon">📞</span>
                          <span>{doctor.contact_number || 'Not available'}</span>
                        </div>
                        <div className="contact-item">
                          <span className="contact-icon">✉</span>
                          <span>{doctor.email || 'Not available'}</span>
                        </div>
                      </div>
                      
                      <div className="doctor-actions">
                        <button className="btn-primary">
                          <span className="btn-icon">📅</span>
                          Schedule Follow-up
                        </button>
                        <button className="btn-secondary">
                          <span className="btn-icon">�</span>
                          View History
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <div className="no-results-icon">👨‍⚕️</div>
                  <h3>No matching doctors</h3>
                  <p>
                    {searchTerm || selectedSpecialization
                      ? 'No doctors match your filters. Clear filters to see all.'
                      : 'No doctors available yet. Add a doctor to get started.'}
                  </p>
                </div>
              )}
            </div>

            <div className="doctors-summary">
              <div className="summary-card">
                <h3>Your Care Network</h3>
                <div className="summary-stats">
                  <div className="summary-stat">
                    <span className="summary-number">{visitedDoctors.length}</span>
                    <span className="summary-label">Doctors Consulted</span>
                  </div>
                  <div className="summary-stat">
                    <span className="summary-number">{visitHistory.length}</span>
                    <span className="summary-label">Total Consultations</span>
                  </div>
                  <div className="summary-stat">
                    <span className="summary-number">{specializations.length}</span>
                    <span className="summary-label">Specializations</span>
                  </div>
                </div>
              </div>
              
              {doctorAnalytics && (
                <div className="analytics-card">
                  <h3>System Analytics (Data Structures)</h3>
                  <div className="analytics-grid">
                    <div className="analytics-item">
                      <span className="analytics-label">Total Doctors in System:</span>
                      <span className="analytics-value">{doctorAnalytics.totalDoctors}</span>
                    </div>
                    <div className="analytics-item">
                      <span className="analytics-label">Cache Hit Rate:</span>
                      <span className="analytics-value">{Math.round((healthDataManager.getCacheStats().size / healthDataManager.getCacheStats().maxSize) * 100)}%</span>
                    </div>
                    <div className="analytics-item">
                      <span className="analytics-label">Most Busy Doctors:</span>
                      <div className="busy-doctors-list">
                        {doctorAnalytics.mostBusyDoctors.slice(0, 3).map((item, index) => {
                          const doctor = healthDataManager.getDoctor(item.doctorId);
                          return (
                            <div key={index} className="busy-doctor-item">
                              {doctor?.name || `Doctor ${item.doctorId}`} ({item.patientCount} patients)
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="analytics-item">
                      <span className="analytics-label">Specialization Distribution:</span>
                      <div className="specialization-counts">
                        {Object.entries(doctorAnalytics.specializationCounts).map(([spec, count]) => (
                          <div key={spec} className="spec-count-item">
                            {spec}: {count}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Doctors;
