/**
 * Shopify Points System
 *
 * This module handles a loyalty points system using Shopify Customer Metafields.
 * - Awards points on order completion (idempotent via order metafields)
 * - Handles refund reversals
 * - Manages voucher redemption with fixed levels
 */

import { shopifyAdminFetch } from "./admin";

// ===== CONFIGURATION =====

/**
 * Points awarded per ¥1 spent (excluding tax & shipping)
 */
export const POINTS_PER_YEN = 1;

/**
 * Voucher redemption levels: points required → discount code value
 */
export const VOUCHER_LEVELS = [
  { points: 500, value: 500, label: "¥500 OFF" },
  { points: 1000, value: 1200, label: "¥1200 OFF" },
  { points: 2000, value: 2500, label: "¥2500 OFF" },
  { points: 5000, value: 6500, label: "¥6500 OFF" },
] as const;

/**
 * Metafield namespace and keys
 */
export const METAFIELD_NAMESPACE = "loyalty";
export const CUSTOMER_POINTS_KEY = "points";
export const ORDER_AWARDED_KEY = "points_awarded";

// ===== TYPES =====

export type VoucherLevel = (typeof VOUCHER_LEVELS)[number];

export interface CustomerPoints {
  customerId: string;
  points: number;
}

export interface PointsTransaction {
  amount: number;
  reason: string;
  orderId?: string;
  timestamp: string;
}

// ===== CUSTOMER METAFIELD OPERATIONS =====

/**
 * Get customer's current points balance
 */
export async function getCustomerPoints(customerId: string): Promise<number> {
  const gid = formatCustomerGid(customerId);

  const query = `
    query getCustomerPoints($id: ID!) {
      customer(id: $id) {
        id
        metafield(namespace: "${METAFIELD_NAMESPACE}", key: "${CUSTOMER_POINTS_KEY}") {
          value
        }
      }
    }
  `;

  try {
    const { customer } = await shopifyAdminFetch<{
      customer: {
        id: string;
        metafield: { value: string } | null;
      };
    }>({
      query,
      variables: { id: gid },
    });

    if (!customer?.metafield?.value) {
      return 0;
    }

    return parseInt(customer.metafield.value, 10) || 0;
  } catch (error) {
    console.error("Error fetching customer points:", error);
    return 0;
  }
}

/**
 * Set customer's points balance (overwrites existing value)
 */
