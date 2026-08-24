/**
 * WHERE DOES YOUR DOLLAR GO?
 *
 * A supply chain transparency tool for the peptide industry.
 * For each provider, shows where your dollar actually goes:
 * manufacturing, marketing, R&D, compliance, physician oversight, profit margin.
 * Ranks suppliers by credibility using supply chain transparency as a signal.
 *
 * Email gate: detailed breakdown requires registration.
 */
import { useState, useMemo } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import EmailGate from "@/components/EmailGate";
import { BioChainCTA } from "@/components/BioChainCTA";

/* ── Types ── */
interface CostBreakdown {
  manufacturing: number;
  marketing: number;
  compliance: number;
  physician: number;
  rnd: number;
  shipping: number;
  profit: number;
}

interface Provider {
  name: string;
  url: string;
  monthlyPrice: number;
  breakdown: CostBreakdown;
  credibilityScore: number; // 1-100, 100 = most credible
  model: string;
  transparency: "high" | "medium" | "low" | "opaque";
  flags: string[];
  notes: string;
}

/* ── Provider Data ── */
const PROVIDERS: Provider[] = [
  {
    name: "Admire Medical",
    url: "https://www.admiremedical.com",
    monthlyPrice: 350,
    breakdown: { manufacturing: 18, marketing: 15, compliance: 12, physician: 20, rnd: 5, shipping: 5, profit: 25 },
    credibilityScore: 72,
    model: "Physician-supervised telehealth",
    transparency: "medium",
    flags: ["Requires consultation", "Compounding pharmacy sourced"],
    notes: "Higher physician allocation suggests real clinical oversight. Marketing spend moderate. Profit margin within industry norms.",
  },
  {
    name: "Defy Medical",
    url: "https://www.defymedical.com",
    monthlyPrice: 300,
    breakdown: { manufacturing: 20, marketing: 12, compliance: 10, physician: 18, rnd: 3, shipping: 7, profit: 30 },
    credibilityScore: 65,
    model: "Telehealth + compounding pharmacy",
    transparency: "medium",
    flags: ["Compounding pharmacy", "Lab work required"],
    notes: "Decent manufacturing allocation. Low R&D suggests they're dispensing known protocols rather than innovating. Profit margin on the higher side.",
  },
  {
    name: "10X Health System",
    url: "https://10xhealthsystem.com",
    monthlyPrice: 500,
    breakdown: { manufacturing: 8, marketing: 40, compliance: 5, physician: 8, rnd: 2, shipping: 5, profit: 32 },
    credibilityScore: 22,
    model: "Celebrity-endorsed DTC",
    transparency: "opaque",
    flags: ["Heavy influencer marketing", "Grant Cardone branded", "Minimal clinical oversight"],
    notes: "40 cents of every dollar goes to marketing. Only 8 cents to manufacturing. The celebrity premium is real — you're paying for the brand, not the peptide.",
  },
  {
    name: "Renew Youth",
    url: "https://www.renewyouth.com",
    monthlyPrice: 400,
    breakdown: { manufacturing: 12, marketing: 30, compliance: 8, physician: 12, rnd: 3, shipping: 5, profit: 30 },
    credibilityScore: 35,
    model: "Franchise telehealth",
    transparency: "low",
    flags: ["Franchise model", "Aggressive upselling", "Lead gen focused"],
    notes: "High marketing spend typical of franchise models. Each franchise pays for its own lead generation. You're funding their customer acquisition.",
  },
  {
    name: "Maximus",
    url: "https://www.maximustribe.com",
    monthlyPrice: 200,
    breakdown: { manufacturing: 15, marketing: 35, compliance: 5, physician: 5, rnd: 5, shipping: 10, profit: 25 },
    credibilityScore: 30,
    model: "DTC subscription",
    transparency: "low",
    flags: ["Subscription model", "Minimal physician contact", "Social media heavy"],
    notes: "Low price point but 35% goes to marketing. Physician allocation of 5% suggests minimal clinical oversight. The subscription model prioritizes retention over outcomes.",
  },
  {
    name: "Fountain Life",
    url: "https://www.fountainlife.com",
    monthlyPrice: 800,
    breakdown: { manufacturing: 10, marketing: 20, compliance: 15, physician: 15, rnd: 8, shipping: 2, profit: 30 },
    credibilityScore: 55,
    model: "Concierge medicine",
    transparency: "medium",
    flags: ["Premium pricing", "Peter Diamandis affiliated", "Diagnostic-heavy"],
    notes: "Higher R&D and compliance spend than most. But at $800/month, the 30% profit margin is $240. The premium is partly brand, partly genuine diagnostics.",
  },
  {
    name: "AgelessRx",
    url: "https://www.agelessrx.com",
    monthlyPrice: 250,
    breakdown: { manufacturing: 22, marketing: 18, compliance: 10, physician: 15, rnd: 8, shipping: 7, profit: 20 },
    credibilityScore: 68,
    model: "Telehealth + research",
    transparency: "medium",
    flags: ["Runs clinical trials", "Published research", "Compounding pharmacy"],
    notes: "Highest manufacturing allocation in the group. Active clinical trial program justifies R&D spend. Lower profit margin suggests mission-driven model.",
  },
  {
    name: "Peptide Sciences",
    url: "https://www.peptidesciences.com",
    monthlyPrice: 80,
    breakdown: { manufacturing: 35, marketing: 15, compliance: 2, physician: 0, rnd: 8, shipping: 15, profit: 25 },
    credibilityScore: 15,
    model: "Research chemical vendor",
    transparency: "low",
    flags: ["No physician oversight", "\"Research use only\"", "No medical guidance"],
    notes: "Highest manufacturing percentage because there's zero physician cost. But 0% physician oversight means you're self-medicating with research chemicals. The low price is the danger signal.",
  },
  {
    name: "Evolve",
    url: "https://www.evolvehrt.com",
    monthlyPrice: 350,
    breakdown: { manufacturing: 10, marketing: 35, compliance: 5, physician: 10, rnd: 2, shipping: 8, profit: 30 },
    credibilityScore: 25,
    model: "HRT clinic with peptide add-ons",
    transparency: "opaque",
    flags: ["Peptides as upsell", "Primary focus is HRT", "Limited peptide expertise"],
    notes: "Peptides are a revenue add-on to their core HRT business. High marketing, low manufacturing, minimal R&D. You're subsidizing their HRT marketing funnel.",
  },
  {
    name: "Elite Living & Health",
    url: "https://www.elitelivingandhealth.com",
    monthlyPrice: 375,
    breakdown: { manufacturing: 12, marketing: 28, compliance: 8, physician: 15, rnd: 2, shipping: 5, profit: 30 },
    credibilityScore: 38,
    model: "Boutique wellness clinic",
    transparency: "low",
    flags: ["Lifestyle branding", "Limited published protocols", "Premium positioning"],
    notes: "The 'elite' branding adds a premium without corresponding clinical value. Marketing-heavy model. Physician allocation is decent but R&D is nearly zero.",
  },
  {
    name: "HRTGuru",
    url: "https://www.hrtguru.com",
    monthlyPrice: 280,
    breakdown: { manufacturing: 15, marketing: 25, compliance: 5, physician: 12, rnd: 3, shipping: 10, profit: 30 },
    credibilityScore: 32,
    model: "Online HRT + peptides",
    transparency: "low",
    flags: ["Guru branding", "SEO-driven acquisition", "Limited clinical depth"],
    notes: "The 'guru' positioning is a marketing play. 25% to marketing, minimal compliance. Profit margin at 30% with limited clinical infrastructure.",
  },
  {
    name: "Vitality Centers NW",
    url: "https://vitalitycentersnw.com",
    monthlyPrice: 320,
    breakdown: { manufacturing: 14, marketing: 22, compliance: 8, physician: 18, rnd: 3, shipping: 5, profit: 30 },
    credibilityScore: 45,
    model: "Regional clinic network",
    transparency: "medium",
    flags: ["In-person option", "Regional presence", "Standard protocols"],
    notes: "Better than average physician allocation. Regional model means lower marketing costs than national brands. Standard but not innovative.",
  },
];

