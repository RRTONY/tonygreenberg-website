# Owner Actions: Search Console and Cloudflare

The site-side fixes are live. These two actions must be completed from the Google Search Console and Cloudflare accounts that own the domain. The current automated browser session is not authenticated to either account.

## 1. Google Search Console

Open [Google Search Console](https://search.google.com/search-console) and select the `https://tonygreenberg.com/` property.

| Step | Action | Exact value |
|---|---|---|
| 1 | Open **Sitemaps** | `https://tonygreenberg.com/sitemap.xml` |
| 2 | Submit or resubmit the sitemap | `sitemap.xml` |
| 3 | Open **URL inspection** and request indexing for the priority URLs below | One URL at a time |
| 4 | Return to the **Excluded by noindex** report | Click **Validate Fix** if it is available |

### Priority URLs to request now

1. `https://tonygreenberg.com/about`
2. `https://tonygreenberg.com/articles`
3. `https://tonygreenberg.com/start-here`
4. `https://tonygreenberg.com/humanos`
5. `https://tonygreenberg.com/speaking`
6. `https://tonygreenberg.com/impact-futurism`
7. `https://tonygreenberg.com/psychedelic-readiness-index`
8. `https://tonygreenberg.com/facilitator-index`
9. `https://tonygreenberg.com/blog/your-blood-lies-without-your-dna`
10. `https://tonygreenberg.com/blog/energy-is-money-money-is-memory`

## 2. Cloudflare

Open the Cloudflare dashboard for `tonygreenberg.com`.

| Step | Action |
|---|---|
| 1 | Open **Caching** |
| 2 | Choose **Configuration** or **Purge Cache**, depending on the dashboard version |
| 3 | Select **Purge Everything** |
| 4 | Confirm the purge |

This clears stale HTML, CSS, and image responses so visitors receive the current mobile-safe image paths, updated canonicals, and current metadata immediately.

## Confirmation Checklist

After both actions, open an incognito or private browser window and verify:

- `https://tonygreenberg.com/` loads the kintsugi hero image.
- `https://tonygreenberg.com/blog` shows article-card imagery without broken-image icons.
- `https://tonygreenberg.com/sitemap.xml` loads successfully.
- `https://tonygreenberg.com/speaking` loads successfully.
