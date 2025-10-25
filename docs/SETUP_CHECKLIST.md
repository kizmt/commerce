# 🚀 Loyalty Points System - Setup Checklist

Use this checklist to ensure your loyalty points system is properly configured.

## Pre-Deployment Checklist

### 1. Shopify Admin Configuration

#### Create Admin API App
- [ ] Navigate to Shopify Admin → Settings → Apps and sales channels → Develop apps
- [ ] Click "Create an app"
- [ ] Name it "Loyalty Points System" (or similar)
- [ ] Configure Admin API scopes:
  - [ ] `read_customers`
  - [ ] `write_customers`
  - [ ] `read_orders`
  - [ ] `write_orders`
  - [ ] `write_discounts`
- [ ] Click "Install app"
- [ ] Copy the Admin API access token
- [ ] Save token securely

#### Create Customer Metafield Definition
- [ ] Go to Settings → Custom data → Customers
- [ ] Click "Add definition"
- [ ] Set namespace and key: `loyalty.points`
- [ ] Set name: "Loyalty Points"
- [ ] Select type: "Integer"
- [ ] Set access: "Storefront and admin"
- [ ] Save

#### Create Order Metafield Definitions
Create two metafield definitions:

**Definition 1: Points Awarded Flag**
- [ ] Go to Settings → Custom data → Orders
- [ ] Click "Add definition"
- [ ] Set namespace and key: `loyalty.points_awarded`
- [ ] Set name: "Points Awarded"
- [ ] Select type: "True or false"
- [ ] Set access: "Storefront and admin"
- [ ] Save

**Definition 2: Points Amount**
- [ ] Click "Add definition" again
- [ ] Set namespace and key: `loyalty.points_amount`
- [ ] Set name: "Points Amount"
- [ ] Select type: "Integer"
- [ ] Set access: "Storefront and admin"
- [ ] Save

### 2. Environment Configuration

