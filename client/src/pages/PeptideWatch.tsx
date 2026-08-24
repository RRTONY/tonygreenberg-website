/**
 * PeptideWatch — The Definitive Consumer Safety Guide
 * Full page with all 10 sections + role-based checklists.
 * Matches the site's editorial broadsheet design system.
 */
import { useState } from "react";
import { Link } from "wouter";
import { BioChainCTA } from "@/components/BioChainCTA";
import SEO from "@/components/SEO";
import {
  HERO_STATS,
  MARKETS,
  TIMELINE,
  WALL_OF_SHAME,
  FRAUD_PATTERNS,
  BUYER_CHECKLIST,
  SCORECARD_CATEGORIES,
  SCORE_TIERS,
  WATCHDOG_PILLARS,
  REPORT_CHANNELS,
  MANUS_LAYERS,
  ROLE_CHECKLISTS,
} from "./peptide-watch-data";

/* ── Badge color map ── */
const badgeColors: Record<string, string> = {
  fda: "bg-red-700 text-white",
  doj: "bg-amber-800 text-white",
  ftc: "bg-orange-700 text-white",
  itc: "bg-indigo-700 text-white",
  state: "bg-teal-700 text-white",
  closed: "bg-zinc-800 text-white",
  nad: "bg-purple-700 text-white",
};

const marketColors: Record<string, string> = {
  cobalt: "border-[#2A5AA0] bg-[#2A5AA0]/5",
  saffron: "border-[#B86A28] bg-[#B86A28]/5",
  terracotta: "border-[#C84B2A] bg-[#C84B2A]/5",
};

