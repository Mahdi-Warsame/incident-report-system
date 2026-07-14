import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './AIAssistant.css';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      type: 'assistant',
      content: 'Hello! I\'m your NHS Incident Report Assistant. I\'m here to help you report an incident accurately and completely. Please describe the incident, and I\'ll ask follow-up questions to gather all necessary information.',
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAuthToken = () => {
    // Try to get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No auth token found in localStorage');
    }
    return token;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;

    // Add user message to chat
    const userMessage = {
      type: 'user',
      content: userInput,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setLoading(true);

    try {
      // Get auth token
      const token = getAuthToken();
      if (!token) {
        throw new Error('Not authenticated. Please login again.');
      }

      // Prepare conversation history
      const conversationHistory = messages
        .filter(msg => msg.type !== 'extracted-data')
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));

      // Call AI API with auth token
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

      // Add assistant message
      const assistantMessage = {
        type: 'assistant',
        content: response.data.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Update extracted data if available
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

  const handleSubmitIncident = () => {
    if (extractedData) {
      // Pass extracted data to parent or navigate to incident form
      console.log('Submitting incident:', extractedData);
      // TODO: Submit to backend
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
              disabled={loading}
              className="chat-input"
            />
            <button type="submit" disabled={loading} className="send-button">
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
            </div>
            {extractedData.complete && (
              <button onClick={handleSubmitIncident} className="submit-button">
                Submit Incident Report
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
