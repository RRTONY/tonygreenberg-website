import type { Metadata } from "next";
import {
  KavaHero,
  KavaSection,
  KavaSectionTitle,
  KavaCard,
  KavaDivider,
  KavaDisclaimer,
} from "@/components/kava/kava-ui";
import { ChemotypeDecoder } from "@/components/kava/chemotype-decoder";
import { KAVALACTONES, COMBINED_PROFILE } from "@/lib/content/kava-science";

// Ported from legacy client/src/pages/kava/KavaScience.tsx — real 6
// major kavalactones (real mechanisms, real PRI relevance), the real
// chemotype decoder tool, and the real 11-item combined pharmacological
// profile, all ported unchanged and verbatim. Decoder interactivity in
// `components/kava/chemotype-decoder.tsx`.
export const metadata: Metadata = {
  title: "Kava Science — Kavalactones and Effects",
  description:
    "The complete science of kavalactones, their mechanisms, and what the research actually shows.",
  alternates: { canonical: "/kava/science" },
};

export default function KavaSciencePage() {
  return (
    <>
      <KavaHero
        eyebrow="Module 4"
        title="Kavalactone Science"
        subtitle="The 6 major kavalactones — their mechanisms, receptor targets, and PRI relevance. Plus a chemotype decoder for cultivar analysis."
      />

      <KavaSection>
        <KavaSectionTitle>The 6 Major Kavalactones</KavaSectionTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {KAVALACTONES.map((kl) => (
            <KavaCard key={kl.num}>
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex size-10 items-center justify-center rounded-full text-lg font-bold text-white"
                  style={{ backgroundColor: kl.colorHex }}
                >
                  {kl.num}
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-kava-ink">{kl.name}</h3>
                  <p className="text-xs font-bold" style={{ color: kl.colorHex }}>
                    {kl.abbrev}
                  </p>
                </div>
              </div>
              <div className="mb-3 space-y-1">
                {kl.mechanisms.map((m) => (
                  <div key={m} className="flex gap-2">
                    <div
                      className="mt-2 size-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: kl.colorHex }}
                    />
                    <p className="text-sm leading-[1.75] text-kava-ink">{m}</p>
                  </div>
                ))}
              </div>
              <div
                className="rounded-lg p-3"
                style={{
                  backgroundColor: `${kl.colorHex}10`,
                  borderLeft: `3px solid ${kl.colorHex}`,
                }}
              >
                <p
                  className="mb-1 text-xs font-bold tracking-wide uppercase"
                  style={{ color: kl.colorHex }}
                >
                  PRI Relevance
                </p>
                <p className="text-sm leading-[1.75] text-kava-ink">{kl.priRelevance}</p>
              </div>
            </KavaCard>
          ))}
        </div>
      </KavaSection>

      <KavaDivider />

      <KavaSection bg="sand">
        <KavaSectionTitle>Chemotype Decoder</KavaSectionTitle>
        <p className="mb-6 text-base leading-[1.75] text-kava-ink/70">
          Enter a chemotype string (e.g. 4-2-6-5-3-1) to see which kavalactones dominate and their
          effect profile. The first number indicates the dominant kavalactone.
        </p>
        <ChemotypeDecoder />
      </KavaSection>

      <KavaDivider />

      <KavaSection>
        <KavaSectionTitle>Complete Pharmacological Profile (All 6 Combined)</KavaSectionTitle>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {COMBINED_PROFILE.map((item) => (
            <div
              key={item}
              className="flex gap-3 rounded-lg border border-kava-sand-muted bg-white p-3"
            >
              <div className="mt-2 size-2 shrink-0 rounded-full bg-kava-saffron" />
              <p className="text-sm leading-[1.75] text-kava-ink">{item}</p>
            </div>
          ))}
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
