import axios from 'axios';
import type { TokenResponse } from '../types/types';

// PKCE utilities
function base64UrlEncode(str: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function sha256(buffer: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  return crypto.subtle.digest('SHA-256', encoder.encode(buffer));
}

export async function generateCodeVerifier(): Promise<string> {
  // 32 random bytes → 43 base64url chars → satisfies PKCE 43-128 char range
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array.buffer);
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const hashed = await sha256(verifier);
  return base64UrlEncode(hashed);
}

const CLIENT_ID = import.meta.env.VITE_APS_CLIENT_ID as string;
const CLIENT_SECRET = import.meta.env.VITE_APS_CLIENT_SECRET as string;
const REDIRECT_URI = import.meta.env.VITE_APS_REDIRECT_URI as string;
const SCOPES = 'data:read viewables:read'; // adjust if needed

export async function getAuthUrl(): Promise<string> {
  const verifier = await generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  // Store verifier for later token exchange
  localStorage.setItem('pkce_verifier', verifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  });
  return `https://developer.api.autodesk.com/authentication/v2/authorize?${params.toString()}`;
}

/**
 * After the user is redirected back to our app, call this function to
 * exchange the authorization code for an access token.
 */
export async function exchangeCodeForToken(code: string): Promise<string> {
  const verifier = localStorage.getItem('pkce_verifier');
  if (!verifier) throw new Error('PKCE verifier not found in sessionStorage');

  const data = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: verifier,
  });

  try {
    const response = await axios.post<TokenResponse>(
      'https://developer.api.autodesk.com/authentication/v2/token',
      data,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    const token = response.data.access_token;
    // Store token (sessionStorage is sufficient for this demo)
    localStorage.setItem('access_token', token);
    return token;
  } catch (err: any) {
    if (err.response && err.response.data) {
      console.error('Autodesk token exchange error details:', err.response.data);
    }
    throw err;
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem('access_token');
}

export function clearAuth(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('pkce_verifier');
}
