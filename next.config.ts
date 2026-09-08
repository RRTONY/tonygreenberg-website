import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Legacy registers "/find-my-tribe" as a second path to the same
      // Community component — same duplicate-route pattern as /blog above.
      { source: "/find-my-tribe", destination: "/community", permanent: true },
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
      // /supplier-intake and /supplier-intake-long/:token were real lead
      // capture forms backed by a tRPC vendor-onboarding flow
      // (submitStage1/submitStage2, token-gated file uploads) that no
      // longer exists — the Manus backend it ran on is fully dead. 5
      // already-ported pages ("Become a Supply Partner") link to
      // /supplier-intake, so leaving it 404 breaks real, live CTAs.
      // BioChainCTA already established the real replacement: RampRate's
      // own live supplier intake at ramprate.com/biochain (confirmed
      // reachable) — redirecting here instead of rebuilding a form whose
      // only working backend doesn't exist anymore.
      {
        source: "/supplier-intake",
        destination: "https://ramprate.com/biochain/supplier-intake",
        permanent: true,
      },
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
      { source: "/the-index", destination: "/search", permanent: true },
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
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      // RampRate's own S3-backed CDN (STATUS.md: storage already migrated
      // off Manus to AWS S3). Not a Manus domain — safe to keep. Any image
      // still resolving to *.manuscdn.com must be re-uploaded to Sanity
      // before its page is ported, not proxied through Manus.
      { protocol: "https", hostname: "d2xsxph8kpxj0f.cloudfront.net" },
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
