import KavaLayout, {
  KAVA,
  KavaHero,
  KavaSection,
  KavaSectionTitle,
  KavaCard,
  KavaBadge,
  KavaDivider,
  KavaDisclaimer,
} from "./KavaLayout";
import { AlertTriangle } from "lucide-react";
import SEO from "@/components/SEO";

const CRISIS_STATS = [
  { value: "410%", label: "Above national average workplace meth tests (2010)" },
  { value: "77%", label: "Of Hawaii drug convictions involve meth (vs 26% national)" },
  { value: "60-80%", label: "Of Big Island prosecution cases involve meth" },
  { value: "$500M", label: "Annual economic cost of meth in Hawaii" },
  { value: "3:1", label: "Meth deaths outnumber opioid deaths on Oahu (2017-2021)" },
  { value: "4x", label: "National average for workplace meth use" },
];

const TIMELINE = [
  { year: "1985", event: "Crystal methamphetamine arrives in Hawaii from Southeast Asia. Hawaii is the first US state impacted.", type: "crisis" as const },
  { year: "1990s", event: "Mexican cartels take over distribution from Korean, Thai, and Filipino organizations.", type: "crisis" as const },
  { year: "2010", event: "Quest Diagnostics reports Hawaii workplace meth tests 410% above national average.", type: "crisis" as const },
  { year: "2013-2015", event: "Law enforcement seizes nearly 750 pounds of meth (est. $12.5M street value) from a state of 1.4M people.", type: "crisis" as const },
  { year: "2017-2021", event: "Meth remains leading cause of fatal drug overdoses in Hawaii, outnumbering opioids 3-to-1 on Oahu.", type: "crisis" as const },
  { year: "2020s", event: "Three generations of meth users documented in Hawaii communities. No FDA-approved medication exists for meth addiction.", type: "crisis" as const },
  { year: "Ongoing", event: "'Awa cultural revival: commercial kava bars statewide, seven days a week. GRAS status granted 2024.", type: "revival" as const },
];

const PHARMACOLOGICAL_ALIGNMENT = [
  { damage: "Depleted dopamine", kavaResponse: "Desmethoxyyangonin increases dopamine" },
  { damage: "Elevated cortisol", kavaResponse: "GABAergic anxiolysis from dihydrokavain" },
  { damage: "Fractured sleep", kavaResponse: "Pro-sleep architecture support" },
  { damage: "Persistent anxiety and paranoia", kavaResponse: "Serotonin modulation from methysticin and DHM" },
];

