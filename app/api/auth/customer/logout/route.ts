import { NextResponse } from 'next/server';

const { SHOPIFY_CUSTOMER_LOGOUT_URL } = process.env as Record<string, string>;

export async function GET() {
  const response = NextResponse.redirect('/');
  response.cookies.delete('customer_access_token');
  response.cookies.delete('customer_refresh_token');
  response.headers.set('Location', SHOPIFY_CUSTOMER_LOGOUT_URL || '/');
  return response;
}


