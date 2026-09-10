import type { Metadata } from "next";
import { sanityFetch } from "@/lib/content/legacy-content-query-adapter";
import { allPostsForArchiveQuery } from "@/lib/content/legacy-content-query-tokens";
import {
  ImpactFuturismExplorer,
  type FuturismPost,
} from "@/components/blog/impact-futurism-explorer";

// Ported from legacy client/src/pages/ImpactFuturism.tsx — a curated
// category page pointing to 7 real essays across health systems, AI &
// energy, psychedelic medicine, infrastructure, and trust/verification.
// Curated tag + teaser copy lives in lib/content/impact-futurism.ts; real
// title/date/hero-image/read-time now come live from Sanity instead of
// being duplicated in that module. Legacy's per-article hero images
// (`/manus-storage/...`, one dead CloudFront URL) are dropped in favor of
// each real post's own Sanity heroImage — Zero-Manus-dependency rule, and a
// real image already exists per post so nothing needed rescuing. Both
// "Get the Dispatch" CTAs pointed to `/subscribe` (Stripe-backed, deferred
// to the billing-migration phase) — replaced with `/blog`, same fix already
// applied on `/articles`. The "All 121 Essays" count is now live
// (`posts.length`) instead of legacy's stale hardcoded number.
export const metadata: Metadata = {
  title: "Impact Futurism",
  description:
    "Essays on broken systems and what comes next. Health, AI, energy, psychedelic medicine, trust, and the infrastructure of the future. By Tony Greenberg.",
  alternates: { canonical: "/impact-futurism" },
};

export default async function ImpactFuturismPage() {
  const posts = await sanityFetch<FuturismPost[]>({
    query: allPostsForArchiveQuery,
    tags: ["post"],
  });

  return <ImpactFuturismExplorer posts={posts} />;
}
