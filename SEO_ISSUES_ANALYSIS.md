# SEO Issues Analysis & Fix Strategy
**Date:** October 22, 2025

## Executive Summary
Your site is experiencing **critical SEO issues** preventing indexation and search visibility. The problems stem from 5 main areas: canonical tag implementation, search parameter handling, missing Product schema fields, incomplete JSON-LD markup, and improper redirect handling.

---

## 🔴 CRITICAL ISSUES (High Priority)

### 1. **Search Parameter Duplicate Content Issues**
**Problem:** `/search` and `/search/[collection]` pages don't handle query parameters in canonical URLs.

**Current Behavior:**
- `/search?q=pokemon&sort=newest` → canonical: `/search`
- `/search/pokemon?sort=best&stock=in` → canonical: `/search/pokemon`
- Query parameters (`?sort=`, `?q=`, `?stock=`) create duplicate URLs Google sees as different pages

**Impact:**
- Creates 100+ duplicate pages (different sort/filter combinations = different URLs)
- Google marks as "Duplicate without user-selected canonical"
- Dilutes link juice across duplicates
- **THIS IS YOUR PRIMARY INDEXATION PROBLEM**

**Fix:**
```tsx
// In app/search/page.tsx and app/search/[collection]/page.tsx
// Add rel="canonical" that ignores all query parameters
alternates: {
  canonical: "/search", // NO query params
}

// Also add in metadata:
robots: {
  index: true,
  follow: true,
  "googlebot": {
    index: true,
    follow: true,
  }
}
```

---

### 2. **Authentication Routes Causing Redirect Loops**
**Problem:** `/account/*` pages have `index: false, follow: false` BUT Shopify OAuth redirects create redirect chains.

**Current Flow:**
1. User: `GET /api/auth/customer/login?force=1`
2. Server: Redirects to Shopify OAuth
3. Shopify: Redirects back to `/api/auth/customer/callback`
4. App: Redirects to `/account` or `/account?auth=ok`
5. **Google sees chain of redirects → marks as "Page with redirect"**

**Additional Issue:** Account pages aren't explicitly marked as no-index in all places (only in layout.tsx)

