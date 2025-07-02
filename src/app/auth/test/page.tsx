'use client'

import { useAuth } from '@/hooks/useAuth';
import { AuthButton } from '@/components/auth/AuthButton';

export default function AuthTestPage() {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-4">{auth.error.message}</p>
          <AuthButton variant="signin">Try Sign In Again</AuthButton>
        </div>
      </div>
    );
  }

  if (auth.isAuthenticated) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">🎉 Authentication Successful!</h1>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-green-800 mb-4">User Information</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> {auth.user?.profile?.email}</p>
              <p><strong>Name:</strong> {auth.user?.profile?.name}</p>
              <p><strong>Phone:</strong> {auth.user?.profile?.phone_number}</p>
              <p><strong>Email Verified:</strong> {auth.user?.profile?.email_verified?.toString()}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Tokens (First 50 chars)</h2>
            <div className="space-y-2 text-sm font-mono break-all">
              <p><strong>Access Token:</strong> {auth.user?.access_token?.substring(0, 50)}...</p>
              <p><strong>ID Token:</strong> {auth.user?.id_token?.substring(0, 50)}...</p>
              <p><strong>Refresh Token:</strong> {auth.user?.refresh_token?.substring(0, 50)}...</p>
            </div>
          </div>

          <div className="flex gap-4">
            <AuthButton variant="signout">Sign Out</AuthButton>
            <button 
              onClick={() => window.location.href = '/wizard'}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Go to Wizard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-8">Cognito Authentication Test</h1>
        <p className="text-gray-600 mb-8">
          Test your AWS Cognito integration by signing in or creating an account.
        </p>
        
        <div className="space-y-4">
          <AuthButton variant="signin" className="w-full">
            Sign In with Cognito
          </AuthButton>
          <AuthButton variant="signup" className="w-full">
            Sign Up with Cognito
          </AuthButton>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-left">
          <h3 className="font-semibold mb-2">Configuration Check:</h3>
          <ul className="space-y-1 text-xs">
            <li>✅ User Pool ID: {process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID}</li>
            <li>✅ Client ID: {process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}</li>
            <li>✅ Region: {process.env.NEXT_PUBLIC_COGNITO_REGION}</li>
            <li>✅ Domain: {process.env.NEXT_PUBLIC_COGNITO_DOMAIN}</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 