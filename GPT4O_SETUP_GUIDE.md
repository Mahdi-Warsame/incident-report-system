# GPT-4o AI Assistant Integration - Setup Guide

## 🎯 Overview
This guide walks you through the complete setup of the GPT-4o AI Assistant for your NHS Incident Report System.

---

## **Step 1: Get Your OpenAI API Key** ✅

### 1.1 Create OpenAI Account
1. Go to https://platform.openai.com/signup
2. Sign up with your email or login if you have an account
3. Complete email verification

### 1.2 Set Up Billing
1. Click **"Billing"** in the left sidebar
2. Go to **"Billing overview"**
3. Add a payment method (credit/debit card)
4. Set up a usage limit to avoid unexpected charges

### 1.3 Generate API Key
1. Go to **"API keys"** section (left sidebar → "API keys")
2. Click **"Create new secret key"**
3. Copy the key (you'll only see it once!)
4. Store it securely

⚠️ **IMPORTANT:** Never share this key or commit it to GitHub!

---

## **Step 2: Configure Environment Variables** ✅

### 2.1 Add API Key to .env
1. Open `server/.env` file in your project
2. Add this line:
```
OPENAI_API_KEY=sk-your-actual-key-here
```

### 2.2 Verify .gitignore
The `.gitignore` file has been updated to protect:
- ✅ `.env` files
- ✅ API keys (`.env.*.key`)
- ✅ Database files
- ✅ Temporary files

---

## **Step 3: Install OpenAI Package** ✅

Run in the `server` directory:
```bash
cd server
npm install openai
```

Wait for installation to complete. Check for any errors.

---

## **Step 4: Files Created** ✅

### Backend Files:
- **`server/services/aiAssistant.js`** - AI logic using GPT-4o
  - Handles conversation analysis
  - Extracts incident information
  - Returns structured JSON data

- **`server/routes/aiAssistant.js`** - API endpoint
  - POST `/api/ai/analyze` - Sends user message to AI

- **`server/index.js`** - Updated to register routes
  - Added: `const aiAssistantRoutes = require('./routes/aiAssistant');`
  - Added: `app.use('/api/ai', aiAssistantRoutes);`

### Frontend Files:
- **`client/src/pages/AIAssistant.js`** - React component
  - Chat interface for incident reporting
  - Real-time conversation with AI
  - Displays extracted incident data

- **`client/src/pages/AIAssistant.css`** - Styling
  - NHS blue color scheme
  - Responsive layout
  - Chat bubble styling

- **`client/src/App.js`** - Updated with new route
  - Added: `import AIAssistant from './pages/AIAssistant';`
  - Added: Route `/ai-assistant` protected by authentication

- **`client/src/components/Navbar.js`** - Updated with link
  - Added "AI Assistant" navigation link

---

## **Step 5: Test the Integration** 🧪

### 5.1 Start the Server
```bash
cd server
npm start
```
You should see: `Server running on port 5005`

### 5.2 Start the Client
In a new terminal:
```bash
cd client
npm start
```
The app opens at `http://localhost:3000`

### 5.3 Test AI Assistant
1. Login to the application
2. Click **"AI Assistant"** in the navbar
3. Describe an incident (e.g., "A patient fell in the hallway on ward 3 at 2pm today")
4. The AI will ask clarifying questions
5. Watch as it extracts incident information in the right panel

---

## **How It Works** 🤖

### Conversation Flow:
```
User Input
    ↓
API Call to /api/ai/analyze
    ↓
OpenAI GPT-4o Processing
    ↓
Extract Incident Data (JSON)
    ↓
Display in Chat & Side Panel
```

### AI System Prompt:
The AI is configured to:
- ✅ Ask clarifying follow-up questions
- ✅ Determine incident type
- ✅ Assess severity level
- ✅ Extract location, date, time
- ✅ Count affected individuals
- ✅ Understand actions already taken

### Extracted Data Fields:
```json
{
  "incidentType": "Patient Safety / Staff Safety / Equipment Failure, etc.",
  "severity": "Critical / High / Medium / Low",
  "location": "Ward location",
  "description": "Full incident description",
  "dateOfIncident": "YYYY-MM-DD",
  "timeOfIncident": "HH:MM",
  "affectedIndividuals": 1,
  "actionsTaken": "Actions taken by staff",
  "complete": true,
  "nextQuestion": "Clarifying question"
}
```

---

## **Pricing & Costs** 💰

### GPT-4o Pricing:
- **Input:** $5 per 1M tokens
- **Output:** $15 per 1M tokens

### Typical Incident Report:
- ~200-500 tokens per conversation
- **Estimated cost:** $0.01-0.03 per incident

### Cost Control:
1. Set usage limits in OpenAI dashboard
2. Monitor usage regularly
3. Consider GPT-4o Mini for lower costs (if needed)

---

## **Security Best Practices** 🔒

### ✅ Implemented:
1. API key in `.env` (not in code)
2. `.gitignore` protects sensitive files
3. Authentication required for AI endpoint
4. Only authenticated users can access AI Assistant

### 📋 Recommendations:
1. Rotate API keys periodically
2. Use environment-specific API keys
3. Monitor API usage and suspicious activity
4. Never share API keys in logs or error messages
5. Use rate limiting in production

---

## **Troubleshooting** 🔧

### Issue: "API key not found"
**Solution:** 
- Check `server/.env` file exists
- Verify key is correctly formatted: `OPENAI_API_KEY=sk-...`
- Restart server after adding key

### Issue: "Error: 401 Unauthorized"
**Solution:**
- Verify API key is valid
- Check billing setup in OpenAI dashboard
- Ensure key hasn't expired

### Issue: "Connection refused"
**Solution:**
- Ensure server is running on port 5005
- Check firewall settings
- Verify API endpoint: `/api/ai/analyze`

### Issue: "Empty responses from AI"
**Solution:**
- Check OpenAI API status: https://status.openai.com
- Verify rate limits aren't exceeded
- Check server logs for errors

---

## **Next Steps** 📝

### Future Enhancements:
1. **Save conversations** - Store chat history in database
2. **User preferences** - Remember incident type preferences
3. **Multi-language support** - Support different languages
4. **Integration with forms** - Auto-populate incident forms
5. **Analytics** - Track AI accuracy and common incident types
6. **Offline mode** - Work without internet connection

---

## **Support & Resources** 📚

- **OpenAI Documentation:** https://platform.openai.com/docs
- **GPT-4o Details:** https://openai.com/gpt-4
- **API Reference:** https://platform.openai.com/docs/api-reference
- **Rate Limits:** https://platform.openai.com/account/rate-limits

---

## **Summary Checklist** ✅

- [ ] OpenAI account created
- [ ] API key generated and stored safely
- [ ] `OPENAI_API_KEY` added to `server/.env`
- [ ] `npm install openai` completed in server folder
- [ ] Backend files created (aiAssistant.js, routes)
- [ ] Frontend files created (AIAssistant.js, AIAssistant.css)
- [ ] Navigation updated with AI Assistant link
- [ ] Server running on port 5005
- [ ] Client running on port 3000
- [ ] AI Assistant accessible from navbar
- [ ] Test conversation successful

---

**Status:** ✅ Ready to Use!

Your NHS Incident Report System now has AI-powered assistance. Users can describe incidents naturally, and the AI will help structure the information for accurate reporting.
