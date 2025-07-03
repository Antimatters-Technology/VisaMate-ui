import { useState, useCallback } from 'react'

interface RAGQueryRequest {
  query: string
  language?: string
  session_id?: string
}

interface RAGSource {
  id: number
  url: string
  title: string
  snippet: string
  relevance_score: number
}

interface RAGQueryResponse {
  answer: string
  sources: RAGSource[]
  language: string
  confidence_score: number
  processing_time_ms: number
}

interface PolicyVerificationRequest {
  documents: Array<{
    type: string
    data: Record<string, any>
  }>
  language?: string
  session_id?: string
}

interface PolicyVerificationResponse {
  results: Array<{
    field: string
    tick: boolean
    answer: string
    sources: RAGSource[]
    confidence: number
    language: string
  }>
  overall_status: string
  processing_time_ms: number
}

interface HealthResponse {
  status: string
  timestamp: string
  services: Record<string, string>
}

export function useRAG() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get the base URL for API calls
  const getBaseURL = () => {
    // Always use relative URLs for Next.js API routes
    return ''
  }

  const queryRAG = useCallback(async (request: RAGQueryRequest): Promise<RAGQueryResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${getBaseURL()}/api/v1/rag/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: request.query,
          language: request.language || 'en',
          session_id: request.session_id || `session_${Date.now()}`,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`RAG query failed: ${response.status} ${errorText}`)
      }

      const data: RAGQueryResponse = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const verifyPolicy = useCallback(async (request: PolicyVerificationRequest): Promise<PolicyVerificationResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${getBaseURL()}/api/v1/rag/policy/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documents: request.documents,
          language: request.language || 'en',
          session_id: request.session_id || `session_${Date.now()}`,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Policy verification failed: ${response.status} ${errorText}`)
      }

      const data: PolicyVerificationResponse = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const checkHealth = useCallback(async (): Promise<HealthResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${getBaseURL()}/api/v1/rag/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Health check failed: ${response.status} ${errorText}`)
      }

      const data: HealthResponse = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getSupportedLanguages = useCallback(async (): Promise<{ supported_languages: string[], default_language: string }> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${getBaseURL()}/api/v1/rag/supported-languages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to get supported languages: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getStats = useCallback(async (): Promise<any> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${getBaseURL()}/api/v1/rag/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to get stats: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    // Core functions
    queryRAG,
    verifyPolicy,
    checkHealth,
    getSupportedLanguages,
    getStats,
    
    // State
    isLoading,
    error,
    
    // Utilities
    clearError: () => setError(null),
  }
} 