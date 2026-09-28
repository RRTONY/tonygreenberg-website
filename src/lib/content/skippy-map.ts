// Ported from legacy client/src/pages/SkippyMap.tsx — Skippy's personalized
// "site compass". Real copy, unchanged, with these link updates:
// - `/the-index` → `/search` and `/cheshire-grin` → `/alex-azzi` (their
//   next.config.ts redirect targets), `/life-assessment` → `/the-mirror`
//   (its canonical route), so every link lands without a redirect hop.
// - Stops whose route doesn't exist in this app yet carry `href: null` and
//   render as "Coming Soon" instead of a broken link (same pattern as
//   /the-philosophy): /friend-gate and /post-intervention (need a real
//   backend, Phase 4 deferral), /pri-research (admin-only in legacy),
//   /thought-cloud (never ported).
// Emoji `emoji` fields are replaced by a Lucide icon key (`icon`), rendered
// by the component — same conversion done on other ported pages.

export interface SkippyStop {
  id: string;
  label: string;
  href: string | null;
  description: string;
  time: string;
  featured?: boolean;
  isStart?: boolean;
}

export type TentacleIcon = "star" | "brain" | "sprout" | "user" | "gem" | "flask" | "coffee" | "leaf" | "globe" | "search";

export type TentacleTheme = "amber" | "indigo" | "emerald" | "pink" | "sky" | "orange" | "brown" | "forest" | "violet" | "red";

export interface Tentacle {
  id: string;
  title: string;
  icon: TentacleIcon;
  theme: TentacleTheme;
  stops: SkippyStop[];
}

export const SKIPPY_STORAGE_KEY = "skippy-journey-progress";

