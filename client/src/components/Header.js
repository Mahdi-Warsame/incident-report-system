import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="sentricare-header">
      <div className="header-container">
        {/* Logo and branding */}
        <Link to="/dashboard" className="header-brand">
          <img src="/sentricare-logo.svg" alt="SentriCare" className="logo" />
          <div className="brand-text">
            <h1>SentriCare</h1>
            <p className="tagline">Less form, more safety</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="header-nav">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/incidents" className="nav-link">Incidents</Link>
          <Link to="/ai-assistant" className="nav-link">AI Assistant</Link>
        </nav>

        {/* User section */}
        <div className="header-user">
          {user && (
            <>
              <span className="user-name">{user.firstName} {user.lastName}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
