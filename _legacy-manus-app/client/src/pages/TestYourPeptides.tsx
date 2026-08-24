/**
 * Test Your Peptides — Independent Verification Resources
 * Four ways to know what's actually in your vials.
 * Tone: Practical. Slightly nerdy. Like a hardware hacker who cares about what goes in their body.
 */
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { BioChainCTA } from "@/components/BioChainCTA";

interface TestOption {
  number: number;
  title: string;
  subtitle: string;
  site?: string;
  siteUrl?: string;
  whatItDoes: string;
  cost: string;
  turnaround?: string;
  bestFor: string;
  tonyNote: string;
}

const OPTIONS: TestOption[] = [
  {
    number: 1,
    title: "Janoshik Analytical",
    subtitle: "The Gold Standard",
    site: "janoshik.com",
    siteUrl: "https://janoshik.com",
    whatItDoes: "Independent third-party HPLC + mass spectrometry. Batch IDs publicly queryable on their own database.",
    cost: "~$30–$60 per sample",
    turnaround: "5–10 business days",
    bestFor: "Verifying a new vendor before committing to a protocol.",
    tonyNote: "If your vendor doesn't use Janoshik, ask why. If they say 'we use our own lab,' that's your answer.",
  },
  {
    number: 2,
    title: "Community Batch Testing",
    subtitle: "Crowd-Sourced",
    site: "r/Peptides",
    siteUrl: "https://reddit.com/r/peptides",
    whatItDoes: "Community members submit independent tests of specific vendor batches. Results posted publicly.",
    cost: "Free to read. ~$50–$100 to contribute a test.",
    bestFor: "Cross-referencing before a new supplier relationship.",
    tonyNote: "Noisy but useful. Weight posts with more than one corroborating test. One negative result from one anonymous user is a data point, not a verdict.",
  },
  {
    number: 3,
    title: "Eroids Vendor Ratings",
    subtitle: "Community Intelligence",
    site: "eroids.com",
    siteUrl: "https://eroids.com",
    whatItDoes: "Long-form vendor reviews, lab test postings, community trust scores built over years.",
    cost: "Free",
    bestFor: "Longitudinal vendor reputation — who has been consistent for 12+ months, not just this month.",
    tonyNote: "The market post-March 2026 is flooded with new vendors. Eroids history predating the Peptide Sciences shutdown is the most trustworthy signal you have.",
  },
  {
    number: 4,
    title: "Telehealth / Compounding Pharmacy Route",
    subtitle: "The Premium Path",
    whatItDoes: "Physician-prescribed peptides from licensed 503A or 503B compounding pharmacies carry USP standards and pharmacy board oversight.",
    cost: "3–10x the grey market price",
    bestFor: "Anyone who wants zero regulatory risk and can afford the premium.",
    tonyNote: "It's the right call for some people. It's also $400–$900/month for semaglutide vs. $120–$250 elsewhere. That math is part of the decision.",
  },
];

export default function TestYourPeptides() {
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
        title="How to Independently Test Peptides in 2026"
        description="Don't Trust. Verify. Four ways to know what's actually in your vials — without taking anyone's word for it."
        path="/test-your-peptides"
        indexable={true}
      />

      {/* ── HERO ── */}
      <section className="bg-[#0A0A10] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-xs tracking-[0.25em] text-[#C84B2A] mb-6 uppercase">Verification Resources</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
            Don't Trust. <span className="text-[#C84B2A]">Verify.</span>
          </h1>
          <p className="text-xl text-zinc-300 mb-4">Four ways to know what's actually in your vials — without taking anyone's word for it.</p>
          <p className="text-base text-zinc-400 max-w-3xl leading-relaxed">
            The PeptideSciences collapse was a reminder that even large, trusted vendors can disappear overnight, and their quality documentation goes with them. Independent verification isn't paranoia. It's basic due diligence. Here are the four best options available right now, from cheapest to most rigorous.
          </p>
        </div>
      </section>

      {/* ── OPTIONS ── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {OPTIONS.map(opt => (
            <div key={opt.number} className="bg-white border border-zinc-200 rounded-lg p-6 md:p-8 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <span className="w-10 h-10 rounded-full bg-[#0A0A10] text-white flex items-center justify-center text-lg font-bold shrink-0">{opt.number}</span>
                <div>
                  <h2 className="font-serif text-2xl font-bold">{opt.title}</h2>
                  <p className="text-sm text-[#C84B2A] font-medium">{opt.subtitle}</p>
                </div>
              </div>

              {opt.site && (
                <p className="text-sm mb-3">
                  <span className="text-zinc-500">Site:</span>{" "}
                  <a href={opt.siteUrl} target="_blank" rel="noopener noreferrer" className="text-[#C84B2A] underline">{opt.site}</a>
                </p>
              )}

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">What It Does</p>
                  <p className="text-sm text-zinc-700 leading-relaxed">{opt.whatItDoes}</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Cost</p>
                    <p className="text-sm text-zinc-700">{opt.cost}</p>
                  </div>
                  {opt.turnaround && (
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Turnaround</p>
                      <p className="text-sm text-zinc-700">{opt.turnaround}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Best For</p>
                    <p className="text-sm text-zinc-700">{opt.bestFor}</p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-50 border-l-4 border-[#C84B2A] p-4 rounded-r">
                <p className="text-sm text-zinc-700 italic">"{opt.tonyNote}"</p>
                <p className="text-xs text-zinc-400 mt-1">— TG</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BioChain CTA */}
      <div className="max-w-4xl mx-auto px-6">
        <BioChainCTA variant="both" context="Verified bio-sourcing for peptides, stem cells, and exosomes. Supplier and buyer intake at RampRate." />
      </div>
      {/* ── NAVIGATION ── */}
      <section className="py-12 px-6 bg-zinc-100">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-4 justify-center">
          <Link href="/rip-peptide-sciences" className="px-5 py-2 bg-white border border-zinc-200 rounded hover:shadow-md transition-shadow text-sm font-medium">← RIP Peptide Sciences</Link>
          <Link href="/whats-legal" className="px-5 py-2 bg-white border border-zinc-200 rounded hover:shadow-md transition-shadow text-sm font-medium">What's Legal</Link>
          <Link href="/verify-your-coa" className="px-5 py-2 bg-white border border-zinc-200 rounded hover:shadow-md transition-shadow text-sm font-medium">Verify Your COA</Link>
          <Link href="/price-tracker" className="px-5 py-2 bg-white border border-zinc-200 rounded hover:shadow-md transition-shadow text-sm font-medium">Price Tracker</Link>
          <Link href="/peptide-watch" className="px-5 py-2 bg-white border border-zinc-200 rounded hover:shadow-md transition-shadow text-sm font-medium">← Back to Peptide Watch</Link>
        </div>
      </section>
    </div>
  );
}
