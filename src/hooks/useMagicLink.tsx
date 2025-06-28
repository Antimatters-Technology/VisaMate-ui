'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, apiHelpers } from '@/libs/api'
import { useUser } from '@/stores/user'

interface MagicLinkResult {
  success: boolean
  error?: string
  user?: any
}

export function useMagicLink() {
  const [isLoading, setIsLoading] = useState(false)
  const { setUser } = useUser()
  const router = useRouter()

  const verifyMagicLink = async (token: string): Promise<MagicLinkResult> => {
    setIsLoading(true)
    
    try {
      const response = await api.post('/auth/magic-link/verify', { token })
      const { user, accessToken } = response.data

      // Store the token
      apiHelpers.setAuthToken(accessToken)
      
      // Update user state
      setUser(user)

      return { success: true, user }
    } catch (error: any) {
      console.error('Magic link verification failed:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Invalid or expired link'
      }
    } finally {
      setIsLoading(false)
    }
  }

  const sendMagicLink = async (email: string): Promise<MagicLinkResult> => {
    setIsLoading(true)
    
    try {
      await api.post('/auth/magic-link/send', { email })
      return { success: true }
    } catch (error: any) {
      console.error('Failed to send magic link:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send magic link'
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    verifyMagicLink,
    sendMagicLink,
    isLoading
  }
}

interface MagicLinkHandlerProps {
  token: string
}

export function MagicLinkHandler({ token }: MagicLinkHandlerProps) {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [error, setError] = useState<string>('')
  const { verifyMagicLink } = useMagicLink()
  const router = useRouter()

  useEffect(() => {
    const handleVerification = async () => {
      const result = await verifyMagicLink(token)
      
      if (result.success) {
        setStatus('success')
        // Redirect to appropriate dashboard based on user role
        setTimeout(() => {
          const userRole = result.user?.role || 'student'
          if (userRole === 'consultant') {
            router.push('/cases')
          } else {
            router.push('/wizard')
          }
        }, 2000)
      } else {
        setStatus('error')
        setError(result.error || 'Verification failed')
      }
    }

    if (token) {
      handleVerification()
    }
  }, [token, verifyMagicLink, router])

  if (status === 'verifying') {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Verifying your magic link...</p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="text-center text-green-600">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-medium">Login successful!</p>
        <p className="text-sm text-gray-600 mt-2">Redirecting to your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="text-center text-red-600">
      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <p className="font-medium">Verification failed</p>
      <p className="text-sm text-gray-600 mt-2">{error}</p>
    </div>
  )
} 