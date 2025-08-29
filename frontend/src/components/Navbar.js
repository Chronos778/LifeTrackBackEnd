import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/home', label: 'Home', icon: '🏠' },
    { path: '/doctors', label: 'Doctors', icon: '👨‍⚕️' },
    { path: '/records', label: 'Records', icon: '📋' },
    { path: '/treatments', label: 'Treatments', icon: '💊' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/home" className="brand-link">
          <span className="brand-icon">✚</span>
          LifeTrack
        </Link>
      </div>
      
      <div className="navbar-menu">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="navbar-user">
        <span className="user-welcome">Welcome, {user.name}</span>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