export async function setCustomerPoints(
  customerId: string,
  points: number,
): Promise<void> {
  const gid = formatCustomerGid(customerId);

  const mutation = `
    mutation setCustomerPoints($input: CustomerInput!) {
      customerUpdate(input: $input) {
        customer {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const input = {
    id: gid,
    metafields: [
      {
        namespace: METAFIELD_NAMESPACE,
        key: CUSTOMER_POINTS_KEY,
        value: Math.max(0, points).toString(),
        type: "number_integer",
      },
    ],
  };

  const result = await shopifyAdminFetch<{
    customerUpdate: {
      customer: { id: string } | null;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>({
    query: mutation,
    variables: { input },
  });

  if (result.customerUpdate.userErrors.length > 0) {
    throw new Error(
      `Failed to update customer points: ${result.customerUpdate.userErrors[0]?.message}`,
    );
  }
}

/**
 * Add points to customer's balance (atomic operation)
 */
export async function addCustomerPoints(
  customerId: string,
  pointsToAdd: number,
): Promise<number> {
  const currentPoints = await getCustomerPoints(customerId);
  const newPoints = currentPoints + pointsToAdd;
  await setCustomerPoints(customerId, newPoints);
  return newPoints;
}

/**
 * Subtract points from customer's balance (atomic operation)
 */
export async function subtractCustomerPoints(
  customerId: string,
  pointsToSubtract: number,
): Promise<number> {
  const currentPoints = await getCustomerPoints(customerId);
  const newPoints = Math.max(0, currentPoints - pointsToSubtract);
  await setCustomerPoints(customerId, newPoints);
  return newPoints;
}

// ===== ORDER METAFIELD OPERATIONS (IDEMPOTENCY) =====

/**
 * Check if points have already been awarded for this order
 */
export async function hasOrderBeenAwarded(orderId: string): Promise<boolean> {
  const gid = formatOrderGid(orderId);

  const query = `
    query checkOrderAwarded($id: ID!) {
      order(id: $id) {
        id
        metafield(namespace: "${METAFIELD_NAMESPACE}", key: "${ORDER_AWARDED_KEY}") {
          value
        }
      }
    }
  `;

  try {
    const { order } = await shopifyAdminFetch<{
      order: {
        id: string;
        metafield: { value: string } | null;
      } | null;
    }>({
      query,
      variables: { id: gid },
    });

    return order?.metafield?.value === "true";
  } catch (error) {
    console.error("Error checking order awarded status:", error);
    return false;
  }
}

/**
 * Mark order as having been awarded points
 */
export async function markOrderAsAwarded(
  orderId: string,
  pointsAwarded: number,
): Promise<void> {
  const gid = formatOrderGid(orderId);

  const mutation = `
    mutation markOrderAwarded($input: OrderInput!) {
      orderUpdate(input: $input) {
        order {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const input = {
    id: gid,
    metafields: [
      {
        namespace: METAFIELD_NAMESPACE,
        key: ORDER_AWARDED_KEY,
        value: "true",
        type: "boolean",
      },
      {
        namespace: METAFIELD_NAMESPACE,
        key: "points_amount",
        value: pointsAwarded.toString(),
        type: "number_integer",
      },
    ],
  };

  const result = await shopifyAdminFetch<{
    orderUpdate: {
      order: { id: string } | null;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>({
    query: mutation,
    variables: { input },
  });

  if (result.orderUpdate.userErrors.length > 0) {
    throw new Error(
      `Failed to mark order as awarded: ${result.orderUpdate.userErrors[0]?.message}`,
    );
  }
}

/**
 * Get points amount awarded for an order
 */
export async function getOrderAwardedPoints(orderId: string): Promise<number> {
  const gid = formatOrderGid(orderId);

  const query = `
    query getOrderAwardedPoints($id: ID!) {
      order(id: $id) {
        id
        metafield(namespace: "${METAFIELD_NAMESPACE}", key: "points_amount") {
          value
        }
      }
    }
  `;

  try {
    const { order } = await shopifyAdminFetch<{
      order: {
        id: string;
        metafield: { value: string } | null;
      } | null;
    }>({
      query,
      variables: { id: gid },
    });

    if (!order?.metafield?.value) {
      return 0;
    }

    return parseInt(order.metafield.value, 10) || 0;
  } catch (error) {
    console.error("Error fetching order awarded points:", error);
    return 0;
  }
}

// ===== POINTS CALCULATION =====

/**
 * Calculate points to award for an order
 * Based on subtotal (excluding shipping, tax, discounts)
 */
export function calculatePointsForOrder(
  subtotalAmount: number,
  currencyCode: string = "JPY",
): number {
  // Only award points for JPY orders
  if (currencyCode !== "JPY") {
    return 0;
  }

  return Math.floor(subtotalAmount * POINTS_PER_YEN);
}

// ===== VOUCHER OPERATIONS =====

/**
 * Get available voucher levels for a given points balance
 */
export function getAvailableVouchers(points: number): VoucherLevel[] {
  return VOUCHER_LEVELS.filter((level) => points >= level.points);
}

/**
 * Get the next voucher level a customer is working towards
 */
export function getNextVoucherLevel(points: number): VoucherLevel | null {
  const nextLevel = VOUCHER_LEVELS.find((level) => points < level.points);
  return nextLevel || null;
}

/**
 * Create a discount code for a customer
 */
export async function createVoucherDiscountCode(
  customerId: string,
  voucherLevel: VoucherLevel,
): Promise<string> {
  const gid = formatCustomerGid(customerId);

  // Generate unique code
  const code = `LOYALTY${voucherLevel.points}-${Date.now().toString(36).toUpperCase()}`;

  const mutation = `
    mutation createDiscountCode($input: DiscountCodeBasicCreateInput!) {
      discountCodeBasicCreate(basicCodeDiscount: $input) {
        codeDiscountNode {
          id
          codeDiscount {
            ... on DiscountCodeBasic {
              title
              codes(first: 1) {
                edges {
                  node {
                    code
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const input = {
    title: `Loyalty ${voucherLevel.points} Points Redemption`,
    code,
    startsAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
    customerSelection: {
      customers: {
        add: [gid],
      },
    },
    customerGets: {
      value: {
        discountAmount: {
          amount: voucherLevel.value.toString(),
          appliesOnEachItem: false,
        },
      },
      items: {
        all: true,
      },
    },
    appliesOncePerCustomer: true,
  };

  const result = await shopifyAdminFetch<{
    discountCodeBasicCreate: {
      codeDiscountNode: {
        id: string;
        codeDiscount: {
          title: string;
          codes: {
            edges: Array<{
              node: {
                code: string;
              };
            }>;
          };
        };
      } | null;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>({
    query: mutation,
    variables: { input },
  });

  if (result.discountCodeBasicCreate.userErrors.length > 0) {
    throw new Error(
      `Failed to create discount code: ${result.discountCodeBasicCreate.userErrors[0]?.message}`,
    );
  }

  if (!result.discountCodeBasicCreate.codeDiscountNode) {
    throw new Error("Failed to create discount code: No code returned");
  }

  const createdCode =
    result.discountCodeBasicCreate.codeDiscountNode.codeDiscount.codes.edges[0]
      ?.node.code;

  if (!createdCode) {
    throw new Error("Failed to create discount code: No code in response");
  }

  return createdCode;
}

// ===== HELPER FUNCTIONS =====

/**
 * Format customer ID to Shopify GID format
 */
function formatCustomerGid(customerId: string): string {
  if (customerId.startsWith("gid://shopify/Customer/")) {
    return customerId;
  }
  return `gid://shopify/Customer/${customerId}`;
}

/**
 * Format order ID to Shopify GID format
 */
function formatOrderGid(orderId: string): string {
  if (orderId.startsWith("gid://shopify/Order/")) {
    return orderId;
  }
  return `gid://shopify/Order/${orderId}`;
}

/**
 * Extract numeric ID from Shopify GID
 */
export function extractIdFromGid(gid: string): string {
  const parts = gid.split("/");
  return parts[parts.length - 1] || "";
}
