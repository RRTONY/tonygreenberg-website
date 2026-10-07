# Performance and Lighthouse (2026-10-08)

Goal from the owner: Lighthouse performance 90+ on mobile, accessibility/best practices/SEO 100.

## Measure on Netlify, not locally

- Local `pnpm start` runs understate the score. Lighthouse's mobile score is *simulated* from the
  real page load: on localhost every file arrives before the first paint, so every script counts
  against LCP (e.g. /speaking: 85 locally vs 90 on Netlify with older, heavier code).
- To measure a branch without touching production: a **draft deploy** from this machine,
  `netlify deploy --build --alias lighthouse-preview` (never `--prod`), using `NETLIFY_AUTH_TOKEN`
  and `NETLIFY_SITE_ID` from `.env.local`. URL: `https://lighthouse-preview--tonygreenberg-website.netlify.app`.
  Netlify only builds previews for pull requests, not for plain branches.
- Never run `pnpm build` while `netlify deploy --build` is running: both write `.next/` in this
  folder. Doing that once corrupted both builds and filled the disk (ENOSPC). `.next/dev` (from
  `pnpm dev`) and `.next/cache/turbopack` regrow to several GB; both are safe to delete.
- `.netlify/` (local Netlify build output and plugins, ~24k files) is in `.gitignore`. It was
  committed by mistake once (commit 9faa012d on `audit-lighthouse-2026-10-06`; removed in the next
  commit), so squash-merge that branch.

## What was slowing pages (and the fixes)

- **Image resizing on Netlify:** `/_next/image` resized each image on its first request (a 35 KB
  hero took 2 s). Fixed with a site-wide loader (`src/lib/images/image-loader.ts`,
  `images.loaderFile` in `next.config.ts`) that asks Sanity's (and Unsplash's) CDN for the exact
  width. Any new image host needs a branch in that loader.
- **Script on every page:** the search window (with the 39 KB page index), the phone menu and the
  toaster now load on first use (`next/dynamic`, `ssr: false`; `site-header.tsx`,
  `site-mobile-menu.tsx`, `lazy-toaster.tsx`).
- **Homepage freeze (600 ms blocking time on Netlify):** big blurred shapes animating forever under
  a full-size `backdrop-blur` layer (recomputed every frame), and frosted cards over the rotating
  BrewSoul aurora. Removed the invisible 1px backdrop blur and the card frosting, gave the animated
  shapes `will-change-transform`, and stopped all of them for `prefers-reduced-motion`.
  Rule of thumb: never put `backdrop-blur` over something that animates.
- **Not code:** Netlify's response time (0.8 to 1.5 s even on a cache hit, "Netlify Durable" hit
  but edge miss) is a large part of LCP and can't be fixed in the app.
