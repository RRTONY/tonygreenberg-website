import { useState, useMemo } from "react";
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
import { Search, AlertTriangle, Download, X } from "lucide-react";
import SEO from "@/components/SEO";

type Severity =
  | "HARD STOP"
  | "CRITICAL"
  | "MODERATE"
  | "CAUTION"
  | "COMPLEX"
  | "RESEARCH FRONTIER"
  | "GENERALLY OK"
  | "SYNERGISTIC"
  | "ELEVATED RISK"
  | "ADDITIVE"
  | "NOTABLE";

interface Interaction {
  substance: string;
  aliases: string[];
  severity: Severity;
  mechanism: string;
  protocol: string;
}

const SEVERITY_CONFIG: Record<string, { bg: string; text: string; border: string }> = {
  "HARD STOP": { bg: "#dc262615", text: "#dc2626", border: "#dc2626" },
  CRITICAL: { bg: "#991b1b15", text: "#991b1b", border: "#991b1b" },
  "ELEVATED RISK": { bg: "#ea580c15", text: "#ea580c", border: "#ea580c" },
  MODERATE: { bg: "#d9770615", text: "#d97706", border: "#d97706" },
  CAUTION: { bg: "#eab30815", text: "#ca8a04", border: "#ca8a04" },
  COMPLEX: { bg: "#7c3aed15", text: "#7c3aed", border: "#7c3aed" },
  "RESEARCH FRONTIER": { bg: "#2563eb15", text: "#2563eb", border: "#2563eb" },
  NOTABLE: { bg: "#0369a115", text: "#0369a1", border: "#0369a1" },
  ADDITIVE: { bg: "#d9770615", text: "#d97706", border: "#d97706" },
  "GENERALLY OK": { bg: "#16a34a15", text: "#16a34a", border: "#16a34a" },
  SYNERGISTIC: { bg: "#0d948815", text: "#0d9488", border: "#0d9488" },
};

