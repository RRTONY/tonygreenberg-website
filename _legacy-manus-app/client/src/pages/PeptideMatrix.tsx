/*
 * PEPTIDE REVIEW-EVIDENCE MATRIX
 * Interactive scatter plot: Review Score (X) vs Scientific Evidence Score (Y)
 * Core principle: 5-STAR REVIEWS ≠ FDA-APPROVED EFFICACY
 * Legal framework: Fair Comment, Truth Defense, No Malice, Public Interest
 */

import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { BioChainCTA } from "@/components/BioChainCTA";
import SEO from "@/components/SEO";

/* ── ENTITY DATA ── */
interface MatrixEntity {
  id: string;
  name: string;
  type: "influencer" | "clinic" | "vendor" | "doctor" | "regulatory";
  reviews: number;
  evidence: number;
  gap: number;
  quadrant: string;
  riskLevel: "LOW" | "MODERATE" | "HIGH" | "HIGHEST" | "REGULATORY";
  notes: string;
  reviewSources?: string[];
  wallScore?: number;
  tier?: number;
  details?: string;
}

const ENTITIES: MatrixEntity[] = [
  {
    id: "brecka",
    name: "Gary Brecka",
    type: "influencer",
    reviews: 4.5,
    evidence: 5,
    gap: 90,
    quadrant: "Q4",
    riskLevel: "HIGHEST",
    notes: "2M followers. Zero Phase 3 trials for any promoted peptide.",
    wallScore: 100,
    tier: 5,
    details: "Human biologist (not MD). Promotes BPC-157, GHK-Cu, and other peptides with no FDA-approved human trials. Massive social media following creates outsized influence relative to evidence base.",
  },
  {
    id: "rogan",
    name: "Joe Rogan",
    type: "influencer",
    reviews: 4.8,
    evidence: 5,
    gap: 96,
    quadrant: "Q4",
    riskLevel: "HIGHEST",
    notes: "11M listeners. Personal testimonial only. 35 animal studies, 1 human study.",
    wallScore: 96,
    tier: 5,
    details: "Podcast host, not medical professional. Promotes BPC-157 based on personal experience. Audience scale means millions receive unvetted medical information as entertainment.",
  },
  {
    id: "ways2well",
    name: "Ways2Well",
    type: "clinic",
    reviews: 4.2,
    evidence: 5,
    gap: 84,
    quadrant: "Q4",
    riskLevel: "HIGHEST",
    notes: "Patient satisfaction high. Prescribes FDA Category 2 substances.",
    reviewSources: ["google", "yelp", "healthgrades"],
    wallScore: 84,
    tier: 4,
    details: "Telehealth peptide clinic. High patient satisfaction scores mask the fact that prescribed substances lack Phase 3 clinical trials. Revenue model depends on recurring peptide prescriptions.",
  },
  {
    id: "genesis",
    name: "GP",
    type: "vendor",
    reviews: 3.8,
    evidence: 0,
    gap: 76,
    quadrant: "Q4",
    riskLevel: "HIGHEST",
    notes: "Research theater. Markets directly to humans despite 'research only' labels.",
    reviewSources: ["trustpilot", "reddit"],
    wallScore: 90,
    tier: 5,
    details: "Peptide vendor selling 'for research purposes only' while marketing clearly targets human consumption. Zero clinical evidence. Contamination risk from unregulated manufacturing.",
  },
  {
    id: "koniver",
    name: "Dr. Koniver",
    type: "doctor",
    reviews: 4.6,
    evidence: 5,
    gap: 92,
    quadrant: "Q4",
    riskLevel: "HIGHEST",
    notes: "'Use with every patient. Super safe.' No supporting trials.",
    reviewSources: ["healthgrades", "google"],
    wallScore: 66,
    tier: 4,
    details: "MD who claims to use peptides with every patient and calls them 'super safe' despite absence of Phase 3 RCTs. High patient satisfaction driven by attentive care model, not peptide efficacy data.",
  },
  {
    id: "levinson",
    name: "Dr. Andrew Levinson",
    type: "doctor",
    reviews: 3.4,
    evidence: 35,
    gap: 33,
    quadrant: "Q4",
    riskLevel: "MODERATE",
    notes: "MD integrative. Mixed reviews. Some evidence-based, some alternative. Expensive supplements.",
    reviewSources: ["healthgrades", "vitals", "webmd", "yelp", "us_news"],
    wallScore: 55,
    tier: 3,
    details: "MD (1996, U Miami), Psychiatry. Vitality Health & Wellness, 801 4th St, Miami Beach, FL 33139. Practices functional/integrative medicine and orthomolecular psychiatry. Ketamine treatment is evidence-based (FDA-approved esketamine 2019). However, proprietary supplements have no independent trials, HBOT for autism has insufficient evidence per AAP/Cochrane, and orthomolecular psychiatry has limited mainstream acceptance. No public peptide claims found.",
  },
  {
    id: "prisk",
    name: "Dr. Prisk",
    type: "doctor",
    reviews: 4.2,
    evidence: 95,
    gap: -53,
    quadrant: "Q1",
    riskLevel: "LOW",
    notes: "Good reviews AND calls out unproven claims. Evidence-based practice.",
    reviewSources: ["healthgrades", "google"],
    wallScore: 1,
    tier: 1,
    details: "Evidence-based physician who actively critiques unproven peptide claims. Reviews reflect genuine patient satisfaction with science-backed treatments. The gold standard: high satisfaction aligned with high evidence.",
  },
  {
    id: "usada",
    name: "USADA",
    type: "regulatory",
    reviews: 0,
    evidence: 100,
    gap: 0,
    quadrant: "REGULATORY",
    riskLevel: "REGULATORY",
    notes: "States there is no legal basis to sell BPC-157 for human use.",
    details: "United States Anti-Doping Agency. Regulatory body that has explicitly stated BPC-157 has no legal basis for sale for human consumption. Represents the evidence ceiling — pure regulatory/scientific position.",
  },
];

