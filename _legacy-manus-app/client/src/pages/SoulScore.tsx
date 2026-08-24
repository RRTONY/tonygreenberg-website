/**
 * SoulScore™ — 12-Dimension Impact Measurement Engine
 * by ImpactSoul
 *
 * Light creative aesthetic with gold accents, high contrast, mobile-first.
 * All calculations client-side, real-time.
 */
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import SEO from "@/components/SEO";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip as RTooltip,
} from "recharts";

/* ═══════════════════════════════════════════════════════════
   DATA MODEL
   ═══════════════════════════════════════════════════════════ */

interface Dimension {
  id: number;
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  weight: number;
  max: number;
  unit: string;
  description: string;
}

const DIMENSIONS: Dimension[] = [
  { id: 1, label: "Consciousness", shortLabel: "CONSC", icon: "◉", color: "#8B6914", weight: 12, max: 1000, unit: "Hawkins Scale", description: "20=Shame → 1000=Enlightenment. 200=critical threshold: below=force, above=power" },
  { id: 2, label: "Carbon & Climate", shortLabel: "CARBN", icon: "🌍", color: "#2a9d8f", weight: 10, max: 100, unit: "tCO₂e", description: "Scope 1-3 + sequestration + trajectory to net-positive" },
  { id: 3, label: "Labor Justice", shortLabel: "LABOR", icon: "⚖", color: "#e63946", weight: 10, max: 100, unit: "LJI", description: "Wage equity, benefits, safety, dignity, CEO-to-median ratio" },
  { id: 4, label: "Supply Chain", shortLabel: "SUPLC", icon: "🔗", color: "#588157", weight: 10, max: 100, unit: "SCI", description: "6-tier depth: Tier1 → Tier4 origin ecosystems → logistics → end-of-life" },
  { id: 5, label: "Cultural Preservation", shortLabel: "CULTR", icon: "🏛", color: "#9b5de5", weight: 8, max: 100, unit: "CPI", description: "Indigenous rights, sacred sites, traditional knowledge sovereignty" },
  { id: 6, label: "Community Multiplier", shortLabel: "COMTY", icon: "🏘", color: "#3a86a8", weight: 8, max: 100, unit: "CMX", description: "Dollar recirculation, local hiring, community ownership %, power-sharing" },
  { id: 7, label: "Financial Justice", shortLabel: "FINJT", icon: "💎", color: "#D4B96A", weight: 8, max: 100, unit: "FJI", description: "Stakeholder vs shareholder return distribution" },
  { id: 8, label: "Governance & Trust", shortLabel: "GOVNT", icon: "🏗", color: "#6c5ce7", weight: 7, max: 100, unit: "GTI", description: "Board diversity, stakeholder representation, transparency" },
  { id: 9, label: "Resource Circularity", shortLabel: "RSCRC", icon: "♻", color: "#00b894", weight: 7, max: 100, unit: "RCI", description: "Circular material use, waste-to-value, water stewardship" },
  { id: 10, label: "Human Dignity", shortLabel: "DGITY", icon: "✊", color: "#e17055", weight: 7, max: 100, unit: "HDI", description: "Worker autonomy, portable credentials, mental health" },
  { id: 11, label: "Regenerative Innovation", shortLabel: "REGEN", icon: "🧬", color: "#00b4d8", weight: 7, max: 100, unit: "RII", description: "Net-positive R&D, open-source, biomimicry" },
  { id: 12, label: "Radical Transparency", shortLabel: "TRANS", icon: "◈", color: "#D4A017", weight: 6, max: 100, unit: "RTI", description: "Real-time reporting, blockchain verification, independent audits" },
];

const TOTAL_WEIGHT = DIMENSIONS.reduce((s, d) => s + d.weight, 0);

const ENTITY_TYPES = [
  { id: "individual", label: "Individual", icon: "👤" },
  { id: "gig-worker", label: "Gig Worker", icon: "⚡" },
  { id: "team", label: "Team", icon: "👥" },
  { id: "company", label: "Company", icon: "🏢" },
  { id: "ceo", label: "CEO", icon: "👑" },
  { id: "supply-chain", label: "Supply Chain", icon: "🔗" },
  { id: "fund", label: "Fund", icon: "📊" },
  { id: "token", label: "Tokenized Asset", icon: "🪙" },
];

interface BenchmarkEntity {
  name: string;
  tag?: string;
  scores: number[]; // 12 values matching DIMENSIONS order
}

const BENCHMARKS: BenchmarkEntity[] = [
  { name: "Fortune 500 Avg", tag: "F500", scores: [110, 35, 40, 30, 15, 20, 25, 45, 30, 35, 40, 30] },
  { name: "B Corp Avg", tag: "BCORP", scores: [225, 62, 68, 55, 45, 60, 55, 70, 58, 65, 50, 65] },
  { name: "Patagonia", tag: "PATA", scores: [430, 88, 92, 85, 70, 82, 78, 90, 95, 90, 85, 92] },
  { name: "BP (ESG 'AA' rated)", tag: "BP", scores: [75, 18, 45, 25, 10, 15, 20, 55, 15, 40, 30, 35] },
  { name: "Extractive Gig Platform", tag: "UBER", scores: [95, 25, 22, 20, 5, 10, 12, 30, 20, 15, 45, 20] },
  { name: "Avg US Worker", tag: "USWK", scores: [175, 30, 0, 0, 20, 35, 25, 0, 30, 0, 20, 25] },
  { name: "ImpactSoul Impact Worker", tag: "ISOL", scores: [280, 65, 80, 60, 55, 70, 65, 55, 60, 85, 50, 75] },
];

