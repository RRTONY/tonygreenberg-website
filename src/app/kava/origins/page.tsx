import type { Metadata } from "next";
import { KavaHero, KavaSection, KavaSectionTitle, KavaCard, KavaDisclaimer } from "@/components/kava/kava-ui";
import { OriginsExplorer } from "@/components/kava/origins-explorer";

// Ported from legacy client/src/pages/kava/KavaOrigins.tsx — real
// migration timeline and real 6-island selector (Vanuatu/Fiji/Tonga/
// Samoa/Hawaii/Pohnpei, each with real facts/ceremony/cultivar/safety
// content) and the real Noble vs. Tudei safety comparison, all ported
// unchanged and verbatim. Island-selector interactivity in
// `components/kava/origins-explorer.tsx`.
export const metadata: Metadata = {
  title: "Kava Origins — Pacific Island Traditions",
  description: "The cultural and botanical origins of kava across the Pacific Islands.",
  alternates: { canonical: "/kava/origins" },
};

const TIMELINE = [
  { year: "~3000 BCE", place: "Vanuatu", note: "Domestication from wild Piper wichmannii" },
  { year: "~2500 BCE", place: "Fiji", note: "Yaqona becomes national drink" },
  { year: "~2000 BCE", place: "Tonga", note: "Constitutional role in kingship" },
  { year: "~1500 BCE", place: "Samoa", note: "Chiefly 'ava system established" },
  { year: "~1000 BCE", place: "Pohnpei", note: "Sakau tradition develops independently" },
  { year: "~1000 CE", place: "Hawaii", note: "'Awa sacred to chiefs and kahunas" },
];

export default function KavaOriginsPage() {
  return (
    <>
      <KavaHero eyebrow="Module 2" title="Island Origins" subtitle="3,000 years of kava culture across the Pacific — from Vanuatu's nakamals to Hawaii's sacred 'awa ceremonies." />

      <KavaSection bg="sand">
        <KavaSectionTitle>Migration Timeline</KavaSectionTitle>
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-kava-saffron/25 md:left-1/2" />
          {TIMELINE.map((t, i) => (
            <div key={t.year} className={`relative mb-8 flex items-start gap-4 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
              <div className="hidden md:block md:w-1/2" />
              <div className="absolute top-1.5 left-4 z-10 size-3 -translate-x-1/2 rounded-full bg-kava-saffron md:left-1/2" />
              <div className="ml-10 md:ml-0 md:w-1/2 md:px-6">
                <p className="text-xs font-bold tracking-wide text-kava-saffron">{t.year}</p>
                <p className="font-heading text-lg font-bold text-kava-ink">{t.place}</p>
                <p className="text-sm leading-[1.75] text-kava-ink/60">{t.note}</p>
              </div>
            </div>
          ))}
        </div>
      </KavaSection>

      <KavaSection>
        <KavaSectionTitle>Explore Each Nation</KavaSectionTitle>
        <OriginsExplorer />
      </KavaSection>

      <KavaSection bg="sand">
        <KavaSectionTitle>Noble vs. Tudei — The Critical Safety Divide</KavaSectionTitle>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <KavaCard>
            <div className="mb-3 flex items-center gap-2">
              <div className="size-3 rounded-full bg-[#16a34a]" />
              <h4 className="font-heading text-lg font-bold text-[#16a34a]">Noble Cultivars</h4>
            </div>
            <div className="space-y-2 text-sm leading-[1.75] text-kava-ink">
              <p>Favorable kavalactone composition with more pleasant effects.</p>
              <p>Lower adverse event potential.</p>
              <p>Used by Polynesians for regular consumption for 3,000 years.</p>
              <p>Spread across all Pacific nations by navigators — for good reason.</p>
              <p className="font-bold text-[#16a34a]">The only appropriate choice for PRI ceremonial use.</p>
            </div>
          </KavaCard>
          <KavaCard>
            <div className="mb-3 flex items-center gap-2">
              <div className="size-3 rounded-full bg-kava-terracotta" />
              <h4 className="font-heading text-lg font-bold text-kava-terracotta">Tudei (Two-Day) Cultivars</h4>
            </div>
            <div className="space-y-2 text-sm leading-[1.75] text-kava-ink">
              <p>Effects last 48 hours — hence the name &ldquo;two-day.&rdquo;</p>
              <p>Adverse event potential significantly higher.</p>
              <p>Linked to European hepatotoxicity crisis of 2002.</p>
              <p>Contains non-noble kavalactones including flavokavain B.</p>
              <p>Limited to Vanuatu and Papua New Guinea origin.</p>
              <p className="font-bold text-kava-terracotta">Never spread by Polynesian navigators — for a reason.</p>
            </div>
          </KavaCard>
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
