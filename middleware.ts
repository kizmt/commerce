import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname;
  const pathname = request.nextUrl.pathname;
  const url = request.nextUrl;

  // Redirect www to non-www (to match Shopify Customer Account API settings)
  // Skip for Next.js internal prefetch requests
  const isPrefetch = url.searchParams.has('_rsc');
  if (hostname.startsWith('www.') && !isPrefetch) {
    const newUrl = request.nextUrl.clone();
    newUrl.hostname = hostname.replace('www.', '');
    return NextResponse.redirect(newUrl, 301);
  }

  // Add noindex header to API routes and auth callbacks to prevent them from being indexed
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/account/") ||
    pathname.includes("/auth/")
  ) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
