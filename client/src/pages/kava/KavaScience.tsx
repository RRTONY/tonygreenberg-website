import { useState } from "react";
import SEO from "@/components/SEO";
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

interface Kavalactone {
  num: number;
  name: string;
  abbrev: string;
  mechanisms: string[];
  priRelevance: string;
  color: string;
}

const KAVALACTONES: Kavalactone[] = [
  {
    num: 1,
    name: "Desmethoxyyangonin",
    abbrev: "DMY",
    mechanisms: ["Increases dopamine", "Reversible MAO-B inhibitor"],
    priRelevance:
      "Elevates mood, openness, sociability; reduces resistance to experience; fights effects of low dopamine.",
    color: "#F59E0B",
  },
  {
    num: 2,
    name: "Dihydrokavain",
    abbrev: "DHK",
    mechanisms: ["GABA-A potentiation — the strongest anxiolytic kavalactone"],
    priRelevance:
      "Core anxiety reduction; dissolves the fear that blocks readiness; the therapeutic workhorse of the kava bowl.",
    color: "#3B82F6",
  },
  {
    num: 3,
    name: "Yangonin",
    abbrev: "Y",
    mechanisms: ["CB1 receptor affinity — endocannabinoid system engagement", "CNS calming"],
    priRelevance:
      "Endocannabinoid bridge; produces warm, grounded sensory receptivity; the body-warmth kavalactone.",
    color: "#10B981",
  },
  {
    num: 4,
    name: "Kavain",
    abbrev: "K",
    mechanisms: [
      "Sodium and calcium channel blockade",
      "Acts on limbic system and amygdala",
    ],
    priRelevance:
      "Physical relaxation without cognitive fog; the ideal carrier state. Chemotypes with 4 as first number are most desirable for ceremony. Kavain and dihydrokavain are the most permeable to the blood-brain barrier.",
    color: "#8B5CF6",
  },
  {
    num: 5,
    name: "Dihydromethysticin",
    abbrev: "DHM",
    mechanisms: [
      "Increases serotonin",
      "MAO-B inhibition",
      "Activates glutamatergic NMDA receptors",
    ],
    priRelevance:
      "Serotonergic priming; may sensitize 5-HT2A pathway for subsequent medicines; neuroprotective via Nrf2/HO1 pathway.",
    color: "#EC4899",
  },
  {
    num: 6,
    name: "Methysticin",
    abbrev: "M",
    mechanisms: [
      "Serotonin modulation",
      "Nrf2 and HO1 pathway activation (neuroprotective)",
      "NF-kB inhibition (anti-inflammatory)",
    ],
    priRelevance:
      "Anti-neuroinflammatory; protects the nervous system entering altered states; the guardian kavalactone.",
    color: "#EF4444",
  },
];

const COMBINED_PROFILE = [
  "GABA-A potentiation (not via benzodiazepine receptor — different binding site)",
  "Dopamine modulation (dual — increases and decreases depending on specific kavalactone)",
  "Reversible MAO-B inhibition — ALL 6 major kavalactones share this property",
  "CB1 receptor affinity (endocannabinoid)",
  "Sodium channel blockade",
  "Calcium channel blockade — reduction up to 70%",
  "Norepinephrine reuptake inhibition (kavain and methysticin)",
  "Limbic system and amygdala targeting — fear center reduction",
  "Neuroprotective via Nrf2/HO1 pathway (methysticin, kavain, yangonin)",
  "Reverse tolerance — body becomes more sensitive to kava over time, not less",
  "Non-addictive — no withdrawal syndrome documented in traditional use patterns",
];

