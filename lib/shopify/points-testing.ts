/**
 * Loyalty Points System - Testing Utilities
 *
 * Helper functions for testing the loyalty points system
 * Run these in your dev tools console or create test scripts
 */

/**
 * Test if customer has points metafield
 * Usage: In browser console on /account/rewards page
 */
export async function testGetPoints() {
  try {
    const response = await fetch("/api/loyalty/points");
    const data = await response.json();

    console.log("✅ Points API Response:", data);
    console.log("Current Points:", data.points);
    console.log("Available Vouchers:", data.availableVouchers);
    console.log("Next Level:", data.nextLevel);

    return data;
  } catch (error) {
    console.error("❌ Error fetching points:", error);
    return null;
  }
}

/**
 * Test points redemption
 * Usage: testRedemption(500) to redeem 500 point voucher
 */
export async function testRedemption(voucherPoints: number) {
  try {
    const response = await fetch("/api/loyalty/redeem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ voucherPoints }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Redemption successful!");
      console.log("Discount Code:", data.discountCode);
      console.log("Points Redeemed:", data.pointsRedeemed);
      console.log("Discount Value:", data.discountValue);
      console.log("New Balance:", data.newBalance);
    } else {
      console.error("❌ Redemption failed:", data.error);
    }

    return data;
  } catch (error) {
    console.error("❌ Error redeeming points:", error);
    return null;
  }
}

/**
 * Simulate webhook payload for testing
 * This is what Shopify sends to your webhook endpoints
 */
export const SAMPLE_WEBHOOK_PAYLOADS = {
  orderPaid: {
    id: 5678901234,
    email: "customer@example.com",
    customer: {
      id: 1234567890,
      email: "customer@example.com",
      first_name: "John",
      last_name: "Doe",
    },
    total_price: "15000.00",
    subtotal_price: "12000.00",
    total_tax: "1200.00",
    currency: "JPY",
    financial_status: "paid",
    line_items: [
      {
        id: 9876543210,
        title: "Test Product",
        quantity: 1,
        price: "12000.00",
      },
    ],
  },

  refundCreate: {
    id: 9876543210,
    order_id: 5678901234,
    created_at: new Date().toISOString(),
    note: "Customer requested refund",
    refund_line_items: [
      {
        id: 1111111111,
        quantity: 1,
        line_item_id: 9876543210,
        subtotal: 6000, // Half refund
      },
    ],
    transactions: [
      {
        id: 2222222222,
        amount: "7500.00",
        kind: "refund",
        status: "success",
      },
    ],
    order_adjustments: [],
    order: {
      id: 5678901234,
      customer: {
        id: 1234567890,
        email: "customer@example.com",
      },
      currency: "JPY",
    },
  },
};

/**
 * Validation helper: Check environment variables
 * Run in Node.js environment (e.g., in a test file)
 */
export function validateEnvironment() {
  const required = [
    "SHOPIFY_STORE_DOMAIN",
    "SHOPIFY_STOREFRONT_ACCESS_TOKEN",
    "SHOPIFY_ADMIN_ACCESS_TOKEN",
    "SHOPIFY_WEBHOOK_SECRET",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("❌ Missing environment variables:", missing);
    return false;
  }

  console.log("✅ All required environment variables are set");
  return true;
}

/**
 * Points calculation test cases
 */
export const TEST_CASES = {
  pointsCalculation: [
    { subtotal: 10000, currency: "JPY", expected: 10000 },
    { subtotal: 5500, currency: "JPY", expected: 5500 },
    { subtotal: 100.5, currency: "JPY", expected: 100 }, // Rounds down
    { subtotal: 10000, currency: "USD", expected: 0 }, // Non-JPY = 0
  ],

  voucherEligibility: [
    { points: 0, availableCount: 0, nextLevel: 500 },
    { points: 500, availableCount: 1, nextLevel: 1000 },
    { points: 1000, availableCount: 2, nextLevel: 2000 },
    { points: 2000, availableCount: 3, nextLevel: 5000 },
    { points: 5000, availableCount: 4, nextLevel: null },
    { points: 10000, availableCount: 4, nextLevel: null },
  ],
};

/**
 * Manual test: Create webhook HMAC signature
 * Use this to test webhook verification locally
 */
export function createWebhookHMAC(body: string, secret: string): string {
  const crypto = require("crypto");
  return crypto
    .createHmac("sha256", secret)
    .update(body, "utf8")
    .digest("base64");
}

/**
 * Test webhook locally using curl
 * Copy this command and replace values
 */
export const CURL_TEST_WEBHOOK = `
# Test order paid webhook
curl -X POST http://localhost:3000/api/webhooks/orders/paid \\
  -H "Content-Type: application/json" \\
  -H "X-Shopify-Hmac-Sha256: YOUR_HMAC_SIGNATURE" \\
  -d '{
    "id": 5678901234,
    "email": "test@example.com",
    "customer": {
      "id": 1234567890,
      "email": "test@example.com",
      "first_name": "Test",
      "last_name": "User"
    },
    "total_price": "10000.00",
    "subtotal_price": "10000.00",
    "total_tax": "0.00",
    "currency": "JPY",
    "financial_status": "paid",
    "line_items": []
  }'
`;

/**
 * Debugging checklist
 */
export const DEBUGGING_CHECKLIST = {
  pointsNotAwarded: [
    "Is the customer signed in?",
    "Was the order paid (not pending)?",
    "Is the webhook URL correct?",
    "Did the webhook deliver successfully? (Check Shopify Admin)",
    "Are the metafield definitions created?",
    "Does the Admin API token have correct scopes?",
    "Check server logs for errors",
  ],

  webhookFails: [
    "Does SHOPIFY_WEBHOOK_SECRET match?",
    "Is the endpoint URL accessible?",
    "Is SSL certificate valid?",
    "Check webhook delivery logs in Shopify",
    "Test HMAC signature manually",
  ],

  redemptionFails: [
    "Does customer have enough points?",
    "Is customer authenticated?",
    "Are discount API scopes granted?",
    "Check customer_id cookie is set",
    "Review server logs for specific error",
  ],
};

/**
 * Points system health check
 * Run this periodically to verify system is working
 */
export async function healthCheck() {
  console.log("🏥 Running Loyalty Points System Health Check...\n");

  // Check 1: Environment variables
  console.log("1. Environment Variables");
  const envOk = validateEnvironment();
  console.log("");

  // Check 2: API endpoints
  console.log("2. API Endpoints");
  try {
    const pointsRes = await fetch("/api/loyalty/points");
    console.log(
      `   GET /api/loyalty/points: ${pointsRes.status === 401 || pointsRes.status === 200 ? "✅" : "❌"} (${pointsRes.status})`,
    );
  } catch (e) {
    console.log("   GET /api/loyalty/points: ❌ (Error)");
  }
  console.log("");

  // Check 3: Pages
  console.log("3. Customer Pages");
  const pages = ["/account", "/account/rewards"];
  for (const page of pages) {
    try {
      const res = await fetch(page);
      console.log(
        `   ${page}: ${res.status === 200 ? "✅" : "❌"} (${res.status})`,
      );
    } catch (e) {
      console.log(`   ${page}: ❌ (Error)`);
    }
  }
  console.log("");

  console.log("✅ Health check complete!");
}

// Export for use in test files
export default {
  testGetPoints,
  testRedemption,
  SAMPLE_WEBHOOK_PAYLOADS,
  validateEnvironment,
  TEST_CASES,
  createWebhookHMAC,
  DEBUGGING_CHECKLIST,
  healthCheck,
};
