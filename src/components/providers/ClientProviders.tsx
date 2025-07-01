'use client'

import { WSProvider } from '@/libs/ws'
import { Toaster } from '@/components/ui/toaster'
import { I18nProvider } from '@/libs/i18n'
import { AuthProvider, useAuth } from 'react-oidc-context'
import React from 'react'

interface ClientProvidersProps {
  children: React.ReactNode
}

const oidcConfig = {
  authority: process.env.NEXT_PUBLIC_COGNITO_AUTHORITY as string,
  client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string,
  redirect_uri: typeof window !== 'undefined' ? window.location.origin : undefined,
  response_type: 'code',
  scope: 'openid email phone profile',
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname)
  },
}

// Debug logging
console.log('OIDC Config:', oidcConfig)
console.log('Environment variables:', {
  authority: process.env.NEXT_PUBLIC_COGNITO_AUTHORITY,
  client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
})

// Test if authority URL is reachable
if (typeof window !== 'undefined' && oidcConfig.authority) {
  fetch(`${oidcConfig.authority}/.well-known/openid-configuration`)
    .then(response => {
      console.log('OIDC Discovery Response:', response.status, response.statusText)
      return response.json()
    })
    .then(data => console.log('OIDC Discovery Data:', data))
    .catch(error => console.error('OIDC Discovery Error:', error))
}

function AuthSync() {
  const auth = useAuth()
  React.useEffect(() => {
    if (auth.isAuthenticated) {
      if (auth.user?.access_token) {
        localStorage.setItem('auth-token', auth.user.access_token)
      }
    } else {
      localStorage.removeItem('auth-token')
    }
  }, [auth.isAuthenticated, auth.user])
  return null
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <AuthProvider {...oidcConfig}>
      <AuthSync />
      <I18nProvider>
        <WSProvider>
          {children}
          <Toaster />
        </WSProvider>
      </I18nProvider>
    </AuthProvider>
  )
} 