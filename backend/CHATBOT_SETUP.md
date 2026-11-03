# LangChain AI Chatbot - Setup & Architecture

## ✅ Current Configuration

### Backend (`/backend/src/controllers/chatController.ts`)
- **Model**: `gemini-3.5-flash-lite` (Google Generative AI)
- **Framework**: LangChain with TypeScript
- **MongoDB Integration**: Fetches live employee records from `HR` collection for RAG context
- **Error Handling**: Comprehensive logging and specific error messages
- **API Endpoint**: `POST /api/chat`

### Request/Response Format
```json
REQUEST:
{
  "message": "What employees do we have?",
  "history": [
    { "role": "user", "content": "Hi" },
    { "role": "assistant", "content": "Hello!" }
  ]
}

RESPONSE:
{
  "reply": "We have X employees in the database...",
  "success": true
}
```

### Frontend (`/frontend/src/components/ChatbotWidget.jsx`)
- **Widget Type**: Floating chat bubble (fixed position bottom-right)
- **Endpoint**: `http://localhost:5000/api/chat`
- **Error Display**: Shows specific backend error messages
- **Loading State**: Shows "LangChain processing..." indicator
- **Timeout**: Extended 60-second request timeout to prevent premature timeout errors

## 🔧 Key Fixes Applied

### 1. **LangChain Model Configuration**
   - ✅ Correctly set to `gemini-3.5-flash-lite`
   - ✅ Uses `model` parameter (not `modelName`)
   - ✅ Includes `apiKey` and `temperature` settings

### 2. **MongoDB RAG Integration**
   - ✅ Fetches employee records on each chat request
   - ✅ Injects employee data into system prompt
   - ✅ Falls back gracefully if database fetch fails

### 3. **Message Building**
   - ✅ `SystemMessage` for chatbot instructions + database context
   - ✅ `HumanMessage` for user queries
   - ✅ `AIMessage` for assistant responses
   - ✅ Maintains conversation history correctly

### 4. **Error Handling**
   - ✅ API quota errors (429) → Specific message
   - ✅ Auth errors (401) → Clear API key issue
   - ✅ Network errors → Backend connectivity guidance
   - ✅ Timeout errors → Performance guidance

### 5. **Frontend UX**
   - ✅ Displays backend error messages to user
   - ✅ Shows "LangChain processing..." during API calls
   - ✅ 30-second timeout to catch hanging requests
   - ✅ Disabled input while loading

## 📝 Environment Variables Required

```bash
# /backend/.env
GEMINI_API_KEY=your_google_gemini_api_key
MONGO_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
CLIENT_URL=*
```

## 🚀 How to Test

1. **Open the app**: `http://localhost:3000`
2. **Click the chat bubble** (bottom right)
3. **Try these queries**:
   - "Hi, how can you help?"
   - "What employees do we have?"
   - "How do I add a new employee?"
   - "Tell me about the IT department"

## 🐛 Debugging

Check backend logs for detailed execution:
```bash
npm run dev --prefix backend
# Look for: 🤖 Chat request received, 📦 Found X employees, 🚀 Initializing, etc.
```

Check frontend console (F12) for:
- Network tab: Verify POST `/api/chat` requests
- Console: Chat error messages with stack traces

## ⚙️ Architecture Flow

```
User Types Message in Chat Widget
    ↓
Frontend sends POST to http://localhost:5000/api/chat
    ↓
Backend chatController receives request
    ↓
Fetches employee records from MongoDB
    ↓
Builds LangChain message chain:
  - SystemMessage (instructions + employee data)
  - Historical conversation
  - Current user message
    ↓
Calls ChatGoogleGenerativeAI (gemini-3.5-flash-lite)
    ↓
Returns AI response
    ↓
Frontend displays reply in chat widget
```

## ✨ Features

✅ Real-time AI responses using Google Gemini  
✅ MongoDB employee data integration (RAG)  
✅ Conversation history tracking  
✅ Comprehensive error messages  
✅ Responsive floating widget UI  
✅ TypeScript type safety on backend  
✅ CORS + Security middleware  
✅ Rate limiting (100 requests/15 min)  

## 🔐 Security

- GEMINI_API_KEY stored in `.env` (never committed)
- CORS configured to allow frontend requests
- Express rate limiting enabled
- MongoDB sanitization enabled
- Helmet security headers enabled
