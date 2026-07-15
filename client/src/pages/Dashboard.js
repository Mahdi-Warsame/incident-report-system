import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import Header from '../components/Header';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [incidentsByType, setIncidentsByType] = useState([]);
  const [severityTrends, setSeverityTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  // SentriCare color palette
  const SENTRICARE_COLORS = ['#003DA5', '#00A9CE', '#0072B2', '#FFD700', '#D55E00'];

  useEffect(() => {
    fetchUserData();
    fetchData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (err) {
      console.error('Failed to fetch user data');
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [dashRes, typeRes, trendsRes] = await Promise.all([
        axios.get('/api/analytics/dashboard', { headers }),
        axios.get('/api/analytics/incidents-by-type', { headers }),
        axios.get('/api/analytics/severity-trends', { headers })
      ]);

      setDashboardData(dashRes.data);
      setIncidentsByType(typeRes.data);
      setSeverityTrends(trendsRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <>
      <Header user={user} />
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    </>
  );

  if (error) return (
    <>
      <Header user={user} />
      <div className="error-container">{error}</div>
    </>
  );

  if (!dashboardData) return null;

  return (
    <>
      <Header user={user} />
      <div className="dashboard-container">
        <div className="dashboard-wrapper">
          {/* Welcome section */}
          <div className="welcome-section">
            <h1>Welcome to SentriCare</h1>
            <p>Safety-focused incident management dashboard</p>
          </div>

          {/* Key Metrics */}
          <div className="metrics-grid">
            <div className="metric-card metric-card-total">
              <h3>Total Incidents</h3>
              <p className="metric-value">{dashboardData.totalIncidents}</p>
              <p className="metric-label">Reported</p>
            </div>
            <div className="metric-card metric-card-open">
              <h3>Open Incidents</h3>
              <p className="metric-value">{dashboardData.openIncidents}</p>
              <p className="metric-label">Awaiting resolution</p>
            </div>
            <div className="metric-card metric-card-critical">
              <h3>Critical Issues</h3>
              <p className="metric-value">{dashboardData.criticalIncidents}</p>
              <p className="metric-label">Require immediate attention</p>
            </div>
            <div className="metric-card metric-card-resolved">
              <h3>Resolution Rate</h3>
              <p className="metric-value">{dashboardData.resolutionRate}%</p>
              <p className="metric-label">Incidents resolved</p>
            </div>
          </div>

          {/* Charts */}
          <div className="charts-grid">
            {/* Incidents by Type */}
            <div className="chart-card">
              <h2>Incidents by Type</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incidentsByType}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E7FF" />
                  <XAxis dataKey="_id" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db' }} />
                  <Bar dataKey="count" fill="#003DA5" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Severity Distribution */}
            <div className="chart-card">
              <h2>Severity Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.severityBreakdown}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {dashboardData.severityBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SENTRICARE_COLORS[index % SENTRICARE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Severity Trends */}
          <div className="chart-card full-width">
            <h2>Severity Trends Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={severityTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E7FF" />
                <XAxis dataKey="_id.date" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db' }} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#003DA5" 
                  strokeWidth={2}
                  dot={{ fill: '#003DA5', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
