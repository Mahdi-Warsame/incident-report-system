const { OpenAI } = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const systemPrompt = `You are an expert NHS incident reporting assistant. Your role is to help healthcare staff report incidents accurately and completely.

When a user describes an incident, you should:
1. Ask clarifying follow-up questions to gather missing information
2. Help determine the incident type (Patient Safety, Staff Safety, Equipment Failure, Medication Error, Fall, Infection Control, Communication Issue, Other)
3. Help assess severity (Critical, High, Medium, Low)
4. Extract location, date, time, and number of affected individuals
5. Understand actions already taken

Format your responses clearly. After gathering sufficient information, provide a JSON summary at the end in this format:
\`\`\`json
{
  "incidentType": "type here",
  "severity": "severity here",
  "location": "location here",
  "description": "full description here",
  "dateOfIncident": "YYYY-MM-DD",
  "timeOfIncident": "HH:MM",
  "affectedIndividuals": number,
  "actionsTaken": "actions here",
  "complete": true/false,
  "nextQuestion": "question to ask user"
}
\`\`\`

Be empathetic, professional, and thorough. Ask one or two questions at a time to avoid overwhelming the user.`;

async function analyzeIncident(userMessage, conversationHistory = []) {
  try {
    // Build conversation with history
    const messages = [
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage
      }
    ];

    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const assistantMessage = response.choices[0].message.content;

    // Try to extract JSON from response
    let extractedData = null;
    const jsonMatch = assistantMessage.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      try {
        extractedData = JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.log('Could not parse JSON from response');
      }
    }

    return {
      success: true,
      message: assistantMessage,
      extractedData: extractedData,
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens
      }
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Sorry, I encountered an error. Please try again.'
    };
  }
}

module.exports = {
  analyzeIncident
};
