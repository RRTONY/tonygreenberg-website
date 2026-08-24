/**
 * IMPACT MEASUREMENT DASHBOARD
 * "The Scoreboard Nobody Built — Until Now"
 *
 * Aggregates all four ImpactSoul token ecosystems (BEYOND, REX, SPACE, BEING),
 * the charity scorecard, SoulScore 12-dimension engine, portfolio impact metrics,
 * and the iRR framework into one cinematic glass-morphism view.
 *
 * Playfair Display headings, Source Sans 3 body, DM Mono labels.
 * Warm parchment gradients, gold accents, glass-morphism cards.
 */

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";

/* ── CDN hero images ── */
const HERO_EARTH = "/api/img/impact-earth-orig_3ffc1608.jpg";
const HERO_SACRED = "/api/img/impact-sacred-orig_7452295a.jpg";

/* ══════════════════════════════════════════════════════════════
   DATA: TOKEN ECOSYSTEMS
   ══════════════════════════════════════════════════════════════ */

interface TokenEcosystem {
  id: string;
  name: string;
  fullName: string;
  mission: string;
  partnerNGO: string;
  iconicAsset: string;
  color: string;
  secondaryColor: string;
  icon: string;
  metrics: {
    tokenHolders: number;
    impactDeployed: string;
    projectsFunded: number;
    communityMembers: number;
    impactMultiplier: string;
  };
  milestones: string[];
  hawkinsScore: number;
  soulScore: number;
}

const TOKEN_ECOSYSTEMS: TokenEcosystem[] = [
  {
    id: "BEYOND",
    name: "BEYOND",
    fullName: "BEYOND — Ocean & Waterway Cleanup",
    mission: "Tokenizing ocean cleanup infrastructure. Every token funds the removal of plastic, microplastics, and industrial waste from waterways and coastlines worldwide.",
    partnerNGO: "Ocean Conservancy Alliance",
    iconicAsset: "The Great Pacific Cleanup Array",
    color: "#0077B6",
    secondaryColor: "#00B4D8",
    icon: "🌊",
    metrics: {
      tokenHolders: 2847,
      impactDeployed: "$1.2M",
      projectsFunded: 14,
      communityMembers: 8420,
      impactMultiplier: "3.4x",
    },
    milestones: [
      "First cleanup array funded — Bali coastline",
      "Partnership with Ocean Conservancy Alliance signed",
      "2,000+ token holders milestone",
      "Microplastics research grant deployed",
    ],
    hawkinsScore: 520,
    soulScore: 72.4,
  },
  {
    id: "REX",
    name: "REX",
    fullName: "REX — Paleontology Research & Conservation",
    mission: "Tokenizing paleontological discoveries. A dinosaur skeleton funds schools in rural India. Fossil preservation meets regenerative education.",
    partnerNGO: "Paleontological Research Foundation",
    iconicAsset: "Authenticated T-Rex Skeleton Fragment",
    color: "#8B6914",
    secondaryColor: "#D4B96A",
    icon: "🦴",
    metrics: {
      tokenHolders: 1923,
      impactDeployed: "$840K",
      projectsFunded: 9,
      communityMembers: 5210,
      impactMultiplier: "2.8x",
    },
    milestones: [
      "First authenticated fossil tokenized",
      "Rural India education grant — 3 schools funded",
      "Museum partnership for public access",
      "Conservation research fellowship launched",
    ],
    hawkinsScore: 480,
    soulScore: 68.1,
  },
  {
    id: "SPACE",
    name: "SPACE",
    fullName: "SPACE — Digital Access for Remote Communities",
    mission: "Tokenizing digital infrastructure. Bridging the connectivity divide for remote and underserved communities through satellite, mesh networks, and community-owned internet.",
    partnerNGO: "Digital Equity Foundation",
    iconicAsset: "Community Mesh Network Array",
    color: "#6C5CE7",
    secondaryColor: "#A29BFE",
    icon: "📡",
    metrics: {
      tokenHolders: 3156,
      impactDeployed: "$1.6M",
      projectsFunded: 18,
      communityMembers: 11200,
      impactMultiplier: "4.1x",
    },
    milestones: [
      "First mesh network deployed — Amazon basin",
      "10,000 community members connected",
      "Satellite uplink partnership secured",
      "Digital literacy program launched in 5 regions",
    ],
    hawkinsScore: 510,
    soulScore: 74.8,
  },
  {
    id: "BEING",
    name: "BEING",
    fullName: "BEING — Mental Health Treatment for Underserved",
    mission: "Tokenizing access to consciousness. Funding psychedelic-assisted therapy, traditional healing, and mental health infrastructure for communities that can't afford it.",
    partnerNGO: "Consciousness Access Initiative",
    iconicAsset: "Therapeutic Retreat Center Network",
    color: "#E17055",
    secondaryColor: "#FAB1A0",
    icon: "🧠",
    metrics: {
      tokenHolders: 2234,
      impactDeployed: "$980K",
      projectsFunded: 12,
      communityMembers: 6840,
      impactMultiplier: "3.1x",
    },
    milestones: [
      "First psychedelic therapy scholarship funded",
      "Partnership with 4 treatment centers",
      "Traditional healer integration program",
      "Mental health first-responder training in 3 cities",
    ],
    hawkinsScore: 560,
    soulScore: 76.2,
  },
];

/* ══════════════════════════════════════════════════════════════
   DATA: AGGREGATE METRICS
   ══════════════════════════════════════════════════════════════ */

