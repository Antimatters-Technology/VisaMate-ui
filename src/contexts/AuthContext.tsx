'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { cognitoAuth, CognitoUser } from '@/services/cognito-auth';

interface AuthContextType {
  user: CognitoUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: () => void;
  signUp: () => void;
  signOut: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<CognitoUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing authentication on mount
    const currentUser = cognitoAuth.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);

    // Listen for auth state changes
    const handleAuthStateChange = (event: CustomEvent) => {
      setUser(event.detail);
      setError(null);
    };

    window.addEventListener('auth-state-changed', handleAuthStateChange as EventListener);

    return () => {
      window.removeEventListener('auth-state-changed', handleAuthStateChange as EventListener);
    };
  }, []);

  const signIn = () => {
    try {
      setError(null);
      cognitoAuth.signIn();
      // The page will redirect to Cognito, so we don't need to handle the response here
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      console.error('Sign in error:', err);
    }
  };

  const signUp = () => {
    try {
      setError(null);
      cognitoAuth.signUp();
      // The page will redirect to Cognito, so we don't need to handle the response here
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
      console.error('Sign up error:', err);
    }
  };

  const signOut = () => {
    setUser(null);
    setError(null);
    cognitoAuth.signOut();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 