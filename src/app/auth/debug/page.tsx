'use client'

import { useState } from 'react';

export default function CognitoDebugPage() {
  const [manualTestResult, setManualTestResult] = useState<string>('');

  const testManualAuth = () => {
    const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
    const region = process.env.NEXT_PUBLIC_COGNITO_REGION;
    const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
    const redirectUri = encodeURIComponent('http://localhost:3000/auth/callback');

    // Test with minimal parameters first
    const authUrl = `https://${domain}/oauth2/authorize?client_id=${clientId}&response_type=code&scope=openid&redirect_uri=${redirectUri}`;
    
    setManualTestResult(`Testing with URL: ${authUrl}`);
    window.open(authUrl, '_blank');
  };

  const testSignUpUrl = () => {
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
    const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
    const redirectUri = encodeURIComponent('http://localhost:3000/auth/callback');

    const signUpUrl = `https://${domain}/signup?client_id=${clientId}&response_type=code&scope=openid&redirect_uri=${redirectUri}`;
    
    setManualTestResult(`Testing sign up with URL: ${signUpUrl}`);
    window.open(signUpUrl, '_blank');
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Cognito Debug Page</h1>
        
        <div className="space-y-6">
          {/* Configuration Display */}
          <div className="bg-gray-50 border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Current Configuration</h2>
            <div className="space-y-2 text-sm font-mono">
              <p><strong>User Pool ID:</strong> {process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID}</p>
              <p><strong>Client ID:</strong> {process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}</p>
              <p><strong>Region:</strong> {process.env.NEXT_PUBLIC_COGNITO_REGION}</p>
              <p><strong>Domain:</strong> {process.env.NEXT_PUBLIC_COGNITO_DOMAIN}</p>
              <p><strong>App URL:</strong> {process.env.NEXT_PUBLIC_APP_URL}</p>
            </div>
          </div>

          {/* Manual URL Tests */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Manual URL Tests</h2>
            <p className="text-sm text-gray-600 mb-4">
              These will open in a new tab to test the URLs directly:
            </p>
            <div className="space-y-3">
              <button
                onClick={testManualAuth}
                className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Test Manual Sign In (Minimal Scope)
              </button>
              <button
                onClick={testSignUpUrl}
                className="block w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Test Manual Sign Up (Minimal Scope)
              </button>
            </div>
            {manualTestResult && (
              <div className="mt-4 p-3 bg-white border rounded text-sm">
                {manualTestResult}
              </div>
            )}
          </div>

          {/* Required Cognito Settings */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">📋 Required Cognito App Client Settings</h2>
            <div className="space-y-3 text-sm">
              <div>
                <h3 className="font-semibold">OAuth flows (must be enabled):</h3>
                <ul className="list-disc list-inside ml-4">
                  <li>✅ Authorization code grant</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold">OAuth scopes (must be enabled):</h3>
                <ul className="list-disc list-inside ml-4">
                  <li>✅ openid</li>
                  <li>✅ email</li>
                  <li>✅ profile</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold">Callback URLs (must include exactly):</h3>
                <ul className="list-disc list-inside ml-4">
                  <li><code>http://localhost:3000/auth/callback</code></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold">Sign-out URLs (must include):</h3>
                <ul className="list-disc list-inside ml-4">
                  <li><code>http://localhost:3000</code></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold">App client settings:</h3>
                <ul className="list-disc list-inside ml-4">
                  <li>❌ Generate client secret: <strong>MUST BE DISABLED</strong></li>
                  <li>✅ Enable SRP: Can be enabled</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Exact URLs */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">🔗 Exact URLs Being Generated</h2>
            <div className="space-y-3 text-xs font-mono break-all">
              <div>
                <h3 className="font-semibold text-sm">Sign In URL:</h3>
                <p className="bg-white p-2 border rounded">
                  {`https://${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}&response_type=code&scope=openid%20email%20profile&redirect_uri=${encodeURIComponent('http://localhost:3000/auth/callback')}`}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Sign Up URL:</h3>
                <p className="bg-white p-2 border rounded">
                  {`https://${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/signup?client_id=${process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}&response_type=code&scope=openid%20email%20profile&redirect_uri=${encodeURIComponent('http://localhost:3000/auth/callback')}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 