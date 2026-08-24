/**
 * Verify Your COA — Interactive 7-Point Checklist
 * How to read a peptide COA and spot fakes.
 * Tone: Like a slightly exasperated but ultimately helpful friend.
 */
import { useState } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";

interface CheckItem {
  id: number;
  title: string;
  description: string;
  passLabel: string;
}

const CHECKLIST: CheckItem[] = [
  { id: 1, title: "The Lab Is Named and Findable", description: "The issuing lab should have a name, a website, and an accreditation you can look up independently. \"Internal Quality Lab\" is not a lab. Check: A2LA.org (US) or the ILAC database (international).", passLabel: "Named, accredited, independently queryable" },
  { id: 2, title: "It Is ISO/IEC 17025 Accredited", description: "This is the international standard for testing laboratories. If a lab doesn't hold this accreditation, their results carry no independent weight.", passLabel: "Accreditation confirmed on official registry" },
  { id: 3, title: "It Is Batch-Specific (Not Generic)", description: "Your COA should reference the exact lot number on your vials. \"Generic product testing\" means the document applies to some vial from some batch at some point. Useless.", passLabel: "Lot/batch number matches your order" },
  { id: 4, title: "HPLC Purity Is 98% or Higher (99%+ Is Better)", description: "High-Performance Liquid Chromatography measures purity. Below 98% is a problem. 95% means 5 out of every 100 molecules are something else. That matters.", passLabel: "98% minimum documented" },
  { id: 5, title: "Mass Spectrometry Confirms Molecular Identity", description: "Purity tells you how clean the sample is. Mass spectrometry tells you what it actually is. You want both. A 99% pure sample of the wrong compound is a 99% pure problem.", passLabel: "MS confirmation present" },
  { id: 6, title: "Endotoxin Testing Is Included", description: "A peptide can be 99% pure and still contain dangerous levels of bacterial endotoxins from manufacturing contamination. Most COAs skip this. It shouldn't be skipped.", passLabel: "Endotoxin test result documented" },
  { id: 7, title: "You Can Verify It Yourself Without the Vendor", description: "The gold standard: Janoshik Analytical (janoshik.com). Every Janoshik-tested batch gets a public reference ID. You go to their site, enter the ID, see the original results. No vendor. No PDF. No trust required — just verification.", passLabel: "Public verification pathway exists" },
];

function getScoreLabel(score: number): { label: string; color: string; description: string } {
  if (score === 7) return { label: "CLEAN", color: "text-emerald-700 bg-emerald-50 border-emerald-200", description: "This vendor is doing it right." };
  if (score >= 5) return { label: "QUESTIONABLE", color: "text-amber-700 bg-amber-50 border-amber-200", description: "Ask for the missing items before ordering." };
  if (score >= 3) return { label: "RED FLAG", color: "text-orange-700 bg-orange-50 border-orange-200", description: "Don't order until gaps are resolved." };
  return { label: "WALK AWAY", color: "text-red-700 bg-red-50 border-red-200", description: "This is not a vendor to trust with anything that ends up in your body." };
}

