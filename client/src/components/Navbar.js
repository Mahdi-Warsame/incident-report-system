import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="sentricare-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            <span className="logo-icon">🛡️</span>
            <span className="logo-text">SentriCare</span>
          </Link>
          <div className="navbar-menu">
            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
            <Link to="/report" className="navbar-link">Report Incident</Link>
            <Link to="/ai-assistant" className="navbar-link">AI Assistant</Link>
            <Link to="/incidents" className="navbar-link">Incidents</Link>
          </div>
        </div>
        <div className="navbar-user">
          <span className="user-name">{user?.firstName} {user?.lastName}</span>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
