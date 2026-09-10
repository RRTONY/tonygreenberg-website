import type { Metadata } from "next";
import {
  KavaHero,
  KavaSection,
  KavaSectionTitle,
  KavaDivider,
  KavaDisclaimer,
} from "@/components/kava/kava-ui";
import { InteractionsExplorer, CypProfile } from "@/components/kava/interactions-explorer";

// Ported from legacy client/src/pages/kava/KavaInteractions.tsx — real
// 24-substance drug interaction database and real 5-enzyme CYP450
// inhibition profile, all ported unchanged and verbatim. Search +
// severity-filter interactivity in
// `components/kava/interactions-explorer.tsx`.
export const metadata: Metadata = {
  title: "Kava Drug Interactions — Safety Guide",
  description:
    "A comprehensive guide to kava's interactions with medications, supplements, and substances.",
  alternates: { canonical: "/kava/interactions" },
};

export default function KavaInteractionsPage() {
  return (
    <>
      <KavaHero
        eyebrow="Module 3"
        title="Drug Interaction Checker"
        subtitle="Screen 24 substances against kava's CYP450 inhibition profile. Color-coded severity matrix with mechanism explanations and PRI protocol notes."
      />

      <KavaSection>
        <InteractionsExplorer />
      </KavaSection>

      <KavaDivider />

      <KavaSection bg="sand">
        <KavaSectionTitle>CYP450 Enzyme Inhibition Profile</KavaSectionTitle>
        <p className="mb-8 text-base leading-[1.75] text-kava-ink/70">
          Kava&apos;s kavalactone components inhibit five major liver enzymes. This is the primary
          mechanism by which kava interacts with medications.
        </p>
        <CypProfile />
      </KavaSection>

      <div className="px-5 pb-12">
        <div className="mx-auto max-w-5xl">
          <KavaDisclaimer />
        </div>
      </div>
    </>
  );
}