export default function VerifyYourCoa() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const score = Object.values(checked).filter(Boolean).length;
  const scoreInfo = getScoreLabel(score);

  const toggle = (id: number) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
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
        title="How to Read a Peptide COA — 7 Red Flags"
        description="Every peptide vendor will hand you a Certificate of Analysis. Most will look official. Many are internal documents the vendor made themselves. Here's how to tell the difference in under five minutes."
        path="/verify-your-coa"
        indexable={true}
      />

      {/* ── HERO ── */}
      <section className="bg-[#0A0A10] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-xs tracking-[0.25em] text-[#C84B2A] mb-6 uppercase">COA Verification Guide</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
            A COA Is Only As Good As the Lab
            <br />
            <span className="text-[#C84B2A]">That Wrote It.</span>
          </h1>
          <p className="text-lg text-zinc-300 max-w-3xl leading-relaxed">
            And a lot of labs did not write the ones you've been given. Every peptide vendor will hand you a Certificate of Analysis. Most will look official. Many are internal documents the vendor made themselves. Some are the same document copy-pasted with different dates. Here is how to tell the difference in under five minutes.
          </p>
        </div>
      </section>

      {/* ── INTERACTIVE CHECKLIST ── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-bold mb-8">The 7-Point COA Checklist</h2>
          <p className="text-zinc-500 mb-8 text-sm">Check each item your COA passes. Your live score updates below.</p>

          <div className="space-y-4 mb-12">
            {CHECKLIST.map(item => (
              <div
                key={item.id}
                onClick={() => toggle(item.id)}
                className={`border rounded-lg p-5 cursor-pointer transition-all ${checked[item.id] ? "border-emerald-400 bg-emerald-50/50" : "border-zinc-200 bg-white hover:border-zinc-300"}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${checked[item.id] ? "bg-emerald-600 border-emerald-600" : "border-zinc-300"}`}>
                    {checked[item.id] && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base mb-1">{item.id}. {item.title}</h3>
                    <p className="text-zinc-600 text-sm leading-relaxed mb-2">{item.description}</p>
                    <p className="text-xs text-emerald-700 font-medium">✓ Pass = {item.passLabel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── LIVE SCORE ── */}
          <div className={`border-2 rounded-lg p-6 text-center ${scoreInfo.color}`}>
            <p className="text-4xl font-bold mb-1">{score}/7</p>
            <p className="text-xl font-bold mb-2">{scoreInfo.label}</p>
            <p className="text-sm">{scoreInfo.description}</p>
          </div>
        </div>
      </section>

      {/* ── BONUS: TWO-MINUTE CHECK ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl font-bold mb-6">The Two-Minute Check</h2>
          <p className="text-zinc-600 mb-6">If a vendor says they use Janoshik:</p>
          <ol className="space-y-4 mb-8">
            <li className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-[#0A0A10] text-white flex items-center justify-center text-xs font-bold shrink-0">1</span>
              <span className="text-zinc-700">Find the batch reference ID (on the product page or COA PDF)</span>
            </li>
            <li className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-[#0A0A10] text-white flex items-center justify-center text-xs font-bold shrink-0">2</span>
              <span className="text-zinc-700">Go to <a href="https://janoshik.com" target="_blank" rel="noopener noreferrer" className="text-[#C84B2A] underline">janoshik.com</a></span>
            </li>
            <li className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-[#0A0A10] text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>
              <span className="text-zinc-700">Enter the ID in their search</span>
            </li>
            <li className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-[#0A0A10] text-white flex items-center justify-center text-xs font-bold shrink-0">4</span>
              <span className="text-zinc-700">See the actual lab results — date, compound, purity, method</span>
            </li>
          </ol>
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 text-sm text-zinc-600 space-y-2">
            <p>If the ID doesn't exist on Janoshik's database, <strong>something is wrong.</strong></p>
            <p>If there is no ID at all, the claim is <strong>unverifiable.</strong></p>
            <p>If the results don't match what the vendor told you, <strong>you know what that means.</strong></p>
          </div>
        </div>
      </section>

      {/* ── NAVIGATION ── */}
      <section className="py-12 px-6 bg-zinc-100">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-4 justify-center">
          <Link href="/rip-peptide-sciences" className="px-5 py-2 bg-white border border-zinc-200 rounded hover:shadow-md transition-shadow text-sm font-medium">← RIP Peptide Sciences</Link>
          <Link href="/whats-legal" className="px-5 py-2 bg-white border border-zinc-200 rounded hover:shadow-md transition-shadow text-sm font-medium">What's Legal</Link>
          <Link href="/price-tracker" className="px-5 py-2 bg-white border border-zinc-200 rounded hover:shadow-md transition-shadow text-sm font-medium">Price Tracker →</Link>
          <Link href="/test-your-peptides" className="px-5 py-2 bg-white border border-zinc-200 rounded hover:shadow-md transition-shadow text-sm font-medium">Test Your Peptides →</Link>
        </div>
      </section>
    </div>
  );
}
