import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    
    return NextResponse.json({
      success: true,
      cookies: allCookies.map(c => ({
        name: c.name,
        value: c.value.substring(0, 20) + "...", // Only show first 20 chars for security
        hasValue: !!c.value
      })),
      hasAccessToken: !!cookieStore.get("customer_access_token")?.value,
      hasRefreshToken: !!cookieStore.get("customer_refresh_token")?.value,
      hasIdToken: !!cookieStore.get("customer_id_token")?.value,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

