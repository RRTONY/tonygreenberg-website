/**
 * MY JOURNEY DASHBOARD
 * 
 * The personal control center for the Find Your ___ ecosystem.
 * Shows all assessment results in one place, tracks progress,
 * and recommends what to explore next.
 * 
 * Data persisted in localStorage — no login required.
 * Each assessment stores its results under its own key.
 */

import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { useJourneyProgress, JOURNEY_MAP, type JourneyExperience } from "@/components/JourneyTracker";

/* ── ASSESSMENT RESULT KEYS (localStorage) ── */
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

/* ── Category metadata ── */
const CATEGORY_META: Record<string, { label: string; color: string; icon: string }> = {
  know: { label: "Know Thyself", color: "#D4B96A", icon: "◎" },
  love: { label: "Love & Belonging", color: "#C97B7B", icon: "♡" },
  body: { label: "Body & Temple", color: "#7BC9A4", icon: "⌘" },
  taste: { label: "Taste & Ritual", color: "#C9A87B", icon: "◈" },
  mind: { label: "Mind & Systems", color: "#7BA8C9", icon: "⬡" },
};

/* ── Phase labels for the journey ── */
const JOURNEY_PHASES = [
  { phase: 1, title: "The Reckoning", subtitle: "Who you are right now", ids: ["find-your-me", "find-your-mirror", "find-your-score"] },
  { phase: 2, title: "The Deepening", subtitle: "What drives you beneath the surface", ids: ["find-your-purpose", "find-your-level", "find-your-spirit"] },
  { phase: 3, title: "The Body Knows", subtitle: "What your chemistry is telling you", ids: ["find-your-chemistry", "find-your-water", "find-your-diet", "find-your-movement", "find-your-sleep"] },
  { phase: 4, title: "The Connections", subtitle: "How you love and who you build with", ids: ["find-your-partner", "find-your-tribe", "find-your-team", "find-your-attachment", "find-your-love-language"] },
  { phase: 5, title: "The Rituals", subtitle: "What you pour, sip, and savor", ids: ["find-your-mezcal", "find-your-tequila", "find-your-sake", "find-your-coffee", "find-your-kitchen"] },
  { phase: 6, title: "The Integration", subtitle: "Systems for the whole self", ids: ["find-your-blueprint", "find-your-capital", "find-your-therapy", "find-your-religion", "find-your-style"] },
];

/* ── Stored result parser ── */
function getStoredResult(key: string): any | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/* ── Mini Radar Chart (SVG) ── */
function MiniRadar({ scores, color, size = 120 }: { scores: number[]; color: string; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const n = scores.length;
  if (n < 3) return null;

  const angleStep = (2 * Math.PI) / n;
  const points = scores.map((s, i) => {
    const angle = -Math.PI / 2 + i * angleStep;
    const dist = r * Math.min(s, 1);
    return `${cx + dist * Math.cos(angle)},${cy + dist * Math.sin(angle)}`;
  }).join(" ");

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid */}
      {rings.map((ring) => {
        const ringPoints = Array.from({ length: n }, (_, i) => {
          const angle = -Math.PI / 2 + i * angleStep;
          const dist = r * ring;
          return `${cx + dist * Math.cos(angle)},${cy + dist * Math.sin(angle)}`;
        }).join(" ");
        return <polygon key={ring} points={ringPoints} fill="none" stroke="rgba(212,185,106,0.1)" strokeWidth="0.5" />;
      })}
      {/* Axes */}
      {Array.from({ length: n }, (_, i) => {
        const angle = -Math.PI / 2 + i * angleStep;
        return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(angle)} y2={cy + r * Math.sin(angle)} stroke="rgba(212,185,106,0.08)" strokeWidth="0.5" />;
      })}
      {/* Data polygon */}
      <polygon points={points} fill={`${color}22`} stroke={color} strokeWidth="1.5" />
      {/* Data points */}
      {scores.map((s, i) => {
        const angle = -Math.PI / 2 + i * angleStep;
        const dist = r * Math.min(s, 1);
        return <circle key={i} cx={cx + dist * Math.cos(angle)} cy={cy + dist * Math.sin(angle)} r="2.5" fill={color} />;
      })}
    </svg>
  );
}

