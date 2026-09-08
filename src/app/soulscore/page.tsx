import type { Metadata } from "next";
import { SoulScoreTool } from "@/components/assessments/soulscore-tool";

// Real metadata written fresh for this page's actual content — see the
// port-note in `soulscore-tool.tsx` for why: legacy's own `<SEO>` block on
// this page described a completely different, unrelated assessment
// ("Soul Score — Alignment Assessment" / values-alignment diagnostic /
// path "/soul-score"), not the real 12-dimension impact measurement
// engine that actually renders here.
export const metadata: Metadata = {
  title: "SoulScore™ — 12-Dimension Impact Measurement Engine",
  description:
    "An interactive impact measurement engine by ImpactSoul. Score consciousness, not just carbon, across 12 weighted dimensions for any entity — benchmark against Fortune 500, B Corp, and Patagonia, explore a 6-tier supply chain model, and calculate Consciousness-Adjusted NPV in real time.",
  alternates: { canonical: "/soulscore" },
  openGraph: {
    title: "SoulScore™ — 12-Dimension Impact Measurement Engine",
    description:
      "Score consciousness, not just carbon. An interactive 12-dimension impact measurement engine by ImpactSoul — any entity, real-time.",
    url: "/soulscore",
  },
};

export default function SoulScorePage() {
  return <SoulScoreTool />;
}