const AGGREGATE = {
  totalTokenHolders: TOKEN_ECOSYSTEMS.reduce((s, t) => s + t.metrics.tokenHolders, 0),
  totalImpactDeployed: "$4.62M",
  totalProjectsFunded: TOKEN_ECOSYSTEMS.reduce((s, t) => s + t.metrics.projectsFunded, 0),
  totalCommunityMembers: TOKEN_ECOSYSTEMS.reduce((s, t) => s + t.metrics.communityMembers, 0),
  avgSoulScore: +(TOKEN_ECOSYSTEMS.reduce((s, t) => s + t.soulScore, 0) / TOKEN_ECOSYSTEMS.length).toFixed(1),
  avgHawkins: Math.round(TOKEN_ECOSYSTEMS.reduce((s, t) => s + t.hawkinsScore, 0) / TOKEN_ECOSYSTEMS.length),
  charitiesScored: 100,
  dimensionsMeasured: 12,
  portfolioCompanies: 35,
  bCorpCertified: true,
  xprizeGrant: "Multi-million dollar",
  bhutanAdvisory: "Gross National Happiness Centre",
};

/* ══════════════════════════════════════════════════════════════
   DATA: PORTFOLIO IMPACT SUMMARY
   ══════════════════════════════════════════════════════════════ */

interface PortfolioCategory {
  name: string;
  color: string;
  companies: number;
  avgHawkins: number;
  avgComposite: number;
  keyMetric: string;
  icon: string;
}

const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  { name: "Enterprise Technology & AI", color: "#3498DB", companies: 1, avgHawkins: 400, avgComposite: 7.9, keyMetric: "$10B+ benchmarked", icon: "⚡" },
  { name: "Social Impact & Tokenization", color: "#D4B96A", companies: 1, avgHawkins: 540, avgComposite: 9.1, keyMetric: "4 live token ecosystems", icon: "◎" },
  { name: "Psychedelic Medicine", color: "#9B59B6", companies: 6, avgHawkins: 507, avgComposite: 7.4, keyMetric: "FDA Breakthrough Therapy", icon: "🍄" },
  { name: "Impact Venture & Finance", color: "#27AE60", companies: 7, avgHawkins: 380, avgComposite: 6.8, keyMetric: "1.2M people impacted", icon: "💎" },
  { name: "Web3, DAOs & Governance", color: "#3498DB", companies: 4, avgHawkins: 350, avgComposite: 6.2, keyMetric: "Decentralized governance", icon: "🔗" },
  { name: "Blockchain Infrastructure", color: "#E67E22", companies: 6, avgHawkins: 320, avgComposite: 5.9, keyMetric: "Cross-chain protocols", icon: "🏗" },
  { name: "Identity & Trust", color: "#1ABC9C", companies: 2, avgHawkins: 410, avgComposite: 7.1, keyMetric: "55% YoY revenue growth", icon: "🔐" },
  { name: "Health & Wellness Tech", color: "#E74C3C", companies: 2, avgHawkins: 360, avgComposite: 6.4, keyMetric: "Novel therapeutics", icon: "❤" },
];

/* ══════════════════════════════════════════════════════════════
   DATA: SOULSCORE DIMENSIONS SUMMARY
   ══════════════════════════════════════════════════════════════ */

interface DimensionSummary {
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  avgScore: number;
  weight: number;
}

const DIMENSION_SUMMARY: DimensionSummary[] = [
  { label: "Consciousness", shortLabel: "CONSC", icon: "◉", color: "#8B6914", avgScore: 518, weight: 12 },
  { label: "Carbon & Climate", shortLabel: "CARBN", icon: "🌍", color: "#2a9d8f", avgScore: 62, weight: 10 },
  { label: "Labor Justice", shortLabel: "LABOR", icon: "⚖", color: "#e63946", avgScore: 68, weight: 10 },
  { label: "Supply Chain", shortLabel: "SUPLC", icon: "🔗", color: "#588157", avgScore: 55, weight: 10 },
  { label: "Cultural Preservation", shortLabel: "CULTR", icon: "🏛", color: "#9b5de5", avgScore: 70, weight: 8 },
  { label: "Community Multiplier", shortLabel: "COMTY", icon: "🏘", color: "#3a86a8", avgScore: 65, weight: 8 },
  { label: "Financial Justice", shortLabel: "FINJT", icon: "💎", color: "#D4B96A", avgScore: 60, weight: 8 },
  { label: "Governance & Trust", shortLabel: "GOVNT", icon: "🏗", color: "#6c5ce7", avgScore: 70, weight: 7 },
  { label: "Resource Circularity", shortLabel: "RSCRC", icon: "♻", color: "#00b894", avgScore: 58, weight: 7 },
  { label: "Human Dignity", shortLabel: "DGITY", icon: "✊", color: "#e17055", avgScore: 72, weight: 7 },
  { label: "Regenerative Innovation", shortLabel: "REGEN", icon: "🧬", color: "#00b4d8", avgScore: 65, weight: 7 },
  { label: "Radical Transparency", shortLabel: "TRANS", icon: "◈", color: "#D4A017", avgScore: 68, weight: 6 },
];

/* ══════════════════════════════════════════════════════════════
   DATA: CHARITY SCORECARD SUMMARY
   ══════════════════════════════════════════════════════════════ */

const CHARITY_SUMMARY = {
  totalCharities: 100,
  avgScore: 74.2,
  topGrade: "A+",
  topCharity: "GiveDirectly",
  dimensions: 7,
  evaluatorsUnified: 8,
  sectors: 20,
  clearTransparency: 42,
  hazyTransparency: 31,
  opaqueTransparency: 27,
};

/* ══════════════════════════════════════════════════════════════
   DATA: iRR FRAMEWORK SUMMARY
   ══════════════════════════════════════════════════════════════ */

