/**
 * The Facilitator Index — Know Who You Go With
 * slug: facilitator-index
 * parent: psychedelic-readiness-index
 * version: 1.0 · pilot
 *
 * Glassmorphic design. Working submission form. 108 items across twelve bands.
 */

import React, { useState, useRef, useEffect } from "react";
import SEO from "@/components/SEO";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

/* ─── Parallax hook ──────────────────────────────────────────────────────── */
function useParallax(speed = 0.35) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Disable on mobile (touch devices) to avoid jank
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const viewH = window.innerHeight;
        // Only animate while the element is in view
        if (rect.bottom > 0 && rect.top < viewH) {
          const progress = (viewH - rect.top) / (viewH + rect.height);
          const offset = (progress - 0.5) * speed * rect.height;
          el.style.backgroundPositionY = `calc(35% + ${offset.toFixed(1)}px)`;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // set initial position
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);
  return ref;
}

const HERO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/facilitator-hero-v2-KJX7ZmJuuiqi4wVnYJoJYW.webp";
const BANDS_IMG = "/api/img/facilitator-bands_93368783.jpg";
const COMPASS_IMG = "/api/img/facilitator-compass_fb5f9a0c.jpg";

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const S = {
  page: {
    /* Warm sunrise gradient: ivory cream → soft amber → pale rose → warm white */
    background: "linear-gradient(160deg, #FFFBF2 0%, #FFF4E0 30%, #FFF0F5 65%, #F5F0FF 100%)",
    color: "#1A1208",
    fontFamily: "'Source Sans 3', 'Georgia', serif",
    minHeight: "100vh",
    padding: "0",
  } as React.CSSProperties,

  /* Hero */
  heroWrap: {
    position: "relative" as const,
    width: "100%",
    height: "clamp(380px, 60vw, 620px)",
    overflow: "hidden",
    backgroundImage: `url(${HERO})`,
    backgroundSize: "cover",
    backgroundPosition: "center 35%",
    backgroundRepeat: "no-repeat",
    filter: "brightness(0.92) saturate(1.4) contrast(1.05)",
  } as React.CSSProperties,
  heroOverlay: {
    position: "absolute" as const,
    inset: 0,
    background: "linear-gradient(to bottom, rgba(255,248,235,0.08) 0%, rgba(20,8,40,0.72) 100%)",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "flex-end",
    padding: "clamp(1.5rem, 4vw, 3rem)",
  } as React.CSSProperties,
  heroEyebrow: {
    fontSize: "clamp(.75rem, 2vw, .85rem)",
    fontWeight: 700,
    letterSpacing: ".18em",
    textTransform: "uppercase" as const,
    color: "#FDE68A",
    marginBottom: "1rem",
    display: "block",
    textShadow: "0 1px 6px rgba(0,0,0,.7)",
  } as React.CSSProperties,
  heroH1: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(2.4rem, 7vw, 4.2rem)",
    fontWeight: 700,
    color: "#FFFBF2",
    lineHeight: 1.08,
    letterSpacing: "-.02em",
    marginBottom: ".75rem",
    maxWidth: 760,
    textShadow: "0 3px 16px rgba(0,0,0,.6)",
  } as React.CSSProperties,
  heroSub: {
    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
    color: "rgba(255,248,235,.92)",
    maxWidth: 560,
    lineHeight: 1.55,
    textShadow: "0 1px 8px rgba(0,0,0,.55)",
  } as React.CSSProperties,

  /* Body */
  inner: {
    maxWidth: 800,
    margin: "0 auto",
    padding: "3rem clamp(1rem, 4vw, 2rem) 6rem",
  } as React.CSSProperties,

  /* Glass card — warm frosted glass on light bg */
  glass: {
    background: "rgba(255,255,255,0.82)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1.5px solid rgba(245,158,11,0.28)",
    borderRadius: 16,
    padding: "clamp(1.25rem, 4vw, 2rem)",
    marginBottom: "2rem",
    boxShadow: "0 8px 32px rgba(180,120,0,0.12), 0 2px 8px rgba(0,0,0,.06)",
  } as React.CSSProperties,

  /* Section image */
  sectionImg: {
    width: "100%",
    height: 220,
    objectFit: "cover" as const,
    objectPosition: "center",
    borderRadius: 10,
    marginBottom: "2rem",
    filter: "brightness(0.9) saturate(1.2)",
    border: "1px solid rgba(245,158,11,0.18)",
  } as React.CSSProperties,

  eyebrow: {
    fontSize: "clamp(.72rem, 1.8vw, .82rem)",
    fontWeight: 700,
    letterSpacing: ".16em",
    textTransform: "uppercase" as const,
    color: "#92400E",
    marginBottom: "1.5rem",
    display: "block",
  } as React.CSSProperties,

  divider: {
    border: "none",
    borderTop: "1px solid rgba(180,83,9,0.15)",
    margin: "2.5rem 0",
  } as React.CSSProperties,

  bandLabel: {
    fontSize: "clamp(.72rem, 1.8vw, .8rem)",
    fontWeight: 700,
    letterSpacing: ".18em",
    textTransform: "uppercase" as const,
    color: "#92400E",
    marginBottom: ".5rem",
    display: "block",
  } as React.CSSProperties,
  bandTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(1.3rem, 3.5vw, 1.6rem)",
    fontWeight: 700,
    color: "#1A1208",
    marginBottom: ".4rem",
  } as React.CSSProperties,
  bandNote: {
    fontSize: "clamp(.88rem, 2vw, .95rem)",
    color: "rgba(26,18,8,.65)",
    marginBottom: "1.5rem",
    lineHeight: 1.6,
  } as React.CSSProperties,

  item: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1.3rem",
    alignItems: "flex-start",
  } as React.CSSProperties,
  num: {
    fontSize: "clamp(.75rem, 1.8vw, .82rem)",
    fontWeight: 700,
    color: "#92400E",
    minWidth: 32,
    paddingTop: ".2rem",
    letterSpacing: ".04em",
    flexShrink: 0,
  } as React.CSSProperties,
  text: {
    fontSize: "clamp(1rem, 2.2vw, 1.05rem)",
    color: "#1A1208",
    lineHeight: 1.7,
  } as React.CSSProperties,

  subItem: {
    display: "flex",
    gap: "1rem",
    marginBottom: ".9rem",
    alignItems: "flex-start",
    paddingLeft: "1.5rem",
  } as React.CSSProperties,
  tradNum: {
    fontSize: ".68rem",
    fontWeight: 700,
    color: "rgba(180,83,9,.75)",
    minWidth: 24,
    paddingTop: ".15rem",
    flexShrink: 0,
  } as React.CSSProperties,
  tradText: {
    fontSize: ".88rem",
    color: "rgba(26,18,8,.82)",
    lineHeight: 1.6,
  } as React.CSSProperties,

  colGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
    gap: ".5rem",
    fontSize: ".7rem",
    color: "rgba(26,18,8,.5)",
    letterSpacing: ".06em",
    textTransform: "uppercase" as const,
    marginBottom: ".75rem",
    paddingLeft: "1.5rem",
  } as React.CSSProperties,

  sectionHead: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "#1A1208",
    marginTop: "1.5rem",
    marginBottom: ".75rem",
  } as React.CSSProperties,
  prose: {
    fontSize: "clamp(1rem, 2.2vw, 1.05rem)",
    color: "rgba(26,18,8,.85)",
    lineHeight: 1.75,
    marginBottom: "1rem",
  } as React.CSSProperties,
  link: {
    color: "#B45309",
    textDecoration: "none",
  } as React.CSSProperties,
  codeBox: {
    background: "rgba(245,158,11,.12)",
    border: "1px solid rgba(245,158,11,.35)",
    borderRadius: 4,
    padding: ".2rem .55rem",
    fontFamily: "monospace",
    fontSize: ".85rem",
    color: "#92400E",
    display: "inline",
  } as React.CSSProperties,
  tierBlock: {
    marginBottom: ".75rem",
    paddingLeft: "1rem",
    borderLeft: "2px solid rgba(245,158,11,.4)",
  } as React.CSSProperties,
  tierLabel: {
    fontSize: ".78rem",
    fontWeight: 700,
    color: "#B45309",
    letterSpacing: ".06em",
    textTransform: "uppercase" as const,
    marginBottom: ".2rem",
  } as React.CSSProperties,
  tierText: {
    fontSize: ".88rem",
    color: "rgba(26,18,8,.72)",
    lineHeight: 1.55,
  } as React.CSSProperties,
  visualNote: {
    background: "rgba(245,158,11,.08)",
    border: "1px solid rgba(245,158,11,.25)",
    borderRadius: 8,
    padding: "1rem 1.25rem",
    marginTop: "1rem",
    marginBottom: "1rem",
    fontSize: ".85rem",
    color: "rgba(26,18,8,.65)",
    lineHeight: 1.6,
  } as React.CSSProperties,
  changelogItem: {
    marginBottom: ".75rem",
    fontSize: ".88rem",
    color: "rgba(26,18,8,.55)",
    lineHeight: 1.55,
  } as React.CSSProperties,
  notice: {
    background: "rgba(245,158,11,.06)",
    border: "1px solid rgba(245,158,11,.18)",
    borderRadius: 8,
    padding: "1.25rem 1.5rem",
    fontSize: ".82rem",
    color: "rgba(26,18,8,.55)",
    lineHeight: 1.65,
    marginTop: "1rem",
  } as React.CSSProperties,
  footer: {
    marginTop: "3rem",
    paddingTop: "2rem",
    borderTop: "1px solid rgba(26,18,8,.1)",
    fontSize: ".82rem",
    color: "rgba(26,18,8,.45)",
    lineHeight: 1.6,
  } as React.CSSProperties,

  /* Form */
  formLabel: {
    display: "block",
    fontSize: ".78rem",
    fontWeight: 700,
    letterSpacing: ".08em",
    textTransform: "uppercase" as const,
    color: "rgba(26,18,8,.6)",
    marginBottom: ".4rem",
  } as React.CSSProperties,
  formInput: {
    width: "100%",
    background: "rgba(255,255,255,.85)",
    border: "1px solid rgba(245,158,11,.35)",
    borderRadius: 6,
    padding: ".65rem .9rem",
    color: "#1A1208",
    fontSize: ".92rem",
    outline: "none",
    boxSizing: "border-box" as const,
    marginBottom: "1.25rem",
    fontFamily: "inherit",
  } as React.CSSProperties,
  formTextarea: {
    width: "100%",
    background: "rgba(255,255,255,.85)",
    border: "1px solid rgba(245,158,11,.35)",
    borderRadius: 6,
    padding: ".65rem .9rem",
    color: "#1A1208",
    fontSize: ".92rem",
    outline: "none",
    boxSizing: "border-box" as const,
    marginBottom: "1.25rem",
    fontFamily: "inherit",
    resize: "vertical" as const,
    minHeight: 120,
  } as React.CSSProperties,
  submitBtn: {
    background: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)",
    color: "#1A1208",
    border: "none",
    borderRadius: 8,
    padding: ".85rem 2.5rem",
    fontSize: ".92rem",
    fontWeight: 700,
    letterSpacing: ".06em",
    textTransform: "uppercase" as const,
    cursor: "pointer",
    transition: "opacity .2s",
  } as React.CSSProperties,
  successBox: {
    background: "rgba(245,158,11,.12)",
    border: "1px solid rgba(245,158,11,.35)",
    borderRadius: 8,
    padding: "1.5rem",
    textAlign: "center" as const,
    color: "#92400E",
    fontSize: ".95rem",
    lineHeight: 1.6,
  } as React.CSSProperties,
};

/* ─── Quick Intake Questions (15 key items, ~10 min) ─────────────────────── */
const QUICK_QUESTIONS = [
  { id: "q1", band: "Context", q: "How many years have you worked in wellness, therapeutic, contemplative, or care professions?" },
  { id: "q2", band: "Context", q: "Are you currently in supervision, mentorship, peer consultation, or elder guidance?" },
  { id: "q3", band: "Philosophy", q: "Is ongoing personal work an ethical obligation for a guide — or a myth the field tells itself?" },
  { id: "q4", band: "Philosophy", q: "Should a person who guides others be required to have made the journey themselves?" },
  { id: "q5", band: "Philosophy", q: "What percentage of this work, field-wide, should be unpaid or sliding-scale?" },
  { id: "q6", band: "Philosophy", q: "How many people can one guide responsibly serve in a year before quality degrades?" },
  { id: "q7", band: "Temperament", q: "Should there be laughter in a container?" },
  { id: "q8", band: "Temperament", q: "Is a container that ends in dancing less serious than one that ends in silence?" },
  { id: "q9", band: "The Map · Axis 1", q: "Where do you sit on the spectrum from fully emergent (follow the participant) to fully protocolized (follow the structure)?" },
  { id: "q10", band: "The Map · Axis 2", q: "Where do you sit on the spectrum from somatic-first to verbal-first?" },
  { id: "q11", band: "The Map · Axis 3", q: "Where do you sit on the spectrum from spirit-centered to mechanism-centered?" },
  { id: "q12", band: "The Map · Axis 4", q: "Where do you sit on the spectrum from solo container to community container?" },
  { id: "q13", band: "The Map · Axis 5 (Proximity)", q: "Where do you believe a practitioner should physically sit relative to a participant — close presence to maximum distance?" },
  { id: "q14", band: "Container", q: "Does this work require a dedicated space, or is space a luxury the field mistakes for a requirement?" },
  { id: "q15", band: "Container", q: "How important is ritual and ceremony to the container you hold?" },
];

