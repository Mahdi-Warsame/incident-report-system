import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const data = isLogin
        ? { email, password }
        : { email, password, firstName, lastName };

      const response = await axios.post(endpoint, data);
      onLogin(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-bg-pattern"></div>
      
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <img src="/sentricare-logo.svg" alt="SentriCare" className="login-logo" />
            <h1>SentriCare</h1>
            <p className="login-tagline">Safety Management System</p>
          </div>

          <div className="login-form-section">
            <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>

            {error && (
              <div className="login-error">
                <span>⚠️</span>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              {!isLogin && (
                <>
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      placeholder="Enter your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      placeholder="Enter your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="login-button">
                {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="login-toggle">
              <p>
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="toggle-button"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </div>

          <div className="login-footer">
            <p className="security-note">
              🔒 Your data is secured with end-to-end encryption
            </p>
          </div>
        </div>

        <div className="login-info">
          <div className="info-card">
            <h3>🎯 Less Form, More Safety</h3>
            <p>Streamlined incident reporting with AI-powered assistance</p>
          </div>
          <div className="info-card">
            <h3>⚡ Fast & Easy</h3>
            <p>Report incidents in minutes, not hours</p>
          </div>
          <div className="info-card">
            <h3>📊 Real-time Analytics</h3>
            <p>Track patterns and trends with interactive dashboards</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
