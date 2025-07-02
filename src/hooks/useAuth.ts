'use client'

import { useAuth as useOIDCAuth } from 'react-oidc-context';
import { cognitoDomain } from '@/lib/cognito';

export function useAuth() {
  const auth = useOIDCAuth();

  const signInWithCognito = () => {
    auth.signinRedirect();
  };

  const signUpWithCognito = () => {
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`);
    window.location.href = `https://${cognitoDomain}/signup?client_id=${clientId}&response_type=code&scope=openid%20email%20profile&redirect_uri=${redirectUri}`;
  };

  const signOut = () => {
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
    const logoutUri = encodeURIComponent(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    window.location.href = `https://${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${logoutUri}`;
  };

  return {
    ...auth,
    signInWithCognito,
    signUpWithCognito,
    signOut,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    user: auth.user,
    error: auth.error,
  };
} 