export default function KavaScience() {
  const [chemotypeInput, setChemotypeInput] = useState("");
  const [decodedResult, setDecodedResult] = useState<Kavalactone[] | null>(null);

  const decodeChemotype = () => {
    const nums = chemotypeInput
      .replace(/[^1-6]/g, "")
      .split("")
      .map(Number)
      .filter((n) => n >= 1 && n <= 6);
    if (nums.length === 0) return;
    const unique = Array.from(new Set(nums));
    const result = unique.map((n) => KAVALACTONES.find((k) => k.num === n)!).filter(Boolean);
    setDecodedResult(result);
  };

  return (
    <>
    <SEO
        title="Kava Science — Kavalactones and Effects"
        description="The complete science of kavalactones, their mechanisms, and what the research actually shows."
        path="/kava/science"
        keywords="Tony Greenberg, kava science, kavalactones, kava research, kava effects"
        indexable={true}
      />
      <KavaLayout>
      <KavaHero
        eyebrow="Module 4"
        title="Kavalactone Science"
        subtitle="The 6 major kavalactones — their mechanisms, receptor targets, and PRI relevance. Plus a chemotype decoder for cultivar analysis."
      />

      {/* ── The 6 Kavalactones ── */}
      <KavaSection>
        <KavaSectionTitle>The 6 Major Kavalactones</KavaSectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {KAVALACTONES.map((kl) => (
            <KavaCard key={kl.num}>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: kl.color }}
                >
                  {kl.num}
                </div>
                <div>
                  <h3
                    className="font-bold text-base"
                    style={{ fontFamily: "'Fraunces', serif", color: KAVA.ink }}
                  >
                    {kl.name}
                  </h3>
                  <p className="text-xs font-bold" style={{ color: kl.color }}>
                    {kl.abbrev}
                  </p>
                </div>
              </div>
              <div className="space-y-1 mb-3">
                {kl.mechanisms.map((m, i) => (
                  <div key={i} className="flex gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                      style={{ backgroundColor: kl.color }}
                    />
                    <p className="text-sm" style={{ lineHeight: 1.75, color: KAVA.ink }}>
                      {m}
                    </p>
                  </div>
                ))}
              </div>
              <div
                className="rounded-lg p-3"
                style={{ backgroundColor: kl.color + "10", borderLeft: `3px solid ${kl.color}` }}
              >
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: kl.color }}>
                  PRI Relevance
                </p>
                <p className="text-sm" style={{ lineHeight: 1.75, color: KAVA.ink }}>
                  {kl.priRelevance}
                </p>
              </div>
            </KavaCard>
          ))}
        </div>
      </KavaSection>

      <KavaDivider />

      {/* ── Chemotype Decoder ── */}
      <KavaSection bg={KAVA.sandMuted}>
        <KavaSectionTitle>Chemotype Decoder</KavaSectionTitle>
        <p className="text-base mb-6" style={{ lineHeight: 1.75, color: KAVA.ink, opacity: 0.7 }}>
          Enter a chemotype string (e.g. 4-2-6-5-3-1) to see which kavalactones dominate
          and their effect profile. The first number indicates the dominant kavalactone.
        </p>
        <div className="max-w-lg mx-auto">
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3 mb-4"
            style={{ backgroundColor: "#fff", border: `2px solid ${KAVA.sandMuted}` }}
          >
            <input
              type="text"
              value={chemotypeInput}
              onChange={(e) => setChemotypeInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && decodeChemotype()}
              placeholder="e.g. 4-2-6-5-3-1"
              className="flex-1 bg-transparent outline-none text-lg font-mono text-center tracking-widest"
              style={{ color: KAVA.ink }}
              maxLength={20}
            />
            <button
              onClick={decodeChemotype}
              className="px-4 py-2 rounded-lg text-sm font-bold text-white"
              style={{ backgroundColor: KAVA.saffron }}
            >
              Decode
            </button>
          </div>

          {decodedResult && (
            <div className="space-y-3 animate-in fade-in duration-300">
              {decodedResult.map((kl, i) => (
                <div
                  key={kl.num}
                  className="flex items-center gap-3 rounded-lg p-3"
                  style={{
                    backgroundColor: "#fff",
                    border: `1px solid ${i === 0 ? kl.color : KAVA.sandMuted}`,
                    borderWidth: i === 0 ? "2px" : "1px",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ backgroundColor: kl.color }}
                  >
                    {kl.num}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm" style={{ color: KAVA.ink }}>
                      {i === 0 ? "DOMINANT: " : ""}
                      {kl.name}
                    </p>
                    <p className="text-xs" style={{ color: KAVA.ink, opacity: 0.6 }}>
                      {kl.mechanisms[0]}
                    </p>
                  </div>
                  {i === 0 && <KavaBadge color="saffron">Primary</KavaBadge>}
                </div>
              ))}
              {decodedResult[0]?.num === 4 && (
                <div
                  className="rounded-lg p-3 text-sm"
                  style={{ backgroundColor: "#16a34a15", borderLeft: "3px solid #16a34a" }}
                >
                  <strong style={{ color: "#16a34a" }}>PRI Ceremony Grade:</strong>{" "}
                  Chemotypes with kavain (4) as dominant are most desirable for ceremonial use.
                </div>
              )}
            </div>
          )}
        </div>
      </KavaSection>

      <KavaDivider />

      {/* ── Combined Profile ── */}
      <KavaSection>
        <KavaSectionTitle>Complete Pharmacological Profile (All 6 Combined)</KavaSectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {COMBINED_PROFILE.map((item, i) => (
            <div
              key={i}
              className="flex gap-3 rounded-lg p-3"
              style={{ backgroundColor: "#fff", border: `1px solid ${KAVA.sandMuted}` }}
            >
              <div
                className="w-2 h-2 rounded-full mt-2 shrink-0"
                style={{ backgroundColor: KAVA.saffron }}
              />
              <p className="text-sm" style={{ lineHeight: 1.75, color: KAVA.ink }}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </KavaSection>

      <KavaDisclaimer />
    </KavaLayout>
    </>);
}
