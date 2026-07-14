import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const IncidentForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    incidentType: '',
    severity: '',
    location: '',
    description: '',
    dateOfIncident: '',
    timeOfIncident: '',
    affectedIndividuals: 1,
    actionsTaken: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/incidents', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/incidents');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit incident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">Report an Incident</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Incident Type</label>
              <select
                name="incidentType"
                value={formData.incidentType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-900"
                required
              >
                <option value="">Select an Incident Type</option>
                <option value="Patient Safety">Patient Safety</option>
                <option value="Staff Safety">Staff Safety</option>
                <option value="Equipment Failure">Equipment Failure</option>
                <option value="Medication Error">Medication Error</option>
                <option value="Fall">Fall</option>
                <option value="Infection Control">Infection Control</option>
                <option value="Communication Issue">Communication Issue</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Severity</label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-900"
                required
              >
                <option value="">Select Severity</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter SiguIdents/CosID"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-900"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the incident in detail"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-900"
              rows="5"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Date of Incident</label>
              <input
                type="date"
                name="dateOfIncident"
                value={formData.dateOfIncident}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-900"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Time of Incident</label>
              <input
                type="time"
                name="timeOfIncident"
                value={formData.timeOfIncident}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Number of Affected Individuals</label>
            <input
              type="number"
              name="affectedIndividuals"
              value={formData.affectedIndividuals}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-900"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Actions Taken</label>
            <textarea
              name="actionsTaken"
              value={formData.actionsTaken}
              onChange={handleChange}
              placeholder="Describe the actions taken in response to the incident"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-900"
              rows="4"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 nhs-blue text-white py-2 rounded font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/incidents')}
              className="flex-1 bg-gray-400 text-white py-2 rounded font-semibold hover:opacity-90 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncidentForm;