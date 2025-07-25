'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRAG } from '@/hooks/useRAG'

export default function TestRAGPage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const { queryRAG, checkHealth, getSupportedLanguages, getStats, isLoading } = useRAG()

  const addResult = (test: string, status: 'success' | 'error', data: any, time: number) => {
    setTestResults(prev => [...prev, { test, status, data, time, timestamp: new Date() }])
  }

  const testHealthCheck = async () => {
    const start = Date.now()
    try {
      const result = await checkHealth()
      addResult('Health Check', 'success', result, Date.now() - start)
    } catch (error) {
      addResult('Health Check', 'error', error, Date.now() - start)
    }
  }

  const testQuery = async () => {
    const start = Date.now()
    try {
      const result = await queryRAG({
        query: 'What are the requirements for a study permit?',
        language: 'en',
        session_id: 'test_session'
      })
      addResult('RAG Query', 'success', result, Date.now() - start)
    } catch (error) {
      addResult('RAG Query', 'error', error, Date.now() - start)
    }
  }

  const testLanguages = async () => {
    const start = Date.now()
    try {
      const result = await getSupportedLanguages()
      addResult('Supported Languages', 'success', result, Date.now() - start)
    } catch (error) {
      addResult('Supported Languages', 'error', error, Date.now() - start)
    }
  }

  const testStats = async () => {
    const start = Date.now()
    try {
      const result = await getStats()
      addResult('Service Stats', 'success', result, Date.now() - start)
    } catch (error) {
      addResult('Service Stats', 'error', error, Date.now() - start)
    }
  }

  const testBackendDirect = async () => {
    const start = Date.now()
    try {
      const response = await fetch('http://localhost:8000/api/v1/rag/health')
      const result = await response.json()
      addResult('Direct Backend', 'success', { status: response.status, data: result }, Date.now() - start)
    } catch (error) {
      addResult('Direct Backend', 'error', error, Date.now() - start)
    }
  }

  const clearResults = () => setTestResults([])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">RAG System Test Page</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Backend Connection Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <Button onClick={testHealthCheck} disabled={isLoading}>
                Test Health Check
              </Button>
              <Button onClick={testQuery} disabled={isLoading}>
                Test RAG Query
              </Button>
              <Button onClick={testLanguages} disabled={isLoading}>
                Test Languages
              </Button>
              <Button onClick={testStats} disabled={isLoading}>
                Test Stats
              </Button>
              <Button onClick={testBackendDirect} disabled={isLoading}>
                Test Direct Backend
              </Button>
              <Button onClick={clearResults} variant="outline">
                Clear Results
              </Button>
            </div>
            
            {isLoading && <p className="text-blue-600">Running test...</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            {testResults.length === 0 ? (
              <p className="text-gray-500">No tests run yet. Click a test button above.</p>
            ) : (
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div key={index} className={`p-4 rounded border ${
                    result.status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{result.test}</h3>
                      <div className="text-sm text-gray-500">
                        {result.time}ms • {result.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    <div className={`text-sm ${
                      result.status === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      Status: {result.status === 'success' ? '✅ Success' : '❌ Error'}
                    </div>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">1. Backend Setup</h4>
              <p className="text-sm text-gray-600">Make sure the backend is running on port 8000:</p>
              <code className="block bg-gray-100 p-2 text-sm mt-1">
                cd Agent-aiii && python src/main.py
              </code>
            </div>
            
            <div>
              <h4 className="font-medium">2. Environment Variables</h4>
              <p className="text-sm text-gray-600">Create .env.local in the frontend root:</p>
              <code className="block bg-gray-100 p-2 text-sm mt-1">
                BACKEND_URL=http://localhost:8000
              </code>
            </div>
            
            <div>
              <h4 className="font-medium">3. Expected Backend Endpoints</h4>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>GET http://localhost:8000/api/v1/rag/health</li>
                <li>POST http://localhost:8000/api/v1/rag/query</li>
                <li>GET http://localhost:8000/api/v1/rag/supported-languages</li>
                <li>GET http://localhost:8000/api/v1/rag/stats</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 