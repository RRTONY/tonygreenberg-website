/**
 * ECOSYSTEM MAP — The Full Journey
 * 
 * A visual sitemap of the entire Find Your ___ ecosystem.
 * Shows the recommended sequence, progress tracking,
 * and how everything connects.
 * 
 * Design: Dark editorial broadsheet with sacred geometry undertones.
 * Same aesthetic as Find Your Me — parchment/gold/dark.
 */

import { useState, useMemo } from "react";
import { Link } from "wouter";
import JourneyTracker, { useJourneyProgress, JOURNEY_MAP } from "@/components/JourneyTracker";
import SEO from "@/components/SEO";

/* ── RECOMMENDED JOURNEY SEQUENCE ── */
const JOURNEY_PHASES = [
  {
    phase: 1,
    title: "The Foundation",
    subtitle: "Who are you when nobody's watching?",
    description: "Start with the core assessments that map your inner landscape. These create the baseline everything else builds on.",
    experiences: [
      { id: "find-your-me", name: "Find Your Me", time: "3 min", description: "The entry point. Five dimensions of self-discovery that set the compass for everything that follows." },
      { id: "find-your-mirror", name: "Find Your Mirror", time: "10 min", description: "Eighteen questions mapping where you actually are in life — not where you think you should be." },
      { id: "find-your-purpose", name: "Find Your Purpose", time: "12 min", description: "The Dharma Finder. Twenty-five questions that reveal the work you were built for." },
    ],
  },
  {
    phase: 2,
    title: "The Depths",
    subtitle: "How deep does the rabbit hole go?",
    description: "Now that you know the terrain, go deeper. These assessments reveal the operating system underneath your personality.",
    experiences: [
      { id: "find-your-level", name: "Find Your Level", time: "12 min", description: "The Consciousness Scale. Where are you on the spectrum from survival to transcendence?" },
      { id: "find-your-score", name: "Find Your Score", time: "12 min", description: "The Grant Study assessment. Harvard's 75-year study of what actually makes a good life." },
      { id: "find-your-spirit", name: "Find Your Spirit", time: "18 min", description: "Thirty-five questions mapping your spiritual architecture — tradition, mysticism, or none of the above." },
    ],
  },
  {
    phase: 3,
    title: "The Healing",
    subtitle: "The body keeps the score. Time to read it.",
    description: "Turn inward to the physical. Your chemistry, your water, your therapy modality — the infrastructure of wellness.",
    experiences: [
      { id: "find-your-therapy", name: "Find Your Therapy", time: "12 min", description: "CBT, IFS, somatic, psychedelic-assisted — matched to your wiring, not a waitlist." },
      { id: "find-your-chemistry", name: "Find Your Chemistry", time: "8 min", description: "Biomarkers, bloodwork, regenerative protocols. The science of your specific body." },
      { id: "find-your-water", name: "Find Your Water", time: "5 min", description: "Mineral content, pH, source — the most fundamental thing you put in your body." },
    ],
  },
  {
    phase: 4,
    title: "The Connections",
    subtitle: "No one finds themselves alone.",
    description: "Relationships, teams, tribes. The people who reflect you back to yourself and the systems that hold you.",
    experiences: [
      { id: "find-your-partner", name: "Find Your Partner", time: "10 min", description: "Attachment style, love language, values alignment. The intimacy assessment." },
      { id: "find-your-team", name: "Find Your Team", time: "8 min", description: "Flow Circuit. How you collaborate, lead, and create with others." },
      { id: "find-your-tribe", name: "Find Your Tribe", time: "5 min", description: "The community that gets it. Where you belong without performing." },
      { id: "find-your-religion", name: "Find Your Religion", time: "20 min", description: "Not which one is right. Which one is yours — or none at all. 20 questions mapping your worldview to 8 spiritual archetypes." },
    ],
  },
  {
    phase: 5,
    title: "The Rituals",
    subtitle: "What you consume consumes you.",
    description: "The daily practices, the things you drink, the food that feeds who you actually are. Ritual as self-knowledge.",
    experiences: [
      { id: "find-your-mezcal", name: "Find Your Mezcal", time: "5 min", description: "The agave that matches your soul — not your Instagram." },
      { id: "find-your-tequila", name: "Find Your Tequila", time: "5 min", description: "Highland or lowland. Blanco or añejo. A love letter in liquid form." },
      { id: "find-your-sake", name: "Find Your Sake", time: "8 min", description: "Rice, water, koji, time. The most honest drink on earth." },
    ],
  },
  {
    phase: 6,
    title: "The Systems",
    subtitle: "Now build the architecture for what comes next.",
    description: "With self-knowledge as foundation, design the systems — financial, operational, strategic — that align with who you actually are.",
    experiences: [
      { id: "find-your-blueprint", name: "Find Your Blueprint", time: "8 min", description: "The operating system for what comes after extraction." },
      { id: "find-your-capital", name: "Find Your Capital", time: "5 min", description: "How aligned money actually moves." },
    ],
  },
];

