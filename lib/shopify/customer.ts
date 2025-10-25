import { SHOPIFY_STOREFRONT_API_VERSION } from "lib/constants";
import { headers } from "next/headers";

export async function customerFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  // Get the shop domain from environment variable
  const shopDomain =
    process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, "") || "";

  // Discover the GraphQL endpoint from the well-known endpoint
  let endpoint = "";
  try {
    const apiDiscoveryUrl = `https://${shopDomain}/.well-known/customer-account-api`;
    const apiRes = await fetch(apiDiscoveryUrl, { cache: "no-store" });
    const apiConfig = await apiRes.json();
    endpoint =
      apiConfig?.graphql_api || `https://${shopDomain}/customer/api/graphql`;
  } catch {
    // Fallback to constructed endpoint if discovery fails
    const version =
      process.env.SHOPIFY_CUSTOMER_API_VERSION ||
      SHOPIFY_STOREFRONT_API_VERSION;
    endpoint = `https://${shopDomain}/account/customer/api/${version}/graphql`;
  }

  const token = await getCustomerAccessToken();

  console.log("customerFetch - has token:", !!token, "endpoint:", endpoint);

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

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
