import { NextRequest, NextResponse } from 'next/server'

/**
 * RAG Query API Proxy
 * 
 * Environment Setup:
 * - BACKEND_URL: Your backend service URL (default: http://localhost:8000)
 * - Add to .env.local: BACKEND_URL=http://localhost:8000
 * 
 * For production, update to your deployed backend URL.
 */
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.query || typeof body.query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      )
    }

    // Forward request to backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/v1/rag/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: body.query,
        language: body.language || 'en',
        session_id: body.session_id || `session_${Date.now()}`,
      }),
    })

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text()
      console.error('Backend RAG query failed:', errorText)
      
      return NextResponse.json(
        { 
          error: 'RAG service temporarily unavailable',
          details: errorText 
        },
        { status: backendResponse.status }
      )
    }

    const data = await backendResponse.json()
    
    // Return successful response
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })

  } catch (error) {
    console.error('RAG API proxy error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
} 