/* ── QUADRANT DEFINITIONS ── */
const QUADRANTS = [
  {
    id: "Q1",
    label: "Aligned",
    subtitle: "High Reviews + High Evidence",
    color: "#2E8B57",
    bg: "rgba(46,139,87,0.08)",
    risk: "LOW",
    description: "Market acceptance aligned with science. These practitioners have both satisfied patients AND evidence-based treatments.",
    examples: "Legitimate longevity clinics using FDA-approved peptides",
  },
  {
    id: "Q2",
    label: "Good Science, Poor Marketing",
    subtitle: "Low Reviews + High Evidence",
    color: "#4A90D9",
    bg: "rgba(74,144,217,0.08)",
    risk: "LOW",
    description: "Evidence-based despite bad reviews. Good science, poor bedside manner or marketing.",
    examples: "Academic researchers, conservative practitioners",
  },
  {
    id: "Q3",
    label: "Obvious Scams",
    subtitle: "Low Reviews + Low Evidence",
    color: "#888",
    bg: "rgba(136,136,136,0.08)",
    risk: "HIGH",
    description: "The market has identified poor quality. Low satisfaction AND low evidence.",
    examples: "Contaminated products, obvious fraud",
  },
  {
    id: "Q4",
    label: "DANGER ZONE",
    subtitle: "High Reviews + Low Evidence",
    color: "#C0392B",
    bg: "rgba(192,57,43,0.12)",
    risk: "HIGHEST",
    description: "SATISFACTION ≠ SAFETY/EFFICACY. People love it but science doesn't support it. This is where the most harm occurs.",
    examples: "BPC-157 sellers, peptide influencers, telehealth clinics",
  },
];

/* ── DANGER ZONE PSYCHOLOGY ── */
const DANGER_MECHANISMS = [
  {
    title: "Placebo Effect",
    stat: "30–40%",
    description: "People feel better and leave 5-star reviews. The actual mechanism is placebo, not the peptide. Reviews capture satisfaction, not efficacy.",
    icon: "🧠",
  },
  {
    title: "Confirmation Bias",
    stat: "$500+",
    description: "You paid $500 — it must work. Cognitive dissonance reduction makes you find 'evidence' it worked and ignore lack of improvement.",
    icon: "🔄",
  },
  {
    title: "Natural Healing",
    stat: "6–12 weeks",
    description: "Most injuries heal naturally in 6–12 weeks. Peptide taken during healing gets the credit. Classic post hoc ergo propter hoc fallacy.",
    icon: "⏰",
  },
  {
    title: "Selection Bias",
    stat: "Survivors only",
    description: "People who got better leave reviews. People who got worse don't return or review. Survivorship bias dominates every review platform.",
    icon: "📊",
  },
  {
    title: "Financial Incentive",
    stat: "5★ = discount",
    description: "Sellers encourage positive reviews with discounts. Negative reviews get disputed and removed. The review ecosystem is structurally compromised.",
    icon: "💰",
  },
];

/* ── EVIDENCE SCORING ── */
const EVIDENCE_CRITERIA = [
  { label: "Phase 3 RCT Completed", points: "+40", color: "#2E8B57" },
  { label: "Phase 2 RCT Completed", points: "+25", color: "#2E8B57" },
  { label: "Phase 1 Safety Completed", points: "+15", color: "#2E8B57" },
  { label: "Animal Studies Only", points: "+5", color: "#888" },
  { label: "FDA Approval", points: "+20", color: "#2E8B57" },
  { label: "FDA Category 2 (Safety Concerns)", points: "−20", color: "#C0392B" },
  { label: "WADA Banned", points: "−10", color: "#C0392B" },
  { label: "Contamination Reports", points: "−15", color: "#C0392B" },
];

