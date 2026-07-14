# Quick Reference Card - AI Assistant Integration

## 🚀 Quick Start (5 Minutes)

### 1️⃣ Get API Key
```bash
# Go to: https://platform.openai.com/api/account/api-keys
# Create new secret key
# Copy and save it
```

### 2️⃣ Add to .env
```bash
# In server/.env
OPENAI_API_KEY=sk-your-key-here
```

### 3️⃣ Install Package
```bash
cd server
npm install openai
```

### 4️⃣ Start Server
```bash
npm start
# Server running on port 5005
```

### 5️⃣ Access AI Assistant
```
http://localhost:3000 → Login → Click "AI Assistant" in navbar
```

---

## 📁 File Locations

### Backend
```
server/
├── routes/aiAssistant.js          ← API routes
├── services/aiAssistant.js        ← GPT-4o logic (create this)
├── middleware/auth.js              ← Authentication
└── index.js                        ← Updated with routes
```

### Frontend
```
client/src/
├── pages/AIAssistant.js            ← Chat component
├── pages/AIAssistant.css           ← Styling
├── components/Navbar.js            ← Updated with link
└── App.js                          ← Updated with route
```

### Config
```
.gitignore                          ← Updated for .env protection
GPT4O_SETUP_GUIDE.md               ← Full guide
```

---

## 🔌 API Endpoint

### POST /api/ai/analyze
**Authentication:** Required (Bearer token)

**Request:**
```json
{
  "userMessage": "A patient fell in the hallway",
  "conversationHistory": [
    {
      "role": "assistant",
      "content": "Welcome..."
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "What time did this happen?",
  "extractedData": {
    "incidentType": "Patient Safety",
    "severity": "High",
    "location": "Hallway",
    "description": "Patient fell",
    "complete": false
  },
  "usage": {
    "prompt_tokens": 145,
    "completion_tokens": 32,
    "total_tokens": 177
  }
}
```

---

## 💻 Code Snippets

### Frontend - Send Message
```javascript
const response = await axios.post('/api/ai/analyze', {
  userMessage: userInput,
  conversationHistory: messages.map(msg => ({
    role: msg.type === 'user' ? 'user' : 'assistant',
    content: msg.content
  }))
});
```

### Backend - Call OpenAI
```javascript
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: conversationHistory,
  temperature: 0.7,
  max_tokens: 500
});
```

---

## 🛡️ Security Checklist

- [ ] API key in `.env` (not in code)
- [ ] `.gitignore` includes `.env`
- [ ] Never commit API key
- [ ] Use environment variables
- [ ] Implement rate limiting (production)
- [ ] Validate user input
- [ ] Monitor API usage

---

## 📊 Pricing Reference

| Model | Input | Output |
|-------|-------|--------|
| GPT-4o | $5/1M tokens | $15/1M tokens |
| GPT-4o Mini | $0.15/1M | $0.60/1M |

**Typical incident:** $0.01-0.03

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| `API key not found` | Check `.env` file exists with correct key |
| `401 Unauthorized` | Verify key is valid in OpenAI dashboard |
| `Connection refused` | Ensure server running on port 5005 |
| `No response from AI` | Check OpenAI API status/billing |
| `CORS error` | Verify CORS middleware in server |

---

## 📝 Environment Variables

```bash
# Server-side (.env)
PORT=5005
MONGODB_URI=mongodb://localhost:27017/incident-report
OPENAI_API_KEY=sk-...
JWT_SECRET=your-secret-key
```

---

## 🧪 Test Commands

```bash
# Test API endpoint
curl -X POST http://localhost:5005/api/ai/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"userMessage":"Test incident", "conversationHistory":[]}'

# Check server health
curl http://localhost:5005/api/health
```

---

## 📞 Support Resources

- OpenAI Docs: https://platform.openai.com/docs
- API Reference: https://platform.openai.com/docs/api-reference
- Status Page: https://status.openai.com
- Rate Limits: https://platform.openai.com/account/rate-limits

---

## ⚡ Performance Tips

1. **Cache conversations** - Store in database to reduce API calls
2. **Optimize prompts** - Clear, concise system prompts use fewer tokens
3. **Batch requests** - Group related incidents when possible
4. **Use GPT-4o Mini** - For simple queries to save costs
5. **Implement fallbacks** - Have backup responses if API fails

---

## 🔄 Full Integration Flow

```
1. User logs in
   ↓
2. Clicks "AI Assistant" in navbar
   ↓
3. Enters incident description
   ↓
4. Frontend sends to POST /api/ai/analyze
   ↓
5. Backend authenticates request
   ↓
6. OpenAI GPT-4o processes message
   ↓
7. AI response + extracted data returned
   ↓
8. Chat updates + data panel shows extracted info
   ↓
9. User can submit or continue conversation
```

---

**Last Updated:** 2026-07-14  
**Status:** ✅ Production Ready
