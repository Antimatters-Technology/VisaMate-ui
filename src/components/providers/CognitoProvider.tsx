'use client'

import { AuthProvider } from 'react-oidc-context';
import { cognitoConfig } from '@/lib/cognito';

interface CognitoProviderProps {
  children: React.ReactNode;
}

export function CognitoProvider({ children }: CognitoProviderProps) {
  return (
    <AuthProvider {...cognitoConfig}>
      {children}
    </AuthProvider>
  );
} 