/* ── Phase colors ── */
const PHASE_COLORS = ["#D4B96A", "#C97B7B", "#7BC9A4", "#C9A87B", "#7BA8C9", "#B97BD4"];

export default function EcosystemMap() {
  const { completed, stats, markComplete } = useJourneyProgress();
  const totalExperiences = stats.total;
  const completedCount = stats.done;
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const progressPct = Math.round((completedCount / totalExperiences) * 100);

  /* Find the next recommended experience */
  const nextRecommended = useMemo(() => {
    for (const phase of JOURNEY_PHASES) {
      for (const exp of phase.experiences) {
        if (!completed.has(exp.id)) return exp;
      }
    }
    return null;
  }, [completed]);

  return (
    <>
    <SEO
        title="The Ecosystem Map"
        description="Tony Greenberg's map of the regenerative economy — companies, people, and movements building what comes after extraction."
        path="/ecosystem-map"
        keywords="Tony Greenberg, regenerative economy, impact investing, conscious capitalism"
        indexable={true}
      />
      <div
      style={{
        minHeight: "100vh",
        background: "#0A0A10",
        color: "#F5F0E0",
        fontFamily: "'Source Sans 3', sans-serif",
      }}
    >
      {/* ── HEADER ── */}
      <header
        style={{
          padding: "2rem 1.5rem 1rem",
          borderBottom: "1px solid rgba(212,185,106,0.1)",
        }}
      >
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "0 auto" }}>
          <Link
            href="/find-your-me"
            className="no-underline"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.2rem",
              color: "#D4B96A",
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
          >
            Find Your Me
          </Link>
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <Link
              href="/find-your-me"
              className="no-underline"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "#888",
                textDecoration: "none",
              }}
            >
              Back to Portal
            </Link>
            <Link
              href="/"
              className="no-underline"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "#888",
                textDecoration: "none",
              }}
            >
              TonyG Home
            </Link>
          </div>
        </nav>
      </header>

      {/* ── HERO ── */}
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "4rem 1.5rem 2rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase" as const,
            color: "#D4B96A",
            marginBottom: "1.5rem",
          }}
        >
          The Ecosystem Map
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 400,
            lineHeight: 1.15,
            margin: "0 0 1.5rem",
            color: "#F5F0E0",
          }}
        >
          Your Journey Through<br />
          <span style={{ color: "#D4B96A", fontStyle: "italic" }}>Self-Discovery</span>
        </h1>
        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "1.1rem",
            lineHeight: 1.7,
            color: "#999",
            maxWidth: "600px",
            margin: "0 auto 2rem",
          }}
        >
          {totalExperiences} experiences across 6 phases. Each one reveals
          a different facet. Together, they build a comprehensive
          map of who you actually are.
        </p>

        {/* Progress bar */}
        <div style={{ maxWidth: "500px", margin: "0 auto 1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#888", letterSpacing: "0.05em" }}>
              {completedCount} of {totalExperiences} completed
            </span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#D4B96A", letterSpacing: "0.05em" }}>
              {progressPct}%
            </span>
          </div>
          <div style={{ height: "4px", background: "rgba(212,185,106,0.1)", borderRadius: "2px", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${progressPct}%`,
                background: "linear-gradient(90deg, #8B6914, #D4B96A)",
                borderRadius: "2px",
                transition: "width 0.6s ease",
              }}
            />
          </div>
        </div>

        {/* Next recommended */}
        {nextRecommended && (
          <div style={{ marginTop: "1.5rem" }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#666", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
              Recommended Next:
            </span>
            {(() => {
              const exp = JOURNEY_MAP.find(e => e.id === nextRecommended.id);
              if (!exp) return null;
              const isExt = exp.isExternal;
              if (isExt) {
                return (
                  <a
                    href={exp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline"
                    style={{
                      display: "inline-block",
                      marginLeft: "0.5rem",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.7rem",
                      letterSpacing: "0.05em",
                      color: "#D4B96A",
                      textDecoration: "none",
                      borderBottom: "1px solid rgba(212,185,106,0.3)",
                      paddingBottom: "1px",
                    }}
                  >
                    {nextRecommended.name} ({nextRecommended.time}) →
                  </a>
                );
              }
              return (
                <Link
                  href={exp.url}
                  className="no-underline"
                  style={{
                    display: "inline-block",
                    marginLeft: "0.5rem",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.7rem",
                    letterSpacing: "0.05em",
                    color: "#D4B96A",
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(212,185,106,0.3)",
                    paddingBottom: "1px",
                  }}
                >
                  {nextRecommended.name} ({nextRecommended.time}) →
                </Link>
              );
            })()}
          </div>
        )}
      </section>

      {/* ── JOURNEY PHASES ── */}
      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        {JOURNEY_PHASES.map((phase, pi) => {
          const phaseColor = PHASE_COLORS[pi];
          const phaseCompleted = phase.experiences.filter(e => completed.has(e.id)).length;
          const phaseTotal = phase.experiences.length;
          const phasePct = Math.round((phaseCompleted / phaseTotal) * 100);
          const isExpanded = expandedPhase === pi || expandedPhase === null;

          return (
            <div
              key={phase.phase}
              style={{
                marginBottom: "2rem",
                border: `1px solid ${phaseColor}22`,
                borderRadius: "12px",
                overflow: "hidden",
                background: "rgba(255,255,255,0.02)",
                transition: "all 0.3s ease",
              }}
            >
              {/* Phase header */}
              <button
                onClick={() => setExpandedPhase(expandedPhase === pi ? null : pi)}
                style={{
                  width: "100%",
                  padding: "1.5rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                }}
              >
                {/* Phase number */}
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "2rem",
                    fontWeight: 300,
                    color: phaseColor,
                    lineHeight: 1,
                    minWidth: "2.5rem",
                    opacity: 0.6,
                  }}
                >
                  {String(phase.phase).padStart(2, "0")}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                    <h2
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.3rem",
                        fontWeight: 400,
                        color: "#F5F0E0",
                        margin: 0,
                      }}
                    >
                      {phase.title}
                    </h2>
                    {phasePct === 100 && (
                      <span style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.55rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase" as const,
                        background: `${phaseColor}22`,
                        color: phaseColor,
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}>
                        Complete
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "0.95rem",
                      fontStyle: "italic",
                      color: "#888",
                    }}
                  >
                    {phase.subtitle}
                  </div>

                  {/* Phase progress */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.75rem" }}>
                    <div style={{ flex: 1, height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden", maxWidth: "200px" }}>
                      <div style={{ height: "100%", width: `${phasePct}%`, background: phaseColor, borderRadius: "2px", transition: "width 0.4s" }} />
                    </div>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#666" }}>
                      {phaseCompleted}/{phaseTotal}
                    </span>
                  </div>
                </div>

                {/* Expand/collapse indicator */}
                <div style={{ color: "#666", fontSize: "1.2rem", transition: "transform 0.2s", transform: isExpanded ? "rotate(0)" : "rotate(-90deg)" }}>
                  ▾
                </div>
              </button>

              {/* Phase content */}
              {isExpanded && (
                <div style={{ padding: "0 1.5rem 1.5rem" }}>
                  <p
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "0.9rem",
                      lineHeight: 1.7,
                      color: "#777",
                      margin: "0 0 1.25rem 3.5rem",
                    }}
                  >
                    {phase.description}
                  </p>

                  {/* Experience cards */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginLeft: "3.5rem" }}>
                    {phase.experiences.map((exp) => {
                      const isDone = completed.has(exp.id);
                      const journeyExp = JOURNEY_MAP.find(e => e.id === exp.id);
                      const isExt = journeyExp?.isExternal;
                      const url = journeyExp?.url || "#";

                      const cardContent = (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "1rem",
                            padding: "1rem 1.25rem",
                            background: isDone ? `${phaseColor}08` : "rgba(255,255,255,0.02)",
                            border: `1px solid ${isDone ? phaseColor + "33" : "rgba(255,255,255,0.05)"}`,
                            borderRadius: "8px",
                            transition: "all 0.2s",
                            cursor: "pointer",
                          }}
                        >
                          {/* Completion indicator */}
                          <div
                            style={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              border: `2px solid ${isDone ? phaseColor : "rgba(255,255,255,0.15)"}`,
                              background: isDone ? phaseColor : "transparent",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              marginTop: "2px",
                              transition: "all 0.3s",
                            }}
                          >
                            {isDone && <span style={{ color: "#0A0A10", fontSize: "0.65rem", fontWeight: 700 }}>✓</span>}
                          </div>

                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                              <span
                                style={{
                                  fontFamily: "'DM Mono', monospace",
                                  fontSize: "0.75rem",
                                  fontWeight: 600,
                                  letterSpacing: "0.03em",
                                  color: isDone ? phaseColor : "#F5F0E0",
                                  textDecoration: isDone ? "line-through" : "none",
                                  opacity: isDone ? 0.7 : 1,
                                }}
                              >
                                {exp.name}
                              </span>
                              {isExt && (
                                <span style={{ fontSize: "0.55rem", color: "#666" }}>↗</span>
                              )}
                            </div>
                            <p
                              style={{
                                fontFamily: "'Source Sans 3', sans-serif",
                                fontSize: "0.82rem",
                                lineHeight: 1.5,
                                color: "#777",
                                margin: 0,
                              }}
                            >
                              {exp.description}
                            </p>
                          </div>

                          {/* Time estimate */}
                          <div
                            style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "0.6rem",
                              color: "#666",
                              letterSpacing: "0.05em",
                              whiteSpace: "nowrap",
                              marginTop: "2px",
                            }}
                          >
                            {exp.time}
                          </div>
                        </div>
                      );

                      if (isExt) {
                        return (
                          <a
                            key={exp.id}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="no-underline"
                            style={{ textDecoration: "none" }}
                          >
                            {cardContent}
                          </a>
                        );
                      }

                      return (
                        <Link
                          key={exp.id}
                          href={url}
                          className="no-underline"
                          style={{ textDecoration: "none" }}
                        >
                          {cardContent}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* ── JOURNEY TRACKER ── */}
      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "0 1.5rem 3rem" }}>
        <JourneyTracker variant="dark" />
      </section>

      {/* ── TOTAL TIME ESTIMATE ── */}
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "3rem 1.5rem",
          borderTop: "1px solid rgba(212,185,106,0.1)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase" as const,
            color: "#666",
            marginBottom: "1rem",
          }}
        >
          Total Journey Estimate
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "3rem",
            flexWrap: "wrap",
          }}
        >
          {[
            { num: totalExperiences.toString(), label: "Experiences" },
            { num: "6", label: "Phases" },
            { num: "~2.5", label: "Hours Total" },
            { num: "5", label: "Categories" },
          ].map((s) => (
            <div key={s.label}>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2rem",
                  fontWeight: 300,
                  color: "#D4B96A",
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "#666",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "3rem 1.5rem 5rem",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.8rem",
            fontWeight: 400,
            color: "#F5F0E0",
            margin: "0 0 1rem",
          }}
        >
          Ready to begin?
        </h2>
        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "1rem",
            color: "#888",
            marginBottom: "2rem",
          }}
        >
          Start anywhere. The journey meets you
          where you are.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          {nextRecommended ? (
            (() => {
              const exp = JOURNEY_MAP.find(e => e.id === nextRecommended.id);
              if (!exp) return null;
              if (exp.isExternal) {
                return (
                  <a
                    href={exp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline"
                    style={{
                      display: "inline-block",
                      padding: "0.85rem 2.5rem",
                      background: "linear-gradient(135deg, #8B6914 0%, #D4B96A 100%)",
                      color: "#0A0A10",
                      borderRadius: "8px",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.72rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase" as const,
                      textDecoration: "none",
                      fontWeight: 700,
                    }}
                  >
                    Continue: {nextRecommended.name} →
                  </a>
                );
              }
              return (
                <Link
                  href={exp.url}
                  className="no-underline"
                  style={{
                    display: "inline-block",
                    padding: "0.85rem 2.5rem",
                    background: "linear-gradient(135deg, #8B6914 0%, #D4B96A 100%)",
                    color: "#0A0A10",
                    borderRadius: "8px",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.72rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  Continue: {nextRecommended.name} →
                </Link>
              );
            })()
          ) : (
            <div
              style={{
                padding: "0.85rem 2.5rem",
                background: "linear-gradient(135deg, #8B6914 0%, #D4B96A 100%)",
                color: "#0A0A10",
                borderRadius: "8px",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                fontWeight: 700,
              }}
            >
              Journey Complete ✓
            </div>
          )}
          <Link
            href="/find-your-me"
            className="no-underline"
            style={{
              display: "inline-block",
              padding: "0.85rem 2.5rem",
              border: "1px solid rgba(212,185,106,0.3)",
              color: "#D4B96A",
              borderRadius: "8px",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Back to Portal
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid rgba(212,185,106,0.08)",
          padding: "2rem 1.5rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "0.9rem",
            fontStyle: "italic",
            color: "#555",
            marginBottom: "0.5rem",
          }}
        >
          The resistance is the roadmap.
        </div>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
            color: "#444",
          }}
        >
          Part of the Find Your Me Ecosystem by Tony Greenberg
        </div>
      </footer>
    </div>
    </>);
}
