/**
 * RIP Peptide Sciences — The Obituary Page
 * What happened, why, and where to go now.
 * Tone: Dry, precise, a little dark. Tony's voice.
 */
import { useState } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { BioChainCTA } from "@/components/BioChainCTA";

/* ── TIMELINE DATA ── */
const TIMELINE = [
  { date: "2009", headline: "Domain registered.", detail: "PeptideSciences.com comes online. A new era of grey-market peptide sales begins. Nobody claps. Nobody is watching yet." },
  { date: "2024 Q4", headline: "FDA begins warning letter campaign.", detail: "SwissChems, Xcel Peptides, Prime Peptides among the named. Over 50 letters sent in 2025 alone. The agency is not playing." },
  { date: "Early 2025", headline: "Eli Lilly and Novo Nordisk lawyer up.", detail: "The pharmaceutical giants whose patented GLP-1 drugs were being sold as \"research chemicals\" at a discount decide this is fine to no longer tolerate. Lawsuits filed against grey-market suppliers." },
  { date: "June 2025", headline: "Federal agents raid a major competing warehouse.", detail: "Not Peptide Sciences. Close enough to notice." },
  { date: "Dec 2025", headline: "Peptide Sciences clocks $7.4M in monthly online sales.", detail: "(Source: Grips Intelligence analytics.) Business is booming. Something is coming." },
  { date: "March 6, 2026", headline: "~2:00 PM Eastern. Three sentences. Gone.", detail: "\"We have voluntarily decided to shut down operations and discontinue the sale of all research products. Thank you for your support over the years.\" No refund process. No pending order guidance. No forwarding address. 1 million+ monthly visitors: redirected nowhere. Researchers mid-protocol: on their own." },
  { date: "March 2026+", headline: "Fake Peptide Sciences sites appear.", detail: "Using their branding. Targeting displaced customers. Any site claiming to be Peptide Sciences after March 6, 2026 is a scam. There are no exceptions to this rule." },
];

/* ── REASONS DATA ── */
const REASONS = [
  { title: "Regulatory Pressure", likelihood: "HIGH", color: "bg-red-600", description: "The FDA enforcement wave was accelerating. The \"research only\" label that protected vendors for a decade was being called a loophole, not a legal distinction. $7.4M/month makes you a visible target." },
  { title: "Pharma Litigation", likelihood: "HIGH", color: "bg-red-600", description: "Selling research-grade semaglutide and tirzepatide — molecules patented and controlled by Eli Lilly and Novo Nordisk — puts you directly in the crosshairs of companies with unlimited legal budgets." },
  { title: "Payment Processing Collapse", likelihood: "MEDIUM", color: "bg-amber-500", description: "Peptide vendors are classified high-risk by payment processors. When a merchant account is terminated, a $7M/month business can lose its ability to process cards overnight. No payments = no business, regardless of everything else." },
];

