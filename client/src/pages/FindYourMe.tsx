/**
 * FIND MY — TO FIND YOUR WE
 * 
 * A standalone glass-morphism landing page that exists as its own world.
 * Five NLP-driven questions that reveal who you are and route you
 * into the full ecosystem of articles, assessments, community, and satellite sites.
 * 
 * Design: Dark contemplative space with frosted glass panels,
 * sacred geometry background, animated transitions between questions.
 */

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import mirrorData from "@/data/mirrorData.json";
import JourneyTracker, { useJourneyProgress } from "@/components/JourneyTracker";
import ThemedBackground from '@/components/ThemedBackground';
import { AssessmentResultActions } from "@/components/AssessmentResultActions";

/* ── TYPES ── */

interface Choice {
  text: string;
  dimensions: Record<string, number>; // dimension weights
}

interface Question {
  id: number;
  stem: string;
  subtext: string;
  choices: Choice[];
}

interface Archetype {
  id: string;
  name: string;
  tagline: string;
  description: string;
  primaryDimension: string;
  articles: string[];
  sites: { name: string; url: string; why: string }[];
  deeperAssessments: { label: string; path: string; why: string }[];
  nextStep: { label: string; path: string };
  shareText: string;
}

/* ── QUESTIONS: NLP-driven, contemplative, presuppositional ── */

const QUESTIONS: Question[] = [
  {
    id: 1,
    stem: "The conversation you wish someone would finally have with you is about...",
    subtext: "Not the polite version. The real one.",
    choices: [
      {
        text: "Why I keep choosing people who can't meet me where I am",
        dimensions: { relationships: 9, truth: 5, consciousness: 3 },
      },
      {
        text: "What I'm actually supposed to be building with my life",
        dimensions: { purpose: 9, consciousness: 4, truth: 3 },
      },
      {
        text: "How to stop performing wellness and start actually feeling it",
        dimensions: { body: 9, truth: 5, consciousness: 3 },
      },
      {
        text: "Why the world keeps rewarding the wrong things — and what I'm going to do about it",
        dimensions: { truth: 8, tribe: 5, purpose: 4 },
      },
      {
        text: "How to find my people without losing myself in the search",
        dimensions: { tribe: 9, relationships: 4, consciousness: 3 },
      },
    ],
  },
  {
    id: 2,
    stem: "When you're alone at 2am and the masks are off, you're thinking about...",
    subtext: "The thought you don't say out loud.",
    choices: [
      {
        text: "Whether anyone truly knows me — or just the version I've curated",
        dimensions: { relationships: 7, truth: 8, consciousness: 4 },
      },
      {
        text: "The gap between what I do every day and what I was put here to do",
        dimensions: { purpose: 9, consciousness: 5, truth: 3 },
      },
      {
        text: "How much time I've lost treating symptoms instead of causes",
        dimensions: { body: 7, truth: 6, consciousness: 5 },
      },
      {
        text: "Whether I have the courage to live by what I actually believe",
        dimensions: { truth: 9, consciousness: 6, purpose: 3 },
      },
      {
        text: "Where my tribe is — the people who think like this at 2am too",
        dimensions: { tribe: 8, relationships: 5, consciousness: 4 },
      },
    ],
  },
  {
    id: 3,
    stem: "If you could master one thing in the next year, you'd choose...",
    subtext: "Not what looks good on a résumé. What changes everything.",
    choices: [
      {
        text: "The ability to love without armor — and be loved without performing",
        dimensions: { relationships: 9, consciousness: 5, body: 2 },
      },
      {
        text: "Knowing exactly what to build and having the nerve to build it",
        dimensions: { purpose: 9, truth: 4, tribe: 3 },
      },
      {
        text: "Understanding my own biochemistry well enough to optimize every day",
        dimensions: { body: 9, consciousness: 4, truth: 3 },
      },
      {
        text: "Seeing through every system — economic, social, political — to what's actually true",
        dimensions: { truth: 9, purpose: 4, tribe: 3 },
      },
      {
        text: "Building a circle of people who make each other exponentially better",
        dimensions: { tribe: 9, relationships: 5, purpose: 3 },
      },
    ],
  },
  {
    id: 4,
    stem: "The pattern you keep repeating — the one you're ready to break — is...",
    subtext: "You already know what it is.",
    choices: [
      {
        text: "Choosing intensity over intimacy, then wondering why I'm alone",
        dimensions: { relationships: 9, consciousness: 5, truth: 4 },
      },
      {
        text: "Starting things that matter and abandoning them before they matter enough",
        dimensions: { purpose: 8, truth: 5, consciousness: 4 },
      },
      {
        text: "Knowing what my body needs and negotiating with it anyway",
        dimensions: { body: 8, truth: 6, consciousness: 4 },
      },
      {
        text: "Saying yes to things I don't believe in to keep the peace",
        dimensions: { truth: 9, relationships: 4, tribe: 3 },
      },
      {
        text: "Trying to belong by becoming someone else",
        dimensions: { tribe: 8, truth: 6, relationships: 4 },
      },
    ],
  },
  {
    id: 5,
    stem: "The future you're building — whether you've admitted it yet or not — looks like...",
    subtext: "Say it. Out loud. To yourself.",
    choices: [
      {
        text: "A partnership so real it rewrites what I thought love could be",
        dimensions: { relationships: 9, consciousness: 5, truth: 4 },
      },
      {
        text: "Work that makes me dangerous to the status quo — in the best way",
        dimensions: { purpose: 9, truth: 5, tribe: 3 },
      },
      {
        text: "A body and mind so dialed in that every day feels like a gift I earned",
        dimensions: { body: 9, consciousness: 5, purpose: 3 },
      },
      {
        text: "A life where I never again pretend to believe something I don't",
        dimensions: { truth: 9, consciousness: 6, relationships: 3 },
      },
      {
        text: "A community of builders, healers, and truth-tellers who actually show up",
        dimensions: { tribe: 9, purpose: 5, relationships: 4 },
      },
    ],
  },
];

/* ── ARCHETYPES ── */

