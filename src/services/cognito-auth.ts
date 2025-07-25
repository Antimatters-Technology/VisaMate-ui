export interface CognitoUser {
  email: string;
  sub: string;
  accessToken: string;
  idToken: string;
  refreshToken: string;
  tokenExpiry: number;
}

import { cognitoConfig } from '@/config/cognito';

export class CognitoAuthService {
  
  constructor() {
    // Initialize the service
  }

  public async signIn(): Promise<void> {
    const state = this.generateRandomString(32);
    const codeVerifier = this.generateRandomString(128);
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    
    // Store for later verification
    sessionStorage.setItem('auth_state', state);
    sessionStorage.setItem('code_verifier', codeVerifier);

    const authUrl = new URL(`${cognitoConfig.cognitoDomain}/oauth2/authorize`);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', cognitoConfig.clientId);
    authUrl.searchParams.set('redirect_uri', `${cognitoConfig.redirectUri}/auth/callback`);
    authUrl.searchParams.set('scope', cognitoConfig.scope);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('code_challenge', codeChallenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');

    // Redirect to Cognito
    window.location.href = authUrl.toString();
  }

  public signUp(): void {
    const signUpUrl = new URL(`${cognitoConfig.cognitoDomain}/signup`);
    signUpUrl.searchParams.set('client_id', cognitoConfig.clientId);
    signUpUrl.searchParams.set('response_type', 'code');
    signUpUrl.searchParams.set('scope', cognitoConfig.scope);
    signUpUrl.searchParams.set('redirect_uri', `${cognitoConfig.redirectUri}/auth/callback`);

    // Redirect to Cognito signup
    window.location.href = signUpUrl.toString();
  }

  public signOut(): void {
    this.clearTokens();
    
    const logoutUrl = new URL(`${cognitoConfig.cognitoDomain}/logout`);
    logoutUrl.searchParams.set('client_id', cognitoConfig.clientId);
    logoutUrl.searchParams.set('logout_uri', cognitoConfig.redirectUri);
    
    window.location.href = logoutUrl.toString();
  }

  public getCurrentUser(): CognitoUser | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const userStr = localStorage.getItem('cognito_user');
      if (!userStr) return null;
      
      const user: CognitoUser = JSON.parse(userStr);
      
      // Check if token is expired
      if (Date.now() >= user.tokenExpiry) {
        this.clearTokens();
        return null;
      }
      
      return user;
    } catch {
      return null;
    }
  }

  public isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  private storeTokens(user: CognitoUser): void {
    localStorage.setItem('cognito_user', JSON.stringify(user));
    
    // Trigger custom event for state updates
    window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: user }));
  }

  private clearTokens(): void {
    localStorage.removeItem('cognito_user');
    sessionStorage.removeItem('auth_state');
    sessionStorage.removeItem('code_verifier');
    
    // Trigger custom event for state updates
    window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: null }));
  }

  private parseJwtPayload(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return {};
    }
  }

  private generateRandomString(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }

  // PKCE-compliant code challenge (SHA256, base64url)
  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return base64;
  }

  // Handle authorization code exchange
  public async handleAuthCallback(code: string, state: string): Promise<CognitoUser> {
    const storedState = sessionStorage.getItem('auth_state');
    const codeVerifier = sessionStorage.getItem('code_verifier');
    
    if (state !== storedState) {
      throw new Error('Invalid state parameter');
    }
    if (!codeVerifier) {
      throw new Error('Missing PKCE code_verifier. Please start sign-in again.');
    }

    // Exchange code for tokens
    const tokenResponse = await fetch(`${cognitoConfig.cognitoDomain}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: cognitoConfig.clientId,
        code,
        redirect_uri: `${cognitoConfig.redirectUri}/auth/callback`,
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const tokens = await tokenResponse.json();
    
    const user: CognitoUser = {
      email: this.parseJwtPayload(tokens.id_token).email,
      sub: this.parseJwtPayload(tokens.id_token).sub,
      accessToken: tokens.access_token,
      idToken: tokens.id_token,
      refreshToken: tokens.refresh_token,
      tokenExpiry: Date.now() + tokens.expires_in * 1000,
    };
    
    this.storeTokens(user);
    return user;
  }
}

export const cognitoAuth = new CognitoAuthService(); 