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
    ],
  },
};

export default nextConfig;
