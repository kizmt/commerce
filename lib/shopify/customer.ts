import { headers } from "next/headers";

export async function customerFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  // Customer Account API uses the .myshopify.com domain with account subdomain
  // NOT the custom domain
  const myshopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const shopDomain = myshopifyDomain?.replace(/^https?:\/\//, "") || "";

  console.log("SHOPIFY_STORE_DOMAIN:", process.env.SHOPIFY_STORE_DOMAIN);
  console.log("Using domain for Customer Account API:", shopDomain);

  // Discover the GraphQL endpoint from the well-known endpoint
  let endpoint = "";
  let shopId = "";
  
  try {
    // Use the OpenID configuration endpoint to get shop ID
    const apiDiscoveryUrl = `https://${shopDomain}/.well-known/openid-configuration`;
    console.log("Discovering endpoint from:", apiDiscoveryUrl);
    const apiRes = await fetch(apiDiscoveryUrl, { cache: "no-store" });
    
    if (!apiRes.ok) {
      throw new Error(`Discovery failed with status ${apiRes.status}`);
    }
    
    const apiConfig = await apiRes.json();
    console.log("Discovery response:", apiConfig);
    
    // Extract shop ID from issuer URL
    // issuer format: "https://shopify.com/authentication/78378696954"
    const issuer = apiConfig?.issuer;
    if (issuer) {
      const match = issuer.match(/\/authentication\/(\d+)/);
      if (match) {
        shopId = match[1];
        console.log("Extracted shop ID:", shopId);
      }
    }
    
    // Try to get graphql_api from config (might not exist)
    endpoint = apiConfig?.graphql_api;
    
    if (!endpoint && shopId) {
      // Construct the endpoint using shop ID
      endpoint = `https://shopify.com/${shopId}/account/customer/api/unstable/graphql`;
      console.log("Constructed endpoint from shop ID:", endpoint);
    }
    
    if (!endpoint) {
      throw new Error("Could not determine GraphQL endpoint");
    }
    
    console.log("Final endpoint:", endpoint);
  } catch (error) {
    // Fallback to constructed endpoint if discovery fails
    console.log("Endpoint discovery failed:", error);
    
    // The Customer Account API GraphQL endpoint is typically just /graphql on the account subdomain
    const shopName = shopDomain.split('.')[0];
    endpoint = `https://${shopName}.account.myshopify.com/graphql`;
    
    console.log("Fallback endpoint:", endpoint);
  }

  const token = await getCustomerAccessToken();

  console.log("Token retrieved:", {
    hasToken: !!token,
    tokenLength: token?.length || 0,
    tokenPrefix: token?.substring(0, 10) || "none",
    startsWithShcat: token?.startsWith("shcat_"),
    tokenSample: token ? `${token.substring(0, 20)}...${token.substring(token.length - 20)}` : "none"
  });

  if (!token) {
    throw new Error("Not authenticated");
  }

  console.log("Making request to:", endpoint);
  console.log("Authorization header:", `Bearer ${token.substring(0, 30)}...`);
  
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json().catch((e) => {
    console.error("Failed to parse JSON response:", e);
    console.error("Response status:", res.status);
    console.error("Response headers:", Object.fromEntries(res.headers.entries()));
    return { errors: [{ message: "Invalid response from server" }] };
  });

  console.log("API Response:", {
    status: res.status,
    ok: res.ok,
    hasErrors: !!json.errors,
    errorMessage: json.errors?.[0]?.message,
    hasData: !!json.data,
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
