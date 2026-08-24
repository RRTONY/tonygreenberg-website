/**
 * Price Tracker — What Peptides Actually Cost (2026)
 * Sortable table + stack cost calculator.
 * Tone: Tony's RampRate value-equation lens. Dry. Specific. Slightly annoyed at markup.
 */
import { useState, useMemo } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";

interface PriceEntry {
  compound: string;
  researchVendor: string;
  telehealth: string;
  monthlyEst: string;
  verdict: string;
  tgTake?: string;
  researchLow: number;
  researchHigh: number;
  telehealthLow: number;
  telehealthHigh: number;
}

const PRICES: PriceEntry[] = [
  { compound: "BPC-157 (5mg x10 vials)", researchVendor: "$45–$90", telehealth: "$150–$400", monthlyEst: "$45–$400", verdict: "Research wins on price. Same molecule.", tgTake: "The most overhyped and underpriced peptide in the space. Both true at once.", researchLow: 45, researchHigh: 90, telehealthLow: 150, telehealthHigh: 400 },
  { compound: "TB-500 (5mg x4 vials)", researchVendor: "$60–$120", telehealth: "$200–$500", monthlyEst: "$60–$500", verdict: "Telehealth premium: 3–4x. Decide accordingly.", researchLow: 60, researchHigh: 120, telehealthLow: 200, telehealthHigh: 500 },
  { compound: "CJC-1295 / Ipamorelin (stack)", researchVendor: "$80–$160", telehealth: "$250–$600", monthlyEst: "$80–$600", verdict: "Compounding pharmacy is legit. At a price.", tgTake: "The stack that made peptides mainstream. Pricing reflects that.", researchLow: 80, researchHigh: 160, telehealthLow: 250, telehealthHigh: 600 },
  { compound: "Semaglutide (per month)", researchVendor: "$120–$250", telehealth: "$400–$900", monthlyEst: "$400–$900", verdict: "Pharma litigation = supply risk. Factor it in.", tgTake: "Ozempic in a research vial. The economics are wild until they aren't.", researchLow: 120, researchHigh: 250, telehealthLow: 400, telehealthHigh: 900 },
  { compound: "Tirzepatide (per month)", researchVendor: "$150–$300", telehealth: "$500–$1,200", monthlyEst: "$500–$1,200", verdict: "Novo is actively suing suppliers. Risk premium real.", researchLow: 150, researchHigh: 300, telehealthLow: 500, telehealthHigh: 1200 },
  { compound: "Retatrutide (experimental)", researchVendor: "$200–$450", telehealth: "N/A", monthlyEst: "$200–$450", verdict: "Telehealth path doesn't exist yet.", tgTake: "Next-gen GLP-1. No telehealth path yet. Give it 18 months.", researchLow: 200, researchHigh: 450, telehealthLow: 0, telehealthHigh: 0 },
  { compound: "PT-141 (10mg x5 vials)", researchVendor: "$50–$100", telehealth: "$200–$400", monthlyEst: "$50–$400", verdict: "FDA-approved version exists. Compare.", researchLow: 50, researchHigh: 100, telehealthLow: 200, telehealthHigh: 400 },
  { compound: "Selank (5mg x10 vials)", researchVendor: "$35–$70", telehealth: "N/A", monthlyEst: "$35–$70", verdict: "Low cost, no telehealth path, straightforward.", researchLow: 35, researchHigh: 70, telehealthLow: 0, telehealthHigh: 0 },
  { compound: "Semax (5mg x10 vials)", researchVendor: "$40–$80", telehealth: "N/A", monthlyEst: "$40–$80", verdict: "Same story as Selank.", researchLow: 40, researchHigh: 80, telehealthLow: 0, telehealthHigh: 0 },
  { compound: "Epithalon (10mg x10 vials)", researchVendor: "$60–$120", telehealth: "N/A", monthlyEst: "$60–$120", verdict: "Longevity stack workhorse. Inexpensive.", researchLow: 60, researchHigh: 120, telehealthLow: 0, telehealthHigh: 0 },
  { compound: "GHK-Cu (50mg topical/injection)", researchVendor: "$25–$60", telehealth: "N/A", monthlyEst: "$25–$60", verdict: "Skin and wound applications. Very cheap.", researchLow: 25, researchHigh: 60, telehealthLow: 0, telehealthHigh: 0 },
  { compound: "Thymosin Alpha-1 (1mg x10)", researchVendor: "$70–$150", telehealth: "$300–$700", monthlyEst: "$70–$700", verdict: "Immune support. Telehealth premium steep.", researchLow: 70, researchHigh: 150, telehealthLow: 300, telehealthHigh: 700 },
  { compound: "SS-31 (Elamipretide, 10mg)", researchVendor: "$80–$180", telehealth: "N/A", monthlyEst: "$80–$180", verdict: "Mitochondrial. No Rx path yet.", researchLow: 80, researchHigh: 180, telehealthLow: 0, telehealthHigh: 0 },
  { compound: "MOTS-c (10mg)", researchVendor: "$90–$200", telehealth: "N/A", monthlyEst: "$90–$200", verdict: "Metabolic / longevity. Emerging data.", researchLow: 90, researchHigh: 200, telehealthLow: 0, telehealthHigh: 0 },
];