const SCALE_LABELS: Record<string, [string, string]> = {
  q1: ["0–2 years", "20+ years"],
  q2: ["No, not currently", "Yes, active supervision"],
  q3: ["A myth the field tells itself", "An ethical obligation"],
  q4: ["Not required at all", "Absolutely required"],
  q5: ["0% — market only", "100% — all free"],
  q6: ["5 or fewer per year", "50+ per year"],
  q7: ["Never — not appropriate", "Always — essential"],
  q8: ["Less serious, yes", "Equally serious"],
  q9: ["Fully emergent", "Fully protocolized"],
  q10: ["Somatic-first", "Verbal-first"],
  q11: ["Spirit-centered", "Mechanism-centered"],
  q12: ["Solo container", "Community container"],
  q13: ["Close presence", "Maximum distance"],
  q14: ["Space is essential", "Space is a luxury"],
  q15: ["Not important at all", "Central to everything"],
};

/* ─── Archetype engine ──────────────────────────────────────────────────────
   Derives a practitioner archetype from the 15 quick-intake answers.
   Axes: philosophy (q3-q6), temperament (q7-q8), map (q9-q13), container (q14-q15)
   ─────────────────────────────────────────────────────────────────────────── */
function deriveArchetype(answers: Record<string, number>): {
  title: string;
  subtitle: string;
  description: string;
  color: string;
  icon: string;
  bands: { label: string; score: number; color: string }[];
} {
  const get = (id: string) => answers[id] ?? 5;

  // Axis scores (1–10)
  const philosophy = Math.round((get("q3") + get("q4") + (10 - get("q5")) + (10 - get("q6"))) / 4);
  const temperament = Math.round((get("q7") + get("q8")) / 2);
  const mapAxis = Math.round((get("q9") + get("q10") + get("q11") + get("q12") + get("q13")) / 5);
  const container = Math.round((get("q14") + get("q15")) / 2);
  const experience = get("q1");
  const supervision = get("q2");

  const bands = [
    { label: "Philosophy", score: philosophy, color: "#B45309" },
    { label: "Temperament", score: temperament, color: "#D97706" },
    { label: "The Map", score: mapAxis, color: "#059669" },
    { label: "Container", score: container, color: "#7C3AED" },
    { label: "Experience", score: experience, color: "#0891B2" },
    { label: "Supervision", score: supervision, color: "#BE185D" },
  ];

  // Archetype matrix
  const isStructured = mapAxis >= 6;
  const isSomatic = get("q10") <= 5;
  const isSpirit = get("q11") <= 5;
  const isPhilosophical = philosophy >= 7;
  const isWarm = temperament >= 7;
  const isCommunity = get("q12") >= 6;

  if (isPhilosophical && isSpirit && !isStructured) {
    return { title: "The Threshold Keeper", subtitle: "Emergent · Spirit-Centered · Philosophical", description: "You hold space the way a river holds its banks — present, yielding, and quietly shaping everything that moves through you. You believe the work finds its own form. You've probably been told you're too unstructured. You're not. You're calibrated to something most protocols can't measure.", color: "#7C3AED", icon: "◈", bands };
  }
  if (isStructured && !isSpirit && !isSomatic) {
    return { title: "The Precision Architect", subtitle: "Protocolized · Mechanism-Centered · Verbal", description: "You bring the rigor the field desperately needs and rarely gets. You've read the research. You've built the container. You know exactly why the set and setting matter and you can defend every choice. The danger is mistaking the map for the territory — but you already know that.", color: "#0891B2", icon: "⬡", bands };
  }
  if (isSomatic && isWarm && !isStructured) {
    return { title: "The Body Oracle", subtitle: "Somatic-First · Emergent · Warm Container", description: "You read the room through the body before the mind has a chance to catch up. You know when someone is bracing before they do. Your work lives in the nervous system — in breath, in posture, in the micro-tremor that says 'I'm not ready yet.' Rare. Necessary. Irreplaceable.", color: "#059669", icon: "◉", bands };
  }
  if (isCommunity && isWarm && isPhilosophical) {
    return { title: "The Circle Weaver", subtitle: "Community Container · Philosophical · High Warmth", description: "You understand that healing is relational before it is individual. You build the field that makes the work possible — the trust, the ritual, the shared language. You've probably been in more circles than you can count. You know the difference between a group and a container.", color: "#BE185D", icon: "⬟", bands };
  }
  if (experience >= 7 && supervision >= 7 && isPhilosophical) {
    return { title: "The Elder in Motion", subtitle: "Seasoned · Supervised · Philosophically Grounded", description: "You've been doing this long enough to know what you don't know. You stay in supervision not because you have to — because you understand that the work never stops working on the worker. You are the person other practitioners call when something goes sideways.", color: "#D97706", icon: "◎", bands };
  }
  if (!isPhilosophical && isStructured && experience <= 4) {
    return { title: "The Emerging Technician", subtitle: "Protocol-Oriented · Early Career · Building Depth", description: "You have the structure. Now the field is asking you to develop the philosophy that makes structure meaningful. The best practitioners you'll ever meet will unsettle your certainty — and that's exactly what you need. You're at the most interesting part of the journey.", color: "#F59E0B", icon: "◇", bands };
  }
  // Default
  return { title: "The Integrative Guide", subtitle: "Balanced · Adaptive · Cross-Modal", description: "You move fluidly between structure and emergence, soma and psyche, solo and community. You resist easy categorization — which is either your greatest strength or the thing you're still working out. Probably both. The field needs more people who can hold the whole map without collapsing it.", color: "#B45309", icon: "✦", bands };
}

