import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const {
  SHOPIFY_CUSTOMER_CLIENT_ID,
  SHOPIFY_CUSTOMER_TOKEN_URL,
  SHOPIFY_CUSTOMER_REDIRECT_URI
} = process.env as Record<string, string>;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const stateCookie = req.cookies.get('shopify_oauth_state')?.value;
  const codeVerifier = req.cookies.get('shopify_pkce_verifier')?.value;
  const nonceCookie = req.cookies.get('shopify_oauth_nonce')?.value;

  if (!code || !state || !stateCookie || stateCookie !== state || !codeVerifier || !nonceCookie) {
    return NextResponse.redirect(new URL('/?auth=error', url.origin));
  }

  const origin = url.origin;
  const redirectUri = `${origin}/api/auth/customer/callback`;
  const body = new URLSearchParams([
    ['grant_type', 'authorization_code'],
    ['client_id', SHOPIFY_CUSTOMER_CLIENT_ID!],
    ['redirect_uri', redirectUri],
    ['code', code],
    ['code_verifier', codeVerifier]
  ]);

  const tokenRes = await fetch(SHOPIFY_CUSTOMER_TOKEN_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Origin': origin,
      'User-Agent': 'Next.js Commerce'
    },
    body
  });

  if (!tokenRes.ok) {
    try {
      const errText = await tokenRes.text();
      console.error('Shopify token exchange failed', tokenRes.status, errText);
    } catch {}
    return NextResponse.redirect(new URL('/account?auth=token_error', url.origin));
  }

  const tokenJson = await tokenRes.json();

  const response = NextResponse.redirect(new URL('/account?auth=ok', url.origin));
  const isProd = process.env.NODE_ENV === 'production';
  response.cookies.set('customer_access_token', tokenJson.access_token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: isProd,
    maxAge: tokenJson.expires_in ?? 60 * 30
  });
  if (tokenJson.refresh_token) {
    response.cookies.set('customer_refresh_token', tokenJson.refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: isProd,
      maxAge: 60 * 60 * 24 * 30
    });
  }
  if (tokenJson.id_token) {
    // Store id_token for RP-initiated logout
    response.cookies.set('customer_id_token', tokenJson.id_token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: isProd,
      maxAge: 60 * 60 * 24 * 7
    });
  }

  response.cookies.delete('shopify_pkce_verifier');
  response.cookies.delete('shopify_oauth_state');
  response.cookies.delete('shopify_oauth_nonce');
  return response;
}


