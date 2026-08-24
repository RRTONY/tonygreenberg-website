/**
 * JOURNEY PROGRESS TRACKER
 * 
 * A universal component that tracks which "Find Your ___" experiences
 * a user has completed across the entire ecosystem. Persists in localStorage.
 * Shows a visual timeline with progress percentage and estimated time remaining.
 * 
 * Appears on every assessment results page and the Find Your Me directory.
 * External sites (Mezcal, Tequila, etc.) can be manually marked as visited.
 */

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

/* ── JOURNEY MAP: All experiences in the ecosystem ── */

export interface JourneyExperience {
  id: string;
  name: string;
  category: "know" | "love" | "body" | "taste" | "mind";
  url: string;
  estimatedMinutes: number;
  isExternal: boolean; // external sites can't auto-detect completion
  questionCount?: number;
}

export const JOURNEY_MAP: JourneyExperience[] = [
  // Know Thyself
  { id: "find-your-me", name: "Find Your Me", category: "know", url: "/find-your-me", estimatedMinutes: 3, isExternal: false, questionCount: 5 },
  { id: "find-your-purpose", name: "Find Your Purpose", category: "know", url: "/assessments/dharma-finder", estimatedMinutes: 12, isExternal: false, questionCount: 25 },
  { id: "find-your-mirror", name: "Find Your Mirror", category: "know", url: "/the-mirror", estimatedMinutes: 10, isExternal: false, questionCount: 18 },
  { id: "find-your-level", name: "Find Your Level", category: "know", url: "/assessments/consciousness-scale", estimatedMinutes: 12, isExternal: false, questionCount: 25 },
  { id: "find-your-score", name: "Find Your Score", category: "know", url: "/assessments/grant-study", estimatedMinutes: 12, isExternal: false, questionCount: 25 },
  { id: "find-your-spirit", name: "Find Your Spirit", category: "know", url: "/find-your-spirit", estimatedMinutes: 18, isExternal: false, questionCount: 35 },

  // Love & Belonging
  { id: "find-your-partner", name: "Find Your Partner", category: "love", url: "https://intimacyassess-tcir3hon.manus.space", estimatedMinutes: 10, isExternal: true, questionCount: 15 },
  { id: "find-your-tribe", name: "Find Your Tribe", category: "love", url: "/community", estimatedMinutes: 5, isExternal: false },
  { id: "find-your-team", name: "Find Your Team", category: "love", url: "/flow-circuit", estimatedMinutes: 8, isExternal: false },
  { id: "find-your-attachment", name: "Find Your Attachment Style", category: "love", url: "/find-your-attachment-style", estimatedMinutes: 10, isExternal: false, questionCount: 18 },
  { id: "find-your-love-language", name: "Find Your Love Language", category: "love", url: "/find-your-love-language", estimatedMinutes: 8, isExternal: false, questionCount: 15 },
  { id: "find-your-religion", name: "Find Your Religion", category: "mind", url: "/find-your-religion", estimatedMinutes: 20, isExternal: false, questionCount: 20 },

  // Body & Temple
  { id: "find-your-chemistry", name: "Find Your Chemistry", category: "body", url: "https://regenhealth-4nns6jnd.manus.space", estimatedMinutes: 8, isExternal: true },
  { id: "find-your-water", name: "Find Your Water", category: "body", url: "https://aqwaterqpr-wvzsc3ph.manus.space", estimatedMinutes: 5, isExternal: true },
  { id: "find-your-diet", name: "Find Your Diet", category: "body", url: "/find-your-diet", estimatedMinutes: 8, isExternal: false, questionCount: 15 },
  { id: "find-your-movement", name: "Find Your Movement", category: "body", url: "/find-your-movement", estimatedMinutes: 8, isExternal: false, questionCount: 15 },
  { id: "find-your-sleep", name: "Find Your Sleep", category: "body", url: "/find-your-sleep", estimatedMinutes: 8, isExternal: false, questionCount: 15 },


  // Taste & Ritual
  { id: "find-your-mezcal", name: "Find Your Mezcal", category: "taste", url: "https://mezcalagave-ahru9fq8.manus.space", estimatedMinutes: 5, isExternal: true },
  { id: "find-your-tequila", name: "Find Your Tequila", category: "taste", url: "https://tequilaazul-fxqrr3js.manus.space", estimatedMinutes: 5, isExternal: true },
  { id: "find-your-sake", name: "Find Your Sake", category: "taste", url: "/find-your-sake", estimatedMinutes: 8, isExternal: false, questionCount: 20 },
  { id: "find-your-coffee", name: "Find Your Coffee", category: "taste", url: "/find-your-coffee", estimatedMinutes: 8, isExternal: false, questionCount: 15 },
  { id: "find-your-kitchen", name: "Find Your Kitchen", category: "taste", url: "/find-your-kitchen", estimatedMinutes: 8, isExternal: false, questionCount: 15 },

  // Mind & Systems
  { id: "find-your-blueprint", name: "Find Your Blueprint", category: "mind", url: "/living-declaration", estimatedMinutes: 8, isExternal: false },
  { id: "find-your-capital", name: "Find Your Capital", category: "mind", url: "https://portfoliofamilyoffice.manus.space", estimatedMinutes: 5, isExternal: true },
  { id: "find-your-therapy", name: "Find Your Therapy", category: "mind", url: "/find-your-therapy", estimatedMinutes: 12, isExternal: false, questionCount: 25 },
  { id: "find-your-style", name: "Find Your Style", category: "mind", url: "/find-your-style", estimatedMinutes: 8, isExternal: false, questionCount: 15 },
  { id: "find-your-peptide", name: "Find Your Peptide", category: "body", url: "/find-your-peptide", estimatedMinutes: 8, isExternal: false, questionCount: 10 },
];

