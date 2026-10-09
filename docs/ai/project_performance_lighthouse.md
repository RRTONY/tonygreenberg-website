# Performance and Lighthouse (2026-10-08, updated 2026-10-09)

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
- **Supabase on every request:** `proxy.ts` called `supabase.auth.getUser()` for every page view,
  signed in or not. Now it only does that when an `sb-...-auth-token` cookie exists.
- **Homepage rendered per request:** the returning-visitor strip read cookies on the server, which
  made `/` dynamic. It now reads them in the browser, so `/` is pre-built again. Keep shared
  layout/home code free of `cookies()`/`headers()`.
- **Where you test from matters:** from India a plain static file on Netlify takes ~1 s to start
  arriving (0.25 s just to connect), and Lighthouse folds that into LCP. Google's PageSpeed
  (pagespeed.web.dev, US servers) is the fairer number; its API needs `GOOGLE_API_KEY` (the free
  shared quota is usually exhausted).
- **Not code:** Netlify's response time (0.8 to 1.5 s even on a cache hit, "Netlify Durable" hit
  but edge miss) is a large part of LCP and can't be fixed in the app.

## 2026-10-09: what's left and what was done

Measured with Lighthouse 12.8 (mobile, from India) on Netlify `main` vs a draft of
`perf-2026-10-09`, alternating runs. On these pages LCP is **not** waiting for the hero image (it
arrives in ~0.2 s): it is "element render delay" (1.2 to 1.6 s), because Lighthouse's simulated slow
phone must first download the ~64 KB (gzip) stylesheet and ~230 KB of scripts requested before it.

- **Homepage HTML 80 KB to 44 KB (gzip), `/blog` to 23 KB:** every post (123) was serialized into
  the page twice, for the archive's search and for Recent Updates. Now Recent Updates gets only the
  posts its pills can show (`pickRecentUpdatePosts`), and the archive gets the first 12 plus counts;
  the full list is `/essays-archive.json` (static, refreshed like the pages), fetched on pointer,
  focus or use of the archive controls. Browser-tested: search, category filters and Show all give
  the same results as before; no fetch for readers who only scroll.
- **~15 KB of script off every page:** the root layout wrapped everything in Radix's
  `TooltipProvider`, but no component renders a tooltip. Removed with `ui/tooltip.tsx`.
- **Unused shadcn files deleted** (alert, aspect-ratio, checkbox, hover-card, progress,
  radio-group, scroll-area, separator, slider, switch, toggle, toggle-group, tooltip): ~24 KB raw
  of CSS that Tailwind generated from them.
- **Results (score before to after, single runs):** `/` 80 to 86, `/psychedelic-readiness-index`
  81 to 87, `/peptide-hall-of-shame` 80 to 95, `/impact-dashboard` 89 to 90, `/blog` 86 to 87,
  `/iboga-ibogaine` 89 to 89, `/brewsoul/browse` unchanged (four runs ranged 83 to 90 with the
  server wait; same-wait runs 85 vs 86). Run-to-run noise from here is about +/-5.

**Not done, on purpose: splitting the stylesheet per section.** Each page uses only ~10% of the
500 KB (raw) stylesheet, but Tailwind utilities from two stylesheets override each other by load
order: a shared class re-emitted in a section sheet loaded later beats a responsive variant from the
main sheet (e.g. `text-sm` overriding `md:text-base`), and stylesheets loaded on client navigation
are never removed. That is a silent, site-wide styling bug class; not worth ~0.3 s. Also not
usable: `experimental.inlineCss` (would copy the whole stylesheet into every page, twice).

**Tooling that worked:** `pnpm next experimental-analyze --output` writes per-route module data
to `.next/diagnostics/analyze/data/<route>/analyze.data` (4-byte length + JSON header: `sources`,
`chunk_parts` with gzip sizes, `output_files`); it builds separately, so its chunk names don't match
`pnpm build`'s. Lighthouse CLI and Playwright are in the npx cache (`~/.npm/_npx/*/node_modules`).
Google's PageSpeed API (US servers) still needs `GOOGLE_API_KEY`: the shared quota is exhausted.
