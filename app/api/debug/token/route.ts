import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("customer_access_token")?.value;
  const idToken = cookieStore.get("customer_id_token")?.value;
  const refreshToken = cookieStore.get("customer_refresh_token")?.value;

  return NextResponse.json({
    hasAccessToken: !!accessToken,
    accessTokenLength: accessToken?.length || 0,
    accessTokenPrefix: accessToken?.substring(0, 10) || "none",
    hasIdToken: !!idToken,
    idTokenLength: idToken?.length || 0,
    hasRefreshToken: !!refreshToken,
    refreshTokenLength: refreshToken?.length || 0,
    shopDomain: process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, ""),
  });
}
