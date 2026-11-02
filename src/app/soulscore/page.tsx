import type { Metadata } from "next";
import { SoulScoreTool } from "@/components/assessments/soulscore-tool";
import { defaultOpenGraph, seoMetadata } from "@/lib/seo-defaults";

// Real metadata written fresh for this page's actual content — see the
// port-note in `soulscore-tool.tsx` for why: legacy's own `<SEO>` block on
// this page described a completely different, unrelated assessment
// ("Soul Score — Alignment Assessment" / values-alignment diagnostic /
// path "/soul-score"), not the real 12-dimension impact measurement
// engine that actually renders here.
export const metadata: Metadata = seoMetadata({
  title: "SoulScore™ — 12-Dimension Impact Measurement Engine",
  description:
    "ImpactSoul's impact engine: score consciousness, not just carbon, across 12 dimensions and benchmark against the Fortune 500, B Corps and Patagonia.",
  alternates: { canonical: "/soulscore" },
  openGraph: {
    ...defaultOpenGraph,
    title: "SoulScore™ — 12-Dimension Impact Measurement Engine",
    description:
      "Score consciousness, not just carbon. An interactive 12-dimension impact measurement engine by ImpactSoul — any entity, real-time.",
    url: "/soulscore",
    type: "website",
    siteName: "Tony Greenberg",
  },
});

export default function SoulScorePage() {
  return <SoulScoreTool />;
}