const SUPPLY_TIERS = [
  { name: "Tier 1: Direct Suppliers", color: "#588157", factors: ["Labor practices", "Environmental compliance", "Consciousness calibration", "Conflict minerals", "Living wage"] },
  { name: "Tier 2: Components", color: "#e63946", factors: ["Child labor", "Water contamination", "Chemical safety", "Community displacement", "Indigenous land rights"] },
  { name: "Tier 3: Raw Materials", color: "#D4A017", factors: ["Extraction violence", "Deforestation", "Cobalt/lithium ethics", "Artisanal mining conditions", "Biodiversity"] },
  { name: "Tier 4: Origin Ecosystems", color: "#2a9d8f", factors: ["Soil health", "Watershed integrity", "Cultural site proximity", "Sacred land", "Climate vulnerability"] },
  { name: "Logistics", color: "#6c5ce7", factors: ["Last-mile emissions", "Packaging circularity", "Cold chain energy", "Warehouse worker safety", "Gig delivery dignity"] },
  { name: "End of Life", color: "#e17055", factors: ["E-waste destination", "Recyclability rate", "Landfill toxicity", "Circular recovery %", "Community health"] },
];

const FAILURES = [
  { title: "No baseline ever set", severity: 10, fix: "SoulScore auto-generates baseline on first measurement" },
  { title: "ESG correlates with greenwashing", severity: 10, fix: "12-axis eliminates single-dimension gaming" },
  { title: "Supply chain = carbon only", severity: 10, fix: "6-tier, 30-factor analysis" },
  { title: "$41T ESG funds zero standards", severity: 10, fix: "Open-source scoring, on-chain verification" },
  { title: "No individual impact identity", severity: 10, fix: "Personal SoulScore: portable, sovereign, cumulative" },
  { title: "76.4M gig workers unmeasured", severity: 10, fix: "Impact Worker credential + tokens" },
  { title: "CEO consciousness unmeasured", severity: 9, fix: "Leadership calibration correlated to C-NPV" },
  { title: "Dashboards before data architecture", severity: 9, fix: "Data collection first, measurement auto-generates" },
  { title: "Self-reported data = truth", severity: 9, fix: "On-chain verification + third-party consciousness audit" },
  { title: "Every impact platform died", severity: 10, fix: "AI-native architecture, not dashboards on broken data" },
  { title: "Cultural impact invisible", severity: 9, fix: "Cultural Preservation Index" },
  { title: "Community multiplier unmeasured", severity: 9, fix: "Dollar recirculation tracking" },
  { title: "Labor justice weakest ESG pillar", severity: 9, fix: "Independent Labor Justice Index" },
  { title: "No consciousness layer anywhere", severity: 9, fix: "Hawkins-calibrated Corporate Consciousness Scale" },
  { title: "Impact tokens don't exist", severity: 10, fix: "ABIT: verified outcomes minted as tradeable tokens" },
  { title: "Regenerative can't be scored", severity: 9, fix: "SoulScore measures net-positive" },
  { title: "Worker dignity not a metric", severity: 10, fix: "Human Dignity Index" },
  { title: "No stakeholder justice measurement", severity: 9, fix: "Financial Justice Index" },
  { title: "Measurement costs > benefit", severity: 9, fix: "AI-native: 90% cost reduction" },
  { title: "No universal impact language", severity: 9, fix: "SoulScore = universal unit" },
];

/* ═══════════════════════════════════════════════════════════
   CALCULATION ENGINE
   ═══════════════════════════════════════════════════════════ */

function normalize(value: number, dim: Dimension): number {
  return dim.max === 1000 ? (value / 1000) * 100 : value;
}

function calcSoulScore(scores: number[]): number {
  let sum = 0;
  for (let i = 0; i < DIMENSIONS.length; i++) {
    sum += normalize(scores[i], DIMENSIONS[i]) * DIMENSIONS[i].weight;
  }
  return sum / TOTAL_WEIGHT;
}

function getGrade(score: number): { letter: string; color: string } {
  if (score >= 85) return { letter: "S", color: "#8B6914" };
  if (score >= 70) return { letter: "A", color: "#2a9d8f" };
  if (score >= 55) return { letter: "B", color: "#588157" };
  if (score >= 40) return { letter: "C", color: "#D4A017" };
  if (score >= 25) return { letter: "D", color: "#e17055" };
  return { letter: "F", color: "#e63946" };
}

function getConsciousnessZone(hawkins: number): { zone: string; color: string; bg: string } {
  if (hawkins >= 500) return { zone: "LOVE", color: "#8B6914", bg: "#FDF8E8" };
  if (hawkins >= 200) return { zone: "POWER", color: "#2a9d8f", bg: "#E8F5F2" };
  if (hawkins >= 100) return { zone: "FORCE", color: "#e17055", bg: "#FDF0ED" };
  return { zone: "SHAME", color: "#e63946", bg: "#FDE8EA" };
}

function calcSupplyChainComposite(scores: number[]): number {
  // SCI×30% + LJI×20% + Carbon×15% + RCI×15% + CPI×10% + HDI×10%
  return scores[3] * 0.3 + scores[2] * 0.2 + scores[1] * 0.15 + scores[8] * 0.15 + scores[4] * 0.1 + scores[9] * 0.1;
}

function calcCNPV(fcf: number, consciousness: number, years: number, discount: number): { standard: number; adjusted: number; premium: number } {
  const multiplier = 1.0 + (consciousness - 100) / 1000;
  const discountAdj = Math.min(Math.max((consciousness - 100) / 50, 0) * 0.004, 0.02);
  let standard = 0;
  let adjusted = 0;
  for (let t = 1; t <= years; t++) {
    standard += fcf / Math.pow(1 + discount / 100, t);
    adjusted += (fcf * multiplier) / Math.pow(1 + (discount / 100 - discountAdj), t);
  }
  return { standard, adjusted, premium: standard > 0 ? ((adjusted - standard) / standard) * 100 : 0 };
}

/* ═══════════════════════════════════════════════════════════
   ANIMATED NUMBER
   ═══════════════════════════════════════════════════════════ */

