import KavaLayout, {
  KAVA,
  KavaHero,
  KavaSection,
  KavaSectionTitle,
  KavaCard,
  KavaDivider,
  KavaDisclaimer,
} from "./KavaLayout";

const COMPARISON = [
  { aspect: "Primary mechanism", coffee: "Adenosine receptor antagonism", kava: "GABA-A potentiation + MAO-B inhibition" },
  { aspect: "Consciousness effect", coffee: "Heightened alertness and stimulation", kava: "Calm presence with reason fully preserved" },
  { aspect: "Social effect", coffee: "Can increase anxiety in social settings", kava: "Prosocial bonding without cognitive impairment" },
  { aspect: "Sleep impact", coffee: "Disruptive — 5-hour half-life", kava: "Improves deep sleep architecture" },
  { aspect: "Addiction profile", coffee: "Habit-forming with withdrawal headaches", kava: "Non-addictive with reverse tolerance" },
  { aspect: "Stomach", coffee: "Highly acidic, digestive issues for many", kava: "Gentle on the stomach" },
  { aspect: "When combined", coffee: "Caffeine potentiated 56%+", kava: "Separate by 4 hours minimum; sensitive individuals 6 hours" },
];

const PROTOCOL = [
  { time: "Morning of ceremony", rule: "Normal coffee or tea is acceptable — ceremony is in the evening; CYP1A2 inhibition from prior kava sessions typically clears within 24 to 48 hours." },
  { time: "4+ hours before kava", rule: "Stop all caffeine — coffee, tea, energy drinks, pre-workout supplements, soda." },
  { time: "Caffeine-sensitive participants", rule: "Extend cutoff to 6 hours." },
  { time: "During ceremony", rule: "Water only alongside kava shells; non-caffeinated herbal teas (hibiscus, chamomile, rooibos) are acceptable." },
  { time: "Post-ceremony", rule: "Kava supports deep sleep architecture; zero late caffeine is critical for Oura Ring deep sleep optimization the night before a journey." },
];

export default function KavaCaffeine() {
  return (
    <KavaLayout>
      <KavaHero
        eyebrow="Module 8"
        title="Caffeine Interactions"
        subtitle="Kava inhibits CYP1A2 by 56%. That means your coffee metabolizes 56% slower — lasting longer and hitting harder than expected."
      />

      {/* ── Core Mechanism ── */}
      <KavaSection>
        <KavaSectionTitle>The Core Biochemical Mechanism</KavaSectionTitle>
        <div
          className="rounded-xl p-6 mb-6"
          style={{ backgroundColor: KAVA.saffron + "10", borderLeft: `4px solid ${KAVA.saffron}` }}
        >
          <p className="text-base" style={{ lineHeight: 1.75, color: KAVA.ink }}>
            Kava inhibits the liver enzyme <strong>CYP1A2 by 56%</strong>. CYP1A2 is the
            primary enzyme responsible for metabolizing caffeine. When kava is active in the
            system, caffeine is metabolized 56% slower — making it last longer and accumulate
            to higher blood levels than expected. This is the same mechanism by which
            grapefruit juice affects many medications. Kava's kavalactone components, rather
            than other components of the extract, are responsible for CYP enzyme inhibition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KavaCard>
            <h4
              className="font-bold text-base mb-2"
              style={{ fontFamily: "'Fraunces', serif", color: KAVA.saffron }}
            >
              The "Hippie Speedball"
            </h4>
            <p className="text-sm" style={{ lineHeight: 1.75, color: KAVA.ink, opacity: 0.8 }}>
              Some people enjoy the combination — the kava bar community calls it a "hippie
              speedball" — experiencing alert relaxation. However, people sensitive to caffeine
              will experience amplified jitters, anxiety, and restlessness that is
              counterproductive to ceremonial readiness.
            </p>
          </KavaCard>
          <KavaCard>
            <h4
              className="font-bold text-base mb-2"
              style={{ fontFamily: "'Fraunces', serif", color: "#16a34a" }}
            >
              Yerba Mate Alternative
            </h4>
            <p className="text-sm" style={{ lineHeight: 1.75, color: KAVA.ink, opacity: 0.8 }}>
              Community-documented finding: yerba mate pairs better with kava than coffee.
              Yerba mate contains theobromine alongside caffeine; theobromine provides gentler,
              longer-duration energy without the spike-crash and appears to interact more
              softly with the CYP1A2 inhibition dynamic. Not clinically studied but worth
              tracking.
            </p>
          </KavaCard>
        </div>
      </KavaSection>

      <KavaDivider />

      {/* ── Cutoff Protocol ── */}
      <KavaSection bg={KAVA.sandMuted}>
        <KavaSectionTitle>Caffeine Cutoff Protocol for Threshold Ceremony</KavaSectionTitle>
        <div className="space-y-3">
          {PROTOCOL.map((p, i) => (
            <KavaCard key={i}>
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ backgroundColor: KAVA.saffron }}
                >
                  {i + 1}
                </div>
                <div>
                  <p className="font-bold text-sm mb-1" style={{ color: KAVA.ink }}>
                    {p.time}
                  </p>
                  <p className="text-sm" style={{ lineHeight: 1.75, color: KAVA.ink, opacity: 0.7 }}>
                    {p.rule}
                  </p>
                </div>
              </div>
            </KavaCard>
          ))}
        </div>
      </KavaSection>

      <KavaDivider />

      {/* ── Head-to-Head Comparison ── */}
      <KavaSection>
        <KavaSectionTitle>Kava vs. Coffee — Head to Head</KavaSectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ color: KAVA.ink }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${KAVA.sandMuted}` }}>
                <th className="text-left py-3 px-4 font-bold" style={{ fontFamily: "'Fraunces', serif" }}>
                  Aspect
                </th>
                <th className="text-left py-3 px-4 font-bold" style={{ fontFamily: "'Fraunces', serif", color: "#78350F" }}>
                  Coffee
                </th>
                <th className="text-left py-3 px-4 font-bold" style={{ fontFamily: "'Fraunces', serif", color: KAVA.saffron }}>
                  Kava
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr
                  key={row.aspect}
                  style={{
                    borderBottom: `1px solid ${KAVA.sandMuted}`,
                    backgroundColor: i % 2 === 0 ? "transparent" : KAVA.sandMuted + "40",
                  }}
                >
                  <td className="py-3 px-4 font-medium">{row.aspect}</td>
                  <td className="py-3 px-4" style={{ lineHeight: 1.6, opacity: 0.8 }}>
                    {row.coffee}
                  </td>
                  <td className="py-3 px-4" style={{ lineHeight: 1.6, opacity: 0.8 }}>
                    {row.kava}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </KavaSection>

      <KavaDisclaimer />
    </KavaLayout>
  );
}
