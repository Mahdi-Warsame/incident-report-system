const express = require('express');
const auth = require('../middleware/auth');
const { analyzeIncident } = require('../services/aiAssistant');

const router = express.Router();

// POST /api/ai/analyze - Analyze incident with AI
router.post('/analyze', auth, async (req, res) => {
  try {
    const { userMessage, conversationHistory = [] } = req.body;

    if (!userMessage || userMessage.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const result = await analyzeIncident(userMessage, conversationHistory);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.json({
      success: true,
      message: result.message,
      extractedData: result.extractedData,
      usage: result.usage
    });
  } catch (error) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({ error: 'Failed to analyze incident' });
  }
});

module.exports = router;
