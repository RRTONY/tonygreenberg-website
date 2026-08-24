/**
 * MEDICINE SEQUENCING PAGE
 * The full spectrum ladder — from gentlest to most profound.
 * Not a recommendation engine. A sequencing compass.
 * "Don't skip rungs on the ladder."
 */

import { useState, useMemo } from "react";
import { Link } from "wouter";
import { MEDICINES } from "./pri/data";

// Complexity levels in order from gentlest to most intense
const COMPLEXITY_ORDER = [
  "Entry",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Clinical Only",
  "Hard Stop",
];

const COMPLEXITY_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  "Entry": {
    bg: "rgba(240, 253, 244, 0.95)",
    border: "#86efac",
    text: "#14532d",
    badge: "#16a34a",
  },
  "Beginner": {
    bg: "rgba(240, 249, 255, 0.95)",
    border: "#7dd3fc",
    text: "#0c4a6e",
    badge: "#0284c7",
  },
  "Intermediate": {
    bg: "rgba(254, 252, 232, 0.95)",
    border: "#fde047",
    text: "#713f12",
    badge: "#ca8a04",
  },
  "Advanced": {
    bg: "rgba(255, 247, 237, 0.95)",
    border: "#fdba74",
    text: "#7c2d12",
    badge: "#ea580c",
  },
  "Clinical Only": {
    bg: "rgba(245, 243, 255, 0.95)",
    border: "#c4b5fd",
    text: "#3b0764",
    badge: "#7c3aed",
  },
  "Hard Stop": {
    bg: "rgba(254, 242, 242, 0.95)",
    border: "#fca5a5",
    text: "#7f1d1d",
    badge: "#dc2626",
  },
};

const COMPLEXITY_DESCRIPTIONS: Record<string, string> = {
  "Entry": "Gentle altered states. No hallucinations. Legal in most places. Ideal starting point for those new to non-ordinary consciousness.",
  "Beginner": "Mild to moderate altered states. Short duration. Relatively forgiving. Some prior experience helpful but not required.",
  "Intermediate": "Significant altered states. 4–12 hours. Prior psychedelic experience strongly recommended. Requires preparation and support.",
  "Advanced": "Profound altered states. Ego dissolution possible. Clinical or experienced facilitation required. Not for the unprepared.",
  "Clinical Only": "Pharmaceutical-grade compounds in FDA-approved or clinical trial settings only. Not available outside supervised medical protocols.",
  "Hard Stop": "NOT psychedelics. Anticholinergic deliriants that produce genuine delirium. No therapeutic application. Listed to protect you.",
};

const SEQUENCING_PHILOSOPHY = `The natural order of the spectrum exists for a reason. Every rung on this ladder builds the nervous system's capacity for the next. You don't go from smoking weed to finding God in an ayahuasca ceremony. You don't skip from kava to ibogaine. The ladder is not a suggestion — it is the accumulated wisdom of every tradition that has worked with these medicines for thousands of years.

This is not a recommendation engine. We are not telling you what to take. We are showing you the natural sequence so you can understand where you are, where you might go next, and what you need to build before you get there.

Half the people who go through this process will realize they're not ready. That is the system working.`;

