/**
 * SELF-PORTRAIT — The Composite You
 * 
 * A unified visualization that combines all completed assessment dimensions
 * into one composite radar chart — a visual identity map of the whole self.
 * Requires 5+ completed assessments to unlock.
 * 
 * Pulls from localStorage results and renders:
 * - A large composite radar chart with all dimensions
 * - Individual assessment summaries with mini radars
 * - An AI-generated narrative synthesis (placeholder for now)
 * - Progress toward full portrait completion
 */

import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { useJourneyProgress, JOURNEY_MAP } from "@/components/JourneyTracker";

/* ── Result storage keys ── */
const RESULT_KEYS: Record<string, string> = {
  "find-your-me": "findyourme_results",
  "find-your-purpose": "dharma_results",
  "find-your-mirror": "findyourme_results",
  "find-your-level": "consciousness_results",
  "find-your-score": "grant_results",
  "find-your-spirit": "spirit_results",
  "find-your-therapy": "therapy_results",
  "find-your-sake": "sake_results",
  "find-your-religion": "religion_results",
  "find-your-diet": "diet_results",
  "find-your-movement": "movement_results",
  "find-your-sleep": "sleep_results",
  "find-your-coffee": "coffee_results",
  "find-your-kitchen": "kitchen_results",
  "find-your-style": "style_results",
  "find-your-attachment": "attachment_results",
  "find-your-love-language": "lovelanguage_results",
};

/* ── Dimension mapping: normalize all assessment dimensions into a unified space ── */
interface DimensionScore {
  label: string;
  value: number; // 0-1 normalized
  source: string; // which assessment it came from
  color: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  know: "#D4B96A",
  love: "#C97B7B",
  body: "#7BC9A4",
  taste: "#C9A87B",
  mind: "#7BA8C9",
};

/* ── Composite dimension categories for the unified radar ── */
const COMPOSITE_DIMENSIONS = [
  { key: "self-awareness", label: "Self-Awareness", category: "know" },
  { key: "purpose", label: "Purpose & Direction", category: "know" },
  { key: "consciousness", label: "Consciousness", category: "know" },
  { key: "spirituality", label: "Spirituality", category: "know" },
  { key: "emotional-depth", label: "Emotional Depth", category: "love" },
  { key: "connection", label: "Connection & Intimacy", category: "love" },
  { key: "attachment", label: "Attachment Security", category: "love" },
  { key: "physical-vitality", label: "Physical Vitality", category: "body" },
  { key: "body-wisdom", label: "Body Wisdom", category: "body" },
  { key: "rest-recovery", label: "Rest & Recovery", category: "body" },
  { key: "sensory-refinement", label: "Sensory Refinement", category: "taste" },
  { key: "ritual-practice", label: "Ritual Practice", category: "taste" },
  { key: "systems-thinking", label: "Systems Thinking", category: "mind" },
  { key: "therapeutic-awareness", label: "Therapeutic Awareness", category: "mind" },
  { key: "creative-expression", label: "Creative Expression", category: "mind" },
];

