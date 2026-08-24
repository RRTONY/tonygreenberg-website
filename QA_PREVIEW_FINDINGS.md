# Preview Findings

## Fresh homepage preview

The freshly restarted preview confirmed that the homepage hero is rendering the kintsugi bowl image rather than the headshot. The hero CTA is compact and left aligned in the refreshed desktop preview. The latest essay cards resolve their permanent `/api/img/` image paths, including the Energy and Blood articles.

## Search Console access

The current automated browser session reaches Google Search Console but is not authenticated to the owner property. Sitemap submission and URL indexing requests therefore remain owner actions and are listed in `SEO_OWNER_ACTIONS.md`.

## Cloudflare access

The current automated browser session reaches the Cloudflare dashboard address but receives an internal-server-error response instead of an authenticated account view. Cache purging therefore remains an owner action and is documented in `SEO_OWNER_ACTIONS.md`.