const INTERACTIONS: Interaction[] = [
  { substance: "Alcohol", aliases: ["beer", "wine", "liquor", "ethanol"], severity: "HARD STOP", mechanism: "Additive GABA suppression plus combined hepatotoxicity; liver enzyme induction from both.", protocol: "No alcohol same day as kava ceremony; 24-hr washout minimum; mezcal toast = 1 to 2 sip ceremonial only." },
  { substance: "Benzodiazepines (all)", aliases: ["benzo", "diazepam", "valium", "lorazepam", "ativan", "clonazepam", "klonopin"], severity: "HARD STOP", mechanism: "Combined GABA-A potentiation leading to respiratory depression; CYP3A4 inhibition elevates benzo blood levels.", protocol: "Taper and clear before PRI entry; 2-week minimum washout; physician oversight required." },
  { substance: "Alprazolam (Xanax)", aliases: ["xanax"], severity: "CRITICAL", mechanism: "Documented case of semicomatose state from kava plus alprazolam combination.", protocol: "Absolute contraindication, no exceptions in ceremonial context." },
  { substance: "Opioids (all)", aliases: ["oxycodone", "hydrocodone", "morphine", "heroin", "oxycontin", "vicodin", "percocet", "fentanyl"], severity: "HARD STOP", mechanism: "CNS depression compounded; CYP2D6 inhibition raises opioid blood levels; respiratory depression risk.", protocol: "Active opioid use = disqualification; document opioid history at intake." },
  { substance: "Buprenorphine (Suboxone)", aliases: ["suboxone", "subutex", "MAT"], severity: "CRITICAL", mechanism: "Use with buprenorphine can lead to respiratory distress, coma, or death.", protocol: "Absolute contraindication regardless of MAT status." },
  { substance: "SSRIs and SNRIs", aliases: ["sertraline", "zoloft", "fluoxetine", "prozac", "escitalopram", "lexapro", "venlafaxine", "effexor", "duloxetine", "cymbalta"], severity: "MODERATE", mechanism: "CYP2D6 inhibition elevates SSRI levels; serotonergic activity overlap; unpredictable interaction profile.", protocol: "Physician clearance required; most SSRIs require case-by-case evaluation; avoid ceremonial kava on SSRIs without MD sign-off." },
  { substance: "MAOIs (irreversible)", aliases: ["MAOI", "phenelzine", "nardil", "tranylcypromine", "parnate"], severity: "HARD STOP", mechanism: "Kava MAO-B inhibition + irreversible MAOI = dangerous amplification of monoamine pathways.", protocol: "14-day minimum washout before any kava; critical for peyote/mescaline sequencing context." },
  { substance: "Statins", aliases: ["atorvastatin", "lipitor", "lovastatin", "simvastatin"], severity: "MODERATE", mechanism: "CYP3A4 inhibition raises statin blood levels leading to increased myopathy risk.", protocol: "Physician review of statin dosing required for regular kava practitioners." },
  { substance: "Warfarin (blood thinners)", aliases: ["coumadin", "blood thinner"], severity: "MODERATE", mechanism: "CYP2C9 inhibition 92% elevates warfarin leading to bleeding risk.", protocol: "Not appropriate without hematology clearance." },
  { substance: "Acetaminophen (Tylenol)", aliases: ["tylenol", "paracetamol"], severity: "CAUTION", mechanism: "Combined hepatotoxic pathway burden; both deplete liver glutathione.", protocol: "Avoid within 48 hours of kava session; use ibuprofen if pain relief needed." },
  { substance: "Anesthesia (surgical)", aliases: ["surgery", "anesthetic"], severity: "HARD STOP", mechanism: "Kava potentiates anesthetic effect; blood pressure instability documented.", protocol: "Stop kava minimum 2 weeks before any scheduled surgery." },
  { substance: "Parkinson's medications (Levodopa)", aliases: ["levodopa", "L-DOPA", "carbidopa", "sinemet"], severity: "HARD STOP", mechanism: "Kava may worsen Parkinson's symptoms by interfering with dopamine function; counteracts L-DOPA.", protocol: "Parkinson's diagnosis = absolute contraindication." },
  { substance: "Cannabis (THC)", aliases: ["marijuana", "weed", "THC", "cannabis"], severity: "COMPLEX", mechanism: "Yangonin has CB1 receptor affinity; cannabis plus kava may produce unpredictable CNS depression amplification.", protocol: "Cannabis use disclosures required at intake; 12-hour abstinence before ceremony." },
  { substance: "Peyote (Mescaline)", aliases: ["mescaline", "peyote", "san pedro"], severity: "RESEARCH FRONTIER", mechanism: "MAO-B mild inhibition from kava; mescaline is a phenethylamine metabolized partly by MAO-B; theoretical potentiation not clinically quantified.", protocol: "24-hour minimum separation; kava as preparation night before only." },
  { substance: "Psilocybin mushrooms", aliases: ["psilocybin", "mushrooms", "magic mushrooms", "shrooms"], severity: "RESEARCH FRONTIER", mechanism: "Psilocybin metabolized by CYP2D6 which kava inhibits 73%; potential elevation of psilocin levels; no clinical data in humans.", protocol: "Kava preparation night before only, not same day; precautionary 12-hr separation minimum." },
  { substance: "MDMA", aliases: ["ecstasy", "molly"], severity: "ELEVATED RISK", mechanism: "CYP2D6 inhibition 73% significantly elevates MDMA blood levels; serotonin syndrome risk amplified; hepatic stress combined.", protocol: "MDMA use disclosures mandatory; recent MDMA use = defer ceremony minimum 2 weeks." },
  { substance: "Methamphetamine (ICE)", aliases: ["meth", "ice", "crystal", "crystal meth", "tina"], severity: "COMPLEX", mechanism: "Opposite pharmacological axes: CNS stimulant vs CNS depressant; kava studied in harm reduction context for meth comedowns; not concurrent use.", protocol: "Never concurrent; minimum 48-72 hour abstinence from meth before kava; community facilitator oversight required." },
  { substance: "Kratom", aliases: ["kratom", "mitragyna"], severity: "ELEVATED RISK", mechanism: "CNS depressant overlap; opioid-mimicking kratom plus kava GABA = respiratory depression concern.", protocol: "7-day abstinence before ceremony." },
  { substance: "St. John's Wort", aliases: ["hypericum", "SJW"], severity: "CAUTION", mechanism: "Combined serotonergic activity; opposite CYP enzyme directions: kava inhibits, SJW induces.", protocol: "Disclose at intake; adjust kava dosing downward if SJW active." },
  { substance: "Antifungals (ketoconazole)", aliases: ["ketoconazole", "fluconazole", "antifungal"], severity: "MODERATE", mechanism: "CYP3A4 competition; combined liver enzyme stress.", protocol: "Defer kava ceremony during active antifungal treatment course." },
  { substance: "Caffeine", aliases: ["coffee", "tea", "energy drink", "pre-workout"], severity: "NOTABLE", mechanism: "Kava inhibits CYP1A2 by 56%; caffeine metabolized 56% slower, lasts longer, feels stronger.", protocol: "No coffee 4+ hours before kava ceremony; disclose daily caffeine intake at intake." },
  { substance: "Valerian / Melatonin", aliases: ["valerian", "melatonin"], severity: "ADDITIVE", mechanism: "Both produce sedation; combined effect may overshoot into excessive drowsiness.", protocol: "Use intentionally for sleep optimization night before ceremony; reduce both doses if combining." },
  { substance: "Ashwagandha (adaptogens)", aliases: ["ashwagandha", "adaptogen", "rhodiola"], severity: "GENERALLY OK", mechanism: "No hepatotoxic overlap with noble kava; cortisol modulation may complement anxiolysis.", protocol: "Compatible with PRI protocol; popular commercial kava blends already combine these." },
  { substance: "L-Theanine", aliases: ["theanine"], severity: "SYNERGISTIC", mechanism: "Both modulate GABA; theanine promotes alpha waves; complementary anxiolysis without sedation overshoot.", protocol: "Excellent combination for facilitators and participants during prep work." },
];

