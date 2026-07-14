import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="nhs-blue text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold">NHS Incident System</Link>
          <div className="flex gap-6">
            <Link to="/dashboard" className="hover:opacity-80 transition">Dashboard</Link>
            <Link to="/report" className="hover:opacity-80 transition">Report Incident</Link>
            <Link to="/incidents" className="hover:opacity-80 transition">Incidents</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>{user?.firstName} {user?.lastName}</span>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;