#### Local Development (.env.local)
- [ ] Copy environment variables template from `docs/ENV_TEMPLATE.txt`
- [ ] Fill in `SHOPIFY_STORE_DOMAIN` (without https://)
- [ ] Add `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- [ ] Add `SHOPIFY_ADMIN_ACCESS_TOKEN` (from step 1)
- [ ] Save `.env.local` file

#### Production Environment
- [ ] Add environment variables to Vercel/hosting platform:
  - [ ] `SHOPIFY_STORE_DOMAIN`
  - [ ] `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
  - [ ] `SHOPIFY_ADMIN_ACCESS_TOKEN`
  - [ ] `SHOPIFY_WEBHOOK_SECRET` (will get this in step 4)

### 3. Code Deployment

#### Deploy Application
- [ ] Test locally: `pnpm dev`
- [ ] Check `/account/rewards` page loads
- [ ] Build: `pnpm build`
- [ ] Deploy to production: `vercel --prod` (or your hosting platform)
- [ ] Verify deployment successful
- [ ] Note production URL: `https://___________________`

### 4. Webhook Configuration

#### Create Order Paid Webhook
- [ ] Go to Shopify Admin → Settings → Notifications
- [ ] Scroll to "Webhooks" section
- [ ] Click "Create webhook"
- [ ] Set event: "Order payment"
- [ ] Set format: "JSON"
- [ ] Set URL: `https://your-domain.com/api/webhooks/orders/paid`
- [ ] Set API version: Latest
- [ ] Save webhook
- [ ] Click webhook to view details
- [ ] Copy webhook signing secret
- [ ] Add to environment variables as `SHOPIFY_WEBHOOK_SECRET`

#### Create Refund Create Webhook
- [ ] Click "Create webhook" again
- [ ] Set event: "Refund create"
- [ ] Set format: "JSON"
- [ ] Set URL: `https://your-domain.com/api/webhooks/refunds/create`
- [ ] Set API version: Latest
- [ ] Verify webhook secret matches (should be same for all webhooks)
- [ ] Save webhook

#### Update Environment with Webhook Secret
- [ ] Add `SHOPIFY_WEBHOOK_SECRET` to production environment
- [ ] Redeploy application if needed

### 5. Testing

#### Test Point Award
- [ ] Sign in to your store as a customer
- [ ] Place a test order (use Shopify's test mode)
- [ ] Mark order as paid in Shopify Admin
- [ ] Check webhook logs in Shopify Admin (should show success)
- [ ] Visit `/account/rewards` on your site
- [ ] Verify points were awarded
- [ ] Expected points: `[Order Subtotal in JPY] × 1`

#### Test Idempotency
- [ ] In Shopify Admin, go to webhooks
- [ ] Find the "Order payment" webhook for your test order
- [ ] Click "Resend" to manually retry
- [ ] Visit `/account/rewards` again
- [ ] Verify points were NOT duplicated ✅

#### Test Points Display
- [ ] Visit `/account` page
- [ ] Verify "Loyalty Rewards" card is visible
- [ ] Click card to go to rewards page
- [ ] Verify points balance displays correctly
- [ ] Check progress bar shows next level

#### Test Redemption
- [ ] On `/account/rewards` page
- [ ] Verify available vouchers show (if enough points)
- [ ] Click "Redeem" on a voucher
- [ ] Wait for success message
- [ ] Copy discount code
- [ ] Verify code was created in Shopify Admin → Discounts
- [ ] Test code at checkout (optional)

#### Test Refund Reversal
- [ ] Create a refund for your test order in Shopify Admin
- [ ] Check webhook logs (should show refund webhook success)
- [ ] Visit `/account/rewards`
- [ ] Verify points were subtracted
- [ ] Calculate: Original points - (Refund Amount × 1)

#### Test Navigation
- [ ] Check user menu in navbar
- [ ] Verify "Rewards" link appears when signed in
- [ ] Click link and verify it goes to rewards page
- [ ] Check account page links
- [ ] Verify all navigation works

### 6. Monitoring (First Week)

#### Daily Checks
- [ ] Day 1: Check webhook delivery logs in Shopify Admin
  - Orders paid: ___ delivered / ___ total
  - Refunds: ___ delivered / ___ total
- [ ] Day 3: Review server logs for errors
- [ ] Day 7: Verify 10+ customers have earned points
- [ ] Day 7: Check if any redemptions occurred

#### Common Issues to Watch
- [ ] Webhooks failing? → Check webhook secret matches
- [ ] Points not awarding? → Verify customer was signed in
- [ ] Discount codes not working? → Check Admin API scopes
- [ ] Duplicate points? → Verify order metafields are created

### 7. Customization (Optional)

#### Adjust Points Rate
- [ ] Edit `lib/shopify/points.ts`
- [ ] Change `POINTS_PER_YEN` value
- [ ] Redeploy

#### Modify Voucher Levels
- [ ] Edit `lib/shopify/points.ts`
- [ ] Update `VOUCHER_LEVELS` array
- [ ] Redeploy

#### Change Discount Validity
- [ ] Edit `lib/shopify/points.ts`
- [ ] Find `createVoucherDiscountCode` function
- [ ] Modify `endsAt` calculation
- [ ] Redeploy

#### Add Points Badge to Navbar
- [ ] Edit `components/layout/navbar/index.tsx`
- [ ] Import: `import { PointsBadge } from '@/components/loyalty';`
- [ ] Add `<PointsBadge />` component
- [ ] Wrap navbar in `<LoyaltyProvider>` if not already
- [ ] Redeploy

### 8. Documentation for Team

#### Share with Team
- [ ] Share `docs/LOYALTY_POINTS_SYSTEM.md` with developers
- [ ] Share `docs/IMPLEMENTATION_SUMMARY.md` with stakeholders
- [ ] Document any customizations made
- [ ] Add to internal wiki/docs

#### Customer Communications
- [ ] Create help article explaining loyalty program
- [ ] Update "About" or "FAQ" page with points info
- [ ] Send email announcement to existing customers
- [ ] Add points info to order confirmation emails (optional)

## Post-Launch Checklist

### Week 1
- [ ] Monitor webhook delivery rates
- [ ] Check for customer support questions
- [ ] Review point balances look reasonable
- [ ] Verify redemptions are working

### Month 1
- [ ] Analyze redemption rates
- [ ] Review voucher level effectiveness
- [ ] Consider adjustments to points rate
- [ ] Gather customer feedback

### Quarter 1
- [ ] Review overall program success
- [ ] Calculate ROI (redemption value vs increased sales)
- [ ] Plan improvements or adjustments

## Quick Reference

**Webhook URLs:**
- Orders: `https://your-domain.com/api/webhooks/orders/paid`
- Refunds: `https://your-domain.com/api/webhooks/refunds/create`

**Customer-Facing Pages:**
- Rewards: `/account/rewards`
- Account: `/account`

**Admin Locations:**
- Webhooks: Settings → Notifications → Webhooks
- Metafields: Settings → Custom data
- API Access: Settings → Apps and sales channels → Develop apps
- Discounts: Discounts → Discount codes

**Configuration Files:**
- Points logic: `lib/shopify/points.ts`
- Webhook handlers: `app/api/webhooks/`
- Components: `components/loyalty/`

## Troubleshooting Quick Links

| Issue | Check |
|-------|-------|
| Points not awarded | • Customer signed in?<br>• Webhook delivered?<br>• Order status = paid? |
| Webhook fails | • Secret matches?<br>• URL correct?<br>• SSL certificate valid? |
| Can't redeem | • Enough points?<br>• Customer authenticated?<br>• Admin API scopes? |
| Code doesn't work | • Code created in Shopify?<br>• Not expired?<br>• Customer eligible? |

## Support Resources

- Full documentation: `docs/LOYALTY_POINTS_SYSTEM.md`
- Implementation summary: `docs/IMPLEMENTATION_SUMMARY.md`
- Environment template: `docs/ENV_TEMPLATE.txt`
- Quick start guide: `docs/LOYALTY_SETUP_QUICK_START.ts`

---

**Need Help?** Review the full documentation in `docs/LOYALTY_POINTS_SYSTEM.md` for detailed troubleshooting and configuration options.