const STORAGE_KEY = "findyour_journey_progress";

const CATEGORY_META: Record<string, { label: string; color: string }> = {
  know: { label: "Know Thyself", color: "#D4B96A" },
  love: { label: "Love & Belonging", color: "#C97B7B" },
  body: { label: "Body & Temple", color: "#7BC9A4" },
  taste: { label: "Taste & Ritual", color: "#C9A87B" },
  mind: { label: "Mind & Systems", color: "#7BA8C9" },
};

/* ── Hook: useJourneyProgress ── */

export function useJourneyProgress() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const { user, isAuthenticated } = useAuth();
  const hasSynced = useRef(false);

  // DB mutations
  const dbMarkComplete = trpc.journey.markComplete.useMutation();
  const dbToggle = trpc.journey.toggleComplete.useMutation();
  const dbSync = trpc.journey.sync.useMutation();

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setCompleted(new Set(parsed));
      }
    } catch { /* ignore */ }
  }, []);

  // Sync with DB when user logs in
  useEffect(() => {
    if (!isAuthenticated || !user || hasSynced.current) return;
    hasSynced.current = true;

    // Gather localStorage data
    const localIds = Array.from(completed);
    const resultDataMap: Record<string, string> = {};
    for (const id of localIds) {
      // Check for stored result data
      const resultKeys = [
        `therapy_results`, `sake_results`, `spirit_results`, `religion_results`,
        `dharma_results`, `consciousness_results`, `grant_results`, `findyourme_results`,
      ];
      for (const key of resultKeys) {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const assessId = key.replace('_results', '').replace('findyourme', 'find-your-me');
            const matchId = JOURNEY_MAP.find(e => e.id.includes(assessId))?.id;
            if (matchId) resultDataMap[matchId] = data;
          }
        } catch { /* ignore */ }
      }
    }

    dbSync.mutate(
      { completedIds: localIds, resultDataMap: Object.keys(resultDataMap).length > 0 ? resultDataMap : undefined },
      {
        onSuccess: (data) => {
          // Merge DB data back into local state
          const merged = new Set([...localIds, ...data.completedIds]);
          setCompleted(merged);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(merged)));
        },
      }
    );
  }, [isAuthenticated, user]);

  const markComplete = useCallback((id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      return next;
    });
    // Also persist to DB if logged in
    if (isAuthenticated) {
      dbMarkComplete.mutate({ experienceId: id });
    }
  }, [isAuthenticated]);

  const toggleComplete = useCallback((id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      return next;
    });
    // Also persist to DB if logged in
    if (isAuthenticated) {
      if (completed.has(id)) {
        dbToggle.mutate({ experienceId: id });
      } else {
        dbMarkComplete.mutate({ experienceId: id });
      }
    }
  }, [isAuthenticated, completed]);

  const stats = useMemo(() => {
    const total = JOURNEY_MAP.length;
    const done = JOURNEY_MAP.filter((e) => completed.has(e.id)).length;
    const remaining = JOURNEY_MAP.filter((e) => !completed.has(e.id));
    const minutesRemaining = remaining.reduce((sum, e) => sum + e.estimatedMinutes, 0);
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, remaining: total - done, minutesRemaining, pct };
  }, [completed]);

  return { completed, markComplete, toggleComplete, stats, allExperiences: JOURNEY_MAP };
}