const CALCULATOR_OPTIONS = PRICES.map(p => ({ label: p.compound.split(" (")[0], researchLow: p.researchLow, researchHigh: p.researchHigh, telehealthLow: p.telehealthLow, telehealthHigh: p.telehealthHigh }));

export default function PriceTracker() {
  const [sortBy, setSortBy] = useState<"compound" | "research" | "telehealth">("compound");
  const [selectedStack, setSelectedStack] = useState<string[]>([]);
  const [pricingMode, setPricingMode] = useState<"research" | "telehealth">("research");

  const sorted = useMemo(() => {
    return [...PRICES].sort((a, b) => {
      if (sortBy === "research") return a.researchLow - b.researchLow;
      if (sortBy === "telehealth") return (a.telehealthLow || 9999) - (b.telehealthLow || 9999);
      return a.compound.localeCompare(b.compound);
    });
  }, [sortBy]);

  const stackCost = useMemo(() => {
    const items = CALCULATOR_OPTIONS.filter(o => selectedStack.includes(o.label));
    if (pricingMode === "research") {
      return { low: items.reduce((s, i) => s + i.researchLow, 0), high: items.reduce((s, i) => s + i.researchHigh, 0) };
    }
    const validItems = items.filter(i => i.telehealthLow > 0);
    return { low: validItems.reduce((s, i) => s + i.telehealthLow, 0), high: validItems.reduce((s, i) => s + i.telehealthHigh, 0) };
  }, [selectedStack, pricingMode]);

  const toggleStack = (label: string) => {
    setSelectedStack(prev => {
      if (prev.includes(label)) return prev.filter(l => l !== label);
      if (prev.length >= 4) return prev;
      return [...prev, label];
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#0A0A10]">
      {/* FDA Shutdown Banner */}
      <div style={{ background: "linear-gradient(90deg, #1a0a0a 0%, #2a0a0a 50%, #1a0a0a 100%)", padding: "0.8rem 1.5rem", borderBottom: "1px solid rgba(220, 38, 38, 0.3)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" as const }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#dc2626", fontWeight: 700 }}>MARCH 2026</span>
          <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#fca5a5" }}>Peptide Sciences shut down by FDA. <Link href="/rip-peptide-sciences" style={{ color: "#dc2626", textDecoration: "underline", fontWeight: 600 }}>Full breakdown &rarr;</Link></span>
        </div>
      </div>

      <SEO
        title="Peptide Prices 2026 — What You Should Actually Pay"
        description="Twenty-five years of analyzing $10 billion in enterprise transactions taught me one thing: the information asymmetry IS the markup. This page fixes that."
        path="/price-tracker"
        indexable={true}
      />

      {/* ── HERO ── */}
      <section className="bg-[#0A0A10] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-xs tracking-[0.25em] text-[#C84B2A] mb-6 uppercase">Price Intelligence · May 2026</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
            Here Is What Peptides Actually Cost.
          </h1>
          <p className="text-xl text-zinc-300 mb-4">(And here is what some people are being charged, which is a different number.)</p>
          <p className="text-base text-zinc-400 max-w-3xl leading-relaxed">
            Twenty-five years of analyzing $10 billion in enterprise transactions taught me one thing that applies equally to data centers, cloud contracts, and peptide vials: the information asymmetry IS the markup. When you don't know what something should cost, you pay whatever you're told. This page fixes that.
          </p>
        </div>
      </section>

      {/* ── PRICE TABLE ── */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 mb-6 items-center">
            <span className="text-sm font-medium text-zinc-500">Sort:</span>
            {(["compound", "research", "telehealth"] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)} className={`px-3 py-1 rounded text-xs font-medium capitalize ${sortBy === s ? "bg-[#0A0A10] text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}>
                {s === "compound" ? "Name" : s === "research" ? "Research $" : "Telehealth $"}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-zinc-200 text-left">
                  <th className="py-3 px-2 font-bold">Compound</th>
                  <th className="py-3 px-2 font-bold">Research Vendor</th>
                  <th className="py-3 px-2 font-bold">Telehealth / Rx</th>
                  <th className="py-3 px-2 font-bold">Monthly Est.</th>
                  <th className="py-3 px-2 font-bold">Value Verdict</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((p, i) => (
                  <tr key={i} className="border-b border-zinc-100 hover:bg-zinc-50 group">
                    <td className="py-3 px-2 font-medium">{p.compound}</td>
                    <td className="py-3 px-2 text-emerald-700 font-medium">{p.researchVendor}</td>
                    <td className="py-3 px-2 text-amber-700">{p.telehealth}</td>
                    <td className="py-3 px-2">{p.monthlyEst}</td>
                    <td className="py-3 px-2 text-zinc-500 text-xs">{p.verdict}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TG Takes */}
          <div className="mt-8 bg-zinc-50 border border-zinc-200 rounded-lg p-5">
            <h3 className="font-bold text-sm mb-3 uppercase tracking-wider text-zinc-500">Tony's Takes</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {PRICES.filter(p => p.tgTake).map((p, i) => (
                <div key={i} className="text-sm">
                  <span className="font-bold">{p.compound.split(" (")[0]}:</span>{" "}
                  <span className="text-zinc-600 italic">"{p.tgTake}"</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STACK COST CALCULATOR ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-2">What Will Your Protocol Actually Cost Per Month?</h2>
          <p className="text-zinc-500 mb-8 text-sm">Select up to 4 compounds. Choose pricing source. See your monthly estimate.</p>

          <div className="flex gap-4 mb-6">
            <button onClick={() => setPricingMode("research")} className={`px-4 py-2 rounded text-sm font-medium ${pricingMode === "research" ? "bg-emerald-700 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}>Research Vendor</button>
            <button onClick={() => setPricingMode("telehealth")} className={`px-4 py-2 rounded text-sm font-medium ${pricingMode === "telehealth" ? "bg-amber-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}>Telehealth / Rx</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-8">
            {CALCULATOR_OPTIONS.map(opt => {
              const isSelected = selectedStack.includes(opt.label);
              const isDisabled = !isSelected && selectedStack.length >= 4;
              const noTelehealth = pricingMode === "telehealth" && opt.telehealthLow === 0;
              return (
                <button
                  key={opt.label}
                  onClick={() => !isDisabled && toggleStack(opt.label)}
                  disabled={isDisabled}
                  className={`px-3 py-2 rounded text-xs font-medium text-left transition-all ${isSelected ? "bg-[#0A0A10] text-white" : isDisabled ? "bg-zinc-50 text-zinc-300 cursor-not-allowed" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"} ${noTelehealth && !isSelected ? "opacity-50" : ""}`}
                >
                  {opt.label}
                  {noTelehealth && <span className="block text-[10px] opacity-60">No Rx path</span>}
                </button>
              );
            })}
          </div>

          {selectedStack.length > 0 && (
            <div className="border-2 border-[#0A0A10] rounded-lg p-6 text-center">
              <p className="text-sm text-zinc-500 mb-2">{selectedStack.length} compound{selectedStack.length > 1 ? "s" : ""} · {pricingMode === "research" ? "Research vendor" : "Telehealth"} pricing</p>
              <p className="text-4xl font-bold mb-1">${stackCost.low} – ${stackCost.high}</p>
              <p className="text-sm text-zinc-500">estimated monthly cost</p>
              {pricingMode === "telehealth" && (
                <p className="mt-3 text-xs text-emerald-700">
                  Research vendor alternative: ${CALCULATOR_OPTIONS.filter(o => selectedStack.includes(o.label)).reduce((s, i) => s + i.researchLow, 0)} – ${CALCULATOR_OPTIONS.filter(o => selectedStack.includes(o.label)).reduce((s, i) => s + i.researchHigh, 0)}/mo
                </p>
              )}
            </div>
          )}

          <p className="mt-6 text-xs text-zinc-400 italic">
            Research vendor sourcing involves regulatory considerations. See <Link href="/whats-legal" className="underline">What's Legal</Link> for full context.
          </p>
        </div>
      </section>

      {/* ── NAVIGATION ── */}
      <section className="py-12 px-6 bg-zinc-100">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-4 justify-center">
          <Link href="/rip-peptide-sciences" className="px-5 py-2 bg-white border border-zinc-200 rounded hover:shadow-md transition-shadow text-sm font-medium">← RIP Peptide Sciences</Link>
          <Link href="/whats-legal" className="px-5 py-2 bg-white border border-zinc-200 rounded hover:shadow-md transition-shadow text-sm font-medium">What's Legal</Link>
          <Link href="/verify-your-coa" className="px-5 py-2 bg-white border border-zinc-200 rounded hover:shadow-md transition-shadow text-sm font-medium">Verify Your COA</Link>
          <Link href="/test-your-peptides" className="px-5 py-2 bg-white border border-zinc-200 rounded hover:shadow-md transition-shadow text-sm font-medium">Test Your Peptides →</Link>
        </div>
      </section>
    </div>
  );
}