export default function KavaHawaii() {
  return (
    <>
    <SEO
        title="Hawaiian Kava — 'Awa Culture and History"
        description="The story of Hawaiian 'awa: its cultural significance, near-extinction, and revival."
        path="/kava/hawaii"
        keywords="Tony Greenberg, Hawaiian kava, awa, Hawaiian culture, kava revival"
        indexable={true}
      />
      <KavaLayout>
      <KavaHero
        eyebrow="Module 6"
        title="Hawaii, ICE, and the 'Awa Bowl"
        subtitle="The state with the worst meth crisis in the nation is simultaneously the state with the deepest indigenous kava tradition. That is not a coincidence."
      />

      {/* ── Critical Safety Warning ── */}
      <KavaSection>
        <div
          className="rounded-xl p-5 flex items-start gap-4"
          style={{ backgroundColor: "#dc262610", border: "2px solid #dc2626" }}
        >
          <AlertTriangle size={28} style={{ color: "#dc2626" }} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-base mb-2" style={{ color: "#dc2626" }}>
              CRITICAL SAFETY WARNING
            </p>
            <p className="text-sm" style={{ lineHeight: 1.75, color: KAVA.ink }}>
              Kava must NEVER be used concurrently with methamphetamine or during acute meth
              intoxication. The combination creates unpredictable cardiac and neurological risk.
              Any harm reduction application involves kava in the recovery period only — minimum
              48 to 72 hours after last meth use — and only under trained community facilitator
              oversight.
            </p>
          </div>
        </div>
      </KavaSection>

      {/* ── The Crisis ── */}
      <KavaSection bg={KAVA.sandMuted}>
        <KavaSectionTitle>The ICE Crisis — By the Numbers</KavaSectionTitle>
        <p className="text-base mb-6" style={{ lineHeight: 1.75, color: KAVA.ink, opacity: 0.7 }}>
          Crystal methamphetamine first arrived in Hawaii from Southeast Asia in 1985. Hawaii
          was the first US state to be impacted. As Judge Edward Kubo of Hawaii stated:
        </p>
        <blockquote
          className="text-xl font-medium mb-8 pl-4"
          style={{
            fontFamily: "'Fraunces', serif",
            color: KAVA.terracotta,
            borderLeft: `3px solid ${KAVA.terracotta}`,
            lineHeight: 1.5,
          }}
        >
          "We are not proud of it. But crystal methamphetamine is our gift to the nation. It
          started here."
        </blockquote>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CRISIS_STATS.map((s) => (
            <KavaCard key={s.label}>
              <p
                className="font-bold text-2xl mb-1"
                style={{ fontFamily: "'Fraunces', serif", color: KAVA.terracotta }}
              >
                {s.value}
              </p>
              <p className="text-sm" style={{ color: KAVA.ink, opacity: 0.6, lineHeight: 1.75 }}>
                {s.label}
              </p>
            </KavaCard>
          ))}
        </div>
      </KavaSection>

      {/* ── Timeline ── */}
      <KavaSection>
        <KavaSectionTitle>Dual Timeline: Crisis and Revival</KavaSectionTitle>
        <div className="relative">
          <div
            className="absolute left-4 top-0 bottom-0 w-0.5"
            style={{ backgroundColor: KAVA.sandMuted }}
          />
          {TIMELINE.map((t, i) => (
            <div key={i} className="relative flex items-start gap-4 mb-6">
              <div
                className="w-3 h-3 rounded-full shrink-0 mt-1.5 z-10 ml-2.5"
                style={{
                  backgroundColor: t.type === "crisis" ? KAVA.terracotta : "#16a34a",
                }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm" style={{ color: KAVA.ink }}>
                    {t.year}
                  </span>
                  <KavaBadge color={t.type === "crisis" ? "terracotta" : "green"}>
                    {t.type === "crisis" ? "ICE" : "'Awa Revival"}
                  </KavaBadge>
                </div>
                <p className="text-sm" style={{ lineHeight: 1.75, color: KAVA.ink, opacity: 0.8 }}>
                  {t.event}
                </p>
              </div>
            </div>
          ))}
        </div>
      </KavaSection>

      <KavaDivider />

      {/* ── Pharmacological Alignment ── */}
      <KavaSection bg={KAVA.sandMuted}>
        <KavaSectionTitle>Pharmacological Alignment</KavaSectionTitle>
        <p className="text-base mb-6" style={{ lineHeight: 1.75, color: KAVA.ink, opacity: 0.7 }}>
          Kava's kavalactone profile addresses the exact neurological damage signature of a
          meth comedown. This is a research hypothesis — not proven — but the pharmacological
          alignment is real and deserves formal clinical investigation.
        </p>
        <div className="space-y-3">
          {PHARMACOLOGICAL_ALIGNMENT.map((a, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              <div
                className="rounded-lg p-4"
                style={{ backgroundColor: KAVA.terracotta + "10", borderLeft: `3px solid ${KAVA.terracotta}` }}
              >
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: KAVA.terracotta }}>
                  Meth Damage
                </p>
                <p className="text-sm font-medium" style={{ color: KAVA.ink }}>
                  {a.damage}
                </p>
              </div>
              <div
                className="rounded-lg p-4"
                style={{ backgroundColor: "#16a34a10", borderLeft: "3px solid #16a34a" }}
              >
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "#16a34a" }}>
                  Kava Response
                </p>
                <p className="text-sm font-medium" style={{ color: KAVA.ink }}>
                  {a.kavaResponse}
                </p>
              </div>
            </div>
          ))}
        </div>
      </KavaSection>

      {/* ── The Cultural Argument ── */}
      <KavaSection>
        <KavaSectionTitle>The Cultural Argument</KavaSectionTitle>
        <blockquote
          className="text-xl md:text-2xl leading-relaxed font-medium mb-6"
          style={{
            fontFamily: "'Fraunces', serif",
            color: KAVA.ink,
            lineHeight: 1.5,
          }}
        >
          The deepest argument for kava in Hawaii's recovery landscape is not pharmacological
          — it is cultural. When a native Hawaiian participates in 'awa ceremony, they are not
          just drinking a plant. They are accessing their ancestry, their identity, their
          sovereignty. For a population three generations into meth's destruction, the 'awa
          bowl is a way home.
        </blockquote>
        <p className="text-base" style={{ lineHeight: 1.75, color: KAVA.ink, opacity: 0.7 }}>
          Preliminary research suggests kava may reduce the craving associated with addiction.
          Participants reported reduction in their desire for their drug of choice. If the
          findings are confirmed, kava may be a useful component to the treatment of
          addictions, especially for Native Hawaiian and Pacific peoples.
        </p>
      </KavaSection>

      {/* ── Resources ── */}
      <KavaSection bg={KAVA.sandMuted}>
        <KavaSectionTitle>Recovery Resources</KavaSectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "Hawaii Health and Harm Reduction Center (HHHRC)", desc: "Comprehensive harm reduction services" },
            { name: "End Meth Coalition", desc: "Community-based meth prevention and education" },
            { name: "Hawaii Pacific Health", desc: "Healthcare system with addiction treatment programs" },
            { name: "Big Island Recovery Programs", desc: "Island-specific recovery and treatment services" },
            { name: "Oahu Recovery Programs", desc: "Urban recovery services and community support" },
            { name: "Local 'Awa Ceremony Facilitators", desc: "Traditional Hawaiian 'awa practitioners" },
          ].map((r) => (
            <KavaCard key={r.name}>
              <h4 className="font-bold text-base mb-1" style={{ fontFamily: "'Fraunces', serif", color: KAVA.ink }}>
                {r.name}
              </h4>
              <p className="text-sm" style={{ color: KAVA.ink, opacity: 0.6 }}>
                {r.desc}
              </p>
            </KavaCard>
          ))}
        </div>
      </KavaSection>

      <KavaDisclaimer />
    </KavaLayout>
    </>);
}
