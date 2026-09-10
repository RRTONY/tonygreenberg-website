import type { Metadata } from "next";
import {
  KavaCard,
  KavaDisclaimer,
  KavaDivider,
  KavaHero,
  KavaSection,
  KavaSectionTitle,
} from "@/components/kava/kava-ui";

// Ported from legacy client/src/pages/kava/KavaCaffeine.tsx — real CYP1A2
// inhibition mechanism (56%), real caffeine cutoff protocol, and the real
// kava-vs-coffee comparison table, all ported unchanged and verbatim.
// Fully static — no interactive state — so this stays a plain Server
// Component.
export const metadata: Metadata = {
  title: "Kava and Caffeine Interactions",
  description:
    "How kava's CYP1A2 inhibition affects caffeine metabolism, a caffeine cutoff protocol for ceremony, and kava vs. coffee compared head to head.",
  alternates: { canonical: "/kava/caffeine" },
};

const COMPARISON = [
  {
    aspect: "Primary mechanism",
    coffee: "Adenosine receptor antagonism",
    kava: "GABA-A potentiation + MAO-B inhibition",
  },
  {
    aspect: "Consciousness effect",
    coffee: "Heightened alertness and stimulation",
    kava: "Calm presence with reason fully preserved",
  },
  {
    aspect: "Social effect",
    coffee: "Can increase anxiety in social settings",
    kava: "Prosocial bonding without cognitive impairment",
  },
  {
    aspect: "Sleep impact",
    coffee: "Disruptive — 5-hour half-life",
    kava: "Improves deep sleep architecture",
  },
  {
    aspect: "Addiction profile",
    coffee: "Habit-forming with withdrawal headaches",
    kava: "Non-addictive with reverse tolerance",
  },
  {
    aspect: "Stomach",
    coffee: "Highly acidic, digestive issues for many",
    kava: "Gentle on the stomach",
  },
  {
    aspect: "When combined",
    coffee: "Caffeine potentiated 56%+",
    kava: "Separate by 4 hours minimum; sensitive individuals 6 hours",
  },
];

const PROTOCOL = [
  {
    time: "Morning of ceremony",
    rule: "Normal coffee or tea is acceptable — ceremony is in the evening; CYP1A2 inhibition from prior kava sessions typically clears within 24 to 48 hours.",
  },
  {
    time: "4+ hours before kava",
    rule: "Stop all caffeine — coffee, tea, energy drinks, pre-workout supplements, soda.",
  },
  { time: "Caffeine-sensitive participants", rule: "Extend cutoff to 6 hours." },
  {
    time: "During ceremony",
    rule: "Water only alongside kava shells; non-caffeinated herbal teas (hibiscus, chamomile, rooibos) are acceptable.",
  },
  {
    time: "Post-ceremony",
    rule: "Kava supports deep sleep architecture; zero late caffeine is critical for Oura Ring deep sleep optimization the night before a journey.",
  },
];

export default function KavaCaffeinePage() {
  return (
    <>
      <KavaHero
        eyebrow="Module 8"
        title="Caffeine Interactions"
        subtitle="Kava inhibits CYP1A2 by 56%. That means your coffee metabolizes 56% slower — lasting longer and hitting harder than expected."
      />

      <KavaSection>
        <KavaSectionTitle>The Core Biochemical Mechanism</KavaSectionTitle>
        <div className="mb-6 rounded-xl border-l-4 border-kava-saffron bg-kava-saffron/10 p-6">
          <p className="text-base leading-[1.75] text-kava-ink">
            Kava inhibits the liver enzyme <strong>CYP1A2 by 56%</strong>. CYP1A2 is the primary
            enzyme responsible for metabolizing caffeine. When kava is active in the system,
            caffeine is metabolized 56% slower — making it last longer and accumulate to higher
            blood levels than expected. This is the same mechanism by which grapefruit juice affects
            many medications. Kava&apos;s kavalactone components, rather than other components of
            the extract, are responsible for CYP enzyme inhibition.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <KavaCard>
            <h4 className="mb-2 font-heading text-base font-bold text-kava-saffron">
              The &ldquo;Hippie Speedball&rdquo;
            </h4>
            <p className="text-sm leading-[1.75] text-kava-ink/80">
              Some people enjoy the combination — the kava bar community calls it a &ldquo;hippie
              speedball&rdquo; — experiencing alert relaxation. However, people sensitive to
              caffeine will experience amplified jitters, anxiety, and restlessness that is
              counterproductive to ceremonial readiness.
            </p>
          </KavaCard>
          <KavaCard>
            <h4 className="mb-2 font-heading text-base font-bold text-[#16a34a]">
              Yerba Mate Alternative
            </h4>
            <p className="text-sm leading-[1.75] text-kava-ink/80">
              Community-documented finding: yerba mate pairs better with kava than coffee. Yerba
              mate contains theobromine alongside caffeine; theobromine provides gentler,
              longer-duration energy without the spike-crash and appears to interact more softly
              with the CYP1A2 inhibition dynamic. Not clinically studied but worth tracking.
            </p>
          </KavaCard>
        </div>
      </KavaSection>

      <KavaDivider />

      <KavaSection bg="sand">
        <KavaSectionTitle>Caffeine Cutoff Protocol for Threshold Ceremony</KavaSectionTitle>
        <div className="space-y-3">
          {PROTOCOL.map((p, i) => (
            <KavaCard key={p.time}>
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-kava-saffron text-sm font-bold text-white">
                  {i + 1}
                </div>
                <div>
                  <p className="mb-1 text-sm font-bold text-kava-ink">{p.time}</p>
                  <p className="text-sm leading-[1.75] text-kava-ink/70">{p.rule}</p>
                </div>
              </div>
            </KavaCard>
          ))}
        </div>
      </KavaSection>

      <KavaDivider />

      <KavaSection>
        <KavaSectionTitle>Kava vs. Coffee — Head to Head</KavaSectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-kava-ink">
            <thead>
              <tr className="border-b-2 border-kava-sand-muted">
                <th className="px-4 py-3 text-left font-heading font-bold">Aspect</th>
                <th className="px-4 py-3 text-left font-heading font-bold text-[#78350F]">
                  Coffee
                </th>
                <th className="px-4 py-3 text-left font-heading font-bold text-kava-saffron">
                  Kava
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr
                  key={row.aspect}
                  className={`border-b border-kava-sand-muted ${i % 2 === 0 ? "" : "bg-kava-sand-muted/25"}`}
                >
                  <td className="px-4 py-3 font-medium">{row.aspect}</td>
                  <td className="px-4 py-3 leading-[1.6] opacity-80">{row.coffee}</td>
                  <td className="px-4 py-3 leading-[1.6] opacity-80">{row.kava}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