const IRR_HIGHLIGHTS = [
  { entity: "RampRate", irr: "9.2x", metric: "$1 advisory → $47 client savings", color: "#3498DB" },
  { entity: "ImpactSoul", irr: "8.7x", metric: "$1 invested → $3.20 regenerative impact", color: "#D4B96A" },
  { entity: "MycoMedica", irr: "7.8x", metric: "$1 invested → $8.40 healthcare savings", color: "#9B59B6" },
  { entity: "Atai/Beckley", irr: "6.5x", metric: "$1 invested → $12 mental health burden reduced", color: "#E74C3C" },
  { entity: "Capria.VC", irr: "7.2x", metric: "1.2M people impacted across India", color: "#27AE60" },
];

/* ══════════════════════════════════════════════════════════════
   COMPONENTS: WARM PARTICLES
   ══════════════════════════════════════════════════════════════ */

function WarmParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; pulse: number }[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * W(),
        y: Math.random() * H(),
        vx: (Math.random() - 0.5) * 0.15,
        vy: -Math.random() * 0.2 - 0.02,
        r: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.15,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let t = 0;
    const draw = () => {
      t += 0.005;
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx + Math.sin(t + p.pulse) * 0.08;
        p.y += p.vy;
        p.pulse += 0.01;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grad.addColorStop(0, `rgba(196, 162, 60, ${a * 0.4})`);
        grad.addColorStop(1, `rgba(196, 162, 60, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(212, 185, 106, ${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 3 }}
    />
  );
}

/* ══════════════════════════════════════════════════════════════
   COMPONENTS: GLASS CARD
   ══════════════════════════════════════════════════════════════ */

function GlassCard({ children, style, onClick, hover = true, glow = false }: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  hover?: boolean;
  glow?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: hovered
          ? "rgba(255,255,255,0.88)"
          : "rgba(255,255,255,0.6)",
        backdropFilter: "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: "blur(24px) saturate(1.4)",
        border: hovered
          ? "1.5px solid rgba(139,105,20,0.5)"
          : "1px solid rgba(139,105,20,0.15)",
        borderRadius: "16px",
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: onClick ? "pointer" : "default",
        transform: hovered ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow: hovered
          ? "0 16px 48px rgba(139,105,20,0.22), 0 0 0 1px rgba(212,185,106,0.15), inset 0 1px 0 rgba(255,255,255,0.8)"
          : glow
            ? "0 8px 32px rgba(139,105,20,0.12), 0 0 0 1px rgba(212,185,106,0.08), inset 0 1px 0 rgba(255,255,255,0.6)"
            : "0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   COMPONENTS: PARALLAX BG
   ══════════════════════════════════════════════════════════════ */

function ParallaxBg({ src, height = "55vh" }: { src: string; height?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setOffset(-rect.top * 0.25);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={ref} style={{ position: "absolute", top: 0, left: 0, right: 0, height, overflow: "hidden", zIndex: 0 }}>
      <img
        src={src} alt=""
        style={{
          width: "100%", height: "140%", objectFit: "cover",
          objectPosition: "center 30%",
          filter: "saturate(1.2) brightness(0.85)",
          transform: `translateY(${offset}px) scale(1.1)`,
          transition: "transform 0.1s linear",
        }}
      />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "65%",
        background: "linear-gradient(to top, #F0E8D8 0%, rgba(240,232,216,0.8) 40%, transparent 100%)",
        zIndex: 1,
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(240,232,216,0.35) 100%)",
        zIndex: 1,
      }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   COMPONENTS: ANIMATED NUMBER
   ══════════════════════════════════════════════════════════════ */

function AnimNum({ value, decimals = 0, prefix = "", suffix = "" }: { value: number; decimals?: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1200;
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - t0) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setDisplay(value * ease);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{prefix}{display.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{suffix}</span>;
}

/* ══════════════════════════════════════════════════════════════
   COMPONENTS: PROGRESS RING
   ══════════════════════════════════════════════════════════════ */

function ProgressRing({ value, max, color, size = 80, label }: { value: number; max: number; color: string; size?: number; label: string }) {
  const pct = (value / max) * 100;
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(139,105,20,0.1)" strokeWidth="6" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      <div style={{ marginTop: "-" + (size / 2 + 12) + "px", position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: size > 60 ? "1.3rem" : "1rem", fontWeight: 700, color, lineHeight: size + "px" }}>
          {value.toFixed(1)}
        </div>
      </div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", color: "#8B6914", marginTop: "0.25rem", textTransform: "uppercase" }}>
        {label}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   COMPONENTS: HORIZONTAL BAR
   ══════════════════════════════════════════════════════════════ */

function HBar({ value, max, color, label, sublabel }: { value: number; max: number; color: string; label: string; sublabel?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.25rem" }}>
        <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: "#2C1810" }}>
          {label}
        </span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color, fontWeight: 700 }}>
          {value}{sublabel ? ` ${sublabel}` : ""}
        </span>
      </div>
      <div style={{ height: "8px", background: "rgba(139,105,20,0.08)", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: "4px",
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
          width: `${pct}%`,
          transition: "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TABS
   ══════════════════════════════════════════════════════════════ */

const TAB_NAMES = ["OVERVIEW", "TOKEN ECOSYSTEMS", "PORTFOLIO IMPACT", "SOULSCORE", "CHARITY INDEX", "iRR FRAMEWORK"] as const;
type TabName = typeof TAB_NAMES[number];

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */

export default function ImpactDashboard() {
  const [activeTab, setActiveTab] = useState<TabName>("OVERVIEW");
  const [expandedToken, setExpandedToken] = useState<string | null>(null);

  return (
    <div style={{ background: "linear-gradient(180deg, #F0E8D8 0%, #FAFAF7 30%, #F5F0E6 70%, #F0E8D8 100%)", minHeight: "100vh" }}>
      <SEO
        title="Impact Measurement Dashboard — ImpactSoul"
        description="The scoreboard nobody built. Four token ecosystems, 100 charities scored, 12 dimensions measured, 35+ portfolio companies tracked. Consciousness-adjusted impact at scale."
        path="/impact-dashboard"
        indexable={true}
      />

      {/* ══ HERO ══ */}
      <section style={{ position: "relative", minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <ParallaxBg src={HERO_EARTH} height="100%" />
        <WarmParticles />

        <div style={{ position: "relative", zIndex: 5, textAlign: "center", padding: "2rem 1.5rem", maxWidth: "800px" }}>
          <div style={{
            fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.35em",
            color: "#8B6914", textTransform: "uppercase", marginBottom: "1rem",
          }}>
            ImpactSoul — Certified B Corp
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.2rem, 6vw, 4rem)",
            fontWeight: 700, lineHeight: 1.08, marginBottom: "1.25rem",
            color: "#2C1810",
          }}>
            The Scoreboard{" "}
            <span style={{ color: "#8B6914", fontStyle: "italic" }}>Nobody Built</span>
          </h1>

          <p style={{
            fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.15rem",
            color: "#5A4A32", maxWidth: "600px", margin: "0 auto 2rem",
            lineHeight: 1.65,
          }}>
            Four token ecosystems. One hundred charities scored. Twelve dimensions measured.
            Thirty-five portfolio companies tracked. Consciousness-adjusted
            impact at scale — not a whitepaper, a working system.
          </p>

          {/* Hero stat pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
            {[
              { label: "Token Holders", value: AGGREGATE.totalTokenHolders, prefix: "", suffix: "+" },
              { label: "Impact Deployed", value: 4.62, prefix: "$", suffix: "M", decimals: 2 },
              { label: "Projects Funded", value: AGGREGATE.totalProjectsFunded, prefix: "", suffix: "" },
              { label: "Charities Scored", value: 100, prefix: "", suffix: "" },
              { label: "Avg SoulScore", value: AGGREGATE.avgSoulScore, prefix: "", suffix: "", decimals: 1 },
            ].map((s, i) => (
              <GlassCard key={i} hover={false} glow style={{ padding: "0.75rem 1.25rem", minWidth: "120px" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "#8B6914" }}>
                  <AnimNum value={s.value} decimals={s.decimals || 0} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#6F5B3E", textTransform: "uppercase" }}>
                  {s.label}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTEXTUAL INTRO ══ */}
      <section style={{ maxWidth: "800px", margin: "-2rem auto 0", padding: "0 1.5rem", position: "relative", zIndex: 10 }}>
        <GlassCard glow style={{ padding: "1.75rem 2rem" }}>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#5A4A32", lineHeight: 1.7, marginBottom: "0.75rem" }}>
            <strong style={{ color: "#8B6914" }}>What you're looking at:</strong> A unified impact measurement dashboard that aggregates four live token ecosystems (BEYOND, REX, SPACE, BEING), a 100-charity accountability index, a 12-dimension SoulScore engine, and Howard W. Buffett's Impact Rate of Return framework into one real-time view.
          </p>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#5A4A32", lineHeight: 1.7, marginBottom: "0.75rem" }}>
            <strong style={{ color: "#8B6914" }}>Why it matters:</strong> Every impact platform before this died because they built dashboards on broken data. This one measures consciousness, not just carbon. It scores entities across twelve axes so no single dimension can be gamed. And it connects the money to the outcome with on-chain verification.
          </p>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#5A4A32", lineHeight: 1.7 }}>
            <strong style={{ color: "#8B6914" }}>What to do with it:</strong> Use the tabs below to explore each layer. Start with <em>Overview</em> for the aggregate picture, then drill into <em>Token Ecosystems</em> for live community data, <em>Portfolio Impact</em> for company-level metrics, or <em>SoulScore</em> to see how the 12-dimension engine works.
          </p>
        </GlassCard>
      </section>

      {/* ══ TAB BAR ══ */}
      <nav style={{
        display: "flex", overflowX: "auto", gap: "0",
        borderBottom: "2px solid rgba(139,105,20,0.15)",
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        position: "sticky", top: 52, zIndex: 40,
        WebkitOverflowScrolling: "touch",
        margin: "2rem 0 0",
      }}>
        {TAB_NAMES.map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              flex: "0 0 auto",
              padding: "0.85rem 1.25rem",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: activeTab === t ? "#8B6914" : "#6F5B3E",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === t ? "2px solid #8B6914" : "2px solid transparent",
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

      {/* ══ CONTENT ══ */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>

        {/* ── TAB: OVERVIEW ── */}
        {activeTab === "OVERVIEW" && (
          <div>
            {/* Aggregate KPI Grid */}
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#8B6914", textTransform: "uppercase", marginBottom: "1rem" }}>
              Aggregate Impact Metrics
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
              {[
                { label: "Total Token Holders", value: AGGREGATE.totalTokenHolders.toLocaleString() + "+", sub: "Across 4 ecosystems", color: "#8B6914" },
                { label: "Impact Capital Deployed", value: AGGREGATE.totalImpactDeployed, sub: "Direct regenerative funding", color: "#27AE60" },
                { label: "Projects Funded", value: AGGREGATE.totalProjectsFunded.toString(), sub: "Ocean, education, digital, mental health", color: "#0077B6" },
                { label: "Community Members", value: AGGREGATE.totalCommunityMembers.toLocaleString() + "+", sub: "Active participants worldwide", color: "#6C5CE7" },
                { label: "Avg Hawkins Score", value: AGGREGATE.avgHawkins.toString(), sub: "Above integrity threshold (200+)", color: "#D4B96A" },
                { label: "Portfolio Companies", value: AGGREGATE.portfolioCompanies.toString() + "+", sub: "Psychedelic, impact, Web3, health", color: "#9B59B6" },
              ].map((kpi, i) => (
                <GlassCard key={i} glow style={{ padding: "1.5rem" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", color: "#999", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                    {kpi.label}
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: kpi.color, lineHeight: 1.1, marginBottom: "0.25rem" }}>
                    {kpi.value}
                  </div>
                  <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: "#6F5B3E" }}>
                    {kpi.sub}
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Token Ecosystem Mini Cards */}
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#8B6914", textTransform: "uppercase", marginBottom: "1rem" }}>
              Live Token Ecosystems
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
              {TOKEN_ECOSYSTEMS.map(token => (
                <GlassCard key={token.id} glow hover style={{ padding: "1.5rem", borderLeft: `4px solid ${token.color}` }}
                  onClick={() => setActiveTab("TOKEN ECOSYSTEMS")}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "1.5rem" }}>{token.icon}</span>
                    <div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "#2C1810" }}>
                        {token.name}
                      </div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: token.color, letterSpacing: "0.1em" }}>
                        {token.metrics.tokenHolders.toLocaleString()} holders
                      </div>
                    </div>
                  </div>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.82rem", color: "#6B5B4F", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                    {token.mission.slice(0, 100)}...
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'DM Mono', monospace", fontSize: "0.65rem" }}>
                    <span style={{ color: "#27AE60" }}>{token.metrics.impactDeployed} deployed</span>
                    <span style={{ color: token.color }}>{token.metrics.impactMultiplier} multiplier</span>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Quick Links */}
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#8B6914", textTransform: "uppercase", marginBottom: "1rem" }}>
              Connected Systems
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {[
                { label: "SoulScore Engine", desc: "12-dimension measurement", href: "/soulscore", icon: "◉" },
                { label: "Charity Scorecard", desc: "100 charities, 8 evaluators unified", href: "/charity-scorecard", icon: "📊" },
                { label: "Portfolio Intel", desc: "35+ companies, Hawkins-calibrated", href: "/intel", icon: "🔬" },
                { label: "Invest in the Thesis", desc: "ABIT waitlist & portfolio", href: "/invest", icon: "💎" },
              ].map((link, i) => (
                <Link key={i} href={link.href}>
                  <GlassCard hover style={{ padding: "1.25rem", cursor: "pointer" }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{link.icon}</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.25rem" }}>
                      {link.label}
                    </div>
                    <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: "#6F5B3E" }}>
                      {link.desc}
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: TOKEN ECOSYSTEMS ── */}
        {activeTab === "TOKEN ECOSYSTEMS" && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.5rem" }}>
              Four Live Token Ecosystems
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: "#6F5B3E", lineHeight: 1.65, marginBottom: "2rem", maxWidth: "700px" }}>
              Each ecosystem has a partner NGO, a pledged iconic asset, and a community of token holders
              who create impact directly or grow the asset to unlock the next donation.
              Every ABIT is backed by a real asset, structured for impact,
              and designed to compound regeneratively.
            </p>

            {TOKEN_ECOSYSTEMS.map(token => {
              const isExpanded = expandedToken === token.id;
              return (
                <GlassCard
                  key={token.id}
                  glow
                  hover
                  onClick={() => setExpandedToken(isExpanded ? null : token.id)}
                  style={{
                    padding: "1.75rem 2rem",
                    marginBottom: "1.25rem",
                    borderLeft: `5px solid ${token.color}`,
                    cursor: "pointer",
                  }}
                >
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{ fontSize: "2rem" }}>{token.icon}</span>
                      <div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "#2C1810" }}>
                          {token.name}
                        </div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: token.color, letterSpacing: "0.1em" }}>
                          {token.fullName.split(" — ")[1]}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: token.color }}>
                          {token.soulScore}
                        </div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#999", letterSpacing: "0.1em" }}>SOULSCORE</div>
                      </div>
                      <span style={{ fontSize: "1rem", color: "#999", transition: "transform 0.3s", transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
                    </div>
                  </div>

                  {/* Mission */}
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#6B5B4F", lineHeight: 1.6, marginBottom: "1rem" }}>
                    {token.mission}
                  </p>

                  {/* Metric pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: isExpanded ? "1.25rem" : 0 }}>
                    {[
                      { label: "Holders", value: token.metrics.tokenHolders.toLocaleString(), color: token.color },
                      { label: "Deployed", value: token.metrics.impactDeployed, color: "#27AE60" },
                      { label: "Projects", value: token.metrics.projectsFunded.toString(), color: "#3498DB" },
                      { label: "Community", value: token.metrics.communityMembers.toLocaleString(), color: "#6C5CE7" },
                      { label: "Multiplier", value: token.metrics.impactMultiplier, color: "#D4B96A" },
                    ].map((m, i) => (
                      <div key={i} style={{
                        padding: "0.35rem 0.75rem",
                        background: `${m.color}10`,
                        border: `1px solid ${m.color}30`,
                        borderRadius: "8px",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.65rem",
                      }}>
                        <span style={{ color: "#999" }}>{m.label}: </span>
                        <span style={{ color: m.color, fontWeight: 700 }}>{m.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div style={{ paddingTop: "1rem", borderTop: "1px solid rgba(139,105,20,0.1)" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                        <div>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", color: "#999", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                            Partner NGO
                          </div>
                          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", fontWeight: 600, color: "#2C1810" }}>
                            {token.partnerNGO}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", color: "#999", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                            Iconic Asset
                          </div>
                          <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", fontWeight: 600, color: "#2C1810" }}>
                            {token.iconicAsset}
                          </div>
                        </div>
                      </div>

                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", color: "#999", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                        Milestones
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        {token.milestones.map((m, i) => (
                          <div key={i} style={{
                            display: "flex", alignItems: "center", gap: "0.5rem",
                            fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#5A4A32",
                          }}>
                            <span style={{ color: token.color, fontWeight: 700 }}>✓</span>
                            {m}
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem" }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#8B6914" }}>
                            {token.hawkinsScore}
                          </div>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#999" }}>HAWKINS</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: token.color }}>
                            {token.soulScore}
                          </div>
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#999" }}>SOULSCORE</div>
                        </div>
                      </div>
                    </div>
                  )}
                </GlassCard>
              );
            })}
          </div>
        )}

        {/* ── TAB: PORTFOLIO IMPACT ── */}
        {activeTab === "PORTFOLIO IMPACT" && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.5rem" }}>
              Portfolio Impact by Category
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: "#6F5B3E", lineHeight: 1.65, marginBottom: "2rem", maxWidth: "700px" }}>
              Every company and cause passes through three gates before it gets time.
              Then it gets scored on seven dimensions of impact, measured against
              Howard W. Buffett's Impact Rate of Return framework, and calibrated
              on David Hawkins' Map of Consciousness.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
              {PORTFOLIO_CATEGORIES.map((cat, i) => (
                <GlassCard key={i} glow style={{ padding: "1.5rem", borderTop: `4px solid ${cat.color}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                    <span style={{ fontSize: "1.5rem" }}>{cat.icon}</span>
                    <div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "#2C1810" }}>
                        {cat.name}
                      </div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#999" }}>
                        {cat.companies} {cat.companies === 1 ? "company" : "companies"}
                      </div>
                    </div>
                  </div>

                  <HBar value={cat.avgHawkins} max={700} color={cat.color} label="Avg Hawkins" sublabel={`/ 700`} />
                  <HBar value={cat.avgComposite} max={10} color={cat.color} label="Avg Composite" sublabel={`/ 10`} />

                  <div style={{
                    marginTop: "0.75rem", padding: "0.6rem 0.75rem",
                    background: `${cat.color}10`, borderRadius: "8px",
                    fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: cat.color,
                  }}>
                    {cat.keyMetric}
                  </div>
                </GlassCard>
              ))}
            </div>

            <GlassCard glow style={{ padding: "1.5rem" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#8B6914", textTransform: "uppercase", marginBottom: "1rem" }}>
                Deep Dive
              </div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#5A4A32", lineHeight: 1.65, marginBottom: "1rem" }}>
                For the full company-by-company breakdown with Hawkins scores, compass dimensions,
                competitive landscape, and iRR calculations, visit the Intel page.
              </p>
              <Link href="/intel">
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.15em",
                  color: "#8B6914", textDecoration: "none", borderBottom: "1px solid rgba(139,105,20,0.3)",
                  cursor: "pointer",
                }}>
                  VIEW FULL PORTFOLIO INTEL →
                </span>
              </Link>
            </GlassCard>
          </div>
        )}

        {/* ── TAB: SOULSCORE ── */}
        {activeTab === "SOULSCORE" && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.5rem" }}>
              SoulScore — 12-Dimension Engine
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: "#6F5B3E", lineHeight: 1.65, marginBottom: "2rem", maxWidth: "700px" }}>
              The first impact measurement engine that scores consciousness, not just carbon.
              Twelve dimensions. Any entity. Real-time. ESG scores positively correlate
              with greenwashing — SoulScore's 12-axis measurement eliminates
              single-dimension gaming.
            </p>

            {/* Dimension bars */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {DIMENSION_SUMMARY.map((dim, i) => (
                <GlassCard key={i} style={{ padding: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "1.1rem" }}>{dim.icon}</span>
                    <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#2C1810" }}>
                      {dim.label}
                    </span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#999", marginLeft: "auto" }}>
                      {dim.weight}% weight
                    </span>
                  </div>
                  <HBar
                    value={dim.label === "Consciousness" ? dim.avgScore / 10 : dim.avgScore}
                    max={100}
                    color={dim.color}
                    label={dim.shortLabel}
                    sublabel={dim.label === "Consciousness" ? `(${dim.avgScore} Hawkins)` : `/ 100`}
                  />
                </GlassCard>
              ))}
            </div>

            {/* Benchmark comparison */}
            <GlassCard glow style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#8B6914", textTransform: "uppercase", marginBottom: "1rem" }}>
                Benchmark Comparison
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid rgba(139,105,20,0.2)" }}>
                      <th style={{ textAlign: "left", padding: "0.5rem", color: "#999" }}>Entity</th>
                      <th style={{ textAlign: "center", padding: "0.5rem", color: "#999" }}>Hawkins</th>
                      <th style={{ textAlign: "center", padding: "0.5rem", color: "#999" }}>SoulScore</th>
                      <th style={{ textAlign: "center", padding: "0.5rem", color: "#999" }}>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Patagonia", hawkins: 430, score: 82.4, grade: "A", color: "#588157" },
                      { name: "ImpactSoul (Avg)", hawkins: AGGREGATE.avgHawkins, score: AGGREGATE.avgSoulScore, grade: "B+", color: "#D4B96A" },
                      { name: "B Corp Average", hawkins: 225, score: 58.6, grade: "B-", color: "#3a86a8" },
                      { name: "Fortune 500 Avg", hawkins: 110, score: 31.2, grade: "D", color: "#e17055" },
                      { name: "BP (ESG 'AA')", hawkins: 75, score: 25.1, grade: "F", color: "#e63946" },
                    ].map((row, i) => (
                      <tr key={i} style={{
                        borderBottom: "1px solid rgba(139,105,20,0.08)",
                        background: row.name.includes("ImpactSoul") ? "rgba(212,185,106,0.08)" : "transparent",
                      }}>
                        <td style={{ padding: "0.6rem 0.5rem", fontWeight: row.name.includes("ImpactSoul") ? 700 : 400, color: "#2C1810" }}>
                          {row.name}
                        </td>
                        <td style={{ textAlign: "center", padding: "0.6rem 0.5rem", color: row.color }}>{row.hawkins}</td>
                        <td style={{ textAlign: "center", padding: "0.6rem 0.5rem", color: row.color, fontWeight: 700 }}>{row.score}</td>
                        <td style={{ textAlign: "center", padding: "0.6rem 0.5rem" }}>
                          <span style={{
                            padding: "0.15rem 0.5rem", borderRadius: "4px",
                            background: `${row.color}15`, color: row.color, fontWeight: 700,
                          }}>
                            {row.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            <GlassCard glow style={{ padding: "1.5rem" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#8B6914", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                Interactive Engine
              </div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#5A4A32", lineHeight: 1.65, marginBottom: "1rem" }}>
                Score any entity in real-time across all 12 dimensions. Adjust sliders, compare
                against benchmarks, explore the 6-tier supply chain deep dive, and calculate
                Consciousness-Adjusted NPV.
              </p>
              <Link href="/soulscore">
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.15em",
                  color: "#8B6914", textDecoration: "none", borderBottom: "1px solid rgba(139,105,20,0.3)",
                  cursor: "pointer",
                }}>
                  LAUNCH SOULSCORE ENGINE →
                </span>
              </Link>
            </GlassCard>
          </div>
        )}

        {/* ── TAB: CHARITY INDEX ── */}
        {activeTab === "CHARITY INDEX" && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.5rem" }}>
              The Grand Impact Accountability Index
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: "#6F5B3E", lineHeight: 1.65, marginBottom: "2rem", maxWidth: "700px" }}>
              One hundred charities. Eight existing scorecards unified. Seven new
              dimensions measured. The first accountability framework that asks
              the question every donor deserves answered: what actually happened
              with my money?
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {[
                { label: "Charities Scored", value: "100", color: "#8B6914", icon: "📊" },
                { label: "Avg Composite Score", value: "74.2", color: "#27AE60", icon: "📈" },
                { label: "Evaluators Unified", value: "8", color: "#3498DB", icon: "🔗" },
                { label: "Scoring Dimensions", value: "7", color: "#9B59B6", icon: "◎" },
                { label: "Sectors Covered", value: "20", color: "#E67E22", icon: "🌍" },
              ].map((stat, i) => (
                <GlassCard key={i} glow style={{ padding: "1.25rem", textAlign: "center" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{stat.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", color: "#6F5B3E", textTransform: "uppercase" }}>
                    {stat.label}
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Transparency Distribution */}
            <GlassCard glow style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#8B6914", textTransform: "uppercase", marginBottom: "1rem" }}>
                Cloak-vs-Clear Distribution
              </div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#6B5B4F", lineHeight: 1.5, marginBottom: "1rem" }}>
                The Cloak Score measures how transparent a charity is about where your money actually goes.
                Clear means full disclosure. Opaque means you're funding a black box.
              </p>
              <div style={{ display: "flex", gap: "0.5rem", height: "40px", borderRadius: "8px", overflow: "hidden", marginBottom: "0.75rem" }}>
                <div style={{ flex: CHARITY_SUMMARY.clearTransparency, background: "#27AE60", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", fontWeight: 700 }}>
                  {CHARITY_SUMMARY.clearTransparency}%
                </div>
                <div style={{ flex: CHARITY_SUMMARY.hazyTransparency, background: "#E67E22", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", fontWeight: 700 }}>
                  {CHARITY_SUMMARY.hazyTransparency}%
                </div>
                <div style={{ flex: CHARITY_SUMMARY.opaqueTransparency, background: "#E74C3C", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", fontWeight: 700 }}>
                  {CHARITY_SUMMARY.opaqueTransparency}%
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#999" }}>
                <span>Clear / Mostly Clear</span>
                <span>Hazy</span>
                <span>Opaque</span>
              </div>
            </GlassCard>

            {/* Scoring Dimensions */}
            <GlassCard glow style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#8B6914", textTransform: "uppercase", marginBottom: "1rem" }}>
                7 Scoring Dimensions
              </div>
              {[
                { label: "Verified Impact Outcomes", weight: 25, color: "#27AE60" },
                { label: "Transparency & Disclosure", weight: 20, color: "#3498DB" },
                { label: "Dollar Efficiency", weight: 15, color: "#8B6914" },
                { label: "Evidence Quality & Rigor", weight: 15, color: "#9B59B6" },
                { label: "Cloak-vs-Clear Score", weight: 10, color: "#E67E22" },
                { label: "Beneficiary Voice & Feedback", weight: 10, color: "#E17055" },
                { label: "Adaptability & Learning", weight: 5, color: "#00b4d8" },
              ].map((dim, i) => (
                <HBar key={i} value={dim.weight} max={25} color={dim.color} label={dim.label} sublabel={`${dim.weight}% weight`} />
              ))}
            </GlassCard>

            <GlassCard glow style={{ padding: "1.5rem" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#8B6914", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                Full Scorecard
              </div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#5A4A32", lineHeight: 1.65, marginBottom: "1rem" }}>
                Browse all 100 charities, filter by sector, sort by composite score,
                and click any charity for its full breakdown with evaluator cross-references.
              </p>
              <Link href="/charity-scorecard">
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.15em",
                  color: "#8B6914", textDecoration: "none", borderBottom: "1px solid rgba(139,105,20,0.3)",
                  cursor: "pointer",
                }}>
                  VIEW FULL CHARITY SCORECARD →
                </span>
              </Link>
            </GlassCard>
          </div>
        )}

        {/* ── TAB: iRR FRAMEWORK ── */}
        {activeTab === "iRR FRAMEWORK" && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, color: "#2C1810", marginBottom: "0.5rem" }}>
              Impact Rate of Return (iRR)
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: "#6F5B3E", lineHeight: 1.65, marginBottom: "0.75rem", maxWidth: "700px" }}>
              Howard W. Buffett's framework calculates the impact value of each dollar,
              not the dollar value of impact. Key Impact Indicator multiplied by Future Impact,
              divided by Efficiency multiplied by Multiplier, over Time.
            </p>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: "#6F5B3E", lineHeight: 1.65, marginBottom: "2rem", maxWidth: "700px" }}>
              Combined with David Hawkins' Map of Consciousness (20-1000), which calibrates
              the energetic frequency of each organization's mission. 200+ is the integrity
              threshold. 500+ is love-driven. 700+ is enlightened.
            </p>

            {/* Formula card */}
            <GlassCard glow style={{ padding: "1.5rem", marginBottom: "2rem" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#8B6914", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                The Formula
              </div>
              <code style={{
                fontFamily: "'JetBrains Mono', 'DM Mono', monospace", fontSize: "0.8rem",
                color: "#2C1810", lineHeight: 2, display: "block",
                background: "rgba(139,105,20,0.04)", padding: "1rem", borderRadius: "8px",
              }}>
                iRR = (Key Impact Indicator × Future Impact) ÷ (Efficiency × Multiplier) / Time<br />
                C-NPV = Σ [FCF_t × Consciousness_Multiplier / (1 + r_adjusted)^t]<br />
                Consciousness Multiplier = 1.0 + (Hawkins - 100) / 1000
              </code>
            </GlassCard>

            {/* iRR Highlights */}
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#8B6914", textTransform: "uppercase", marginBottom: "1rem" }}>
              Top Impact Returns
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
              {IRR_HIGHLIGHTS.map((item, i) => (
                <GlassCard key={i} glow style={{ padding: "1.5rem", borderLeft: `4px solid ${item.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "#2C1810" }}>
                      {item.entity}
                    </div>
                    <div style={{
                      fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 700, color: item.color,
                    }}>
                      {item.irr}
                    </div>
                  </div>
                  <div style={{
                    fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#6F5B3E",
                    background: `${item.color}10`, padding: "0.5rem 0.75rem", borderRadius: "6px",
                  }}>
                    {item.metric}
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Consciousness zones */}
            <GlassCard glow style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#8B6914", textTransform: "uppercase", marginBottom: "1rem" }}>
                Hawkins Consciousness Zones
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
                {[
                  { zone: "SHAME", range: "20-100", color: "#e63946", bg: "rgba(230,57,70,0.06)", desc: "Force-based. Extractive. Destructive." },
                  { zone: "FORCE", range: "100-200", color: "#e17055", bg: "rgba(225,112,85,0.06)", desc: "Survival mode. Fear-driven decisions." },
                  { zone: "POWER", range: "200-500", color: "#2a9d8f", bg: "rgba(42,157,143,0.06)", desc: "Integrity threshold. Courage to truth." },
                  { zone: "LOVE", range: "500+", color: "#8B6914", bg: "rgba(139,105,20,0.06)", desc: "Love-driven. Regenerative. Enlightened." },
                ].map((z, i) => (
                  <div key={i} style={{
                    padding: "1rem", borderRadius: "10px", background: z.bg,
                    border: `1px solid ${z.color}20`,
                  }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", fontWeight: 700, color: z.color, letterSpacing: "0.15em", marginBottom: "0.25rem" }}>
                      {z.zone}
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#999", marginBottom: "0.4rem" }}>
                      {z.range}
                    </div>
                    <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: "#5A4A32", lineHeight: 1.4 }}>
                      {z.desc}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard glow style={{ padding: "1.5rem" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", color: "#8B6914", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                Calculate Your Own
              </div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#5A4A32", lineHeight: 1.65, marginBottom: "1rem" }}>
                Use the interactive SoulScore engine to calculate Consciousness-Adjusted NPV
                for any entity. See what happens when consciousness enters the discount rate.
              </p>
              <Link href="/soulscore">
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.15em",
                  color: "#8B6914", textDecoration: "none", borderBottom: "1px solid rgba(139,105,20,0.3)",
                  cursor: "pointer",
                }}>
                  LAUNCH C-NPV CALCULATOR →
                </span>
              </Link>
            </GlassCard>
          </div>
        )}
      </main>

      {/* ══ FOOTER ══ */}
      <footer style={{
        background: "linear-gradient(135deg, #3D2E14 0%, #5A4020 100%)",
        color: "rgba(250,250,247,0.7)",
        padding: "2.5rem 1.5rem",
        textAlign: "center",
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.65rem",
        letterSpacing: "0.1em",
        lineHeight: 1.8,
      }}>
        <p style={{ color: "#D4B96A", marginBottom: "0.5rem", fontSize: "0.75rem" }}>
          Impact Measurement Dashboard — ImpactSoul
        </p>
        <p>
          4 Token Ecosystems · 100 Charities Scored · 12 SoulScore Dimensions · 35+ Portfolio Companies · iRR Framework
        </p>
        <p style={{ marginTop: "0.5rem", fontSize: "0.6rem" }}>
          Architecture: 50+ meeting transcripts, 100+ research conversations, 25 years of Fortune 500 impact advisory
        </p>
        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          <Link href="/soulscore"><span style={{ color: "#D4B96A", textDecoration: "none", cursor: "pointer" }}>SoulScore Engine</span></Link>
          <Link href="/charity-scorecard"><span style={{ color: "#D4B96A", textDecoration: "none", cursor: "pointer" }}>Charity Scorecard</span></Link>
          <Link href="/intel"><span style={{ color: "#D4B96A", textDecoration: "none", cursor: "pointer" }}>Portfolio Intel</span></Link>
          <Link href="/invest"><span style={{ color: "#D4B96A", textDecoration: "none", cursor: "pointer" }}>Invest</span></Link>
        </div>
      </footer>
    </div>
  );
}
