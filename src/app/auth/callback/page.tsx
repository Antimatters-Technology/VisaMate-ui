'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cognitoAuth } from '@/services/cognito-auth';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Only run after hydration
    if (!searchParams) return;

    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError(errorParam);
      setStatus('error');
      return;
    }

    if (!code || !state) {
      setError('Missing authorization code or state');
      setStatus('error');
      return;
    }

    // Exchange code for tokens
    cognitoAuth.handleAuthCallback(code, state)
      .then(() => {
        setStatus('success');
        setTimeout(() => {
          router.push('/documents');
        }, 2000);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setStatus('error');
        setTimeout(() => {
          router.push('/');
        }, 3000);
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === 'processing' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <h2 className="mt-6 text-xl font-semibold text-gray-900">
                Completing sign in...
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Please wait while we process your authentication.
              </p>
            </>
          )}
          {status === 'success' && (
            <>
              <div className="mx-auto h-12 w-12 text-green-600">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-6 text-xl font-semibold text-gray-900">
                Sign in successful!
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Redirecting to your documents...
              </p>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="mx-auto h-12 w-12 text-red-600">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="mt-6 text-xl font-semibold text-gray-900">
                Authentication failed
              </h2>
              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>
              <button
                onClick={() => router.push('/')}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Return to Home
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 