function getStoredResult(key: string): any | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/* ── Extract normalized scores from each assessment result ── */
function extractCompositeScores(): { dimensions: { key: string; value: number }[]; completedAssessments: string[]; archetypes: { name: string; source: string; color: string }[] } {
  const scores: Record<string, number[]> = {};
  const completedAssessments: string[] = [];
  const archetypes: { name: string; source: string; color: string }[] = [];

  // Initialize
  COMPOSITE_DIMENSIONS.forEach(d => { scores[d.key] = []; });

  for (const [id, storageKey] of Object.entries(RESULT_KEYS)) {
    const result = getStoredResult(storageKey);
    if (!result) continue;
    
    const experience = JOURNEY_MAP.find(e => e.id === id);
    if (!experience) continue;
    completedAssessments.push(id);

    const archetype = result.archetype || result.topModality || result.primaryPath || result.sakeStyle || result.tradition || null;
    if (archetype) {
      archetypes.push({
        name: archetype,
        source: experience.name,
        color: CATEGORY_COLORS[experience.category] || "#D4B96A",
      });
    }

    // Map assessment scores to composite dimensions
    const rawScores = result.scores || result.dimensionScores || {};
    const scoreValues = typeof rawScores === "object" ? Object.values(rawScores) as number[] : [];
    const avgScore = scoreValues.length > 0 ? scoreValues.reduce((a: number, b: number) => a + b, 0) / scoreValues.length : 0;
    const normalizedAvg = Math.min(avgScore / 100, 1);

    // Map based on category
    switch (experience.category) {
      case "know":
        if (id.includes("purpose") || id.includes("dharma")) {
          scores["purpose"].push(normalizedAvg || 0.5);
          scores["self-awareness"].push(normalizedAvg || 0.5);
        } else if (id.includes("level") || id.includes("consciousness")) {
          scores["consciousness"].push(normalizedAvg || 0.5);
          scores["self-awareness"].push(normalizedAvg || 0.5);
        } else if (id.includes("spirit")) {
          scores["spirituality"].push(normalizedAvg || 0.5);
          scores["consciousness"].push(normalizedAvg || 0.4);
        } else if (id.includes("mirror") || id.includes("score")) {
          scores["self-awareness"].push(normalizedAvg || 0.5);
          scores["emotional-depth"].push(normalizedAvg || 0.4);
        } else {
          scores["self-awareness"].push(normalizedAvg || 0.5);
        }
        break;
      case "love":
        if (id.includes("partner")) {
          scores["connection"].push(normalizedAvg || 0.5);
          scores["emotional-depth"].push(normalizedAvg || 0.4);
        } else if (id.includes("attachment")) {
          scores["attachment"].push(normalizedAvg || 0.5);
          scores["emotional-depth"].push(normalizedAvg || 0.4);
        } else if (id.includes("love-language")) {
          scores["connection"].push(normalizedAvg || 0.5);
          scores["attachment"].push(normalizedAvg || 0.4);
        } else {
          scores["connection"].push(normalizedAvg || 0.5);
        }
        break;
      case "body":
        if (id.includes("diet") || id.includes("chemistry")) {
          scores["physical-vitality"].push(normalizedAvg || 0.5);
          scores["body-wisdom"].push(normalizedAvg || 0.4);
        } else if (id.includes("movement")) {
          scores["physical-vitality"].push(normalizedAvg || 0.5);
          scores["body-wisdom"].push(normalizedAvg || 0.5);
        } else if (id.includes("sleep")) {
          scores["rest-recovery"].push(normalizedAvg || 0.5);
          scores["body-wisdom"].push(normalizedAvg || 0.4);
        } else {
          scores["body-wisdom"].push(normalizedAvg || 0.5);
        }
        break;
      case "taste":
        scores["sensory-refinement"].push(normalizedAvg || 0.5);
        scores["ritual-practice"].push(normalizedAvg || 0.4);
        break;
      case "mind":
        if (id.includes("therapy")) {
          scores["therapeutic-awareness"].push(normalizedAvg || 0.5);
          scores["emotional-depth"].push(normalizedAvg || 0.3);
        } else if (id.includes("blueprint") || id.includes("capital")) {
          scores["systems-thinking"].push(normalizedAvg || 0.5);
        } else if (id.includes("style")) {
          scores["creative-expression"].push(normalizedAvg || 0.5);
        } else if (id.includes("religion")) {
          scores["spirituality"].push(normalizedAvg || 0.4);
          scores["systems-thinking"].push(normalizedAvg || 0.3);
        }
        break;
    }
  }

  // Average each dimension
  const dimensions = COMPOSITE_DIMENSIONS.map(d => ({
    key: d.key,
    value: scores[d.key].length > 0
      ? scores[d.key].reduce((a, b) => a + b, 0) / scores[d.key].length
      : 0,
  }));

  return { dimensions, completedAssessments, archetypes };
}

