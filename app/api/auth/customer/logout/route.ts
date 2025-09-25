import { NextRequest, NextResponse } from 'next/server';

const { SHOPIFY_CUSTOMER_LOGOUT_URL } = process.env as Record<string, string>;

export async function GET(req: NextRequest) {
  const origin = new URL(req.url).origin;
  const redirectTo = SHOPIFY_CUSTOMER_LOGOUT_URL || `${origin}/`;
  const response = NextResponse.redirect(redirectTo);
  response.cookies.delete('customer_access_token');
  response.cookies.delete('customer_refresh_token');
  return response;
}


