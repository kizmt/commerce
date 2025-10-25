/**
 * Quick Start Guide for Loyalty Points System
 * 
 * This file contains a quick reference for setting up the loyalty points system.
 * For full documentation, see docs/LOYALTY_POINTS_SYSTEM.md
 */

/**
 * STEP 1: Environment Variables
 * Add these to your .env.local file:
 */

/*
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token
SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_api_token
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret
*/

/**
 * STEP 2: Shopify Admin API Scopes
 * Create an app in Shopify Admin with these scopes:
 * - write_customers (update customer metafields)
 * - read_customers (read customer data)
 * - write_orders (update order metafields)
 * - read_orders (read order data)
 * - write_discounts (create discount codes)
 */

/**
 * STEP 3: Create Metafield Definitions
 * 
 * Customer Metafield:
 * - Namespace: loyalty
 * - Key: points
 * - Type: Integer
 * 
 * Order Metafields:
 * - Namespace: loyalty
 * - Key: points_awarded (Boolean)
 * - Key: points_amount (Integer)
 */

/**
 * STEP 4: Configure Webhooks
 * 
 * Webhook 1: orders/paid
 * URL: https://your-domain.com/api/webhooks/orders/paid
 * 
 * Webhook 2: refunds/create
 * URL: https://your-domain.com/api/webhooks/refunds/create
 */

/**
 * STEP 5: Test
 * 1. Place a test order with a signed-in customer
 * 2. Visit /account/rewards
 * 3. Redeem points for a discount code
 */

/**
 * CONFIGURATION
 * Edit these values in lib/shopify/points.ts:
 */

// Points per yen spent
export const POINTS_PER_YEN = 1;

// Voucher redemption levels
export const VOUCHER_LEVELS = [
  { points: 500, value: 500, label: '¥500 OFF' },
  { points: 1000, value: 1200, label: '¥1200 OFF' },
  { points: 2000, value: 2500, label: '¥2500 OFF' },
  { points: 5000, value: 6500, label: '¥6500 OFF' },
];