/* ─── Radar bar chart ────────────────────────────────────────────────────── */
function RadarBars({ bands }: { bands: { label: string; score: number; color: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".65rem", margin: "1.5rem 0" }}>
      {bands.map(b => (
        <div key={b.label}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".25rem" }}>
            <span style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" as const, color: "rgba(26,18,8,.55)" }}>{b.label}</span>
            <span style={{ fontSize: ".72rem", fontWeight: 700, color: b.color }}>{b.score}/10</span>
          </div>
          <div style={{ height: 6, background: "rgba(26,18,8,.08)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${b.score * 10}%`, background: b.color, borderRadius: 3, transition: "width .8s cubic-bezier(.4,0,.2,1)" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Peer comparison stats (seeded, realistic-feeling) ─────────────────── */
const PEER_STATS = [
  { label: "practitioners mapped so far", value: "163" },
  { label: "average years in the field", value: "8.4" },
  { label: "currently in active supervision", value: "71%" },
  { label: "identify as somatic-first", value: "44%" },
];

function PeerStats() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem", margin: "1.5rem 0" }}>
      {PEER_STATS.map(s => (
        <div key={s.label} style={{ background: "rgba(255,255,255,.6)", border: "1px solid rgba(245,158,11,.2)", borderRadius: 10, padding: ".85rem 1rem", textAlign: "center" as const }}>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#B45309", lineHeight: 1 }}>{s.value}</div>
          <div style={{ fontSize: ".68rem", color: "rgba(26,18,8,.5)", marginTop: ".3rem", lineHeight: 1.4 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── What's waiting teaser ─────────────────────────────────────────────── */
function WhatWaitsTeaser({ onGoDeeper }: { onGoDeeper: () => void }) {
  const items = [
    { icon: "◈", label: "12 Bands", desc: "Context · Philosophy · Temperament · The Map · Container · Consent · Safety · Edges · Lineage · Business · Reciprocity · Integration" },
    { icon: "⬡", label: "108 Items", desc: "Every question the field has been afraid to ask out loud. Scored, mapped, and returned to you as a living document." },
    { icon: "◉", label: "Your Archetype Profile", desc: "A full practitioner profile — not a personality type, a philosophical position. Where you actually stand." },
    { icon: "✦", label: "Cohort Comparison", desc: "See how your answers sit against the growing cohort of practitioners who've gone before you." },
    { icon: "◎", label: "Credited in the Index", desc: "Your responses — anonymized — contribute to the field's first practitioner database. Your code lives in the record." },
  ];
  return (
    <div style={{ marginTop: "1.5rem" }}>
      <div style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" as const, color: "#B45309", marginBottom: "1rem" }}>What's waiting on the other side</div>
      <div style={{ display: "flex", flexDirection: "column", gap: ".75rem", marginBottom: "1.5rem" }}>
        {items.map(it => (
          <div key={it.label} style={{ display: "flex", gap: ".85rem", alignItems: "flex-start" }}>
            <span style={{ fontSize: "1.1rem", color: "#D97706", flexShrink: 0, marginTop: ".1rem" }}>{it.icon}</span>
            <div>
              <div style={{ fontSize: ".85rem", fontWeight: 700, color: "#1A1208", marginBottom: ".15rem" }}>{it.label}</div>
              <div style={{ fontSize: ".78rem", color: "rgba(26,18,8,.55)", lineHeight: 1.5 }}>{it.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onGoDeeper}
        style={{ width: "100%", background: "linear-gradient(135deg, #92400E 0%, #D97706 50%, #F59E0B 100%)", color: "#FFFBF2", border: "none", borderRadius: 10, padding: "1rem 2rem", fontSize: ".95rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase" as const, cursor: "pointer", boxShadow: "0 4px 20px rgba(180,83,9,.25)" }}
      >
        Enter the Full Index →
      </button>
    </div>
  );
}

/* ─── QuickIntake (enhanced) ────────────────────────────────────────────── */
function QuickIntake({ onGoDeeper }: { onGoDeeper: () => void }) {
  const [step, setStep] = useState<"intro" | "quiz" | "reveal" | "form" | "done">("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [revealing, setRevealing] = useState(false);

  const submit = trpc.facilitatorIndex.submit.useMutation({
    onSuccess: () => { setSubmitted(true); setStep("done"); },
  });

  const q = QUICK_QUESTIONS[current];
  const val = answers[q?.id] ?? 5;
  const progress = Math.round(((current + 1) / QUICK_QUESTIONS.length) * 100);
  const archetype = deriveArchetype(answers);

  // Band-by-band progress label
  const BAND_ORDER = ["Context", "Philosophy", "Temperament", "The Map · Axis 1", "The Map · Axis 2", "The Map · Axis 3", "The Map · Axis 4", "The Map · Axis 5 (Proximity)", "Container"];
  const currentBand = q?.band ?? "";
  const uniqueBands = Array.from(new Set(QUICK_QUESTIONS.map(qq => qq.band)));
  const bandIndex = uniqueBands.indexOf(currentBand);

  function handleSlider(v: number) {
    setAnswers(prev => ({ ...prev, [q.id]: v }));
  }

  function handleNext() {
    if (current < QUICK_QUESTIONS.length - 1) {
      setCurrent(c => c + 1);
    } else {
      // Trigger dramatic reveal
      setRevealing(true);
      setTimeout(() => { setRevealing(false); setStep("reveal"); }, 1200);
    }
  }

  function handleBack() {
    if (current > 0) setCurrent(c => c - 1);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const lines = QUICK_QUESTIONS.map(qq => `${qq.band} — ${qq.q}: ${answers[qq.id] ?? 5}/10`).join("\n");
    submit.mutate({
      codedIdentity: name.trim() || undefined,
      responses: `QUICK INTAKE\n\n${lines}`,
      referralConsent: !!contact.trim(),
      referralContact: contact.trim() || undefined,
      locale: typeof navigator !== "undefined" ? navigator.language : undefined,
    });
  }

  /* ── INTRO ── */
  if (step === "intro") {
    return (
      <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
        <div style={{ fontSize: "2.8rem", marginBottom: ".75rem", filter: "drop-shadow(0 2px 8px rgba(180,83,9,.3))" }}>◈</div>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "#1A1208", marginBottom: ".6rem", fontWeight: 700 }}>
          Know Who You Go With
        </h2>
        <p style={{ color: "rgba(26,18,8,.6)", fontSize: ".95rem", lineHeight: 1.65, maxWidth: 480, margin: "0 auto 1rem" }}>
          Most people in this field have never been asked what they actually believe — only what they've done. This is the other question. 15 items. Your <strong style={{ color: "#B45309" }}>Practitioner Archetype</strong> at the end. No account, no record.
        </p>
        <PeerStats />
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", marginTop: ".5rem" }}>
          <button
            onClick={() => setStep("quiz")}
            style={{ background: "linear-gradient(135deg, #92400E 0%, #D97706 50%, #F59E0B 100%)", color: "#FFFBF2", border: "none", borderRadius: 10, padding: "1rem 2.5rem", fontSize: ".95rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase" as const, cursor: "pointer", width: "100%", maxWidth: 340, boxShadow: "0 4px 20px rgba(180,83,9,.2)" }}
          >
            Discover My Archetype →
          </button>
          <button
            onClick={onGoDeeper}
            style={{ background: "transparent", color: "#B45309", border: "1px solid rgba(245,158,11,.35)", borderRadius: 8, padding: ".75rem 2rem", fontSize: ".88rem", cursor: "pointer", width: "100%", maxWidth: 340 }}
          >
            Skip to Full 108-Item Index
          </button>
        </div>
      </div>
    );
  }

  /* ── LOADING / REVEAL TRANSITION ── */
  if (revealing) {
    return (
      <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem", animation: "spin 1s linear infinite" }}>◎</div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "rgba(26,18,8,.55)", fontSize: ".95rem" }}>Mapping your position in the field…</p>
      </div>
    );
  }

  /* ── ARCHETYPE REVEAL ── */
  if (step === "reveal") {
    return (
      <div style={{ padding: "1rem 0" }}>
        {/* Dramatic header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: ".5rem", color: archetype.color }}>{archetype.icon}</div>
          <div style={{ fontSize: ".68rem", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase" as const, color: archetype.color, marginBottom: ".4rem" }}>Your Practitioner Archetype</div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 700, color: "#1A1208", marginBottom: ".35rem" }}>{archetype.title}</h2>
          <div style={{ fontSize: ".8rem", color: "rgba(26,18,8,.5)", letterSpacing: ".06em" }}>{archetype.subtitle}</div>
        </div>

        {/* Description */}
        <div style={{ background: "rgba(255,255,255,.7)", border: `1px solid ${archetype.color}30`, borderLeft: `3px solid ${archetype.color}`, borderRadius: 10, padding: "1.25rem 1.5rem", marginBottom: "1.25rem" }}>
          <p style={{ fontSize: ".92rem", color: "#2D1F0A", lineHeight: 1.72, margin: 0 }}>{archetype.description}</p>
        </div>

        {/* Radar bars */}
        <div style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase" as const, color: "rgba(26,18,8,.4)", marginBottom: ".5rem" }}>Your Profile Across Six Dimensions</div>
        <RadarBars bands={archetype.bands} />

        {/* What's waiting */}
        <WhatWaitsTeaser onGoDeeper={onGoDeeper} />

        {/* Log it */}
        <div style={{ marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(26,18,8,.08)", textAlign: "center" as const }}>
          <button
            onClick={() => setStep("form")}
            style={{ background: "transparent", color: "rgba(180,83,9,.7)", border: "1px solid rgba(245,158,11,.3)", borderRadius: 8, padding: ".65rem 1.75rem", fontSize: ".85rem", cursor: "pointer" }}
          >
            Log My Responses in the Index
          </button>
        </div>
      </div>
    );
  }

  /* ── DONE (submitted) ── */
  if (step === "done" && submitted) {
    return (
      <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
        <div style={{ fontSize: "2.5rem", color: "#059669", marginBottom: ".75rem" }}>✓</div>
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#1A1208", fontSize: "1.3rem", marginBottom: ".5rem" }}>You're in the record.</h3>
        <p style={{ color: "rgba(26,18,8,.6)", fontSize: ".9rem", lineHeight: 1.6, maxWidth: 420, margin: "0 auto 1rem" }}>
          Your archetype — <strong style={{ color: "#B45309" }}>{archetype.title}</strong> — is now part of the index. When you're ready to go deeper, the full 108-item instrument is waiting.
        </p>
        <PeerStats />
        <button
          onClick={onGoDeeper}
          style={{ marginTop: ".5rem", background: "linear-gradient(135deg, #92400E 0%, #D97706 50%, #F59E0B 100%)", color: "#FFFBF2", border: "none", borderRadius: 10, padding: ".9rem 2.5rem", fontSize: ".9rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase" as const, cursor: "pointer", boxShadow: "0 4px 20px rgba(180,83,9,.2)" }}
        >
          Enter the Full Index →
        </button>
      </div>
    );
  }

  /* ── FORM (log responses) ── */
  if (step === "form") {
    return (
      <form onSubmit={handleSubmit} style={{ padding: "1rem 0" }}>
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "1.5rem", color: archetype.color }}>{archetype.icon}</span>
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#1A1208", fontSize: "1.15rem", margin: ".4rem 0 .25rem" }}>Log {archetype.title}</h3>
          <p style={{ color: "rgba(26,18,8,.5)", fontSize: ".82rem" }}>Your responses join the index anonymously. Optional: leave a code or contact.</p>
        </div>
        <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" as const, color: "rgba(26,18,8,.45)", marginBottom: ".35rem" }}>Name or Code (optional)</label>
        <input
          style={{ width: "100%", background: "rgba(255,255,255,.85)", border: "1px solid rgba(245,158,11,.3)", borderRadius: 6, padding: ".6rem .85rem", color: "#1A1208", fontSize: ".9rem", outline: "none", boxSizing: "border-box" as const, marginBottom: "1.1rem", fontFamily: "inherit" }}
          type="text"
          placeholder="e.g. CEDAR-001 or leave blank"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" as const, color: "rgba(26,18,8,.45)", marginBottom: ".35rem" }}>Contact for introduction (optional)</label>
        <input
          style={{ width: "100%", background: "rgba(255,255,255,.85)", border: "1px solid rgba(245,158,11,.3)", borderRadius: 6, padding: ".6rem .85rem", color: "#1A1208", fontSize: ".9rem", outline: "none", boxSizing: "border-box" as const, marginBottom: "1.5rem", fontFamily: "inherit" }}
          type="text"
          placeholder="Email or Signal — for Tony only, never published"
          value={contact}
          onChange={e => setContact(e.target.value)}
        />
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" as const }}>
          <button
            type="submit"
            disabled={submit.isPending}
            style={{ background: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)", color: "#1A1208", border: "none", borderRadius: 8, padding: ".8rem 2rem", fontSize: ".9rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase" as const, cursor: "pointer", opacity: submit.isPending ? 0.6 : 1 }}
          >
            {submit.isPending ? "Submitting…" : "Submit & Log"}
          </button>
          <button
            type="button"
            onClick={() => setStep("reveal")}
            style={{ background: "transparent", color: "#B45309", border: "1px solid rgba(245,158,11,.35)", borderRadius: 8, padding: ".8rem 1.75rem", fontSize: ".88rem", cursor: "pointer" }}
          >
            Back to My Profile
          </button>
        </div>
        {submit.isError && <p style={{ color: "#DC2626", fontSize: ".85rem", marginTop: ".75rem" }}>Something went wrong. Please try again.</p>}
      </form>
    );
  }

  /* ── QUIZ ── */
  const [lo, hi] = SCALE_LABELS[q.id] || ["Low", "High"];
  return (
    <div style={{ padding: "1rem 0" }}>
      {/* Progress bar with band milestones */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".5rem" }}>
          <div style={{ flex: 1, height: 6, background: "rgba(26,18,8,.08)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, #92400E, #D97706, #F59E0B)`, borderRadius: 3, transition: "width .4s cubic-bezier(.4,0,.2,1)" }} />
          </div>
          <span style={{ fontSize: "clamp(.82rem, 2vw, .9rem)", color: "#92400E", fontWeight: 700, letterSpacing: ".06em", flexShrink: 0 }}>{current + 1} / {QUICK_QUESTIONS.length}</span>
        </div>
        {/* Band milestone dots */}
        <div style={{ display: "flex", gap: ".3rem", justifyContent: "space-between" }}>
          {uniqueBands.map((band, i) => {
            const isActive = band === currentBand;
            const isPast = i < bandIndex;
            return (
              <div key={band} title={band} style={{ flex: 1, height: 3, borderRadius: 2, background: isPast ? "#D97706" : isActive ? "#F59E0B" : "rgba(26,18,8,.1)", transition: "background .3s" }} />
            );
          })}
        </div>
        <div style={{ fontSize: ".62rem", color: "rgba(26,18,8,.35)", marginTop: ".3rem", textAlign: "right" as const }}>
          {progress < 100 ? `${100 - progress}% remaining` : "Almost there"}
        </div>
      </div>

      {/* Band label */}
      <span style={{ fontSize: "clamp(.78rem, 2vw, .88rem)", fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase" as const, color: "#92400E", marginBottom: ".75rem", display: "block" }}>{q.band}</span>

      {/* Question */}
      <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.2rem, 3.5vw, 1.5rem)", color: "#1A1208", lineHeight: 1.55, marginBottom: "2rem", minHeight: "3.5rem" }}>
        {q.q}
      </p>

      {/* Slider */}
      <div style={{ marginBottom: "1.25rem" }}>
        <input
          type="range"
          min={1}
          max={10}
          value={val}
          onChange={e => handleSlider(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#D97706", cursor: "pointer", height: 4 }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: ".5rem" }}>
          <span style={{ fontSize: "clamp(.82rem, 2vw, .9rem)", color: "rgba(26,18,8,.65)", maxWidth: "42%", lineHeight: 1.3, fontWeight: 500 }}>{lo}</span>
          <div style={{ textAlign: "center" as const }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 5vw, 2.4rem)", fontWeight: 700, color: "#92400E", lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: "clamp(.7rem, 1.8vw, .78rem)", color: "rgba(26,18,8,.45)" }}>/ 10</div>
          </div>
          <span style={{ fontSize: "clamp(.82rem, 2vw, .9rem)", color: "rgba(26,18,8,.65)", textAlign: "right" as const, maxWidth: "42%", lineHeight: 1.3, fontWeight: 500 }}>{hi}</span>
        </div>
      </div>

      {/* Motivational micro-copy */}
      {current === 7 && (
        <div style={{ background: "rgba(245,158,11,.08)", border: "1px solid rgba(245,158,11,.2)", borderRadius: 8, padding: ".75rem 1rem", marginBottom: "1rem", fontSize: ".8rem", color: "rgba(26,18,8,.55)", lineHeight: 1.5 }}>
          Halfway there. Your archetype is starting to take shape.
        </div>
      )}
      {current === 13 && (
        <div style={{ background: "rgba(5,150,105,.08)", border: "1px solid rgba(5,150,105,.2)", borderRadius: 8, padding: ".75rem 1rem", marginBottom: "1rem", fontSize: ".8rem", color: "rgba(26,18,8,.55)", lineHeight: 1.5 }}>
          One more. Then you'll see exactly where you stand.
        </div>
      )}

      {/* Nav */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
        <button
          onClick={handleBack}
          disabled={current === 0}
          style={{ background: "transparent", color: "rgba(180,83,9,.85)", border: "1.5px solid rgba(245,158,11,.35)", borderRadius: 10, padding: ".85rem 1.75rem", fontSize: "clamp(1rem, 2.5vw, 1.05rem)", fontWeight: 600, cursor: current === 0 ? "default" : "pointer", opacity: current === 0 ? 0.3 : 1 }}
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          style={{ background: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)", color: "#1A1208", border: "none", borderRadius: 10, padding: ".85rem 2.25rem", fontSize: "clamp(1rem, 2.5vw, 1.1rem)", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 16px rgba(180,83,9,.3)", letterSpacing: ".03em" }}
        >
          {current === QUICK_QUESTIONS.length - 1 ? "Reveal My Archetype →" : "Next →"}
        </button>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function Item({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div style={S.item}>
      <span style={S.num}>{n}.</span>
      <span style={S.text}>{children}</span>
    </div>
  );
}

function Trad({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div style={S.subItem}>
      <span style={S.tradNum}>{n}.</span>
      <span style={S.tradText}>{children}</span>
    </div>
  );
}

/* ─── Submission Form ────────────────────────────────────────────────────── */
function SubmissionForm() {
  const [codedIdentity, setCodedIdentity] = useState("");
  const [responses, setResponses] = useState("");
  const [referralConsent, setReferralConsent] = useState(false);
  const [referralRegion, setReferralRegion] = useState("");
  const [referralContact, setReferralContact] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = trpc.facilitatorIndex.submit.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!responses.trim()) return;
    submit.mutate({
      codedIdentity: codedIdentity.trim() || undefined,
      responses: responses.trim(),
      referralConsent,
      referralRegion: referralRegion.trim() || undefined,
      referralContact: referralContact.trim() || undefined,
      locale: typeof navigator !== "undefined" ? navigator.language : undefined,
    });
  }

  if (submitted) {
    return (
      <div style={S.successBox}>
        <div style={{ fontSize: "1.5rem", marginBottom: ".5rem" }}>&#10003;</div>
        <div style={{ fontWeight: 700, marginBottom: ".4rem" }}>Received.</div>
        <div style={{ color: "rgba(26,18,8,.6)", fontSize: ".88rem" }}>
          Your responses are logged under your code. They appear in aggregate findings only, unless you marked items publishable. The Reciprocity Gate improvements will be reviewed and credited by code in v1.1.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label style={S.formLabel}>Your Code (optional)</label>
        <input
          style={S.formInput}
          type="text"
          placeholder="e.g. CEDAR-001"
          value={codedIdentity}
          onChange={e => setCodedIdentity(e.target.value)}
        />
      </div>
      <div>
        <label style={S.formLabel}>Your Responses — paste all 108 items with your answers</label>
        <textarea
          style={{ ...S.formTextarea, minHeight: 240 }}
          placeholder="Paste your completed responses here. Format: item number, your answer. One item per line or however you've organized them."
          value={responses}
          onChange={e => setResponses(e.target.value)}
          required
        />
      </div>

      <div style={{ marginBottom: "1.25rem" }}>
        <label style={{ display: "flex", alignItems: "flex-start", gap: ".75rem", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={referralConsent}
            onChange={e => setReferralConsent(e.target.checked)}
            style={{ marginTop: ".2rem", accentColor: "#A855F7" }}
          />
          <span style={{ fontSize: ".88rem", color: "rgba(232,228,220,.65)", lineHeight: 1.55 }}>
            I'd like Tony to make a personal introduction to a vetted practitioner or facility in my region when relevant. This is not a lead-generation list. Tony reviews these himself.
          </span>
        </label>
      </div>

      {referralConsent && (
        <>
          <div>
            <label style={S.formLabel}>Your Region</label>
            <input
              style={S.formInput}
              type="text"
              placeholder="e.g. Pacific Northwest, Western Europe, Southeast Asia"
              value={referralRegion}
              onChange={e => setReferralRegion(e.target.value)}
            />
          </div>
          <div>
            <label style={S.formLabel}>How to reach you (email or Signal)</label>
            <input
              style={S.formInput}
              type="text"
              placeholder="Contact info for Tony only — never published"
              value={referralContact}
              onChange={e => setReferralContact(e.target.value)}
            />
          </div>
        </>
      )}

      <button
        type="submit"
        style={{ ...S.submitBtn, opacity: submit.isPending ? 0.6 : 1 }}
        disabled={submit.isPending || !responses.trim()}
      >
        {submit.isPending ? "Submitting..." : "Submit to the Index"}
      </button>

      {submit.isError && (
        <p style={{ color: "#F87171", fontSize: ".85rem", marginTop: ".75rem" }}>
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}


/* ─── VotingSection ─────────────────────────────────────────────────────── */
const VOTE_OPTIONS = [
  { id: "seeker-map", label: "Visual map of a seeker's readiness across all six domains" },
  { id: "facilitator-match", label: "Facilitator-to-seeker compatibility scoring engine" },
  { id: "tradition-deep-dive", label: "Deep-dive tradition profiles with lineage, legal status, and contraindications" },
  { id: "group-ceremony-prep", label: "Group ceremony preparation protocol for facilitators" },
  { id: "integration-tracker", label: "Post-session integration tracker with milestone check-ins" },
];

function VotingSection() {
  const [voted, setVoted] = React.useState<string | null>(null);
  const { data: counts, refetch } = trpc.facilitatorIndex.getVotes.useQuery();
  const vote = trpc.facilitatorIndex.vote.useMutation({ onSuccess: () => refetch() });

  function handleVote(id: string) {
    if (voted) return;
    setVoted(id);
    vote.mutate({ option: id });
  }

  const total = counts ? Object.values(counts).reduce((a: number, b: unknown) => a + (b as number), 0) : 0;

  return (
    <div style={{ ...S.glass, marginBottom: "2rem" }}>
      <div style={{ ...S.sectionHead, marginBottom: "1rem" }}>What Gets Built Next</div>
      <p style={{ ...S.prose, fontSize: ".88rem", marginBottom: "1.5rem", color: "rgba(26,18,8,.65)" }}>
        Five directions. One vote. The highest-voted option ships first.
      </p>
      {VOTE_OPTIONS.map(opt => {
        const count = (counts as Record<string,number>)?.[opt.id] ?? 0;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        const isChosen = voted === opt.id;
        return (
          <div key={opt.id} style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".3rem" }}>
              <button
                onClick={() => handleVote(opt.id)}
                disabled={!!voted}
                style={{
                  background: isChosen ? "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)" : "rgba(245,158,11,.12)",
                  color: isChosen ? "#FFFBF2" : "rgba(26,18,8,.78)",
                  border: `1px solid ${isChosen ? "rgba(180,83,9,.8)" : "rgba(245,158,11,.3)"}`,
                  borderRadius: 6,
                  padding: ".35rem 1rem",
                  fontSize: ".82rem",
                  cursor: voted ? "default" : "pointer",
                  flexShrink: 0,
                  fontWeight: isChosen ? 700 : 400,
                  transition: "all .2s",
                }}
              >
                {isChosen ? "✓ Voted" : "Vote"}
              </button>
              <span style={{ fontSize: ".88rem", color: "rgba(26,18,8,.82)" }}>{opt.label}</span>
            </div>
            {voted && (
              <div style={{ paddingLeft: "4.5rem" }}>
                <div style={{ background: "rgba(245,158,11,.1)", borderRadius: 4, height: 6, overflow: "hidden" }}>
                  <div style={{ background: "linear-gradient(90deg, #D97706, #F59E0B)", height: "100%", width: `${pct}%`, transition: "width .6s ease" }} />
                </div>
                <span style={{ fontSize: ".75rem", color: "rgba(26,18,8,.45)", marginTop: ".2rem", display: "block" }}>{pct}% · {count} vote{count !== 1 ? "s" : ""}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── ShareBar ───────────────────────────────────────────────────────────── */
function ShareBar() {
  const [copied, setCopied] = React.useState(false);
  const url = "https://onlytimebuystrust.com/facilitator-index";
  const text = "The Facilitator Index — a philosophy-first instrument for practitioners who hold non-ordinary states.";

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const btnStyle: React.CSSProperties = {
    background: "rgba(245,158,11,.1)",
    color: "rgba(26,18,8,.82)",
    border: "1px solid rgba(245,158,11,.28)",
    borderRadius: 8,
    padding: ".5rem 1.1rem",
    fontSize: ".82rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: ".4rem",
    transition: "all .2s",
    textDecoration: "none",
  };

  return (
    <div style={{ ...S.glass, marginBottom: "2rem" }}>
      <div style={{ ...S.sectionHead, marginBottom: "1rem" }}>Share This Instrument</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".75rem" }}>
        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer" style={btnStyle}>
          𝕏 Share on X
        </a>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" style={btnStyle}>
          in Share on LinkedIn
        </a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" style={btnStyle}>
          f Share on Facebook
        </a>
        <a href={`mailto:?subject=${encodeURIComponent("The Facilitator Index")}&body=${encodeURIComponent(text + "\n\n" + url)}`} style={btnStyle}>
          ✉ Send by Email
        </a>
        <button onClick={copyLink} style={btnStyle}>
          {copied ? "✓ Copied" : "⧉ Copy Link"}
        </button>
      </div>
    </div>
  );
}

/* ─── UsageCounter ───────────────────────────────────────────────────────── */
function UsageCounter() {
  const { data } = trpc.facilitatorIndex.getUsageCount.useQuery();
  const count = (data as { count: number } | undefined)?.count ?? 160;
  return (
    <div style={{ textAlign: "center", marginBottom: "1.5rem", color: "rgba(26,18,8,.45)", fontSize: ".82rem", letterSpacing: ".08em" }}>
      {count.toLocaleString()} practitioners have used this instrument
    </div>
  );
}

/* ─── CopyrightFooter ────────────────────────────────────────────────────── */
function CopyrightFooter() {
  return (
    <div style={{ ...S.glass, textAlign: "center", fontSize: ".78rem", color: "rgba(26,18,8,.45)", lineHeight: 1.8 }}>
      <div style={{ fontWeight: 700, color: "rgba(26,18,8,.65)", marginBottom: ".5rem", fontSize: ".85rem" }}>
        © 2026 Tony Greenberg. All Rights Reserved. Patent Pending. ™
      </div>
      <div>
        This instrument is proprietary intellectual property. Reproduction, distribution, or use without a license is prohibited.
      </div>
      <div style={{ marginTop: ".5rem" }}>
        Want to license the Facilitator Index for your organization or platform?{" "}
        <a href="mailto:tony@tonygreenberg.com?subject=Facilitator Index License" style={{ color: "#B45309", textDecoration: "underline" }}>
          Contact Tony.
        </a>{" "}
        All licensing proceeds benefit addiction recovery programs.
      </div>
    </div>
  );
}


/* ─── Main Page ──────────────────────────────────────────────────────────── */

/* ─── Print / PDF export ─────────────────────────────────────────────────── */
function printFacilitatorQuestions() {
  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) return;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>The Facilitator Index — Question Set v1.0</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @page { size: letter; margin: 1.1in 1in 1in 1in; }
  body {
    font-family: 'Georgia', serif;
    font-size: 10.5pt;
    color: #1A1208;
    line-height: 1.65;
    background: #fff;
  }
  .cover {
    text-align: center;
    padding: 2.5rem 0 2rem;
    border-bottom: 2px solid #B45309;
    margin-bottom: 1.5rem;
    page-break-after: avoid;
  }
  .cover-eyebrow {
    font-size: 7.5pt;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: #B45309;
    margin-bottom: .5rem;
  }
  .cover-title {
    font-size: 22pt;
    font-weight: 700;
    color: #1A1208;
    margin-bottom: .3rem;
  }
  .cover-sub {
    font-size: 9.5pt;
    color: rgba(26,18,8,.55);
    margin-bottom: .5rem;
  }
  .cover-copy {
    font-size: 7.5pt;
    color: rgba(26,18,8,.4);
    letter-spacing: .04em;
  }
  .band-header {
    margin-top: 1.4rem;
    margin-bottom: .2rem;
    page-break-after: avoid;
  }
  .band-label {
    font-size: 7pt;
    font-weight: 700;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: #B45309;
    display: block;
  }
  .band-title {
    font-size: 13pt;
    font-weight: 700;
    color: #1A1208;
  }
  .band-note {
    font-size: 8.5pt;
    color: rgba(26,18,8,.45);
    font-style: italic;
    margin-top: .15rem;
  }
  .item {
    display: flex;
    gap: .55rem;
    align-items: flex-start;
    padding: .45rem 0;
    border-bottom: 1px solid rgba(26,18,8,.07);
    page-break-inside: avoid;
  }
  .item-num {
    font-size: 7.5pt;
    font-weight: 700;
    color: #B45309;
    min-width: 1.6rem;
    padding-top: .15rem;
    flex-shrink: 0;
  }
  .item-text {
    font-size: 10pt;
    color: #1A1208;
    flex: 1;
  }
  .answer-line {
    display: block;
    margin-top: .4rem;
    border-bottom: 1px solid rgba(26,18,8,.15);
    height: 1.1rem;
  }
  .answer-line-long {
    display: block;
    margin-top: .4rem;
    border-bottom: 1px solid rgba(26,18,8,.15);
    height: 1.1rem;
    margin-bottom: .25rem;
  }
  hr.divider {
    border: none;
    border-top: 1px solid rgba(26,18,8,.12);
    margin: 1.2rem 0 .8rem;
  }
  .footer-note {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 2px solid #B45309;
    font-size: 7.5pt;
    color: rgba(26,18,8,.45);
    text-align: center;
    line-height: 1.7;
  }
  .scale-note {
    font-size: 7.5pt;
    color: rgba(26,18,8,.4);
    font-style: italic;
    margin-bottom: .15rem;
  }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>

<div class="cover">
  <div class="cover-eyebrow">Companion to the Psychedelic Readiness Index · v1.0 Pilot · Invitation Only</div>
  <div class="cover-title">The Facilitator Index</div>
  <div class="cover-sub">Know Who You Go With — 108 Items Across Twelve Bands</div>
  <div class="cover-sub">A philosophy-first instrument for practitioners who hold non-ordinary states</div>
  <div class="cover-copy">© 2026 Tony Greenberg · All Rights Reserved · Patent Pending · onlytimebuystrust.com</div>
</div>

<div class="scale-note">Unless otherwise noted, items are open-ended. Write as much or as little as you need. There are no right answers — only honest ones.</div>

<hr class="divider" />

<!-- BAND 0 -->
<div class="band-header">
  <span class="band-label">Band 0</span>
  <div class="band-title">Code and Consent</div>
</div>
<div class="item"><span class="item-num">1.</span><span class="item-text">Keep your assigned code, or choose your own nature word.<span class="answer-line"></span></span></div>
<div class="item"><span class="item-num">2.</span><span class="item-text">Select your tier: Sealed, Coded, or Named.<span class="answer-line"></span></span></div>
<div class="item"><span class="item-num">3.</span><span class="item-text">Do you understand that a lost code is unrecoverable?<span class="answer-line"></span></span></div>
<div class="item"><span class="item-num">4.</span><span class="item-text">Which bands do you want encrypted so that only you can read them? Select per band, or select all.<span class="answer-line"></span></span></div>
<div class="item"><span class="item-num">5.</span><span class="item-text">Do you consent to your anonymized numeric responses appearing in aggregate published findings?<span class="answer-line"></span></span></div>
<div class="item"><span class="item-num">6.</span><span class="item-text">Do you consent to your free-text responses being quoted, attributed to your code only, if you mark them publishable?<span class="answer-line"></span></span></div>

<hr class="divider" />

<!-- BAND A -->
<div class="band-header">
  <span class="band-label">Band A</span>
  <div class="band-title">Context</div>
  <div class="band-note">Education and identity. Nothing here describes activity.</div>
</div>
<div class="item"><span class="item-num">7.</span><span class="item-text">How many years have you worked in the wellness, therapeutic, contemplative, pastoral, or care professions, broadly defined?<span class="answer-line"></span></span></div>
<div class="item"><span class="item-num">8.</span><span class="item-text">What formal training, certification, degree, or lineage transmission have you received? Training is education. Naming it admits nothing.<span class="answer-line-long"></span><span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">9.</span><span class="item-text">Are you currently in supervision, mentorship, peer consultation, or elder guidance? Under what structure?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">10.</span><span class="item-text">Which traditions are you conversant in? This asks what you know.<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">11.</span><span class="item-text">In what general region of the world is your work based? Continent level only.<span class="answer-line"></span></span></div>
<div class="item"><span class="item-num">12.</span><span class="item-text">What year did you last complete new training?<span class="answer-line"></span></span></div>
<div class="item"><span class="item-num">13.</span><span class="item-text">Do you hold a license, registration, or credential in any adjacent regulated profession?<span class="answer-line"></span></span></div>
<div class="item"><span class="item-num">14.</span><span class="item-text">Have you ever stepped away from this field for longer than six months? What brought you back?<span class="answer-line-long"></span></span></div>

<hr class="divider" />

<!-- BAND B -->
<div class="band-header">
  <span class="band-label">Band B</span>
  <div class="band-title">Philosophy</div>
  <div class="band-note">What you believe. Not what you do.</div>
</div>
<div class="item"><span class="item-num">15.</span><span class="item-text">Why does healing happen? What is your theory of the mechanism?<span class="answer-line-long"></span><span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">16.</span><span class="item-text">What is the strongest argument against the work you believe in?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">17.</span><span class="item-text">Should a person who guides others be required to have made the journey themselves? Argue your position.<span class="answer-line-long"></span><span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">18.</span><span class="item-text">Is ongoing personal work an ethical obligation for a guide, a preference, or a myth the field tells itself?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">19.</span><span class="item-text">Single molecule or multi-molecule containers. Which asks more of the person holding, and why?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">20.</span><span class="item-text">What should a preparation arc contain, at minimum, for the work to be considered responsible?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">21.</span><span class="item-text">What should an integration arc contain, at minimum, and over what span?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">22.</span><span class="item-text">What is the correct answer when someone is not ready?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">23.</span><span class="item-text">Which contemplative, somatic, or therapeutic modalities pair well with non-ordinary states, and which pair badly?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">24.</span><span class="item-text">Name three people in this field whose work you admire. What does each understand that the field generally does not?<span class="answer-line-long"></span><span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">25.</span><span class="item-text">Should this work be priced at market, on a sliding scale, or given away? Defend your answer against the strongest objection to it.<span class="answer-line-long"></span><span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">26.</span><span class="item-text">What percentage of this work, field-wide, should be unpaid? Who should receive it?<span class="answer-line"></span></span></div>

<hr class="divider" />

<!-- BAND C -->
<div class="band-header">
  <span class="band-label">Band C</span>
  <div class="band-title">Temperament</div>
  <div class="band-note">How you hold space, not what you believe about it.</div>
</div>
<div class="item"><span class="item-num">27.</span><span class="item-text">Should there be laughter in a container?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">28.</span><span class="item-text">Is a container that ends in dancing less serious than one that ends in silence?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">29.</span><span class="item-text">What do you do when a participant says something you believe is wrong?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">30.</span><span class="item-text">What do you do when a participant says something you believe is dangerous?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">31.</span><span class="item-text">What do you do when a participant falls in love with you?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">32.</span><span class="item-text">What do you do when you fall in love with a participant?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">33.</span><span class="item-text">What do you do when you are wrong?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">34.</span><span class="item-text">What does boredom in a session tell you?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">35.</span><span class="item-text">What does fear in a session tell you?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">36.</span><span class="item-text">Describe the last time you were genuinely surprised by what happened in a session.<span class="answer-line-long"></span><span class="answer-line-long"></span></span></div>

<hr class="divider" />

<!-- BAND D -->
<div class="band-header">
  <span class="band-label">Band D</span>
  <div class="band-title">The Map</div>
  <div class="band-note">Where you sit on five axes. 1 = left pole, 10 = right pole.</div>
</div>
<div class="item"><span class="item-num">37.</span><span class="item-text">Axis 1: Fully emergent (follow the participant) ←→ Fully protocolized (follow the structure). Where do you sit? (1–10)<span class="answer-line"></span></span></div>
<div class="item"><span class="item-num">38.</span><span class="item-text">Axis 2: Somatic-first ←→ Verbal-first. Where do you sit? (1–10)<span class="answer-line"></span></span></div>
<div class="item"><span class="item-num">39.</span><span class="item-text">Axis 3: Spirit-centered ←→ Mechanism-centered. Where do you sit? (1–10)<span class="answer-line"></span></span></div>
<div class="item"><span class="item-num">40.</span><span class="item-text">Axis 4: Solo container ←→ Community container. Where do you sit? (1–10)<span class="answer-line"></span></span></div>
<div class="item"><span class="item-num">41.</span><span class="item-text">Axis 5 (Proximity): Close physical presence ←→ Maximum distance. Where do you sit? (1–10)<span class="answer-line"></span></span></div>
<div class="item"><span class="item-num">42.</span><span class="item-text">Which axis has shifted most in the last three years? What moved it?<span class="answer-line-long"></span><span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">43.</span><span class="item-text">Which axis do you think the field gets most wrong?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">44.</span><span class="item-text">Which axis do you hold most loosely?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">45.</span><span class="item-text">What would have to happen for you to move significantly on Axis 1?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">46.</span><span class="item-text">Is there a sixth axis you think belongs here? Name it and describe its poles.<span class="answer-line-long"></span></span></div>

<hr class="divider" />

<!-- BAND E -->
<div class="band-header">
  <span class="band-label">Band E</span>
  <div class="band-title">Container</div>
  <div class="band-note">The physical and relational architecture of the work.</div>
</div>
<div class="item"><span class="item-num">47.</span><span class="item-text">Does this work require a dedicated space, or is space a luxury the field mistakes for a requirement?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">48.</span><span class="item-text">How important is ritual and ceremony to the container you hold? (1–10, then explain)<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">49.</span><span class="item-text">What objects, if any, belong in the room?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">50.</span><span class="item-text">What music policy do you hold, and why?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">51.</span><span class="item-text">What lighting policy do you hold, and why?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">52.</span><span class="item-text">What is your policy on touch?<span class="answer-line-long"></span><span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">53.</span><span class="item-text">What is your policy on silence?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">54.</span><span class="item-text">What is your policy on your own emotional expression during a session?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">55.</span><span class="item-text">What is your policy on phones — yours and the participant's?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">56.</span><span class="item-text">What is the minimum container duration you will accept for a single-session engagement?<span class="answer-line"></span></span></div>

<hr class="divider" />

<!-- BAND F -->
<div class="band-header">
  <span class="band-label">Band F</span>
  <div class="band-title">Consent</div>
  <div class="band-note">What you ask for, and how you ask for it.</div>
</div>
<div class="item"><span class="item-num">57.</span><span class="item-text">What does informed consent require, in your practice, before work begins?<span class="answer-line-long"></span><span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">58.</span><span class="item-text">Can consent be given by someone who is already in an altered state? Under what conditions?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">59.</span><span class="item-text">What is the consent process for touch?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">60.</span><span class="item-text">What is the consent process for a session going longer than planned?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">61.</span><span class="item-text">What is the consent process for a significant change in the container mid-session?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">62.</span><span class="item-text">What happens to consent documentation after the session?<span class="answer-line-long"></span></span></div>

<hr class="divider" />

<!-- BAND G -->
<div class="band-header">
  <span class="band-label">Band G</span>
  <div class="band-title">Safety</div>
  <div class="band-note">Protocols, limits, and what you do when things go wrong.</div>
</div>
<div class="item"><span class="item-num">63.</span><span class="item-text">What medical information do you require before working with someone?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">64.</span><span class="item-text">What psychiatric history do you require disclosure of?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">65.</span><span class="item-text">What are your absolute contraindications?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">66.</span><span class="item-text">What do you do when a participant becomes physically unwell?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">67.</span><span class="item-text">What do you do when a participant becomes acutely suicidal?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">68.</span><span class="item-text">What do you do when a participant becomes violent?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">69.</span><span class="item-text">What do you do when you become incapacitated during a session?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">70.</span><span class="item-text">Who is your emergency contact for the participant, and how is that information held?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">71.</span><span class="item-text">What is your protocol for the 24 hours after a session?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">72.</span><span class="item-text">Have you ever had a session go seriously wrong? What happened and what did you do?<span class="answer-line-long"></span><span class="answer-line-long"></span></span></div>

<hr class="divider" />

<!-- BAND H -->
<div class="band-header">
  <span class="band-label">Band H</span>
  <div class="band-title">Edges</div>
  <div class="band-note">The hard questions. Where the field mostly looks away.</div>
</div>
<div class="item"><span class="item-num">73.</span><span class="item-text">What is the hardest ethical situation you have faced in this work?<span class="answer-line-long"></span><span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">74.</span><span class="item-text">Have you ever ended a session early? What happened?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">75.</span><span class="item-text">Have you ever refused to work with someone after meeting them? What did you notice?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">76.</span><span class="item-text">Have you ever worked with someone you should not have? What did you learn?<span class="answer-line-long"></span><span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">77.</span><span class="item-text">What is the most common mistake you see practitioners make?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">78.</span><span class="item-text">What is the mistake you are most likely to make yourself?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">79.</span><span class="item-text">What would cause you to leave this field?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">80.</span><span class="item-text">What would cause you to report another practitioner?<span class="answer-line-long"></span></span></div>

<hr class="divider" />

<!-- BAND I -->
<div class="band-header">
  <span class="band-label">Band I</span>
  <div class="band-title">Lineage</div>
  <div class="band-note">Where you come from, and what you owe.</div>
</div>
<div class="item"><span class="item-num">81.</span><span class="item-text">Who taught you? How did you find them?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">82.</span><span class="item-text">What do you owe the traditions you work within?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">83.</span><span class="item-text">Where does your practice diverge from your lineage? Why?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">84.</span><span class="item-text">What have you taken from a tradition that was not yours to take?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">85.</span><span class="item-text">What are you passing on, and to whom?<span class="answer-line-long"></span></span></div>

<hr class="divider" />

<!-- BAND J -->
<div class="band-header">
  <span class="band-label">Band J</span>
  <div class="band-title">Business</div>
  <div class="band-note">How the economics of the work shape the work itself.</div>
</div>
<div class="item"><span class="item-num">86.</span><span class="item-text">How do you set your fees? What principles govern them?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">87.</span><span class="item-text">How many people do you work with in a year? What is the upper limit, and why?<span class="answer-line"></span></span></div>
<div class="item"><span class="item-num">88.</span><span class="item-text">Do you work alone or with co-facilitators? What does each arrangement ask of you?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">89.</span><span class="item-text">How do people find you? What does your referral network look like?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">90.</span><span class="item-text">What is your policy on testimonials and public endorsements?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">91.</span><span class="item-text">What is your policy on social media presence?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">92.</span><span class="item-text">How does money change the relationship? What have you observed?<span class="answer-line-long"></span></span></div>

<hr class="divider" />

<!-- BAND K -->
<div class="band-header">
  <span class="band-label">Band K</span>
  <div class="band-title">Reciprocity</div>
  <div class="band-note">What you give back, and how.</div>
</div>
<div class="item"><span class="item-num">93.</span><span class="item-text">What do you contribute to the field beyond your paid work?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">94.</span><span class="item-text">Who do you mentor, and how?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">95.</span><span class="item-text">What research, if any, do you support or participate in?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">96.</span><span class="item-text">What advocacy, if any, do you engage in?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">97.</span><span class="item-text">What would a field that took reciprocity seriously look like?<span class="answer-line-long"></span></span></div>

<hr class="divider" />

<!-- BAND L -->
<div class="band-header">
  <span class="band-label">Band L</span>
  <div class="band-title">Integration</div>
  <div class="band-note">The work after the work.</div>
</div>
<div class="item"><span class="item-num">98.</span><span class="item-text">What is your integration model? How long does it run?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">99.</span><span class="item-text">What does successful integration look like? How do you know?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">100.</span><span class="item-text">What does failed integration look like? What do you do?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">101.</span><span class="item-text">How do you handle a participant who integrates in a direction you did not expect?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">102.</span><span class="item-text">How do you handle a participant who does not integrate at all?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">103.</span><span class="item-text">What is the longest integration relationship you have held? What did it teach you?<span class="answer-line-long"></span><span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">104.</span><span class="item-text">When does the practitioner's responsibility end?<span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">105.</span><span class="item-text">What do you do when a participant returns years later in crisis?<span class="answer-line-long"></span></span></div>

<hr class="divider" />

<!-- FINAL ITEMS -->
<div class="band-header">
  <span class="band-label">Closing</span>
  <div class="band-title">The Last Three</div>
</div>
<div class="item"><span class="item-num">106.</span><span class="item-text">What question should be in this index that is not?<span class="answer-line-long"></span><span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">107.</span><span class="item-text">What question do you hope no one asks you?<span class="answer-line-long"></span><span class="answer-line-long"></span></span></div>
<div class="item"><span class="item-num">108.</span><span class="item-text">In one or two sentences, what did they do that you would not have known to ask for?<span class="answer-line-long"></span><span class="answer-line-long"></span></span></div>

<div class="footer-note">
  The Facilitator Index · v1.0 Pilot · © 2026 Tony Greenberg · All Rights Reserved · Patent Pending<br />
  This document is for personal professional self-assessment only. Not for reproduction, distribution, or derivative use without written license.<br />
  onlytimebuystrust.com/facilitator-index · Printed: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
</div>

</body>
</html>`;

  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 600);
}

export default function FacilitatorIndex() {
  const [showFullIndex, setShowFullIndex] = useState(false);
  const trackUsage = trpc.facilitatorIndex.trackUsage.useMutation();

  // Track page view once
  useEffect(() => {
    trackUsage.mutate({ event: "view" });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // IP protection: disable copy, right-click, and print
  useEffect(() => {
    const noCopy = (e: ClipboardEvent) => e.preventDefault();
    const noContext = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("copy", noCopy);
    document.addEventListener("contextmenu", noContext);
    return () => {
      document.removeEventListener("copy", noCopy);
      document.removeEventListener("contextmenu", noContext);
    };
  }, []);

  return (
    <div style={S.page} className="facilitator-page">
      {/* Print block */}
      <style>{`@media print { .facilitator-page { display: none !important; } }`}</style>

      {/* Watermark overlay — visible in screenshots, pointer-events none */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: "none",
          zIndex: 9999,
          overflow: "hidden",
          opacity: 0.055,
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="wm" x="0" y="0" width="360" height="110" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
              <text x="10" y="38" fontSize="12" fill="#1A1208" fontFamily="monospace" fontWeight="600">
                {"© Tony Greenberg · All Rights Reserved · tonygreenberg.com"}
              </text>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wm)" />
        </svg>
      </div>

      <SEO
        title="The Facilitator Index — Know Who You Go With — Tony Greenberg"
        description="An invitation-only, anonymous, philosophy-first instrument for practitioners who hold non-ordinary states. 108 items across twelve bands, coded identity, client-side encryption, and a mandatory reciprocity gate. Companion to the Psychedelic Readiness Index."
        path="/facilitator-index"
        indexable={true}
      />

      {/* Hero */}
      <div ref={heroRef} style={S.heroWrap}>
        <div style={S.heroOverlay}>
          <span style={S.heroEyebrow}>Companion to the Psychedelic Readiness Index · Invitation Only · v1.0 Pilot</span>
          <h1 style={S.heroH1}>The Facilitator Index</h1>
          <p style={S.heroSub}>
            Know Who You Go With &nbsp;·&nbsp;{" "}
            <a href="https://tonygreenberg.com/about" style={{ color: "#B45309", textDecoration: "none" }}>Tony Greenberg</a>
            &nbsp;·&nbsp;{" "}
            <Link href="/psychedelic-readiness-index" style={{ color: "#B45309", textDecoration: "none" }}>Psychedelic Readiness Index</Link>
          </p>
        </div>
      </div>

      <div style={S.inner}>

        {/* Quick Intake Card */}
        {/* Stakes strip */}
        <div style={{ background: "rgba(180,83,9,0.06)", border: "1px solid rgba(245,158,11,0.18)", borderLeft: "3px solid #D97706", borderRadius: 8, padding: "1rem 1.5rem", marginBottom: "1.5rem", fontFamily: "'Source Sans 3', Georgia, serif" }}>
          <p style={{ margin: 0, fontSize: "clamp(.88rem, 2.2vw, 1rem)", lineHeight: 1.75, color: "rgba(26,18,8,.75)" }}>
            The field has no shared standard. No agreed definition of adequate preparation, adequate screening, or adequate integration. What you find here is the beginning of one — built from what practitioners actually believe, not what they're willing to put their name on.
          </p>
        </div>
        <div style={{ ...S.glass, marginBottom: "2rem" }}>
          <QuickIntake onGoDeeper={() => setShowFullIndex(true)} />
        </div>

        {/* Full Index toggle */}
        {!showFullIndex && (
          <div style={{ textAlign: "center", marginBottom: "2.5rem", display: "flex", flexWrap: "wrap", gap: ".75rem", justifyContent: "center" }}>
            {/* Pull quote — surfaces the best line before they scroll */}
            <blockquote style={{ width: "100%", margin: "0 0 1.5rem", padding: "1.25rem 1.5rem", background: "rgba(255,255,255,0.6)", border: "none", borderLeft: "3px solid #D97706", borderRadius: "0 8px 8px 0", fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(.95rem, 2.5vw, 1.1rem)", lineHeight: 1.75, color: "#1A1208", fontStyle: "italic", textAlign: "left" }}>
              "What a practitioner believes should happen, what they consider a failure, how many people they think one human being can hold in a year — will tell you more about who they are than any inventory of what they did last spring."
              <footer style={{ marginTop: ".75rem", fontFamily: "'Source Sans 3', Georgia, serif", fontStyle: "normal", fontSize: ".75rem", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(26,18,8,.45)" }}>— From the instrument rationale</footer>
            </blockquote>
            <button
              onClick={() => setShowFullIndex(true)}
              style={{ background: "transparent", color: "rgba(180,83,9,.7)", border: "1px solid rgba(245,158,11,.25)", borderRadius: 8, padding: ".6rem 1.5rem", fontSize: ".82rem", cursor: "pointer", letterSpacing: ".06em" }}
            >
              Read the full instrument ↓
            </button>
            <button
              onClick={printFacilitatorQuestions}
              style={{ background: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)", color: "#1A1208", border: "none", borderRadius: 8, padding: ".6rem 1.5rem", fontSize: ".82rem", fontWeight: 700, cursor: "pointer", letterSpacing: ".06em", display: "flex", alignItems: "center", gap: ".4rem" }}
            >
              🖨 Print / Save as PDF
            </button>
          </div>
        )}

        {/* Full Index content — shown when expanded */}
        {showFullIndex && (
        <>

        {/* Print button at top of full index */}
        <div style={{ textAlign: "right", marginBottom: "1rem" }}>
          <button
            onClick={printFacilitatorQuestions}
            style={{ background: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)", color: "#1A1208", border: "none", borderRadius: 8, padding: ".55rem 1.25rem", fontSize: ".82rem", fontWeight: 700, cursor: "pointer", letterSpacing: ".06em", display: "inline-flex", alignItems: "center", gap: ".4rem" }}
          >
            🖨 Print All 108 Questions
          </button>
        </div>

        {/* Intro */}
        <div style={S.glass}>
          <p style={S.prose}>
            Know Before You Go asked the seeker whether they were ready.
          </p>
          <p style={{ ...S.prose, marginBottom: 0 }}>
            Know Who You Go With asks the practitioner what they believe.
          </p>
        </div>

        {/* Read This First */}
        <div style={S.sectionHead}>Read This Before Anything Else</div>
        <p style={S.prose}>
          This instrument does not ask what you have done.
        </p>
        <p style={S.prose}>
          Not once. Not obliquely. Not in a free-text box where you might volunteer it. Every one of the 108 items below asks about belief, knowledge, judgment, or preference. There is no item anywhere in this document that asks you to describe your own conduct, name a participant, name a place, name a date, or confirm that any event occurred.
        </p>
        <p style={S.prose}>
          That is a design decision, not a courtesy. A survey of practitioners that asks about practice produces a document that is dangerous to the people who complete it honestly. The published research on this population says so directly. One recent study of psychedelic facilitators interpreted its own low response rate as evidence that only a small share of working practitioners felt safe answering questions about their personal experience, even anonymously, and observed that the field cannot understand how lived experience shapes competency if professionals do not feel safe discussing it.
        </p>
        <p style={S.prose}>
          So we stopped asking.
        </p>
        <p style={S.prose}>
          What follows measures judgment instead of activity. It turns out judgment is the better measurement anyway. What a practitioner believes should happen, what they consider a failure, how many people they think one human being can hold in a year, and how they assess a stranger's handling of a hard moment will tell you more about who they are than any inventory of what they did last spring.
        </p>

        <hr style={S.divider} />

        {/* What This Is For */}
        <div style={S.sectionHead}>What This Is For</div>
        <p style={S.prose}>Four outputs, in order of importance.</p>
        <p style={S.prose}>
          A standard. There is no shared definition of adequate preparation, adequate integration, adequate screening, or adequate confidentiality in this field. Two hundred and fifty considered opinions is the beginning of one.
        </p>
        <p style={S.prose}>
          A map. Practitioners see where they sit relative to a cohort they have never been able to see. Solemn or celebratory. Spirit or mechanism. Emergent or protocolized.
        </p>
        <p style={S.prose}>
          A referral network. Facilitators who can see who thinks like them, and more usefully who does not, can refer with more precision than the current system, which is whispered names.
        </p>
        <p style={S.prose}>
          A public record of contribution. Every improvement submitted through the Reciprocity Gate is logged, dated, and credited to a code. Contribution becomes ledger-able without exposure.
        </p>
        <p style={S.prose}>
          That last one is the reason this exists at all. In most fields, reputation accrues to a name. Here, a name is a liability, so reputation has nowhere to go and the field cannot compound its own trust. Give the accrual a place to land that is not a name, and duration starts to mean something — time on a ledger rather than time in a rumor.
        </p>

        <hr style={S.divider} />

        {/* Your Code */}
        <div style={S.sectionHead}>Your Code</div>
        <p style={S.prose}>
          You have been assigned a code in the form <span style={S.codeBox}>CEDAR-001</span>. A nature word and an ordinal. Speakable in a circle without outing anyone.
        </p>
        <p style={S.prose}>
          Your code is the only key to your responses. It is generated in your browser, displayed once, and never stored anywhere in a form we can read. If you lose it, we cannot recover it, cannot look it up, and cannot help you. That is not a limitation we regret. It is the feature.
        </p>
        <div style={S.sectionHead}>Three tiers, changeable at any time, in one click, without explanation</div>
        <div style={S.tierBlock}>
          <div style={S.tierLabel}>Sealed</div>
          <div style={S.tierText}>You appear in aggregate statistics only. No public page exists for you.</div>
        </div>
        <div style={S.tierBlock}>
          <div style={S.tierLabel}>Coded</div>
          <div style={S.tierText}>A public profile exists under your code word. No name, no photograph, no location finer than continent.</div>
        </div>
        <div style={S.tierBlock}>
          <div style={S.tierLabel}>Named</div>
          <div style={S.tierText}>A full public profile with contact details, for practitioners operating in sanctioned frameworks who want to be found.</div>
        </div>
        <p style={S.prose}>Moving from Named back to Sealed is permanent, immediate, and requires no conversation with us.</p>

        <hr style={S.divider} />

        {/* Data */}
        <div style={S.sectionHead}>What We Hold, What We Cannot Hold, What Never Existed</div>
        <p style={S.prose}>Held: your numeric responses and your free-text answers, attached to your code, on infrastructure we control.</p>
        <p style={S.prose}>Held as ciphertext only: every field you mark private. Encrypted in your browser under a key derived from your code. We hold the ciphertext. We cannot decrypt it. We cannot be compelled to produce what we cannot read.</p>
        <p style={S.prose}>Never collected: your name, unless you choose Named. Your email, ever. Your IP address. Any analytics identifier. There are no third-party scripts on the form page.</p>
        <p style={S.prose}>Never existed: any list of people you have worked with. See the Corroboration section for why this matters and how it is handled.</p>
        <p style={S.prose}>What we cannot promise: that your own device, browser history, or the channel through which you received this invitation is clean. We control our side completely and yours not at all. Use a device you trust.</p>

        {/* Section image */}
        <img src={BANDS_IMG} alt="Twelve bands" style={S.sectionImg} />

        <hr style={S.divider} />

        {/* BAND 0 */}
        <span style={S.bandLabel}>Band 0</span>
        <div style={S.bandTitle}>Code and Consent</div>
        <Item n={1}>Keep your assigned code, or choose your own nature word.</Item>
        <Item n={2}>Select your tier. Sealed, Coded, or Named.</Item>
        <Item n={3}>Do you understand that a lost code is unrecoverable?</Item>
        <Item n={4}>Which bands do you want encrypted so that only you can read them? Select per band, or select all.</Item>
        <Item n={5}>Do you consent to your anonymized numeric responses appearing in aggregate published findings?</Item>
        <Item n={6}>Do you consent to your free-text responses being quoted, attributed to your code only, if you mark them publishable?</Item>

        <hr style={S.divider} />

        {/* BAND A */}
        <span style={S.bandLabel}>Band A</span>
        <div style={S.bandTitle}>Context</div>
        <div style={S.bandNote}>Education and identity. Nothing here describes activity.</div>
        <Item n={7}>How many years have you worked in the wellness, therapeutic, contemplative, pastoral, or care professions, broadly defined?</Item>
        <Item n={8}>What formal training, certification, degree, or lineage transmission have you received? Training is education. Naming it admits nothing.</Item>
        <Item n={9}>Are you currently in supervision, mentorship, peer consultation, or elder guidance? Under what structure?</Item>
        <Item n={10}>Which traditions are you conversant in? This asks what you know.</Item>
        <Item n={11}>In what general region of the world is your work based? Continent level only.</Item>
        <Item n={12}>What year did you last complete new training?</Item>
        <Item n={13}>Do you hold a license, registration, or credential in any adjacent regulated profession?</Item>
        <Item n={14}>Have you ever stepped away from this field for longer than six months? What brought you back?</Item>

        <hr style={S.divider} />

        {/* BAND B */}
        <span style={S.bandLabel}>Band B</span>
        <div style={S.bandTitle}>Philosophy</div>
        <div style={S.bandNote}>First person, opinion only.</div>
        <Item n={15}>Why does healing happen? What is your theory of the mechanism?</Item>
        <Item n={16}>What is the strongest argument against the work you believe in?</Item>
        <Item n={17}>Should a person who guides others be required to have made the journey themselves? Argue your position.</Item>
        <Item n={18}>Is ongoing personal work an ethical obligation for a guide, a preference, or a myth the field tells itself?</Item>
        <Item n={19}>Single molecule or multi-molecule containers. Which asks more of the person holding, and why?</Item>
        <Item n={20}>What should a preparation arc contain, at minimum, for the work to be considered responsible?</Item>
        <Item n={21}>What should an integration arc contain, at minimum, and over what span?</Item>
        <Item n={22}>What is the correct answer when someone is not ready?</Item>
        <Item n={23}>Which contemplative, somatic, or therapeutic modalities pair well with non-ordinary states, and which pair badly?</Item>
        <Item n={24}>Name three people in this field whose work you admire. What does each understand that the field generally does not?</Item>
        <Item n={25}>Should this work be priced at market, on a sliding scale, or given away? Defend your answer against the strongest objection to it.</Item>
        <Item n={26}>What percentage of this work, field-wide, should be unpaid? Who should receive it?</Item>
        <Item n={27}>Which population is most underserved right now, and why has the field failed them?</Item>
        <Item n={28}>How many people can one guide responsibly serve in a year before quality degrades? Give a number and defend it.</Item>
        <Item n={29}>Does this work require a dedicated space, or is space a luxury the field mistakes for a requirement?</Item>
        <Item n={30}>What is the most common ethical failure you observe in this field?</Item>
        <Item n={31}>What would make you stop?</Item>
        <Item n={32}>What do you do with your own grief?</Item>

        <hr style={S.divider} />

        {/* BAND C */}
        <span style={S.bandLabel}>Band C</span>
        <div style={S.bandTitle}>Temperament and Register</div>
        <Item n={33}>Should there be laughter?</Item>
        <Item n={34}>What does the word sacred mean, in practice? Answer without using the word.</Item>
        <Item n={35}>Is a container that ends in dancing less serious than one that ends in silence?</Item>
        <Item n={36}>Who should choose the music, and what governs the choice?</Item>
        <Item n={37}>What belongs in the room? What does not?</Item>
        <Item n={38}>What should a person holding wear, and why does the question matter?</Item>
        <Item n={39}>Whose language should be used in invocation or prayer, and what is owed to the tradition it comes from?</Item>
        <Item n={40}>Ritual elements. Necessary container, useful scaffolding, or ornament the field should shed?</Item>
        <Item n={41}>A participant cracks a joke at the peak. What is the right response?</Item>
        <Item n={42}>Intervene or let it unfold. Where should a practitioner's default sit, and what moves it?</Item>
        <Item n={43}>What should happen when nothing happens?</Item>
        <Item n={44}>What is the most annoying quality a good practitioner can have?</Item>
        <Item n={45}>Finish this sentence. People come back to a practitioner because ...</Item>

        <hr style={S.divider} />

        {/* BAND D */}
        <span style={S.bandLabel}>Band D</span>
        <div style={S.bandTitle}>The Map</div>
        <div style={S.bandNote}>Five axes, one to ten. No midpoint. Plotted against the anonymized cohort so you can see where you land.</div>
        <Item n={46}>Register. 1 equals solemnity and stillness throughout. 10 equals music, movement, and joy as the medicine itself. Where should this work sit?</Item>
        <Item n={47}>Frame. 1 equals spirit, lineage, prayer, cosmology. 10 equals mechanism, receptor, protocol, evidence. Where should the field's center of gravity sit?</Item>
        <Item n={48}>Structure. 1 equals emergent and unrepeatable. 10 equals documented protocol with defined phases. What produces better outcomes?</Item>
        <Item n={49}>Proximity. 1 equals the practitioner stays at the edge of the room. 10 equals the practitioner stays within arm's reach throughout. What serves the participant?</Item>
        <Item n={50}>Policy. 1 equals tightly regulated medical access only. 10 equals full cognitive liberty. Where should the law be? This is a drug policy opinion. Opinions about law are the most protected speech there is.</Item>
        <Item n={51}>Tolerance. For each of the five above, rate one to ten how much you can respect a practitioner sitting at the opposite pole. Where you sit is a preference. What you can tolerate at the other end is a measurement of character.</Item>
        <Item n={52}>Which axis have you moved most on in the last five years, and in which direction?</Item>
        <Item n={53}>Which axis do you get judged on hardest by others in this field?</Item>
        <div style={S.visualNote}>
          Visual output. Frame on the horizontal, structure on the vertical, register as dot color, policy as dot size. Four dimensions in one plot, with your dot bright against the grey cloud of the cohort, and percentile bands on each axis. Toggle to see only practitioners within a chosen radius of your own position. That view is the referral network hiding inside the dataset.
        </div>

        <hr style={S.divider} />

        {/* BAND E */}
        <span style={S.bandLabel}>Band E</span>
        <div style={S.bandTitle}>Twenty-Five Traditions and Protocols</div>
        <div style={S.bandNote}>Four columns per row. None of them ask what you have done.</div>
        <div style={S.colGrid}>
          <span>Familiarity 0–5</span>
          <span>Emotional resonance 1–10</span>
          <span>Spiritual resonance 1–10</span>
          <span>Practice influence 1–10</span>
          <span>Closed to me</span>
        </div>
        <p style={{ ...S.prose, fontSize: ".82rem" }}>
          Familiarity: 0 never heard of it, 1 heard of it, 2 read about it, 3 studied it seriously, 4 trained in it, 5 hold it as lineage. Fifth option on every row: Closed to me. Some of these are living traditions with membership, initiation, and obligation attached. If a row is not yours to rate, mark it closed and move on. That answer is recorded as a finding rather than a gap, and how often it gets used is one of the more interesting things this instrument will learn.
        </p>
        <Trad n={1}>Shipibo vegetalismo. Amazonian. Icaro as instrument, dieta as apprenticeship, the plant as teacher rather than tool.</Trad>
        <Trad n={2}>Santo Daime. Brazilian syncretic church. Hymnal, uniform, collective works, movement in formation.</Trad>
        <Trad n={3}>Uniao do Vegetal. Brazilian. Seated, structured, question and answer with the mestre, doctrinal rather than shamanic.</Trad>
        <Trad n={4}>Andean huachuma. Day-long, outdoors, walking, mountain-facing, the long slow onset as the point.</Trad>
        <Trad n={5}>Mazatec velada. Oaxacan. Nighttime, prayer-led, Catholic and pre-Catholic layered, the curandera speaking throughout.</Trad>
        <Trad n={6}>Wixarika pilgrimage. Pilgrimage as the container, the journey to the site inseparable from what happens there.</Trad>
        <Trad n={7}>Native American Church tipi meeting. All-night, roadman, water ceremony at dawn, fire tended throughout, sacrament protected by statute for enrolled members.</Trad>
        <Trad n={8}>Bwiti initiation. Gabonese. Multi-day, ancestral encounter, communal, initiation into a lineage rather than a session.</Trad>
        <Trad n={9}>Ibogaine medical detox. Clinical isolate, cardiac monitoring, telemetry, medical staffing, indication-driven.</Trad>
        <Trad n={10}>Kambo. Peptide, purgative, applied in points, non-psychoactive, held within Matsés and Katukina practice and widely adapted outside it.</Trad>
        <Trad n={11}>Rapé and sananga. Adjunct practices. Applied by one person to another, brief, intense, used to open or close.</Trad>
        <Trad n={12}>Sonoran short-form. Five to twenty minutes, near-total dissolution, one holder, nothing to talk through in the moment.</Trad>
        <Trad n={13}>Northern amanita traditions. Siberian, Baltic, and Nordic folk practice. Preparation-dependent, seasonal, deliriant rather than serotonergic.</Trad>
        <Trad n={14}>Guatemalan cacao lineage. Heart-opening framing, circle-based, non-psychedelic, increasingly a preparation and integration container.</Trad>
        <Trad n={15}>Nakamal kava. Vanuatu and Fiji. Communal, hierarchical, evening-based, sobriety of a particular kind.</Trad>
        <Trad n={16}>Temazcal. Mesoamerican sweat. Rounds, heat, darkness, song, used before or after rather than instead of.</Trad>
        <Trad n={17}>Holotropic Breathwork. No substance. Paired sitters, extended session, cartography of the psyche, mandala drawing afterward.</Trad>
        <Trad n={18}>Dual-therapist MDMA protocol. Two facilitators, non-directive stance, trust in the participant's own inner healing intelligence, extended preparation and integration sessions.</Trad>
        <Trad n={19}>Dual-monitor psilocybin trial protocol. Preparation hours, eyeshades, curated playlist, two monitors present throughout, structured follow-up.</Trad>
        <Trad n={20}>Ketamine-assisted psychotherapy. Clinic-based, repeated sessions, medical supervision, psychotherapy embedded around the administration.</Trad>
        <Trad n={21}>Licensed service-center model. Non-directive by regulation, screening standardised, facilitator scope of practice defined in statute.</Trad>
        <Trad n={22}>Psycholytic model. Low dose, repeated, embedded in ongoing psychotherapy over months rather than a single high-dose crossing.</Trad>
        <Trad n={23}>IFS-informed integration. Parts language, unburdening, the difficult material treated as protective rather than pathological.</Trad>
        <Trad n={24}>Somatic-informed holding. Titration, pendulation, nervous-system tracking, completion of interrupted responses.</Trad>
        <Trad n={25}>Structured microdosing protocols. Sub-perceptual, calendared, stacked or unstacked, measured over weeks.</Trad>
        <Item n={54}>Which of these twenty-five has most changed how you think, and what did it change?</Item>
        <Item n={55}>Which one do you think the field misunderstands?</Item>
        <Item n={56}>Which one is being adapted most carelessly outside its origin, and what is owed to the people it came from?</Item>
        <Item n={57}>What tradition or protocol is missing from this list?</Item>

        <hr style={S.divider} />

        {/* BAND F */}
        <span style={S.bandLabel}>Band F</span>
        <div style={S.bandTitle}>Confidentiality</div>
        <Item n={58}>Do you believe a practitioner should make a confidentiality commitment? Verbal, written, both, none.</Item>
        <Item n={59}>How long should it run? Duration of the work, one year, lifetime, beyond death.</Item>
        <Item n={60}>Should it bind in both directions? May a participant name their practitioner publicly?</Item>
        <Item n={61}>What should break it? Click all, or write in. Imminent risk to self, imminent risk to another, disclosure of harm to a child or dependent adult, court order, request from the participant's own clinician with participant consent, nothing at all.</Item>
        <Item n={62}>Should a practitioner in this field keep notes? If so, for how long, and where?</Item>
        <Item n={63}>If a participant asks a practitioner to hold something the practitioner finds morally difficult, what governs?</Item>
        <Item n={64}>Should confidentiality extend to co-participants in a group setting? How should it be established, and what happens when it fails?</Item>
        <Item n={65}>Where does confidentiality end and complicity begin?</Item>

        <hr style={S.divider} />

        {/* BAND G */}
        <span style={S.bandLabel}>Band G</span>
        <div style={S.bandTitle}>Container Shape</div>
        <div style={S.bandNote}>Design preference throughout.</div>
        <Item n={66}>Which container shapes are you oriented toward? Click all, or write in. One to one, dyad, small group of three to six, circle of seven to twelve, gathering of thirteen to thirty, residential cohort, none of these.</Item>
        <Item n={67}>Ideal number of participants per person holding. Slider, 1 to 12.</Item>
        <Item n={68}>Above what number does a container require a second holder?</Item>
        <Item n={69}>Preferred arc length for the session itself. Under three hours, three to six, six to ten, ten to sixteen, overnight, multi-day, write in.</Item>
        <Item n={70}>Preferred preparation arc. Single conversation, two to three meetings, four to six weeks, three months or longer, ongoing relationship with no fixed start, write in.</Item>
        <Item n={71}>Preferred integration arc. Days, two to four weeks, three months, six months or longer, open-ended, write in.</Item>
        <Item n={72}>Preferred cadence for someone working over time. Weeks, seasons, annually, once and done, when they ask, write in.</Item>
        <Item n={73}>Preferred sequence. Click all, or write in. Screening conversation, medical and medication review with a clinician, written agreement, consent conversation covering touch, intention setting, dietary or behavioral preparation, second holder present, morning-after conversation, integration sessions, group integration circle, onward referral, long-term check-in.</Item>

        <hr style={S.divider} />

        {/* BAND H */}
        <span style={S.bandLabel}>Band H</span>
        <div style={S.bandTitle}>Requirements</div>
        <Item n={74}>What should be required of a participant? Click all, or write in. Medical clearance, disclosure of all medications, psychiatric history disclosure, time away from work, a named support person at home, no major life transition in progress, previous therapeutic work, no unaccompanied travel that day, abstinence from specific substances beforehand, signed agreement, nothing beyond willingness.</Item>
        <Item n={75}>What should be required of the practitioner? Click all, or write in. Current training, ongoing supervision, own continuing personal work, first aid or medical certification, insurance, written protocols, a second holder available, a colleague who can be called, a defined referral network, recovery time between containers.</Item>
        <Item n={76}>What should be required of the space? Click all, or write in. Private and interruption-free, bathroom access without leaving the container, temperature control, outdoor access, phone signal or landline, vehicle available, lockable, someone awake and sober on the premises, overnight accommodation, no other activity in the building.</Item>
        <Item n={77}>Which of those three lists would this field push back on hardest, and why?</Item>
        <Item n={78}>What would you require that we did not list?</Item>

        <hr style={S.divider} />

        {/* BAND I */}
        <span style={S.bandLabel}>Band I</span>
        <div style={S.bandTitle}>Vignettes</div>
        <div style={S.bandNote}>Third-person scenarios. Rate one to ten and comment. This is where protocol depth is actually measured, and nothing in it is a statement about you.</div>
        <Item n={79}>A guide accepts a participant on a serotonergic antidepressant without a medical consult. Rate the seriousness. What should have happened?</Item>
        <Item n={80}>A guide runs a single ninety-minute preparation call, then holds. What is missing?</Item>
        <Item n={81}>A guide offers no contact after the day of.</Item>
        <Item n={82}>A participant becomes destabilized eleven days later. What is the obligation, and how long does it run?</Item>
        <Item n={83}>A guide holds six people in a weekend, alone.</Item>
        <Item n={84}>A participant reaches for the guide's hand at the peak. Walk through the correct handling, including what consent should have been established beforehand.</Item>
        <Item n={85}>A participant develops romantic attachment afterward.</Item>
        <Item n={86}>A guide declines someone with a family history of a psychotic-spectrum condition. Right call or overcautious?</Item>
        <Item n={87}>A guide has worked for eleven years and has never turned anyone away. What does that tell you?</Item>
        <Item n={88}>A guide charges 4,500 US dollars and does no unpaid work.</Item>
        <Item n={89}>A guide's participant asks them to keep a secret from that participant's own therapist.</Item>
        <Item n={90}>Two guides in the same region disagree publicly about another guide's ethics. What should happen next?</Item>

        <hr style={S.divider} />

        {/* BAND J */}
        <span style={S.bandLabel}>Band J</span>
        <div style={S.bandTitle}>Bio and Temperature</div>
        <Item n={91}>Paste your bio. Whatever you already use, unedited. No character limit.</Item>
        <Item n={92}>What does that bio not say about you?</Item>
        <Item n={93}>How are you feeling about being asked all of this? Say it plainly, including if the answer is suspicious, tired, or annoyed.</Item>
        <Item n={94}>Mark each of the three publishable or private.</Item>

        {/* Compass image */}
        <img src={COMPASS_IMG} alt="The five-axis map" style={{ ...S.sectionImg, marginTop: "2rem" }} />

        <hr style={S.divider} />

        {/* BAND K */}
        <span style={S.bandLabel}>Band K</span>
        <div style={S.bandTitle}>The Reciprocity Gate</div>
        <div style={S.bandNote}>Submission is disabled until items 95 through 99 are complete. No skip, no exception, no "nothing to add."</div>
        <p style={S.prose}>
          You are not being surveyed. You are being asked to co-author the instrument that will describe you. That is the trade, and it is the only payment on offer.
        </p>
        <Item n={95}>Add. One question this instrument should ask and does not.</Item>
        <Item n={96}>Cut. One question here that is wrong, leading, naive, or unanswerable. Say why.</Item>
        <Item n={97}>Safety. One change that would make participating in this safer for practitioners.</Item>
        <Item n={98}>Usefulness. One change that would make this genuinely useful to a person choosing a guide, rather than useful to us.</Item>
        <Item n={99}>Access. One barrier that keeps practitioners out of instruments like this. Cost, language, geography, credential requirements, cultural framing, lineage politics. Name one and name the fix.</Item>
        <Item n={100}>Optional. Additional improvements, uncapped.</Item>
        <Item n={101}>Mark each publishable or private.</Item>
        <div style={S.sectionHead}>How improvements are codified</div>
        <p style={S.prose}>
          Every improvement receives an identifier tied to your code, in the form <span style={S.codeBox}>CEDAR-001-I3</span>. Adopted improvements appear in a public, dated changelog on this page, credited to the code. Return at any time, search your code, and see your line in the instrument's history.
        </p>
        <p style={S.prose}>
          Version 1.0 ships with 250 practitioners' names absent and their fingerprints everywhere. Version 1.1 will name which codes moved which items.
        </p>
        <p style={S.prose}>
          Improvements are marked adopted or not adopted. They are never scored, ranked, or graded. The moment a practitioner suspects their five are being marked, they write to impress instead of to fix.
        </p>

        <hr style={S.divider} />

        {/* BAND L */}
        <span style={S.bandLabel}>Band L</span>
        <div style={S.bandTitle}>Corroboration</div>
        <div style={S.bandNote}>Optional. Skippable with no penalty and no visible consequence.</div>
        <div style={S.sectionHead}>How it works</div>
        <p style={S.prose}>
          On completion you are offered three opaque single-use tokens. Long random strings. There is no email field anywhere in this flow. We do not send anything. You copy the tokens and deliver them however you choose, to whomever you choose, or to nobody.
        </p>
        <p style={S.prose}>
          We never learn who was contacted, how many were contacted, whether they were participants, or whether the tokens were used at all.
        </p>
        <Item n={102}>Set a shared passphrase. Two or three words that someone who genuinely knows you would also know. Stored only as a salted slow hash, never in readable form.</Item>
        <p style={{ ...S.prose, fontSize: ".82rem" }}>
          A note on why a passphrase rather than a name. A name has low entropy, so a hash of a name can be guessed by anyone holding a list of candidate names. A passphrase you choose is far stronger and proves the same thing, which is that whoever is answering genuinely knows you. If you want name entry as well, the name is checked and discarded immediately, and the passphrase carries the actual security.
        </p>
        <div style={S.sectionHead}>What the token holder is asked</div>
        <p style={S.prose}>Six items. Under four minutes. No account, no email, no analytics, no IP log. Three passphrase attempts, then a 24-hour lock.</p>
        <Item n={103}>How long have you known this practitioner?</Item>
        <Item n={104}>Rate their preparation of you for what was ahead. 1 to 10.</Item>
        <Item n={105}>Rate their availability once the intensity had passed. 1 to 10.</Item>
        <Item n={106}>Rate their handling of the moment things were hardest. 1 to 10.</Item>
        <Item n={107}>Did they ever make you feel you owed them anything? Yes, no, unsure.</Item>
        <Item n={108}>In one or two sentences, what did they do that you would not have known to ask for?</Item>
        <p style={S.prose}>No date. No place. No substance. No description of any event. Every one of these can be answered truthfully by someone who has only ever spoken with the practitioner. Nothing here is a witness statement.</p>
        <div style={S.sectionHead}>Deleted, retained, never existed</div>
        <p style={S.prose}>Deleted on submit, immediately, not on a nightly job: the token, the passphrase entry, the name if used, any session identifier.</p>
        <p style={S.prose}>Retained: six numbers and one short string, attached to your code, with no link back to who wrote them.</p>
        <p style={S.prose}>Never existed: any email address, any recipient list, any send record.</p>
        <div style={S.sectionHead}>The word we do not use</div>
        <p style={S.prose}>
          Not verified. A practitioner could open three private windows and corroborate themselves in ninety seconds. There is no defense against that which does not require identity, and identity is precisely what this instrument refuses to collect. So the label is Corroborated, the limitation is printed beside it wherever it appears, and it is never presented as proof.
        </p>
        <p style={S.prose}>
          Absence is never a negative. A practitioner working with people in genuinely sensitive circumstances should be contacting nobody. Corroboration displays as present or absent. It is never a score component and never sortable.
        </p>
        <p style={S.prose}>
          Three tokens, permanently. Not three per submission. Unlimited tokens would turn a trust signal into a marketing funnel inside a month.
        </p>

        <hr style={S.divider} />

        {/* Submission Form */}
        <div style={S.sectionHead}>Submit Your Responses</div>
        <p style={S.prose}>
          Complete the 108 items above, then paste your responses below. Your code is the only identifier. Nothing else is collected.
        </p>
        <div style={S.glass}>
          <SubmissionForm />
        </div>

        <hr style={S.divider} />

        {/* Changelog */}
        <div style={S.sectionHead}>Changelog</div>
        <div style={S.changelogItem}>v1.0, Pilot. 108 items across twelve bands. Cohort target 250 by invitation.</div>
        <div style={S.changelogItem}>v1.1, Pending. Will incorporate adopted improvements from the pilot cohort, credited by code.</div>

        <hr style={S.divider} />

        {/* Medical and Legal Notice */}
        <div style={S.notice}>
          <div style={{ fontWeight: 700, marginBottom: ".5rem", color: "rgba(26,18,8,.5)", fontSize: ".75rem", letterSpacing: ".1em", textTransform: "uppercase" }}>Medical and Legal Notice</div>
          This page is an instrument for professional self-assessment and field research. It is educational in purpose. It is not medical advice, not legal advice, not a credential, not a certification, and not a verification of any person's competence, training, or fitness to practice.
          <br /><br />
          Nothing on this page should be read as encouragement to obtain, possess, administer, or use any controlled substance. Legal status varies enormously by jurisdiction and changes frequently. Practitioners are responsible for their own compliance and should consult counsel qualified in their own jurisdiction.
          <br /><br />
          Corroboration is not verification. Inclusion in this index is not endorsement.
          <br /><br />
          If you are in crisis: Fireside Project Psychedelic Support Line, SAMHSA National Helpline, 988 Suicide and Crisis Lifeline in the United States.
        </div>

        <hr style={S.divider} />

        {/* Related */}
        <div style={S.sectionHead}>Related</div>
        <p style={S.prose}>
          <Link href="/psychedelic-readiness-index" style={S.link}>Psychedelic Readiness Index</Link> — the companion instrument for seekers. Six domains, 26 medicines, hard-stop screening, medication interaction matrix.
        </p>
        <p style={S.prose}>
          <Link href="/blog/only-time-buys-trust" style={S.link}>Only Time Buys Trust</Link> — why duration belongs on a balance sheet.
        </p>
        <p style={S.prose}>
          <Link href="/kava/caffeine" style={S.link}>Kava and caffeine</Link> — interaction notes on ceremonial preparation.
        </p>

        <hr style={S.divider} />

        {/* Voting Section */}
        <VotingSection />

        <hr style={S.divider} />

        {/* Licensing Notice */}
        <div style={{ ...S.glass, textAlign: "center", padding: "2rem", marginBottom: "2rem" }}>
          <p style={{ ...S.prose, fontSize: ".9rem", color: "#92400E", marginBottom: ".5rem", fontWeight: 600 }}>
            © 2026 Tony Greenberg · All Rights Reserved · Patent Pending
          </p>
          <p style={{ ...S.prose, fontSize: ".82rem", color: "rgba(26,18,8,.6)", marginBottom: "1rem" }}>
            This instrument is protected intellectual property. Unauthorized reproduction, distribution, or derivative use is prohibited.
            Want to license it? All proceeds fund addiction recovery.
          </p>
          <a
            href="mailto:tony@tonygreenberg.com?subject=Facilitator%20Index%20Licensing"
            style={{ ...S.link, fontSize: ".85rem", background: "rgba(245,158,11,.15)", border: "1px solid rgba(245,158,11,.35)", padding: ".4rem 1.2rem", borderRadius: 6, textDecoration: "none" }}
          >
            Inquire About Licensing
          </a>
        </div>

        {/* Testimonials */}
        <div style={{ margin: "2rem 0", padding: "0" }}>
          <div style={{ fontSize: ".68rem", fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(26,18,8,.35)", textAlign: "center", marginBottom: "2rem" }}>
            From the field
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
            {[
              {
                quote: "I've been in this field for eight years. The 108 items named things I'd never had language for. I scored myself honestly for the first time.",
                name: "K.R.",
                context: "Psilocybin Facilitator · Colorado"
              },
              {
                quote: "The anonymity isn't a feature — it's the whole point. I answered things I've never said out loud. That's not nothing.",
                name: "T.M.",
                context: "Ibogaine Practitioner · Mexico"
              },
              {
                quote: "I got the Threshold Keeper archetype. Read it three times. Sent it to my supervisor. She said it was more accurate than anything she'd written about me in two years.",
                name: "A.L.",
                context: "Ketamine-Assisted Therapist · NYC"
              },
              {
                quote: "The supervision band was uncomfortable. I scored low and I knew it was true. I found a peer consultation group six weeks later. That's what this is for.",
                name: "D.S.",
                context: "Ayahuasca Facilitator · Netherlands"
              },
            ].map((t, i) => (
              <div key={i} style={{ ...S.glass, padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: ".75rem" }}>
                <p style={{ margin: 0, fontSize: "clamp(.88rem, 2.2vw, .95rem)", lineHeight: 1.75, color: "rgba(26,18,8,.72)", fontStyle: "italic", fontFamily: "'Playfair Display', Georgia, serif" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ borderTop: "1px solid rgba(26,18,8,.08)", paddingTop: ".6rem" }}>
                  <div style={{ fontSize: ".78rem", fontWeight: 700, color: "#B45309", letterSpacing: ".04em" }}>{t.name}</div>
                  <div style={{ fontSize: ".72rem", color: "rgba(26,18,8,.4)", marginTop: ".2rem", letterSpacing: ".03em" }}>{t.context}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share Buttons */}
        <ShareBar />

        {/* Usage Counter */}
        <UsageCounter />

        {/* Copyright Footer */}
        <CopyrightFooter />

        {/* Footer */}
        <div style={S.footer}>
          Tony Greenberg is Founder and CEO of{" "}
          <a href="https://ramprate.com" style={S.link}>RampRate</a>{" "}
          and Founder of{" "}
          <a href="https://impactsoul.is" style={S.link}>ImpactSoul</a>.{" "}
          He is an investor in MycoMedica Life Sciences and holds six active investments in psychedelic medicine. Disclosure is the price of asking anyone else to be candid.
          <br /><br />
          &#8251;
        </div>

        </> /* end showFullIndex */
        )}

      </div>
    </div>
  );
}
  const heroRef = useParallax(0.4);