const CYP_ENZYMES = [
  { enzyme: "CYP1A2", inhibition: 56, affected: "Caffeine, theophylline, some antidepressants" },
  { enzyme: "CYP2C9", inhibition: 92, affected: "Warfarin, some statins, NSAIDs" },
  { enzyme: "CYP2C19", inhibition: 86, affected: "PPIs, clopidogrel, some antidepressants" },
  { enzyme: "CYP2D6", inhibition: 73, affected: "Antidepressants, opioids, beta-blockers, MDMA, psilocybin" },
  { enzyme: "CYP3A4", inhibition: 78, affected: "Benzodiazepines, statins, HIV meds, antifungals" },
];

const NOT_AFFECTED = ["CYP2A6", "CYP2C8", "CYP2E1"];

export default function KavaInteractions() {
  const [search, setSearch] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let results = INTERACTIONS;
    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(
        (i) =>
          i.substance.toLowerCase().includes(q) ||
          i.aliases.some((a) => a.toLowerCase().includes(q))
      );
    }
    if (selectedSeverity) {
      results = results.filter((i) => i.severity === selectedSeverity);
    }
    return results;
  }, [search, selectedSeverity]);

  const hasHardStop = filtered.some(
    (i) => i.severity === "HARD STOP" || i.severity === "CRITICAL"
  );

  return (
    <>
    <SEO
        title="Kava Drug Interactions — Safety Guide"
        description="A comprehensive guide to kava's interactions with medications, supplements, and substances."
        path="/kava/interactions"
        keywords="Tony Greenberg, kava interactions, kava drug interactions, kava safety"
        indexable={true}
      />
      <KavaLayout>
      <KavaHero
        eyebrow="Module 3"
        title="Drug Interaction Checker"
        subtitle="Screen 24 substances against kava's CYP450 inhibition profile. Color-coded severity matrix with mechanism explanations and PRI protocol notes."
      />

      {/* ── Search ── */}
      <KavaSection>
        <div className="max-w-2xl mx-auto mb-8">
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ backgroundColor: "#fff", border: `2px solid ${KAVA.sandMuted}` }}
          >
            <Search size={20} style={{ color: KAVA.saffron }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medications or substances..."
              className="flex-1 bg-transparent outline-none text-base"
              style={{ color: KAVA.ink, fontFamily: "'DM Sans', sans-serif" }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="opacity-40 hover:opacity-100">
                <X size={18} />
              </button>
            )}
          </div>

          {/* Severity filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {Object.keys(SEVERITY_CONFIG).map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSeverity(selectedSeverity === s ? null : s)}
                className="px-3 py-1 rounded-full text-xs font-bold transition-all"
                style={{
                  backgroundColor:
                    selectedSeverity === s
                      ? SEVERITY_CONFIG[s].text
                      : SEVERITY_CONFIG[s].bg,
                  color: selectedSeverity === s ? "#fff" : SEVERITY_CONFIG[s].text,
                  border: `1px solid ${SEVERITY_CONFIG[s].border}40`,
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Hard Stop Banner */}
        {hasHardStop && search.trim() && (
          <div
            className="max-w-2xl mx-auto mb-6 rounded-xl p-4 flex items-start gap-3"
            style={{ backgroundColor: "#dc262615", border: "2px solid #dc2626" }}
          >
            <AlertTriangle size={24} style={{ color: "#dc2626" }} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-base" style={{ color: "#dc2626" }}>
                HARD STOP / CRITICAL FLAG DETECTED
              </p>
              <p className="text-sm mt-1" style={{ color: KAVA.ink, lineHeight: 1.75 }}>
                One or more substances in your search trigger an absolute contraindication.
                Ceremony cannot proceed until these are resolved with physician oversight.
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="space-y-4">
          {filtered.map((interaction) => {
            const cfg = SEVERITY_CONFIG[interaction.severity] || SEVERITY_CONFIG["MODERATE"];
            return (
              <KavaCard key={interaction.substance}>
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <h3
                    className="font-bold text-lg"
                    style={{ fontFamily: "'Fraunces', serif", color: KAVA.ink }}
                  >
                    {interaction.substance}
                  </h3>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                    style={{ backgroundColor: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}
                  >
                    {interaction.severity}
                  </span>
                </div>
                <div
                  className="rounded-lg p-3 mb-3"
                  style={{ backgroundColor: cfg.bg, borderLeft: `3px solid ${cfg.border}` }}
                >
                  <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: cfg.text }}>
                    Mechanism
                  </p>
                  <p className="text-sm" style={{ lineHeight: 1.75, color: KAVA.ink }}>
                    {interaction.mechanism}
                  </p>
                </div>
                <div
                  className="rounded-lg p-3"
                  style={{ backgroundColor: KAVA.sandMuted + "80" }}
                >
                  <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: KAVA.saffron }}>
                    PRI Protocol
                  </p>
                  <p className="text-sm" style={{ lineHeight: 1.75, color: KAVA.ink }}>
                    {interaction.protocol}
                  </p>
                </div>
              </KavaCard>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 opacity-50">
              <p className="text-lg" style={{ fontFamily: "'Fraunces', serif" }}>
                No matching substances found
              </p>
              <p className="text-sm mt-1">Try a different search term or clear filters</p>
            </div>
          )}
        </div>
      </KavaSection>

      <KavaDivider />

      {/* ── CYP450 Profile ── */}
      <KavaSection bg={KAVA.sandMuted}>
        <KavaSectionTitle>CYP450 Enzyme Inhibition Profile</KavaSectionTitle>
        <p className="text-base mb-8" style={{ lineHeight: 1.75, color: KAVA.ink, opacity: 0.7 }}>
          Kava's kavalactone components inhibit five major liver enzymes. This is the primary
          mechanism by which kava interacts with medications.
        </p>
        <div className="space-y-4">
          {CYP_ENZYMES.map((e) => (
            <KavaCard key={e.enzyme}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-base" style={{ fontFamily: "'Fraunces', serif" }}>
                  {e.enzyme}
                </h4>
                <span className="font-bold text-lg" style={{ color: KAVA.terracotta }}>
                  {e.inhibition}%
                </span>
              </div>
              {/* Bar */}
              <div className="h-3 rounded-full mb-3" style={{ backgroundColor: KAVA.sandMuted }}>
                <div
                  className="h-3 rounded-full transition-all duration-700"
                  style={{
                    width: `${e.inhibition}%`,
                    backgroundColor:
                      e.inhibition > 85
                        ? KAVA.terracotta
                        : e.inhibition > 70
                          ? KAVA.saffron
                          : KAVA.cobalt,
                  }}
                />
              </div>
              <p className="text-sm" style={{ color: KAVA.ink, opacity: 0.6, lineHeight: 1.75 }}>
                <strong>Affected medications:</strong> {e.affected}
              </p>
            </KavaCard>
          ))}
        </div>
        <div className="mt-6 rounded-lg p-4" style={{ backgroundColor: "#16a34a15" }}>
          <p className="text-sm font-bold mb-1" style={{ color: "#16a34a" }}>
            NOT affected by kava:
          </p>
          <p className="text-sm" style={{ color: KAVA.ink }}>
            {NOT_AFFECTED.join(", ")}
          </p>
        </div>
      </KavaSection>

      <KavaDisclaimer />
    </KavaLayout>
    </>);
}
