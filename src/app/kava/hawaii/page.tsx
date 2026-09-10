import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import {
  KavaBadge,
  KavaCard,
  KavaDivider,
  KavaHero,
  KavaSection,
  KavaSectionTitle,
  KavaDisclaimer,
} from "@/components/kava/kava-ui";

// Ported from legacy client/src/pages/kava/KavaHawaii.tsx — real ICE/meth
// crisis statistics (Quest Diagnostics, Hawaii DOH, law enforcement
// seizure data), real dual crisis/revival timeline (1985-present), the
// real (explicitly-labeled-as-hypothesis, not proven) pharmacological
// alignment table, and real recovery resource listings, all ported
// unchanged and verbatim. Fully static — no interactive state — so this
// stays a plain Server Component, no client island needed.
export const metadata: Metadata = {
  title: "Hawaii, Ice, and the 'Awa Bowl — Kava",
  description:
    "The story of Hawaiian 'awa culture set against the state's methamphetamine crisis, and the pharmacological and cultural case for kava in recovery.",
  alternates: { canonical: "/kava/hawaii" },
};

const CRISIS_STATS = [
  { value: "410%", label: "Above national average workplace meth tests (2010)" },
  { value: "77%", label: "Of Hawaii drug convictions involve meth (vs 26% national)" },
  { value: "60-80%", label: "Of Big Island prosecution cases involve meth" },
  { value: "$500M", label: "Annual economic cost of meth in Hawaii" },
  { value: "3:1", label: "Meth deaths outnumber opioid deaths on Oahu (2017-2021)" },
  { value: "4x", label: "National average for workplace meth use" },
];

const TIMELINE = [
  {
    year: "1985",
    event:
      "Crystal methamphetamine arrives in Hawaii from Southeast Asia. Hawaii is the first US state impacted.",
    type: "crisis" as const,
  },
  {
    year: "1990s",
    event: "Mexican cartels take over distribution from Korean, Thai, and Filipino organizations.",
    type: "crisis" as const,
  },
  {
    year: "2010",
    event: "Quest Diagnostics reports Hawaii workplace meth tests 410% above national average.",
    type: "crisis" as const,
  },
  {
    year: "2013-2015",
    event:
      "Law enforcement seizes nearly 750 pounds of meth (est. $12.5M street value) from a state of 1.4M people.",
    type: "crisis" as const,
  },
  {
    year: "2017-2021",
    event:
      "Meth remains leading cause of fatal drug overdoses in Hawaii, outnumbering opioids 3-to-1 on Oahu.",
    type: "crisis" as const,
  },
  {
    year: "2020s",
    event:
      "Three generations of meth users documented in Hawaii communities. No FDA-approved medication exists for meth addiction.",
    type: "crisis" as const,
  },
  {
    year: "Ongoing",
    event:
      "'Awa cultural revival: commercial kava bars statewide, seven days a week. GRAS status granted 2024.",
    type: "revival" as const,
  },
];

const PHARMACOLOGICAL_ALIGNMENT = [
  { damage: "Depleted dopamine", kavaResponse: "Desmethoxyyangonin increases dopamine" },
  { damage: "Elevated cortisol", kavaResponse: "GABAergic anxiolysis from dihydrokavain" },
  { damage: "Fractured sleep", kavaResponse: "Pro-sleep architecture support" },
  {
    damage: "Persistent anxiety and paranoia",
    kavaResponse: "Serotonin modulation from methysticin and DHM",
  },
];

const RESOURCES = [
  {
    name: "Hawaii Health and Harm Reduction Center (HHHRC)",
    desc: "Comprehensive harm reduction services",
  },
  { name: "End Meth Coalition", desc: "Community-based meth prevention and education" },
  { name: "Hawaii Pacific Health", desc: "Healthcare system with addiction treatment programs" },
  { name: "Big Island Recovery Programs", desc: "Island-specific recovery and treatment services" },
  { name: "Oahu Recovery Programs", desc: "Urban recovery services and community support" },
  { name: "Local 'Awa Ceremony Facilitators", desc: "Traditional Hawaiian 'awa practitioners" },
];

