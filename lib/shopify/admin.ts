/**
 * Shopify Admin API Client
 *
 * This module provides a fetch wrapper for Shopify Admin GraphQL API
 * Required for metafield operations and discount code creation
 */

const SHOPIFY_ADMIN_API_VERSION =
  process.env.SHOPIFY_ADMIN_API_VERSION || "2025-01";

/**
 * Shopify Admin API GraphQL fetch wrapper
 */
export async function shopifyAdminFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  if (!domain || !accessToken) {
    throw new Error(
      "Missing required environment variables: SHOPIFY_STORE_DOMAIN and/or SHOPIFY_ADMIN_ACCESS_TOKEN",
    );
  }

  const url = `https://${domain}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/graphql.json`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Shopify Admin API request failed: ${response.status} ${response.statusText}\n${errorText}`,
      );
    }

    const json = await response.json();

    if (json.errors) {
      throw new Error(
        `Shopify Admin API GraphQL errors: ${JSON.stringify(json.errors)}`,
      );
    }

    return json.data as T;
  } catch (error) {
    console.error("Shopify Admin API error:", error);
    throw error;
  }
}

/**
 * Verify webhook authenticity using HMAC
 */
export function verifyShopifyWebhook(
  body: string,
  hmacHeader: string | null,
): boolean {
  if (!hmacHeader) {
    return false;
  }

  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

  if (!secret) {
    console.error("SHOPIFY_WEBHOOK_SECRET not configured");
    return false;
  }

  // Use Web Crypto API (available in Node.js 15+)
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const bodyData = encoder.encode(body);

  // For Node.js environment, use native crypto
  if (typeof process !== "undefined" && process.versions?.node) {
    const crypto = require("crypto");
    const hash = crypto
      .createHmac("sha256", secret)
      .update(body, "utf8")
      .digest("base64");
    return hash === hmacHeader;
  }

  // This shouldn't happen in server context, but added for completeness
  console.error("Webhook verification requires Node.js crypto");
  return false;
}
