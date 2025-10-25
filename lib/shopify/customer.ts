import { SHOPIFY_STOREFRONT_API_VERSION } from "lib/constants";
import { headers } from "next/headers";

export async function customerFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  // Customer Account API requires the custom domain, not .myshopify.com
  // Use SHOPIFY_CUSTOM_DOMAIN if available, otherwise fall back to SHOPIFY_STORE_DOMAIN
  const customDomain = process.env.SHOPIFY_CUSTOM_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN;
  const shopDomain = customDomain?.replace(/^https?:\/\//, "") || "";

  console.log("SHOPIFY_CUSTOM_DOMAIN:", process.env.SHOPIFY_CUSTOM_DOMAIN);
  console.log("SHOPIFY_STORE_DOMAIN:", process.env.SHOPIFY_STORE_DOMAIN);
  console.log("Using domain for Customer Account API:", shopDomain);

  // Discover the GraphQL endpoint from the well-known endpoint
  let endpoint = "";
  try {
    const apiDiscoveryUrl = `https://${shopDomain}/.well-known/customer-account-api`;
    console.log("Discovering endpoint from:", apiDiscoveryUrl);
    const apiRes = await fetch(apiDiscoveryUrl, { cache: "no-store" });
    
    if (!apiRes.ok) {
      throw new Error(`Discovery failed with status ${apiRes.status}`);
    }
    
    const apiConfig = await apiRes.json();
    console.log("Discovery response:", apiConfig);
    endpoint =
      apiConfig?.graphql_api || `https://${shopDomain}/customer/api/graphql`;
    console.log("Discovered endpoint:", endpoint);
  } catch (error) {
    // Fallback to constructed endpoint if discovery fails
    console.log("Endpoint discovery failed:", error);
    const version =
      process.env.SHOPIFY_CUSTOMER_API_VERSION ||
      SHOPIFY_STOREFRONT_API_VERSION;
    endpoint = `https://${shopDomain}/account/customer/api/${version}/graphql`;
    console.log("Fallback endpoint:", endpoint);
  }

  const token = await getCustomerAccessToken();

  console.log("Token retrieved:", {
    hasToken: !!token,
    tokenLength: token?.length || 0,
    tokenPrefix: token?.substring(0, 10) || "none",
  });

  if (!token) {
    throw new Error("Not authenticated");
  }

  console.log("Making request to:", endpoint);
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  console.log("API Response:", {
    status: res.status,
    ok: res.ok,
    hasErrors: !!json.errors,
    errorMessage: json.errors?.[0]?.message,
  });

  if (!res.ok || json.errors) {
    console.error("customerFetch error:", {
      endpoint,
      status: res.status,
      errors: json.errors,
    });
    throw json.errors?.[0] || json;
  }
  return json.data as T;
}

async function getCustomerAccessToken(): Promise<string> {
  try {
    const h = await headers();
    const cookieHeader = h.get("cookie") || h.get("Cookie");
    if (!cookieHeader) return "";
    const match = cookieHeader.match(/(?:^|; )customer_access_token=([^;]+)/);
    return match ? decodeURIComponent(match[1]!) : "";
  } catch {
    return "";
  }
}