export default function PeptideWatch() {
  const [expandedFraud, setExpandedFraud] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState(0);
  const [vendorScores, setVendorScores] = useState<Record<string, number>>({});
  const totalScore = Object.values(vendorScores).reduce((a, b) => a + b, 0);

  return (
    <>
    <SEO
        title="Peptide Watch — Market Intelligence"
        description="Real-time intelligence on peptide markets, supply chains, and regulatory developments. By Tony Greenberg."
        path="/peptide-watch"
        keywords="Tony Greenberg, peptides, BPC-157, TB-500, peptide market, peptide supply chain"
        indexable={true}
      />
      <div className="min-h-screen bg-[#FAFAF7] text-[#0A0A10]">
      {/* ── ALERT BANNER ── */}
      <div className="bg-[#C84B2A] text-white text-center py-3 px-4 text-sm font-semibold tracking-wide">
        BREAKING: Peptide Sciences — the largest U.S. research peptide vendor — voluntarily shut down March 6, 2026. The gray-market era is ending.
      </div>

      {/* ── HERO ── */}
      <section className="bg-[#0A0A10] text-white py-20 px-6 text-center relative overflow-hidden glitch-hero">
        {/* Glassmorphic hero background */}
        <div className="absolute inset-0 opacity-[0.4]">
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_27_0_JXknTuGM5jXLADVhzi2311_1773617447237_na1fn_L2hvbWUvdWJ1bnR1L2hlcm9faW1hZ2U_37b1422a.jpg" alt="" className="w-full h-full object-cover" sizes="100vw" style={{ filter: "brightness(0.5) contrast(1.2)" }} loading="lazy" />
        </div>
        <div className="glitch-hero-scanlines" />
        <div className="glitch-hero-tear" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(184,106,40,0.15)_0%,transparent_60%),radial-gradient(ellipse_at_70%_30%,rgba(42,90,160,0.1)_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-xs font-bold tracking-[3px] text-[#C84B2A] uppercase mb-5">
            The Definitive Supply Chain Safety Guide
          </p>
          <h1 className="font-['Playfair_Display',serif] text-4xl md:text-6xl font-black mb-6 leading-tight">
            The Peptide<br /><em className="text-[#D4B96A]">Watchdog</em> Manual
          </h1>
          <p className="text-[#A09880] max-w-2xl mx-auto text-lg leading-relaxed mb-10">
            12 documented fraud patterns. 30+ named enforcement actions. A complete vendor scoring system.
            A new consumer organization to stop criminals in their tracks. Built on FDA, DOJ, FTC, and ITC public records.
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {HERO_STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-black text-[#D4B96A] font-['Playfair_Display',serif]">{s.num}</div>
                <div className="text-xs text-[#A09880] tracking-wider uppercase mt-1 max-w-[120px]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PEPTIDE ECOSYSTEM NAV ── */}
      <div className="bg-[#0A0A10] border-t border-[#D4B96A]/20 py-4 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-3 text-xs">
          <Link href="/find-your-peptide" className="px-3 py-1.5 bg-[#D4B96A]/10 text-[#D4B96A] rounded hover:bg-[#D4B96A]/20 transition">
            Find My Peptide
          </Link>
          <Link href="/peptide-supply-chain" className="px-3 py-1.5 bg-[#D4B96A]/10 text-[#D4B96A] rounded hover:bg-[#D4B96A]/20 transition">
            Supply Chain Guide
          </Link>
          <Link href="/peptide-hall-of-shame" className="px-3 py-1.5 bg-[#D4B96A]/10 text-[#D4B96A] rounded hover:bg-[#D4B96A]/20 transition">
            Hall of Shame
          </Link>
          <Link href="/peptide-matrix" className="px-3 py-1.5 bg-[#D4B96A]/10 text-[#D4B96A] rounded hover:bg-[#D4B96A]/20 transition">
            Peptide Matrix
          </Link>
          <Link href="/peptide-quiz" className="px-3 py-1.5 bg-[#D4B96A]/10 text-[#D4B96A] rounded hover:bg-[#D4B96A]/20 transition">
            Peptide Quiz
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* ── SECTION 1: THREE MARKETS ── */}
        <section className="mb-20">
          <div className="relative rounded-2xl overflow-hidden mb-8" style={{ boxShadow: "0 8px 40px rgba(139,105,20,0.12)" }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_41_1_v2WYYfU57IwN06VnYMczhd_1773617453105_na1fn_L2hvbWUvdWJ1bnR1L3RocmVlX21hcmtldHM_65067d88.jpg" alt="" className="w-full h-48 md:h-64 object-cover" sizes="100vw" style={{ filter: "brightness(0.85) contrast(1.1)" }} loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-transparent to-transparent" />
            <div className="glitch-scanlines" />
          </div>
          <SectionLabel>The Landscape</SectionLabel>
          <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl font-black mb-4">Three Markets, One Syringe</h2>
          <p className="text-[#3D2A16] leading-relaxed mb-8">
            The peptide market is not one market. It is three stacked on top of each other — and only one of them is safe.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {MARKETS.map((m) => (
              <div key={m.num} className={`border-l-4 ${marketColors[m.color]} rounded-r p-6`}>
                <div className="text-xs font-bold tracking-widest text-[#A09880] mb-1">{m.num}</div>
                <h3 className="font-['Playfair_Display',serif] font-bold text-xl mb-2">{m.title}</h3>
                <p className="text-sm text-[#3D2A16] leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 2: ENFORCEMENT TIMELINE ── */}
        <section className="mb-20">
          <div className="relative rounded-2xl overflow-hidden mb-8" style={{ boxShadow: "0 8px 40px rgba(139,105,20,0.12)" }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_19_2_E8571TfuVcPpzA3l8sDtUG_1773617443569_na1fn_L2hvbWUvdWJ1bnR1L2VuZm9yY2VtZW50X3RpbWVsaW5l_1b5d7c73.jpg" alt="" className="w-full h-48 md:h-64 object-cover" sizes="100vw" style={{ filter: "brightness(0.85) contrast(1.1)" }} loading="lazy" />
            <div className="glitch-scanlines" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-transparent to-transparent" />
          </div>
          <SectionLabel>The Record</SectionLabel>
          <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl font-black mb-4">Enforcement Timeline: 2024–2026</h2>
          <p className="text-[#3D2A16] leading-relaxed mb-8">
            This is not speculation. The criminal and regulatory docket has receipts.
          </p>
          <div className="space-y-0 border-l-2 border-[#D4B96A]/30 ml-4">
            {TIMELINE.map((ev, i) => (
              <div key={i} className="relative pl-8 pb-8">
                <div className="absolute left-[-7px] top-1 w-3 h-3 rounded-full bg-[#D4B96A] border-2 border-[#FAFAF7]" />
                <div className="text-xs font-bold tracking-widest text-[#8B6914] uppercase mb-1">{ev.date}</div>
                <h3 className="font-bold text-base mb-1">{ev.title}</h3>
                <p className="text-sm text-[#3D2A16] leading-relaxed">{ev.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: WALL OF SHAME ── */}
        <section className="mb-20">
          <div className="relative rounded-2xl overflow-hidden mb-8" style={{ boxShadow: "0 8px 40px rgba(200,75,42,0.15)" }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_1_3_MIYsdI7jUuNQa0NltDUgjn_1773617441031_na1fn_L2hvbWUvdWJ1bnR1L3dhbGxfb2Zfc2hhbWU_b1520d85.jpg" alt="" className="w-full h-48 md:h-64 object-cover" sizes="100vw" style={{ filter: "brightness(0.85) contrast(1.1)" }} loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-transparent to-transparent" />
            <div className="glitch-scanlines" />
          </div>
          <SectionLabel>Documented Enforcement</SectionLabel>
          <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl font-black mb-4">The Wall of Shame</h2>
          <p className="text-[#3D2A16] leading-relaxed mb-8">
            Every entry below is sourced from FDA warning letters, DOJ press releases, ITC proceedings, FTC actions, or state attorney general enforcement. No rumor. No Reddit smoke.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#0A0A10] text-white text-left">
                  <th className="p-3 font-bold">Vendor / Entity</th>
                  <th className="p-3 font-bold">Agency</th>
                  <th className="p-3 font-bold">Core Violation</th>
                  <th className="p-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {WALL_OF_SHAME.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-[#F0E8D0]/30" : "bg-white"}>
                    <td className="p-3 font-bold whitespace-nowrap">{row.vendor}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {row.badges.map((b, j) => (
                          <span key={j} className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badgeColors[b.type]}`}>
                            {b.label}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-[#3D2A16] max-w-md">{row.violation}</td>
                    <td className="p-3 font-semibold text-xs whitespace-nowrap">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#A09880] mt-4 italic">
            See also: <Link href="/peptide-hall-of-shame" className="text-[#8B6914] underline">Full Hall of Shame</Link> for additional vendor analysis.
          </p>
        </section>

        {/* ── SECTION 4: 12 FRAUD PATTERNS ── */}
        <section className="mb-20">
          <div className="relative rounded-2xl overflow-hidden mb-8" style={{ boxShadow: "0 8px 40px rgba(139,105,20,0.12)" }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_0_4_MCkiwFGAzWiyKXzYmiwuBZ_1773617441126_na1fn_L2hvbWUvdWJ1bnR1LzEyX2ZyYXVkX3BhdHRlcm5z_d14f102c.jpg" alt="" className="w-full h-48 md:h-64 object-cover" sizes="100vw" style={{ filter: "brightness(0.85) contrast(1.1)" }} loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-transparent to-transparent" />
            <div className="glitch-scanlines" />
          </div>
          <SectionLabel>The Playbook</SectionLabel>
          <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl font-black mb-4">12 Recurring Fraud Patterns</h2>
          <p className="text-[#3D2A16] leading-relaxed mb-8">
            These are not theories. They are the tricks that keep appearing in warning letters, criminal indictments, and enforcement actions. Memorize them.
          </p>
          <div className="space-y-3">
            {FRAUD_PATTERNS.map((fp) => (
              <div
                key={fp.num}
                className="border border-[#D4B96A]/20 rounded cursor-pointer hover:border-[#D4B96A]/50 transition"
                onClick={() => setExpandedFraud(expandedFraud === fp.num ? null : fp.num)}
              >
                <div className="flex items-start gap-4 p-4">
                  <span className="font-['Playfair_Display',serif] text-2xl font-black text-[#C84B2A] shrink-0 w-8">{fp.num}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base">{fp.title}</h3>
                    {expandedFraud === fp.num && (
                      <p className="text-sm text-[#3D2A16] leading-relaxed mt-2">{fp.body}</p>
                    )}
                  </div>
                  <span className="text-[#A09880] shrink-0 text-lg">{expandedFraud === fp.num ? "\u2212" : "+"}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ROLE-BASED CHECKLISTS ── */}
        <section className="mb-20">
          <div className="relative rounded-2xl overflow-hidden mb-8" style={{ boxShadow: "0 8px 40px rgba(139,105,20,0.12)" }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_8_5_uzz3yDoGjZ1TsSejER4qZC_1773617435275_na1fn_L2hvbWUvdWJ1bnR1L3JvbGVfYmFzZWRfY2hlY2tsaXN0cw_c2d85b1a.jpg" alt="" className="w-full h-48 md:h-64 object-cover" sizes="100vw" style={{ filter: "brightness(0.85) contrast(1.1)" }} loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-transparent to-transparent" />
            <div className="glitch-scanlines" />
          </div>
          <SectionLabel>Your Role, Your Checklist</SectionLabel>
          <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl font-black mb-4">Pick Your Checklist</h2>
          <p className="text-[#3D2A16] leading-relaxed mb-8">
            Different stakeholders face different risks. Select your role below to get the checklist built specifically for your position in the peptide supply chain.
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {ROLE_CHECKLISTS.map((rc, i) => (
              <button
                key={rc.role}
                onClick={() => setActiveRole(i)}
                className={`px-4 py-2 rounded text-sm font-bold transition ${
                  activeRole === i
                    ? "text-white shadow-lg"
                    : "bg-[#F0E8D0] text-[#3D2A16] hover:bg-[#E8D8B8]"
                }`}
                style={activeRole === i ? { backgroundColor: rc.color } : {}}
              >
                <span className="mr-1.5">{rc.icon}</span>
                {rc.role}
              </button>
            ))}
          </div>
          {(() => {
            const rc = ROLE_CHECKLISTS[activeRole];
            return (
              <div className="border-l-4 rounded-r p-6 bg-white shadow-sm" style={{ borderColor: rc.color }}>
                <h3 className="font-['Playfair_Display',serif] font-bold text-xl mb-2">
                  {rc.icon} {rc.role} Checklist
                </h3>
                <p className="text-sm text-[#3D2A16] mb-4">{rc.description}</p>
                <ol className="space-y-3">
                  {rc.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <span
                        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5"
                        style={{ backgroundColor: rc.color }}
                      >
                        {j + 1}
                      </span>
                      <span className="text-[#3D2A16] leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })()}
        </section>

        {/* ── SECTION 5: 10-QUESTION BUYER TEST ── */}
        <section className="mb-20">
          <div className="relative rounded-2xl overflow-hidden mb-8" style={{ boxShadow: "0 8px 40px rgba(139,105,20,0.12)" }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_22_6_9L4WV2g0hc1P2OWmepfvJd_1773617434549_na1fn_L2hvbWUvdWJ1bnR1L3NlY3Rpb25fNV9idXllcl90ZXN0_710c424a.jpg" alt="" className="w-full h-48 md:h-64 object-cover" sizes="100vw" style={{ filter: "brightness(0.85) contrast(1.1)" }} loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-transparent to-transparent" />
            <div className="glitch-scanlines" />
          </div>
          <SectionLabel>Your Hard-Core Checklist</SectionLabel>
          <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl font-black mb-4">The 10-Question Supply Chain Test</h2>
          <p className="text-[#3D2A16] leading-relaxed mb-8">
            Use this every single time before accepting any peptide from any source — including a beloved doctor, influencer, concierge clinic, or luxury telehealth platform.
          </p>
          <div className="space-y-4">
            {BUYER_CHECKLIST.map((item) => (
              <div key={item.num} className="bg-white border border-[#D4B96A]/20 rounded p-5">
                <div className="flex items-start gap-4">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-[#0A0A10] text-[#D4B96A] flex items-center justify-center font-bold text-sm">
                    {item.num}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base mb-2">{item.question}</h3>
                    <p className="text-sm text-[#2D7D46] mb-1"><strong>Want:</strong> {item.want}</p>
                    <p className="text-sm text-[#C84B2A]"><strong>{item.fail}</strong></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 6: VENDOR SCORECARD ── */}
        <section className="mb-20">
          <div className="relative rounded-2xl overflow-hidden mb-8" style={{ boxShadow: "0 8px 40px rgba(139,105,20,0.12)" }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_13_7_C1fQmXkqFMlvJ032C4qvEY_1773617444714_na1fn_L2hvbWUvdWJ1bnR1L3ZlbmRvcl9zY29yZWNhcmQ_6009c18d.jpg" alt="" className="w-full h-48 md:h-64 object-cover" sizes="100vw" style={{ filter: "brightness(0.85) contrast(1.1)" }} loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-transparent to-transparent" />
            <div className="glitch-scanlines" />
          </div>
          <SectionLabel>Scoring System</SectionLabel>
          <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl font-black mb-4">The Vendor Scorecard: 10 Categories, 50 Points</h2>
          <p className="text-[#3D2A16] leading-relaxed mb-8">
            Score each supplier 0–5 per category. Minimum acceptable: 35. Under 25 is a walk-away.
          </p>
          <div className="grid md:grid-cols-2 gap-3 mb-8">
            {SCORECARD_CATEGORIES.map((cat) => (
              <div key={cat.letter} className="bg-white border border-[#D4B96A]/20 rounded p-4 flex items-start gap-3">
                <span className="shrink-0 w-8 h-8 rounded bg-[#0A0A10] text-[#D4B96A] flex items-center justify-center font-bold text-sm font-['Playfair_Display',serif]">
                  {cat.letter}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm mb-1">{cat.name}</h4>
                  <p className="text-xs text-[#3D2A16] leading-relaxed">{cat.desc}</p>
                  <div className="mt-2 flex gap-1">
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setVendorScores((prev) => ({ ...prev, [cat.letter]: n }))}
                        className={`w-7 h-7 rounded text-xs font-bold transition ${
                          vendorScores[cat.letter] === n
                            ? "bg-[#8B6914] text-white"
                            : "bg-[#F0E8D0] text-[#3D2A16] hover:bg-[#E8D8B8]"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Score result */}
          {Object.keys(vendorScores).length > 0 && (
            <div className="bg-[#0A0A10] text-white rounded p-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-black font-['Playfair_Display',serif] text-[#D4B96A]">{totalScore} / 50</div>
                <div className="text-sm text-[#A09880] mt-1">
                  {Object.keys(vendorScores).length} of 10 categories scored
                </div>
              </div>
            </div>
          )}

          {/* Interpretation */}
          <div className="space-y-2">
            {SCORE_TIERS.map((tier) => (
              <div key={tier.range} className="flex items-start gap-4 p-3 bg-white rounded border border-[#D4B96A]/10">
                <span className="font-bold text-lg shrink-0 w-16" style={{ color: tier.color }}>{tier.range}</span>
                <div>
                  <div className="font-bold text-sm">{tier.verdict}</div>
                  <div className="text-xs text-[#A09880]">{tier.note}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 7: FINNRICK ── */}
        <section className="mb-20">
          <div className="relative rounded-2xl overflow-hidden mb-8" style={{ boxShadow: "0 8px 40px rgba(139,105,20,0.12)" }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_35_8_fW9NqUzYD9g7z7SGoJBLLT_1773617447285_na1fn_L2hvbWUvdWJ1bnR1L2Zpbm5yaWNrX2FuYWx5dGljcw_9f3833bb.jpg" alt="" className="w-full h-48 md:h-64 object-cover" sizes="100vw" style={{ filter: "brightness(0.85) contrast(1.1)" }} loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-transparent to-transparent" />
            <div className="glitch-scanlines" />
          </div>
          <SectionLabel>Independent Testing</SectionLabel>
          <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl font-black mb-4">Finnrick Analytics: The Only Real Scoreboard</h2>
          <p className="text-[#3D2A16] leading-relaxed mb-6">
            The most important tool in the buyer's verification stack is not a COA. It is Finnrick Analytics, the independent testing platform that has exposed the reality behind vendor claims.
          </p>
          <div className="bg-[#EDE0C4] border-l-4 border-[#B86A28] rounded-r p-6 mb-6">
            <h3 className="font-bold text-lg mb-3">What Finnrick Is</h3>
            <p className="text-sm text-[#3D2A16] leading-relaxed mb-3">
              Finnrick tests peptide samples from consumers and their own procurement — 5,930 samples from 196 vendors across 15 products as of March 2026. Tests run in commercial labs for purity and quantity. Results are published publicly. Vendors are rated A through E. The platform accepts free mail-in samples from U.S. researchers and has recently added optional endotoxin contamination testing.
            </p>
            <p className="text-sm text-[#3D2A16] leading-relaxed mb-3">
              <strong>Website:</strong>{" "}
              <a href="https://www.finnrick.com" target="_blank" rel="noopener noreferrer" className="text-[#8B6914] underline">
                finnrick.com
              </a>{" "}
              — check it before buying anything.
            </p>
            <p className="text-sm text-[#3D2A16] leading-relaxed">
              <strong>Key findings:</strong> BPC-157 quantity divergence of up to plus or minus 80% vs. advertised value at the 95th percentile. Retatrutide counterfeit detection flagged across Peptide Sciences samples in November 2025. Tirzepatide average score of 7.0 across 1,477 samples from 121 vendors. Best-rated vendors for key compounds: Aavant Research (tirzepatide, A rating) and Peptide Partners (BPC-157, A rating).
            </p>
          </div>
          <div className="bg-[#2A5AA0]/5 border border-[#2A5AA0]/20 rounded p-5 text-sm text-[#3D2A16] leading-relaxed">
            <strong className="text-[#2A5AA0]">On blockchain and QR authentication:</strong> FDA's DSCSA pilot program demonstrated feasibility of blockchain-based package-level tracing using MediLedger and 2D Data Matrix barcodes. That is real pharma infrastructure. Most peptide vendor "QR codes" are glorified hyperlinks — they open a webpage, not a tamper-resistant provenance ledger. If the QR does not tie the physical package to a serialized lot history that cannot be casually rewritten, it is mostly decor. Do not mistake it for verification.
          </div>
        </section>

        {/* ── SECTION 8: PEPTIDEWATCH FOUNDATION ── */}
        <section className="mb-20">
          <div className="relative rounded-2xl overflow-hidden mb-8" style={{ boxShadow: "0 8px 40px rgba(42,90,160,0.12)" }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_15_9_yJslhilC8rx2UAMMgYdWcm_1773617449214_na1fn_L2hvbWUvdWJ1bnR1L3NlY3Rpb25fOF9mb3VuZGF0aW9u_83362273.jpg" alt="" className="w-full h-48 md:h-64 object-cover" sizes="100vw" style={{ filter: "brightness(0.85) contrast(1.1)" }} loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-transparent to-transparent" />
            <div className="glitch-scanlines" />
          </div>
          <SectionLabel>The New Architecture</SectionLabel>
          <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl font-black mb-4">PeptideWatch: The Consumer Organization This Market Needs</h2>
          <p className="text-[#3D2A16] leading-relaxed mb-6">
            The enforcement wave is accelerating. The gray market is fragmenting. The window that allowed Peptide Sciences and vendors like it to operate openly is closing. What does not yet exist — and what would stop criminals fastest — is an organized, funded, independent consumer intelligence body with teeth.
          </p>
          <div className="bg-[#2A5AA0] text-white rounded p-8 mb-6">
            <p className="text-xs font-bold tracking-[2px] text-white/50 uppercase mb-3">PeptideWatch Foundation</p>
            <h3 className="font-['Playfair_Display',serif] text-2xl md:text-3xl font-black mb-3">Mission: Stop Criminals at the Source</h3>
            <p className="text-white/85 leading-relaxed mb-6">
              A non-profit consumer safety intelligence organization operating at the intersection of independent testing, regulatory coordination, and public transparency — with the explicit purpose of cutting off fraudulent peptide and compounded drug supply chains before they reach patients.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {WATCHDOG_PILLARS.map((p) => (
                <div key={p.title} className="bg-white/10 rounded p-4">
                  <div className="text-2xl mb-2">{p.icon}</div>
                  <h4 className="font-bold text-sm text-white mb-1">{p.title}</h4>
                  <p className="text-xs text-white/75 leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 9: WHISTLEBLOWER ── */}
        <section className="mb-20">
          <div className="relative rounded-2xl overflow-hidden mb-8" style={{ boxShadow: "0 8px 40px rgba(200,75,42,0.15)" }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_26_10_jdNQ9z5VMCRzCSnTvLtYCx_1773617445869_na1fn_L2hvbWUvdWJ1bnR1L3doaXN0bGVibG93ZXJfaW1hZ2U_33b43bf0.jpg" alt="" className="w-full h-48 md:h-64 object-cover" sizes="100vw" style={{ filter: "brightness(0.85) contrast(1.1)" }} loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-transparent to-transparent" />
            <div className="glitch-scanlines" />
          </div>
          <SectionLabel>Taking Action</SectionLabel>
          <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl font-black mb-4">How to Become a Whistleblower</h2>
          <p className="text-[#3D2A16] leading-relaxed mb-4">
            If you find fraud, do not rant first. Build a file. Then report it through every available channel simultaneously.
          </p>
          <h3 className="font-bold text-lg mb-3">What to Collect Before Reporting</h3>
          <p className="text-sm text-[#3D2A16] leading-relaxed mb-6">
            Product photos, outer packaging, lot numbers, COAs, screenshots of claims, purchase receipts, shipping labels, emails or texts, adverse-event notes, names of prescribers, sellers, and entities involved, any communication from the seller about sourcing or ingredients.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REPORT_CHANNELS.map((ch) => (
              <div key={ch.agency} className="border-2 border-[#0A0A10] rounded p-5 text-center">
                <h4 className="font-['Playfair_Display',serif] font-black text-lg mb-2">{ch.agency}</h4>
                <p className="text-xs text-[#3D2A16] leading-relaxed mb-3">{ch.desc}</p>
                <a
                  href={ch.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#0A0A10] text-[#FAFAF7] px-4 py-2 rounded text-xs font-bold tracking-wider uppercase hover:bg-[#1A1A20] transition"
                >
                  {ch.label} &rarr;
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 10: MANUS MODEL ── */}
        <section className="mb-20">
          <div className="relative rounded-2xl overflow-hidden mb-8" style={{ boxShadow: "0 8px 40px rgba(139,105,20,0.12)" }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_16_11_ecMRcv6t898oag7yBTl2HK_1773617461058_na1fn_L2hvbWUvdWJ1bnR1L3NlY3Rpb24xMF9pbWFnZQ_df7cd3bd.jpg" alt="" className="w-full h-48 md:h-64 object-cover" sizes="100vw" style={{ filter: "brightness(0.85) contrast(1.1)" }} loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF7] via-transparent to-transparent" />
            <div className="glitch-scanlines" />
          </div>
          <SectionLabel>Operational Intelligence</SectionLabel>
          <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl font-black mb-4">The Manus-Optimized Protocol</h2>
          <p className="text-[#3D2A16] leading-relaxed mb-6">
            This guide is architected as a high-efficiency, low-token-use knowledge model for Manus AI deployment. Here is how each component maps to an automated workflow layer.
          </p>
          <div className="space-y-3">
            {MANUS_LAYERS.map((layer) => (
              <div key={layer.num} className="bg-[#2A5AA0]/5 border border-[#2A5AA0]/20 rounded p-4 text-sm">
                <strong className="text-[#2A5AA0]">Layer {layer.num} — {layer.title}:</strong>{" "}
                <span className="text-[#3D2A16]">{layer.body}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── CALLOUT ── */}
        <div className="bg-[#C84B2A] text-white rounded p-8 mb-20">
          <p className="font-['Playfair_Display',serif] text-lg md:text-xl font-bold leading-relaxed">
            "This market has more room for monsters than for magic because the incentives are bent the wrong way. Demand is huge. Margins are huge. Verification is weak. Most buyers outsource skepticism to charisma. Bad idea."
          </p>
        </div>

        {/* ── THE RULE ── */}
        <section className="mb-20">
          <SectionLabel>The Rule</SectionLabel>
          <h2 className="font-['Playfair_Display',serif] text-3xl md:text-4xl font-black mb-4">What You Do Not Know May Not Just Waste Your Money</h2>
          <p className="text-[#3D2A16] leading-relaxed mb-4">
            A great doctor can still be wrong. A sincere clinic can still be wrong. A telehealth brand with 10,000 happy comments can still be wrong.
          </p>
          <p className="text-[#3D2A16] leading-relaxed mb-4">
            Why? Because trust travels socially, while contamination travels physically. One physician trusts a distributor. The distributor trusts an importer. The importer trusts a broker. The broker trusts a Chinese manufacturer. The buyer trusts the physician. By the time the vial hits your hand, everybody feels reassured and nobody has actually verified the chain.
          </p>
          <p className="font-bold text-lg mb-4">
            Never trust reputation. Never trust branding. Never trust a white coat. Never trust a QR code that only opens a webpage. Trust chain of custody, batch data, and independent verification.
          </p>
          <p className="text-[#3D2A16] leading-relaxed mb-2">
            What you do not know in this market may not just waste your money.
          </p>
          <p className="font-bold text-xl text-[#C84B2A]">
            It may poison you.
          </p>
        </section>

        {/* ── BIOCHAIN CTA ── */}
        <BioChainCTA
          variant="both"
          context="Verified sourcing for peptides, stem cells, and exosomes. Supplier and buyer intake at RampRate."
        />

        {/* ── CROSS-LINKS ── */}
        <section className="mb-16">
          <h3 className="font-['Playfair_Display',serif] font-bold text-xl mb-4 text-center">Explore the Full Peptide Intelligence Suite</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { href: "/find-your-peptide", title: "Find My Peptide", desc: "Interactive peptide finder with use-case matching" },
              { href: "/peptide-supply-chain", title: "Supply Chain Guide", desc: "Deep dive into peptide sourcing and verification" },
              { href: "/peptide-hall-of-shame", title: "Hall of Shame", desc: "Documented vendor enforcement actions" },
              { href: "/peptide-matrix", title: "Peptide Matrix", desc: "Comprehensive peptide comparison tool" },
              { href: "/peptide-quiz", title: "Peptide Knowledge Quiz", desc: "Test your peptide safety knowledge" },
              { href: "/psychedelic-readiness-index", title: "Psychedelic Readiness Index", desc: "Assessment tool for psychedelic medicine readiness" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="block bg-white border border-[#D4B96A]/20 rounded p-4 hover:border-[#D4B96A]/50 transition group">
                <h4 className="font-bold text-sm group-hover:text-[#8B6914] transition">{link.title}</h4>
                <p className="text-xs text-[#A09880] mt-1">{link.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0A0A10] text-center py-12 px-6">
        <div className="font-['Playfair_Display',serif] font-black text-2xl text-[#FAFAF7] mb-3">
          Peptide<span className="text-[#C84B2A]">Watch</span>
        </div>
        <p className="text-sm text-[#806858] max-w-lg mx-auto leading-relaxed">
          Built from FDA warning letters, DOJ press releases, FTC and ITC filings, state AG enforcement actions, and Finnrick Analytics independent testing data. Last updated March 2026. Not legal or medical advice. All enforcement characterizations reflect documented regulatory and criminal proceedings.
        </p>
      </footer>
    </div>
    </>);
}

/* ── Shared sub-components ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-bold tracking-[3px] text-[#8B6914] uppercase block mb-3">
      {children}
    </span>
  );
}
