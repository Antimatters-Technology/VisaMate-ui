'use client'

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

interface AuthButtonProps {
  variant?: 'signin' | 'signup' | 'signout';
  className?: string;
  children?: React.ReactNode;
}

export function AuthButton({ variant = 'signin', className, children }: AuthButtonProps) {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <Button disabled className={className}>
        Loading...
      </Button>
    );
  }

  if (auth.isAuthenticated && variant !== 'signout') {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <span className="text-sm text-gray-600">
          Welcome, {auth.user?.profile?.email}
        </span>
        <Button onClick={auth.signOut} variant="outline">
          Sign Out
        </Button>
      </div>
    );
  }

  if (variant === 'signin') {
    return (
      <Button onClick={auth.signInWithCognito} className={className}>
        {children || 'Sign In'}
      </Button>
    );
  }

  if (variant === 'signup') {
    return (
      <Button onClick={auth.signUpWithCognito} variant="outline" className={className}>
        {children || 'Sign Up'}
      </Button>
    );
  }

  if (variant === 'signout' && auth.isAuthenticated) {
    return (
      <Button onClick={auth.signOut} variant="outline" className={className}>
        {children || 'Sign Out'}
      </Button>
    );
  }

  return null;
} 