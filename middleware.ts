import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const searchParams = request.nextUrl.searchParams;

  // Redirect old /search/[collection] URLs to /collection/[collection] for SEO
  if (pathname.startsWith("/search/") && pathname !== "/search") {
    const collectionHandle = pathname.replace("/search/", "");
    const url = request.nextUrl.clone();
    url.pathname = `/collection/${collectionHandle}`;
    return NextResponse.redirect(url, 301); // Permanent redirect
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

  // Add noindex to search/collection pages with query parameters (filters/sorting)
  // This prevents duplicate content issues while still allowing the base URLs to be indexed
  if (
    (pathname.startsWith("/search") || pathname.startsWith("/collection")) &&
    (searchParams.has("sort") || searchParams.has("stock") || searchParams.has("q"))
  ) {
    const response = NextResponse.next();
    // These are alternative versions of the canonical page, so don't index them
    response.headers.set("X-Robots-Tag", "noindex, follow");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/account/:path*", "/auth/:path*", "/search", "/search/:path*", "/collection/:path*"],
};
