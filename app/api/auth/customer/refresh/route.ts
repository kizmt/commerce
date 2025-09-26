import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const {
  SHOPIFY_CUSTOMER_CLIENT_ID,
  SHOPIFY_CUSTOMER_TOKEN_URL
} = process.env as Record<string, string>;

export async function POST(req: NextRequest) {
  const refresh = req.cookies.get('customer_refresh_token')?.value;
  if (!refresh) return NextResponse.json({ error: 'no_refresh' }, { status: 400 });

  const body = new URLSearchParams([
    ['grant_type', 'refresh_token'],
    ['client_id', SHOPIFY_CUSTOMER_CLIENT_ID!],
    ['refresh_token', refresh]
  ]);

  const tokenRes = await fetch(SHOPIFY_CUSTOMER_TOKEN_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });

  if (!tokenRes.ok) return NextResponse.json({ error: 'token_error' }, { status: 500 });

  const tokenJson = await tokenRes.json();
  const response = NextResponse.json({ ok: true });
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
  return response;
}


