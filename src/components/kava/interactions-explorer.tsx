"use client";

import { useMemo, useState } from "react";
import { Search, AlertTriangle, X } from "lucide-react";
import { KavaCard } from "@/components/kava/kava-ui";

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

const SEVERITY_CONFIG: Record<
  string,
  { bgClass: string; textClass: string; borderClass: string; barClass: string }
> = {
  "HARD STOP": {
    bgClass: "bg-[#dc2626]/8",
    textClass: "text-[#dc2626]",
    borderClass: "border-[#dc2626]",
    barClass: "bg-[#dc2626]",
  },
  CRITICAL: {
    bgClass: "bg-[#991b1b]/8",
    textClass: "text-[#991b1b]",
    borderClass: "border-[#991b1b]",
    barClass: "bg-[#991b1b]",
  },
  "ELEVATED RISK": {
    bgClass: "bg-[#ea580c]/8",
    textClass: "text-[#ea580c]",
    borderClass: "border-[#ea580c]",
    barClass: "bg-[#ea580c]",
  },
  MODERATE: {
    bgClass: "bg-[#d97706]/8",
    textClass: "text-[#d97706]",
    borderClass: "border-[#d97706]",
    barClass: "bg-[#d97706]",
  },
  CAUTION: {
    bgClass: "bg-[#ca8a04]/8",
    textClass: "text-[#ca8a04]",
    borderClass: "border-[#ca8a04]",
    barClass: "bg-[#ca8a04]",
  },
  COMPLEX: {
    bgClass: "bg-[#7c3aed]/8",
    textClass: "text-[#7c3aed]",
    borderClass: "border-[#7c3aed]",
    barClass: "bg-[#7c3aed]",
  },
  "RESEARCH FRONTIER": {
    bgClass: "bg-[#2563eb]/8",
    textClass: "text-[#2563eb]",
    borderClass: "border-[#2563eb]",
    barClass: "bg-[#2563eb]",
  },
  NOTABLE: {
    bgClass: "bg-[#0369a1]/8",
    textClass: "text-[#0369a1]",
    borderClass: "border-[#0369a1]",
    barClass: "bg-[#0369a1]",
  },
  ADDITIVE: {
    bgClass: "bg-[#d97706]/8",
    textClass: "text-[#d97706]",
    borderClass: "border-[#d97706]",
    barClass: "bg-[#d97706]",
  },
  "GENERALLY OK": {
    bgClass: "bg-[#16a34a]/8",
    textClass: "text-[#16a34a]",
    borderClass: "border-[#16a34a]",
    barClass: "bg-[#16a34a]",
  },
  SYNERGISTIC: {
    bgClass: "bg-[#0d9488]/8",
    textClass: "text-[#0d9488]",
    borderClass: "border-[#0d9488]",
    barClass: "bg-[#0d9488]",
  },
};

