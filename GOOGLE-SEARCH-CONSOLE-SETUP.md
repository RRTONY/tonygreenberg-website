# Google Search Console Setup Guide

**For:** Kim, Darryl, and the TonyGreenberg.com team
**Purpose:** Get all 14 indexed pages crawled and appearing in Google search results
**Time required:** 15 minutes (one-time setup) + 2 minutes per URL submission

---

## What This Does

Google Search Console (GSC) tells Google "these pages exist, please crawl them now" instead of waiting weeks for Google to discover them organically. Once submitted, pages typically appear in search results within 24-48 hours.

We have **14 pages** ready for indexing with full server-side rendered HTML, Open Graph tags, JSON-LD structured data, and proper meta descriptions.

---

## Step 1: Verify Domain Ownership

If `tonygreenberg.com` is not already verified in Google Search Console:

1. Go to [https://search.google.com/search-console](https://search.google.com/search-console)
2. Sign in with the Google account that manages tonygreenberg.com
3. Click **"Add Property"** (top-left dropdown)
4. Choose **"URL prefix"** and enter: `https://tonygreenberg.com`
5. Google will offer verification methods. The easiest:

| Method | Steps | Best For |
|--------|-------|----------|
| **DNS TXT Record** | Add a TXT record to tonygreenberg.com DNS | Darryl (if you manage DNS) |
| **HTML File Upload** | Upload a file to the site root | Not recommended (our site is SPA) |
| **Google Analytics** | Auto-verifies if GA is installed | If GA is already on the site |
| **Google Tag Manager** | Auto-verifies if GTM is installed | If GTM is already on the site |

**Recommended:** DNS TXT record. Google will give you a string like `google-site-verification=abc123xyz`. Add it as a TXT record on tonygreenberg.com in your DNS provider (Cloudflare, Namecheap, etc.).

---

## Step 2: Submit the Sitemap

Once verified:

1. In Search Console, click **"Sitemaps"** in the left sidebar
2. Enter: `sitemap.xml`
3. Click **"Submit"**

This tells Google about all 14 indexed pages at once. Google will crawl them on its own schedule (usually within 48 hours).

---

## Step 3: Request Immediate Indexing (Priority Pages)

For faster results, manually request indexing for each priority page:

1. In Search Console, click the **URL Inspection** bar at the top
2. Paste each URL below (one at a time)
3. Click **"Request Indexing"**
4. Repeat for each URL

### Priority URLs to Submit (in order of importance):

| # | URL | Article |
|---|-----|---------|
| 1 | `https://tonygreenberg.com/psychedelic-readiness-index` | Psychedelic Readiness Index (interactive tool) |
| 2 | `https://tonygreenberg.com/blog/the-molecule-as-mirror-from-substance-to-service` | The Molecule as Mirror |
| 3 | `https://tonygreenberg.com/blog/boiling-the-human-summit-harvard-kurzweil` | "Boiling the Human" H+ Summit / Harvard-Kurzweil |
| 4 | `https://tonygreenberg.com/blog/the-restaurant-with-no-menu-prices-ai-ethics-manifesto` | Zuck: Fix This Now (AI Ethics) |
| 5 | `https://tonygreenberg.com/blog/only-time-buys-trust` | Trust Us? Are You Really My Friend? |
| 6 | `https://tonygreenberg.com/blog/psychedelics-could-become-extractive-capitalism` | Psychedelics Could Become Extractive Capitalism |
| 7 | `https://tonygreenberg.com/blog/forever-chemicals-in-my-blood-pfas-and-microplastics` | Forever Chemicals in My Blood |
| 8 | `https://tonygreenberg.com/blog/davos-2022-world-economic-forum-here-we-come` | Davos 2022 - World Economic Forum |
| 9 | `https://tonygreenberg.com/blog/the-ball-and-blockchain-decentralization` | The Ball and Blockchain |
| 10 | `https://tonygreenberg.com/blog/return-on-investment-going-green-going-green-2` | Return on Investment - Going Green |
| 11 | `https://tonygreenberg.com/blog/customer-service-key-to-business-success` | Customer Service: The Key to Business Success |
| 12 | `https://tonygreenberg.com/blog/why-good-service-is-all-about-trust` | Why Good Service Is All About Trust |
| 13 | `https://tonygreenberg.com/akbar` | Los Angeles Is Losing Its Memory (Akbar) |
| 14 | `https://tonygreenberg.com/blog/is-that-a-lot-clarisse-abelarde` | Is That a Lot? (Clarisse) |

**Note:** Google limits you to approximately 10-12 "Request Indexing" submissions per day. If you hit the limit, continue the next day.

---

## Step 4: Verify It Worked

After 24-48 hours:

1. Go back to Search Console
2. Paste a URL in the Inspection bar
3. Look for the green checkmark: **"URL is on Google"**
4. You can also search Google directly: `site:tonygreenberg.com`

---

## What's Already Done (Technical)

The engineering team has already completed:

- Server-side rendered HTML for all 14 pages (bots see full article text without JavaScript)
- Open Graph meta tags (for LinkedIn/Facebook/Twitter link previews)
- JSON-LD structured data (for Google rich snippets)
- `robots.txt` updated to allow all major crawlers
- `sitemap.xml` with all 14 URLs and last-modified dates
- AI crawler access enabled (ChatGPT, Claude, Perplexity, Cohere, etc.)

---

## Ongoing Maintenance

When new articles are published and should be indexed:

1. Engineering adds the slug to the SSR batch list
2. Kim or Darryl submits the new URL in Search Console
3. That's it — the sitemap auto-updates

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "URL is not on Google" after 48 hours | Re-submit via URL Inspection. Check for crawl errors. |
| "Crawled - currently not indexed" | Page may need more inbound links. Share on LinkedIn/Twitter. |
| "Blocked by robots.txt" | Contact engineering — a path may not be in the Allow list. |
| Can't verify domain | Use DNS TXT method. Ask Darryl to add the record. |
| "Request Indexing" greyed out | Daily limit reached. Try again tomorrow. |

---

*Last updated: May 27, 2026*
*Contact: Engineering team via Slack for technical issues*
