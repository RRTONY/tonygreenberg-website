/**
 * AssessmentShell — Shared layout wrapper for all assessment pages.
 *
 * Enforces the spacing scale, hierarchy, and grid alignment rules:
 *   Text:      8-16px
 *   Component: 24-32px
 *   Section:   64-96px
 *   Hero:      120px+
 *
 * Primary CTA gets 2x surrounding space.
 * Max content width: 1200px (680px for prose).
 * Line length: 60-75 chars.
 */

import { FadeIn } from "@/components/Editorial";

interface AssessmentShellProps {
  /** Assessment title (H1) */
  title: string;
  /** Short tagline under the title */
  tagline?: string;
  /** Eyebrow text above the title */
  eyebrow?: string;
  /** Stats to show (e.g., "25 Questions", "6 Dimensions") */
  stats?: { label: string; value: string }[];
  /** Primary CTA text */
  ctaText?: string;
  /** Primary CTA handler */
  onCtaClick?: () => void;
  /** Background color override */
  bg?: string;
  /** Text color override */
  textColor?: string;
  /** Accent color override */
  accentColor?: string;
  /** Children rendered below the hero */
  children?: React.ReactNode;
  /** Show hero section (default true) */
  showHero?: boolean;
}

export default function AssessmentShell({
  title,
  tagline,
  eyebrow,
  stats,
  ctaText = "Begin Assessment",
  onCtaClick,
  bg = "#0A0A10",
  textColor = "#E8E4DC",
  accentColor = "#D4B96A",
  children,
  showHero = true,
}: AssessmentShellProps) {
  return (
    <div style={{
      background: bg,
      color: textColor,
      minHeight: "100vh",
      fontFamily: "'Source Sans 3', sans-serif",
    }}>
      {showHero && (
        <section style={{
          textAlign: "center",
          /* Hero: 120px+ top padding */
          padding: "clamp(7.5rem, 12vw, 10rem) 2rem clamp(4rem, 6vw, 6rem)",
          borderBottom: `1px solid ${accentColor}15`,
        }}>
          <FadeIn>
            {/* Eyebrow: 0.72rem DM Mono */}
            {eyebrow && (
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: accentColor,
                marginBottom: "1.5rem",
              }}>
                {eyebrow}
              </div>
            )}

            {/* H1: dominant, clear step from H2 */}
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
              fontWeight: 400,
              color: textColor,
              lineHeight: 1.15,
              marginBottom: "1.5rem",
            }}>
              {title}
            </h1>

            {/* Tagline: 680px max for 60-75 char line length */}
            {tagline && (
              <p style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "1.15rem",
                color: `${textColor}99`,
                lineHeight: 1.8,
                maxWidth: "680px",
                margin: "0 auto",
                fontStyle: "italic",
              }}>
                {tagline}
              </p>
            )}

            {/* Stats row */}
            {stats && stats.length > 0 && (
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "clamp(1.5rem, 3vw, 3rem)",
                marginTop: "2rem",
              }}>
                {stats.map((s) => (
                  <div key={s.label} style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.85rem",
                    color: `${textColor}88`,
                  }}>
                    <span style={{ color: accentColor, fontWeight: 600 }}>{s.value}</span>{" "}
                    {s.label}
                  </div>
                ))}
              </div>
            )}

            {/* Primary CTA: 2x surrounding space (3rem top) */}
            {onCtaClick && (
              <div style={{ marginTop: "3rem" }}>
                <button
                  onClick={onCtaClick}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.85rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    padding: "1rem 2.5rem",
                    background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}CC 100%)`,
                    color: bg,
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  {ctaText}
                </button>
              </div>
            )}
          </FadeIn>
        </section>
      )}

      {/* Content area: max 1200px, section-level padding */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 2rem",
      }}>
        {children}
      </div>
    </div>
  );
}

/**
 * AssessmentQuestion — Standardized question card with proper spacing.
 */
export function AssessmentQuestion({
  questionNumber,
  totalQuestions,
  questionText,
  children,
  accentColor = "#D4B96A",
  textColor = "#E8E4DC",
}: {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  children: React.ReactNode;
  accentColor?: string;
  textColor?: string;
}) {
  return (
    <div style={{
      /* Section-level spacing: 64-96px */
      padding: "clamp(3rem, 6vw, 5rem) 0",
    }}>
      {/* Question counter: eyebrow */}
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.72rem",
        letterSpacing: "0.2em",
        color: accentColor,
        textTransform: "uppercase",
        marginBottom: "1.5rem",
        textAlign: "center",
      }}>
        Question {questionNumber} of {totalQuestions}
      </div>

      {/* Question text: H2 level */}
      <h2 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
        fontWeight: 400,
        color: textColor,
        lineHeight: 1.4,
        textAlign: "center",
        maxWidth: "680px",
        margin: "0 auto 2rem",
      }}>
        {questionText}
      </h2>

      {/* Answer options: component-level spacing (24-32px) */}
      <div style={{
        maxWidth: "680px",
        margin: "0 auto",
      }}>
        {children}
      </div>
    </div>
  );
}

/**
 * AssessmentResult — Standardized result display.
 */
export function AssessmentResult({
  title,
  subtitle,
  children,
  accentColor = "#D4B96A",
  textColor = "#E8E4DC",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  accentColor?: string;
  textColor?: string;
}) {
  return (
    <div style={{
      padding: "clamp(4rem, 6vw, 6rem) 0",
      textAlign: "center",
    }}>
      <FadeIn>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.72rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: accentColor,
          marginBottom: "1.5rem",
        }}>
          Your Results
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 400,
          color: textColor,
          lineHeight: 1.2,
          marginBottom: "1rem",
        }}>
          {title}
        </h1>

        {subtitle && (
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "1.15rem",
            color: `${textColor}99`,
            maxWidth: "680px",
            margin: "0 auto 3rem",
            lineHeight: 1.8,
          }}>
            {subtitle}
          </p>
        )}

        <div style={{ textAlign: "left", maxWidth: "800px", margin: "0 auto" }}>
          {children}
        </div>
      </FadeIn>
    </div>
  );
}
