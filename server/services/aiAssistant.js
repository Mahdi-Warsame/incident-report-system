const { OpenAI } = require('openai');

let openai = null;

// Initialize OpenAI client lazily
function getOpenAIClient() {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set. Please add it to your .env file.');
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

const systemPrompt = `You are a SentriCare Safety Management Assistant specializing in healthcare incident documentation. Your role is to help healthcare staff accurately report incidents through natural conversation.

Your responsibilities:
1. Ask clarifying questions to understand the incident fully
2. Extract structured information about:
   - Incident type (Patient Safety, Staff Safety, Equipment Failure, Infection Control, Medication Error, Communication Failure, Other)
   - Severity level (Critical, High, Medium, Low)
   - Location/Ward
   - Date and time of incident
   - Number of affected individuals
   - Description of what happened
   - Actions already taken
   - Immediate risks or follow-up needed

3. Guide the user through a natural conversation to gather all necessary details
4. Confirm understanding and identify any missing information
5. At the end, summarize the incident clearly

Always maintain a professional, empathetic tone. Ask follow-up questions based on responses. When you have sufficient information, indicate the report is complete and ready for submission.

When extracting data, provide it in a structured JSON format at the end of your response using this exact format:
<extracted_data>
{
  "incidentType": "string",
  "severity": "Critical|High|Medium|Low",
  "location": "string",
  "dateOfIncident": "YYYY-MM-DD",
  "timeOfIncident": "HH:MM",
  "description": "string",
  "affectedIndividuals": number,
  "actionsTaken": "string",
  "immediateRisks": "string",
  "complete": boolean
}
</extracted_data>`;

/**
 * Analyzes incident description and extracts structured data using GPT-4o
 * @param {string} userMessage - The user's message about the incident
 * @param {array} conversationHistory - Previous messages in the conversation
 * @returns {Promise<Object>} - Response with AI message and extracted data
 */
async function analyzeIncident(userMessage, conversationHistory = []) {
  try {
    const client = getOpenAIClient();

    // Build messages array
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage
      }
    ];

    // Call OpenAI API
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      temperature: 0.7,
      max_tokens: 800,
    });

    const assistantMessage = response.choices[0].message.content;

    // Extract structured data from response
    const extractedData = extractStructuredData(assistantMessage);

    return {
      success: true,
      message: assistantMessage,
      extractedData: extractedData,
      usage: {
        prompt_tokens: response.usage.prompt_tokens,
        completion_tokens: response.usage.completion_tokens,
        total_tokens: response.usage.total_tokens,
      }
    };
  } catch (error) {
    console.error('Error analyzing incident:', error);
    
    // Handle specific OpenAI errors
    if (error.status === 401) {
      return {
        success: false,
        error: 'Authentication failed. Please check your OpenAI API key.',
        message: 'Sorry, there was an authentication error. Please contact support.'
      };
    }
    
    if (error.status === 429) {
      return {
        success: false,
        error: 'Rate limit exceeded.',
        message: 'The service is currently busy. Please try again in a moment.'
      };
    }

    return {
      success: false,
      error: error.message,
      message: 'Sorry, I encountered an error processing your message. Please try again.'
    };
  }
}

/**
 * Extracts structured JSON data from the AI response
 * @param {string} responseText - The AI response text
 * @returns {Object|null} - Extracted data object or null if not found
 */
function extractStructuredData(responseText) {
  try {
    // Look for JSON data between <extracted_data> tags
    const jsonMatch = responseText.match(/<extracted_data>([\s\S]*?)<\/extracted_data>/);
    
    if (!jsonMatch || !jsonMatch[1]) {
      return null;
    }

    const jsonStr = jsonMatch[1].trim();
    const extractedData = JSON.parse(jsonStr);

    // Validate extracted data has expected fields
    const requiredFields = ['incidentType', 'severity', 'location', 'description'];
    const hasRequiredFields = requiredFields.every(field => field in extractedData);

    if (!hasRequiredFields) {
      console.warn('Extracted data missing required fields');
      return null;
    }

    return extractedData;
  } catch (error) {
    console.warn('Error extracting structured data:', error.message);
    return null;
  }
}

/**
 * Generates a summary of the incident for review
 * @param {Object} extractedData - The extracted incident data
 * @returns {string} - Formatted summary
 */
function generateSummary(extractedData) {
  if (!extractedData) return '';

  const summary = `
INCIDENT SUMMARY
================
Type: ${extractedData.incidentType}
Severity: ${extractedData.severity}
Location: ${extractedData.location}
Date: ${extractedData.dateOfIncident} at ${extractedData.timeOfIncident}
Affected Individuals: ${extractedData.affectedIndividuals || 'N/A'}

Description:
${extractedData.description}

Actions Taken:
${extractedData.actionsTaken || 'None documented'}

Immediate Risks:
${extractedData.immediateRisks || 'None identified'}

Status: ${extractedData.complete ? 'COMPLETE - Ready for submission' : 'IN PROGRESS - Additional information needed'}
  `;

  return summary.trim();
}

/**
 * Validates extracted incident data
 * @param {Object} extractedData - The incident data to validate
 * @returns {Object} - Validation result with errors array
 */
function validateIncidentData(extractedData) {
  const errors = [];

  if (!extractedData.incidentType) {
    errors.push('Incident type is required');
  }

  if (!extractedData.severity) {
    errors.push('Severity level is required');
  }

  if (!extractedData.location) {
    errors.push('Location is required');
  }

  if (!extractedData.description || extractedData.description.length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  if (!extractedData.dateOfIncident) {
    errors.push('Date of incident is required');
  }

  // Validate date format
  if (extractedData.dateOfIncident && !isValidDate(extractedData.dateOfIncident)) {
    errors.push('Invalid date format. Use YYYY-MM-DD');
  }

  // Validate time format
  if (extractedData.timeOfIncident && !isValidTime(extractedData.timeOfIncident)) {
    errors.push('Invalid time format. Use HH:MM');
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates date format (YYYY-MM-DD)
 * @param {string} dateString - Date to validate
 * @returns {boolean}
 */
function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

/**
 * Validates time format (HH:MM)
 * @param {string} timeString - Time to validate
 * @returns {boolean}
 */
function isValidTime(timeString) {
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(timeString);
}

module.exports = {
  analyzeIncident,
  extractStructuredData,
  generateSummary,
  validateIncidentData,
  isValidDate,
  isValidTime
};
