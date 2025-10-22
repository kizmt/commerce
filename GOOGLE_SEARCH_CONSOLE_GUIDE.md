# Google Search Console Configuration Guide

## Why This Matters

Google Search Console's **URL Parameter Tool** tells Google how to treat your search filters. Without proper configuration, Google crawls every combination of filters as separate pages:
- `/search/pokemon?sort=popular`
- `/search/pokemon?sort=newest`
- `/search/pokemon?sort=expensive`
- `/search/pokemon?stock=in`
- `/search/pokemon?stock=out`

This creates duplicate content that **dilutes SEO authority**.

---

## Step-by-Step Configuration

### 1. Access Search Console Parameter Settings

1. Go to **Google Search Console** (https://search.google.com/search-console)
2. Select your site: **turtleislandcards.com**
3. Go to **Settings** (left sidebar, bottom)
4. Click **URL Parameters**

### 2. Add the "q" Parameter (Search Query)

**What it is:** User's search query (e.g., `?q=pokemon`)

**Configuration:**
- **Parameter:** `q`
- **How this parameter affects your pages:** Select **"No index this parameter"**
- **Examples of pages with this parameter:**
  - `/search?q=pokemon`
  - `/search?q=charizard`

**Why:** Search queries are user-specific and create infinite URL variations. Google should use the canonical `/search` instead.

---

### 3. Add the "sort" Parameter

**What it is:** Sort order for products (newest, popular, price, etc.)

**Configuration:**
- **Parameter:** `sort`
- **How this parameter affects your pages:** Select **"I want Google to crawl this parameter"**
- **Depending on this parameter affects the page content:** Select **"No, I don't use this for different content. The parameter does not affect page content."**

**Examples of pages:**
  - `/search/pokemon?sort=popular`
  - `/search/pokemon?sort=newest`

**Why:** While sort doesn't change content, you want Google to understand the parameter. Marking it as "doesn't affect content" tells Google to consolidate to canonical `/search/pokemon`

**Alternative (More Conservative):**
If you prefer Google NOT to crawl these at all:
- Select **"I don't want Google to crawl this parameter"**

---

### 4. Add the "stock" Parameter

**What it is:** Inventory filter (in stock, out of stock, both)

**Configuration:**
- **Parameter:** `stock`
- **How this parameter affects your pages:** Select **"I want Google to crawl this parameter"**
- **Depending on this parameter affects the page content:** Select **"No, I don't use this for different content. The parameter does not affect page content."**

**Examples:**
- `/search/pokemon?stock=in`
- `/search/pokemon?stock=out`

**Why:** Same as sort - filters don't change core content, so consolidate to canonical.

---

### 5. Verify No Other Parameters Need Configuration

Check your code for any other parameters:

**Current parameters in code:**
- `q` - search query ✅ (configured above)
- `sort` - sort order ✅ (configured above)
- `stock` - inventory status ✅ (configured above)

**These don't need configuration** (hardcoded in site structure):
- Page number in pagination (handled by Next.js dynamic routing)
- Collection name (dynamic route parameter, not query string)

---

## After Configuration - What to Do

### 1. Resubmit Your Sitemap

After configuring parameters:
1. Go to **Sitemaps** (left sidebar)
2. Select your sitemap entry
3. Click **"Resubmit"** or delete and re-add

This tells Google to recrawl with new parameter understanding.

### 2. Request Reindexing

1. Go to **URL Inspection Tool** (top search bar in Search Console)
2. Enter: `https://turtleislandcards.com/search`
3. Click **"Request Indexing"**

Repeat for:
- `https://turtleislandcards.com/search/pokemon`
- `https://turtleislandcards.com/search/magic-the-gathering`
- `https://turtleislandcards.com/product/[any-product]`

### 3. Monitor the Coverage Report

1. Go to **Coverage** (left sidebar)
2. Look for **"Excluded"** section
3. Expand and look for pages with `?sort=` or `?q=` parameters

These should gradually disappear as Google understands your configuration.

---

## Expected Results Timeline

### Immediately After Configuration (Same Day)
- Google Search Console shows parameters are configured
- No immediate changes visible

### Days 1-3
- Googlebot starts respecting parameter settings
- May see increase in crawl budget on canonical URLs
- May see decrease in crawl budget on parameter variants

### Days 4-7
- Parameter variant pages start being marked as duplicates
- "Duplicate without user-selected canonical" warnings should decrease
- Canonical pages start consolidating indexation

### Weeks 2-4
- Search results should show single version of product pages
- Fewer total indexed pages (100+ duplicates consolidated)
- Organic search traffic starts appearing for site

---

## Front-End Implementation: rel="nofollow" on Filter Links

Even with Google Search Console configured, it's best practice to mark parameter links as "not to be followed."

**Where to add rel="nofollow":**

### 1. Sort Links
**File:** Look for sort/filter component that generates URLs like:
```
/search/pokemon?sort=popular
/search?sort=newest
```

Add `rel="nofollow"` attribute:
```jsx
<Link href={`/search?sort=popular`} rel="nofollow">
  Sort: Most Popular
</Link>
```

### 2. Stock Filter Links
**File:** Look for availability/stock filter component:
```
/search/pokemon?stock=in
```

Add `rel="nofollow"`:
```jsx
<Link href={`/search/pokemon?stock=in`} rel="nofollow">
  In Stock Only
</Link>
```

### 3. Search Query Links (if applicable)
If you have internal links to search results:
```jsx
<Link href={`/search?q=rare+cards`} rel="nofollow">
  Rare Cards
</Link>
```

---

## Alternative Configuration (Conservative Approach)

If you want to be more conservative and prevent ALL parameter crawling:

1. **For "q" parameter:** "I don't want Google to crawl this parameter" ✅
2. **For "sort" parameter:** "I don't want Google to crawl this parameter" ✓
3. **For "stock" parameter:** "I don't want Google to crawl this parameter" ✓

**Pros:**
- Maximizes crawl budget for canonical pages
- Zero chance of parameter variants getting indexed
- Safest for SEO

**Cons:**
- Google can't discover new filter combinations
- Might miss some legitimate search patterns

---

## Monitoring After Implementation

### In Search Console - Monitor These Metrics

1. **Coverage Report:**
   - Watch "Excluded" section for URLs with `?` parameters
   - Should decrease over time
   - Accepted pages should consolidate

2. **Performance Report:**
   - Watch for "Turtle Island Cards" branded search queries
   - Monitor generic TCG queries
   - Look for "position" improvement in top 100 results

3. **URL Inspection:**
   - Randomly pick a product page
   - Check "Crawl details" to verify no parameter variants are indexed

### Tools to Track Progress

**Free Tools:**
- Google Search Console (primary tool)
- Google Analytics 4 (track organic traffic)
- Bing Webmaster Tools (secondary search engine)

**Premium Tools (Optional):**
- SEMrush (keyword tracking)
- Ahrefs (backlink analysis)
- Moz (rank tracking)

---

## Troubleshooting

### Problem: "Duplicate without user-selected canonical" warnings not decreasing

**Solutions:**
1. Verify canonical URLs are absolute (include `https://` and domain)
2. Check that metadata is actually deploying (verify via View Page Source)
3. Wait 2-3 weeks - Google crawls gradually
4. Consider adding X-Robots-Tag header (already done in middleware.ts)

### Problem: Redirect chains still appearing

**Causes & Fixes:**
1. Check `/api/auth/customer/callback` isn't being crawled
   - Verify middleware.ts is deployed
   - Check X-Robots-Tag headers in Network tab
   - Verify robots.txt blocks `/api/`

2. Check account pages redirects
   - Ensure `/account/` redirects non-authenticated users to login
   - Verify no redirect loops

### Problem: Product pages still showing duplicate warnings

**Solutions:**
1. Verify no alternate versions of same product exist
2. Check for:
   - `/product/[handle]` vs `/product/[handle]?variant=`
   - Query string parameters on product URLs
   - Different domain versions (www vs non-www)

3. Add redirect for any duplicates:
   ```tsx
   // Example: if variants should redirect to base product
   redirect(`/product/${params.handle}`);
   ```

---

## Quick Reference Checklist

### Before Going Live
- [ ] Code changes deployed (Phase 1 fixes)
- [ ] sitemap.xml updated
- [ ] robots.txt includes disallow rules
- [ ] Product schema has review, aggregateRating, offerCount

### Search Console Configuration
- [ ] "q" parameter → "No index this parameter"
- [ ] "sort" parameter → Configured (crawl or no-index)
- [ ] "stock" parameter → Configured (crawl or no-index)
- [ ] Sitemap resubmitted
- [ ] URL inspection tool requests sent

### Front-End Implementation
- [ ] Found all sort/filter link components
- [ ] Added `rel="nofollow"` to filter URLs (optional but recommended)
- [ ] Verified links don't create new parameter combinations

### Monitoring
- [ ] Search Console bookmarked
- [ ] Coverage report monitored daily for first week
- [ ] Performance report tracked weekly
- [ ] Google Analytics tracking organic traffic

---

## Summary

**What we're achieving:**
1. Consolidating 100+ duplicate pages to canonical versions
2. Redirecting crawl budget from filters to main content
3. Improving overall site indexation quality
4. Enabling better ranking for core pages

**Timeline:**
- Immediate: Configuration complete
- Days 1-3: Google processes new settings
- Days 4-7: Consolidation starts
- Weeks 2-4: Noticeable improvement in search visibility

**Next Phase After This:**
- Phase 3: Add additional schema markup (LocalBusiness, FAQPage, Breadcrumbs)
- Phase 4: Monitor rankings and organic traffic improvements