/* ── Component: JourneyTracker ── */

interface JourneyTrackerProps {
  variant?: "dark" | "light"; // dark = glass-morphism pages, light = editorial pages
  currentAssessmentId?: string; // highlight current assessment
  compact?: boolean; // compact mode for inline use
}

export default function JourneyTracker({ variant = "dark", currentAssessmentId, compact = false }: JourneyTrackerProps) {
  const { completed, toggleComplete, stats } = useJourneyProgress();
  const [expanded, setExpanded] = useState(false);

  const isDark = variant === "dark";
  const bg = isDark ? "rgba(10, 10, 16, 0.7)" : "rgba(250, 250, 247, 0.95)";
  const border = isDark ? "rgba(212, 185, 106, 0.15)" : "rgba(212, 185, 106, 0.3)";
  const textPrimary = isDark ? "#D4B96A" : "#8B6914";
  const textSecondary = isDark ? "rgba(232, 228, 220, 0.5)" : "#666";
  const textMuted = isDark ? "rgba(232, 228, 220, 0.3)" : "#999";
  const checkColor = isDark ? "#D4B96A" : "#8B6914";
  const trackBg = isDark ? "rgba(212, 185, 106, 0.08)" : "rgba(139, 105, 20, 0.08)";
  const fillBg = isDark ? "linear-gradient(90deg, rgba(212,185,106,0.3), #D4B96A)" : "linear-gradient(90deg, rgba(139,105,20,0.3), #8B6914)";

  // Group by category
  const grouped = useMemo(() => {
    const groups: Record<string, JourneyExperience[]> = {};
    for (const exp of JOURNEY_MAP) {
      if (!groups[exp.category]) groups[exp.category] = [];
      groups[exp.category].push(exp);
    }
    return groups;
  }, []);

  if (compact) {
    return (
      <div
        style={{
          background: bg,
          backdropFilter: isDark ? "blur(16px) saturate(1.2)" : undefined,
          WebkitBackdropFilter: isDark ? "blur(16px) saturate(1.2)" : undefined,
          border: `1px solid ${border}`,
          borderRadius: "12px",
          padding: "1rem 1.25rem",
          cursor: "pointer",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: textPrimary }}>
            Your Journey
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: textSecondary }}>
            {stats.done}/{stats.total} · {stats.pct}%
          </span>
        </div>
        {/* Progress bar */}
        <div style={{ height: "4px", borderRadius: "2px", background: trackBg, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${stats.pct}%`, background: fillBg, borderRadius: "2px", transition: "width 0.6s ease" }} />
        </div>
        {stats.remaining > 0 && (
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", color: textMuted, marginTop: "0.4rem", marginBottom: 0 }}>
            {stats.remaining} experiences left · ~{stats.minutesRemaining} min remaining
          </p>
        )}
        {stats.remaining === 0 && (
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", color: checkColor, marginTop: "0.4rem", marginBottom: 0 }}>
            Journey complete. You found yourself.
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        background: bg,
        backdropFilter: isDark ? "blur(16px) saturate(1.2)" : undefined,
        WebkitBackdropFilter: isDark ? "blur(16px) saturate(1.2)" : undefined,
        border: `1px solid ${border}`,
        borderRadius: "16px",
        padding: "2rem",
        marginBottom: "2rem",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <h3 style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: textMuted, marginBottom: "0.5rem" }}>
          Your Self-Discovery Journey
        </h3>
        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.4rem", color: textPrimary, margin: 0, lineHeight: 1.3 }}>
          {stats.pct === 100
            ? "You found yourself. Now find your we."
            : stats.pct >= 50
            ? "More than halfway. The mirrors are getting clearer."
            : stats.pct > 0
            ? "The journey has begun. Keep going."
            : "17 experiences. One complete picture of you."}
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: textSecondary }}>
            {stats.done} of {stats.total} completed
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.1rem", fontWeight: 700, color: textPrimary }}>
            {stats.pct}%
          </span>
        </div>
        <div style={{ height: "8px", borderRadius: "4px", background: trackBg, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${stats.pct}%`, background: fillBg, borderRadius: "4px", transition: "width 0.8s ease" }} />
        </div>
        {stats.remaining > 0 && (
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.82rem", color: textMuted, marginTop: "0.5rem", marginBottom: 0 }}>
            ~{stats.minutesRemaining} minutes to complete your full self-portrait
          </p>
        )}
      </div>

      {/* Toggle expand */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "block",
          width: "100%",
          background: "none",
          border: "none",
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.7rem",
          letterSpacing: "0.1em",
          color: textPrimary,
          cursor: "pointer",
          padding: "0.5rem 0",
          textAlign: "center",
        }}
      >
        {expanded ? "▲ Hide Details" : "▼ View Full Journey Map"}
      </button>

      {/* Expanded: full checklist by category */}
      {expanded && (
        <div style={{ marginTop: "1rem" }}>
          {(["know", "love", "body", "taste", "mind"] as const).map((cat) => {
            const items = grouped[cat];
            if (!items || items.length === 0) return null;
            const meta = CATEGORY_META[cat];
            const catDone = items.filter((i) => completed.has(i.id)).length;

            return (
              <div key={cat} style={{ marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: meta.color }}>
                    {meta.label}
                  </span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: textMuted }}>
                    {catDone}/{items.length}
                  </span>
                </div>
                <div style={{ display: "grid", gap: "0.4rem" }}>
                  {items.map((exp) => {
                    const isDone = completed.has(exp.id);
                    const isCurrent = exp.id === currentAssessmentId;

                    return (
                      <div
                        key={exp.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.6rem 0.75rem",
                          borderRadius: "8px",
                          background: isCurrent
                            ? isDark ? "rgba(212,185,106,0.08)" : "rgba(139,105,20,0.06)"
                            : "transparent",
                          border: isCurrent ? `1px solid ${isDark ? "rgba(212,185,106,0.2)" : "rgba(139,105,20,0.15)"}` : "1px solid transparent",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleComplete(exp.id)}
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "4px",
                            border: `2px solid ${isDone ? checkColor : isDark ? "rgba(212,185,106,0.2)" : "rgba(139,105,20,0.2)"}`,
                            background: isDone ? checkColor : "transparent",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transition: "all 0.2s ease",
                            padding: 0,
                          }}
                        >
                          {isDone && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2.5 6L5 8.5L9.5 3.5" stroke={isDark ? "#0A0A10" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <a
                            href={exp.url}
                            target={exp.isExternal ? "_blank" : undefined}
                            rel={exp.isExternal ? "noopener noreferrer" : undefined}
                            style={{
                              textDecoration: isDone ? "line-through" : "none",
                              fontFamily: "'Source Sans 3', sans-serif",
                              fontSize: "0.9rem",
                              color: isDone ? textMuted : (isCurrent ? textPrimary : (isDark ? "rgba(232,228,220,0.7)" : "#333")),
                              transition: "color 0.2s ease",
                            }}
                          >
                            {exp.name}
                          </a>
                        </div>

                        {/* Meta */}
                        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexShrink: 0 }}>
                          {exp.questionCount && (
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.05em", color: textMuted, border: `1px solid ${isDark ? "rgba(212,185,106,0.1)" : "rgba(139,105,20,0.1)"}`, borderRadius: "3px", padding: "1px 5px" }}>
                              {exp.questionCount}Q
                            </span>
                          )}
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", color: textMuted }}>
                            ~{exp.estimatedMinutes}m
                          </span>
                          {exp.isExternal && (
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.45rem", color: textMuted }}>↗</span>
                          )}
                          {isCurrent && (
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.45rem", letterSpacing: "0.1em", textTransform: "uppercase", color: textPrimary, background: isDark ? "rgba(212,185,106,0.1)" : "rgba(139,105,20,0.08)", padding: "1px 6px", borderRadius: "3px" }}>
                              HERE
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
