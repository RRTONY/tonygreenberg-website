/**
 * /skippy — Skippy's Personalized Journey Map
 *
 * A visual "site compass" showing every major tentacle of the site.
 * Skippy can check off each stop as he goes, with the PRI + Facilitator Index
 * as the featured path. State persists in localStorage.
 */

import { useState, useEffect } from "react";

// ── Journey data ──────────────────────────────────────────────────────────────

interface Stop {
  id: string;
  label: string;
  url: string;
  description: string;
  time: string; // estimated time
  featured?: boolean;
  isStart?: boolean;
}

interface Tentacle {
  id: string;
  title: string;
  emoji: string;
  color: string;
  accent: string;
  stops: Stop[];
}

const TENTACLES: Tentacle[] = [
  {
    id: "featured",
    title: "START HERE — Your Featured Path",
    emoji: "🌟",
    color: "linear-gradient(135deg, #B45309 0%, #D97706 50%, #F59E0B 100%)",
    accent: "#B45309",
    stops: [
      {
        id: "start-here",
        label: "Start Here",
        url: "/start-here",
        description: "5 foundational essays that define the worldview. Your orientation.",
        time: "20 min",
        isStart: true,
      },
      {
        id: "pri",
        label: "Psychedelic Readiness Index",
        url: "/psychedelic-readiness-index",
        description: "The most rigorous self-assessment in the field. Are you ready?",
        time: "25–45 min",
        featured: true,
      },
      {
        id: "facilitator-index",
        label: "Facilitator Index",
        url: "/facilitator-index",
        description: "108 items. 12 bands. Find your archetype as a guide. The newest upgraded version — you're among the first 160.",
        time: "30–60 min",
        featured: true,
      },
      {
        id: "friend-gate",
        label: "Three Friends Permission Gate",
        url: "/friend-gate",
        description: "Before you go deeper — get permission from three people who know you. This is the gate.",
        time: "5 min + 72h wait",
        featured: true,
      },
      {
        id: "post-intervention",
        label: "Post-Intervention Assessment",
        url: "/post-intervention",
        description: "After the ceremony, the real work begins. Return here at Day 1, Day 3, or Day 7 to send anonymous feedback to your facilitator. Your honesty makes the field safer for everyone.",
        time: "10 min · choose your day",
        featured: true,
      },
    ],
  },
  {
    id: "mind",
    title: "The Mind",
    emoji: "🧠",
    color: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
    accent: "#4F46E5",
    stops: [
      { id: "essays", label: "Essays", url: "/essays", description: "119 essays on systems, trust, capital, and consciousness.", time: "∞" },
      { id: "the-index", label: "The Index", url: "/the-index", description: "Searchable idea database across all essays.", time: "10 min" },
      { id: "series", label: "Series", url: "/series", description: "Multi-part deep dives on specific themes.", time: "varies" },
      { id: "manifesto", label: "Living Declaration", url: "/living-declaration", description: "The manifesto. What Tony stands for.", time: "5 min" },
      { id: "thought-cloud", label: "Thought Cloud", url: "/thought-cloud", description: "10 magic prompts showing what the ecosystem does.", time: "10 min" },
    ],
  },
  {
    id: "consciousness",
    title: "Consciousness & Medicine",
    emoji: "🍄",
    color: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
    accent: "#059669",
    stops: [
      { id: "pri-research", label: "PRI Research", url: "/pri-research", description: "The science behind the Psychedelic Readiness Index.", time: "15 min" },
      { id: "pri-calibration", label: "PRI Calibration", url: "/pri-calibration", description: "How the instrument was calibrated.", time: "10 min" },
      { id: "peyote-mescaline", label: "Peyote & Mescaline Deep Dive", url: "/peyote-mescaline", description: "Everything you need to know.", time: "20 min" },
      { id: "iboga-ibogaine", label: "Iboga & Ibogaine", url: "/iboga-ibogaine", description: "The most powerful and dangerous medicine.", time: "20 min" },
      { id: "iboga-compass", label: "Iboga Compass Assessment", url: "/iboga-compass", description: "Are you a candidate for ibogaine therapy?", time: "15 min" },
      { id: "consciousness-scale", label: "Consciousness Scale", url: "/consciousness-scale", description: "Where do you sit on the Hawkins map?", time: "10 min" },
    ],
  },
  {
    id: "self",
    title: "Know Yourself",
    emoji: "🪞",
    color: "linear-gradient(135deg, #DB2777 0%, #EC4899 100%)",
    accent: "#DB2777",
    stops: [
      { id: "dharma-finder", label: "Dharma Finder", url: "/dharma-finder", description: "What is your purpose? Find it here.", time: "15 min" },
      { id: "self-portrait", label: "Self Portrait", url: "/self-portrait", description: "A mirror. Who are you, really?", time: "10 min" },
      { id: "life-assessment", label: "Life Assessment", url: "/life-assessment", description: "Where are you in the arc of your life?", time: "15 min" },
      { id: "soulscore", label: "Soul Score", url: "/soulscore", description: "Your soul's current operating frequency.", time: "10 min" },
      { id: "find-your-me", label: "Find Your Me", url: "/find-your-me", description: "The full self-discovery suite.", time: "varies" },
      { id: "grant-study", label: "Grant Study", url: "/grant-study", description: "Harvard's 80-year study on what makes a good life.", time: "15 min" },
    ],
  },
  {
    id: "capital",
    title: "Capital & Impact",
    emoji: "💎",
    color: "linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)",
    accent: "#0369A1",
    stops: [
      { id: "intel", label: "Intel", url: "/intel", description: "Portfolio intelligence — 9 companies, live news.", time: "15 min" },
      { id: "impact-dashboard", label: "Impact Dashboard", url: "/impact-dashboard", description: "Measuring what matters.", time: "10 min" },
      { id: "invest", label: "Invest", url: "/invest", description: "How to align capital with conscience.", time: "10 min" },
      { id: "thesis-threads", label: "Thesis Threads", url: "/thesis-threads", description: "The investment theses behind the portfolio.", time: "15 min" },
      { id: "charity-scorecard", label: "Charity Scorecard", url: "/charity-scorecard", description: "Which charities actually move the needle?", time: "10 min" },
    ],
  },
  {
    id: "body",
    title: "The Body",
    emoji: "⚗️",
    color: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)",
    accent: "#92400E",
    stops: [
      { id: "peptide-library", label: "Peptide Library", url: "/peptide-library", description: "The most comprehensive peptide reference available.", time: "varies" },
      { id: "find-your-peptide", label: "Find Your Peptide", url: "/find-your-peptide", description: "Which peptides are right for you?", time: "10 min" },
      { id: "peptide-matrix", label: "Peptide Matrix", url: "/peptide-matrix", description: "The full protocol matrix.", time: "15 min" },
      { id: "verify-your-coa", label: "Verify Your COA", url: "/verify-your-coa", description: "Is your peptide source legitimate?", time: "5 min" },
      { id: "the-body", label: "The Body", url: "/the-body", description: "Tony's personal health philosophy.", time: "10 min" },
    ],
  },
  {
    id: "coffee",
    title: "BrewSoul",
    emoji: "☕",
    color: "linear-gradient(135deg, #78350F 0%, #92400E 100%)",
    accent: "#78350F",
    stops: [
      { id: "brewsoul", label: "BrewSoul Home", url: "/brewsoul", description: "Coffee as consciousness. The full universe.", time: "varies" },
      { id: "brewsoul-quiz", label: "Coffee Quiz", url: "/brewsoul/quiz", description: "Find your perfect cup.", time: "5 min" },
      { id: "brewsoul-health", label: "Coffee & Health", url: "/brewsoul/health", description: "The science of coffee and your body.", time: "15 min" },
      { id: "brewsoul-prescription", label: "Your Prescription", url: "/brewsoul/prescription", description: "A personalized coffee prescription.", time: "10 min" },
    ],
  },
  {
    id: "kava",
    title: "Kava Encyclopedia",
    emoji: "🌿",
    color: "linear-gradient(135deg, #065F46 0%, #059669 100%)",
    accent: "#065F46",
    stops: [
      { id: "kava", label: "Kava Home", url: "/kava", description: "The world's most complete kava reference.", time: "varies" },
      { id: "kava-science", label: "Kava Science", url: "/kava/science", description: "The pharmacology and research.", time: "15 min" },
      { id: "kava-assessment", label: "Kava Assessment", url: "/kava/assessment", description: "Is kava right for you?", time: "10 min" },
    ],
  },
  {
    id: "ecosystem",
    title: "The Ecosystem",
    emoji: "🌐",
    color: "linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%)",
    accent: "#6D28D9",
    stops: [
      { id: "about", label: "About Tony", url: "/about", description: "The story. 25 years. $24B+. What drives him.", time: "10 min" },
      { id: "ecosystem", label: "Join the Ecosystem", url: "/ecosystem", description: "Observer, Contributor, Investor, Partner, Curator.", time: "10 min" },
      { id: "community", label: "Community", url: "/community", description: "The people building what comes next.", time: "10 min" },
      { id: "clients", label: "Clients", url: "/clients", description: "Microsoft, Disney, Goldman Sachs, Nike, and hundreds more.", time: "10 min" },
      { id: "humanos", label: "Humanos", url: "/humanos", description: "The human-first technology philosophy.", time: "15 min" },
    ],
  },
  {
    id: "attention",
    title: "Attention & Accountability",
    emoji: "🔍",
    color: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
    accent: "#DC2626",
    stops: [
      { id: "attention-theft", label: "Attention Theft", url: "/attention-theft", description: "Who is stealing your attention and how.", time: "15 min" },
      { id: "cheshire-grin", label: "Cheshire Grin", url: "/cheshire-grin", description: "The accountability project.", time: "10 min" },
      { id: "protecting-your-business", label: "Protecting Your Business", url: "/protecting-your-business", description: "Defense against predatory vendors.", time: "15 min" },
    ],
  },
];

