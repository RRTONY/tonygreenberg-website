import type { NextConfig } from "next";
import { LEGACY_POST_REDIRECTS } from "./src/lib/content/legacy-post-redirects";
import { SEARCH_CONSOLE_REDIRECTS } from "./src/lib/content/search-console-redirects";

const nextConfig: NextConfig = {
  // The MCP server's check_code_quality tool (and the review's own lint of a
  // change's files) runs ESLint programmatically (src/lib/admin/code-check.ts).
  // ESLint resolves some internals through dynamic requires that Next's file
  // tracing doesn't follow, so the deployed function failed with "Cannot find
  // module" (seen on ramprate-ui, same server). code-check.ts imports
  // eslint.config.mjs so tracing follows the config's plugins; bundling them
  // fails, so they stay external node_modules packages, still traced and
  // copied into the function. Ported from ramprate-ui 2026-10-09, minus its
  // outputFileTracingIncludes globs: with pnpm those match linked package
  // folders and Turbopack panics ("Is a directory").
  serverExternalPackages: ["eslint", "eslint-config-next"],
  // Keep the Netlify copies (the main *.netlify.app URL and every deploy
  // preview) out of search results so Google doesn't index a duplicate of
  // tonygreenberg.com. Host-based, so the real domain stays indexable after
  // DNS cutover with no change here. Added 2026-10-01 (Phase 12/14 noindex).
  async headers() {
    return [
      // Baseline security headers on every page. The CSP is deliberately not a
      // script allowlist: a strict, XSS-proof CSP needs a per-request nonce,
      // which makes every page dynamic (no static HTML, no CDN cache; see
      // node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md),
      // or Next's experimental SRI. These directives still block plugin
      // content, clickjacking by other sites and <base> hijacking, with no
      // effect on static rendering. Added 2026-10-06.
      // No `upgrade-insecure-requests`: the site is HTTPS-only already (HSTS),
      // and Safari applied it to http://localhost too, so every stylesheet
      // and font failed in local testing.
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "object-src 'none'; base-uri 'self'; frame-ancestors 'self'",
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
        ],
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "(?<host>.+)\\.netlify\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  async redirects() {
    return [
      // Old WordPress-era post addresses → the post (see legacy-post-redirects.ts).
      ...LEGACY_POST_REDIRECTS.map(([source, slug]) => ({
        source,
        destination: `/blog/${slug}`,
        permanent: true,
      })),
      // Category pages used ?page=N until 2026-10-09; now /page/N, so each page is
      // pre-built (src/components/blog/category-listing.tsx). Pages 2+ only:
      // ?page=1 just shows page 1, and /page/1 goes back to the plain address.
      {
        source: "/blog/category/:slug",
        has: [{ type: "query", key: "page", value: "(?<n>[2-9]|[1-9]\\d+)" }],
        destination: "/blog/category/:slug/page/:n",
        permanent: true,
      },
      { source: "/blog/category/:slug/page/1", destination: "/blog/category/:slug", permanent: true },
      // Old addresses Google still sends visitors to (see search-console-redirects.ts).
      ...SEARCH_CONSOLE_REDIRECTS.map(([source, destination]) => ({ source, destination, permanent: true })),
      // Legacy registers "/find-my-tribe" as a second path to the same
      // Community component — same duplicate-route pattern as /blog above.
      { source: "/find-my-tribe", destination: "/community", permanent: true },
      // Live-only (not in `_legacy-manus-app/`): live sends /connect to the
      // homepage (checked 2026-10-01).
      { source: "/connect", destination: "/", permanent: true },
      // Legacy did this exact redirect client-side via
      // `window.location.replace("/living-declaration")` — a real 308 is
      // strictly better (works without JS, no flash of the old route).
      {
        source: "/manifesto",
        destination: "/living-declaration",
        permanent: true,
      },
      // Legacy did this client-side via `window.location.replace(...)` (a
      // flash-of-loading-text redirect to the separate Flow Circuit app,
      // confirmed live). A real 308 is strictly better — no JS required,
      // no flash.
      {
        source: "/flow-circuit",
        destination: "https://flow.tonygreenberg.com",
        permanent: true,
      },
      // /supplier-intake is a real page again (2026-10-07, matching live's
      // Stage 1 form; it posts to the same Google Apps Script intake as
      // RampRate's own form). Legacy's token-gated Stage 2 pages and the old
      // "vendor-intake" names still go to RampRate's live intake.
      {
        source: "/supplier-intake-long/:token",
        destination: "https://ramprate.com/biochain/supplier-intake",
        permanent: true,
      },
      // Legacy's own bare (no-token) path plus its "vendor-intake" naming
      // era, both of which it client-side redirected to the same
      // supplier-intake destination this repo already redirects to above.
      { source: "/supplier-intake-long", destination: "https://ramprate.com/biochain/supplier-intake", permanent: true },
      { source: "/vendor-intake", destination: "https://ramprate.com/biochain/supplier-intake", permanent: true },
      { source: "/vendor-intake-long", destination: "https://ramprate.com/biochain/supplier-intake", permanent: true },
      { source: "/vendor-intake-long/:token", destination: "https://ramprate.com/biochain/supplier-intake", permanent: true },
      // Legacy's 5 pre-consolidation Attention Theft sub-pages, now merged
      // into one mega-page at /attention-theft (see NEXTJS-MIGRATION-TODO.md
      // Phase 8) — redirect each old path to the matching in-page anchor
      // instead of resurrecting the sub-pages. Legacy registered BOTH a
      // bare path and a /attention-theft/-nested path for each of these 4
      // (not /economics, which only ever had the nested form) — same
      // duplicate-route pattern as /find-my-tribe elsewhere in this file.
      { source: "/attention-theft/economics", destination: "/attention-theft#heresy", permanent: true },
      { source: "/blocker-finder", destination: "/attention-theft#blocker-finder", permanent: true },
      { source: "/attention-theft/blocker-finder", destination: "/attention-theft#blocker-finder", permanent: true },
      { source: "/legal", destination: "/attention-theft#legal", permanent: true },
      { source: "/attention-theft/legal", destination: "/attention-theft#legal", permanent: true },
      { source: "/weapons", destination: "/attention-theft#weapons", permanent: true },
      { source: "/attention-theft/weapons", destination: "/attention-theft#weapons", permanent: true },
      { source: "/report", destination: "/attention-theft#report", permanent: true },
      { source: "/attention-theft/report", destination: "/attention-theft#report", permanent: true },
      // Legacy registers "/find-my-movement" as a second path to the same
      // FindYourMovement component — same duplicate-route pattern as
      // /find-my-tribe above.
      { source: "/find-my-movement", destination: "/find-your-movement", permanent: true },
      { source: "/find-my-diet", destination: "/find-your-diet", permanent: true },
      { source: "/find-my-sleep", destination: "/find-your-sleep", permanent: true },
      { source: "/find-my-attachment-style", destination: "/find-your-attachment-style", permanent: true },
      { source: "/find-my-we", destination: "/find-your-attachment-style", permanent: true },
      { source: "/find-my-sexuality", destination: "/find-your-sexuality", permanent: true },
      { source: "/find-my-spirit", destination: "/find-your-spirit", permanent: true },
      { source: "/find-my-peptide", destination: "/find-your-peptide", permanent: true },
      { source: "/find-my-coffee", destination: "/find-your-coffee", permanent: true },
      { source: "/find-my-therapy", destination: "/find-your-therapy", permanent: true },
      // Legacy also served /find-your-me at /find-my-me and /discover —
      // same duplicate-route pattern as /find-my-tribe above.
      { source: "/find-my-me", destination: "/find-your-me", permanent: true },
      { source: "/discover", destination: "/find-your-me", permanent: true },
      // Phase 9's back half: these 3 assessments were referenced
      // elsewhere in this app (site nav, journey-tracker.tsx,
      // find-your-me.ts's ecosystem directory) under an /assessments/
      // prefix before the real pages existed — the pages themselves
      // landed at the shorter top-level path, matching every other
      // "Find Your X" route's shape. Redirect rather than rename every
      // existing internal reference.
      { source: "/assessments/dharma-finder", destination: "/dharma-finder", permanent: true },
      { source: "/assessments/consciousness-scale", destination: "/consciousness-scale", permanent: true },
      { source: "/assessments/grant-study", destination: "/grant-study", permanent: true },
      // Legacy did this exact redirect client-side via
      // `window.location.replace("/find-my")` (both times it registered
      // the route — a real 308 is strictly better, works with no JS.
      { source: "/find-my-car", destination: "/find-my", permanent: true },
      // TheIndex.tsx (legacy's real, substantial human-readable site index
      // — 503 lines, not a stub) was never ported to this migration; every
      // other page's own dead link to it was already repointed to /search
      // instead (see e.g. app/series/page.tsx's port note) — this
      // redirect makes the URL itself consistent with that same choice.
      // A real dedicated index page is a legitimate future content gap,
      // not silently equivalent to /search — tracked in Phase 12's own
      // TODO note, not solved by this redirect alone.
      // /spamtoast and /youve-been-reported are the live half of legacy's
      // "report a spammer" confrontation flow — the same feature whose
      // other half (ReportSpammer.tsx) this migration already decided not
      // to port (see this file's Phase 4 "Drop dead code" line). Neither
      // was ever a page meant for organic discovery (both only make sense
      // with ?company=/?domain=/?email= query params from a targeted
      // link), so redirecting to the homepage rather than rebuilding a
      // real-IP-fingerprinting confrontation page.
      { source: "/spamtoast", destination: "/", permanent: true },
      { source: "/youve-been-reported", destination: "/", permanent: true },
      // Legacy registered "/cheshire-grin" as a second path to the same
      // CheshireGrin component as "/alex-azzi" (both in App.tsx's
      // STANDALONE_ROUTES, no redirect between them) — same duplicate-route
      // pattern as /find-my-tribe above. This migration picks /alex-azzi as
      // canonical (see src/app/alex-azzi/page.tsx's port note) and
      // redirects the internal-codename URL to it rather than shipping the
      // same content at two indexable addresses.
      { source: "/cheshire-grin", destination: "/alex-azzi", permanent: true },
      // Live sends this essay's address to its full page, /akbar (done
      // 2026-10-07 to match live; the post stays in Sanity, out of the
      // sitemap, see REDIRECTED_POST_SLUGS in src/app/sitemap.ts).
      { source: "/blog/akbar-cuisine-restoration-economics", destination: "/akbar", permanent: true },
      // Live sends both of these to the homepage (checked 2026-10-07).
      { source: "/seven-doors", destination: "/", permanent: true },
      { source: "/projects", destination: "/", permanent: true },
    ];
  },
  images: {
    // Images are resized by Sanity's (and Unsplash's) own CDN, not /_next/image; see the loader.
    loader: "custom",
    loaderFile: "./src/lib/images/image-loader.ts",
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      // Real, live Unsplash stock photos used as BrewSoul city hero
      // images (see lib/content/brewsoul-cities.ts) — not a dead Manus
      // proxy, but also not yet uploaded to Sanity per this repo's own
      // image-hosting convention. Tracked as a follow-up in
      // NEXTJS-MIGRATION-TODO.md rather than blocking the port on a
      // 25-photo Sanity migration.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
