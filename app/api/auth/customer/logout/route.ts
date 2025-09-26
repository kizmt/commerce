import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const { SHOPIFY_CUSTOMER_LOGOUT_URL } = process.env as Record<string, string>;

export async function GET(req: NextRequest) {
  const origin = new URL(req.url).origin;
  const idToken = req.cookies.get('customer_id_token')?.value;
  const postLogout = `${origin}/`;
  const logoutUrl = new URL(SHOPIFY_CUSTOMER_LOGOUT_URL || postLogout);
  if (logoutUrl.host.includes('shopify.com')) {
    if (idToken) logoutUrl.searchParams.set('id_token_hint', idToken);
    logoutUrl.searchParams.set('post_logout_redirect_uri', postLogout);
  }
  const response = NextResponse.redirect(logoutUrl.toString());
  response.cookies.delete('customer_access_token');
  response.cookies.delete('customer_refresh_token');
  response.cookies.delete('customer_id_token');
  return response;
}


