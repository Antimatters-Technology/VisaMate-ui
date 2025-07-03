export const cognitoConfig = {
  userPoolId: 'us-east-1_j8D782UOP',
  clientId: 'uues8crvkh3ro7jsk8sul5ph6',
  region: 'us-east-1',
  
  // IMPORTANT: You need to update this with your actual Cognito domain
  // You can find this in your AWS Cognito User Pool settings
  // It should look like: https://your-domain.auth.us-east-1.amazoncognito.com
  // or: https://visamate-users.auth.us-east-1.amazoncognito.com
  cognitoDomain: 'https://us-east-1j8d782uop.auth.us-east-1.amazoncognito.com',
  
  // Redirect URI - this should match what you configured in Cognito
  redirectUri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  
  // Scopes to request
  scope: 'email openid profile',
};

// Helper function to get the full Cognito domain URL
export function getCognitoDomainUrl(): string {
  return cognitoConfig.cognitoDomain;
}

// Helper function to get the authorization URL
export function getAuthorizationUrl(): string {
  const url = new URL(`${cognitoConfig.cognitoDomain}/oauth2/authorize`);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', cognitoConfig.clientId);
  url.searchParams.set('redirect_uri', `${cognitoConfig.redirectUri}/auth/callback`);
  url.searchParams.set('scope', cognitoConfig.scope);
  return url.toString();
}

// Helper function to get the signup URL
export function getSignupUrl(): string {
  const url = new URL(`${cognitoConfig.cognitoDomain}/signup`);
  url.searchParams.set('client_id', cognitoConfig.clientId);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', cognitoConfig.scope);
  url.searchParams.set('redirect_uri', `${cognitoConfig.redirectUri}/auth/callback`);
  return url.toString();
} 