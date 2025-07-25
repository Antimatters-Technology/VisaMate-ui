'use client'

import { cognitoConfig, getAuthorizationUrl, getSignupUrl } from '@/config/cognito'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestCognitoPage() {
  const testCognitoDomain = async () => {
    try {
      const response = await fetch(cognitoConfig.cognitoDomain, {
        method: 'HEAD',
        mode: 'no-cors'
      })
      console.log('Cognito domain is accessible')
      alert('Cognito domain is accessible!')
    } catch (error) {
      console.error('Cognito domain error:', error)
      alert('Cognito domain is not accessible. Please check the URL.')
    }
  }

  const openAuthUrl = () => {
    window.open(getAuthorizationUrl(), '_blank')
  }

  const openSignupUrl = () => {
    window.open(getSignupUrl(), '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Cognito Configuration Test
          </h1>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Current Configuration</CardTitle>
                <CardDescription>
                  Your current Cognito settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>User Pool ID:</strong> {cognitoConfig.userPoolId}</p>
                <p><strong>Client ID:</strong> {cognitoConfig.clientId}</p>
                <p><strong>Region:</strong> {cognitoConfig.region}</p>
                <p><strong>Cognito Domain:</strong> {cognitoConfig.cognitoDomain}</p>
                <p><strong>Redirect URI:</strong> {cognitoConfig.redirectUri}</p>
                <p><strong>Scope:</strong> {cognitoConfig.scope}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Actions</CardTitle>
                <CardDescription>
                  Test your Cognito configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={testCognitoDomain}
                  className="w-full"
                  variant="outline"
                >
                  Test Cognito Domain
                </Button>
                <Button 
                  onClick={openAuthUrl}
                  className="w-full"
                  variant="default"
                >
                  Test Sign In URL
                </Button>
                <Button 
                  onClick={openSignupUrl}
                  className="w-full"
                  variant="outline"
                >
                  Test Sign Up URL
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-900">Important Notes</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-yellow-800">
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Cognito Domain:</strong> Make sure the domain URL is correct. 
                  It should be accessible and match what you configured in AWS Cognito.
                </li>
                <li>
                  <strong>Redirect URI:</strong> This must match exactly what you configured 
                  in your Cognito User Pool App Client settings.
                </li>
                <li>
                  <strong>Client ID:</strong> Verify this matches your Cognito App Client ID.
                </li>
                <li>
                  <strong>User Pool ID:</strong> Ensure this matches your Cognito User Pool ID.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">How to Update Configuration</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-800">
              <p className="mb-3">
                To update your Cognito configuration, edit the file:
              </p>
              <code className="bg-blue-100 px-2 py-1 rounded text-xs">
                src/config/cognito.ts
              </code>
              <p className="mt-3">
                Update the <code className="bg-blue-100 px-1 rounded">cognitoDomain</code> field 
                with your actual Cognito domain URL.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 