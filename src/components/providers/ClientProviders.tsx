'use client'

import { WSProvider } from '@/libs/ws'
import { Toaster } from '@/components/ui/toaster'
import { I18nProvider } from '@/libs/i18n'
import { CognitoProvider } from './CognitoProvider'

interface ClientProvidersProps {
  children: React.ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <CognitoProvider>
      <I18nProvider>
        <WSProvider>
          {children}
          <Toaster />
        </WSProvider>
      </I18nProvider>
    </CognitoProvider>
  )
} 