const ARCHETYPES: Archetype[] = [
  {
    id: "magnetic-partner",
    name: "The Magnetic Partner",
    tagline: "You're not looking for love. You're looking for truth in human form.",
    description: "Your deepest work is relational. You've built walls so sophisticated you forgot they were walls — and now you're ready to dismantle them. The articles below aren't advice. They're mirrors. The sites aren't tools. They're practice fields for the kind of connection that changes your molecular structure.",
    primaryDimension: "relationships",
    articles: [
      "love-as-dharma-a-science-based-playbook-for-magnetic-partnership",
      "the-decay-of-modern-day-communication-and-how-it-is-affecting-your-relationships",
      "the-ties-that-bind-interpersonal-relationships-and-the-art-of-meaningful-connection",
      "the-arithmetic-of-relationships-why-most-people-get-the-math-wrong",
      "the-science-of-being-alone-why-solitude-is-a-superpower",
      "the-molecule-as-mirror-what-psychedelics-reveal-about-consciousness",
    ],
    sites: [
      { name: "Find Your Partner", url: "https://intimacyassess-tcir3hon.manus.space", why: "15 questions. 5 domains. The invisible architecture of your intimacy, mapped." },
      { name: "Find Your Team", url: "/flow-circuit", why: "The neurochemistry of connection — who you build with, measured not guessed." },
      { name: "Find Your Water", url: "https://aqwaterqpr-wvzsc3ph.manus.space", why: "The element that teaches you to flow, not force." },
    ],
    deeperAssessments: [
      { label: "Find Your Score", path: "/assessments/grant-study", why: "85 years of Harvard data says relationships predict everything. Let's see yours." },
      { label: "Find Your Mirror", path: "/the-mirror", why: "6 dimensions. 18 questions. A radar chart that doesn't care about your feelings." },
    ],
    nextStep: { label: "Find Your Partner →", path: "https://intimacyassess-tcir3hon.manus.space" },
    shareText: "Turns out I'm a Magnetic Partner — my deepest work is relational truth. 5 questions, zero BS. What are you?",
  },
  {
    id: "systems-architect",
    name: "The Systems Architect",
    tagline: "You don't just see the broken system. You see what replaces it.",
    description: "Your mind works in infrastructure. While others debate symptoms, you're already sketching the replacement. The articles below will sharpen your pattern recognition. The sites will show you systems already being built. Your tribe is smaller than you think — and more powerful than you know.",
    primaryDimension: "purpose",
    articles: [
      "the-built-world-is-a-mirror-of-the-people-who-built-it",
      "the-trust-economy-why-the-next-trillion-dollar-companies-will-be-built-on-radical-transparency",
      "the-great-ai-swindle-how-big-tech-is-selling-you-a-future-it-cant-deliver",
      "the-gdp-delusion-why-the-worlds-favorite-metric-is-its-most-dangerous-lie",
      "the-great-rewiring-how-to-build-systems-that-dont-extract",
      "the-art-of-the-long-game-why-patience-is-the-most-undervalued-asset-in-business",
    ],
    sites: [
      { name: "Find Your Blueprint", url: "/living-declaration", why: "The operating system for what comes after extraction." },
      { name: "Find Your Capital", url: "https://portfoliofamilyoffice.manus.space", why: "How aligned money actually moves." },
    ],
    deeperAssessments: [
      { label: "Find Your Purpose", path: "/assessments/dharma-finder", why: "25 questions stolen from Schmachtenberger. Not what you should do — what you can't stop doing." },
      { label: "Find Your Mirror", path: "/the-mirror", why: "6 dimensions. 18 questions. Systems thinkers love data about themselves." },
    ],
    nextStep: { label: "Find Your Index →", path: "/the-index" },
    shareText: "Apparently I'm a Systems Architect — I see what replaces the broken. 5 questions told me what I already knew. Your turn:",
  },
  {
    id: "temple-keeper",
    name: "The Temple Keeper",
    tagline: "Your body isn't a machine to optimize. It's a temple to understand.",
    description: "You've tried the hacks. The protocols. The 47-step morning routines. Now you're ready for something deeper — understanding your own biochemistry not as a problem to solve but as a language to learn. The articles below decode that language. The sites give you the lab.",
    primaryDimension: "body",
    articles: [
      "the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet",
      "restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants",
      "the-eco-vegan-dilemma-when-your-diet-meets-your-carbon-footprint",
      "the-science-of-being-alone-why-solitude-is-a-superpower",
      "the-molecule-as-mirror-what-psychedelics-reveal-about-consciousness",
      "the-longevity-paradox-why-living-longer-means-nothing-if-you-dont-live-deeper",
    ],
    sites: [
      { name: "Find Your Chemistry", url: "https://regenhealth-4nns6jnd.manus.space", why: "Your biochemistry decoded — not as a problem, as a language." },
      { name: "Find Your Water", url: "https://aqwaterqpr-wvzsc3ph.manus.space", why: "Water as medicine, not commodity." },
      { name: "Find Myzcal", url: "https://mezcalagave-ahru9fq8.manus.space", why: "The sacred in the everyday ritual." },
    ],
    deeperAssessments: [
      { label: "Find Your Level", path: "/assessments/consciousness-scale", why: "Hawkins calibrated 17 levels from Shame to Enlightenment. Your body already knows which one." },
      { label: "Find Your Mirror", path: "/the-mirror", why: "6 dimensions including the body you've been negotiating with. Time to listen." },
    ],
    nextStep: { label: "Find Your Chemistry →", path: "https://regenhealth-4nns6jnd.manus.space" },
    shareText: "So I'm a Temple Keeper — my body's been talking and I finally listened. 5 questions, no hacks. What does your mirror say?",
  },
  {
    id: "truth-speaker",
    name: "The Truth Speaker",
    tagline: "You stopped pretending a long time ago. Now you're ready to build from what's real.",
    description: "You have an allergy to bullshit that most people mistake for cynicism. It's not. It's precision. You see through systems, relationships, and narratives to the structural truth underneath — and you're done being polite about it. The articles below are written by someone with the same allergy.",
    primaryDimension: "truth",
    articles: [
      "the-great-ai-swindle-how-big-tech-is-selling-you-a-future-it-cant-deliver",
      "the-trust-economy-why-the-next-trillion-dollar-companies-will-be-built-on-radical-transparency",
      "the-gdp-delusion-why-the-worlds-favorite-metric-is-its-most-dangerous-lie",
      "homeaglow-the-anatomy-of-a-consumer-fraud",
      "the-built-world-is-a-mirror-of-the-people-who-built-it",
      "the-great-rewiring-how-to-build-systems-that-dont-extract",
    ],
    sites: [
      { name: "Find Your Evidence", url: "/homeaglow-the-anatomy-of-a-consumer-fraud", why: "What happens when someone actually follows the receipts." },
      { name: "Find Your Blueprint", url: "/living-declaration", why: "Truth as operating system." },
      { name: "Find Your Team", url: "/flow-circuit", why: "The neuroscience of team dynamics." },
    ],
    deeperAssessments: [
      { label: "Find Your Purpose", path: "/assessments/dharma-finder", why: "Truth without purpose is just complaining. 25 questions to find what yours is for." },
      { label: "Find Your Level", path: "/assessments/consciousness-scale", why: "Hawkins says truth-telling starts at 200. Where do you actually calibrate?" },
    ],
    nextStep: { label: "Find Your Living Declaration →", path: "/living-declaration" },
    shareText: "Confirmed: I'm a Truth Speaker — allergic to bullshit with clinical precision. 5 questions stripped the paint off. Dare you:",
  },
  {
    id: "tribe-weaver",
    name: "The Tribe Weaver",
    tagline: "You don't just want to find your people. You want to build the place where people find each other.",
    description: "Connection isn't a nice-to-have for you — it's infrastructure. You understand that the most powerful technology on earth is a room full of aligned humans. The articles below map the territory. The community is where you start building.",
    primaryDimension: "tribe",
    articles: [
      "the-decay-of-modern-day-communication-and-how-it-is-affecting-your-relationships",
      "the-ties-that-bind-interpersonal-relationships-and-the-art-of-meaningful-connection",
      "the-trust-economy-why-the-next-trillion-dollar-companies-will-be-built-on-radical-transparency",
      "the-great-rewiring-how-to-build-systems-that-dont-extract",
      "the-art-of-the-long-game-why-patience-is-the-most-undervalued-asset-in-business",
      "love-as-dharma-a-science-based-playbook-for-magnetic-partnership",
    ],
    sites: [
      { name: "Find Your Partner", url: "https://intimacyassess-tcir3hon.manus.space", why: "Understand how you connect before you connect." },
      { name: "Find Your Signal", url: "https://serensynch-2agjfwhe.manus.space", why: "The signal in the noise — found." },
      { name: "Find Your Capital", url: "https://portfoliofamilyoffice.manus.space", why: "Aligned capital builds aligned communities." },
    ],
    deeperAssessments: [
      { label: "Find Your Score", path: "/assessments/grant-study", why: "You build tribes. But how deep are the ones you're already in? Harvard wants to know." },
      { label: "Find Your Mirror", path: "/the-mirror", why: "Before you weave others together, see the full picture of where you stand." },
    ],
    nextStep: { label: "Find Your Tribe →", path: "/community" },
    shareText: "I'm a Tribe Weaver — I build the rooms where the right people find each other. 5 questions. What are you building?",
  },
  {
    id: "consciousness-explorer",
    name: "The Consciousness Explorer",
    tagline: "You've been to the edge. Now you want the map.",
    description: "Whether through meditation, medicine, crisis, or quiet revelation — you've glimpsed something beyond the default settings. Now you want to understand it. Not as woo. As architecture. The articles below treat consciousness as engineering, not escapism. The sites are your lab.",
    primaryDimension: "consciousness",
    articles: [
      "the-molecule-as-mirror-what-psychedelics-reveal-about-consciousness",
      "the-science-of-being-alone-why-solitude-is-a-superpower",
      "love-as-dharma-a-science-based-playbook-for-magnetic-partnership",
      "the-longevity-paradox-why-living-longer-means-nothing-if-you-dont-live-deeper",
      "the-built-world-is-a-mirror-of-the-people-who-built-it",
      "the-great-rewiring-how-to-build-systems-that-dont-extract",
    ],
    sites: [
      { name: "Find Your Team", url: "/flow-circuit", why: "Consciousness as measurable team dynamics." },
      { name: "Find Your Water", url: "https://aqwaterqpr-wvzsc3ph.manus.space", why: "The element that teaches presence." },
      { name: "Find Your Chemistry", url: "https://regenhealth-4nns6jnd.manus.space", why: "Optimize the vessel for the signal." },
    ],
    deeperAssessments: [
      { label: "Find Your Level", path: "/assessments/consciousness-scale", why: "17 levels. Shame to Enlightenment. You've glimpsed the edge — now get coordinates." },
      { label: "Find Your Mirror", path: "/the-mirror", why: "Consciousness without self-knowledge is just tripping. 6 dimensions of ground truth." },
    ],
    nextStep: { label: "Find Your Mirror →", path: "/the-mirror" },
    shareText: "I'm a Consciousness Explorer — awareness as architecture, not escapism. 5 questions cracked the code. Ready to look?",
  },
];

/* ── DIMENSION LABELS ── */

const DIMENSION_LABELS: Record<string, string> = {
  relationships: "Relationships",
  purpose: "Purpose",
  body: "Body & Biochemistry",
  truth: "Truth & Integrity",
  tribe: "Tribe & Community",
  consciousness: "Consciousness",
};

/* ── SACRED GEOMETRY SVG BACKGROUND ── */

function SacredGeometryBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <svg
        viewBox="0 0 1000 1000"
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.04 }}
      >
        {/* Flower of Life pattern */}
        {[500, 440, 560, 470, 530, 470, 530].map((cx, i) => {
          const cy = [500, 465, 465, 535, 535, 500, 500][i];
          return <circle key={i} cx={cx} cy={cy} r={60} fill="none" stroke="#D4B96A" strokeWidth="0.5" />;
        })}
        {/* Outer rings */}
        <circle cx="500" cy="500" r="120" fill="none" stroke="#D4B96A" strokeWidth="0.3" />
        <circle cx="500" cy="500" r="180" fill="none" stroke="#D4B96A" strokeWidth="0.2" />
        <circle cx="500" cy="500" r="250" fill="none" stroke="#D4B96A" strokeWidth="0.15" />
        <circle cx="500" cy="500" r="350" fill="none" stroke="#D4B96A" strokeWidth="0.1" />
        <circle cx="500" cy="500" r="480" fill="none" stroke="#D4B96A" strokeWidth="0.08" />
        {/* Metatron's cube lines */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 500 + 180 * Math.cos(rad);
          const y = 500 + 180 * Math.sin(rad);
          return <line key={`l${i}`} x1="500" y1="500" x2={x} y2={y} stroke="#D4B96A" strokeWidth="0.2" />;
        })}
      </svg>
      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(212, 185, 106, ${0.1 + Math.random() * 0.2})`,
              animation: `float ${8 + Math.random() * 12}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── GLASS PANEL COMPONENT ── */

function GlassPanel({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        background: "rgba(10, 10, 16, 0.6)",
        backdropFilter: "blur(20px) saturate(1.2)",
        WebkitBackdropFilter: "blur(20px) saturate(1.2)",
        border: "1px solid rgba(212, 185, 106, 0.12)",
        borderRadius: "16px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── RADAR CHART ── */

function RadarChart({ scores }: { scores: Record<string, number> }) {
  const dims = ["relationships", "purpose", "body", "truth", "tribe", "consciousness"];
  const size = 260;
  const center = size / 2;
  const maxR = 100;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / dims.length - Math.PI / 2;
    const r = (value / 10) * maxR;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const dataPoints = dims.map((d, i) => getPoint(i, scores[d] || 0));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: 260 }}>
      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1].map((scale) => {
        const points = dims.map((_, i) => getPoint(i, scale * 10));
        const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
        return <path key={scale} d={path} fill="none" stroke="rgba(212,185,106,0.15)" strokeWidth="0.5" />;
      })}
      {/* Axis lines */}
      {dims.map((_, i) => {
        const p = getPoint(i, 10);
        return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="rgba(212,185,106,0.1)" strokeWidth="0.5" />;
      })}
      {/* Data polygon */}
      <path d={dataPath} fill="rgba(212,185,106,0.15)" stroke="#D4B96A" strokeWidth="1.5" />
      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#D4B96A" />
      ))}
      {/* Labels */}
      {dims.map((d, i) => {
        const p = getPoint(i, 12);
        return (
          <text
            key={d}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(212,185,106,0.7)"
            fontSize="8"
            fontFamily="'DM Mono', monospace"
          >
            {DIMENSION_LABELS[d]?.split(" ")[0] || d}
          </text>
        );
      })}
    </svg>
  );
}

/* ── MAIN COMPONENT ── */

