# Shopify Loyalty Points System

A complete, production-ready loyalty points system for Shopify stores built with Next.js (App Router). This system awards points for purchases, allows customers to redeem them for discount codes, and uses Shopify Customer Metafields for storage (no database required).

## Features

- ✅ **Automatic Point Awards**: Customers earn points when they complete purchases (signed-in customers only)
- ✅ **Idempotent Processing**: Webhook retries won't double-award points
- ✅ **Refund Handling**: Points are automatically reversed when refunds are issued
- ✅ **Voucher Redemption**: Customers can redeem points for fixed-value discount codes
- ✅ **No Database Required**: Uses Shopify Customer & Order Metafields for storage
- ✅ **Secure Webhooks**: HMAC verification ensures webhook authenticity
- ✅ **Modern UI**: Beautiful, responsive customer-facing interface

## Architecture

### Points Storage
- **Customer Points Balance**: Stored in customer metafields (`loyalty.points`)
- **Order Award Tracking**: Stored in order metafields (`loyalty.points_awarded`) for idempotency

### Points Calculation
- **Earning Rate**: 1 point per ¥1 spent (configurable)
- **Calculation Base**: Subtotal amount (excludes tax and shipping)
- **Currency**: Currently configured for JPY only

### Voucher Levels
```typescript
500 points   → ¥500 OFF
1000 points  → ¥1200 OFF
2000 points  → ¥2500 OFF
5000 points  → ¥6500 OFF
```

## Setup Guide

### 1. Environment Variables

Add the following to your `.env.local` file:

```bash
# Shopify Store Configuration
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_token

# Shopify Admin API (Required for Points System)
SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_api_token

# Webhook Security
SHOPIFY_WEBHOOK_SECRET=your_webhook_secret
```

### 2. Create a Shopify Admin API Token

1. Go to your Shopify Admin → Settings → Apps and sales channels → Develop apps
2. Create a new app or select an existing one
3. Configure Admin API scopes:
   - `write_customers` (to update customer metafields)
   - `read_customers` (to read customer data)
   - `write_orders` (to update order metafields)
   - `read_orders` (to read order data)
   - `write_discounts` (to create discount codes)
4. Install the app and copy the Admin API access token
5. Add it to your `.env.local` as `SHOPIFY_ADMIN_ACCESS_TOKEN`

### 3. Create Customer Metafield Definition

Create a metafield definition for customer points:

1. Go to Shopify Admin → Settings → Custom data → Customers
2. Add definition:
   - **Namespace and key**: `loyalty.points`
   - **Name**: Loyalty Points
   - **Type**: Integer
   - **Access**: Storefront and admin

### 4. Create Order Metafield Definitions

Create metafield definitions for order tracking:

1. Go to Shopify Admin → Settings → Custom data → Orders
2. Add two definitions:

   **Definition 1:**
   - **Namespace and key**: `loyalty.points_awarded`
   - **Name**: Points Awarded
   - **Type**: True or false
   - **Access**: Storefront and admin

   **Definition 2:**
   - **Namespace and key**: `loyalty.points_amount`
   - **Name**: Points Amount
   - **Type**: Integer
   - **Access**: Storefront and admin

### 5. Set Up Webhooks

Configure webhooks in Shopify Admin:

#### Webhook 1: Orders Paid
- **Event**: `orders/paid`
- **URL**: `https://your-domain.com/api/webhooks/orders/paid`
- **Format**: JSON

#### Webhook 2: Refunds Create
- **Event**: `refunds/create`
- **URL**: `https://your-domain.com/api/webhooks/refunds/create`
- **Format**: JSON

**Important**: Copy the webhook secret from Shopify and add it to your `.env.local` as `SHOPIFY_WEBHOOK_SECRET`

### 6. Deploy Your Application

Deploy to Vercel or your preferred hosting platform:

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Deploy
vercel --prod
```

### 7. Test the System

1. **Test Point Award**: Place a test order with a signed-in customer
2. **Check Points**: Visit `/account/rewards` to see the points balance
3. **Test Redemption**: Redeem points for a discount code
4. **Test Refund**: Process a refund and verify points are subtracted

## File Structure

```
lib/shopify/
├── admin.ts              # Shopify Admin API client
└── points.ts             # Points system core logic

app/api/
├── webhooks/
│   ├── orders/paid/      # Order completion webhook
│   └── refunds/create/   # Refund processing webhook
└── loyalty/
    ├── points/           # Get customer points
    └── redeem/           # Redeem points for discount

components/loyalty/
├── loyalty-context.tsx   # React context for points
├── points-display.tsx    # Points balance display
└── voucher-redemption.tsx # Redemption UI