export const TENTACLES: Tentacle[] = [
  {
    id: "featured",
    title: "START HERE — Your Featured Path",
    icon: "star",
    theme: "amber",
    stops: [
      { id: "start-here", label: "Start Here", href: "/start-here", description: "5 foundational essays that define the worldview. Your orientation.", time: "20 min", isStart: true },
      { id: "pri", label: "Psychedelic Readiness Index", href: "/psychedelic-readiness-index", description: "The most rigorous self-assessment in the field. Are you ready?", time: "25–45 min", featured: true },
      { id: "facilitator-index", label: "Facilitator Index", href: "/facilitator-index", description: "108 items. 12 bands. Find your archetype as a guide. The newest upgraded version — you're among the first 160.", time: "30–60 min", featured: true },
      { id: "friend-gate", label: "Three Friends Permission Gate", href: null, description: "Before you go deeper — get permission from three people who know you. This is the gate.", time: "5 min + 72h wait", featured: true },
      { id: "post-intervention", label: "Post-Intervention Assessment", href: null, description: "After the ceremony, the real work begins. Return here at Day 1, Day 3, or Day 7 to send anonymous feedback to your facilitator. Your honesty makes the field safer for everyone.", time: "10 min · choose your day", featured: true },
    ],
  },
  {
    id: "mind",
    title: "The Mind",
    icon: "brain",
    theme: "indigo",
    stops: [
      { id: "essays", label: "Essays", href: "/essays", description: "119 essays on systems, trust, capital, and consciousness.", time: "∞" },
      { id: "the-index", label: "The Index", href: "/search", description: "Searchable idea database across all essays.", time: "10 min" },
      { id: "series", label: "Series", href: "/series", description: "Multi-part deep dives on specific themes.", time: "varies" },
      { id: "manifesto", label: "Living Declaration", href: "/living-declaration", description: "The manifesto. What Tony stands for.", time: "5 min" },
      { id: "thought-cloud", label: "Thought Cloud", href: null, description: "10 magic prompts showing what the ecosystem does.", time: "10 min" },
    ],
  },
  {
    id: "consciousness",
    title: "Consciousness & Medicine",
    icon: "sprout",
    theme: "emerald",
    stops: [
      { id: "pri-research", label: "PRI Research", href: null, description: "The science behind the Psychedelic Readiness Index.", time: "15 min" },
      { id: "pri-calibration", label: "PRI Calibration", href: "/pri-calibration", description: "How the instrument was calibrated.", time: "10 min" },
      { id: "peyote-mescaline", label: "Peyote & Mescaline Deep Dive", href: "/peyote-mescaline", description: "Everything you need to know.", time: "20 min" },
      { id: "iboga-ibogaine", label: "Iboga & Ibogaine", href: "/iboga-ibogaine", description: "The most powerful and dangerous medicine.", time: "20 min" },
      { id: "iboga-compass", label: "Iboga Compass Assessment", href: "/iboga-compass", description: "Are you a candidate for ibogaine therapy?", time: "15 min" },
      { id: "consciousness-scale", label: "Consciousness Scale", href: "/consciousness-scale", description: "Where do you sit on the Hawkins map?", time: "10 min" },
    ],
  },
  {
    id: "self",
    title: "Know Yourself",
    icon: "user",
    theme: "pink",
    stops: [
      { id: "dharma-finder", label: "Dharma Finder", href: "/dharma-finder", description: "What is your purpose? Find it here.", time: "15 min" },
      { id: "self-portrait", label: "Self Portrait", href: "/self-portrait", description: "A mirror. Who are you, really?", time: "10 min" },
      { id: "life-assessment", label: "Life Assessment", href: "/the-mirror", description: "Where are you in the arc of your life?", time: "15 min" },
      { id: "soulscore", label: "Soul Score", href: "/soulscore", description: "Your soul's current operating frequency.", time: "10 min" },
      { id: "find-your-me", label: "Find Your Me", href: "/find-your-me", description: "The full self-discovery suite.", time: "varies" },
      { id: "grant-study", label: "Grant Study", href: "/grant-study", description: "Harvard's 80-year study on what makes a good life.", time: "15 min" },
    ],
  },
  {
    id: "capital",
    title: "Capital & Impact",
    icon: "gem",
    theme: "sky",
    stops: [
      { id: "intel", label: "Intel", href: "/intel", description: "Portfolio intelligence — 9 companies, live news.", time: "15 min" },
      { id: "impact-dashboard", label: "Impact Dashboard", href: "/impact-dashboard", description: "Measuring what matters.", time: "10 min" },
      { id: "invest", label: "Invest", href: "/invest", description: "How to align capital with conscience.", time: "10 min" },
      { id: "thesis-threads", label: "Thesis Threads", href: "/thesis-threads", description: "The investment theses behind the portfolio.", time: "15 min" },
      { id: "charity-scorecard", label: "Charity Scorecard", href: "/charity-scorecard", description: "Which charities actually move the needle?", time: "10 min" },
    ],
  },
  {
    id: "body",
    title: "The Body",
    icon: "flask",
    theme: "orange",
    stops: [
      { id: "peptide-library", label: "Peptide Library", href: "/peptide-library", description: "The most comprehensive peptide reference available.", time: "varies" },
      { id: "find-your-peptide", label: "Find Your Peptide", href: "/find-your-peptide", description: "Which peptides are right for you?", time: "10 min" },
      { id: "peptide-matrix", label: "Peptide Matrix", href: "/peptide-matrix", description: "The full protocol matrix.", time: "15 min" },
      { id: "verify-your-coa", label: "Verify Your COA", href: "/verify-your-coa", description: "Is your peptide source legitimate?", time: "5 min" },
      { id: "the-body", label: "The Body", href: "/the-body", description: "Tony's personal health philosophy.", time: "10 min" },
    ],
  },
  {
    id: "coffee",
    title: "BrewSoul",
    icon: "coffee",
    theme: "brown",
    stops: [
      { id: "brewsoul", label: "BrewSoul Home", href: "/brewsoul", description: "Coffee as consciousness. The full universe.", time: "varies" },
      { id: "brewsoul-quiz", label: "Coffee Quiz", href: "/brewsoul/quiz", description: "Find your perfect cup.", time: "5 min" },
      { id: "brewsoul-health", label: "Coffee & Health", href: "/brewsoul/health", description: "The science of coffee and your body.", time: "15 min" },
      { id: "brewsoul-prescription", label: "Your Prescription", href: "/brewsoul/prescription", description: "A personalized coffee prescription.", time: "10 min" },
    ],
  },
  {
    id: "kava",
    title: "Kava Encyclopedia",
    icon: "leaf",
    theme: "forest",
    stops: [
      { id: "kava", label: "Kava Home", href: "/kava", description: "The world's most complete kava reference.", time: "varies" },
      { id: "kava-science", label: "Kava Science", href: "/kava/science", description: "The pharmacology and research.", time: "15 min" },
      { id: "kava-assessment", label: "Kava Assessment", href: "/kava/assessment", description: "Is kava right for you?", time: "10 min" },
    ],
  },
  {
    id: "ecosystem",
    title: "The Ecosystem",
    icon: "globe",
    theme: "violet",
    stops: [
      { id: "about", label: "About Tony", href: "/about", description: "The story. 25 years. $24B+. What drives him.", time: "10 min" },
      { id: "ecosystem", label: "Join the Ecosystem", href: "/ecosystem", description: "Observer, Contributor, Investor, Partner, Curator.", time: "10 min" },
      { id: "community", label: "Community", href: "/community", description: "The people building what comes next.", time: "10 min" },
      { id: "clients", label: "Clients", href: "/clients", description: "Microsoft, Disney, Goldman Sachs, Nike, and hundreds more.", time: "10 min" },
      { id: "humanos", label: "Humanos", href: "/humanos", description: "The human-first technology philosophy.", time: "15 min" },
    ],
  },
  {
    id: "attention",
    title: "Attention & Accountability",
    icon: "search",
    theme: "red",
    stops: [
      { id: "attention-theft", label: "Attention Theft", href: "/attention-theft", description: "Who is stealing your attention and how.", time: "15 min" },
      { id: "cheshire-grin", label: "Cheshire Grin", href: "/alex-azzi", description: "The accountability project.", time: "10 min" },
      { id: "protecting-your-business", label: "Protecting Your Business", href: "/protecting-your-business", description: "Defense against predatory vendors.", time: "15 min" },
    ],
  },
];

export const TOTAL_STOPS = TENTACLES.reduce((sum, t) => sum + t.stops.length, 0);
