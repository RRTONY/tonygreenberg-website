/**
 * What's Legal — Peptide Regulatory Status Tracker 2026
 * Filterable table with color-coded status chips.
 * Tone: Factual. Slightly sardonic. Not legal advice.
 */
import { useState, useMemo } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";

type Status = "Approved" | "Grey Market" | "Banned" | "Restricted" | "Scheduled";
type RiskLevel = "LOW" | "LOW-MEDIUM" | "MEDIUM" | "HIGH" | "VERY HIGH";

interface PeptideRegEntry {
  compound: string;
  us: string;
  uk: string;
  australia: string;
  rxPath: string;
  userRisk: RiskLevel;
}

const DATA: PeptideRegEntry[] = [
  { compound: "BPC-157", us: "Grey Market", uk: "Grey Market", australia: "Scheduled (S4)", rxPath: "No", userRisk: "LOW" },
  { compound: "TB-500", us: "Grey Market", uk: "Grey Market", australia: "Grey Market", rxPath: "No", userRisk: "LOW" },
  { compound: "Semaglutide", us: "Approved (Rx)", uk: "Approved (Rx)", australia: "Approved (Rx)", rxPath: "Yes (Rx)", userRisk: "VERY HIGH" },
  { compound: "Tirzepatide", us: "Approved (Rx)", uk: "Approved (Rx)", australia: "Approved (Rx)", rxPath: "Yes (Rx)", userRisk: "VERY HIGH" },
  { compound: "Retatrutide", us: "Grey Market", uk: "Grey Market", australia: "Grey Market", rxPath: "No", userRisk: "MEDIUM" },
  { compound: "CJC-1295", us: "Grey Market", uk: "Grey Market", australia: "Grey Market", rxPath: "Limited", userRisk: "LOW" },
  { compound: "Ipamorelin", us: "Grey Market", uk: "Grey Market", australia: "Grey Market", rxPath: "Limited", userRisk: "LOW" },
  { compound: "PT-141", us: "Approved (HSDD)", uk: "Grey Market", australia: "Grey Market", rxPath: "Yes (Rx)", userRisk: "LOW" },
  { compound: "Selank", us: "Grey Market", uk: "Grey Market", australia: "Grey Market", rxPath: "No", userRisk: "LOW" },
  { compound: "Semax", us: "Grey Market", uk: "Grey Market", australia: "Grey Market", rxPath: "No", userRisk: "LOW" },
  { compound: "Epithalon", us: "Grey Market", uk: "Grey Market", australia: "Grey Market", rxPath: "No", userRisk: "LOW" },
  { compound: "GHK-Cu", us: "Grey Market", uk: "Grey Market", australia: "Grey Market", rxPath: "No", userRisk: "LOW" },
  { compound: "AOD-9604", us: "Grey Market", uk: "Grey Market", australia: "TGA rejected", rxPath: "No", userRisk: "LOW-MEDIUM" },
  { compound: "MOTS-c", us: "Grey Market", uk: "Grey Market", australia: "Grey Market", rxPath: "No", userRisk: "LOW" },
  { compound: "SS-31", us: "Grey Market", uk: "Grey Market", australia: "Grey Market", rxPath: "No", userRisk: "LOW" },
  { compound: "Thymosin Alpha-1", us: "Grey Market", uk: "Approved (some)", australia: "Grey Market", rxPath: "Limited", userRisk: "LOW" },
  { compound: "Dihexa", us: "Grey Market", uk: "Grey Market", australia: "Grey Market", rxPath: "No", userRisk: "LOW" },
];

function StatusChip({ status }: { status: string }) {
  let color = "bg-zinc-200 text-zinc-700";
  if (status.includes("Approved")) color = "bg-emerald-100 text-emerald-800";
  if (status.includes("Grey")) color = "bg-amber-100 text-amber-800";
  if (status.includes("Banned") || status.includes("Scheduled")) color = "bg-red-100 text-red-800";
  if (status.includes("rejected")) color = "bg-red-100 text-red-800";
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${color}`}>{status}</span>;
}

function RiskChip({ risk }: { risk: RiskLevel }) {
  const colors: Record<RiskLevel, string> = {
    "LOW": "bg-emerald-100 text-emerald-800",
    "LOW-MEDIUM": "bg-lime-100 text-lime-800",
    "MEDIUM": "bg-amber-100 text-amber-800",
    "HIGH": "bg-orange-100 text-orange-800",
    "VERY HIGH": "bg-red-100 text-red-800",
  };
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${colors[risk]}`}>{risk}</span>;
}

