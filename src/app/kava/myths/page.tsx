import type { Metadata } from "next";
import { KavaDisclaimer, KavaDivider, KavaHero, KavaSection } from "@/components/kava/kava-ui";
import { MythsExplorer } from "@/components/kava/myths-explorer";

// Ported from legacy client/src/pages/kava/KavaMyths.tsx — real 7-myth
// evidence review and the real closing takeaway paragraph, unchanged.
// Expand/collapse interactivity in `components/kava/myths-explorer.tsx`.
export const metadata: Metadata = {
  title: "Kava Myths — Fact vs. Fiction",
  description:
    "Seven persistent myths about kava's liver safety, addiction potential, and effects, examined against the evidence.",
  alternates: { canonical: "/kava/myths" },
};

export default function KavaMythsPage() {
  return (
    <>
      <KavaHero
        eyebrow="Module 7"
        title="Myths Debunked"
        subtitle="Seven persistent myths about kava examined against the evidence. Each verdict is grounded in WHO data, peer-reviewed research, and 3,000 years of traditional use."
      />

      <KavaSection>
        <MythsExplorer />
      </KavaSection>

      <KavaDivider />

      <KavaSection bg="sand">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-heading text-xl leading-[1.6] font-medium text-kava-ink md:text-2xl">
            The pattern is consistent: nearly every kava safety concern traces back to non-noble
            cultivars, ethanolic extracts, or mixing with contraindicated substances. Traditional
            aqueous noble kava — the PRI standard — has a 3,000-year safety record that no
            pharmaceutical on earth can match.
          </p>
        </div>
      </KavaSection>

      <div className="px-5 pb-12">
        <div className="mx-auto max-w-5xl">
          <KavaDisclaimer />
        </div>
      </div>
    </>
  );
}