/* ── Large Composite Radar Chart ── */
function CompositeRadar({ dimensions, size = 400 }: { dimensions: { key: string; value: number }[]; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.36;
  const n = dimensions.length;
  const angleStep = (2 * Math.PI) / n;

  const points = dimensions.map((d, i) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const dist = r * Math.min(d.value, 1);
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  });

  const polygon = points.map(p => `${p.x},${p.y}`).join(" ");

  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ maxWidth: "100%" }}>
      {/* Grid rings */}
      {rings.map((ring) => (
        <polygon
          key={ring}
          points={Array.from({ length: n }, (_, i) => {
            const angle = -Math.PI / 2 + i * angleStep;
            return `${cx + r * ring * Math.cos(angle)},${cy + r * ring * Math.sin(angle)}`;
          }).join(" ")}
          fill="none"
          stroke="rgba(212,185,106,0.15)"
          strokeWidth={1}
        />
      ))}

      {/* Axis lines */}
      {dimensions.map((_, i) => {
        const angle = -Math.PI / 2 + i * angleStep;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + r * Math.cos(angle)}
            y2={cy + r * Math.sin(angle)}
            stroke="rgba(212,185,106,0.1)"
            strokeWidth={1}
          />
        );
      })}

      {/* Filled area */}
      <polygon
        points={polygon}
        fill="rgba(212,185,106,0.15)"
        stroke="#D4B96A"
        strokeWidth={2}
      />

      {/* Data points */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={4}
          fill={CATEGORY_COLORS[COMPOSITE_DIMENSIONS[i]?.category || "know"]}
          stroke="#0A0A10"
          strokeWidth={2}
        />
      ))}

      {/* Labels */}
      {dimensions.map((d, i) => {
        const dim = COMPOSITE_DIMENSIONS[i];
        const angle = -Math.PI / 2 + i * angleStep;
        const labelR = r + 28;
        const lx = cx + labelR * Math.cos(angle);
        const ly = cy + labelR * Math.sin(angle);
        const anchor = Math.abs(Math.cos(angle)) < 0.1 ? "middle" : Math.cos(angle) > 0 ? "start" : "end";

        return (
          <text
            key={d.key}
            x={lx}
            y={ly}
            textAnchor={anchor}
            dominantBaseline="central"
            fill={CATEGORY_COLORS[dim?.category || "know"]}
            fontSize={10}
            fontFamily="'DM Mono', monospace"
            style={{ textTransform: "uppercase" as const }}
          >
            {dim?.label || d.key}
          </text>
        );
      })}
    </svg>
  );
}