export default function WhatsLegal() {
  const [filter, setFilter] = useState<"all" | "low" | "medium" | "high">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let items = DATA;
    if (filter === "low") items = items.filter(d => d.userRisk === "LOW");
    if (filter === "medium") items = items.filter(d => ["LOW-MEDIUM", "MEDIUM"].includes(d.userRisk));
    if (filter === "high") items = items.filter(d => ["HIGH", "VERY HIGH"].includes(d.userRisk));
    if (search) items = items.filter(d => d.compound.toLowerCase().includes(search.toLowerCase()));
    return items;
  }, [filter, search]);

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
        title="What's Legal? — Peptide Regulatory Status by Country (2026)"
        description="The 2025–2026 FDA enforcement wave targeted vendors, not users. Here's the actual legal status of every major peptide across the US, UK, and Australia."
        path="/whats-legal"
        indexable={true}
      />

      {/* ── HERO ── */}
      <section className="bg-[#0A0A10] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-xs tracking-[0.25em] text-[#C84B2A] mb-6 uppercase">Regulatory Intelligence · Updated May 2026</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
            The Actual Legal Status of Every Peptide
            <br />
            <span className="text-[#C84B2A]">That Matters.</span>
          </h1>
          <p className="text-lg text-zinc-300 max-w-3xl leading-relaxed">
            Not legal advice. Not a scare piece. Just the facts — compound by compound, country by country — so you can make informed decisions about your own body.
          </p>
        </div>
      </section>

      {/* ── CONTEXT BOX ── */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="font-bold text-amber-900 mb-2">Context (not preachy, just real):</h3>
          <p className="text-amber-800 leading-relaxed text-sm">
            The 2025–2026 FDA enforcement wave targeted vendors, not users. No user has been prosecuted for personal peptide possession in the US. The legal risk sits with suppliers making health claims, not researchers using compounds quietly and responsibly. That said: BPC-157 is scheduled in Australia. GLP-1 compounds are a litigation minefield. And Colorado is actively considering state-level peptide transparency legislation. The landscape is moving.
          </p>
        </div>
      </section>

      {/* ── FILTERS + TABLE ── */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <input
              type="text"
              placeholder="Search compound..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 border border-zinc-200 rounded text-sm w-60 focus:outline-none focus:ring-2 focus:ring-[#C84B2A]/30"
            />
            <div className="flex gap-2">
              {(["all", "low", "medium", "high"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded text-xs font-medium capitalize ${filter === f ? "bg-[#0A0A10] text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}
                >
                  {f === "all" ? "All" : `${f} risk`}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-zinc-200 text-left">
                  <th className="py-3 px-2 font-bold">Compound</th>
                  <th className="py-3 px-2 font-bold">US Status</th>
                  <th className="py-3 px-2 font-bold">UK Status</th>
                  <th className="py-3 px-2 font-bold">Australia</th>
                  <th className="py-3 px-2 font-bold text-center">Rx Path?</th>
                  <th className="py-3 px-2 font-bold text-center">User Risk</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => (
                  <tr key={i} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="py-3 px-2 font-medium">{d.compound}</td>
                    <td className="py-3 px-2"><StatusChip status={d.us} /></td>
                    <td className="py-3 px-2"><StatusChip status={d.uk} /></td>
                    <td className="py-3 px-2"><StatusChip status={d.australia} /></td>
                    <td className="py-3 px-2 text-center text-xs">{d.rxPath}</td>
                    <td className="py-3 px-2 text-center"><RiskChip risk={d.userRisk} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-zinc-400 py-8">No compounds match your filter.</p>
          )}
        </div>
      </section>

      {/* ── KEY DISTINCTIONS ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl font-bold mb-6">Key Distinctions That Actually Matter</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-emerald-500 pl-4">
              <h3 className="font-bold mb-1">"Grey Market" ≠ "Illegal"</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">Grey market means not FDA-approved for human use but not explicitly banned for research purposes. The "research only" label is the legal distinction that has protected this market for a decade. It's thin. But it's real.</p>
            </div>
            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="font-bold mb-1">"Approved (Rx)" = Pharma Owns It</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">Semaglutide and tirzepatide are FDA-approved drugs. Selling grey-market versions puts vendors in direct conflict with Eli Lilly and Novo Nordisk. The user risk is low. The vendor risk is existential.</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-bold mb-1">"Scheduled" = Actually Controlled</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">In Australia, BPC-157 is now Schedule 4 (prescription only). Possession without a script carries legal consequences. This is not grey — it's black and white.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── NAVIGATION ── */}
      <section className="py-12 px-6 bg-zinc-100">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-4 justify-center">
          <Link href="/rip-peptide-sciences" className="px-5 py-2 bg-white border border-zinc-200 rounded hover:shadow-md transition-shadow text-sm font-medium">← RIP Peptide Sciences</Link>
          <Link href="/verify-your-coa" className="px-5 py-2 bg-white border border-zinc-200 rounded hover:shadow-md transition-shadow text-sm font-medium">Verify Your COA →</Link>
          <Link href="/price-tracker" className="px-5 py-2 bg-white border border-zinc-200 rounded hover:shadow-md transition-shadow text-sm font-medium">Price Tracker →</Link>
          <Link href="/test-your-peptides" className="px-5 py-2 bg-white border border-zinc-200 rounded hover:shadow-md transition-shadow text-sm font-medium">Test Your Peptides →</Link>
        </div>
      </section>
    </div>
  );
}
