'use client'

import { useAuth } from '@/hooks/useAuth';
import { AuthButton } from '@/components/auth/AuthButton';

export default function AuthStatusPage() {
  const auth = useAuth();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔐 Authentication Status</h1>
        
        <div className="space-y-6">
          {/* Current Status */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Current Status</h2>
            <div className="space-y-2">
              <p><strong>Loading:</strong> {auth.isLoading ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Authenticated:</strong> {auth.isAuthenticated ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Has Error:</strong> {auth.error ? '🚨 Yes' : '✅ No'}</p>
            </div>
          </div>

          {/* Error Details */}
          {auth.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-800 mb-4">Error Details</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {auth.error.name}</p>
                <p><strong>Message:</strong> {auth.error.message}</p>
                <p><strong>Stack:</strong></p>
                <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-40">
                  {auth.error.stack}
                </pre>
              </div>
            </div>
          )}

          {/* User Info */}
          {auth.isAuthenticated && auth.user && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">User Information</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> {auth.user.profile?.email}</p>
                <p><strong>Name:</strong> {auth.user.profile?.name}</p>
                <p><strong>Email Verified:</strong> {auth.user.profile?.email_verified?.toString()}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-gray-50 border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-y-3">
              {!auth.isAuthenticated ? (
                <>
                  <AuthButton variant="signin" className="w-full">
                    Sign In (Main App Method)
                  </AuthButton>
                  <AuthButton variant="signup" className="w-full">
                    Sign Up (Main App Method)
                  </AuthButton>
                </>
              ) : (
                <AuthButton variant="signout" className="w-full">
                  Sign Out
                </AuthButton>
              )}
              
              <button
                onClick={() => window.location.href = '/auth/debug'}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Go to Debug Page
              </button>
            </div>
          </div>

          {/* URL Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">URL Preview</h2>
            <div className="space-y-3 text-xs">
              <div>
                <h3 className="font-semibold text-sm">Sign In URL:</h3>
                <p className="bg-white p-2 border rounded break-all">
                  {`https://${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}&response_type=code&scope=openid%20email%20profile&redirect_uri=${encodeURIComponent('http://localhost:3000/auth/callback')}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 