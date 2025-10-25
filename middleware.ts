import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {

  const pathname = request.nextUrl.pathname;

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
  matcher: ["/api/:path*", "/account/:path*", "/auth/:path*"],

};