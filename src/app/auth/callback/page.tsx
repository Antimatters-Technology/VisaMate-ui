'use client'

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    // The react-oidc-context will automatically handle the callback
    // We just need to wait for it to complete and then redirect
    if (auth.isAuthenticated) {
      // Redirect to dashboard or wherever you want after successful login
      router.push('/wizard');
    } else if (auth.error) {
      console.error('Authentication error:', auth.error);
      // Redirect to login page with error
      router.push('/?error=auth_failed');
    }
  }, [auth.isAuthenticated, auth.error, router]);

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Completing sign in...</p>
        </div>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-4">{auth.error.message}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg">Processing authentication...</p>
      </div>
    </div>
  );
} 