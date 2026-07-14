const express = require('express');
const router = express.Router();
const { analyzeIncident, validateIncidentData } = require('../services/aiAssistant');
const auth = require('../middleware/auth');

/**
 * POST /api/ai/analyze
 * Analyzes an incident description and returns AI response with extracted data
 * Authentication: Required
 */
router.post('/analyze', auth, async (req, res) => {
  try {
    const { userMessage, conversationHistory } = req.body;

    // Validate input
    if (!userMessage || typeof userMessage !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'User message is required and must be a string'
      });
    }

    if (userMessage.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message cannot be empty'
      });
    }

    // Validate conversation history if provided
    let history = [];
    if (conversationHistory && Array.isArray(conversationHistory)) {
      history = conversationHistory.filter(msg => 
        msg.role && msg.content && 
        (msg.role === 'user' || msg.role === 'assistant')
      );
    }

    // Analyze incident using AI
    const result = await analyzeIncident(userMessage, history);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }

    // Return response with extracted data
    res.json({
      success: true,
      message: result.message,
      extractedData: result.extractedData,
      usage: result.usage
    });

  } catch (error) {
    console.error('AI Assistant Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred. Please try again.'
    });
  }
});

/**
 * POST /api/ai/validate
 * Validates extracted incident data
 * Authentication: Required
 */
router.post('/validate', auth, async (req, res) => {
  try {
    const { extractedData } = req.body;

    if (!extractedData || typeof extractedData !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Extracted data object is required'
      });
    }

    const validation = validateIncidentData(extractedData);

    res.json({
      success: true,
      valid: validation.valid,
      errors: validation.errors
    });

  } catch (error) {
    console.error('Validation Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/ai/health
 * Health check endpoint for AI Assistant service
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'AI Assistant',
    model: 'gpt-4o',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;