app/account/
├── layout.tsx            # Account layout with LoyaltyProvider
├── page.tsx              # Account dashboard
└── rewards/              # Rewards page
    └── page.tsx
```

## API Endpoints

### GET `/api/loyalty/points`
Get authenticated customer's points balance and available vouchers.

**Authentication**: Required (customer_access_token cookie)

**Response**:
```json
{
  "points": 1500,
  "availableVouchers": [
    { "points": 500, "value": 500, "label": "¥500 OFF" },
    { "points": 1000, "value": 1200, "label": "¥1200 OFF" }
  ],
  "nextLevel": { "points": 2000, "value": 2500, "label": "¥2500 OFF" }
}
```

### POST `/api/loyalty/redeem`
Redeem points for a discount code.

**Authentication**: Required (customer_access_token cookie)

**Request**:
```json
{
  "voucherPoints": 500
}
```

**Response**:
```json
{
  "success": true,
  "discountCode": "LOYALTY500-ABC123",
  "pointsRedeemed": 500,
  "discountValue": 500,
  "newBalance": 1000
}
```

### POST `/api/webhooks/orders/paid`
Webhook handler for order completion (awards points).

**Authentication**: HMAC signature verification

### POST `/api/webhooks/refunds/create`
Webhook handler for refunds (reverses points).

**Authentication**: HMAC signature verification

## Customization

### Change Points Earning Rate

Edit `/lib/shopify/points.ts`:

```typescript
export const POINTS_PER_YEN = 2; // 2 points per ¥1
```

### Modify Voucher Levels

Edit `/lib/shopify/points.ts`:

```typescript
export const VOUCHER_LEVELS = [
  { points: 100, value: 100, label: '¥100 OFF' },
  { points: 500, value: 550, label: '¥550 OFF' },
  // Add more levels...
] as const;
```

### Change Discount Code Validity

Edit `/lib/shopify/points.ts` in the `createVoucherDiscountCode` function:

```typescript
endsAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 180 days
```

### Support Multiple Currencies

Edit `/lib/shopify/points.ts` in the `calculatePointsForOrder` function:

```typescript
export function calculatePointsForOrder(
  subtotalAmount: number,
  currencyCode: string = 'JPY',
): number {
  // Define rates per currency
  const rates: Record<string, number> = {
    JPY: 1,
    USD: 100, // 100 points per $1
    EUR: 120, // 120 points per €1
  };

  const rate = rates[currencyCode] || 0;
  return Math.floor(subtotalAmount * rate);
}
```

## Security Considerations

1. **Webhook Verification**: All webhooks use HMAC signature verification
2. **Authentication**: Points API requires customer authentication via cookies
3. **Idempotency**: Order metafields prevent duplicate point awards on webhook retries
4. **Admin API**: Access token is server-side only (never exposed to client)

## Troubleshooting

### Points Not Awarded
- Check that the customer was signed in when placing the order
- Verify webhooks are configured correctly in Shopify Admin
- Check webhook logs for errors: Shopify Admin → Settings → Notifications → Webhooks
- Verify `SHOPIFY_ADMIN_ACCESS_TOKEN` has correct permissions

### Discount Code Creation Fails
- Verify `write_discounts` scope is granted to your Admin API token
- Check that customer ID is correctly stored in session cookies
- Review server logs for specific error messages

### Points Balance Not Displaying
- Ensure customer is signed in
- Check that customer metafield definition exists
- Verify `customer_access_token` cookie is set
- Check browser console for API errors

### Webhook Authentication Fails
- Verify `SHOPIFY_WEBHOOK_SECRET` matches the secret in Shopify Admin
- Ensure webhook handler receives raw body (not parsed)
- Check that HMAC header is being passed correctly

## Testing

### Manual Testing Checklist

- [ ] Customer places order while signed in → Points awarded
- [ ] Customer places order while signed out → No points awarded
- [ ] Webhook retry → Points not duplicated (idempotency)
- [ ] Refund processed → Points subtracted
- [ ] Partial refund → Proportional points subtracted
- [ ] Points redemption → Discount code created
- [ ] Insufficient points → Redemption blocked
- [ ] Discount code works at checkout
- [ ] Points balance displays correctly
- [ ] Progress to next level displays correctly

### Development Testing

For local testing, use ngrok or a similar tool to expose your localhost:

```bash
# Install ngrok
brew install ngrok  # macOS

# Expose localhost
ngrok http 3000

# Update webhook URLs in Shopify to use ngrok URL
# Example: https://abc123.ngrok.io/api/webhooks/orders/paid
```

## Support and Issues

For issues or questions:
1. Check the troubleshooting section above
2. Review server logs for error messages
3. Verify all environment variables are set correctly
4. Ensure Shopify API scopes are configured properly

## License

This implementation is provided as-is for use in your Shopify store.