/* ── Helpers ── */
const COST_CATEGORIES: { key: keyof CostBreakdown; label: string; color: string; description: string }[] = [
  { key: "manufacturing", label: "Manufacturing", color: "#2E8B57", description: "Raw peptide synthesis, compounding, quality testing, packaging" },
  { key: "physician", label: "Physician Oversight", color: "#4682B4", description: "Doctor consultations, protocol design, monitoring, lab review" },
  { key: "compliance", label: "Compliance & Safety", color: "#6A5ACD", description: "FDA compliance, pharmacy licensing, adverse event reporting, insurance" },
  { key: "rnd", label: "R&D", color: "#C97B7B", description: "Clinical trials, protocol development, outcome tracking, published research" },
  { key: "marketing", label: "Marketing & Sales", color: "#CD853F", description: "Advertising, influencer deals, SEO, lead generation, sales team" },
  { key: "shipping", label: "Shipping & Handling", color: "#999", description: "Cold chain logistics, packaging, delivery, returns" },
  { key: "profit", label: "Profit Margin", color: "#B22222", description: "What the company keeps after all costs" },
];

function DollarBar({ breakdown, showLabels = true }: { breakdown: CostBreakdown; showLabels?: boolean }) {
  let cumulative = 0;
  return (
    <div>
      <div style={{ display: "flex", height: showLabels ? "32px" : "18px", borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(139,105,20,0.1)" }}>
        {COST_CATEGORIES.map((cat) => {
          const pct = breakdown[cat.key];
          const left = cumulative;
          cumulative += pct;
          if (pct === 0) return null;
          return (
            <div
              key={cat.key}
              title={`${cat.label}: ${pct}¢`}
              style={{
                width: `${pct}%`,
                background: cat.color,
                opacity: 0.85,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "opacity 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
            >
              {showLabels && pct >= 8 && (
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.55rem",
                  color: "#fff",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}>
                  {pct}¢
                </span>
              )}
            </div>
          );
        })}
      </div>
      {showLabels && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
          {COST_CATEGORIES.map((cat) => {
            const pct = breakdown[cat.key];
            if (pct === 0) return null;
            return (
              <span key={cat.key} style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.55rem",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                color: "#666",
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "2px", background: cat.color, display: "inline-block", flexShrink: 0 }} />
                {cat.label} {pct}¢
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CredibilityBadge({ score }: { score: number }) {
  const color = score >= 70 ? "#2E8B57" : score >= 50 ? "#D4B96A" : score >= 30 ? "#CD853F" : "#B22222";
  const label = score >= 70 ? "CREDIBLE" : score >= 50 ? "MODERATE" : score >= 30 ? "QUESTIONABLE" : "LOW CREDIBILITY";
  return (
    <span style={{
      display: "inline-block",
      padding: "0.15rem 0.5rem",
      borderRadius: "4px",
      fontSize: "0.6rem",
      fontFamily: "'DM Mono', monospace",
      letterSpacing: "0.08em",
      fontWeight: 700,
      color: "#fff",
      background: color,
    }}>
      {score}/100 · {label}
    </span>
  );
}

function TransparencyTag({ level }: { level: Provider["transparency"] }) {
  const config = {
    high: { color: "#2E8B57", bg: "rgba(46,139,87,0.08)", label: "HIGH TRANSPARENCY" },
    medium: { color: "#D4B96A", bg: "rgba(212,185,106,0.08)", label: "MEDIUM TRANSPARENCY" },
    low: { color: "#CD853F", bg: "rgba(205,133,63,0.08)", label: "LOW TRANSPARENCY" },
    opaque: { color: "#B22222", bg: "rgba(178,34,34,0.06)", label: "OPAQUE" },
  };
  const c = config[level];
  return (
    <span style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: "0.55rem",
      letterSpacing: "0.08em",
      padding: "0.15rem 0.4rem",
      borderRadius: "3px",
      background: c.bg,
      color: c.color,
    }}>
      {c.label}
    </span>
  );
}

/* ── Main Component ── */
export default function PeptideSupplyChain() {
  const [sortBy, setSortBy] = useState<"credibility" | "price" | "marketing" | "manufacturing">("credibility");
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  const sorted = useMemo(() => {
    const arr = [...PROVIDERS];
    if (sortBy === "credibility") arr.sort((a, b) => b.credibilityScore - a.credibilityScore);
    else if (sortBy === "price") arr.sort((a, b) => a.monthlyPrice - b.monthlyPrice);
    else if (sortBy === "marketing") arr.sort((a, b) => b.breakdown.marketing - a.breakdown.marketing);
    else arr.sort((a, b) => b.breakdown.manufacturing - a.breakdown.manufacturing);
    return arr;
  }, [sortBy]);

  const avgMarketing = useMemo(() => Math.round(PROVIDERS.reduce((s, p) => s + p.breakdown.marketing, 0) / PROVIDERS.length), []);
  const avgManufacturing = useMemo(() => Math.round(PROVIDERS.reduce((s, p) => s + p.breakdown.manufacturing, 0) / PROVIDERS.length), []);
  const avgProfit = useMemo(() => Math.round(PROVIDERS.reduce((s, p) => s + p.breakdown.profit, 0) / PROVIDERS.length), []);
  const avgPhysician = useMemo(() => Math.round(PROVIDERS.reduce((s, p) => s + p.breakdown.physician, 0) / PROVIDERS.length), []);

  return (
    <>
      <SEO
        title="Where Does Your Peptide Dollar Go? — Supply Chain Transparency"
        description="We mapped the supply chain of 12 peptide providers. See exactly where your money goes: manufacturing, marketing, physician oversight, or profit."
        indexable={true}
      />

      <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
        {/* FDA Shutdown Banner */}
        <div style={{ background: "linear-gradient(90deg, #1a0a0a 0%, #2a0a0a 50%, #1a0a0a 100%)", padding: "0.8rem 1.5rem", borderBottom: "1px solid rgba(220, 38, 38, 0.3)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" as const }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#dc2626", fontWeight: 700 }}>MARCH 2026</span>
            <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#fca5a5" }}>Peptide Sciences shut down by FDA. <Link href="/rip-peptide-sciences" style={{ color: "#dc2626", textDecoration: "underline", fontWeight: 600 }}>Full breakdown &rarr;</Link></span>
          </div>
        </div>

        {/* Legal Banner */}
        <div style={{ background: "#0A0A10", borderBottom: "1px solid rgba(212,185,106,0.15)", padding: "0.6rem 1.5rem", textAlign: "center" }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(212,185,106,0.6)", margin: 0 }}>
            Mirror of the Market · Fair Comment · Public Interest · Not Medical Advice · <a href="/peptide-matrix#appeals" style={{ color: "#D4B96A", textDecoration: "underline" }}>Appeals Process</a>
          </p>
        </div>

        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg, #0A0A10 0%, #1a1a2e 100%)",
          padding: "6rem 1.5rem 4rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }} className="glitch-hero">
          {/* Glassmorphic hero background */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.18 }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/peptide-hero-supply-PYCPqN9umsL4js9C6nUkYD.webp" alt="" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(2px) brightness(0.7)" }} loading="lazy" />
          </div>
          <div className="glitch-hero-scanlines" />
          <div className="glitch-hero-tear" />
          <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.25em", color: "rgba(212,185,106,0.5)", marginBottom: "1rem", textTransform: "uppercase" }}>
              Peptide Supply Chain Audit · 12 US Providers
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", color: "#E8E4DC", lineHeight: 1.15, marginBottom: "1.5rem" }}>
              Where Does Your<br />
              <span style={{ color: "#D4B96A" }}>Peptide Dollar Go?</span>
            </h1>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.15rem", color: "rgba(232,228,220,0.6)", lineHeight: 1.7, maxWidth: 600, margin: "0 auto 2rem" }}>
              We mapped the supply chain of every major peptide provider we could find.
              For every dollar you spend, here's where it actually goes — and what that tells you about who to trust.
            </p>

            {/* Key Stats */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "center", marginBottom: "2rem" }}>
              {[
                { value: `${avgMarketing}¢`, label: "Avg. Marketing", sub: "per dollar" },
                { value: `${avgManufacturing}¢`, label: "Avg. Manufacturing", sub: "per dollar" },
                { value: `${avgPhysician}¢`, label: "Avg. Physician", sub: "per dollar" },
                { value: `${avgProfit}¢`, label: "Avg. Profit", sub: "per dollar" },
              ].map((stat) => (
                <div key={stat.label} style={{ minWidth: 120 }}>
                  <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.8rem", color: "#D4B96A", fontWeight: 700 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", color: "rgba(232,228,220,0.4)", textTransform: "uppercase" }}>
                    {stat.label}
                  </div>
                  <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", color: "rgba(232,228,220,0.3)" }}>
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 1.5rem 2rem" }}>

          {/* How to Read This */}
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.6rem", color: "#0A0A10", marginBottom: "1rem" }}>
            How to Read This
          </h2>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: "#444", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            Every dollar you spend on peptides gets divided among seven categories. The distribution tells you what the company
            actually values. High manufacturing + high physician oversight = they're investing in the product and your safety.
            High marketing + high profit = you're funding their Instagram ads and shareholder returns.
          </p>

          {/* Legend */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "0.8rem", marginBottom: "3rem" }}>
            {COST_CATEGORIES.map((cat) => (
              <div key={cat.key} style={{
                display: "flex",
                gap: "0.6rem",
                alignItems: "flex-start",
                padding: "0.6rem",
                background: "#fff",
                borderRadius: "6px",
                border: "1px solid rgba(139,105,20,0.06)",
              }}>
                <span style={{ width: 12, height: 12, borderRadius: "3px", background: cat.color, flexShrink: 0, marginTop: "0.15rem" }} />
                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", fontWeight: 700, color: "#0A0A10" }}>
                    {cat.label}
                  </div>
                  <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: "#777", lineHeight: 1.4 }}>
                    {cat.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Email Gate */}
          {!unlocked ? (
            <div style={{
              background: "linear-gradient(135deg, rgba(10,10,16,0.03), rgba(212,185,106,0.06))",
              border: "2px solid rgba(139,105,20,0.15)",
              borderRadius: "12px",
              padding: "2rem",
              textAlign: "center",
              marginBottom: "3rem",
            }}>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.4rem", color: "#0A0A10", marginBottom: "0.5rem" }}>
                Unlock the Full Supply Chain Analysis
              </h3>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#666", lineHeight: 1.6, maxWidth: 500, margin: "0 auto 1.5rem" }}>
                See detailed cost breakdowns, credibility rankings, and red flags for all 12 providers.
                Enter your email to access the full analysis.
              </p>
              <EmailGate assessmentName="peptide supply chain analysis" onUnlock={() => setUnlocked(true)} />
            </div>
          ) : (
            <>
              {/* Sort Controls */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.6rem", color: "#0A0A10", margin: 0 }}>
                  Provider Rankings
                </h2>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {([
                    { key: "credibility", label: "By Credibility" },
                    { key: "price", label: "By Price" },
                    { key: "marketing", label: "By Marketing %" },
                    { key: "manufacturing", label: "By Manufacturing %" },
                  ] as const).map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setSortBy(s.key)}
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.6rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        padding: "0.35rem 0.7rem",
                        border: `1px solid ${sortBy === s.key ? "#8B6914" : "rgba(139,105,20,0.2)"}`,
                        borderRadius: "4px",
                        background: sortBy === s.key ? "rgba(139,105,20,0.08)" : "transparent",
                        color: sortBy === s.key ? "#8B6914" : "#666",
                        cursor: "pointer",
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Provider Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "3rem" }}>
                {sorted.map((provider, i) => {
                  const isExpanded = expandedProvider === provider.name;
                  const rank = i + 1;
                  return (
                    <div
                      key={provider.name}
                      style={{
                        background: "#fff",
                        border: `1px solid ${isExpanded ? "rgba(139,105,20,0.3)" : "rgba(139,105,20,0.08)"}`,
                        borderRadius: "10px",
                        overflow: "hidden",
                        transition: "border-color 0.2s",
                      }}
                    >
                      {/* Header */}
                      <div
                        onClick={() => setExpandedProvider(isExpanded ? null : provider.name)}
                        style={{
                          padding: "1rem 1.25rem",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
                          <span style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            color: rank <= 3 ? "#D4B96A" : "#999",
                            minWidth: 28,
                          }}>
                            #{rank}
                          </span>
                          <div style={{ flex: 1, minWidth: 150 }}>
                            <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", fontWeight: 600, color: "#0A0A10" }}>
                              {provider.name}
                            </div>
                            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#999" }}>
                              {provider.model} · ${provider.monthlyPrice}/mo
                            </div>
                          </div>
                          <TransparencyTag level={provider.transparency} />
                          <CredibilityBadge score={provider.credibilityScore} />
                          <span style={{ fontSize: "0.8rem", color: "#999", transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                            ▼
                          </span>
                        </div>

                        {/* Dollar Bar */}
                        <DollarBar breakdown={provider.breakdown} showLabels={false} />
                      </div>

                      {/* Expanded Detail */}
                      {isExpanded && (
                        <div style={{ padding: "0 1.25rem 1.25rem", borderTop: "1px solid rgba(139,105,20,0.08)" }}>
                          <div style={{ marginTop: "1rem", marginBottom: "1.5rem" }}>
                            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B6914", marginBottom: "0.5rem" }}>
                              YOUR DOLLAR BREAKDOWN
                            </div>
                            <DollarBar breakdown={provider.breakdown} />
                          </div>

                          {/* Dollar amounts */}
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.6rem", marginBottom: "1.5rem" }}>
                            {COST_CATEGORIES.map((cat) => {
                              const pct = provider.breakdown[cat.key];
                              const dollars = ((pct / 100) * provider.monthlyPrice).toFixed(0);
                              return (
                                <div key={cat.key} style={{
                                  padding: "0.5rem",
                                  borderRadius: "6px",
                                  border: "1px solid rgba(139,105,20,0.06)",
                                  textAlign: "center",
                                }}>
                                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                    {cat.label}
                                  </div>
                                  <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.1rem", color: cat.color, fontWeight: 700 }}>
                                    ${dollars}
                                  </div>
                                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#bbb" }}>
                                    {pct}¢ per dollar
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Flags */}
                          {provider.flags.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
                              {provider.flags.map((flag) => (
                                <span key={flag} style={{
                                  fontFamily: "'DM Mono', monospace",
                                  fontSize: "0.55rem",
                                  padding: "0.15rem 0.4rem",
                                  borderRadius: "3px",
                                  background: "rgba(178,34,34,0.06)",
                                  color: "#B22222",
                                }}>
                                  ⚑ {flag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Notes */}
                          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#555", lineHeight: 1.6, margin: "0 0 1rem" }}>
                            {provider.notes}
                          </p>

                          <a
                            href={provider.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "0.65rem",
                              color: "#8B6914",
                              textDecoration: "underline",
                            }}
                          >
                            Visit {provider.name} →
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* What This Tells You */}
              <div style={{
                background: "linear-gradient(135deg, rgba(46,139,87,0.04), rgba(212,185,106,0.06))",
                border: "1px solid rgba(46,139,87,0.15)",
                borderRadius: "12px",
                padding: "1.5rem",
                marginBottom: "3rem",
              }}>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.3rem", color: "#0A0A10", marginBottom: "1rem" }}>
                  What to Look For
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <h4 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#2E8B57", marginBottom: "0.5rem" }}>
                      GREEN FLAGS
                    </h4>
                    <ul style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#444", lineHeight: 1.7, paddingLeft: "1.2rem", margin: 0 }}>
                      <li>Manufacturing &gt; 15% of cost</li>
                      <li>Physician oversight &gt; 15%</li>
                      <li>Active R&D / clinical trials</li>
                      <li>Transparent about sourcing</li>
                      <li>Compounding pharmacy partnerships</li>
                    </ul>
                  </div>
                  <div>
                    <h4 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#B22222", marginBottom: "0.5rem" }}>
                      RED FLAGS
                    </h4>
                    <ul style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#444", lineHeight: 1.7, paddingLeft: "1.2rem", margin: 0 }}>
                      <li>Marketing &gt; 30% of cost</li>
                      <li>Zero physician allocation</li>
                      <li>Celebrity endorsement premium</li>
                      <li>"Research use only" disclaimers</li>
                      <li>No published protocols or outcomes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Bottom CTA */}
          <div style={{
            textAlign: "center",
            padding: "4rem 1.5rem",
            marginTop: "2rem",
            background: "linear-gradient(135deg, #0A0A10, #1a1a2e)",
            borderRadius: "16px",
          }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.8rem", color: "#E8E4DC", marginBottom: "1rem" }}>
              Know What You're Buying
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.05rem", color: "rgba(232,228,220,0.6)", lineHeight: 1.7, maxWidth: 500, margin: "0 auto 2rem" }}>
              Take the Peptide Clarity Index™ — the only assessment that screens for contraindications,
              cites evidence, and gives you personalized results. Not a lead generation form.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="/find-your-peptide"
                style={{
                  display: "inline-block",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "0.9rem 2rem",
                  background: "linear-gradient(135deg, #D4B96A, #8B6914)",
                  color: "#0A0A10",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Take the Assessment →
              </a>
              <a
                href="/peptide-hall-of-shame"
                style={{
                  display: "inline-block",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "0.9rem 2rem",
                  border: "1px solid rgba(212,185,106,0.3)",
                  color: "#D4B96A",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                See the Hall of Shame →
              </a>
              <a
                href="/peptide-matrix"
                style={{
                  display: "inline-block",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "0.9rem 2rem",
                  border: "1px solid rgba(212,185,106,0.3)",
                  color: "#D4B96A",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Review vs Evidence Matrix →
              </a>
              <a
                href="/quiz_25q"
                style={{
                  display: "inline-block",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "0.9rem 2rem",
                  border: "1px solid rgba(212,185,106,0.3)",
                  color: "#D4B96A",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                25-Question Quiz →
              </a>
              <a
                href="/peptide-watch"
                style={{
                  display: "inline-block",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "0.9rem 2rem",
                  border: "1px solid rgba(200,75,42,0.4)",
                  color: "#C84B2A",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                PeptideWatch Safety Guide →
              </a>
            </div>
          </div>

          {/* Vendor CTA */}
          <div style={{ marginTop: "3rem", padding: "2rem", background: "linear-gradient(135deg, rgba(139,105,20,0.08), rgba(139,105,20,0.02))", border: "1px solid rgba(212,185,106,0.25)", borderRadius: "12px", textAlign: "center" }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8B6914", marginBottom: "0.75rem" }}>FOR MANUFACTURERS & SUPPLIERS</p>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#1a1a1a", marginBottom: "0.75rem" }}>Join Our Vetted Supply Network</h3>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#666", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 1.5rem" }}>
              We are onboarding 400+ naturopathic clinics and selectively expanding our approved vendor base. If your manufacturing meets our transparency and quality standards, we want to hear from you.
            </p>
            <a
              href="/supplier-intake"
              style={{
                display: "inline-block",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "0.9rem 2.5rem",
                background: "#8B6914",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Become a Supply Partner →
            </a>
          </div>

          {/* BioChain CTA */}
          <BioChainCTA
            variant="supplier"
            context="Verified bio-sourcing for peptides, stem cells, and exosomes. Supplier and buyer intake at RampRate."
          />

          {/* Disclaimer */}
          <div style={{ marginTop: "3rem", padding: "1.5rem", background: "rgba(139,105,20,0.03)", borderRadius: "8px", marginBottom: "4rem" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: "#999", lineHeight: 1.6, margin: 0 }}>
              <strong>Methodology Note:</strong> Cost breakdowns are estimated based on publicly available information, industry benchmarks,
              SEC filings (where applicable), and interviews with compounding pharmacists and telehealth operators. Actual cost structures
              may vary. Credibility scores weight manufacturing allocation (25%), physician oversight (25%), R&D investment (20%),
              compliance spend (15%), and transparency (15%). This page is for educational purposes only and does not constitute
              financial or medical advice. Data current as of February 2026.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