**Fix:**
- Add explicit no-index to account callback route
- Ensure all account/* routes have consistent no-index metadata
- Add `noindex` header to API routes

---

### 3. **Missing Critical Product Schema Fields**
**Problem:** Google Console reports:
- ❌ Missing `review` (required for rich snippets)
- ❌ Missing `aggregateRating` (only added for "popular" tagged products)
- ❌ Missing `offerCount` in `offers` object

**Current Code (lines 86-123 in product page):**
```tsx
productJsonLd = {
  // Missing: review, aggregateRating for ALL products, offerCount
  offers: {
    "@type": "AggregateOffer",
    // Missing: offerCount
    availability: ...,
    priceCurrency: ...,
  }
}
```

**Fix:**
- Add `review` array with Review objects
- Include `aggregateRating` for all products (even if just hardcoded)
- Add `offerCount` to offers object
- Add `url` field to offers

---

### 4. **Search Page Metadata Corruption**
**Problem:** Line 19-20 in `app/search/page.tsx` has a truncated string:
```tsx
description: "", // INCOMPLETE!
```

**Impact:** Search page missing meta description → poor CTR in search results

---

### 5. **Collection Page Parameter Handling**
**Problem:** `/search/[collection]?sort=X&stock=Y` creates duplicates:
- `/search/pokemon` ✓
- `/search/pokemon?sort=popular` → Google sees as duplicate
- `/search/pokemon?stock=in` → Google sees as duplicate

**Fix:** Mark sort/filter parameters as "noindex" parameters in Google Search Console AND add canonical that strips them

---

## 🟠 HIGH PRIORITY ISSUES

### 6. **Robots.txt & Sitemap Issues**

**Current robots.txt (line 5):**
```tsx
userAgent: "*", // No disallow rules
```

**Problems:**
- No explicit crawl delay
- No blocking of parameter URLs
- Doesn't block `/api/*` paths

**Missing `Disallow` rules:**
```
Disallow: /account/
Disallow: /api/
Disallow: /api/auth/
```

---

### 7. **Sitemap Not Including Query Parameter Variants**
**Current sitemap behavior (line 10):**
- Includes `/search` ✓
- Includes `/search/[collection]` ✓
- **BUT:** Doesn't include common query parameter variants

**What's missing:**
- No guidance for sort parameters
- No guidance for search queries
- No guidance for filter combinations

**Recommendation:** Add `rel="nofollow"` or mark as canonical in sitemap

---

### 8. **Missing rel="nofollow" on Query String Links**
**Problem:** Filter/sort links in UI likely generate URLs like:
- `/search/pokemon?sort=popular` (needs nofollow)
- `/search?q=rare+cards&sort=newest` (needs nofollow)

**These should be marked as filtered parameters** in Search Console

---

### 9. **No Search Console Parameter Handling**
**Missing:** In Search Console, you should configure:
```
Parameter settings:
- q (Search query): No index parameter pages
- sort: Doesn't change content, can crawl
- stock: Doesn't change content, can crawl
```

---

### 10. **Incomplete OpenGraph Images**
**Problem:** Not all pages have proper Open Graph images configured
- Product pages: ✓ Have featured image
- Collection pages: ❌ Missing image
- Search page: ❌ Missing image

---

## 🟡 MEDIUM PRIORITY ISSUES

### 11. **No Structured Data for Organization/LocalBusiness**
**Found:** Only "Store" schema in root layout (line 85-107)

**Missing:** LocalBusiness schema with:
- Full contact information
- Hours of operation
- Multiple address formats
- Opening hours schema

---

### 12. **No FAQ Schema**
**Current:** `/faq` page exists but has NO `FAQPage` schema markup

**Missing:** Should have:
```tsx
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [...]
}
```

---

### 13. **Breadcrumb Schema Only on Collection Pages**
**Missing from:**
- Product pages
- Search pages (without collection)
- Category pages

---

### 14. **No ProductCollection Schema**
**Missing:** When showing products in a collection, should wrap with `ProductCollection` schema

---

## 🔵 MINOR ISSUES

### 15. **baseUrl Fallback to localhost**
**Line in utils.ts (14):** Falls back to `http://localhost:3000` if NEXT_PUBLIC_SITE_URL not set
- This breaks sitemap on staging without proper env var

---

### 16. **Meta Robots Inconsistency**
- Account layout: `index: false, follow: false` ✓
- But account page doesn't inherit consistently
- Not all error pages have proper robots meta

---

### 17. **No Canonical for Dynamic Pages**
Some pages use relative canonical paths:
```tsx
canonical: `/product/${params.handle}` // Missing baseUrl prefix
canonical: `/${params.page}` // Missing baseUrl prefix
```

Should be:
```tsx
canonical: `${baseUrl}/product/${params.handle}`
```

---

## 📊 Why Pages Aren't Indexing

### Root Cause Chain:
1. **Search parameters create duplicates** → Google sees `/search?q=X` as different from `/search`
2. **Redirect loops on OAuth flows** → Google marks with "Page with redirect"
3. **No canonical guidance on filtered URLs** → Google confused which to index
4. **Account pages redirect to login** → More redirect chains
5. **Missing product schema fields** → Google doesn't show rich snippets
6. **Site not appearing in search results** → New sites need 2-3 weeks + clean crawlability

---

## 🛠️ RECOMMENDED FIX ORDER

### Phase 1: IMMEDIATE (This Week) - Critical Fixes
1. ✅ Fix search page metadata (line 19-20)
2. ✅ Add `robots: { index: true }` to `/search` and `/search/[collection]`
3. ✅ Update canonicals to include `baseUrl`
4. ✅ Mark all `/account/*` as `noindex`
5. ✅ Update robots.txt with proper disallow rules
6. ✅ Add missing Product schema fields (review, aggregateRating, offerCount)

### Phase 2: SHORT TERM (This Week-Next) - Query Parameter Fixes
7. ✅ Configure Search Console parameter settings
8. ✅ Add `rel="nofollow"` to all sort/filter URLs in UI
9. ✅ Implement canonical parameter stripping
10. ✅ Update sitemap strategy

### Phase 3: MEDIUM TERM (Next 2 Weeks) - Schema Enhancements
11. ✅ Add LocalBusiness schema
12. ✅ Add FAQPage schema to /faq
13. ✅ Add Breadcrumb schema to all pages
14. ✅ Add ProductCollection schema
15. ✅ Verify all pages have proper Open Graph images

### Phase 4: LONG TERM - Infrastructure
16. ✅ Set up proper environment variables
17. ✅ Add Search Console monitoring
18. ✅ Implement analytics for indexation

---

## 🔍 Why Site Isn't Appearing After 2 Weeks

**Expected Timeline for New Sites:**
- Week 1: Pages added to crawl queue
- Week 2-3: Pages crawled and assessed
- Week 3-4: Pages indexed if quality passes

**Why you're delayed:**
1. ❌ Redirect loops prevent proper crawling
2. ❌ Duplicate content confuses Google's algorithm
3. ❌ No clear canonical path = Google can't decide which version to index
4. ❌ Account pages with noindex might be indexed instead of public pages
5. ❌ Missing schema data makes pages appear lower quality

**Expected Fix Timeline:**
- After applying Phase 1 fixes: 3-5 days for re-crawl
- After fixes appear in search: Additional 2-3 days for ranking
- **Realistic timeline: 1-2 weeks to see meaningful search traffic**

---

## 📋 Shopify Headless Impact

**Good news:** Using headless Shopify is excellent for SEO:
- ✅ Full control over HTML/metadata
- ✅ Can implement Next.js best practices
- ✅ Can customize schema markup
- ✅ Page speed typically better

**Not your issue** - but ensure:
- Products are properly published in Shopify
- Product visibility isn't restricted
- Collections are visible in storefront
- Inventory status is accurate

---

## ✅ ACTION ITEMS

See separate `SEO_FIXES.md` for code-level implementation details.