/* ── VENDOR SCORECARD ── */
const VENDORS = [
  { vendor: "Ascension Peptides", score: 88, coa: "Independent", purity: "99%+", usShip: "Yes", notes: "Consistent community track record" },
  { vendor: "Core Peptides", score: 86, coa: "ISO/IEC 17025", purity: "99%+", usShip: "Yes", notes: "HPLC + MS every batch" },
  { vendor: "Peptide Pros", score: 84, coa: "Independent", purity: "99%+", usShip: "Yes", notes: "Selective catalog, premium tier" },
  { vendor: "EZ Peptides", score: 79, coa: "Independent", purity: "98%+", usShip: "Yes", notes: "Widest catalog post-shutdown" },
  { vendor: "Iron Mountain Labz", score: 74, coa: "Third-party", purity: "98%+", usShip: "Yes", notes: "409 listings, mid-market" },
  { vendor: "QSC Sigma", score: 72, coa: "Janoshik", purity: "99%+", usShip: "Yes", notes: "International origin, public verify" },
  { vendor: "Penguin Peptides", score: 71, coa: "Independent", purity: "98%+", usShip: "Yes", notes: "Best COA page accessibility" },
  { vendor: "SwissChems", score: 48, coa: "Mixed", purity: "Variable", usShip: "Yes", notes: "FDA warning letter on file — flagged" },
  { vendor: "Paradigm Peptides", score: 22, coa: "Unverified", purity: "Unknown", usShip: "Unknown", notes: "Federal prosecution case — avoid" },
];

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "bg-emerald-600" : score >= 60 ? "bg-amber-500" : "bg-red-600";
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold text-white ${color}`}>{score}</span>;
}

export default function RipPeptideSciences() {
  const [sortBy, setSortBy] = useState<"score" | "vendor">("score");
  const sorted = [...VENDORS].sort((a, b) => sortBy === "score" ? b.score - a.score : a.vendor.localeCompare(b.vendor));

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#0A0A10]">
      <SEO
        title="What Happened to Peptide Sciences? (They Pulled a Houdini)"
        description="On March 6, 2026, Peptide Sciences — $7.4M/month, decade-long run — posted three sentences and vanished. No refunds. No forwarding address. No explanation. Here's everything we know."
        path="/rip-peptide-sciences"
        indexable={true}
      />

      {/* ── HERO ── */}
      <section className="bg-[#0A0A10] text-white py-20 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="font-mono text-xs tracking-[0.25em] text-[#C84B2A] mb-6 uppercase">
            March 6, 2026 · 2:00 PM Eastern · Gone
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight mb-6">
            They Made $7.4 Million a Month.
            <br />
            <span className="text-[#C84B2A]">Then Posted Three Sentences and Disappeared.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-3xl leading-relaxed">
            The complete autopsy of the Peptide Sciences shutdown — what happened, why it happened, what it means for your protocol, and where to go now. No panic. Just facts.
          </p>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-12 text-center">The Timeline</h2>
          <div className="relative border-l-2 border-[#C84B2A]/30 ml-4 md:ml-8">
            {TIMELINE.map((entry, i) => (
              <div key={i} className="mb-10 ml-8 relative">
                <div className="absolute -left-[2.6rem] top-1 w-4 h-4 rounded-full bg-[#C84B2A] border-4 border-[#FAFAF7]" />
                <p className="font-mono text-xs text-[#C84B2A] tracking-wider uppercase mb-1">{entry.date}</p>
                <h3 className="font-bold text-lg mb-1">{entry.headline}</h3>
                <p className="text-zinc-600 leading-relaxed">{entry.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY IT HAPPENED ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-2 text-center">Three Reasons. One of Them Is Probably the Real One.</h2>
          <p className="text-center text-zinc-500 mb-10 text-sm">Why It Actually Happened</p>
          <div className="grid md:grid-cols-3 gap-6">
            {REASONS.map((r, i) => (
              <div key={i} className="border border-zinc-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">{r.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${r.color}`}>{r.likelihood}</span>
                </div>
                <p className="text-zinc-600 text-sm leading-relaxed">{r.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-zinc-500 italic text-center max-w-3xl mx-auto">
            "Did the FDA actually shut them down? No official action has been confirmed. The voluntary framing suggests a calculated exit — leaving on their own terms before someone else decided."
          </p>
        </div>
      </section>

      {/* ── COA SECTION ── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-4">Their COA Problem (And What a Real COA Looks Like)</h2>
          <p className="text-zinc-600 leading-relaxed mb-6">
            Peptide Sciences provided Certificates of Analysis. But theirs were internal — meaning the company tested its own products and handed you a document. There was no independent way to verify those results. It's like a restaurant grading its own health inspection.
          </p>
          <p className="text-zinc-600 leading-relaxed mb-6">
            A real COA comes from an accredited third-party lab — ISO/IEC 17025 certified — with a batch ID you can query directly on the lab's own public database, without the vendor in the loop at all.
          </p>
          <p className="text-zinc-600 leading-relaxed mb-8">
            The gold standard right now: <strong>Janoshik Analytical</strong> (janoshik.com). Every batch gets a unique reference ID. You go to their site, type in the ID, see the original unmodified lab results. No PDF that could be photoshopped. No vendor-controlled data.
          </p>
          <Link href="/verify-your-coa" className="inline-flex items-center gap-2 bg-[#0A0A10] text-white px-6 py-3 rounded font-mono text-sm tracking-wider hover:bg-zinc-800 transition-colors">
            LEARN HOW TO VERIFY ANY COA YOURSELF →
          </Link>
        </div>
      </section>

      {/* ── VENDOR SCORECARD ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-2">7 Vendors. Scored Without Bias. Or Paid Placements.</h2>
          <p className="text-zinc-500 mb-2">(Yes, this is unusual. We know.)</p>
          <p className="text-xs font-mono text-zinc-400 mb-8 uppercase tracking-wider">Research vendor market, May 2026</p>

          <div className="flex gap-4 mb-6">
            <button onClick={() => setSortBy("score")} className={`px-3 py-1 rounded text-sm font-medium ${sortBy === "score" ? "bg-[#0A0A10] text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}>Sort by Score</button>
            <button onClick={() => setSortBy("vendor")} className={`px-3 py-1 rounded text-sm font-medium ${sortBy === "vendor" ? "bg-[#0A0A10] text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"}`}>Sort by Name</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-zinc-200 text-left">
                  <th className="py-3 px-2 font-bold">Vendor</th>
                  <th className="py-3 px-2 font-bold text-center">Score</th>
                  <th className="py-3 px-2 font-bold">COA Type</th>
                  <th className="py-3 px-2 font-bold">Purity</th>
                  <th className="py-3 px-2 font-bold text-center">US Ship</th>
                  <th className="py-3 px-2 font-bold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((v, i) => (
                  <tr key={i} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="py-3 px-2 font-medium">{v.vendor}</td>
                    <td className="py-3 px-2 text-center"><ScoreBadge score={v.score} /></td>
                    <td className="py-3 px-2">{v.coa}</td>
                    <td className="py-3 px-2">{v.purity}</td>
                    <td className="py-3 px-2 text-center">{v.usShip}</td>
                    <td className="py-3 px-2 text-zinc-500">{v.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-xs text-zinc-400 leading-relaxed">
            Scores based on publicly available data: COA independence, purity documentation, community track records on r/Peptides and Eroids, FDA warning letter registry, and court records. No vendor paid for inclusion or ranking.
          </p>
        </div>
      </section>

      {/* ── TONY QUOTE ── */}
      <section className="py-16 px-6 bg-[#0A0A10] text-white">
        <div className="max-w-3xl mx-auto">
          <blockquote className="border-l-4 border-[#C84B2A] pl-6">
            <p className="text-lg leading-relaxed italic mb-4">
              "The PeptideSciences collapse is a textbook example of what happens when infrastructure is built on opacity instead of trust. A decade, $7M/month, and it ended with three sentences. Find My Peptides exists because the information layer should never be controlled by the same people selling you something."
            </p>
            <cite className="text-zinc-400 not-italic">— Tony Greenberg</cite>
          </blockquote>
        </div>
      </section>

      {/* BioChain CTA */}
      <div className="max-w-4xl mx-auto px-6">
        <BioChainCTA variant="supplier" context="Verified bio-sourcing for peptides, stem cells, and exosomes. Supplier intake at RampRate." />
      </div>
      {/* ── NAVIGATION ── */}
      <section className="py-12 px-6 bg-zinc-100">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-4 justify-center">
          <Link href="/whats-legal" className="px-5 py-2 bg-white border border-zinc-200 rounded hover:shadow-md transition-shadow text-sm font-medium">What's Legal →</Link>
          <Link href="/verify-your-coa" className="px-5 py-2 bg-white border border-zinc-200 rounded hover:shadow-md transition-shadow text-sm font-medium">Verify Your COA →</Link>
          <Link href="/price-tracker" className="px-5 py-2 bg-white border border-zinc-200 rounded hover:shadow-md transition-shadow text-sm font-medium">Price Tracker →</Link>
          <Link href="/test-your-peptides" className="px-5 py-2 bg-white border border-zinc-200 rounded hover:shadow-md transition-shadow text-sm font-medium">Test Your Peptides →</Link>
          <Link href="/peptide-watch" className="px-5 py-2 bg-white border border-zinc-200 rounded hover:shadow-md transition-shadow text-sm font-medium">← Back to Peptide Watch</Link>
        </div>
      </section>
    </div>
  );
}
