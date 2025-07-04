'use client'

import { WSProvider } from '@/libs/ws'
import { Toaster } from '@/components/ui/toaster'
import { I18nProvider } from '@/libs/i18n'
import { AuthProvider } from '@/contexts/AuthContext'

interface ClientProvidersProps {
  children: React.ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <I18nProvider>
      <AuthProvider>
      <WSProvider>
        {children}
        <Toaster />
      </WSProvider>
      </AuthProvider>
    </I18nProvider>
  )
} 