function AnimNum({ value, decimals = 1, suffix = "" }: { value: number; decimals?: number; suffix?: string }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef(value);
  useEffect(() => {
    const start = ref.current;
    const diff = value - start;
    if (Math.abs(diff) < 0.01) { setDisplay(value); ref.current = value; return; }
    let frame: number;
    const duration = 400;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const v = start + diff * ease;
      setDisplay(v);
      if (p < 1) frame = requestAnimationFrame(tick);
      else ref.current = value;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{display.toFixed(decimals)}{suffix}</>;
}

/* ═══════════════════════════════════════════════════════════
   TABS
   ═══════════════════════════════════════════════════════════ */

const TAB_NAMES = ["MEASURE", "BENCHMARK", "SUPPLY CHAIN", "FAILURES", "C-NPV", "GIG ECONOMY"] as const;
type TabName = typeof TAB_NAMES[number];

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function SoulScore() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState<TabName>("MEASURE");
  const [entityType, setEntityType] = useState("company");
  const [entityName, setEntityName] = useState("");
  const [scores, setScores] = useState<number[]>(() => DIMENSIONS.map(d => d.max === 1000 ? 200 : 50));

  // C-NPV inputs
  const [fcf, setFcf] = useState(10000000);
  const [cnpvYears, setCnpvYears] = useState(10);
  const [discountRate, setDiscountRate] = useState(10);

  // Supply chain tier expansion
  const [expandedTier, setExpandedTier] = useState<number | null>(null);
  // Supply chain sub-factor scores
  const [tierScores, setTierScores] = useState<number[][]>(() =>
    SUPPLY_TIERS.map(() => [50, 50, 50, 50, 50])
  );

  const updateScore = useCallback((idx: number, val: number) => {
    setScores(prev => { const n = [...prev]; n[idx] = val; return n; });
  }, []);

  const updateTierScore = useCallback((tierIdx: number, factorIdx: number, val: number) => {
    setTierScores(prev => {
      const n = prev.map(t => [...t]);
      n[tierIdx][factorIdx] = val;
      return n;
    });
  }, []);

  const soulScore = useMemo(() => calcSoulScore(scores), [scores]);
  const grade = useMemo(() => getGrade(soulScore), [soulScore]);
  const cZone = useMemo(() => getConsciousnessZone(scores[0]), [scores]);
  const scComposite = useMemo(() => calcSupplyChainComposite(scores), [scores]);
  const cnpv = useMemo(() => calcCNPV(fcf, scores[0], cnpvYears, discountRate), [fcf, scores, cnpvYears, discountRate]);

  const radarData = useMemo(() =>
    DIMENSIONS.map((d, i) => ({
      dimension: d.shortLabel,
      value: normalize(scores[i], d),
      fullMark: 100,
    })),
  [scores]);

  const diagnosis = useMemo(() => {
    const weak: { dim: Dimension; val: number }[] = [];
    const strong: { dim: Dimension; val: number }[] = [];
    DIMENSIONS.forEach((d, i) => {
      const n = normalize(scores[i], d);
      if (n < 30) weak.push({ dim: d, val: n });
      else if (n >= 70) strong.push({ dim: d, val: n });
    });
    return { weak, strong };
  }, [scores]);

  /* ── INTRO / ONBOARDING SCREEN ── */
  if (showIntro) {
    return (
    <>
    <SEO
        title="Soul Score — Alignment Assessment"
        description="Measure the alignment between your values and your actions. A diagnostic by Tony Greenberg."
        path="/soul-score"
        keywords="Tony Greenberg, values alignment, soul score, purpose assessment"
        indexable={true}
      />
      <div style={{
        background: "linear-gradient(135deg, #FAFAF7 0%, #F0E8D8 40%, #E8DCC8 100%)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Sacred geometry background pattern */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "radial-gradient(circle at 20% 30%, #8B6914 1px, transparent 1px), radial-gradient(circle at 80% 70%, #8B6914 1px, transparent 1px), radial-gradient(circle at 50% 50%, #D4B96A 0.5px, transparent 0.5px)",
          backgroundSize: "80px 80px, 60px 60px, 40px 40px",
        }} />
        {/* Floating accent circles */}
        <div style={{ position: "absolute", top: "10%", left: "5%", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,185,106,0.08) 0%, transparent 70%)", animation: "float 8s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "8%", width: "150px", height: "150px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,105,20,0.06) 0%, transparent 70%)", animation: "float 10s ease-in-out infinite reverse" }} />

        <p style={{
          fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.3em",
          color: "#8B6914", textTransform: "uppercase", marginBottom: "1rem", position: "relative",
        }}>
          by ImpactSoul
        </p>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
          fontWeight: 700, lineHeight: 1.05, marginBottom: "1rem",
          color: "#2C2416", textAlign: "center", position: "relative",
        }}>
          Soul<span style={{ color: "#8B6914" }}>Score</span><span style={{ color: "#D4B96A", fontSize: "0.5em", verticalAlign: "super" }}>™</span>
        </h1>

        <p style={{
          fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.1rem",
          color: "#5A4A32", maxWidth: "520px", textAlign: "center",
          lineHeight: 1.6, marginBottom: "2.5rem", position: "relative",
        }}>
          The first impact measurement engine that scores <em>consciousness</em>, not just carbon. Twelve dimensions. Any entity. Real-time.
        </p>

        {/* What you'll do cards */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "1rem", maxWidth: "600px", width: "100%", marginBottom: "2.5rem", position: "relative",
        }}>
          {[
            { icon: "◉", label: "12 Dimensions", desc: "From consciousness to carbon" },
            { icon: "⚡", label: "8 Entity Types", desc: "Individual to supply chain" },
            { icon: "📊", label: "Real-Time Score", desc: "Instant A+ to F grading" },
            { icon: "🔗", label: "6-Tier Depth", desc: "Full supply chain mapping" },
          ].map((item, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(10px)",
              borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(212,185,106,0.2)",
              borderRadius: "12px",
              padding: "1.25rem 1rem",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{item.icon}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", color: "#8B6914", fontWeight: 700, marginBottom: "0.25rem" }}>{item.label}</div>
              <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: "#7A6A52" }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Time estimate */}
        <p style={{
          fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em",
          color: "#9A8A6A", marginBottom: "1.5rem", position: "relative",
        }}>
          Interactive · ~3 minutes · No account required
        </p>

        <button
          onClick={() => setShowIntro(false)}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.8rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "1rem 3rem",
            background: "linear-gradient(135deg, #8B6914 0%, #D4B96A 100%)",
            color: "#FAFAF7",
            borderWidth: 0, borderStyle: "none", borderColor: "transparent",
            borderRadius: "8px",
            cursor: "pointer",
            position: "relative",
            fontWeight: 700,
            boxShadow: "0 4px 20px rgba(139,105,20,0.3)",
            transition: "all 0.3s",
          }}
          onMouseEnter={e => { (e.target as HTMLElement).style.transform = "translateY(-2px)"; (e.target as HTMLElement).style.boxShadow = "0 8px 30px rgba(139,105,20,0.4)"; }}
          onMouseLeave={e => { (e.target as HTMLElement).style.transform = "translateY(0)"; (e.target as HTMLElement).style.boxShadow = "0 4px 20px rgba(139,105,20,0.3)"; }}
        >
          Launch SoulScore →
        </button>

        <p style={{
          fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem",
          color: "#9A8A6A", marginTop: "1.5rem", textAlign: "center", maxWidth: "400px",
          position: "relative", lineHeight: 1.5,
        }}>
          Built from 50+ meeting transcripts, 100+ research conversations, and 25 years of Fortune 500 impact advisory.
        </p>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </div>
    </>);
  }

  return (
    <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      {/* ── HERO ── */}
      <header style={{
        background: "linear-gradient(135deg, #3D2E14 0%, #5A4020 50%, #3D2E14 100%)",
        color: "#FAFAF7",
        padding: "3rem 1.5rem 2rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.08,
          backgroundImage: "radial-gradient(circle at 25% 25%, #D4B96A 1px, transparent 1px), radial-gradient(circle at 75% 75%, #D4B96A 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <p style={{
          fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.25em",
          color: "#D4B96A", textTransform: "uppercase", marginBottom: "0.5rem", position: "relative",
        }}>
          by ImpactSoul
        </p>
        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 700, lineHeight: 1.1, marginBottom: "0.5rem", position: "relative",
        }}>
          SoulScore<span style={{ color: "#D4B96A" }}>™</span>
        </h1>
        <p style={{
          fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.15em",
          color: "rgba(250,250,247,0.6)", maxWidth: "600px", margin: "0 auto", position: "relative",
        }}>
          12 Dimensions × Any Entity × Real-Time
        </p>
      </header>

      {/* ── TAB BAR ── */}
      <nav style={{
        display: "flex", overflowX: "auto", gap: "0",
        borderBottom: "2px solid #E8E4DC",
        background: "#fff",
        position: "sticky", top: 0, zIndex: 40,
        WebkitOverflowScrolling: "touch",
      }}>
        {TAB_NAMES.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              flex: "0 0 auto",
              padding: "0.75rem 1rem",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: activeTab === t ? "#8B6914" : "#666",
              background: "transparent",
              borderWidth: 0,
              borderStyle: "none",
              borderColor: "transparent",
              borderBottomWidth: "2px",
              borderBottomStyle: "solid",
              borderBottomColor: activeTab === t ? "#8B6914" : "transparent",
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontWeight: activeTab === t ? 700 : 400,
              transition: "all 0.2s",
              marginBottom: "-2px",
            }}
          >
            {t}
          </button>
        ))}
      </nav>

      {/* ── CONTENT ── */}
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "1.5rem 1rem 4rem" }}>
        {activeTab === "MEASURE" && (
          <MeasureTab
            entityType={entityType} setEntityType={setEntityType}
            entityName={entityName} setEntityName={setEntityName}
            scores={scores} updateScore={updateScore}
            soulScore={soulScore} grade={grade} cZone={cZone}
            scComposite={scComposite} cnpvPremium={cnpv.premium}
            radarData={radarData} diagnosis={diagnosis}
          />
        )}
        {activeTab === "BENCHMARK" && <BenchmarkTab scores={scores} entityName={entityName} />}
        {activeTab === "SUPPLY CHAIN" && (
          <SupplyChainTab
            expandedTier={expandedTier} setExpandedTier={setExpandedTier}
            tierScores={tierScores} updateTierScore={updateTierScore}
          />
        )}
        {activeTab === "FAILURES" && <FailuresTab />}
        {activeTab === "C-NPV" && (
          <CNPVTab
            fcf={fcf} setFcf={setFcf}
            consciousness={scores[0]}
            years={cnpvYears} setYears={setCnpvYears}
            discount={discountRate} setDiscount={setDiscountRate}
            cnpv={cnpv}
          />
        )}
        {activeTab === "GIG ECONOMY" && <GigTab />}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        background: "linear-gradient(135deg, #3D2E14 0%, #5A4020 100%)", color: "rgba(250,250,247,0.7)", padding: "2rem 1.5rem",
        textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: "0.65rem",
        letterSpacing: "0.1em", lineHeight: 1.8,
      }}>
        <p style={{ color: "#D4B96A", marginBottom: "0.5rem" }}>SoulScore™ by ImpactSoul</p>
        <p>Consciousness-Adjusted NPV · 6-Tier Supply Chain · Impact Gig Economy · On-Chain Verification</p>
        <p style={{ marginTop: "0.5rem", fontSize: "0.6rem" }}>
          Architecture: 50+ meeting transcripts, 100+ research conversations, 25 years of Fortune 500 impact advisory
        </p>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SHARED STYLES
   ═══════════════════════════════════════════════════════════ */