export default function FindYourMe() {
  const { user, isAuthenticated } = useAuth();
  const [phase, setPhase] = useState<"landing" | "assessment" | "results">("landing");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [resultsFadeIn, setResultsFadeIn] = useState(false);
  const [shareCount, setShareCount] = useState(0);
  const [showSharePrompt, setShowSharePrompt] = useState(false);
  const questionRef = useRef<HTMLDivElement>(null);

  // Directory filter/search state
  const [directoryFilter, setDirectoryFilter] = useState<"all" | "live" | "coming">("all");
  const { markComplete: markJourneyComplete } = useJourneyProgress();
  const [directorySearch, setDirectorySearch] = useState("");
  const [highlightCategory, setHighlightCategory] = useState<string | null>(null);
  const directorySectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Session ID for anonymous tracking
  const [sessionId] = useState(() => {
    if (typeof window === "undefined") return "fym-ssr";
    try {
      const stored = sessionStorage.getItem("fym-session");
      if (stored) return stored;
      const id = `fym-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem("fym-session", id);
      return id;
    } catch {
      return `fym-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
  });

  // tRPC mutation for saving results
  const saveResults = trpc.assessments.submit.useMutation();

  // Wound → directory category mapping
  const WOUND_TO_CATEGORY: Record<string, string> = {
    "I keep choosing the wrong people": "Love & Belonging",
    "I don't know what I'm building anymore": "Know Thyself",
    "My body stopped listening to me": "Body & Temple",
    "I see what's broken and nobody cares": "Mind & Systems",
    "I can't find my people": "Love & Belonging",
    "I've glimpsed something bigger and can't unsee it": "Mind & Systems",
    "I'm performing wellness instead of feeling it": "Body & Temple",
    "I have the resources but not the impact": "Mind & Systems",
  };

  const scrollToCategory = useCallback((category: string) => {
    setHighlightCategory(category);
    const el = directorySectionRefs.current[category];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    // Clear highlight after 3 seconds
    setTimeout(() => setHighlightCategory(null), 3000);
  }, []);

  // Fade in on mount
  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Calculate scores from answers
  const dimensionScores = useMemo(() => {
    const scores: Record<string, number> = {
      relationships: 0, purpose: 0, body: 0, truth: 0, tribe: 0, consciousness: 0,
    };
    const counts: Record<string, number> = { ...scores };

    Object.entries(answers).forEach(([qIdx, choiceIdx]) => {
      const q = QUESTIONS[Number(qIdx)];
      if (!q) return;
      const choice = q.choices[choiceIdx];
      if (!choice) return;
      Object.entries(choice.dimensions).forEach(([dim, weight]) => {
        scores[dim] = (scores[dim] || 0) + weight;
        counts[dim] = (counts[dim] || 0) + 1;
      });
    });

    // Normalize to 0-10 scale
    Object.keys(scores).forEach((dim) => {
      if (counts[dim] > 0) {
        scores[dim] = Math.min(10, Math.round((scores[dim] / (counts[dim] * 9)) * 10 * 10) / 10);
      }
    });
    return scores;
  }, [answers]);

  // Determine archetype from scores
  const archetype = useMemo(() => {
    if (phase !== "results") return ARCHETYPES[0];
    const sorted = Object.entries(dimensionScores).sort((a, b) => b[1] - a[1]);
    const topDim = sorted[0]?.[0] || "relationships";
    return ARCHETYPES.find((a) => a.primaryDimension === topDim) || ARCHETYPES[0];
  }, [dimensionScores, phase]);

  // Handle choice selection
  const handleChoice = useCallback((choiceIdx: number) => {
    if (transitioning) return;
    setSelectedChoice(choiceIdx);

    setTimeout(() => {
      setTransitioning(true);
      const newAnswers = { ...answers, [currentQ]: choiceIdx };
      setAnswers(newAnswers);

      setTimeout(() => {
        if (currentQ < QUESTIONS.length - 1) {
          setCurrentQ((prev) => prev + 1);
          setSelectedChoice(null);
          setTransitioning(false);
          questionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          // Calculate final scores and save
          setPhase("results");
          markJourneyComplete("find-your-me");
          setResultsFadeIn(false);
          setTimeout(() => setResultsFadeIn(true), 200);

          // Save to DB
          const finalScores: Record<string, number> = {
            relationships: 0, purpose: 0, body: 0, truth: 0, tribe: 0, consciousness: 0,
          };
          const finalCounts: Record<string, number> = { ...finalScores };
          Object.entries(newAnswers).forEach(([qIdx, cIdx]) => {
            const q = QUESTIONS[Number(qIdx)];
            if (!q) return;
            const c = q.choices[cIdx];
            if (!c) return;
            Object.entries(c.dimensions).forEach(([dim, w]) => {
              finalScores[dim] = (finalScores[dim] || 0) + w;
              finalCounts[dim] = (finalCounts[dim] || 0) + 1;
            });
          });
          Object.keys(finalScores).forEach((dim) => {
            if (finalCounts[dim] > 0) {
              finalScores[dim] = Math.min(10, Math.round((finalScores[dim] / (finalCounts[dim] * 9)) * 10 * 10) / 10);
            }
          });
          const sorted = Object.entries(finalScores).sort((a, b) => b[1] - a[1]);
          const topDim = sorted[0]?.[0] || "relationships";
          const arch = ARCHETYPES.find((a) => a.primaryDimension === topDim) || ARCHETYPES[0];

          saveResults.mutate({
            assessmentType: "mirror" as any,
            sessionId,
            answers: JSON.stringify(
              Object.entries(newAnswers).map(([qIdx, cIdx]) => ({
                questionId: `fym-q${Number(qIdx) + 1}`,
                answer: QUESTIONS[Number(qIdx)]?.choices[cIdx]?.text || "",
                score: cIdx,
              }))
            ),
            resultSummary: `${arch.name}: ${arch.tagline}`,
            totalScore: Math.round(sorted.reduce((sum, [, v]) => sum + v, 0)),
          });
        }
        setTransitioning(false);
      }, 600);
    }, 400);
  }, [currentQ, answers, transitioning, sessionId, saveResults]);

  // Share handler
  const handleShare = (platform: string) => {
    const url = "https://tonygreenberg.com/find-your-me";
    const text = archetype.shareText;

    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
        break;
      case "email":
        window.open(`mailto:?subject=${encodeURIComponent("Find My — " + archetype.name)}&body=${encodeURIComponent(text + "\n\n" + url)}`, "_blank");
        break;
      case "copy":
        navigator.clipboard?.writeText(`${text}\n\n${url}`);
        break;
    }
    setShareCount((prev) => prev + 1);
    if (shareCount >= 2 && !showSharePrompt) {
      setShowSharePrompt(true);
    }
  };

  // Get article titles from blog data
  const getArticleTitle = (slug: string) => {
    const mirror = (mirrorData as any).mirrors?.[slug];
    return mirror ? slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) : slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  };

  const currentQuestion = QUESTIONS[currentQ];
  const progress = ((currentQ + (selectedChoice !== null ? 1 : 0)) / QUESTIONS.length) * 100;

  return (
    <>
      <SEO
        title="Find My to Find Your We"
        description="A five-question mirror that reveals who you are — and routes you to the people, ideas, and practices that will change everything."
        path="/find-my"
        indexable={true}
      />

      <ThemedBackground theme="selfportrait" />
      {/* Full-screen dark environment */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          background: "transparent",
          color: "#2C1810",
          overflow: "hidden",
        }}
      >
        <SacredGeometryBg />

        {/* Floating CSS animation */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
            25% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
            50% { transform: translateY(-10px) translateX(-5px); opacity: 0.4; }
            75% { transform: translateY(-30px) translateX(15px); opacity: 0.5; }
          }
          @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 20px rgba(212,185,106,0.1); }
            50% { box-shadow: 0 0 40px rgba(212,185,106,0.2); }
          }
          @keyframes breathe {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInSlow {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slowZoom {
            from { transform: scale(1); }
            to { transform: scale(1.1); }
          }
          .choice-btn {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .choice-btn:hover {
            background: rgba(212,185,106,0.08) !important;
            border-color: rgba(212,185,106,0.4) !important;
            transform: translateX(8px);
          }
          .choice-btn.selected {
            background: rgba(212,185,106,0.15) !important;
            border-color: #8B6914 !important;
          }
        `}</style>

        {/* ── LANDING PHASE ── */}
        {phase === "landing" && (
          <div
            style={{
              position: "relative",
              zIndex: 1,
              opacity: fadeIn ? 1 : 0,
              transition: "opacity 1.5s ease",
            }}
          >
            {/* ── HERO SECTION: Full-bleed image with overlay ── */}
            <div
              style={{
                position: "relative",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {/* Hero image */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url('/api/img/findme-orig_c4cf916c.jpg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center 40%",
                  filter: "brightness(0.55) saturate(1.2)",
                  animation: "slowZoom 30s ease infinite alternate",
                }}
              />
              {/* Gradient overlay for text readability */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(10,10,16,0.4) 0%, rgba(10,10,16,0.2) 40%, rgba(10,10,16,0.7) 80%, rgba(10,10,16,0.95) 100%)",
                }}
              />

              {/* Back to main site */}
              <Link
                href="/"
                style={{
                  position: "absolute",
                  top: "1.5rem",
                  left: "1.5rem",
                  color: "rgba(212,185,106,0.6)",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  zIndex: 2,
                }}
              >
                ← TonyG
              </Link>

              <div style={{ textAlign: "center", maxWidth: 720, padding: "2rem 1.5rem", position: "relative", zIndex: 2 }}>
                {/* Eyebrow */}
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.7rem",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(212,185,106,0.8)",
                    marginBottom: "2rem",
                    animation: "slideUp 1s ease 0.3s both",
                  }}
                >
                  Five Questions. No Escape Hatch.
                </div>

                {/* Main title */}
                <h1
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
                    fontWeight: 400,
                    lineHeight: 1.1,
                    marginBottom: "0.5rem",
                    animation: "slideUp 1s ease 0.5s both",
                    textShadow: "0 4px 30px rgba(0,0,0,0.5)",
                  }}
                >
                  Find Y<span style={{ color: "#8B6914" }}>our</span>{" "}
                  <span style={{ color: "#8B6914", fontStyle: "italic" }}>Me</span>
                </h1>

                <h2
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "clamp(1.5rem, 4vw, 2.8rem)",
                    fontWeight: 400,
                    lineHeight: 1.2,
                    color: "rgba(232,228,220,0.7)",
                    marginBottom: "2.5rem",
                    animation: "slideUp 1s ease 0.7s both",
                    textShadow: "0 2px 20px rgba(0,0,0,0.4)",
                  }}
                >
                  to Find Y<span style={{ color: "#8B6914" }}>our</span>{" "}
                  <span style={{ color: "#8B6914", fontStyle: "italic" }}>We</span>
                </h2>

                {/* Scroll indicator */}
                <div
                  style={{
                    animation: "fadeInSlow 2s ease 1.5s both",
                    marginTop: "3rem",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.2em",
                      color: "rgba(212,185,106,0.5)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    SCROLL TO BEGIN
                  </div>
                  <div style={{ fontSize: "1.5rem", color: "rgba(212,185,106,0.4)", animation: "pulseGlow 2s ease infinite" }}>↓</div>
                </div>
              </div>
            </div>

            {/* ── SPLASH / ABOUT SECTION ── */}
            <div
              style={{
                position: "relative",
                padding: "6rem 1.5rem",
                maxWidth: 800,
                margin: "0 auto",
              }}
            >
              {/* The thesis */}
              <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                <p
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                    fontWeight: 400,
                    lineHeight: 1.5,
                    color: "#2C1810",
                    marginBottom: "2rem",
                  }}
                >
                  Look closely. <span style={{ color: "#8B6914", fontStyle: "italic" }}>Y<span style={{ textDecoration: "underline", textDecorationColor: "rgba(212,185,106,0.4)", textUnderlineOffset: "4px" }}>our</span></span> was never just yours.
                  <br />
                  The word <em>your</em> contains <em style={{ color: "#8B6914" }}>our</em>.
                  <br />
                  That's not a typo. That's the whole point.
                </p>
              </div>

              {/* Value proposition blocks */}
              <div style={{ display: "grid", gap: "3rem", marginBottom: "4rem" }}>
                <GlassPanel style={{ padding: "2.5rem", borderLeft: "2px solid rgba(212,185,106,0.3)" }}>
                  <h3
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.7rem",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: "rgba(212,185,106,0.6)",
                      marginBottom: "1rem",
                    }}
                  >
                    What This Is
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "1.1rem",
                      lineHeight: 1.8,
                      color: "rgba(232,228,220,0.7)",
                    }}
                  >
                    Five questions that don't have right answers — only honest ones.
                    Each answer tilts a mirror. By the end, you'll see which dimension
                    of life is pulling you hardest right now: purpose, relationships,
                    body, truth, consciousness, or tribe. Not a personality quiz.
                    A reckoning.
                  </p>
                </GlassPanel>

                <GlassPanel style={{ padding: "2.5rem", borderLeft: "2px solid rgba(212,185,106,0.3)" }}>
                  <h3
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.7rem",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: "rgba(212,185,106,0.6)",
                      marginBottom: "1rem",
                    }}
                  >
                    What Happens Next
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "1.1rem",
                      lineHeight: 1.8,
                      color: "rgba(232,228,220,0.7)",
                    }}
                  >
                    Your archetype unlocks a map: essays that read like the conversation
                    you've been waiting to have, assessments that go deeper than you
                    expected, tools that actually work, and a community of people who
                    think like you do at 2am. Every minute you spend here shifts
                    something. The hour after changes everything else.
                  </p>
                </GlassPanel>

                <GlassPanel style={{ padding: "2.5rem", borderLeft: "2px solid rgba(212,185,106,0.3)" }}>
                  <h3
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.7rem",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: "rgba(212,185,106,0.6)",
                      marginBottom: "1rem",
                    }}
                  >
                    Why It Matters
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "1.1rem",
                      lineHeight: 1.8,
                      color: "rgba(232,228,220,0.7)",
                    }}
                  >
                    You can't be of service to the world until you know what you're
                    serving from. Self-knowledge isn't selfish — it's prerequisite.
                    Find your <em style={{ color: "#8B6914" }}>me</em> and you find the{" "}
                    <em style={{ color: "#8B6914" }}>our</em> that was hiding inside{" "}
                    <em style={{ color: "#8B6914" }}>your</em> all along. Then you find
                    your people. Then you change the world around you. That's the
                    sequence. That's the only sequence.
                  </p>
                </GlassPanel>
              </div>

              {/* The numbers */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: "1.5rem",
                  marginBottom: "4rem",
                  textAlign: "center",
                }}
              >
                {[
                  { num: "5", label: "Questions" },
                  { num: "6", label: "Dimensions" },
                  { num: "90+", label: "Essays" },
                  { num: "26", label: "Find Your ___" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "2.5rem",
                        color: "#8B6914",
                        lineHeight: 1,
                        marginBottom: "0.5rem",
                      }}
                    >
                      {stat.num}
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.65rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "rgba(212,185,106,0.5)",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── OR: WHAT ARE YOU HEALING FROM? ── */}
              <div style={{ marginBottom: "5rem" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "rgba(212,185,106,0.5)",
                      marginBottom: "1rem",
                    }}
                  >
                    Or Skip the Quiz
                  </div>
                  <h2
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                      fontWeight: 400,
                      lineHeight: 1.3,
                      color: "#2C1810",
                      marginBottom: "0.75rem",
                    }}
                  >
                    What Are You <span style={{ color: "#8B6914", fontStyle: "italic" }}>Healing</span> From?
                  </h2>
                  <p
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "1rem",
                      color: "rgba(232,228,220,0.4)",
                      maxWidth: 500,
                      margin: "0 auto",
                    }}
                  >
                    Pick the wound. We'll hand you the map.
                  </p>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {([
                    {
                      wound: "I keep choosing the wrong people",
                      subtext: "Relationships that drain instead of sustain",
                      icon: "♡",
                      color: "#C97B7B",
                      links: [
                        { label: "Find Your Partner", path: "https://intimacyassess-tcir3hon.manus.space", type: "assessment" },
                        { label: "Find Your Score", path: "/assessments/grant-study", type: "assessment" },
                        { label: "Find Your Mirror", path: "/the-mirror", type: "assessment" },
                      ],
                    },
                    {
                      wound: "I don't know what I'm building anymore",
                      subtext: "Purpose that went missing somewhere around 35",
                      icon: "✶",
                      color: "#8B6914",
                      links: [
                        { label: "Find Your Purpose", path: "/assessments/dharma-finder", type: "assessment" },
                        { label: "Find Your Blueprint", path: "/living-declaration", type: "tool" },
                        { label: "Find Your Index", path: "/the-index", type: "reading" },
                      ],
                    },
                    {
                      wound: "My body stopped listening to me",
                      subtext: "Health as negotiation instead of partnership",
                      icon: "○",
                      color: "#7BC9A4",
                      links: [
                        { label: "Find Your Chemistry", path: "https://regenhealth-4nns6jnd.manus.space", type: "tool" },
                        { label: "Find Your Water", path: "https://aqwaterqpr-wvzsc3ph.manus.space", type: "tool" },
                        { label: "Find Your Team", path: "/flow-circuit", type: "tool" },
                      ],
                    },
                    {
                      wound: "I see what's broken and nobody cares",
                      subtext: "Truth-telling in a world that rewards silence",
                      icon: "⚡",
                      color: "#E8C97B",
                      links: [
                        { label: "Find Your Purpose", path: "/assessments/dharma-finder", type: "assessment" },
                        { label: "Find Your Level", path: "/assessments/consciousness-scale", type: "assessment" },
                        { label: "Find Your Evidence", path: "/homeaglow-the-anatomy-of-a-consumer-fraud", type: "reading" },
                      ],
                    },
                    {
                      wound: "I can't find my people",
                      subtext: "Surrounded by humans, starving for tribe",
                      icon: "◦",
                      color: "#9B8EC9",
                      links: [
                        { label: "Find Your Score", path: "/assessments/grant-study", type: "assessment" },
                        { label: "Find Your Tribe", path: "/community", type: "community" },
                        { label: "Find Your Partner", path: "https://intimacyassess-tcir3hon.manus.space", type: "assessment" },
                      ],
                    },
                    {
                      wound: "I've glimpsed something bigger and can't unsee it",
                      subtext: "Consciousness expanding faster than your life can hold",
                      icon: "☉",
                      color: "#7BA8C9",
                      links: [
                        { label: "Find Your Level", path: "/assessments/consciousness-scale", type: "assessment" },
                        { label: "Find Your Mirror", path: "/the-mirror", type: "assessment" },
                        { label: "Find Your Team", path: "/flow-circuit", type: "tool" },
                      ],
                    },
                    {
                      wound: "I'm performing wellness instead of feeling it",
                      subtext: "The green juice is a lie and you know it",
                      icon: "❀",
                      color: "#A4C97B",
                      links: [
                        { label: "Find Your Chemistry", path: "https://regenhealth-4nns6jnd.manus.space", type: "tool" },
                        { label: "Find Myzcal", path: "https://mezcalagave-ahru9fq8.manus.space", type: "tool" },
                        { label: "Find Your Mirror", path: "/the-mirror", type: "assessment" },
                      ],
                    },
                    {
                      wound: "I have the resources but not the impact",
                      subtext: "Capital without consciousness is just noise",
                      icon: "⌂",
                      color: "#C9A87B",
                      links: [
                        { label: "Find Your Capital", path: "https://portfoliofamilyoffice.manus.space", type: "tool" },
                        { label: "Find Your Blueprint", path: "/living-declaration", type: "tool" },
                        { label: "Find Your Purpose", path: "/assessments/dharma-finder", type: "assessment" },
                      ],
                    },
                  ] as const).map((item) => (
                    <div
                      key={item.wound}
                      style={{
                        background: "rgba(10, 10, 16, 0.6)",
                        backdropFilter: "blur(20px) saturate(1.2)",
                        WebkitBackdropFilter: "blur(20px) saturate(1.2)",
                        border: "1px solid rgba(212, 185, 106, 0.12)",
                        borderRadius: "16px",
                        padding: "1.5rem",
                        cursor: "pointer",
                        transition: "all 0.4s ease",
                        borderLeft: `2px solid ${item.color}33`,
                        position: "relative" as const,
                        overflow: "hidden" as const,
                      }}
                      onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                        const el = e.currentTarget;
                        el.style.borderLeftColor = item.color;
                        el.style.transform = "translateX(4px)";
                        const linksEl = el.querySelector('.healing-links') as HTMLElement;
                        if (linksEl) linksEl.style.maxHeight = '200px';
                        if (linksEl) linksEl.style.opacity = '1';
                      }}
                      onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                        const el = e.currentTarget;
                        el.style.borderLeftColor = `${item.color}33`;
                        el.style.transform = "translateX(0)";
                        const linksEl = el.querySelector('.healing-links') as HTMLElement;
                        if (linksEl) linksEl.style.maxHeight = '0';
                        if (linksEl) linksEl.style.opacity = '0';
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                        <span style={{ fontSize: "1.5rem", color: item.color, flexShrink: 0, marginTop: "0.1rem" }}>{item.icon}</span>
                        <div>
                          <div
                            style={{
                              fontFamily: "'Source Sans 3', sans-serif",
                              fontSize: "1rem",
                              fontWeight: 600,
                              color: "#2C1810",
                              marginBottom: "0.3rem",
                              lineHeight: 1.4,
                            }}
                          >
                            {item.wound}
                          </div>
                          <div
                            style={{
                              fontFamily: "'Source Sans 3', sans-serif",
                              fontSize: "0.85rem",
                              color: "rgba(232,228,220,0.4)",
                              lineHeight: 1.5,
                            }}
                          >
                            {item.subtext}
                          </div>
                        </div>
                      </div>
                      {/* Expandable links */}
                      <div
                        className="healing-links"
                        style={{
                          maxHeight: 0,
                          opacity: 0,
                          overflow: "hidden",
                          transition: "all 0.4s ease",
                          marginTop: "1rem",
                          paddingLeft: "2.5rem",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                        }}
                      >
                        {item.links.map((link) => (
                          <a
                            key={link.label}
                            href={link.path}
                            target={link.path.startsWith("http") ? "_blank" : undefined}
                            rel={link.path.startsWith("http") ? "noopener noreferrer" : undefined}
                            style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "0.75rem",
                              letterSpacing: "0.1em",
                              color: item.color,
                              textDecoration: "none",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              transition: "opacity 0.2s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                          >
                            <span style={{ fontSize: "0.6rem" }}>
                              {link.type === "assessment" ? "◇" : link.type === "tool" ? "○" : link.type === "community" ? "◦" : "▹"}
                            </span>
                            {link.label} →
                          </a>
                        ))}
                        {/* Browse category link */}
                        {WOUND_TO_CATEGORY[item.wound] && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              scrollToCategory(WOUND_TO_CATEGORY[item.wound]);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "0.7rem",
                              letterSpacing: "0.1em",
                              color: "rgba(212,185,106,0.5)",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              padding: "0.3rem 0",
                              marginTop: "0.25rem",
                              transition: "color 0.2s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "#D4B96A"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(212,185,106,0.5)"; }}
                          >
                            <span style={{ fontSize: "0.6rem" }}>▼</span>
                            Browse {WOUND_TO_CATEGORY[item.wound]} ↓
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── JOURNEY PROGRESS TRACKER ── */}
              <div style={{ marginBottom: "3rem" }}>
                <JourneyTracker variant="light" />
              </div>

              {/* ── THE FULL ECOSYSTEM: FIND YOUR ___ DIRECTORY ── */}
              <div style={{ marginBottom: "5rem" }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "rgba(212,185,106,0.5)",
                      marginBottom: "1rem",
                    }}
                  >
                    The Full Ecosystem
                  </div>
                  <h2
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                      fontWeight: 400,
                      lineHeight: 1.3,
                      color: "#2C1810",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Every <span style={{ color: "#8B6914", fontStyle: "italic" }}>Find Y<span style={{ textDecoration: "underline", textDecorationColor: "rgba(212,185,106,0.4)", textUnderlineOffset: "4px" }}>our</span></span> ___
                  </h2>
                  <p
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "1rem",
                      color: "rgba(232,228,220,0.4)",
                      maxWidth: 550,
                      margin: "0 auto",
                    }}
                  >
                    26 doorways to self-knowledge. Some are live. Some are coming. All of them are you.
                  </p>

                  {/* Filter & Search Bar */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginTop: "1.5rem",
                    }}
                  >
                    {(["all", "live", "coming"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setDirectoryFilter(f)}
                        style={{
                          background: directoryFilter === f ? "rgba(212,185,106,0.15)" : "rgba(10,10,16,0.4)",
                          border: `1px solid ${directoryFilter === f ? "rgba(212,185,106,0.3)" : "rgba(212,185,106,0.08)"}`,
                          borderRadius: "20px",
                          padding: "0.4rem 1.2rem",
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.65rem",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase" as const,
                          color: directoryFilter === f ? "#D4B96A" : "rgba(212,185,106,0.4)",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                      >
                        {f === "all" ? "All" : f === "live" ? "● Live" : "○ Coming"}
                      </button>
                    ))}
                    <div style={{ position: "relative" }}>
                      <input
                        type="text"
                        placeholder="Search experiences..."
                        value={directorySearch}
                        onChange={(e) => setDirectorySearch(e.target.value)}
                        style={{
                          background: "rgba(10,10,16,0.4)",
                          border: "1px solid rgba(212,185,106,0.08)",
                          borderRadius: "20px",
                          padding: "0.4rem 1.2rem 0.4rem 2rem",
                          fontFamily: "'Source Sans 3', sans-serif",
                          fontSize: "0.85rem",
                          color: "#2C1810",
                          outline: "none",
                          width: "200px",
                          transition: "border-color 0.3s",
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(212,185,106,0.3)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(212,185,106,0.08)"; }}
                      />
                      <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.75rem", color: "rgba(212,185,106,0.3)" }}>⌕</span>
                    </div>
                  </div>
                </div>

                {/* Category sections */}
                {([
                  {
                    category: "Know Thyself",
                    subtitle: "The mirrors that don't lie",
                    color: "#8B6914",
                    items: [
                      { name: "Find My", hook: "5 questions. Zero right answers. One reckoning.", status: "live" as const, url: "/find-my" },
                      { name: "Find Your Purpose", hook: "What you can't stop doing — even when nobody's paying.", status: "live" as const, url: "/assessments/dharma-finder" },
                      { name: "Find Your Mirror", hook: "6 dimensions. 18 questions. A radar chart that doesn't care about your feelings.", status: "live" as const, url: "/the-mirror" },
                      { name: "Find Your Level", hook: "Where you sit on the consciousness scale — and what's keeping you there.", status: "live" as const, url: "/assessments/consciousness-scale" },
                      { name: "Find Your Score", hook: "85 years of Harvard data says relationships predict everything.", status: "live" as const, url: "/assessments/grant-study" },
                      { name: "Find Your Spirit", hook: "35 questions across 10 dimensions. Map your beliefs and discover which of 6 spiritual traditions align with your authentic identity.", status: "live" as const, url: "/find-your-spirit" },
                    ],
                  },
                  {
                    category: "Love & Belonging",
                    subtitle: "The people work",
                    color: "#C97B7B",
                    items: [
                      { name: "Find Your Partner", hook: "15 questions across 5 domains. The invisible architecture of your intimacy, mapped.", status: "live" as const, url: "https://intimacyassess-tcir3hon.manus.space" },
                      { name: "Find Your Tribe", hook: "The people who think like you do at 2am.", status: "live" as const, url: "/community" },
                      { name: "Find Your Team", hook: "The neurochemistry of connection — who you build with, measured not guessed.", status: "live" as const, url: "/flow-circuit" },
                      { name: "Find Your Attachment Style", hook: "Why you cling, why you run, and what to do about it.", status: "live" as const, url: "/find-your-attachment-style" },
                      { name: "Find Your Love Language", hook: "Not the book. The actual operating system underneath.", status: "live" as const, url: "/find-your-love-language" },
                    ],
                  },
                  {
                    category: "Body & Temple",
                    subtitle: "The vessel that carries everything else",
                    color: "#7BC9A4",
                    items: [
                      { name: "Find Your Chemistry", hook: "Your body is a lab. Time to read the results.", status: "live" as const, url: "https://regenhealth-4nns6jnd.manus.space" },
                      { name: "Find Your Water", hook: "The element that teaches you to flow, not force.", status: "live" as const, url: "https://aqwaterqpr-wvzsc3ph.manus.space" },

                      { name: "Find Your Diet", hook: "Not a meal plan. A metabolic philosophy matched to your biology.", status: "live" as const, url: "/find-your-diet" },
                      { name: "Find Your Movement", hook: "The exercise your nervous system is actually asking for.", status: "live" as const, url: "/find-your-movement" },
                      { name: "Find Your Sleep", hook: "The architecture of rest you've been negotiating with instead of honoring.", status: "live" as const, url: "/find-your-sleep" },
                    ],
                  },
                  {
                    category: "Taste & Ritual",
                    subtitle: "What touches your mouth should touch your mind and heart",
                    color: "#C9A87B",
                    items: [
                      { name: "Find Myzcal", hook: "The agave that matches your soul — not your Instagram.", status: "live" as const, url: "https://mezcalagave-ahru9fq8.manus.space" },
                      { name: "Find Your Tequila", hook: "Highland or lowland. Blanco or añejo. A love letter in liquid form.", status: "live" as const, url: "https://tequilaazul-fxqrr3js.manus.space" },
                      { name: "Find Your Sake", hook: "Rice, water, koji, time. The most honest drink on earth.", status: "live" as const, url: "/find-your-sake" },
                      { name: "Find Your Coffee", hook: "Single origin isn't a flex. It's a relationship.", status: "live" as const, url: "/find-your-coffee" },
                      { name: "Find Your Kitchen", hook: "The restaurant that feeds who you actually are, not who you're performing.", status: "live" as const, url: "/find-your-kitchen" },
                    ],
                  },
                  {
                    category: "Mind & Systems",
                    subtitle: "For the ones who see the architecture underneath",
                    color: "#7BA8C9",
                    items: [
                      { name: "Find Your Blueprint", hook: "The operating system for what comes after extraction.", status: "live" as const, url: "/living-declaration" },
                      { name: "Find Your Capital", hook: "How aligned money actually moves.", status: "live" as const, url: "https://portfoliofamilyoffice.manus.space" },
                      { name: "Find Your Therapy", hook: "CBT, IFS, somatic, psychedelic-assisted — matched to your wiring, not a waitlist.", status: "live" as const, url: "/find-your-therapy" },
                      { name: "Find Your Religion", hook: "Not which one is right. Which one is yours — or none at all. 20 questions mapping your worldview across 8 dimensions to 8 spiritual archetypes.", status: "live" as const, url: "/find-your-religion" },
                      { name: "Find Your Style", hook: "Clothing as identity architecture. What you wear is what you're saying without speaking.", status: "live" as const, url: "/find-your-style" },
                    ],
                  },
                ] as const).map((section) => {
                  const filteredItems = section.items.filter((item) => {
                    const statusMatch = directoryFilter === "all" || item.status === directoryFilter;
                    const searchMatch = !directorySearch || item.name.toLowerCase().includes(directorySearch.toLowerCase()) || item.hook.toLowerCase().includes(directorySearch.toLowerCase());
                    return statusMatch && searchMatch;
                  });
                  if (filteredItems.length === 0) return null;
                  const isHighlighted = highlightCategory === section.category;
                  return (
                  <div
                    key={section.category}
                    ref={(el) => { directorySectionRefs.current[section.category] = el; }}
                    style={{
                      marginBottom: "2.5rem",
                      transition: "all 0.6s ease",
                      ...(isHighlighted ? {
                        background: "rgba(212,185,106,0.04)",
                        borderRadius: "16px",
                        padding: "1.5rem",
                        border: "1px solid rgba(139,105,20,0.15)",
                        boxShadow: "0 0 40px rgba(212,185,106,0.08)",
                      } : {}),
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1.25rem" }}>
                      <h3
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: "1.3rem",
                          fontWeight: 400,
                          color: section.color,
                        }}
                      >
                        {section.category}
                      </h3>
                      <span
                        style={{
                          fontFamily: "'Source Sans 3', sans-serif",
                          fontSize: "0.85rem",
                          color: "rgba(232,228,220,0.3)",
                          fontStyle: "italic",
                        }}
                      >
                        {section.subtitle}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                        gap: "0.75rem",
                      }}
                    >
                      {filteredItems.map((item) => {
                        const isLive = item.status === "live";
                        const inner = (
                          <div
                            key={item.name}
                            className="choice-btn"
                            style={{
                              background: isLive ? "rgba(10, 10, 16, 0.6)" : "rgba(10, 10, 16, 0.3)",
                              backdropFilter: "blur(16px) saturate(1.2)",
                              WebkitBackdropFilter: "blur(16px) saturate(1.2)",
                              border: `1px solid ${isLive ? "rgba(212, 185, 106, 0.12)" : "rgba(212, 185, 106, 0.06)"}`,
                              borderRadius: "12px",
                              padding: "1.15rem 1.25rem",
                              cursor: isLive ? "pointer" : "default",
                              opacity: isLive ? 1 : 0.55,
                              position: "relative" as const,
                              overflow: "hidden" as const,
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                              <span
                                style={{
                                  fontFamily: "'Playfair Display', Georgia, serif",
                                  fontSize: "0.95rem",
                                  color: isLive ? "#D4B96A" : "rgba(212,185,106,0.5)",
                                  lineHeight: 1.3,
                                }}
                              >
                                {item.name}
                              </span>
                              <span
                                style={{
                                  fontFamily: "'DM Mono', monospace",
                                  fontSize: "0.55rem",
                                  letterSpacing: "0.1em",
                                  textTransform: "uppercase" as const,
                                  color: isLive ? "rgba(123,201,164,0.7)" : "rgba(212,185,106,0.3)",
                                  border: `1px solid ${isLive ? "rgba(123,201,164,0.2)" : "rgba(212,185,106,0.1)"}`,
                                  borderRadius: "4px",
                                  padding: "2px 6px",
                                  flexShrink: 0,
                                  marginLeft: "0.5rem",
                                }}
                              >
                                {isLive ? "LIVE" : "COMING"}
                              </span>
                            </div>
                            <p
                              style={{
                                fontFamily: "'Source Sans 3', sans-serif",
                                fontSize: "0.82rem",
                                lineHeight: 1.5,
                                color: "rgba(232,228,220,0.4)",
                                margin: 0,
                              }}
                            >
                              {item.hook}
                            </p>
                          </div>
                        );

                        if (isLive && item.url) {
                          const isExternal = item.url.startsWith("http");
                          if (isExternal) {
                            return (
                              <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                                {inner}
                              </a>
                            );
                          }
                          return (
                            <Link key={item.name} href={item.url} style={{ textDecoration: "none" }}>
                              {inner}
                            </Link>
                          );
                        }
                        return <div key={item.name}>{inner}</div>;
                      })}
                    </div>
                  </div>
                  );
                })}

                {/* Ecosystem stats */}
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "2.5rem",
                    padding: "2rem",
                    borderTop: "1px solid rgba(212,185,106,0.08)",
                    borderBottom: "1px solid rgba(212,185,106,0.08)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "3rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {[
                      { num: "26", label: "Live Now" },
                      { num: "0", label: "Coming Soon" },
                      { num: "5", label: "Categories" },
                      { num: "∞", label: "Rabbit Holes" },
                    ].map((s) => (
                      <div key={s.label}>
                        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.8rem", color: "#8B6914", lineHeight: 1 }}>{s.num}</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(212,185,106,0.4)", marginTop: "0.3rem" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── TWO PATHS DIVIDER ── */}
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(212,185,106,0.3)",
                    marginBottom: "2rem",
                  }}
                >
                  ─── or let the mirror decide ───
                </div>
              </div>

              {/* Final CTA */}
              <div style={{ textAlign: "center" }}>
                <GlassPanel
                  style={{
                    display: "inline-block",
                    padding: "1.25rem 3.5rem",
                    cursor: "pointer",
                    animation: "pulseGlow 3s ease infinite",
                    transition: "all 0.3s ease",
                  }}
                >
                  <button
                    onClick={() => {
                      setPhase("assessment");
                      setFadeIn(false);
                      setTimeout(() => setFadeIn(true), 100);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#8B6914",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.9rem",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Show Me What I Already Know →
                  </button>
                </GlassPanel>

                <p
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.9rem",
                    color: "rgba(232,228,220,0.35)",
                    marginTop: "1.5rem",
                    fontStyle: "italic",
                  }}
                >
                  Takes 3 minutes. Stays with you longer.
                </p>

                <p
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    color: "rgba(212,185,106,0.2)",
                    marginTop: "3rem",
                  }}
                >
                  ZERO ALGORITHM · ALL NERVE · ONE ECOSYSTEM
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── ASSESSMENT PHASE ── */}
        {phase === "assessment" && currentQuestion && (
          <div
            ref={questionRef}
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem 1.5rem",
              position: "relative",
              zIndex: 1,
              opacity: fadeIn ? 1 : 0,
              transition: "opacity 0.8s ease",
            }}
          >
            {/* Progress bar */}
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: "rgba(212,185,106,0.1)",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #8B6914, #D4B96A)",
                  transition: "width 0.6s ease",
                }}
              />
            </div>

            {/* Question counter */}
            <div
              style={{
                position: "fixed",
                top: "1.5rem",
                right: "1.5rem",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                color: "rgba(212,185,106,0.4)",
                zIndex: 10,
              }}
            >
              {currentQ + 1} / {QUESTIONS.length}
            </div>

            {/* Back to landing */}
            <button
              onClick={() => {
                if (currentQ > 0) {
                  setCurrentQ((prev) => prev - 1);
                  setSelectedChoice(null);
                } else {
                  setPhase("landing");
                }
              }}
              style={{
                position: "fixed",
                top: "1.5rem",
                left: "1.5rem",
                background: "none",
                border: "none",
                color: "rgba(212,185,106,0.4)",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              ← BACK
            </button>

            <div
              style={{
                maxWidth: 640,
                width: "100%",
                opacity: transitioning ? 0 : 1,
                transform: transitioning ? "translateY(-20px)" : "translateY(0)",
                transition: "all 0.5s ease",
              }}
            >
              {/* Question stem */}
              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
                  fontWeight: 400,
                  lineHeight: 1.4,
                  marginBottom: "0.75rem",
                  color: "#2C1810",
                }}
              >
                {currentQuestion.stem}
              </h2>

              {/* Subtext */}
              <p
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.95rem",
                  color: "rgba(212,185,106,0.5)",
                  fontStyle: "italic",
                  marginBottom: "3rem",
                }}
              >
                {currentQuestion.subtext}
              </p>

              {/* Choices */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {currentQuestion.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    className={`choice-btn ${selectedChoice === idx ? "selected" : ""}`}
                    onClick={() => handleChoice(idx)}
                    disabled={transitioning}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "1.25rem 1.5rem",
                      background: selectedChoice === idx ? "rgba(212,185,106,0.15)" : "rgba(10,10,16,0.4)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      border: `1px solid ${selectedChoice === idx ? "#D4B96A" : "rgba(212,185,106,0.1)"}`,
                      borderRadius: "12px",
                      color: "#2C1810",
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "1.05rem",
                      lineHeight: 1.5,
                      cursor: transitioning ? "default" : "pointer",
                      opacity: transitioning && selectedChoice !== idx ? 0.3 : 1,
                    }}
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── RESULTS PHASE ── */}
        {phase === "results" && (
          <div
            style={{
              minHeight: "100vh",
              padding: "4rem 1.5rem",
              position: "relative",
              zIndex: 1,
              opacity: resultsFadeIn ? 1 : 0,
              transition: "opacity 1s ease",
            }}
          >
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
              {/* Eyebrow */}
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(212,185,106,0.5)",
                  textAlign: "center",
                  marginBottom: "1rem",
                }}
              >
                What the Mirror Caught
              </div>

              {/* Archetype name */}
              <h1
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  fontWeight: 400,
                  textAlign: "center",
                  marginBottom: "0.5rem",
                  color: "#8B6914",
                }}
              >
                {archetype.name}
              </h1>

              {/* Tagline */}
              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.15rem",
                  fontStyle: "italic",
                  textAlign: "center",
                  color: "rgba(232,228,220,0.6)",
                  marginBottom: "3rem",
                  maxWidth: 500,
                  margin: "0 auto 3rem",
                }}
              >
                {archetype.tagline}
              </p>

              {/* Radar + Description */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "2rem",
                  marginBottom: "3rem",
                }}
              >
                <GlassPanel style={{ padding: "2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <RadarChart scores={dimensionScores} />
                </GlassPanel>

                <GlassPanel style={{ padding: "2rem" }}>
                  <p
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "1.05rem",
                      lineHeight: 1.8,
                      color: "rgba(232,228,220,0.75)",
                    }}
                  >
                    {archetype.description}
                  </p>
                  <div style={{ marginTop: "1.5rem" }}>
                    {Object.entries(dimensionScores)
                      .sort((a, b) => b[1] - a[1])
                      .map(([dim, score]) => (
                        <div key={dim} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                          <span
                            style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "0.7rem",
                              color: "rgba(212,185,106,0.5)",
                              width: 90,
                              textAlign: "right",
                            }}
                          >
                            {DIMENSION_LABELS[dim]?.split(" ")[0]}
                          </span>
                          <div style={{ flex: 1, height: 4, background: "rgba(212,185,106,0.1)", borderRadius: 2 }}>
                            <div
                              style={{
                                height: "100%",
                                width: `${score * 10}%`,
                                background: "linear-gradient(90deg, #8B6914, #D4B96A)",
                                borderRadius: 2,
                                transition: "width 1s ease",
                              }}
                            />
                          </div>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#8B6914", width: 30 }}>
                            {score.toFixed(1)}
                          </span>
                        </div>
                      ))}
                  </div>
                </GlassPanel>
              </div>

              {/* Share prompt */}
              <GlassPanel
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  marginBottom: "3rem",
                  animation: "pulseGlow 3s ease infinite",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "1.3rem",
                    color: "#8B6914",
                    marginBottom: "0.5rem",
                  }}
                >
                  You found y<span style={{ color: "#8B6914" }}>our</span> Me. Now find y<span style={{ color: "#8B6914" }}>our</span> We.
                </p>
                <p
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.95rem",
                    color: "rgba(232,228,220,0.5)",
                    marginBottom: "1.5rem",
                  }}
                >
                  Send this to 10 people brave enough to look. The ones who text back are your tribe.
                </p>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                  {[
                    { platform: "twitter", label: "𝕏" },
                    { platform: "linkedin", label: "in" },
                    { platform: "email", label: "✉" },
                    { platform: "copy", label: "⎘" },
                  ].map(({ platform, label }) => (
                    <button
                      key={platform}
                      onClick={() => handleShare(platform)}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: "rgba(212,185,106,0.1)",
                        border: "1px solid rgba(139,105,20,0.2)",
                        color: "#8B6914",
                        fontSize: "1rem",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.background = "rgba(212,185,106,0.25)";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.background = "rgba(212,185,106,0.1)";
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {shareCount > 0 && (
                  <p
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.7rem",
                      color: "rgba(212,185,106,0.4)",
                      marginTop: "1rem",
                    }}
                  >
                    {shareCount} of 10 shared · {10 - shareCount > 0 ? `${10 - shareCount} to go` : "You're a Tribe Weaver already"}
                  </p>
                )}
              </GlassPanel>

              {/* Your Journey: Articles */}
              <div style={{ marginBottom: "3rem" }}>
                <h3
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.75rem",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "rgba(212,185,106,0.5)",
                    marginBottom: "1.5rem",
                  }}
                >
                  Rabbit Holes Worth Falling Into
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                  {archetype.articles.map((slug, idx) => (
                    <Link key={slug} href={`/blog/${slug}`}>
                      <GlassPanel
                        className="choice-btn"
                        style={{
                          padding: "1.25rem",
                          cursor: "pointer",
                          display: "block",
                          textDecoration: "none",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "0.65rem",
                            color: "rgba(212,185,106,0.4)",
                          }}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <p
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: "0.95rem",
                            color: "#2C1810",
                            marginTop: "0.25rem",
                            lineHeight: 1.4,
                          }}
                        >
                          {getArticleTitle(slug)}
                        </p>
                      </GlassPanel>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Find Your ___ : Satellite Sites */}
              <div style={{ marginBottom: "3rem" }}>
                <h3
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.75rem",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "rgba(212,185,106,0.5)",
                    marginBottom: "1.5rem",
                  }}
                >
                  Find Your ___
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
                  {archetype.sites.map((site) => (
                    <a
                      key={site.url}
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <GlassPanel
                        className="choice-btn"
                        style={{ padding: "1.25rem", cursor: "pointer", height: "100%" }}
                      >
                        <p
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: "1rem",
                            color: "#8B6914",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {site.name}
                        </p>
                        <p
                          style={{
                            fontFamily: "'Source Sans 3', sans-serif",
                            fontSize: "0.85rem",
                            color: "rgba(232,228,220,0.5)",
                            lineHeight: 1.5,
                          }}
                        >
                          {site.why}
                        </p>
                      </GlassPanel>
                    </a>
                  ))}
                </div>
              </div>

              {/* Deeper Assessments + Next Step */}
              <div style={{ marginBottom: "3rem" }}>
                <h3
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.75rem",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "rgba(212,185,106,0.5)",
                    marginBottom: "1.5rem",
                  }}
                >
                  Go Deeper
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                  {archetype.deeperAssessments.map((assess) => (
                    <Link key={assess.path} href={assess.path}>
                      <GlassPanel
                        className="choice-btn"
                        style={{ padding: "1.25rem", cursor: "pointer", height: "100%" }}
                      >
                        <p
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: "1rem",
                            color: "#8B6914",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {assess.label} →
                        </p>
                        <p
                          style={{
                            fontFamily: "'Source Sans 3', sans-serif",
                            fontSize: "0.85rem",
                            color: "rgba(232,228,220,0.5)",
                            lineHeight: 1.5,
                          }}
                        >
                          {assess.why}
                        </p>
                      </GlassPanel>
                    </Link>
                  ))}
                </div>

                {/* Primary next step + always-present community always-present community & manifesto living declaration */}
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginTop: "1.5rem" }}>
                  {archetype.nextStep.path.startsWith("http") ? (
                    <a href={archetype.nextStep.path} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                      <GlassPanel
                        style={{
                          padding: "1rem 2rem",
                          cursor: "pointer",
                          animation: "pulseGlow 3s ease infinite",
                        }}
                      >
                        <span style={{ color: "#8B6914", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", letterSpacing: "0.15em" }}>
                          {archetype.nextStep.label}
                        </span>
                      </GlassPanel>
                    </a>
                  ) : (
                    <Link href={archetype.nextStep.path}>
                      <GlassPanel
                        style={{
                          padding: "1rem 2rem",
                          cursor: "pointer",
                          animation: "pulseGlow 3s ease infinite",
                        }}
                      >
                        <span style={{ color: "#8B6914", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", letterSpacing: "0.15em" }}>
                          {archetype.nextStep.label}
                        </span>
                      </GlassPanel>
                    </Link>
                  )}
                  {archetype.nextStep.path !== "/community" && (
                    <Link href="/community">
                      <GlassPanel style={{ padding: "1rem 2rem", cursor: "pointer" }}>
                        <span style={{ color: "rgba(232,228,220,0.6)", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", letterSpacing: "0.15em" }}>
                          Find Your Tribe →
                        </span>
                      </GlassPanel>
                    </Link>
                  )}
                  {archetype.nextStep.path !== "/living-declaration" && (
                    <Link href="/living-declaration">
                      <GlassPanel style={{ padding: "1rem 2rem", cursor: "pointer" }}>
                        <span style={{ color: "rgba(232,228,220,0.6)", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", letterSpacing: "0.15em" }}>
                          Find Your Living Declaration →
                        </span>
                      </GlassPanel>
                    </Link>
                  )}
                </div>
              </div>

              {/* Retake / Home */}
              <div style={{ textAlign: "center", marginTop: "2rem", paddingBottom: "4rem" }}>
            {/* Save / Share / PDF Actions */}
            <AssessmentResultActions
              assessmentType="find-your-me"
              sessionId={sessionId}
              answers={JSON.stringify(answers)}
              resultSummary={JSON.stringify({ dimensions: dimensionScores })}
              totalScore={null}
            />

                <button
                  onClick={() => {

                    setPhase("landing");
                    setCurrentQ(0);
                    setAnswers({});
                    setSelectedChoice(null);
                    setShareCount(0);
                    setShowSharePrompt(false);
                    setFadeIn(false);
                    setTimeout(() => setFadeIn(true), 100);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(212,185,106,0.3)",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.7rem",
                    letterSpacing: "0.15em",
                    cursor: "pointer",
                    marginRight: "2rem",
                  }}
                >
                  SHUFFLE THE DECK
                </button>
                <Link
                  href="/"
                  style={{
                    color: "rgba(212,185,106,0.3)",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.7rem",
                    letterSpacing: "0.15em",
                    textDecoration: "none",
                  }}
                >
                  BACK TO THE MOTHERSHIP
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
