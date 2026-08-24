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