const card: React.CSSProperties = {
  background: "#fff",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "#E8E4DC",
  borderRadius: "8px",
  padding: "1.25rem",
  marginBottom: "1rem",
};

const monoLabel: React.CSSProperties = {
  fontFamily: "'DM Mono', monospace",
  fontSize: "0.6rem",
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  color: "#999",
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  fontSize: "1.5rem",
  fontWeight: 700,
  color: "#0A0A10",
  marginBottom: "1rem",
};

/* ═══════════════════════════════════════════════════════════
   TAB 1: MEASURE
   ═══════════════════════════════════════════════════════════ */

function MeasureTab({ entityType, setEntityType, entityName, setEntityName, scores, updateScore, soulScore, grade, cZone, scComposite, cnpvPremium, radarData, diagnosis }: {
  entityType: string; setEntityType: (v: string) => void;
  entityName: string; setEntityName: (v: string) => void;
  scores: number[]; updateScore: (i: number, v: number) => void;
  soulScore: number; grade: { letter: string; color: string };
  cZone: { zone: string; color: string; bg: string };
  scComposite: number; cnpvPremium: number;
  radarData: { dimension: string; value: number; fullMark: number }[];
  diagnosis: { weak: { dim: Dimension; val: number }[]; strong: { dim: Dimension; val: number }[] };
}) {
  return (
    <>
      {/* Entity selector */}
      <div style={{ ...card, display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
        <div style={{ flex: "1 1 100%", marginBottom: "0.5rem" }}>
          <span style={monoLabel}>Entity Type</span>
        </div>
        {ENTITY_TYPES.map(e => (
          <button key={e.id} onClick={() => setEntityType(e.id)} style={{
            padding: "0.4rem 0.75rem", borderRadius: "6px",
            borderWidth: "1px", borderStyle: "solid",
            borderColor: entityType === e.id ? "#8B6914" : "#E8E4DC",
            background: entityType === e.id ? "#FDF8E8" : "#fff",
            color: entityType === e.id ? "#8B6914" : "#666",
            fontFamily: "'DM Mono', monospace", fontSize: "0.65rem",
            cursor: "pointer", transition: "all 0.2s",
          }}>
            {e.icon} {e.label}
          </button>
        ))}
        <input
          type="text"
          placeholder="Entity name (optional)"
          value={entityName}
          onChange={e => setEntityName(e.target.value)}
          style={{
            flex: "1 1 100%", marginTop: "0.5rem", padding: "0.5rem 0.75rem",
            borderWidth: "1px", borderStyle: "solid", borderColor: "#E8E4DC", borderRadius: "6px",
            fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem",
            background: "#FAFAF7", outline: "none",
          }}
        />
      </div>

      {/* Score + Grade hero card */}
      <div style={{
        ...card, display: "flex", alignItems: "center", justifyContent: "center",
        gap: "2rem", flexWrap: "wrap", padding: "1.5rem",
        background: "linear-gradient(135deg, #FAFAF7 0%, #F5F0E6 100%)",
        borderWidth: "2px", borderStyle: "solid", borderColor: "#D4B96A",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={monoLabel}>SoulScore</div>
          <div style={{
            fontFamily: "'Playfair Display', serif", fontSize: "3.5rem",
            fontWeight: 700, color: grade.color, lineHeight: 1,
          }}>
            <AnimNum value={soulScore} />
          </div>
        </div>
        <div style={{
          width: "80px", height: "80px", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          borderWidth: "3px", borderStyle: "solid", borderColor: grade.color, background: "#fff",
        }}>
          <span style={{
            fontFamily: "'Playfair Display', serif", fontSize: "2.5rem",
            fontWeight: 700, color: grade.color,
          }}>{grade.letter}</span>
        </div>
      </div>

      {/* 3 summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
        <div style={{ ...card, background: cZone.bg, borderColor: cZone.color }}>
          <div style={monoLabel}>Consciousness Zone</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: cZone.color, marginTop: "0.25rem" }}>
            {cZone.zone}
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#666", marginTop: "0.25rem" }}>
            Hawkins: <AnimNum value={scores[0]} decimals={0} />
          </div>
        </div>
        <div style={card}>
          <div style={monoLabel}>Supply Chain Composite</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#588157", marginTop: "0.25rem" }}>
            <AnimNum value={scComposite} />
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#999", marginTop: "0.25rem" }}>
            SCI×30 + LJI×20 + C×15 + RCI×15 + CPI×10 + HDI×10
          </div>
        </div>
        <div style={card}>
          <div style={monoLabel}>C-NPV Premium</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: cnpvPremium >= 0 ? "#8B6914" : "#e63946", marginTop: "0.25rem" }}>
            <AnimNum value={cnpvPremium} suffix="%" />
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#999", marginTop: "0.25rem" }}>
            Consciousness-adjusted value
          </div>
        </div>
      </div>

      {/* Radar chart */}
      <div style={{ ...card, padding: "1rem 0.5rem" }}>
        <div style={{ ...monoLabel, paddingLeft: "0.75rem", marginBottom: "0.5rem" }}>12-Axis Radar</div>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="#E8E4DC" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fontSize: 9, fontFamily: "'DM Mono', monospace", fill: "#666" }}
            />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#8B6914"
              fill="#D4B96A"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <RTooltip
              contentStyle={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", background: "#fff", borderWidth: "1px", borderStyle: "solid", borderColor: "#E8E4DC" }}
              formatter={(v: number) => [v.toFixed(1), "Score"]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* 12 Dimension Sliders */}
      <div style={card}>
        <div style={{ ...monoLabel, marginBottom: "1rem" }}>12 Dimensions</div>
        {DIMENSIONS.map((d, i) => (
          <div key={d.id} style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.25rem" }}>
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: "#0A0A10" }}>
                {d.icon} {d.label}
              </span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: d.color, fontWeight: 700 }}>
                <AnimNum value={scores[i]} decimals={0} />
                <span style={{ color: "#999", fontWeight: 400 }}> / {d.max}</span>
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={d.max}
              step={d.max === 1000 ? 5 : 1}
              value={scores[i]}
              onChange={e => updateScore(i, Number(e.target.value))}
              style={{
                width: "100%", height: "6px", appearance: "none", WebkitAppearance: "none",
                background: `linear-gradient(to right, ${d.color} ${(scores[i] / d.max) * 100}%, #E8E4DC ${(scores[i] / d.max) * 100}%)`,
                borderRadius: "3px", outline: "none", cursor: "pointer",
                accentColor: d.color,
              }}
            />
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#aaa", marginTop: "0.15rem" }}>
              {d.unit} · Weight: {d.weight}%
            </div>
          </div>
        ))}
      </div>

      {/* Auto-diagnosis */}
      <div style={card}>
        <div style={{ ...monoLabel, marginBottom: "0.75rem" }}>Auto-Diagnosis</div>
        {diagnosis.weak.length > 0 && (
          <div style={{ marginBottom: "0.75rem" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#e63946", fontWeight: 700, marginBottom: "0.4rem" }}>
              ⚠ BELOW THRESHOLD
            </div>
            {diagnosis.weak.map(w => (
              <div key={w.dim.id} style={{
                display: "flex", justifyContent: "space-between", padding: "0.35rem 0.5rem",
                background: "#FDE8EA", borderRadius: "4px", marginBottom: "0.25rem",
                fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem",
              }}>
                <span>{w.dim.icon} {w.dim.label}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, color: "#e63946" }}>{w.val.toFixed(0)}</span>
              </div>
            ))}
          </div>
        )}
        {diagnosis.strong.length > 0 && (
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#588157", fontWeight: 700, marginBottom: "0.4rem" }}>
              ✦ STRENGTHS
            </div>
            {diagnosis.strong.map(s => (
              <div key={s.dim.id} style={{
                display: "flex", justifyContent: "space-between", padding: "0.35rem 0.5rem",
                background: "#E8F5E9", borderRadius: "4px", marginBottom: "0.25rem",
                fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem",
              }}>
                <span>{s.dim.icon} {s.dim.label}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, color: "#588157" }}>{s.val.toFixed(0)}</span>
              </div>
            ))}
          </div>
        )}
        {diagnosis.weak.length === 0 && diagnosis.strong.length === 0 && (
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#999" }}>
            Adjust the sliders above to see auto-diagnosis.
          </p>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB 2: BENCHMARK
   ═══════════════════════════════════════════════════════════ */

function BenchmarkTab({ scores, entityName }: { scores: number[]; entityName: string }) {
  const userScore = calcSoulScore(scores);
  const userGrade = getGrade(userScore);

  const allEntities = useMemo(() => {
    const user: BenchmarkEntity = { name: entityName || "Your Entity", tag: "YOU", scores: [...scores] };
    return [user, ...BENCHMARKS];
  }, [scores, entityName]);

  return (
    <>
      <h2 style={sectionTitle}>Benchmark Comparison</h2>

      {/* Callout */}
      <div style={{
        ...card, background: "#FDF8E8", borderColor: "#D4B96A",
        fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#5a4a1e", lineHeight: 1.6,
      }}>
        <strong>ESG scores positively correlate with greenwashing</strong> (ScienceDirect 2025).
        BP gets ESG 'AA' but SoulScore <strong style={{ color: "#e63946" }}>F-25</strong>.
        SoulScore's 12-axis measurement eliminates single-dimension gaming.
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <table style={{
          width: "100%", minWidth: "900px", borderCollapse: "collapse",
          fontFamily: "'DM Mono', monospace", fontSize: "0.6rem",
        }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #0A0A10" }}>
              <th style={{ textAlign: "left", padding: "0.5rem 0.4rem", color: "#999", letterSpacing: "0.1em" }}>ENTITY</th>
              {DIMENSIONS.map(d => (
                <th key={d.id} style={{ textAlign: "center", padding: "0.5rem 0.25rem", color: d.color, letterSpacing: "0.05em", fontSize: "0.55rem" }}>
                  {d.shortLabel}
                </th>
              ))}
              <th style={{ textAlign: "center", padding: "0.5rem 0.4rem", color: "#8B6914", letterSpacing: "0.1em" }}>SCORE</th>
              <th style={{ textAlign: "center", padding: "0.5rem 0.4rem", color: "#8B6914" }}>GRD</th>
            </tr>
          </thead>
          <tbody>
            {allEntities.map((ent, idx) => {
              const ss = calcSoulScore(ent.scores);
              const g = getGrade(ss);
              const isUser = idx === 0;
              return (
                <tr key={idx} style={{
                  borderBottom: "1px solid #E8E4DC",
                  background: isUser ? "#FDF8E8" : idx % 2 === 0 ? "#FAFAF7" : "#fff",
                  fontWeight: isUser ? 700 : 400,
                }}>
                  <td style={{ padding: "0.5rem 0.4rem", whiteSpace: "nowrap", color: isUser ? "#8B6914" : "#0A0A10" }}>
                    {ent.tag && <span style={{ color: "#999", marginRight: "0.3rem" }}>{ent.tag}</span>}
                    {ent.name}
                  </td>
                  {ent.scores.map((s, si) => {
                    const n = normalize(s, DIMENSIONS[si]);
                    const col = n >= 70 ? "#588157" : n >= 40 ? "#D4A017" : n < 25 ? "#e63946" : "#666";
                    return (
                      <td key={si} style={{ textAlign: "center", padding: "0.4rem 0.25rem", color: col }}>
                        {DIMENSIONS[si].max === 1000 ? s : s}
                      </td>
                    );
                  })}
                  <td style={{ textAlign: "center", padding: "0.4rem", fontWeight: 700, color: g.color }}>{ss.toFixed(1)}</td>
                  <td style={{ textAlign: "center", padding: "0.4rem", fontWeight: 700, color: g.color }}>{g.letter}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB 3: SUPPLY CHAIN DEEP
   ═══════════════════════════════════════════════════════════ */

function SupplyChainTab({ expandedTier, setExpandedTier, tierScores, updateTierScore }: {
  expandedTier: number | null; setExpandedTier: (v: number | null) => void;
  tierScores: number[][]; updateTierScore: (t: number, f: number, v: number) => void;
}) {
  return (
    <>
      <h2 style={sectionTitle}>Supply Chain Deep Dive</h2>
      <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#666", marginBottom: "1.5rem", lineHeight: 1.6 }}>
        Beyond carbon. 6 tiers, 30 sub-factors. Click any tier to expand and score individual factors.
      </p>

      {/* Vertical chain */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {SUPPLY_TIERS.map((tier, ti) => {
          const avg = tierScores[ti].reduce((a, b) => a + b, 0) / tierScores[ti].length;
          const tierColor = avg >= 70 ? "#588157" : avg >= 40 ? "#D4A017" : "#e63946";
          const isExpanded = expandedTier === ti;
          return (
            <div key={ti}>
              {/* Chain link connector */}
              {ti > 0 && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ width: "3px", height: "20px", background: "#E8E4DC" }} />
                </div>
              )}
              {/* Tier card */}
              <div
                onClick={() => setExpandedTier(isExpanded ? null : ti)}
                style={{
                  ...card,
                  cursor: "pointer",
                  borderLeftWidth: "4px", borderLeftStyle: "solid", borderLeftColor: tierColor,
                  marginBottom: 0,
                  transition: "all 0.3s",
                  background: isExpanded ? "#F5F0E6" : "#fff",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#0A0A10" }}>
                      {tier.name}
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#999", marginTop: "0.15rem" }}>
                      5 sub-factors · Avg: {avg.toFixed(0)}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "50%",
                      background: `conic-gradient(${tierColor} ${avg}%, #E8E4DC ${avg}%)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <div style={{
                        width: "30px", height: "30px", borderRadius: "50%", background: isExpanded ? "#F5F0E6" : "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", fontWeight: 700, color: tierColor,
                      }}>
                        {avg.toFixed(0)}
                      </div>
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "#999", transition: "transform 0.3s", transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
                  </div>
                </div>

                {/* Expanded sub-factors */}
                {isExpanded && (
                  <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #E8E4DC" }}>
                    {tier.factors.map((f, fi) => (
                      <div key={fi} style={{ marginBottom: "0.75rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                          <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: "#333" }}>{f}</span>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", fontWeight: 700, color: tier.color }}>
                            {tierScores[ti][fi]}
                          </span>
                        </div>
                        <input
                          type="range" min={0} max={100} value={tierScores[ti][fi]}
                          onChange={e => updateTierScore(ti, fi, Number(e.target.value))}
                          onClick={e => e.stopPropagation()}
                          style={{
                            width: "100%", height: "4px", appearance: "none", WebkitAppearance: "none",
                            background: `linear-gradient(to right, ${tier.color} ${tierScores[ti][fi]}%, #E8E4DC ${tierScores[ti][fi]}%)`,
                            borderRadius: "2px", outline: "none", cursor: "pointer",
                            accentColor: tier.color,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB 4: WHY SYSTEMS FAIL
   ═══════════════════════════════════════════════════════════ */

function FailuresTab() {
  return (
    <>
      <h2 style={sectionTitle}>Why Every Impact System Failed</h2>
      <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#666", marginBottom: "1.5rem", lineHeight: 1.6 }}>
        20 failure patterns. Each one diagnosed. Each one fixed by SoulScore's architecture.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "0.75rem" }}>
        {FAILURES.map((f, i) => {
          const sevColor = f.severity >= 10 ? "#e63946" : f.severity >= 9 ? "#e17055" : "#D4A017";
          return (
            <div key={i} style={{
              ...card, borderTopWidth: "3px", borderTopStyle: "solid", borderTopColor: sevColor,
              display: "flex", flexDirection: "column", gap: "0.5rem",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", fontWeight: 700, color: "#0A0A10", lineHeight: 1.3, flex: 1 }}>
                  {f.title}
                </span>
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", fontWeight: 700,
                  color: "#fff", background: sevColor, borderRadius: "4px",
                  padding: "0.15rem 0.4rem", marginLeft: "0.5rem", whiteSpace: "nowrap",
                }}>
                  SEV {f.severity}
                </span>
              </div>
              <div style={{
                fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: "#588157",
                background: "#E8F5E9", borderRadius: "4px", padding: "0.4rem 0.6rem", lineHeight: 1.4,
              }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", fontWeight: 700, marginRight: "0.3rem" }}>FIX →</span>
                {f.fix}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB 5: C-NPV CALCULATOR
   ═══════════════════════════════════════════════════════════ */

function CNPVTab({ fcf, setFcf, consciousness, years, setYears, discount, setDiscount, cnpv }: {
  fcf: number; setFcf: (v: number) => void;
  consciousness: number;
  years: number; setYears: (v: number) => void;
  discount: number; setDiscount: (v: number) => void;
  cnpv: { standard: number; adjusted: number; premium: number };
}) {
  const fmt = (n: number) => {
    if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
    if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
    return `$${n.toFixed(0)}`;
  };

  const refs = [
    { name: "Patagonia", hawkins: 430, premium: "+33%" },
    { name: "B Corp Avg", hawkins: 225, premium: "+12.5%" },
    { name: "Fortune 500 Avg", hawkins: 110, premium: "+1%" },
    { name: "BP", hawkins: 75, premium: "-2.5%" },
  ];

  return (
    <>
      <h2 style={sectionTitle}>Consciousness-Adjusted NPV</h2>
      <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#666", marginBottom: "1.5rem", lineHeight: 1.6 }}>
        What happens when consciousness enters the discount rate? The premium (or penalty) is real.
      </p>

      {/* Inputs */}
      <div style={{ ...card, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        <div>
          <div style={monoLabel}>Annual Free Cash Flow</div>
          <input type="number" value={fcf} onChange={e => setFcf(Number(e.target.value))}
            style={{ width: "100%", padding: "0.5rem", borderWidth: "1px", borderStyle: "solid", borderColor: "#E8E4DC", borderRadius: "6px", fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", marginTop: "0.3rem", background: "#FAFAF7" }}
          />
        </div>
        <div>
          <div style={monoLabel}>Consciousness (from Measure tab)</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#8B6914", marginTop: "0.3rem" }}>
            {consciousness}
          </div>
        </div>
        <div>
          <div style={monoLabel}>Projection Years ({years})</div>
          <input type="range" min={3} max={20} value={years} onChange={e => setYears(Number(e.target.value))}
            style={{ width: "100%", marginTop: "0.5rem", accentColor: "#8B6914" }}
          />
        </div>
        <div>
          <div style={monoLabel}>Discount Rate ({discount}%)</div>
          <input type="range" min={4} max={20} value={discount} onChange={e => setDiscount(Number(e.target.value))}
            style={{ width: "100%", marginTop: "0.5rem", accentColor: "#8B6914" }}
          />
        </div>
      </div>

      {/* Results */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
        <div style={card}>
          <div style={monoLabel}>Standard NPV</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#666", marginTop: "0.25rem" }}>
            {fmt(cnpv.standard)}
          </div>
        </div>
        <div style={{ ...card, background: "#FDF8E8", borderWidth: "2px", borderStyle: "solid", borderColor: "#D4B96A" }}>
          <div style={monoLabel}>Consciousness-Adjusted NPV</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: "#8B6914", marginTop: "0.25rem" }}>
            {fmt(cnpv.adjusted)}
          </div>
        </div>
        <div style={card}>
          <div style={monoLabel}>Premium / Penalty</div>
          <div style={{
            fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700,
            color: cnpv.premium >= 0 ? "#588157" : "#e63946", marginTop: "0.25rem",
          }}>
            <AnimNum value={cnpv.premium} suffix="%" />
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#999", marginTop: "0.15rem" }}>
            Delta: {fmt(cnpv.adjusted - cnpv.standard)}
          </div>
        </div>
      </div>

      {/* Reference points */}
      <div style={card}>
        <div style={{ ...monoLabel, marginBottom: "0.75rem" }}>Reference Points</div>
        {refs.map((r, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "0.5rem 0", borderBottom: i < refs.length - 1 ? "1px solid #E8E4DC" : "none",
          }}>
            <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem" }}>{r.name}</span>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#999" }}>Hawkins {r.hawkins}</span>
              <span style={{
                fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", fontWeight: 700,
                color: r.premium.startsWith("-") ? "#e63946" : "#588157",
              }}>{r.premium}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Formula */}
      <div style={{ ...card, background: "#FAFAF7" }}>
        <div style={{ ...monoLabel, marginBottom: "0.5rem" }}>Formula</div>
        <code style={{ fontFamily: "'JetBrains Mono', 'DM Mono', monospace", fontSize: "0.7rem", color: "#0A0A10", lineHeight: 1.8, display: "block" }}>
          C-NPV = Σ [FCF_t × Consciousness_Multiplier / (1 + r_adjusted)^t]<br />
          Multiplier = 1.0 + (Consciousness - 100) / 1000<br />
          Discount adj = -0.4% per 50pts above 100 (capped 2%)
        </code>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   TAB 6: GIG ECONOMY
   ═══════════════════════════════════════════════════════════ */

function GigTab() {
  const stats = [
    { label: "US Freelancers", value: "76.4M" },
    { label: "US Earnings", value: "$1.27T" },
    { label: "Impact Platforms", value: "0" },
    { label: "Global Market", value: "$3.8T" },
  ];

  const layers = [
    { name: "DAO Governance", desc: "Workers vote on impact allocation", color: "#8B6914", icon: "🏛" },
    { name: "Impact Tokens", desc: "ABIT per verified outcome, appreciates with underlying asset", color: "#D4A017", icon: "🪙" },
    { name: "Impact Attribution", desc: "Every task → outcome chain → individual SoulScore", color: "#00b4d8", icon: "📊" },
    { name: "Dignity Infrastructure", desc: "Portable credentials, benefits, mental health", color: "#9b5de5", icon: "✊" },
    { name: "Fair Compensation", desc: "Market rate floor, zero extraction", color: "#588157", icon: "💰" },
  ];

  return (
    <>
      <h2 style={sectionTitle}>The Gig Economy Problem</h2>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            ...card, textAlign: "center",
            background: i === 2 ? "#FDE8EA" : "#fff",
            borderColor: i === 2 ? "#e63946" : "#E8E4DC",
          }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: i === 2 ? "#e63946" : "#0A0A10" }}>
              {s.value}
            </div>
            <div style={monoLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* 5-Layer Stack */}
      <div style={card}>
        <div style={{ ...monoLabel, marginBottom: "1rem" }}>5-Layer Impact Worker Stack</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {layers.map((l, i) => (
            <div key={i} style={{
              padding: "0.75rem 1rem",
              background: `${l.color}10`,
              borderLeft: `4px solid ${l.color}`,
              borderBottom: i < layers.length - 1 ? "1px solid #E8E4DC" : "none",
            }}>
              <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#0A0A10" }}>
                {l.icon} {l.name}
              </div>
              <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: "#666", marginTop: "0.15rem" }}>
                {l.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extractive vs Regenerative */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.75rem" }}>
        {/* Extractive */}
        <div style={{ ...card, borderTopWidth: "3px", borderTopStyle: "solid", borderTopColor: "#e63946" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", color: "#e63946", marginBottom: "0.5rem" }}>
            EXTRACTIVE MODEL
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#0A0A10", marginBottom: "0.75rem" }}>
            Platform Gig Worker
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: "#666" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Hourly Rate</span><span style={{ fontWeight: 700, color: "#0A0A10" }}>$20/hr</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Platform Take</span><span style={{ fontWeight: 700, color: "#e63946" }}>-30%</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Benefits</span><span style={{ fontWeight: 700, color: "#e63946" }}>None</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Impact Tokens</span><span style={{ fontWeight: 700, color: "#e63946" }}>None</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Governance</span><span style={{ fontWeight: 700, color: "#e63946" }}>None</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid #E8E4DC" }}>
              <span style={{ fontWeight: 700 }}>SoulScore</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, color: "#e63946" }}>F — 12</span>
            </div>
          </div>
        </div>

        {/* Regenerative */}
        <div style={{ ...card, borderTopWidth: "3px", borderTopStyle: "solid", borderTopColor: "#588157" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", color: "#588157", marginBottom: "0.5rem" }}>
            REGENERATIVE MODEL
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "#0A0A10", marginBottom: "0.75rem" }}>
            ImpactSoul Impact Worker
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: "#666" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Hourly Rate</span><span style={{ fontWeight: 700, color: "#0A0A10" }}>$20/hr</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Impact Tokens</span><span style={{ fontWeight: 700, color: "#588157" }}>+0.05 ABIT/outcome</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Benefits</span><span style={{ fontWeight: 700, color: "#588157" }}>Full + dividends</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Governance</span><span style={{ fontWeight: 700, color: "#588157" }}>DAO voting rights</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Impact Identity</span><span style={{ fontWeight: 700, color: "#588157" }}>Portable SoulScore</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid #E8E4DC" }}>
              <span style={{ fontWeight: 700 }}>SoulScore</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 700, color: "#588157" }}>B — 68</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
