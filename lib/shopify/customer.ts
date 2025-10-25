import { SHOPIFY_STOREFRONT_API_VERSION } from "lib/constants";
import { headers } from "next/headers";

export async function customerFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  const version =
    process.env.SHOPIFY_CUSTOMER_API_VERSION || SHOPIFY_STOREFRONT_API_VERSION;
  
  // Get the shop domain from environment variable
  const shopDomain = process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, "") || "";
  const endpoint = `https://${shopDomain}/account/customer/api/${version}/graphql`;
  
  const token = await getCustomerAccessToken();
  
  if (!token) {
    console.error("No customer access token found");
    throw new Error("Not authenticated");
  }
  
  console.log("customerFetch endpoint:", endpoint);
  console.log("Has token:", !!token);
  
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  
  const json = await res.json();
  
  console.log("customerFetch response status:", res.status);
  console.log("customerFetch response:", JSON.stringify(json, null, 2));
  
  if (!res.ok || json.errors) {
    console.error("customerFetch error:", json.errors?.[0] || json);
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
