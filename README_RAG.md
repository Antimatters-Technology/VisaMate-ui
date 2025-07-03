# 🤖 RAG Chatbot Integration

## Overview

The VisaMate RAG (Retrieval-Augmented Generation) chatbot provides real-time Canadian immigration assistance powered by official IRCC sources. The chatbot appears as a floating widget in the bottom-right corner of the documents page.

## Features

- **Real-time Immigration Support**: Get instant answers to Canadian immigration questions
- **Official Source Citations**: All responses include links to official IRCC documentation
- **Confidence Scoring**: Each response shows confidence levels (High/Medium/Low)
- **Multilingual Support**: Supports English, Punjabi, Gujarati, and Hindi
- **Processing Time Display**: Shows response times for transparency
- **Connection Status**: Real-time backend connection monitoring
- **Error Handling**: Graceful fallbacks when backend is unavailable

## Setup

### 1. Environment Configuration

Create a `.env.local` file in the frontend root:

```bash
# Backend RAG Service URL
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000

# For production deployment
# BACKEND_URL=https://your-backend-domain.com
# NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

### 2. Backend Requirements

Ensure your backend has these RAG endpoints running:

- `POST /api/v1/rag/query` - Main chat query endpoint
- `GET /api/v1/rag/health` - Health check endpoint
- `GET /api/v1/rag/supported-languages` - Language support
- `GET /api/v1/rag/stats` - Service statistics

### 3. Start Services

```bash
# Start backend (in Agent-aiii directory)
python src/main.py

# Start frontend (in VisaMate-uiii directory)
npm run dev
```

## Usage

### Accessing the Chatbot

1. Navigate to `/documents` page
2. Look for the blue chat button in the bottom-right corner
3. Click to open the chat interface
4. Start asking immigration questions!

### Example Questions

- "How much money do I need for a study permit?"
- "What documents are required for a visitor visa?"
- "What are the language requirements for citizenship?"
- "How long does it take to process a work permit?"

### Response Format

Each chatbot response includes:

- **Answer**: AI-generated response based on official sources
- **Sources**: Up to 3 official IRCC document citations
- **Confidence Score**: High (80%+), Medium (60-80%), Low (<60%)
- **Processing Time**: Response generation time in milliseconds
- **Relevance Scores**: How relevant each source is to your question

## API Integration

### Frontend Components

- `RAGChatBot.tsx`: Main chat interface component
- `useRAG.ts`: Custom hook for backend communication
- API routes in `app/api/v1/rag/`: Next.js proxy endpoints

### Backend Endpoints

```typescript
// Query RAG system
POST /api/v1/rag/query
{
  "query": "What are study permit requirements?",
  "language": "en",
  "session_id": "chat_123456"
}

// Response
{
  "answer": "To apply for a study permit...",
  "sources": [...],
  "confidence_score": 0.95,
  "processing_time_ms": 1250
}
```

## Connection Status

The chatbot displays real-time connection status:

- 🟢 **Online**: Connected to RAG backend
- 🟡 **Connecting...**: Checking connection (animated)
- 🔴 **Offline**: Backend unavailable or error

## Error Handling

### Common Issues

1. **Backend Not Running**
   - Status: Offline
   - Solution: Start the backend service

2. **Wrong Backend URL**
   - Status: Offline
   - Solution: Check `BACKEND_URL` in `.env.local`

3. **CORS Issues**
   - Status: Connection errors
   - Solution: API routes handle CORS automatically

4. **Slow Responses**
   - Typical response time: 1-3 seconds
   - If >10 seconds, check backend logs

### Debugging

Enable debug mode by adding to console:

```javascript
localStorage.setItem('rag-debug', 'true')
```

This will log all API requests and responses.

## Performance

### Response Times
- **Target**: < 2 seconds
- **Typical**: 1-3 seconds
- **Maximum**: 10 seconds (with timeout)

### Rate Limiting
- No rate limiting implemented currently
- Consider adding for production deployment

## Production Deployment

### Environment Variables

```bash
# Production backend URL
BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Optional: API keys for enhanced security
RAG_API_KEY=your_secret_key
```

### Security Considerations

1. **API Key Authentication**: Add authentication to backend
2. **Rate Limiting**: Implement user-based rate limits
3. **Input Validation**: Backend validates all queries
4. **HTTPS**: Always use HTTPS in production

## Customization

### Styling

The chatbot uses Tailwind CSS classes and can be customized:

```typescript
// Change chatbot position
<RAGChatBot className="bottom-4 left-4" /> // Move to bottom-left

// Modify colors in RAGChatBot.tsx
className="bg-blue-600" // Change button color
```

### Welcome Message

Edit the initial bot message in `RAGChatBot.tsx`:

```typescript
const [messages, setMessages] = useState<ChatMessage[]>([
  {
    id: '1',
    type: 'bot',
    content: 'Your custom welcome message here!',
    timestamp: new Date(),
  }
])
```

### Supported Languages

The system supports:
- English (en)
- Punjabi (pa) 
- Gujarati (gu)
- Hindi (hi)

Language is auto-detected from user queries.

## Architecture

```
Frontend (Next.js)
    ↓
RAGChatBot Component
    ↓
useRAG Hook
    ↓
Next.js API Routes (/api/v1/rag/*)
    ↓
Backend RAG Service (Python/FastAPI)
    ↓
Pinecone Vector Database + Gemini LLM
```

## Troubleshooting

### Issue: Chatbot won't open
- **Solution**: Check browser console for JavaScript errors

### Issue: "Offline" status always
- **Solution**: Verify backend is running on correct port
- **Check**: `curl http://localhost:8000/api/v1/rag/health`

### Issue: Slow responses
- **Solution**: Check backend logs for performance issues
- **Check**: Network tab in browser dev tools

### Issue: No sources in responses
- **Solution**: Verify Pinecone vector database is populated
- **Check**: Backend logs for retrieval errors

## Support

For technical support:
1. Check browser console for errors
2. Check backend logs
3. Verify environment variables
4. Test backend endpoints directly
5. Contact development team with error logs

## Future Enhancements

- [ ] Voice input/output support
- [ ] Document upload for context
- [ ] Conversation memory across sessions
- [ ] Analytics and usage tracking
- [ ] Custom query templates
- [ ] Integration with appointment booking 