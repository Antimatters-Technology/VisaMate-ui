import { AuthProviderProps } from 'react-oidc-context';

export const cognitoConfig: AuthProviderProps = {
  authority: `https://cognito-idp.${process.env.NEXT_PUBLIC_COGNITO_REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID}`,
  client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
  redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
  post_logout_redirect_uri: process.env.NEXT_PUBLIC_APP_URL,
  response_type: 'code',
  scope: 'openid email profile',
  automaticSilentRenew: true,
  loadUserInfo: true,
  monitorSession: false,
  includeIdTokenInSilentRenew: true,
};

export const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN; 