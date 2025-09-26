import { createPkcePair } from 'lib/auth/pkce';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const {
  SHOPIFY_CUSTOMER_CLIENT_ID,
  SHOPIFY_CUSTOMER_AUTH_URL,
  SHOPIFY_CUSTOMER_REDIRECT_URI,
  SHOPIFY_CUSTOMER_SCOPES
} = process.env as Record<string, string>;

export async function GET(req: NextRequest) {
  const { codeVerifier, codeChallenge } = await createPkcePair();

  const state = Math.random().toString(36).slice(2);
  const nonce = Math.random().toString(36).slice(2);
  const origin = new URL(req.url).origin;
  const redirectUri = `${origin}/api/auth/customer/callback`;
  const params = new URLSearchParams([
    ['client_id', SHOPIFY_CUSTOMER_CLIENT_ID!],
    ['redirect_uri', redirectUri],
    ['response_type', 'code'],
    ['scope', SHOPIFY_CUSTOMER_SCOPES || 'openid email customer-account-api:full'],
    ['code_challenge', codeChallenge],
    ['code_challenge_method', 'S256'],
    ['state', state],
    ['nonce', nonce]
  ]);

  const response = NextResponse.redirect(`${SHOPIFY_CUSTOMER_AUTH_URL}?${params.toString()}`);
  const isProd = process.env.NODE_ENV === 'production';
  response.cookies.set('shopify_pkce_verifier', codeVerifier, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: isProd,
    maxAge: 60 * 10
  });
  response.cookies.set('shopify_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: isProd,
    maxAge: 60 * 10
  });
  response.cookies.set('shopify_oauth_nonce', nonce, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: isProd,
    maxAge: 60 * 10
  });
  return response;
}


