/**
 * AssessmentProgress — Shows "X of Y assessments complete" progress bar.
 * Uses localStorage to track which assessments the user has completed.
 * Displayed on the FindMyHub page and individual assessment pages.
 */
import { useState, useEffect } from "react";
import { Link } from "wouter";

const STORAGE_KEY = "tg-assessments-completed";

// All available assessments
const ALL_ASSESSMENTS = [
  { slug: "find-your-me", label: "Find My Me" },
  { slug: "find-your-peptide", label: "Find My Peptide" },
  { slug: "find-your-therapy", label: "Find My Therapy" },
  { slug: "find-your-spirit", label: "Find My Spirit" },
  { slug: "find-your-diet", label: "Find My Diet" },
  { slug: "find-your-coffee", label: "Find My Coffee" },
  { slug: "find-your-movement", label: "Find My Movement" },
  { slug: "find-your-sleep", label: "Find My Sleep" },
  { slug: "find-your-religion", label: "Find My Religion" },
  { slug: "find-your-sake", label: "Find My Sake" },
  { slug: "find-your-style", label: "Find My Style" },
  { slug: "find-your-kitchen", label: "Find My Kitchen" },
  { slug: "find-your-attachment-style", label: "Find My Attachment Style" },
  { slug: "find-your-love-language", label: "Find My Love Language" },
  { slug: "find-your-sexuality", label: "Find My Sexuality" },
  { slug: "dharma-finder", label: "Find Your Purpose" },
  { slug: "consciousness-scale", label: "Consciousness Scale" },
  { slug: "grant-study", label: "Grant Study Score" },
  { slug: "find-your-ev", label: "Find My Car" },
];

export function getCompletedAssessments(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function markAssessmentComplete(slug: string) {
  const completed = getCompletedAssessments();
  if (!completed.includes(slug)) {
    completed.push(slug);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  }
}

/**
 * Progress bar for the FindMyHub page — shows overall progress.
 */
export function AssessmentProgressBar() {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    setCompleted(getCompletedAssessments());
  }, []);

  const total = ALL_ASSESSMENTS.length;
  const done = completed.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  if (done === 0) return null;

  return (
    <div
      style={{
        maxWidth: "680px",
        margin: "0 auto 2rem",
        padding: "1rem 1.5rem",
        border: "1px solid rgba(212,185,106,0.2)",
        borderRadius: "6px",
        background: "rgba(212,185,106,0.03)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
            color: "#8B6914",
          }}
        >
          Your Progress
        </span>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            color: "#999",
          }}
        >
          {done} of {total} complete
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: "100%",
          height: "6px",
          background: "rgba(0,0,0,0.06)",
          borderRadius: "3px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "linear-gradient(90deg, #8B6914, #D4B96A)",
            borderRadius: "3px",
            transition: "width 0.5s ease",
          }}
        />
      </div>

      {done >= 5 && (
        <Link
          href="/self-portrait"
          style={{
            display: "inline-block",
            marginTop: "0.6rem",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.68rem",
            letterSpacing: "0.08em",
            color: "#8B6914",
            textDecoration: "none",
          }}
        >
          Self-Portrait unlocked → View your composite map
        </Link>
      )}
    </div>
  );
}

/**
 * Inline progress indicator for individual assessment pages.
 * Shows which assessment this is in the sequence.
 */
export function AssessmentInlineProgress({ currentSlug }: { currentSlug: string }) {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    setCompleted(getCompletedAssessments());
  }, []);

  const total = ALL_ASSESSMENTS.length;
  const done = completed.length;
  const isCurrent = completed.includes(currentSlug);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        padding: "0.5rem 0",
        marginBottom: "0.5rem",
      }}
    >
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.08em",
          color: "#999",
        }}
      >
        {isCurrent ? "✓ Completed" : `${done} of ${total} assessments complete`}
      </div>

      {/* Mini dots */}
      <div style={{ display: "flex", gap: "3px" }}>
        {ALL_ASSESSMENTS.slice(0, 10).map((a) => (
          <div
            key={a.slug}
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: completed.includes(a.slug)
                ? "#D4B96A"
                : a.slug === currentSlug
                  ? "#8B6914"
                  : "rgba(0,0,0,0.1)",
              transition: "background 0.3s",
            }}
          />
        ))}
        {total > 10 && (
          <span style={{ fontSize: "0.5rem", color: "#ccc", lineHeight: 1 }}>+{total - 10}</span>
        )}
      </div>
    </div>
  );
}