// ── Storage key ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "skippy-journey-progress";

// ── Styles ────────────────────────────────────────────────────────────────────

const S = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #FEFCE8 0%, #FEF3C7 25%, #FDE68A 50%, #FEF9EE 75%, #FEFCE8 100%)",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    padding: "0 0 4rem",
  },
  hero: {
    background: "linear-gradient(135deg, #1A1208 0%, #2D1B00 50%, #1A1208 100%)",
    padding: "3rem 1.5rem 2.5rem",
    textAlign: "center" as const,
    position: "relative" as const,
    overflow: "hidden" as const,
  },
  heroGlow: {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    height: "300px",
    background: "radial-gradient(ellipse, rgba(217,119,6,.25) 0%, transparent 70%)",
    pointerEvents: "none" as const,
  },
  heroEyebrow: {
    fontSize: "11px",
    letterSpacing: ".25em",
    textTransform: "uppercase" as const,
    color: "#D97706",
    marginBottom: ".75rem",
    position: "relative" as const,
  },
  heroTitle: {
    fontSize: "clamp(2rem, 6vw, 3.5rem)",
    fontWeight: 700,
    color: "#FEFCE8",
    margin: "0 0 .5rem",
    lineHeight: 1.15,
    position: "relative" as const,
  },
  heroSub: {
    fontSize: "clamp(14px, 2.5vw, 17px)",
    color: "rgba(254,252,232,.65)",
    lineHeight: 1.7,
    maxWidth: "560px",
    margin: "0 auto 1.5rem",
    position: "relative" as const,
  },
  statsRow: {
    display: "flex",
    justifyContent: "center",
    gap: "2rem",
    flexWrap: "wrap" as const,
    position: "relative" as const,
  },
  stat: {
    textAlign: "center" as const,
  },
  statNum: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#F59E0B",
    lineHeight: 1,
  },
  statLabel: {
    fontSize: "11px",
    color: "rgba(254,252,232,.5)",
    letterSpacing: ".08em",
    textTransform: "uppercase" as const,
    marginTop: ".2rem",
  },
  progressBar: {
    height: "6px",
    background: "rgba(217,119,6,.2)",
    borderRadius: "3px",
    overflow: "hidden" as const,
    margin: "1.5rem auto 0",
    maxWidth: "400px",
    position: "relative" as const,
  },
  progressFill: (pct: number) => ({
    height: "100%",
    width: `${pct}%`,
    background: "linear-gradient(90deg, #D97706, #F59E0B)",
    borderRadius: "3px",
    transition: "width .5s ease",
  }),
  body: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem 1.5rem",
  },
  sectionTitle: {
    fontSize: "11px",
    letterSpacing: ".2em",
    textTransform: "uppercase" as const,
    color: "#B45309",
    textAlign: "center" as const,
    marginBottom: "2rem",
  },
  tentacleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "1.5rem",
  },
  card: (accent: string, completed: boolean) => ({
    background: completed ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.88)",
    borderRadius: "16px",
    border: `2px solid ${completed ? accent : "rgba(217,119,6,.15)"}`,
    overflow: "hidden" as const,
    boxShadow: completed
      ? `0 4px 24px ${accent}22`
      : "0 2px 12px rgba(180,83,9,.06)",
    transition: "all .3s",
  }),
  cardHeader: (gradient: string) => ({
    background: gradient,
    padding: "1rem 1.25rem",
    display: "flex",
    alignItems: "center",
    gap: ".75rem",
  }),
  cardEmoji: {
    fontSize: "1.5rem",
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#fff",
    letterSpacing: ".04em",
    textTransform: "uppercase" as const,
    lineHeight: 1.3,
  },
  cardBody: {
    padding: "1rem 1.25rem",
  },
  stopRow: (checked: boolean, featured: boolean) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: ".75rem",
    padding: ".65rem .75rem",
    borderRadius: "10px",
    marginBottom: ".4rem",
    background: checked
      ? "rgba(16,185,129,.08)"
      : featured
      ? "rgba(217,119,6,.06)"
      : "transparent",
    border: featured && !checked ? "1px solid rgba(217,119,6,.2)" : "1px solid transparent",
    cursor: "pointer",
    transition: "all .2s",
  }),
  checkbox: (checked: boolean, accent: string) => ({
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: `2px solid ${checked ? "#10B981" : accent}`,
    background: checked ? "#10B981" : "transparent",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "2px",
    transition: "all .2s",
    cursor: "pointer",
  }),
  checkmark: {
    color: "#fff",
    fontSize: "11px",
    fontWeight: 700,
    lineHeight: 1,
  },
  stopContent: {
    flex: 1,
    minWidth: 0,
  },
  stopLabel: (checked: boolean, featured: boolean) => ({
    fontSize: "14px",
    fontWeight: featured ? 700 : 600,
    color: checked ? "#059669" : "#1A1208",
    textDecoration: checked ? "line-through" : "none",
    lineHeight: 1.3,
  }),
  stopDesc: {
    fontSize: "12px",
    color: "rgba(26,18,8,.55)",
    lineHeight: 1.5,
    marginTop: ".2rem",
  },
  stopMeta: {
    display: "flex",
    alignItems: "center",
    gap: ".5rem",
    marginTop: ".3rem",
  },
  timeTag: {
    fontSize: "10px",
    color: "#92400E",
    background: "rgba(217,119,6,.1)",
    padding: ".15rem .5rem",
    borderRadius: "4px",
    letterSpacing: ".04em",
  },
  featuredTag: {
    fontSize: "10px",
    color: "#B45309",
    background: "rgba(180,83,9,.1)",
    padding: ".15rem .5rem",
    borderRadius: "4px",
    fontWeight: 700,
    letterSpacing: ".04em",
  },
  goBtn: (accent: string) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: ".3rem",
    fontSize: "11px",
    color: accent,
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 700,
    letterSpacing: ".04em",
    padding: 0,
    textDecoration: "underline",
    textUnderlineOffset: "2px",
  }),
  completedBanner: {
    background: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)",
    border: "1px solid #6EE7B7",
    borderRadius: "12px",
    padding: "1.25rem",
    textAlign: "center" as const,
    marginBottom: "2rem",
  },
  resetBtn: {
    background: "none",
    border: "1.5px solid rgba(217,119,6,.3)",
    borderRadius: "8px",
    padding: ".5rem 1.25rem",
    fontSize: "12px",
    color: "#92400E",
    cursor: "pointer",
    fontFamily: "inherit",
    letterSpacing: ".04em",
    marginTop: "1rem",
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function SkippyMap() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setChecked(new Set(JSON.parse(saved)));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage on change
  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Stats
  const totalStops = TENTACLES.reduce((sum, t) => sum + t.stops.length, 0);
  const completedCount = checked.size;
  const pct = Math.round((completedCount / totalStops) * 100);

  // Featured tentacle first, then rest
  const featured = TENTACLES.find(t => t.id === "featured")!;
  const rest = TENTACLES.filter(t => t.id !== "featured");

  const allDone = completedCount === totalStops;

  return (
    <div style={S.page}>
      {/* ── HERO ── */}
      <div style={S.hero}>
        <div style={S.heroGlow} />
        <div style={S.heroEyebrow}>Only Time Buys Trust · Personal Journey Map</div>
        <h1 style={S.heroTitle}>Welcome, Skippy.</h1>
        <p style={S.heroSub}>
          You're pioneer #1 of 160. This is your treasure chest — every instrument, essay, and rabbit hole on this site, mapped and waiting. No pressure, no sequence. Check things off as you go, or don't. Time is on your side.
        </p>

        <div style={S.statsRow}>
          <div style={S.stat}>
            <div style={S.statNum}>{completedCount}</div>
            <div style={S.statLabel}>Completed</div>
          </div>
          <div style={S.stat}>
            <div style={S.statNum}>{totalStops - completedCount}</div>
            <div style={S.statLabel}>Remaining</div>
          </div>
          <div style={S.stat}>
            <div style={S.statNum}>{pct}%</div>
            <div style={S.statLabel}>Through</div>
          </div>
          <div style={S.stat}>
            <div style={S.statNum}>160</div>
            <div style={S.statLabel}>Pioneers</div>
          </div>
        </div>

        <div style={S.progressBar}>
          <div style={S.progressFill(pct)} />
        </div>
      </div>

      <div style={S.body}>
        {allDone && (
          <div style={S.completedBanner}>
            <div style={{ fontSize: "2rem", marginBottom: ".5rem" }}>🎉</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#065F46" }}>You've been through everything.</div>
            <div style={{ fontSize: "14px", color: "#047857", marginTop: ".4rem", lineHeight: 1.6 }}>
              That's rare. Most people never make it this far. You now know more about this ecosystem than almost anyone alive.
            </div>
            <button style={S.resetBtn} onClick={() => { setChecked(new Set()); localStorage.removeItem(STORAGE_KEY); }}>
              Reset progress
            </button>
          </div>
        )}

        {/* ── TWO-PATH FORK ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2.5rem",
        }}>
          {/* Path A */}
          <div style={{
            background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
            border: "2px solid #D97706",
            borderRadius: "16px",
            padding: "1.5rem",
            position: "relative" as const,
          }}>
            <div style={{ fontSize: "10px", letterSpacing: ".2em", textTransform: "uppercase" as const, color: "#92400E", marginBottom: ".5rem", fontWeight: 700 }}>PATH A · IF YOU'RE READY NOW</div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#1A1208", marginBottom: ".6rem", lineHeight: 1.2 }}>Start with the Psychedelic Path</div>
            <div style={{ fontSize: "13px", color: "#44200A", lineHeight: 1.7, marginBottom: "1rem" }}>
              Go straight to the PRI and the Facilitator Index. If it resonates, move through the Three Friends Gate and the post-intervention assessment. This is the deepest water. If you like what you find, the rest of the site will make even more sense.
            </div>
            <div style={{ fontSize: "12px", color: "#78350F", background: "rgba(180,83,9,.1)", borderRadius: "8px", padding: ".6rem .85rem", lineHeight: 1.6 }}>
              🌿 PRI → Facilitator Index → Three Friends Gate → Post-Intervention
            </div>
          </div>
          {/* Path B */}
          <div style={{
            background: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)",
            border: "2px solid #059669",
            borderRadius: "16px",
            padding: "1.5rem",
          }}>
            <div style={{ fontSize: "10px", letterSpacing: ".2em", textTransform: "uppercase" as const, color: "#065F46", marginBottom: ".5rem", fontWeight: 700 }}>PATH B · YOUR TREASURE CHEST</div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#1A1208", marginBottom: ".6rem", lineHeight: 1.2 }}>Roam as You Feel It</div>
            <div style={{ fontSize: "13px", color: "#14532D", lineHeight: 1.7, marginBottom: "1rem" }}>
              Scroll down. Pick whatever calls to you — coffee, consciousness, capital, the body, the mind. This is Ramp's treasure chest. There's no wrong door. Check things off as you go. Come back when you have 10 minutes or 10 hours.
            </div>
            <div style={{ fontSize: "12px", color: "#166534", background: "rgba(5,150,105,.1)", borderRadius: "8px", padding: ".6rem .85rem", lineHeight: 1.6 }}>
              🐙 {TENTACLES.reduce((s, t) => s + t.stops.length, 0)} stops across {TENTACLES.length} tentacles — in any order
            </div>
          </div>
        </div>

        {/* ── FEATURED PATH ── */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={S.sectionTitle}>🌿 Path A — The Psychedelic & Facilitator Track</div>
          <div style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "20px",
            border: "2px solid #D97706",
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(180,83,9,.15)",
          }}>
            <div style={{ ...S.cardHeader(featured.color), padding: "1.5rem 1.5rem 1.25rem" }}>
              <span style={{ fontSize: "2rem" }}>{featured.emoji}</span>
              <div>
                <div style={{ ...S.cardTitle, fontSize: "16px" }}>{featured.title}</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,.7)", marginTop: ".2rem" }}>
                  The path Tony built for you. Do these first.
                </div>
              </div>
            </div>
            <div style={{ padding: "1.25rem 1.5rem" }}>
              {featured.stops.map((stop, si) => (
                <div
                  key={stop.id}
                  style={S.stopRow(checked.has(stop.id), true)}
                  onClick={() => toggle(stop.id)}
                >
                  <div style={S.checkbox(checked.has(stop.id), featured.accent)}>
                    {checked.has(stop.id) && <span style={S.checkmark}>✓</span>}
                  </div>
                  <div style={S.stopContent}>
                    <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#B45309", background: "rgba(180,83,9,.1)", padding: ".1rem .45rem", borderRadius: "4px" }}>
                        Step {si + 1}
                      </span>
                      {stop.isStart && <span style={{ fontSize: "10px", color: "#059669", background: "#D1FAE5", padding: ".1rem .45rem", borderRadius: "4px", fontWeight: 700 }}>START</span>}
                    </div>
                    <div style={{ ...S.stopLabel(checked.has(stop.id), true), fontSize: "16px", marginTop: ".3rem" }}>{stop.label}</div>
                    <div style={S.stopDesc}>{stop.description}</div>
                    <div style={S.stopMeta}>
                      <span style={S.timeTag}>⏱ {stop.time}</span>
                      <a href={stop.url} style={S.goBtn(featured.accent)} onClick={e => e.stopPropagation()}>
                        Go → 
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ALL TENTACLES ── */}
        <div style={S.sectionTitle}>🐙 Path B — Ramp’s Treasure Chest · Explore as You Feel It</div>
        <div style={S.tentacleGrid}>
          {rest.map(tentacle => {
            const tentacleChecked = tentacle.stops.filter(s => checked.has(s.id)).length;
            const tentacleTotal = tentacle.stops.length;
            const tentacleDone = tentacleChecked === tentacleTotal;
            return (
              <div key={tentacle.id} style={S.card(tentacle.accent, tentacleDone)}>
                <div style={S.cardHeader(tentacle.color)}>
                  <span style={S.cardEmoji}>{tentacle.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={S.cardTitle}>{tentacle.title}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,.6)", marginTop: ".2rem" }}>
                      {tentacleChecked} / {tentacleTotal} visited
                    </div>
                  </div>
                  {tentacleDone && <span style={{ fontSize: "1.2rem" }}>✅</span>}
                </div>
                <div style={S.cardBody}>
                  {tentacle.stops.map(stop => (
                    <div
                      key={stop.id}
                      style={S.stopRow(checked.has(stop.id), !!stop.featured)}
                      onClick={() => toggle(stop.id)}
                    >
                      <div style={S.checkbox(checked.has(stop.id), tentacle.accent)}>
                        {checked.has(stop.id) && <span style={S.checkmark}>✓</span>}
                      </div>
                      <div style={S.stopContent}>
                        <div style={S.stopLabel(checked.has(stop.id), !!stop.featured)}>{stop.label}</div>
                        <div style={S.stopDesc}>{stop.description}</div>
                        <div style={S.stopMeta}>
                          <span style={S.timeTag}>⏱ {stop.time}</span>
                          <a href={stop.url} style={S.goBtn(tentacle.accent)} onClick={e => e.stopPropagation()}>
                            Go →
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── FOOTER ── */}
        <div style={{ textAlign: "center", marginTop: "3rem", padding: "2rem 0", borderTop: "1px solid rgba(217,119,6,.15)" }}>
          <div style={{ fontSize: "13px", color: "rgba(26,18,8,.4)", lineHeight: 1.7 }}>
            Your progress is saved automatically in this browser.<br />
            <strong style={{ color: "#B45309" }}>Skippy</strong> — you're pioneer #1 of 160.<br />
            © 2026 Tony Greenberg · Only Time Buys Trust · onlytimebuystrust.com
          </div>
          <button
            style={{ ...S.resetBtn, marginTop: "1rem" }}
            onClick={() => { setChecked(new Set()); localStorage.removeItem(STORAGE_KEY); }}
          >
            Reset all progress
          </button>
        </div>
      </div>
    </div>
  );
}