/* ── Result Card Component ── */
function ResultCard({ experience, result, isCompleted }: { experience: JourneyExperience; result: any | null; isCompleted: boolean }) {
  const cat = CATEGORY_META[experience.category];
  const isExternal = experience.isExternal;

  // Try to extract meaningful data from stored results
  let archetype = result?.archetype || result?.topModality || result?.primaryPath || result?.sakeStyle || null;
  let scores: number[] | null = null;
  let dimensionLabels: string[] | null = null;

  if (result?.scores && typeof result.scores === "object") {
    const vals = Object.values(result.scores) as number[];
    const keys = Object.keys(result.scores);
    if (vals.length >= 3) {
      // Normalize to 0-1 range
      const max = Math.max(...vals, 1);
      scores = vals.map(v => v / max);
      dimensionLabels = keys;
    }
  }

  return (
    <div
      style={{
        background: isCompleted ? "rgba(212, 185, 106, 0.04)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${isCompleted ? `${cat.color}33` : "rgba(255,255,255,0.05)"}`,
        borderRadius: "16px",
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}
    >
      {/* Status badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <div>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase" as const,
            color: cat.color,
            opacity: 0.7,
          }}>
            {cat.icon} {cat.label}
          </span>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#E8E4DC",
            margin: "0.25rem 0 0",
          }}>
            {experience.name}
          </h3>
        </div>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.5rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase" as const,
          padding: "3px 8px",
          borderRadius: "4px",
          background: isCompleted ? `${cat.color}22` : "rgba(255,255,255,0.05)",
          color: isCompleted ? cat.color : "rgba(232,228,220,0.3)",
          border: `1px solid ${isCompleted ? `${cat.color}33` : "rgba(255,255,255,0.05)"}`,
        }}>
          {isCompleted ? "✓ Complete" : "Not Started"}
        </span>
      </div>

      {/* Result content */}
      {isCompleted && result && archetype ? (
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {scores && scores.length >= 3 && (
            <MiniRadar scores={scores} color={cat.color} size={100} />
          )}
          <div style={{ flex: 1 }}>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: "rgba(232,228,220,0.4)",
              margin: "0 0 0.25rem",
            }}>
              Your Result
            </p>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: cat.color,
              margin: "0 0 0.5rem",
            }}>
              {archetype}
            </p>
            {dimensionLabels && scores && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                {dimensionLabels.slice(0, 4).map((label, i) => (
                  <span key={label} style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.5rem",
                    color: "rgba(232,228,220,0.35)",
                    background: "rgba(255,255,255,0.03)",
                    padding: "2px 6px",
                    borderRadius: "3px",
                  }}>
                    {label}: {Math.round((scores![i] || 0) * 100)}%
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : isCompleted && isExternal ? (
        <p style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: "0.85rem",
          color: "rgba(232,228,220,0.5)",
          margin: 0,
          lineHeight: 1.5,
        }}>
          Marked as visited. Results stored on the external site.
        </p>
      ) : isCompleted ? (
        <p style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: "0.85rem",
          color: "rgba(232,228,220,0.5)",
          margin: 0,
          lineHeight: 1.5,
        }}>
          Completed. Retake to see detailed results here.
        </p>
      ) : (
        <p style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: "0.85rem",
          color: "rgba(232,228,220,0.3)",
          margin: 0,
          lineHeight: 1.5,
        }}>
          {experience.questionCount ? `${experience.questionCount} questions` : "Experience"} · ~{experience.estimatedMinutes} min
        </p>
      )}

      {/* Action button */}
      <div style={{ marginTop: "1rem" }}>
        {isExternal ? (
          <a
            href={experience.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: isCompleted ? "rgba(232,228,220,0.4)" : cat.color,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              padding: "6px 12px",
              border: `1px solid ${isCompleted ? "rgba(255,255,255,0.08)" : `${cat.color}33`}`,
              borderRadius: "6px",
              transition: "all 0.2s",
            }}
          >
            {isCompleted ? "Visit Again ↗" : "Begin ↗"}
          </a>
        ) : (
          <Link
            href={experience.url}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: isCompleted ? "rgba(232,228,220,0.4)" : cat.color,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              padding: "6px 12px",
              border: `1px solid ${isCompleted ? "rgba(255,255,255,0.08)" : `${cat.color}33`}`,
              borderRadius: "6px",
              transition: "all 0.2s",
            }}
          >
            {isCompleted ? "Retake →" : "Begin →"}
          </Link>
        )}
      </div>
    </div>
  );
}

