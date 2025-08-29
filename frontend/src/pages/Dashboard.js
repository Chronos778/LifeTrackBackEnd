import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const Dashboard = ({ user, onLogout }) => {
  const [data, setData] = useState({
    users: [],
    doctors: [],
    healthRecords: [],
    treatments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [users, doctors, healthRecords, treatments] = await Promise.all([
          apiService.getUsers(),
          apiService.getDoctors(),
          apiService.getHealthRecords(),
          apiService.getTreatments()
        ]);

        setData({
          users,
          doctors,
          healthRecords,
          treatments
        });
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="dashboard">
        <nav className="navbar">
          <div className="navbar-brand">LifeTrack Dashboard</div>
          <div className="navbar-user">
            <span>Welcome, {user.name}</span>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </nav>
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <nav className="navbar">
          <div className="navbar-brand">LifeTrack Dashboard</div>
          <div className="navbar-user">
            <span>Welcome, {user.name}</span>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </nav>
        <div className="error-message" style={{ margin: '2rem' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-brand">LifeTrack Dashboard</div>
        <div className="navbar-user">
          <span>Welcome, {user.name}</span>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <h1>LifeTrack - Personal Health Records</h1>
        
        <div className="dashboard-grid">
          {/* Users Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Users</h2>
              <span className="card-count">{data.users.length}</span>
            </div>
            <ul className="data-list">
              {data.users.length > 0 ? (
                data.users.map(user => (
                  <li key={user.user_id} className="data-item">
                    <div className="item-name">{user.name}</div>
                    <div className="item-detail">
                      {user.age} years old • {user.gender} • {user.email}
                    </div>
                  </li>
                ))
              ) : (
                <li className="no-data">No users found</li>
              )}
            </ul>
          </div>

          {/* Doctors Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Doctors</h2>
              <span className="card-count">{data.doctors.length}</span>
            </div>
            <ul className="data-list">
              {data.doctors.length > 0 ? (
                data.doctors.map(doctor => (
                  <li key={doctor.doctor_id} className="data-item">
                    <div className="item-name">{doctor.name}</div>
                    <div className="item-detail">
                      {doctor.specialization} • {doctor.contact_number}
                    </div>
                  </li>
                ))
              ) : (
                <li className="no-data">No doctors found</li>
              )}
            </ul>
          </div>

          {/* Health Records Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Health Records</h2>
              <span className="card-count">{data.healthRecords.length}</span>
            </div>
            <ul className="data-list">
              {data.healthRecords.length > 0 ? (
                data.healthRecords.map(record => (
                  <li key={record.record_id} className="data-item">
                    <div className="item-name">{record.diagnosis}</div>
                    <div className="item-detail">
                      Date: {formatDate(record.record_date)} • User ID: {record.user_id}
                    </div>
                  </li>
                ))
              ) : (
                <li className="no-data">No health records found</li>
              )}
            </ul>
          </div>

          {/* Treatments Card */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Treatments</h2>
              <span className="card-count">{data.treatments.length}</span>
            </div>
            <ul className="data-list">
              {data.treatments.length > 0 ? (
                data.treatments.map(treatment => (
                  <li key={treatment.treatment_id} className="data-item">
                    <div className="item-name">{treatment.medication}</div>
                    <div className="item-detail">
                      {treatment.procedure}
                      {treatment.follow_up_date && (
                        <> • Follow-up: {formatDate(treatment.follow_up_date)}</>
                      )}
                    </div>
                  </li>
                ))
              ) : (
                <li className="no-data">No treatments found</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
