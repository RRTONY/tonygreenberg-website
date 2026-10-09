import type { Metadata } from "next";
import { EcosystemMap } from "@/components/assessments/ecosystem-map";

// Ported from legacy client/src/pages/EcosystemMap.tsx — the six-phase map
// through the "Find Your Me" ecosystem. Phase 4 deferred it because none of
// its assessments existed yet; the journey tracker it depends on
// (JOURNEY_MAP/useJourneyProgress) is now built and shared with /my-journey.
// Metadata is legacy's own SEO title/description, unchanged.
export const metadata: Metadata = {
  title: "The Ecosystem Map",
  description:
    "Tony Greenberg's map of the regenerative economy — companies, people, and movements building what comes after extraction.",
  alternates: { canonical: "/ecosystem-map" },
};

export default function EcosystemMapPage() {
  return <EcosystemMap />;
}