/* ── Phase Timeline Component ── */
function PhaseTimeline({ phases, completed }: { phases: typeof JOURNEY_PHASES; completed: Set<string> }) {
  return (
    <div style={{ position: "relative", padding: "0 0 0 2rem" }}>
      {/* Vertical line */}
      <div style={{
        position: "absolute",
        left: "0.5rem",
        top: "0.5rem",
        bottom: "0.5rem",
        width: "2px",
        background: "linear-gradient(180deg, #D4B96A 0%, rgba(212,185,106,0.1) 100%)",
      }} />

      {phases.map((phase, idx) => {
        const phaseExperiences = phase.ids.map(id => JOURNEY_MAP.find(e => e.id === id)).filter(Boolean) as JourneyExperience[];
        const phaseCompleted = phaseExperiences.filter(e => completed.has(e.id)).length;
        const phaseTotal = phaseExperiences.length;
        const phasePct = phaseTotal > 0 ? Math.round((phaseCompleted / phaseTotal) * 100) : 0;
        const isComplete = phasePct === 100;
        const isActive = phasePct > 0 && phasePct < 100;

        return (
          <div key={phase.phase} style={{ position: "relative", marginBottom: "2rem" }}>
            {/* Phase dot */}
            <div style={{
              position: "absolute",
              left: "-1.75rem",
              top: "0.15rem",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: isComplete ? "#D4B96A" : (isActive ? "rgba(212,185,106,0.3)" : "rgba(212,185,106,0.08)"),
              border: `2px solid ${isComplete ? "#D4B96A" : (isActive ? "#D4B96A" : "rgba(212,185,106,0.15)")}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.5rem",
              color: isComplete ? "#0A0A10" : "#D4B96A",
              fontWeight: 700,
            }}>
              {isComplete ? "✓" : phase.phase}
            </div>

            {/* Phase content */}
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase" as const,
                  color: "rgba(212,185,106,0.4)",
                }}>
                  Phase {phase.phase}
                </span>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.55rem",
                  color: isComplete ? "#D4B96A" : "rgba(232,228,220,0.3)",
                }}>
                  {phaseCompleted}/{phaseTotal}
                </span>
              </div>
              <h4 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1rem",
                fontWeight: 700,
                color: isComplete ? "#D4B96A" : (isActive ? "#E8E4DC" : "rgba(232,228,220,0.4)"),
                margin: "0 0 0.15rem",
              }}>
                {phase.title}
              </h4>
              <p style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.8rem",
                color: "rgba(232,228,220,0.35)",
                margin: "0 0 0.5rem",
                fontStyle: "italic",
              }}>
                {phase.subtitle}
              </p>

              {/* Phase progress bar */}
              <div style={{
                height: "3px",
                borderRadius: "2px",
                background: "rgba(212,185,106,0.08)",
                overflow: "hidden",
                maxWidth: "200px",
              }}>
                <div style={{
                  height: "100%",
                  width: `${phasePct}%`,
                  background: "linear-gradient(90deg, rgba(212,185,106,0.4), #D4B96A)",
                  borderRadius: "2px",
                  transition: "width 0.6s ease",
                }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── MAIN DASHBOARD ── */
export default function MyJourney() {
  const { completed, stats } = useJourneyProgress();
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "done" | "todo">("all");

  // Load stored results for each assessment
  const [storedResults, setStoredResults] = useState<Record<string, any>>({});

  useEffect(() => {
    const results: Record<string, any> = {};
    for (const [id, key] of Object.entries(RESULT_KEYS)) {
      const r = getStoredResult(key);
      if (r) results[id] = r;
    }
    setStoredResults(results);
  }, []);

  // Filtered experiences
  const filteredExperiences = useMemo(() => {
    return JOURNEY_MAP.filter(e => {
      if (filterCategory !== "all" && e.category !== filterCategory) return false;
      if (filterStatus === "done" && !completed.has(e.id)) return false;
      if (filterStatus === "todo" && completed.has(e.id)) return false;
      return true;
    });
  }, [filterCategory, filterStatus, completed]);

  // Recommended next assessment
  const nextRecommended = useMemo(() => {
    for (const phase of JOURNEY_PHASES) {
      for (const id of phase.ids) {
        if (!completed.has(id)) {
          return JOURNEY_MAP.find(e => e.id === id) || null;
        }
      }
    }
    return null;
  }, [completed]);

  // Total time invested
  const timeInvested = useMemo(() => {
    return JOURNEY_MAP.filter(e => completed.has(e.id)).reduce((sum, e) => sum + e.estimatedMinutes, 0);
  }, [completed]);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A10", color: "#E8E4DC" }}>
      {/* Sacred geometry background */}
      <div style={{
        position: "fixed",
        inset: 0,
        opacity: 0.03,
        backgroundImage: `
          radial-gradient(circle at 20% 30%, #D4B96A 1px, transparent 1px),
          radial-gradient(circle at 80% 70%, #D4B96A 1px, transparent 1px),
          radial-gradient(circle at 50% 50%, #D4B96A 0.5px, transparent 0.5px)
        `,
        backgroundSize: "60px 60px, 80px 80px, 40px 40px",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <header style={{
        padding: "2rem 1.5rem 1rem",
        maxWidth: "1200px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Back to Find Your Me */}
        <Link
          href="/find-your-me"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            color: "rgba(212,185,106,0.5)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            marginBottom: "1.5rem",
          }}
        >
          ← Back to Find Your Me
        </Link>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 700,
              color: "#E8E4DC",
              margin: "0 0 0.5rem",
              lineHeight: 1.1,
            }}>
              My Journey
            </h1>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1rem",
              color: "rgba(232,228,220,0.5)",
              margin: 0,
              maxWidth: "500px",
              lineHeight: 1.5,
            }}>
              Every question answered is a mirror held up. Every result, a compass point.
              This is your map of self-discovery — incomplete, evolving, honest.
            </p>
          </div>

          {/* Big progress ring */}
          <div style={{ textAlign: "center" }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(212,185,106,0.08)" strokeWidth="6" />
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke="#D4B96A"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - stats.pct / 100)}`}
                transform="rotate(-90 60 60)"
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
              <text x="60" y="52" textAnchor="middle" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, fill: "#D4B96A" }}>
                {stats.pct}%
              </text>
              <text x="60" y="72" textAnchor="middle" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, fill: "rgba(232,228,220,0.4)" }}>
                Complete
              </text>
            </svg>
          </div>
        </div>
      </header>

      {/* Stats strip */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 1.5rem",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "1rem",
          padding: "1.5rem 0",
          borderTop: "1px solid rgba(212,185,106,0.1)",
          borderBottom: "1px solid rgba(212,185,106,0.1)",
          marginBottom: "2rem",
        }}>
          {[
            { label: "Completed", value: `${stats.done}`, sub: `of ${stats.total}` },
            { label: "Remaining", value: `${stats.remaining}`, sub: `~${stats.minutesRemaining} min` },
            { label: "Time Invested", value: `${timeInvested}`, sub: "minutes" },
            { label: "Categories", value: "5", sub: "dimensions" },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.6rem",
                fontWeight: 700,
                color: "#D4B96A",
                lineHeight: 1,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase" as const,
                color: "rgba(232,228,220,0.4)",
                marginTop: "0.25rem",
              }}>
                {stat.label}
              </div>
              <div style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.75rem",
                color: "rgba(232,228,220,0.25)",
              }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended next */}
      {nextRecommended && (
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto 2rem",
          padding: "0 1.5rem",
          position: "relative",
          zIndex: 1,
        }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(212,185,106,0.08) 0%, rgba(139,105,20,0.04) 100%)",
            border: "1px solid rgba(212,185,106,0.15)",
            borderRadius: "16px",
            padding: "1.5rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}>
            <div>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase" as const,
                color: "rgba(212,185,106,0.5)",
              }}>
                Recommended Next
              </span>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "#E8E4DC",
                margin: "0.25rem 0 0.15rem",
              }}>
                {nextRecommended.name}
              </h3>
              <p style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.85rem",
                color: "rgba(232,228,220,0.4)",
                margin: 0,
              }}>
                {nextRecommended.questionCount ? `${nextRecommended.questionCount} questions · ` : ""}~{nextRecommended.estimatedMinutes} min · {CATEGORY_META[nextRecommended.category]?.label}
              </p>
            </div>
            {nextRecommended.isExternal ? (
              <a
                href={nextRecommended.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "#0A0A10",
                  background: "linear-gradient(135deg, #8B6914, #D4B96A)",
                  padding: "10px 24px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Begin ↗
              </a>
            ) : (
              <Link
                href={nextRecommended.url}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "#0A0A10",
                  background: "linear-gradient(135deg, #8B6914, #D4B96A)",
                  padding: "10px 24px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Begin →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* View toggle + filters */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 1.5rem 1rem",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          {/* View mode */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {(["grid", "timeline"] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: viewMode === mode ? "#D4B96A" : "rgba(232,228,220,0.3)",
                  background: viewMode === mode ? "rgba(212,185,106,0.1)" : "transparent",
                  border: `1px solid ${viewMode === mode ? "rgba(212,185,106,0.2)" : "rgba(255,255,255,0.05)"}`,
                  borderRadius: "6px",
                  padding: "6px 14px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {mode === "grid" ? "◫ Grid" : "⊞ Timeline"}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {/* Category filter */}
            {[
              { key: "all", label: "All" },
              ...Object.entries(CATEGORY_META).map(([key, meta]) => ({ key, label: meta.label })),
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilterCategory(f.key)}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.5rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: filterCategory === f.key ? "#D4B96A" : "rgba(232,228,220,0.25)",
                  background: filterCategory === f.key ? "rgba(212,185,106,0.08)" : "transparent",
                  border: `1px solid ${filterCategory === f.key ? "rgba(212,185,106,0.15)" : "transparent"}`,
                  borderRadius: "4px",
                  padding: "4px 10px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {f.label}
              </button>
            ))}
            <span style={{ width: "1px", background: "rgba(212,185,106,0.1)", margin: "0 0.25rem" }} />
            {/* Status filter */}
            {[
              { key: "all" as const, label: "All" },
              { key: "done" as const, label: "Done" },
              { key: "todo" as const, label: "To Do" },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilterStatus(f.key)}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.5rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: filterStatus === f.key ? "#D4B96A" : "rgba(232,228,220,0.25)",
                  background: filterStatus === f.key ? "rgba(212,185,106,0.08)" : "transparent",
                  border: `1px solid ${filterStatus === f.key ? "rgba(212,185,106,0.15)" : "transparent"}`,
                  borderRadius: "4px",
                  padding: "4px 10px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 1.5rem 4rem",
        position: "relative",
        zIndex: 1,
      }}>
        {viewMode === "grid" ? (
          /* Grid view */
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1rem",
          }}>
            {filteredExperiences.map(exp => (
              <ResultCard
                key={exp.id}
                experience={exp}
                result={storedResults[exp.id] || null}
                isCompleted={completed.has(exp.id)}
              />
            ))}
          </div>
        ) : (
          /* Timeline view */
          <PhaseTimeline phases={JOURNEY_PHASES} completed={completed} />
        )}

        {filteredExperiences.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.2rem",
              color: "rgba(232,228,220,0.3)",
              fontStyle: "italic",
            }}>
              No experiences match your filters.
            </p>
          </div>
        )}
      </div>

      {/* Journey complete celebration */}
      {stats.pct === 100 && (
        <div style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "3rem 1.5rem 4rem",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(212,185,106,0.1) 0%, rgba(139,105,20,0.05) 100%)",
            border: "1px solid rgba(212,185,106,0.2)",
            borderRadius: "20px",
            padding: "3rem 2rem",
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>◎</div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.8rem",
              fontWeight: 700,
              color: "#D4B96A",
              margin: "0 0 0.75rem",
            }}>
              You Found Yourself
            </h2>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1rem",
              color: "rgba(232,228,220,0.6)",
              maxWidth: "500px",
              margin: "0 auto 1.5rem",
              lineHeight: 1.6,
            }}>
              Every dimension explored. Every mirror faced. Every question answered honestly.
              The map is complete — but the territory keeps unfolding.
              Come back anytime. The answers evolve as you do.
            </p>
            <Link
              href="/find-your-me"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "#D4B96A",
                textDecoration: "none",
                border: "1px solid rgba(212,185,106,0.3)",
                padding: "10px 24px",
                borderRadius: "8px",
              }}
            >
              Return to Find Your Me →
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        padding: "2rem 1.5rem 3rem",
        borderTop: "1px solid rgba(212,185,106,0.08)",
        position: "relative",
        zIndex: 1,
      }}>
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "0.9rem",
          fontStyle: "italic",
          color: "rgba(232,228,220,0.3)",
          margin: "0 0 0.5rem",
        }}>
          "The unexamined life is not worth living — but the over-examined life
          needs a dashboard."
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "1rem" }}>
          <Link href="/find-your-me" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(212,185,106,0.4)", textDecoration: "none" }}>
            Find Your Me
          </Link>
          <Link href="/ecosystem-map" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(212,185,106,0.4)", textDecoration: "none" }}>
            Ecosystem Map
          </Link>
          <Link href="/" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(212,185,106,0.4)", textDecoration: "none" }}>
            Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
