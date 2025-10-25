import { createPkcePair } from "lib/auth/pkce";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const {
  SHOPIFY_CUSTOMER_CLIENT_ID,
  SHOPIFY_CUSTOMER_SCOPES,
  SHOPIFY_STORE_DOMAIN,
} = process.env as Record<string, string>;

export async function GET(req: NextRequest) {
  const { codeVerifier, codeChallenge } = await createPkcePair();

  const state = Math.random().toString(36).slice(2);
  const nonce = Math.random().toString(36).slice(2);
  const origin = new URL(req.url).origin;
  const isProd = process.env.NODE_ENV === "production";
  const redirectUri =
    process.env.SHOPIFY_CUSTOMER_REDIRECT_URI ||
    `${origin}/api/auth/customer/callback`;
  // Discover authorization endpoint from the shop domain
  const shopDomain = (SHOPIFY_STORE_DOMAIN || "").replace(/^https?:\/\//, "");
  if (!shopDomain) {
    return NextResponse.redirect(new URL("/account?auth=token_error", origin));
  }
  let authorizationEndpoint = "";
  try {
    const discovery = await fetch(
      `https://${shopDomain}/.well-known/openid-configuration`,
      { cache: "no-store" },
    );
    const conf = await discovery.json();
    authorizationEndpoint = conf?.authorization_endpoint || "";
  } catch {}

  const params = new URLSearchParams([
    ["client_id", SHOPIFY_CUSTOMER_CLIENT_ID!],
    ["redirect_uri", redirectUri],
    ["response_type", "code"],
    [
      "scope",
      SHOPIFY_CUSTOMER_SCOPES || "openid email customer-account-api:full",
    ],
    ["code_challenge", codeChallenge],
    ["code_challenge_method", "S256"],
    ["state", state],
    ["nonce", nonce],
    ["prompt", "login"],
    ["max_age", "0"],
  ]);

  const authorizeUrl =
    authorizationEndpoint ||
    `https://${shopDomain}/authentication/oauth/authorize`;
  const response = NextResponse.redirect(
    `${authorizeUrl}?${params.toString()}`,
  );

  // Clear any existing customer auth cookies
  response.cookies.delete("customer_access_token");
  response.cookies.delete("customer_refresh_token");
  response.cookies.delete("customer_id_token");

  // Set PKCE cookies
  response.cookies.set("shopify_pkce_verifier", codeVerifier, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isProd,
    maxAge: 60 * 10,
  });
  response.cookies.set("shopify_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isProd,
    maxAge: 60 * 10,
  });
  response.cookies.set("shopify_oauth_nonce", nonce, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isProd,
    maxAge: 60 * 10,
  });
  return response;
}