/* ── REVIEW SOURCES ── */
const REVIEW_SOURCES = [
  "Yelp Business Reviews",
  "Google My Business",
  "Healthgrades Patient Ratings",
  "Vitals.com Physician Reviews",
  "WebMD Doctor Ratings",
  "US News Doctor Finder",
  "Reddit (r/peptides, r/Biohacking, r/Nootropics)",
  "Trustpilot (for vendors)",
  "BBB Ratings",
  "FDA Warning Letters",
  "WADA Prohibited Substance Lists",
  "PubMed Clinical Trials Database",
];

/* ── SCATTER PLOT COMPONENT ── */
function MatrixScatterPlot({
  entities,
  selectedEntity,
  onSelect,
}: {
  entities: MatrixEntity[];
  selectedEntity: string | null;
  onSelect: (id: string | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 600, h: 400 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = Math.min(containerRef.current.offsetWidth, 800);
        setCanvasSize({ w, h: Math.round(w * 0.65) });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvasSize.w;
    const H = canvasSize.h;
    const PAD = { top: 30, right: 30, bottom: 50, left: 60 };
    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;

    // Scale
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.scale(dpr, dpr);

    // Clear
    ctx.fillStyle = "#0A0A10";
    ctx.fillRect(0, 0, W, H);

    // Quadrant backgrounds
    const midX = PAD.left + plotW * (2.5 / 5);
    const midY = PAD.top + plotH * (1 - 50 / 100);

    // Q3 (lower-left)
    ctx.fillStyle = "rgba(136,136,136,0.06)";
    ctx.fillRect(PAD.left, midY, midX - PAD.left, PAD.top + plotH - midY);

    // Q4 (lower-right) — DANGER ZONE
    ctx.fillStyle = "rgba(192,57,43,0.1)";
    ctx.fillRect(midX, midY, PAD.left + plotW - midX, PAD.top + plotH - midY);

    // Q2 (upper-left)
    ctx.fillStyle = "rgba(74,144,217,0.06)";
    ctx.fillRect(PAD.left, PAD.top, midX - PAD.left, midY - PAD.top);

    // Q1 (upper-right)
    ctx.fillStyle = "rgba(46,139,87,0.08)";
    ctx.fillRect(midX, PAD.top, PAD.left + plotW - midX, midY - PAD.top);

    // Quadrant labels
    ctx.font = "bold 10px 'DM Mono', monospace";
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "#888";
    ctx.fillText("Q3: OBVIOUS SCAMS", PAD.left + 8, PAD.top + plotH - 8);
    ctx.fillStyle = "#C0392B";
    ctx.fillText("Q4: DANGER ZONE", midX + 8, PAD.top + plotH - 8);
    ctx.fillStyle = "#4A90D9";
    ctx.fillText("Q2: GOOD SCIENCE", PAD.left + 8, PAD.top + 16);
    ctx.fillStyle = "#2E8B57";
    ctx.fillText("Q1: ALIGNED", PAD.left + plotW - 80, PAD.top + 16);
    ctx.globalAlpha = 1;

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const x = PAD.left + (plotW * i) / 5;
      ctx.beginPath();
      ctx.moveTo(x, PAD.top);
      ctx.lineTo(x, PAD.top + plotH);
      ctx.stroke();
    }
    for (let i = 0; i <= 5; i++) {
      const y = PAD.top + (plotH * i) / 5;
      ctx.beginPath();
      ctx.moveTo(PAD.left, y);
      ctx.lineTo(PAD.left + plotW, y);
      ctx.stroke();
    }

    // Midlines (thicker)
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(midX, PAD.top);
    ctx.lineTo(midX, PAD.top + plotH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(PAD.left, midY);
    ctx.lineTo(PAD.left + plotW, midY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Axis labels
    ctx.fillStyle = "#999";
    ctx.font = "11px 'Source Sans 3', sans-serif";
    ctx.textAlign = "center";
    for (let i = 0; i <= 5; i++) {
      const x = PAD.left + (plotW * i) / 5;
      ctx.fillText(String(i), x, PAD.top + plotH + 18);
    }
    ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) {
      const y = PAD.top + plotH - (plotH * i * 20) / 100;
      ctx.fillText(String(i * 20), PAD.left - 8, y + 4);
    }

    // Axis titles
    ctx.fillStyle = "#D4B96A";
    ctx.font = "bold 11px 'DM Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("REVIEW SCORE (1–5 STARS)", PAD.left + plotW / 2, H - 6);
    ctx.save();
    ctx.translate(14, PAD.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("EVIDENCE SCORE (0–100)", 0, 0);
    ctx.restore();

    // Plot entities
    const plotEntities = entities.filter((e) => e.reviews > 0);
    plotEntities.forEach((entity) => {
      const x = PAD.left + (entity.reviews / 5) * plotW;
      const y = PAD.top + plotH - (entity.evidence / 100) * plotH;
      const isSelected = selectedEntity === entity.id;
      const isHovered = hoveredEntity === entity.id;
      const r = isSelected || isHovered ? 10 : 7;

      // Glow for danger zone
      if (entity.quadrant === "Q4" && entity.riskLevel === "HIGHEST") {
        ctx.beginPath();
        ctx.arc(x, y, r + 6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(192,57,43,0.2)";
        ctx.fill();
      }

      // Dot
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      const colors: Record<string, string> = {
        HIGHEST: "#C0392B",
        HIGH: "#E67E22",
        MODERATE: "#F1C40F",
        LOW: "#2E8B57",
        REGULATORY: "#4A90D9",
      };
      ctx.fillStyle = colors[entity.riskLevel] || "#888";
      ctx.fill();

      if (isSelected || isHovered) {
        ctx.strokeStyle = "#D4B96A";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Label
      ctx.fillStyle = isSelected || isHovered ? "#E8E4DC" : "rgba(232,228,220,0.7)";
      ctx.font = `${isSelected || isHovered ? "bold " : ""}10px 'DM Mono', monospace`;
      ctx.textAlign = "center";
      const label = entity.name.length > 14 ? entity.name.slice(0, 12) + "…" : entity.name;
      ctx.fillText(label, x, y - r - 5);
    });

    // USADA marker (no review score, show on left edge)
    const usada = entities.find((e) => e.id === "usada");
    if (usada) {
      const x = PAD.left + 15;
      const y = PAD.top + plotH - (usada.evidence / 100) * plotH;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#4A90D9";
      ctx.fill();
      ctx.fillStyle = "rgba(232,228,220,0.6)";
      ctx.font = "10px 'DM Mono', monospace";
      ctx.textAlign = "left";
      ctx.fillText("USADA (Regulatory)", x + 12, y + 4);
    }
  }, [entities, selectedEntity, hoveredEntity, canvasSize]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const W = canvasSize.w;
    const H = canvasSize.h;
    const PAD = { top: 30, right: 30, bottom: 50, left: 60 };
    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;

    let found: string | null = null;
    entities.filter((e) => e.reviews > 0).forEach((entity) => {
      const x = PAD.left + (entity.reviews / 5) * plotW;
      const y = PAD.top + plotH - (entity.evidence / 100) * plotH;
      const dist = Math.sqrt((mx - x) ** 2 + (my - y) ** 2);
      if (dist < 15) found = entity.id;
    });
    onSelect(found);
  };

  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const W = canvasSize.w;
    const H = canvasSize.h;
    const PAD = { top: 30, right: 30, bottom: 50, left: 60 };
    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;

    let found: string | null = null;
    entities.filter((e) => e.reviews > 0).forEach((entity) => {
      const x = PAD.left + (entity.reviews / 5) * plotW;
      const y = PAD.top + plotH - (entity.evidence / 100) * plotH;
      const dist = Math.sqrt((mx - x) ** 2 + (my - y) ** 2);
      if (dist < 15) found = entity.id;
    });
    setHoveredEntity(found);
    canvas.style.cursor = found ? "pointer" : "default";
  };

  return (
<div ref={containerRef} style={{ width: "100%" }}>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMove}
        onMouseLeave={() => setHoveredEntity(null)}
        style={{ width: "100%", borderRadius: "12px", border: "1px solid rgba(212,185,106,0.1)" }}
      />
    </div>
  );
}

/* ── MAIN PAGE ── */
export default function PeptideMatrix() {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("matrix");
  const [showMethodology, setShowMethodology] = useState(false);

  const selected = ENTITIES.find((e) => e.id === selectedEntity);

  const riskColor = (level: string) => {
    const map: Record<string, string> = {
      HIGHEST: "#C0392B",
      HIGH: "#E67E22",
      MODERATE: "#F1C40F",
      LOW: "#2E8B57",
      REGULATORY: "#4A90D9",
    };
    return map[level] || "#888";
  };

  return (
    <>
      <SEO
        title="Peptide Evidence Matrix"
        description="Evidence-based ratings for peptides by efficacy, safety, and research quality."
        path="/peptide-matrix"
        keywords="Tony Greenberg, peptide research, peptide efficacy, BPC-157 evidence"
        indexable={true}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Source+Sans+3:wght@300;400;600;700&family=DM+Mono:wght@400;500&display=swap');
        .matrix-page { background: #FAFAF7; min-height: 100vh; }
        .matrix-page * { box-sizing: border-box; }
      `}</style>

      <div className="matrix-page">
        {/* FDA Shutdown Banner */}
        <div style={{ background: "linear-gradient(90deg, #1a0a0a 0%, #2a0a0a 50%, #1a0a0a 100%)", padding: "0.8rem 1.5rem", borderBottom: "1px solid rgba(220, 38, 38, 0.3)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", flexWrap: "wrap" as const }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#dc2626", fontWeight: 700 }}>MARCH 2026</span>
            <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#fca5a5" }}>Peptide Sciences shut down by FDA. <Link href="/rip-peptide-sciences" style={{ color: "#dc2626", textDecoration: "underline", fontWeight: 600 }}>Full breakdown &rarr;</Link></span>
          </div>
        </div>

        {/* Legal Banner */}
        <div style={{
          background: "#0A0A10",
          borderBottom: "1px solid rgba(212,185,106,0.15)",
          padding: "0.6rem 1.5rem",
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(212,185,106,0.6)",
            margin: 0,
          }}>
            Mirror of the Market · Fair Comment · Public Interest · Not Medical Advice ·{" "}
            <a href="#appeals" style={{ color: "#D4B96A", textDecoration: "underline" }}>Appeals Process</a>
          </p>
        </div>

        {/* Hero */}
        <div style={{
          background: "linear-gradient(180deg, #0A0A10 0%, #1a1a2e 100%)",
          padding: "4rem 1.5rem 3rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }} className="glitch-hero">
          {/* Glassmorphic hero background */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.15 }}>
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/opt_66_peptide-hero-matrix-TUP48rggCiaJdBFdZh9eMF_3b80d0d9.jpg" alt="" sizes="100vw" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(1px) brightness(0.6)" }} loading="lazy" />
          </div>
          <div className="glitch-hero-scanlines" />
          <div className="glitch-hero-tear" />
          <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#D4B96A",
            marginBottom: "1rem",
          }}>
            The Review-Evidence Matrix · Peptide Truth System
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 900,
            color: "#E8E4DC",
            lineHeight: 1.1,
            marginBottom: "1.5rem",
            maxWidth: 700,
            margin: "0 auto 1.5rem",
          }}>
            5-Star Reviews{" "}
            <span style={{ color: "#C0392B" }}>≠</span>{" "}
            FDA-Approved Efficacy
          </h1>
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "1.1rem",
            color: "rgba(232,228,220,0.6)",
            lineHeight: 1.7,
            maxWidth: 600,
            margin: "0 auto",
          }}>
            Patient satisfaction and scientific validation are different metrics.
            This matrix maps where every major peptide entity falls — and reveals
            the gap between what people love and what science supports.
          </p>
        </div>
        </div>

        {/* Core Principle Banner */}
        <div style={{
          background: "rgba(192,57,43,0.08)",
          borderTop: "2px solid #C0392B",
          borderBottom: "2px solid #C0392B",
          padding: "1.5rem",
          textAlign: "center",
        }}>
          <p style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "#C0392B",
            margin: 0,
          }}>
            ★★★★★ 4.8/5 "Miracle cure!"
          </p>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.75rem",
            color: "#666",
            marginTop: "0.5rem",
            letterSpacing: "0.1em",
          }}>
            EVIDENCE: 0 Phase 3 RCTs · FDA Category 2 · Contamination Risk
          </p>
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.9rem",
            color: "#C0392B",
            fontWeight: 600,
            marginTop: "0.5rem",
          }}>
            This is the Danger Zone.
          </p>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" }}>
          {/* Interactive Matrix */}
          <section style={{ marginBottom: "3rem" }}>
            <button
              onClick={() => setExpandedSection(expandedSection === "matrix" ? null : "matrix")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#8B6914",
                marginBottom: "1rem",
                padding: 0,
              }}
            >
              <span style={{ transform: expandedSection === "matrix" ? "rotate(90deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▶</span>
              Interactive Matrix · Click Any Entity
            </button>

            {expandedSection === "matrix" && (
              <div>
                <MatrixScatterPlot
                  entities={ENTITIES}
                  selectedEntity={selectedEntity}
                  onSelect={setSelectedEntity}
                />

                {/* Legend */}
                <div style={{
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  marginTop: "1rem",
                }}>
                  {[
                    { label: "Highest Risk", color: "#C0392B" },
                    { label: "Moderate Risk", color: "#F1C40F" },
                    { label: "Low Risk", color: "#2E8B57" },
                    { label: "Regulatory", color: "#4A90D9" },
                  ].map((l) => (
                    <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: l.color }} />
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#666" }}>{l.label}</span>
                    </div>
                  ))}
                </div>

                {/* Selected Entity Detail */}
                {selected && (
                  <div style={{
                    marginTop: "1.5rem",
                    padding: "1.5rem",
                    background: "#0A0A10",
                    borderRadius: "12px",
                    border: `1px solid ${riskColor(selected.riskLevel)}33`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                      <div>
                        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.3rem", color: "#E8E4DC", margin: 0 }}>
                          {selected.name}
                        </h3>
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(232,228,220,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.3rem" }}>
                          {selected.type} · Tier {selected.tier || "N/A"} · Wall Score {selected.wallScore ?? "N/A"}
                        </p>
                      </div>
                      <div style={{
                        padding: "0.4rem 1rem",
                        borderRadius: "20px",
                        background: `${riskColor(selected.riskLevel)}22`,
                        border: `1px solid ${riskColor(selected.riskLevel)}44`,
                      }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: riskColor(selected.riskLevel), fontWeight: 700 }}>
                          {selected.riskLevel} RISK
                        </span>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.8rem", color: "#D4B96A", margin: 0 }}>
                          {selected.reviews > 0 ? `${selected.reviews}★` : "N/A"}
                        </p>
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(232,228,220,0.4)", textTransform: "uppercase" }}>Reviews</p>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.8rem", color: riskColor(selected.riskLevel), margin: 0 }}>
                          {selected.evidence}/100
                        </p>
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(232,228,220,0.4)", textTransform: "uppercase" }}>Evidence</p>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.8rem", color: selected.gap > 50 ? "#C0392B" : selected.gap > 0 ? "#F1C40F" : "#2E8B57", margin: 0 }}>
                          {selected.gap > 0 ? `+${selected.gap}` : selected.gap}
                        </p>
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(232,228,220,0.4)", textTransform: "uppercase" }}>Gap</p>
                      </div>
                    </div>

                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "rgba(232,228,220,0.7)", lineHeight: 1.7, marginTop: "1.5rem" }}>
                      {selected.details}
                    </p>

                    {selected.reviewSources && (
                      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(232,228,220,0.3)", marginTop: "1rem" }}>
                        Sources: {selected.reviewSources.join(", ")}
                      </p>
                    )}

                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(232,228,220,0.25)", marginTop: "0.5rem", fontStyle: "italic" }}>
                      Opinion based on publicly available information. See methodology below. Appeals: appeals@impactsoul.is
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Quadrant Explainer */}
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.6rem", color: "#0A0A10", marginBottom: "1.5rem" }}>
              The Four Quadrants
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
              {QUADRANTS.map((q) => (
                <div
                  key={q.id}
                  style={{
                    padding: "1.5rem",
                    background: q.bg,
                    borderRadius: "12px",
                    borderLeft: `3px solid ${q.color}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: q.color, margin: 0 }}>
                      {q.id}: {q.label}
                    </h3>
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.6rem",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "10px",
                      background: `${q.color}22`,
                      color: q.color,
                    }}>
                      {q.risk} RISK
                    </span>
                  </div>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#999", marginBottom: "0.5rem" }}>
                    {q.subtitle}
                  </p>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#333", lineHeight: 1.6, margin: 0 }}>
                    {q.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Entity Rankings Table */}
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.6rem", color: "#0A0A10", marginBottom: "1.5rem" }}>
              All Entities Ranked
            </h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.85rem",
              }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #0A0A10" }}>
                    {["Entity", "Type", "Reviews", "Evidence", "Gap", "Quadrant", "Risk"].map((h) => (
                      <th
                        key={h}
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.65rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "#8B6914",
                          padding: "0.8rem 0.5rem",
                          textAlign: "left",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...ENTITIES]
                    .sort((a, b) => b.gap - a.gap)
                    .map((entity) => (
                      <tr
                        key={entity.id}
                        onClick={() => setSelectedEntity(entity.id)}
                        style={{
                          borderBottom: "1px solid rgba(0,0,0,0.06)",
                          cursor: "pointer",
                          background: selectedEntity === entity.id ? "rgba(212,185,106,0.08)" : "transparent",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(212,185,106,0.05)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = selectedEntity === entity.id ? "rgba(212,185,106,0.08)" : "transparent")}
                      >
                        <td style={{ padding: "0.7rem 0.5rem", fontWeight: 600 }}>{entity.name}</td>
                        <td style={{ padding: "0.7rem 0.5rem", color: "#666", textTransform: "capitalize" }}>{entity.type}</td>
                        <td style={{ padding: "0.7rem 0.5rem" }}>{entity.reviews > 0 ? `${entity.reviews}★` : "N/A"}</td>
                        <td style={{ padding: "0.7rem 0.5rem" }}>{entity.evidence}/100</td>
                        <td style={{ padding: "0.7rem 0.5rem", color: entity.gap > 50 ? "#C0392B" : entity.gap > 0 ? "#E67E22" : "#2E8B57", fontWeight: 700 }}>
                          {entity.gap > 0 ? `+${entity.gap}` : entity.gap}
                        </td>
                        <td style={{ padding: "0.7rem 0.5rem" }}>
                          <span style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "0.65rem",
                            padding: "0.15rem 0.4rem",
                            borderRadius: "4px",
                            background: `${riskColor(entity.riskLevel)}15`,
                            color: riskColor(entity.riskLevel),
                          }}>
                            {entity.quadrant}
                          </span>
                        </td>
                        <td style={{ padding: "0.7rem 0.5rem" }}>
                          <span style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "0.6rem",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "10px",
                            background: `${riskColor(entity.riskLevel)}15`,
                            color: riskColor(entity.riskLevel),
                            fontWeight: 700,
                          }}>
                            {entity.riskLevel}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Danger Zone Psychology */}
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.6rem", color: "#0A0A10", marginBottom: "0.5rem" }}>
              Why High Reviews + Low Evidence = Highest Risk
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#666", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              Five psychological mechanisms explain why the Danger Zone exists — and why it's so hard to escape.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
              {DANGER_MECHANISMS.map((m, i) => (
                <div
                  key={i}
                  style={{
                    padding: "1.5rem",
                    background: "rgba(192,57,43,0.04)",
                    borderRadius: "12px",
                    borderTop: "2px solid rgba(192,57,43,0.2)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "1.5rem" }}>{m.icon}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#C0392B", fontWeight: 700 }}>{m.stat}</span>
                  </div>
                  <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", letterSpacing: "0.05em", color: "#0A0A10", margin: "0 0 0.5rem" }}>
                    {i + 1}. {m.title}
                  </h3>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#555", lineHeight: 1.6, margin: 0 }}>
                    {m.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Search Engine Bias */}
          <section style={{
            marginBottom: "3rem",
            padding: "2rem",
            background: "linear-gradient(135deg, #0A0A10, #1a1a2e)",
            borderRadius: "12px",
          }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.4rem", color: "#E8E4DC", marginBottom: "1rem" }}>
              The Search Engine Problem
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "rgba(232,228,220,0.6)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              Google "peptides near me" and the first page is dominated by sellers, not researchers.
              Paid ads and SEO appear first — not evidence-based information. The relationship between
              search ranking and scientific evidence is <em>inverse</em>: the higher the SEO budget,
              the lower the evidence base.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {[
                { label: "Google First Page", value: "Dominated by sellers", detail: "Ways2Well top 3, GP top 5, Brecka sponsored" },
                { label: "Organic Rankings", value: "Inverse relationship", detail: "High SEO spend = Low evidence base" },
                { label: "Consumer Default", value: "Click first result", detail: "Without vetting source or evidence" },
              ].map((item) => (
                <div key={item.label} style={{ padding: "1rem", background: "rgba(212,185,106,0.05)", borderRadius: "8px" }}>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#D4B96A", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
                    {item.label}
                  </p>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#E8E4DC", fontWeight: 600, margin: "0.3rem 0" }}>
                    {item.value}
                  </p>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: "rgba(232,228,220,0.4)", margin: 0 }}>
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Evidence Scoring Methodology */}
          <section style={{ marginBottom: "3rem" }}>
            <button
              onClick={() => setShowMethodology(!showMethodology)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#8B6914",
                marginBottom: "1rem",
                padding: 0,
              }}
            >
              <span style={{ transform: showMethodology ? "rotate(90deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▶</span>
              Evidence Scoring Methodology
            </button>

            {showMethodology && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                <div>
                  <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B6914", marginBottom: "1rem" }}>
                    Evidence Score Criteria
                  </h3>
                  {EVIDENCE_CRITERIA.map((c) => (
                    <div key={c.label} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#333" }}>{c.label}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", color: c.color, fontWeight: 700 }}>{c.points}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B6914", marginBottom: "1rem" }}>
                    Review Data Sources
                  </h3>
                  {REVIEW_SOURCES.map((s) => (
                    <div key={s} style={{ padding: "0.35rem 0", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#333" }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Cross-links */}
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.4rem", color: "#0A0A10", marginBottom: "1.5rem" }}>
              The Complete Peptide Truth System
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {[
                { href: "/find-your-peptide", title: "Peptide Clarity Index™", desc: "10 questions, 7 clinical axes, 16 archetypes. The only assessment that screens for contraindications.", icon: "🧬" },
                { href: "/peptide-hall-of-shame", title: "Hall of Shame", desc: "20 US providers audited on 6 clinical criteria. Average score: 95/100 (worst).", icon: "🏚️" },
                { href: "/peptide-supply-chain", title: "Where Does Your $ Go?", desc: "Supply chain mapped for 12 providers. Manufacturing vs. marketing vs. profit.", icon: "💰" },
                { href: "/quiz_25q", title: "25-Question Literacy Quiz", desc: "Test your peptide knowledge across 5 dimensions. Most score below 60%.", icon: "📝" },
                { href: "/peptide-watch", title: "PeptideWatch Safety Guide", desc: "12 fraud patterns, 10-question supply chain test, vendor scorecard, role-based checklists.", icon: "🛡️" },
                { href: "/blog/the-peptide-truth-65m-fraud-industry-vs-life-changing-medicine", title: "The Investigation", desc: "22-minute deep dive: $65M fraud industry vs. life-changing medicine.", icon: "📰" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    display: "block",
                    padding: "1.5rem",
                    background: "rgba(139,105,20,0.03)",
                    borderRadius: "12px",
                    border: "1px solid rgba(139,105,20,0.08)",
                    textDecoration: "none",
                    transition: "border-color 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,185,106,0.3)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(139,105,20,0.08)"; e.currentTarget.style.transform = "none"; }}
                >
                  <span style={{ fontSize: "1.5rem" }}>{link.icon}</span>
                  <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", letterSpacing: "0.05em", color: "#8B6914", margin: "0.5rem 0 0.3rem" }}>
                    {link.title}
                  </h3>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#666", lineHeight: 1.5, margin: 0 }}>
                    {link.desc}
                  </p>
                </a>
              ))}
            </div>
          </section>

          {/* Appeals Section */}
          <section id="appeals" style={{
            marginBottom: "3rem",
            padding: "2rem",
            background: "rgba(139,105,20,0.03)",
            borderRadius: "12px",
            border: "1px solid rgba(139,105,20,0.08)",
          }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.3rem", color: "#0A0A10", marginBottom: "1rem" }}>
              Appeals & Corrections
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "#555", lineHeight: 1.7, marginBottom: "1rem" }}>
              Any practitioner, vendor, or entity listed on this page can submit corrections, context, or
              updated information. We are committed to accuracy and fairness. All appeals are reviewed
              within 14 business days.
            </p>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", color: "#8B6914" }}>
              Contact: appeals@impactsoul.is
            </p>
          </section>

          {/* Full Legal Disclaimer */}
          <section style={{
            marginBottom: "4rem",
            padding: "2rem",
            background: "#0A0A10",
            borderRadius: "12px",
          }}>
            <h2 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#D4B96A", marginBottom: "1.5rem" }}>
              Legal Framework & Methodology
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              <div>
                <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(232,228,220,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.8rem" }}>
                  What This Is
                </h3>
                {[
                  "Aggregation of public reviews (Yelp, Google, Healthgrades, WebMD, etc)",
                  "Comparison of review sentiment vs scientific evidence base",
                  "Analysis of FDA regulatory status",
                  "Price-value assessment based on bioavailability data",
                  "Gap analysis: Market acceptance vs scientific validation",
                ].map((item, i) => (
                  <p key={i} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: "rgba(232,228,220,0.5)", lineHeight: 1.6, margin: "0.3rem 0" }}>
                    • {item}
                  </p>
                ))}
              </div>
              <div>
                <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(232,228,220,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.8rem" }}>
                  What This Is NOT
                </h3>
                {[
                  "Medical advice or diagnosis",
                  "Recommendation or endorsement of any practitioner",
                  "Accusation of malpractice or wrongdoing",
                  "Claim that high reviews = bad practice",
                ].map((item, i) => (
                  <p key={i} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: "rgba(232,228,220,0.5)", lineHeight: 1.6, margin: "0.3rem 0" }}>
                    ✕ {item}
                  </p>
                ))}
              </div>
            </div>

            <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(212,185,106,0.1)" }}>
              <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(232,228,220,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.8rem" }}>
                Legal Protections
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.5rem" }}>
                {[
                  { label: "Fair Comment Doctrine", desc: "Opinions on matters of public interest (health/safety)" },
                  { label: "Truth Defense", desc: "All facts sourced from public records, published reviews, regulatory docs" },
                  { label: "No Actual Malice", desc: "Good faith analysis for consumer protection" },
                  { label: "Public Interest", desc: "Healthcare transparency and evidence-based decision making" },
                  { label: "Appeals Process", desc: "Any practitioner can submit corrections/context" },
                  { label: "Disclosed Methodology", desc: "Scoring criteria transparent and applied uniformly" },
                ].map((p) => (
                  <div key={p.label} style={{ padding: "0.5rem" }}>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#D4B96A", margin: 0 }}>✓ {p.label}</p>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", color: "rgba(232,228,220,0.35)", margin: "0.2rem 0 0" }}>{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Vendor CTA */}
          <div style={{ marginTop: "3rem", padding: "2rem", background: "linear-gradient(135deg, rgba(212,185,106,0.08), rgba(212,185,106,0.02))", border: "1px solid rgba(212,185,106,0.25)", borderRadius: "12px", textAlign: "center" }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#D4B96A", marginBottom: "0.75rem" }}>FOR MANUFACTURERS & SUPPLIERS</p>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#E8E4DC", marginBottom: "0.75rem" }}>Join Our Vetted Supply Network</h3>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem", color: "rgba(232,228,220,0.6)", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 1.5rem" }}>
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
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' }}>
            <BioChainCTA variant="both" context="Verified bio-sourcing for peptides, stem cells, and exosomes. Supplier and buyer intake at RampRate." />
          </div>
        </div>
      </div>
    </>
  );
}
