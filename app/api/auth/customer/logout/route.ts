import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const { SHOPIFY_CUSTOMER_LOGOUT_URL, SHOPIFY_STORE_DOMAIN } =
  process.env as Record<string, string>;

export async function GET(req: NextRequest) {
  const origin = new URL(req.url).origin;
  const idToken = req.cookies.get("customer_id_token")?.value;
  const postLogout = `${origin}/`;
  // If no id_token, do local logout only to avoid Shopify error page
  if (!idToken) {
    const response = NextResponse.redirect(postLogout);
    response.cookies.delete("customer_access_token");
    response.cookies.delete("customer_refresh_token");
    response.cookies.delete("customer_id_token");
    return response;
  }

  // Discover end_session_endpoint from the shop's domain if available
  let discoveredLogout = "";
  try {
    const shopDomain = (SHOPIFY_STORE_DOMAIN || "").replace(/^https?:\/\//, "");
    if (shopDomain) {
      const res = await fetch(
        `https://${shopDomain}/.well-known/openid-configuration`,
        { cache: "no-store" },
      );
      const conf = await res.json();
      discoveredLogout = conf?.end_session_endpoint || "";
    }
  } catch {}

  // Prefer global logout URL from env to avoid storefront password issues
  const chosenLogout =
    SHOPIFY_CUSTOMER_LOGOUT_URL || discoveredLogout || postLogout;
  const logoutUrl = new URL(chosenLogout);
  logoutUrl.searchParams.set("id_token_hint", idToken);
  logoutUrl.searchParams.set("post_logout_redirect_uri", postLogout);

  const response = NextResponse.redirect(logoutUrl.toString());
  response.cookies.delete("customer_access_token");
  response.cookies.delete("customer_refresh_token");
  response.cookies.delete("customer_id_token");
  return response;
}