// Ported from legacy client/src/pages/kava/KavaInteractions.tsx — real
// 24-substance drug interaction database (real severity ratings, real
// pharmacological mechanisms, real PRI protocol guidance), unchanged.
// Search + severity-filter interactivity, extracted into this client
// island. Legacy's `Download` icon import was never used anywhere in the
// file (dead import) — not ported, since there's no export/download
// feature to attach it to.
const INTERACTIONS: Interaction[] = [
  {
    substance: "Alcohol",
    aliases: ["beer", "wine", "liquor", "ethanol"],
    severity: "HARD STOP",
    mechanism:
      "Additive GABA suppression plus combined hepatotoxicity; liver enzyme induction from both.",
    protocol:
      "No alcohol same day as kava ceremony; 24-hr washout minimum; mezcal toast = 1 to 2 sip ceremonial only.",
  },
  {
    substance: "Benzodiazepines (all)",
    aliases: ["benzo", "diazepam", "valium", "lorazepam", "ativan", "clonazepam", "klonopin"],
    severity: "HARD STOP",
    mechanism:
      "Combined GABA-A potentiation leading to respiratory depression; CYP3A4 inhibition elevates benzo blood levels.",
    protocol:
      "Taper and clear before PRI entry; 2-week minimum washout; physician oversight required.",
  },
  {
    substance: "Alprazolam (Xanax)",
    aliases: ["xanax"],
    severity: "CRITICAL",
    mechanism: "Documented case of semicomatose state from kava plus alprazolam combination.",
    protocol: "Absolute contraindication, no exceptions in ceremonial context.",
  },
  {
    substance: "Opioids (all)",
    aliases: [
      "oxycodone",
      "hydrocodone",
      "morphine",
      "heroin",
      "oxycontin",
      "vicodin",
      "percocet",
      "fentanyl",
    ],
    severity: "HARD STOP",
    mechanism:
      "CNS depression compounded; CYP2D6 inhibition raises opioid blood levels; respiratory depression risk.",
    protocol: "Active opioid use = disqualification; document opioid history at intake.",
  },
  {
    substance: "Buprenorphine (Suboxone)",
    aliases: ["suboxone", "subutex", "MAT"],
    severity: "CRITICAL",
    mechanism: "Use with buprenorphine can lead to respiratory distress, coma, or death.",
    protocol: "Absolute contraindication regardless of MAT status.",
  },
  {
    substance: "SSRIs and SNRIs",
    aliases: [
      "sertraline",
      "zoloft",
      "fluoxetine",
      "prozac",
      "escitalopram",
      "lexapro",
      "venlafaxine",
      "effexor",
      "duloxetine",
      "cymbalta",
    ],
    severity: "MODERATE",
    mechanism:
      "CYP2D6 inhibition elevates SSRI levels; serotonergic activity overlap; unpredictable interaction profile.",
    protocol:
      "Physician clearance required; most SSRIs require case-by-case evaluation; avoid ceremonial kava on SSRIs without MD sign-off.",
  },
  {
    substance: "MAOIs (irreversible)",
    aliases: ["MAOI", "phenelzine", "nardil", "tranylcypromine", "parnate"],
    severity: "HARD STOP",
    mechanism:
      "Kava MAO-B inhibition + irreversible MAOI = dangerous amplification of monoamine pathways.",
    protocol:
      "14-day minimum washout before any kava; critical for peyote/mescaline sequencing context.",
  },
  {
    substance: "Statins",
    aliases: ["atorvastatin", "lipitor", "lovastatin", "simvastatin"],
    severity: "MODERATE",
    mechanism: "CYP3A4 inhibition raises statin blood levels leading to increased myopathy risk.",
    protocol: "Physician review of statin dosing required for regular kava practitioners.",
  },
  {
    substance: "Warfarin (blood thinners)",
    aliases: ["coumadin", "blood thinner"],
    severity: "MODERATE",
    mechanism: "CYP2C9 inhibition 92% elevates warfarin leading to bleeding risk.",
    protocol: "Not appropriate without hematology clearance.",
  },
  {
    substance: "Acetaminophen (Tylenol)",
    aliases: ["tylenol", "paracetamol"],
    severity: "CAUTION",
    mechanism: "Combined hepatotoxic pathway burden; both deplete liver glutathione.",
    protocol: "Avoid within 48 hours of kava session; use ibuprofen if pain relief needed.",
  },
  {
    substance: "Anesthesia (surgical)",
    aliases: ["surgery", "anesthetic"],
    severity: "HARD STOP",
    mechanism: "Kava potentiates anesthetic effect; blood pressure instability documented.",
    protocol: "Stop kava minimum 2 weeks before any scheduled surgery.",
  },
  {
    substance: "Parkinson's medications (Levodopa)",
    aliases: ["levodopa", "L-DOPA", "carbidopa", "sinemet"],
    severity: "HARD STOP",
    mechanism:
      "Kava may worsen Parkinson's symptoms by interfering with dopamine function; counteracts L-DOPA.",
    protocol: "Parkinson's diagnosis = absolute contraindication.",
  },
  {
    substance: "Cannabis (THC)",
    aliases: ["marijuana", "weed", "THC", "cannabis"],
    severity: "COMPLEX",
    mechanism:
      "Yangonin has CB1 receptor affinity; cannabis plus kava may produce unpredictable CNS depression amplification.",
    protocol: "Cannabis use disclosures required at intake; 12-hour abstinence before ceremony.",
  },
  {
    substance: "Peyote (Mescaline)",
    aliases: ["mescaline", "peyote", "san pedro"],
    severity: "RESEARCH FRONTIER",
    mechanism:
      "MAO-B mild inhibition from kava; mescaline is a phenethylamine metabolized partly by MAO-B; theoretical potentiation not clinically quantified.",
    protocol: "24-hour minimum separation; kava as preparation night before only.",
  },
  {
    substance: "Psilocybin mushrooms",
    aliases: ["psilocybin", "mushrooms", "magic mushrooms", "shrooms"],
    severity: "RESEARCH FRONTIER",
    mechanism:
      "Psilocybin metabolized by CYP2D6 which kava inhibits 73%; potential elevation of psilocin levels; no clinical data in humans.",
    protocol:
      "Kava preparation night before only, not same day; precautionary 12-hr separation minimum.",
  },
  {
    substance: "MDMA",
    aliases: ["ecstasy", "molly"],
    severity: "ELEVATED RISK",
    mechanism:
      "CYP2D6 inhibition 73% significantly elevates MDMA blood levels; serotonin syndrome risk amplified; hepatic stress combined.",
    protocol: "MDMA use disclosures mandatory; recent MDMA use = defer ceremony minimum 2 weeks.",
  },
  {
    substance: "Methamphetamine (ICE)",
    aliases: ["meth", "ice", "crystal", "crystal meth", "tina"],
    severity: "COMPLEX",
    mechanism:
      "Opposite pharmacological axes: CNS stimulant vs CNS depressant; kava studied in harm reduction context for meth comedowns; not concurrent use.",
    protocol:
      "Never concurrent; minimum 48-72 hour abstinence from meth before kava; community facilitator oversight required.",
  },
  {
    substance: "Kratom",
    aliases: ["kratom", "mitragyna"],
    severity: "ELEVATED RISK",
    mechanism:
      "CNS depressant overlap; opioid-mimicking kratom plus kava GABA = respiratory depression concern.",
    protocol: "7-day abstinence before ceremony.",
  },
  {
    substance: "St. John's Wort",
    aliases: ["hypericum", "SJW"],
    severity: "CAUTION",
    mechanism:
      "Combined serotonergic activity; opposite CYP enzyme directions: kava inhibits, SJW induces.",
    protocol: "Disclose at intake; adjust kava dosing downward if SJW active.",
  },
  {
    substance: "Antifungals (ketoconazole)",
    aliases: ["ketoconazole", "fluconazole", "antifungal"],
    severity: "MODERATE",
    mechanism: "CYP3A4 competition; combined liver enzyme stress.",
    protocol: "Defer kava ceremony during active antifungal treatment course.",
  },
  {
    substance: "Caffeine",
    aliases: ["coffee", "tea", "energy drink", "pre-workout"],
    severity: "NOTABLE",
    mechanism:
      "Kava inhibits CYP1A2 by 56%; caffeine metabolized 56% slower, lasts longer, feels stronger.",
    protocol: "No coffee 4+ hours before kava ceremony; disclose daily caffeine intake at intake.",
  },
  {
    substance: "Valerian / Melatonin",
    aliases: ["valerian", "melatonin"],
    severity: "ADDITIVE",
    mechanism: "Both produce sedation; combined effect may overshoot into excessive drowsiness.",
    protocol:
      "Use intentionally for sleep optimization night before ceremony; reduce both doses if combining.",
  },
  {
    substance: "Ashwagandha (adaptogens)",
    aliases: ["ashwagandha", "adaptogen", "rhodiola"],
    severity: "GENERALLY OK",
    mechanism:
      "No hepatotoxic overlap with noble kava; cortisol modulation may complement anxiolysis.",
    protocol: "Compatible with PRI protocol; popular commercial kava blends already combine these.",
  },
  {
    substance: "L-Theanine",
    aliases: ["theanine"],
    severity: "SYNERGISTIC",
    mechanism:
      "Both modulate GABA; theanine promotes alpha waves; complementary anxiolysis without sedation overshoot.",
    protocol: "Excellent combination for facilitators and participants during prep work.",
  },
];