/* ── Main Self-Portrait Page ── */
export default function SelfPortrait() {
  const { completed } = useJourneyProgress();
  const [compositeData, setCompositeData] = useState<ReturnType<typeof extractCompositeScores> | null>(null);

  useEffect(() => {
    setCompositeData(extractCompositeScores());
  }, []);

  const completedCount = completed.size;
  const totalCount = JOURNEY_MAP.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const isUnlocked = completedCount >= 5;

  const overallScore = useMemo(() => {
    if (!compositeData) return 0;
    const active = compositeData.dimensions.filter(d => d.value > 0);
    if (active.length === 0) return 0;
    return Math.round((active.reduce((sum, d) => sum + d.value, 0) / active.length) * 100);
  }, [compositeData]);

  // Find strongest and weakest dimensions
  const { strongest, weakest } = useMemo(() => {
    if (!compositeData) return { strongest: null, weakest: null };
    const active = compositeData.dimensions.filter(d => d.value > 0);
    if (active.length < 2) return { strongest: null, weakest: null };
    const sorted = [...active].sort((a, b) => b.value - a.value);
    return {
      strongest: COMPOSITE_DIMENSIONS.find(d => d.key === sorted[0].key),
      weakest: COMPOSITE_DIMENSIONS.find(d => d.key === sorted[sorted.length - 1].key),
    };
  }, [compositeData]);

  return (
    <>
      <SEO title="Self-Portrait — The Composite You" description="A unified visualization combining all your assessment dimensions into one identity map."
        indexable={true} />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #0A0A10 0%, #121218 50%, #0A0A10 100%)",
          color: "#E8E4DD",
          fontFamily: "'Source Sans 3', sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ padding: "2rem", textAlign: "center" as const }}>
          <Link href="/my-journey" style={{ color: "#D4B96A", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.15em", textDecoration: "none" }}>
            ← BACK TO MY JOURNEY
          </Link>
        </div>

        {/* Hero */}
        <div style={{ textAlign: "center" as const, padding: "2rem 1.5rem 3rem" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#D4B96A", marginBottom: "1rem" }}>
            THE COMPOSITE YOU
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 400, lineHeight: 1.1, marginBottom: "1rem" }}>
            Self-<span style={{ color: "#D4B96A" }}>Portrait</span>
          </h1>
          <p style={{ maxWidth: "600px", margin: "0 auto", color: "rgba(232,228,221,0.6)", fontSize: "1.1rem", lineHeight: 1.6 }}>
            {isUnlocked
              ? "Every assessment you've taken is a brushstroke. This is the painting."
              : `Complete ${5 - completedCount} more assessments to unlock your composite self-portrait.`
            }
          </p>
        </div>

        {/* Progress Ring */}
        <div style={{ textAlign: "center" as const, marginBottom: "3rem" }}>
          <svg width={120} height={120} viewBox="0 0 120 120">
            <circle cx={60} cy={60} r={50} fill="none" stroke="rgba(212,185,106,0.15)" strokeWidth={6} />
            <circle
              cx={60} cy={60} r={50}
              fill="none" stroke="#D4B96A" strokeWidth={6}
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - progressPercent / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
            <text x={60} y={55} textAnchor="middle" fill="#D4B96A" fontSize={24} fontFamily="'Playfair Display', serif">{progressPercent}%</text>
            <text x={60} y={72} textAnchor="middle" fill="rgba(232,228,221,0.5)" fontSize={10} fontFamily="'DM Mono', monospace">COMPLETE</text>
          </svg>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "rgba(232,228,221,0.4)", marginTop: "0.5rem" }}>
            {completedCount} of {totalCount} experiences completed
          </div>
        </div>

        {!isUnlocked ? (
          /* ── Locked State ── */
          <div style={{ textAlign: "center" as const, padding: "3rem 1.5rem" }}>
            <div style={{
              maxWidth: "500px",
              margin: "0 auto",
              padding: "3rem 2rem",
              background: "rgba(212,185,106,0.05)",
              border: "1px solid rgba(212,185,106,0.15)",
              borderRadius: "12px",
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", marginBottom: "1rem" }}>
                {5 - completedCount} More Brushstrokes Needed
              </h2>
              <p style={{ color: "rgba(232,228,221,0.6)", lineHeight: 1.6, marginBottom: "2rem" }}>
                Your self-portrait requires at least 5 completed assessments to generate a meaningful composite. 
                Each assessment adds new dimensions to your identity map.
              </p>
              <Link href="/find-your-me" style={{
                display: "inline-block",
                padding: "0.75rem 2rem",
                background: "linear-gradient(135deg, #8B6914, #D4B96A)",
                color: "#0A0A10",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                textDecoration: "none",
                borderRadius: "6px",
              }}>
                CONTINUE YOUR JOURNEY →
              </Link>
            </div>
          </div>
        ) : (
          /* ── Unlocked: Full Self-Portrait ── */
          <>
            {/* Composite Radar Chart */}
            {compositeData && (
              <div style={{ textAlign: "center" as const, padding: "0 1.5rem 3rem" }}>
                <div style={{
                  maxWidth: "600px",
                  margin: "0 auto",
                  padding: "2rem",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(212,185,106,0.15)",
                  borderRadius: "16px",
                  backdropFilter: "blur(10px)",
                }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: "#D4B96A", marginBottom: "1.5rem" }}>
                    YOUR IDENTITY MAP — {compositeData.dimensions.filter(d => d.value > 0).length} DIMENSIONS ACTIVE
                  </div>
                  <CompositeRadar dimensions={compositeData.dimensions} size={400} />
                </div>
              </div>
            )}

            {/* Overall Score */}
            <div style={{ textAlign: "center" as const, marginBottom: "3rem" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(232,228,221,0.4)", marginBottom: "0.5rem" }}>
                COMPOSITE SELF-KNOWLEDGE SCORE
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "3rem", color: "#D4B96A" }}>
                {overallScore}
              </div>
            </div>

            {/* Strongest & Weakest */}
            {strongest && weakest && (
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "2rem",
                flexWrap: "wrap" as const,
                padding: "0 1.5rem 3rem",
              }}>
                <div style={{
                  padding: "1.5rem 2rem",
                  background: "rgba(212,185,106,0.08)",
                  border: "1px solid rgba(212,185,106,0.2)",
                  borderRadius: "12px",
                  textAlign: "center" as const,
                  minWidth: "200px",
                }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", color: CATEGORY_COLORS[strongest.category], marginBottom: "0.5rem" }}>
                    YOUR STRONGEST DIMENSION
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem" }}>
                    {strongest.label}
                  </div>
                </div>
                <div style={{
                  padding: "1.5rem 2rem",
                  background: "rgba(201,123,123,0.08)",
                  border: "1px solid rgba(201,123,123,0.2)",
                  borderRadius: "12px",
                  textAlign: "center" as const,
                  minWidth: "200px",
                }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", color: "#C97B7B", marginBottom: "0.5rem" }}>
                    YOUR GROWTH EDGE
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem" }}>
                    {weakest.label}
                  </div>
                </div>
              </div>
            )}

            {/* Archetypes Collected */}
            {compositeData && compositeData.archetypes.length > 0 && (
              <div style={{ padding: "0 1.5rem 3rem", maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: "#D4B96A", textAlign: "center" as const, marginBottom: "1.5rem" }}>
                  YOUR ARCHETYPES — {compositeData.archetypes.length} COLLECTED
                </div>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "0.75rem", justifyContent: "center" }}>
                  {compositeData.archetypes.map((a, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "0.5rem 1rem",
                        background: `${a.color}15`,
                        border: `1px solid ${a.color}40`,
                        borderRadius: "8px",
                        textAlign: "center" as const,
                      }}
                    >
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", color: a.color }}>
                        {a.name}
                      </div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(232,228,221,0.4)", marginTop: "0.25rem" }}>
                        {a.source}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dimension Breakdown */}
            {compositeData && (
              <div style={{ padding: "0 1.5rem 3rem", maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: "#D4B96A", textAlign: "center" as const, marginBottom: "1.5rem" }}>
                  DIMENSION BREAKDOWN
                </div>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {compositeData.dimensions
                    .filter(d => d.value > 0)
                    .sort((a, b) => b.value - a.value)
                    .map(d => {
                      const dim = COMPOSITE_DIMENSIONS.find(cd => cd.key === d.key);
                      const color = CATEGORY_COLORS[dim?.category || "know"];
                      return (
                        <div key={d.key} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <div style={{ width: "140px", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: color, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
                            {dim?.label || d.key}
                          </div>
                          <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px", overflow: "hidden" }}>
                            <div
                              style={{
                                width: `${d.value * 100}%`,
                                height: "100%",
                                background: `linear-gradient(90deg, ${color}80, ${color})`,
                                borderRadius: "3px",
                                transition: "width 1s ease",
                              }}
                            />
                          </div>
                          <div style={{ width: "40px", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(232,228,221,0.5)", textAlign: "right" as const }}>
                            {Math.round(d.value * 100)}
                          </div>
                        </div>
                      );
                    })}
                </div>
                {compositeData.dimensions.filter(d => d.value === 0).length > 0 && (
                  <div style={{ marginTop: "1.5rem", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(232,228,221,0.3)", textAlign: "center" as const }}>
                    {compositeData.dimensions.filter(d => d.value === 0).length} dimensions still unmapped — complete more assessments to fill in the picture
                  </div>
                )}
              </div>
            )}

            {/* Narrative Synthesis */}
            <div style={{ padding: "0 1.5rem 3rem", maxWidth: "700px", margin: "0 auto" }}>
              <div style={{
                padding: "2rem",
                background: "rgba(212,185,106,0.05)",
                border: "1px solid rgba(212,185,106,0.15)",
                borderRadius: "12px",
              }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: "#D4B96A", marginBottom: "1rem" }}>
                  THE NARRATIVE
                </div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", lineHeight: 1.8, color: "rgba(232,228,221,0.8)", fontStyle: "italic" }}>
                  You are someone who has begun the work of self-knowledge — not as a hobby, but as an obligation. 
                  {strongest && ` Your strongest dimension is ${strongest.label}, suggesting this is where you've done the deepest excavation.`}
                  {weakest && ` Your growth edge lies in ${weakest.label} — not a weakness, but an invitation.`}
                  {compositeData && compositeData.archetypes.length > 0 && ` Across ${compositeData.archetypes.length} assessments, you've collected archetypes that together paint a portrait of someone navigating between structure and surrender.`}
                  {` The ${compositeData?.dimensions.filter(d => d.value === 0).length || 0} unmapped dimensions aren't gaps — they're doors you haven't opened yet.`}
                </p>
              </div>
            </div>

            {/* Continue CTA */}
            {completedCount < totalCount && (
              <div style={{ textAlign: "center" as const, padding: "0 1.5rem 4rem" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(232,228,221,0.4)", marginBottom: "1rem" }}>
                  {totalCount - completedCount} EXPERIENCES REMAINING
                </div>
                <Link href="/find-your-me" style={{
                  display: "inline-block",
                  padding: "0.75rem 2rem",
                  background: "linear-gradient(135deg, #8B6914, #D4B96A)",
                  color: "#0A0A10",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  textDecoration: "none",
                  borderRadius: "6px",
                }}>
                  CONTINUE THE JOURNEY →
                </Link>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div style={{
          textAlign: "center" as const,
          padding: "2rem 1.5rem",
          borderTop: "1px solid rgba(212,185,106,0.1)",
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.65rem",
          color: "rgba(232,228,221,0.3)",
          letterSpacing: "0.1em",
        }}>
          SELF-PORTRAIT · FIND YOUR ME · {new Date().getFullYear()}
        </div>
      </div>
    </>
  );
}
