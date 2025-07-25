# 🤖 RAG Chatbot Integration

## Overview
The VisaMate RAG chatbot provides real-time Canadian immigration assistance powered by official IRCC sources.

## Quick Setup
1. Create `.env.local`: `BACKEND_URL=http://localhost:8000`
2. Start backend: `python src/main.py` (in Agent-aiii/)
3. Start frontend: `npm run dev` (in VisaMate-uiii/)
4. Visit `/documents` page and click the blue chat button

## Features
- Real-time immigration answers with official citations
- Confidence scoring and processing time display  
- Connection status monitoring
- Multilingual support (EN, PA, GU, HI)

## Usage
Ask questions like:
- "How much money do I need for a study permit?"
- "What documents are required for citizenship?"

Backend endpoints:
- `POST /api/v1/rag/query` - Main chat
- `GET /api/v1/rag/health` - Status check

## Troubleshooting
- **Offline status**: Check if backend is running
- **Slow responses**: Check backend logs
- **CORS issues**: API routes handle automatically