export function InteractionsExplorer() {
  const [search, setSearch] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let results = INTERACTIONS;
    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(
        (i) =>
          i.substance.toLowerCase().includes(q) ||
          i.aliases.some((a) => a.toLowerCase().includes(q)),
      );
    }
    if (selectedSeverity) results = results.filter((i) => i.severity === selectedSeverity);
    return results;
  }, [search, selectedSeverity]);

  const hasHardStop = filtered.some((i) => i.severity === "HARD STOP" || i.severity === "CRITICAL");

  return (
    <>
      <div className="mx-auto mb-8 max-w-2xl">
        <div className="flex items-center gap-3 rounded-xl border-2 border-kava-sand-muted bg-white px-4 py-3">
          <Search size={20} className="text-kava-saffron" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medications or substances..."
            className="flex-1 bg-transparent text-base text-kava-ink outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="opacity-40 hover:opacity-100">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {Object.keys(SEVERITY_CONFIG).map((s) => {
            const cfg = SEVERITY_CONFIG[s];
            const active = selectedSeverity === s;
            return (
              <button
                key={s}
                onClick={() => setSelectedSeverity(active ? null : s)}
                className={`rounded-full border px-3 py-1 text-xs font-bold ${cfg.borderClass}/25 ${active ? `${cfg.barClass} text-white` : `${cfg.bgClass} ${cfg.textClass}`}`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {hasHardStop && search.trim() && (
        <div className="mx-auto mb-6 flex max-w-2xl items-start gap-3 rounded-xl border-2 border-[#dc2626] bg-[#dc2626]/8 p-4">
          <AlertTriangle size={24} className="mt-0.5 shrink-0 text-[#dc2626]" />
          <div>
            <p className="text-base font-bold text-[#dc2626]">Hard Stop / Critical Flag Detected</p>
            <p className="mt-1 text-sm leading-[1.75] text-kava-ink">
              One or more substances in your search trigger an absolute contraindication. Ceremony
              cannot proceed until these are resolved with physician oversight.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filtered.map((interaction) => {
          const cfg = SEVERITY_CONFIG[interaction.severity] ?? SEVERITY_CONFIG.MODERATE;
          return (
            <KavaCard key={interaction.substance}>
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-heading text-lg font-bold text-kava-ink">
                  {interaction.substance}
                </h3>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold tracking-wide uppercase ${cfg.borderClass} ${cfg.bgClass} ${cfg.textClass}`}
                >
                  {interaction.severity}
                </span>
              </div>
              <div className={`mb-3 rounded-lg border-l-3 p-3 ${cfg.borderClass} ${cfg.bgClass}`}>
                <p className={`mb-1 text-xs font-bold tracking-wide uppercase ${cfg.textClass}`}>
                  Mechanism
                </p>
                <p className="text-sm leading-[1.75] text-kava-ink">{interaction.mechanism}</p>
              </div>
              <div className="rounded-lg bg-kava-sand-muted/50 p-3">
                <p className="mb-1 text-xs font-bold tracking-wide text-kava-saffron uppercase">
                  PRI Protocol
                </p>
                <p className="text-sm leading-[1.75] text-kava-ink">{interaction.protocol}</p>
              </div>
            </KavaCard>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-12 text-center opacity-50">
            <p className="font-heading text-lg">No matching substances found</p>
            <p className="mt-1 text-sm">Try a different search term or clear filters</p>
          </div>
        )}
      </div>
    </>
  );
}

export function CypProfile() {
  const CYP_ENZYMES = [
    { enzyme: "CYP1A2", inhibition: 56, affected: "Caffeine, theophylline, some antidepressants" },
    { enzyme: "CYP2C9", inhibition: 92, affected: "Warfarin, some statins, NSAIDs" },
    { enzyme: "CYP2C19", inhibition: 86, affected: "PPIs, clopidogrel, some antidepressants" },
    {
      enzyme: "CYP2D6",
      inhibition: 73,
      affected: "Antidepressants, opioids, beta-blockers, MDMA, psilocybin",
    },
    {
      enzyme: "CYP3A4",
      inhibition: 78,
      affected: "Benzodiazepines, statins, HIV meds, antifungals",
    },
  ];
  const NOT_AFFECTED = ["CYP2A6", "CYP2C8", "CYP2E1"];

  return (
    <>
      <div className="space-y-4">
        {CYP_ENZYMES.map((e) => (
          <KavaCard key={e.enzyme}>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-heading text-base font-bold">{e.enzyme}</h4>
              <span className="text-lg font-bold text-kava-terracotta">{e.inhibition}%</span>
            </div>
            <div className="mb-3 h-3 rounded-full bg-kava-sand-muted">
              <div
                className={`h-3 rounded-full transition-all duration-700 ${e.inhibition > 85 ? "bg-kava-terracotta" : e.inhibition > 70 ? "bg-kava-saffron" : "bg-kava-cobalt"}`}
                style={{ width: `${e.inhibition}%` }}
              />
            </div>
            <p className="text-sm leading-[1.75] text-kava-ink/60">
              <strong>Affected medications:</strong> {e.affected}
            </p>
          </KavaCard>
        ))}
      </div>
      <div className="mt-6 rounded-lg bg-[#16a34a]/8 p-4">
        <p className="mb-1 text-sm font-bold text-[#16a34a]">NOT affected by kava:</p>
        <p className="text-sm text-kava-ink">{NOT_AFFECTED.join(", ")}</p>
      </div>
    </>
  );
}
