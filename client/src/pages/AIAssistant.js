import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AIAssistant.css';

const AIAssistant = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: 'Hello! I\'m your NHS Incident Report Assistant. I\'m here to help you report an incident accurately and completely. Please describe the incident, and I\'ll ask follow-up questions to gather all necessary information.',
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No auth token found in localStorage');
    }
    return token;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;

    const userMessage = {
      type: 'user',
      content: userInput,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Not authenticated. Please login again.');
      }

      const conversationHistory = messages
        .filter(msg => msg.type !== 'extracted-data')
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));

      const response = await axios.post('/api/ai/analyze', {
        userMessage: userInput,
        conversationHistory
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'API returned an error');
      }

      const assistantMessage = {
        type: 'assistant',
        content: response.data.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);

      if (response.data.extractedData) {
        setExtractedData(response.data.extractedData);
      }
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error message:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      
      const errorMessage = {
        type: 'assistant',
        content: `Error: ${error.response?.data?.error || error.message || 'An unknown error occurred. Please try again.'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitIncident = async () => {
    if (!extractedData) return;

    setSubmitting(true);
    setSubmitMessage('Saving incident...');

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Not authenticated. Please login again.');
      }

      // Create incident object with extracted data
      // Parse date if it's a string
      let dateOfIncident = extractedData.dateOfIncident || new Date().toISOString().split('T')[0];
      if (typeof dateOfIncident === 'string') {
        dateOfIncident = new Date(dateOfIncident).toISOString();
      }

      const incidentData = {
        incidentType: extractedData.incidentType || 'Other',
        severity: extractedData.severity || 'Medium',
        location: extractedData.location || 'Unknown',
        dateOfIncident: dateOfIncident,
        timeOfIncident: extractedData.timeOfIncident || '00:00',
        description: extractedData.description || '',
        affectedIndividuals: parseInt(extractedData.affectedIndividuals) || 1,
        actionsTaken: extractedData.actionsTaken || 'No actions documented',
        status: 'Open' // Use 'Open' which is a valid enum value
      };

      console.log('Submitting incident data:', incidentData);

      // Submit to incidents API
      const response = await axios.post('/api/incidents', incidentData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201 || response.status === 200) {
        setSubmitMessage('✅ Incident saved successfully!');
        
        // Reset form after 2 seconds
        setTimeout(() => {
          setMessages([
            {
              type: 'assistant',
              content: 'Hello! I\'m your NHS Incident Report Assistant. I\'m here to help you report an incident accurately and completely. Please describe the incident, and I\'ll ask follow-up questions to gather all necessary information.',
              timestamp: new Date()
            }
          ]);
          setExtractedData(null);
          setSubmitMessage('');
          
          // Navigate to incidents list after 3 seconds
          setTimeout(() => {
            navigate('/incidents');
          }, 1000);
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting incident:', error);
      const errorMsg = error.response?.data?.errors 
        ? error.response.data.errors.map(e => e.msg).join(', ')
        : error.response?.data?.error || error.message || 'Failed to save incident';
      setSubmitMessage(`❌ Error: ${errorMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ai-assistant-container">
      <div className="ai-assistant-main">
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.type}`}>
                <div className="message-content">
                  {msg.content}
                </div>
                <small className="message-time">
                  {msg.timestamp?.toLocaleTimeString()}
                </small>
              </div>
            ))}
            {loading && (
              <div className="message assistant">
                <div className="message-content">
                  <span className="typing-indicator">
                    <span></span><span></span><span></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chat-form">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Describe the incident..."
              disabled={loading || submitting}
              className="chat-input"
            />
            <button type="submit" disabled={loading || submitting} className="send-button">
              {loading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>

        {extractedData && (
          <div className="extracted-data-panel">
            <h3>Extracted Information</h3>
            <div className="data-fields">
              {extractedData.incidentType && (
                <div className="data-field">
                  <label>Incident Type:</label>
                  <p>{extractedData.incidentType}</p>
                </div>
              )}
              {extractedData.severity && (
                <div className="data-field">
                  <label>Severity:</label>
                  <p>{extractedData.severity}</p>
                </div>
              )}
              {extractedData.location && (
                <div className="data-field">
                  <label>Location:</label>
                  <p>{extractedData.location}</p>
                </div>
              )}
              {extractedData.dateOfIncident && (
                <div className="data-field">
                  <label>Date:</label>
                  <p>{extractedData.dateOfIncident}</p>
                </div>
              )}
              {extractedData.timeOfIncident && (
                <div className="data-field">
                  <label>Time:</label>
                  <p>{extractedData.timeOfIncident}</p>
                </div>
              )}
              {extractedData.description && (
                <div className="data-field">
                  <label>Description:</label>
                  <p>{extractedData.description}</p>
                </div>
              )}
              {extractedData.affectedIndividuals && (
                <div className="data-field">
                  <label>Affected Individuals:</label>
                  <p>{extractedData.affectedIndividuals}</p>
                </div>
              )}
              {extractedData.actionsTaken && (
                <div className="data-field">
                  <label>Actions Taken:</label>
                  <p>{extractedData.actionsTaken}</p>
                </div>
              )}
              {extractedData.immediateRisks && (
                <div className="data-field">
                  <label>Immediate Risks:</label>
                  <p>{extractedData.immediateRisks}</p>
                </div>
              )}
            </div>
            {submitMessage && (
              <div className={`submit-message ${submitMessage.includes('✅') ? 'success' : 'error'}`}>
                {submitMessage}
              </div>
            )}
            {extractedData.complete && !submitting && (
              <button 
                onClick={handleSubmitIncident} 
                className="submit-button"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : '💾 Save to Incidents List'}
              </button>
            )}
            {submitting && (
              <button className="submit-button" disabled>
                Saving...
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
