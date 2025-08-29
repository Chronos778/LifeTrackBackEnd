import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AddDoctorModal from '../components/AddDoctorModal';
import { apiService } from '../services/api';

const Home = ({ user, onLogout }) => {
  const [stats, setStats] = useState({
    visitedDoctors: 0,
    totalRecords: 0,
    totalTreatments: 0,
    recentActivity: 0
  });
  const [recentRecords, setRecentRecords] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRecords, userTreatments, visitedDoctors] = await Promise.all([
          apiService.getUserHealthRecords(user.user_id),
          apiService.getUserTreatments(user.user_id),
          apiService.getDoctorsVisitedByUser(user.user_id)
        ]);

        setStats({
          visitedDoctors: visitedDoctors.length,
          totalRecords: userRecords.length,
          totalTreatments: userTreatments.length,
          recentActivity: userRecords.filter(record => {
            const recordDate = new Date(record.record_date);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return recordDate >= thirtyDaysAgo;
          }).length
        });

        // Get recent records (last 3 for user)
        setRecentRecords(userRecords.slice(0, 3));
        setDoctors(visitedDoctors);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.user_id]);

  const handleAddDoctorSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="home-page">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="home-content">
        <div className="welcome-section">
          <h1>Welcome back, {user.name}!</h1>
          <p>Here's your personal health overview</p>
        </div>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {loading ? (
          <div className="loading">Loading your health data...</div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card doctors">
                <div className="stat-icon">�‍⚕️</div>
                <div className="stat-info">
                  <h3>{stats.visitedDoctors}</h3>
                  <p>Doctors Visited</p>
                </div>
              </div>
              
              <div className="stat-card records">
                <div className="stat-icon">�</div>
                <div className="stat-info">
                  <h3>{stats.totalRecords}</h3>
                  <p>Health Records</p>
                </div>
              </div>
              
              <div className="stat-card treatments">
                <div className="stat-icon">�</div>
                <div className="stat-info">
                  <h3>{stats.totalTreatments}</h3>
                  <p>Treatments</p>
                </div>
              </div>

              <div className="stat-card users">
                <div className="stat-icon">�</div>
                <div className="stat-info">
                  <h3>{stats.recentActivity}</h3>
                  <p>Recent Activity (30 days)</p>
                </div>
              </div>
            </div>

            <div className="recent-section">
              <h2>Your Recent Health Records</h2>
              {recentRecords.length > 0 ? (
                <div className="recent-records">
                  {recentRecords.map(record => {
                    const doctor = doctors.find(doc => doc.doctor_id === record.doctor_id);
                    return (
                      <div key={record.record_id} className="recent-record-card">
                        <div className="record-header">
                          <h4>{record.diagnosis}</h4>
                          <span className="record-date">{formatDate(record.record_date)}</span>
                        </div>
                        <div className="record-details">
                          <p><strong>Doctor:</strong> {doctor ? `${doctor.name} (${doctor.specialization})` : 'Doctor information not available'}</p>
                          {record.file_path && (
                            <p><strong>File:</strong> {record.file_path}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-data">
                  <p>No health records found. Your medical history will appear here once you have consultations.</p>
                </div>
              )}
            </div>

            {doctors.length > 0 && (
              <div className="doctors-overview">
                <div className="section-header">
                  <h2>Your Care Team</h2>
                  <button 
                    className="btn-secondary"
                    onClick={() => setShowAddDoctorModal(true)}
                  >
                    <span className="btn-icon">➕</span>
                    Add Doctor
                  </button>
                </div>
                <div className="doctors-quick-view">
                  {doctors.map(doctor => (
                    <div key={doctor.doctor_id} className="doctor-mini-card">
                      <div className="doctor-avatar">👨‍⚕️</div>
                      <div className="doctor-info">
                        <h4>{doctor.name}</h4>
                        <p>{doctor.specialization}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {doctors.length === 0 && !loading && (
              <div className="no-doctors-section">
                <div className="no-data">
                  <h3>No Care Team Yet</h3>
                  <p>Add doctors to start building your care network</p>
                  <button 
                    className="btn-primary"
                    onClick={() => setShowAddDoctorModal(true)}
                  >
                    <span className="btn-icon">➕</span>
                    Add Your First Doctor
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AddDoctorModal
        isOpen={showAddDoctorModal}
        onClose={() => setShowAddDoctorModal(false)}
        onSuccess={handleAddDoctorSuccess}
      />
    </div>
  );
};

export default Home;