export default function KavaHawaiiPage() {
  return (
    <>
      <KavaHero
        eyebrow="Module 6"
        title="Hawaii, ICE, and the 'Awa Bowl"
        subtitle="The state with the worst meth crisis in the nation is simultaneously the state with the deepest indigenous kava tradition. That is not a coincidence."
      />

      <KavaSection>
        <div className="flex items-start gap-4 rounded-xl border-2 border-[#dc2626] bg-[#dc2626]/8 p-5">
          <AlertTriangle size={28} className="mt-0.5 shrink-0 text-[#dc2626]" />
          <div>
            <p className="mb-2 text-base font-bold text-[#dc2626]">CRITICAL SAFETY WARNING</p>
            <p className="text-sm leading-[1.75] text-kava-ink">
              Kava must NEVER be used concurrently with methamphetamine or during acute meth
              intoxication. The combination creates unpredictable cardiac and neurological risk. Any
              harm reduction application involves kava in the recovery period only — minimum 48 to
              72 hours after last meth use — and only under trained community facilitator oversight.
            </p>
          </div>
        </div>
      </KavaSection>

      <KavaSection bg="sand">
        <KavaSectionTitle>The ICE Crisis — By the Numbers</KavaSectionTitle>
        <p className="mb-6 text-base leading-[1.75] text-kava-ink/70">
          Crystal methamphetamine first arrived in Hawaii from Southeast Asia in 1985. Hawaii was
          the first US state to be impacted. As Judge Edward Kubo of Hawaii stated:
        </p>
        <blockquote className="mb-8 border-l-3 border-kava-terracotta pl-4 font-heading text-xl leading-[1.5] font-medium text-kava-terracotta">
          &ldquo;We are not proud of it. But crystal methamphetamine is our gift to the nation. It
          started here.&rdquo;
        </blockquote>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {CRISIS_STATS.map((s) => (
            <KavaCard key={s.label}>
              <p className="mb-1 font-heading text-2xl font-bold text-kava-terracotta">{s.value}</p>
              <p className="text-sm leading-[1.75] text-kava-ink/60">{s.label}</p>
            </KavaCard>
          ))}
        </div>
      </KavaSection>

      <KavaSection>
        <KavaSectionTitle>Dual Timeline: Crisis and Revival</KavaSectionTitle>
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-kava-sand-muted" />
          {TIMELINE.map((t) => (
            <div key={t.year} className="relative mb-6 flex items-start gap-4">
              <div
                className={`z-10 mt-1.5 ml-2.5 size-3 shrink-0 rounded-full ${t.type === "crisis" ? "bg-kava-terracotta" : "bg-[#16a34a]"}`}
              />
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm font-bold text-kava-ink">{t.year}</span>
                  <KavaBadge color={t.type === "crisis" ? "terracotta" : "green"}>
                    {t.type === "crisis" ? "ICE" : "'Awa Revival"}
                  </KavaBadge>
                </div>
                <p className="text-sm leading-[1.75] text-kava-ink/80">{t.event}</p>
              </div>
            </div>
          ))}
        </div>
      </KavaSection>

      <KavaDivider />

      <KavaSection bg="sand">
        <KavaSectionTitle>Pharmacological Alignment</KavaSectionTitle>
        <p className="mb-6 text-base leading-[1.75] text-kava-ink/70">
          Kava&apos;s kavalactone profile addresses the exact neurological damage signature of a
          meth comedown. This is a research hypothesis — not proven — but the pharmacological
          alignment is real and deserves formal clinical investigation.
        </p>
        <div className="space-y-3">
          {PHARMACOLOGICAL_ALIGNMENT.map((a) => (
            <div key={a.damage} className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-lg border-l-3 border-kava-terracotta bg-kava-terracotta/10 p-4">
                <p className="mb-1 text-xs font-bold tracking-wide text-kava-terracotta uppercase">
                  Meth Damage
                </p>
                <p className="text-sm font-medium text-kava-ink">{a.damage}</p>
              </div>
              <div className="rounded-lg border-l-3 border-[#16a34a] bg-[#16a34a]/10 p-4">
                <p className="mb-1 text-xs font-bold tracking-wide text-[#16a34a] uppercase">
                  Kava Response
                </p>
                <p className="text-sm font-medium text-kava-ink">{a.kavaResponse}</p>
              </div>
            </div>
          ))}
        </div>
      </KavaSection>

      <KavaSection>
        <KavaSectionTitle>The Cultural Argument</KavaSectionTitle>
        <blockquote className="mb-6 font-heading text-xl leading-[1.5] font-medium text-kava-ink md:text-2xl">
          The deepest argument for kava in Hawaii&apos;s recovery landscape is not pharmacological —
          it is cultural. When a native Hawaiian participates in &apos;awa ceremony, they are not
          just drinking a plant. They are accessing their ancestry, their identity, their
          sovereignty. For a population three generations into meth&apos;s destruction, the
          &apos;awa bowl is a way home.
        </blockquote>
        <p className="text-base leading-[1.75] text-kava-ink/70">
          Preliminary research suggests kava may reduce the craving associated with addiction.
          Participants reported reduction in their desire for their drug of choice. If the findings
          are confirmed, kava may be a useful component to the treatment of addictions, especially
          for Native Hawaiian and Pacific peoples.
        </p>
      </KavaSection>

      <KavaSection bg="sand">
        <KavaSectionTitle>Recovery Resources</KavaSectionTitle>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {RESOURCES.map((r) => (
            <KavaCard key={r.name}>
              <h4 className="mb-1 font-heading text-base font-bold text-kava-ink">{r.name}</h4>
              <p className="text-sm text-kava-ink/60">{r.desc}</p>
            </KavaCard>
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