export default function MedicineSequencing() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Sort medicines by complexity level, then by intensity within each level
  const sortedMedicines = useMemo(() => {
    return [...MEDICINES].sort((a, b) => {
      const aLevel = a.complexityLevel || "Intermediate";
      const bLevel = b.complexityLevel || "Intermediate";
      const aIdx = COMPLEXITY_ORDER.indexOf(aLevel);
      const bIdx = COMPLEXITY_ORDER.indexOf(bLevel);
      if (aIdx !== bIdx) return aIdx - bIdx;
      return a.intensity - b.intensity;
    });
  }, []);

  const filteredMedicines = selectedLevel
    ? sortedMedicines.filter(m => (m.complexityLevel || "Intermediate") === selectedLevel)
    : sortedMedicines;

  // Group by complexity level
  const grouped = useMemo(() => {
    const groups: Record<string, typeof sortedMedicines> = {};
    for (const level of COMPLEXITY_ORDER) {
      groups[level] = filteredMedicines.filter(m => (m.complexityLevel || "Intermediate") === level);
    }
    return groups;
  }, [filteredMedicines]);

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(160deg, #FAFAF7 0%, #FEF3C7 30%, #FFF7ED 60%, #F0FDF4 100%)",
      fontFamily: "'Source Sans 3', 'Georgia', serif",
    } as React.CSSProperties,
    hero: {
      padding: "clamp(2rem, 6vw, 5rem) clamp(1rem, 5vw, 3rem) clamp(1.5rem, 4vw, 3rem)",
      maxWidth: "900px",
      margin: "0 auto",
    } as React.CSSProperties,
    eyebrow: {
      fontSize: "clamp(0.65rem, 2vw, 0.75rem)",
      fontFamily: "'DM Mono', monospace",
      letterSpacing: "0.15em",
      color: "#B45309",
      textTransform: "uppercase" as const,
      marginBottom: "1rem",
    },
    title: {
      fontSize: "clamp(2rem, 6vw, 3.5rem)",
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700,
      color: "#1A1208",
      lineHeight: 1.15,
      marginBottom: "1.25rem",
    } as React.CSSProperties,
    subtitle: {
      fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
      color: "#4A3728",
      lineHeight: 1.7,
      marginBottom: "2rem",
      maxWidth: "700px",
    } as React.CSSProperties,
    philosophyBox: {
      background: "rgba(255,255,255,0.7)",
      border: "1px solid rgba(180,83,9,0.2)",
      borderLeft: "4px solid #B45309",
      borderRadius: "12px",
      padding: "clamp(1rem, 3vw, 1.75rem)",
      marginBottom: "2.5rem",
      backdropFilter: "blur(8px)",
    } as React.CSSProperties,
    philosophyText: {
      fontSize: "clamp(0.9rem, 2vw, 1rem)",
      color: "#3D2B1F",
      lineHeight: 1.8,
      whiteSpace: "pre-line" as const,
    },
    filterRow: {
      display: "flex",
      flexWrap: "wrap" as const,
      gap: "0.5rem",
      marginBottom: "2.5rem",
      padding: "0 clamp(1rem, 5vw, 3rem)",
      maxWidth: "900px",
      margin: "0 auto 2.5rem",
    },
    filterBtn: (level: string, active: boolean) => ({
      padding: "0.4rem 1rem",
      borderRadius: "999px",
      border: `2px solid ${COMPLEXITY_COLORS[level]?.border || "#ccc"}`,
      background: active ? (COMPLEXITY_COLORS[level]?.badge || "#888") : "rgba(255,255,255,0.8)",
      color: active ? "#fff" : (COMPLEXITY_COLORS[level]?.text || "#333"),
      fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s",
      fontFamily: "'DM Mono', monospace",
      letterSpacing: "0.05em",
    } as React.CSSProperties),
    allBtn: (active: boolean) => ({
      padding: "0.4rem 1rem",
      borderRadius: "999px",
      border: "2px solid #B45309",
      background: active ? "#B45309" : "rgba(255,255,255,0.8)",
      color: active ? "#fff" : "#B45309",
      fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s",
      fontFamily: "'DM Mono', monospace",
    } as React.CSSProperties),
    content: {
      maxWidth: "900px",
      margin: "0 auto",
      padding: "0 clamp(1rem, 5vw, 3rem) 4rem",
    } as React.CSSProperties,
    levelSection: {
      marginBottom: "3rem",
    } as React.CSSProperties,
    levelHeader: (level: string) => ({
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      marginBottom: "1rem",
      padding: "1rem 1.25rem",
      background: COMPLEXITY_COLORS[level]?.bg || "rgba(255,255,255,0.8)",
      border: `1px solid ${COMPLEXITY_COLORS[level]?.border || "#ccc"}`,
      borderRadius: "12px",
      backdropFilter: "blur(8px)",
    } as React.CSSProperties),
    levelBadge: (level: string) => ({
      display: "inline-flex",
      alignItems: "center",
      padding: "0.3rem 0.8rem",
      borderRadius: "999px",
      background: COMPLEXITY_COLORS[level]?.badge || "#888",
      color: "#fff",
      fontSize: "clamp(0.7rem, 1.8vw, 0.8rem)",
      fontWeight: 700,
      fontFamily: "'DM Mono', monospace",
      letterSpacing: "0.08em",
      whiteSpace: "nowrap" as const,
    } as React.CSSProperties),
    levelDesc: (level: string) => ({
      fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
      color: COMPLEXITY_COLORS[level]?.text || "#333",
      lineHeight: 1.5,
    } as React.CSSProperties),
    medicineCard: (level: string, expanded: boolean) => ({
      background: expanded ? COMPLEXITY_COLORS[level]?.bg || "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.85)",
      border: `1px solid ${expanded ? (COMPLEXITY_COLORS[level]?.border || "#ccc") : "rgba(0,0,0,0.08)"}`,
      borderRadius: "12px",
      marginBottom: "0.75rem",
      overflow: "hidden",
      transition: "all 0.25s ease",
      backdropFilter: "blur(8px)",
      cursor: "pointer",
    } as React.CSSProperties),
    cardHeader: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      padding: "clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 1.25rem)",
    } as React.CSSProperties,
    cardIcon: {
      fontSize: "clamp(1.5rem, 4vw, 2rem)",
      flexShrink: 0,
    } as React.CSSProperties,
    cardInfo: {
      flex: 1,
      minWidth: 0,
    } as React.CSSProperties,
    cardName: {
      fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
      fontWeight: 700,
      color: "#1A1208",
      fontFamily: "'Playfair Display', Georgia, serif",
      marginBottom: "0.15rem",
    } as React.CSSProperties,
    cardLatin: {
      fontSize: "clamp(0.75rem, 1.8vw, 0.85rem)",
      color: "#7A6050",
      fontStyle: "italic",
    } as React.CSSProperties,
    cardIntensityBar: {
      width: "80px",
      height: "6px",
      background: "rgba(0,0,0,0.1)",
      borderRadius: "3px",
      overflow: "hidden",
      flexShrink: 0,
    } as React.CSSProperties,
    cardExpanded: {
      padding: "0 clamp(1rem, 3vw, 1.25rem) clamp(1rem, 3vw, 1.25rem)",
      borderTop: "1px solid rgba(0,0,0,0.06)",
    } as React.CSSProperties,
    expandedSection: {
      marginBottom: "0.75rem",
    } as React.CSSProperties,
    expandedLabel: {
      fontSize: "0.7rem",
      fontFamily: "'DM Mono', monospace",
      letterSpacing: "0.1em",
      color: "#B45309",
      textTransform: "uppercase" as const,
      marginBottom: "0.25rem",
    },
    expandedText: {
      fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
      color: "#3D2B1F",
      lineHeight: 1.65,
    } as React.CSSProperties,
    justificationBox: {
      background: "rgba(180,83,9,0.06)",
      border: "1px solid rgba(180,83,9,0.2)",
      borderRadius: "8px",
      padding: "0.75rem 1rem",
      marginBottom: "0.75rem",
    } as React.CSSProperties,
    justificationLabel: {
      fontSize: "0.7rem",
      fontFamily: "'DM Mono', monospace",
      letterSpacing: "0.1em",
      color: "#B45309",
      textTransform: "uppercase" as const,
      marginBottom: "0.25rem",
    } as React.CSSProperties,
    justificationText: {
      fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
      color: "#4A3728",
      lineHeight: 1.6,
      fontStyle: "italic",
    } as React.CSSProperties,
    chevron: (expanded: boolean) => ({
      fontSize: "1rem",
      color: "#B45309",
      transition: "transform 0.25s",
      transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
      flexShrink: 0,
    } as React.CSSProperties),
    footer: {
      textAlign: "center" as const,
      padding: "2rem clamp(1rem, 5vw, 3rem) 3rem",
      maxWidth: "700px",
      margin: "0 auto",
    } as React.CSSProperties,
    footerText: {
      fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
      color: "#7A6050",
      lineHeight: 1.7,
      marginBottom: "1.5rem",
    } as React.CSSProperties,
    ctaBtn: {
      display: "inline-block",
      padding: "0.85rem 2rem",
      background: "linear-gradient(135deg, #B45309, #D97706)",
      color: "#fff",
      borderRadius: "8px",
      fontWeight: 700,
      fontSize: "clamp(0.9rem, 2.5vw, 1rem)",
      textDecoration: "none",
      fontFamily: "'Source Sans 3', sans-serif",
    } as React.CSSProperties,
  };

  return (
    <div style={styles.page}>
      {/* Hero */}
      <div style={styles.hero}>
        <p style={styles.eyebrow}>The Spectrum · Know Before You Go</p>
        <h1 style={styles.title}>The Medicine Sequencing Ladder</h1>
        <p style={styles.subtitle}>
          38 medicines. Six rungs. One principle: don't skip the ladder.
          This is not a recommendation. It is a map of the natural order.
        </p>

        <div style={styles.philosophyBox}>
          <p style={styles.philosophyText}>{SEQUENCING_PHILOSOPHY}</p>
        </div>
      </div>

      {/* Filter row */}
      <div style={styles.filterRow}>
        <button style={styles.allBtn(!selectedLevel)} onClick={() => setSelectedLevel(null)}>
          All ({MEDICINES.length})
        </button>
        {COMPLEXITY_ORDER.map(level => {
          const count = sortedMedicines.filter(m => (m.complexityLevel || "Intermediate") === level).length;
          if (count === 0) return null;
          return (
            <button
              key={level}
              style={styles.filterBtn(level, selectedLevel === level)}
              onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
            >
              {level} ({count})
            </button>
          );
        })}
      </div>

      {/* Medicine groups */}
      <div style={styles.content}>
        {COMPLEXITY_ORDER.map(level => {
          const medicines = grouped[level];
          if (!medicines || medicines.length === 0) return null;
          const colors = COMPLEXITY_COLORS[level] || COMPLEXITY_COLORS["Intermediate"];

          return (
            <div key={level} style={styles.levelSection}>
              {/* Level header */}
              <div style={styles.levelHeader(level)}>
                <span style={styles.levelBadge(level)}>{level}</span>
                <p style={styles.levelDesc(level)}>{COMPLEXITY_DESCRIPTIONS[level]}</p>
              </div>

              {/* Medicine cards */}
              {medicines.map(med => {
                const isExpanded = expandedId === med.id;
                return (
                  <div
                    key={med.id}
                    style={styles.medicineCard(level, isExpanded)}
                    onClick={() => setExpandedId(isExpanded ? null : med.id)}
                  >
                    <div style={styles.cardHeader}>
                      <span style={styles.cardIcon}>{med.icon}</span>
                      <div style={styles.cardInfo}>
                        <div style={styles.cardName}>{med.name}</div>
                        <div style={styles.cardLatin}>{med.latin}</div>
                      </div>
                      {/* Intensity bar */}
                      <div style={styles.cardIntensityBar}>
                        <div style={{
                          height: "100%",
                          width: `${med.intensity * 100}%`,
                          background: colors.badge,
                          borderRadius: "3px",
                          transition: "width 0.3s",
                        }} />
                      </div>
                      <span style={styles.chevron(isExpanded)}>▼</span>
                    </div>

                    {isExpanded && (
                      <div style={styles.cardExpanded}>
                        {/* Complexity justification */}
                        {med.complexityJustification && (
                          <div style={styles.justificationBox}>
                            <div style={styles.justificationLabel}>Why this rung</div>
                            <p style={styles.justificationText}>{med.complexityJustification}</p>
                          </div>
                        )}

                        <div style={styles.expandedSection}>
                          <div style={styles.expandedLabel}>Overview</div>
                          <p style={styles.expandedText}>{med.overview}</p>
                        </div>

                        <div style={styles.expandedSection}>
                          <div style={styles.expandedLabel}>Therapeutic Applications</div>
                          <p style={styles.expandedText}>{med.therapeutic}</p>
                        </div>

                        <div style={styles.expandedSection}>
                          <div style={styles.expandedLabel}>Readiness Requirements</div>
                          <p style={styles.expandedText}>{med.readiness}</p>
                        </div>

                        <div style={styles.expandedSection}>
                          <div style={styles.expandedLabel}>Tradition</div>
                          <p style={styles.expandedText}>{med.tradition}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Footer CTA */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Ready to find out where you sit on this ladder?
            The Psychedelic Readiness Index assesses your readiness across six dimensions
            and tells you which medicines match your current profile.
          </p>
          <Link href="/psychedelic-readiness-index" style={styles.ctaBtn}>
            Take the Readiness Index
          </Link>
        </div>
      </div>
    </div>
  );
}
