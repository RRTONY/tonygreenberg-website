export type SkippyIconKey =
  "book" | "brain" | "briefcase" | "coffee" | "compass" | "flask" | "heart" | "leaf";

export type SkippyStop = {
  id: string;
  label: string;
  description: string;
  href: string;
  minutes: string;
  featured?: boolean;
};

export type SkippyTrack = {
  id: string;
  title: string;
  description: string;
  icon: SkippyIconKey;
  tone: "amber" | "emerald" | "rose" | "sky" | "violet";
  stops: readonly SkippyStop[];
};

export const SKIPPY_TRACKS: readonly SkippyTrack[] = [
  {
    id: "featured",
    title: "Start Here",
    description:
      "A practical entry path through the site's active orientation, assessment, and readiness resources.",
    icon: "compass",
    tone: "amber",
    stops: [
      {
        id: "start-here",
        label: "Start Here",
        description: "Five foundational essays for orientation.",
        href: "/start-here",
        minutes: "20 min",
        featured: true,
      },
      {
        id: "pri",
        label: "Psychedelic Readiness Index",
        description: "A guided readiness assessment with safety-oriented context.",
        href: "/psychedelic-readiness-index",
        minutes: "25–45 min",
        featured: true,
      },
      {
        id: "facilitator-index",
        label: "Facilitator Index",
        description: "Explore guide and facilitator archetypes.",
        href: "/facilitator-index",
        minutes: "30–60 min",
        featured: true,
      },
      {
        id: "iboga-compass",
        label: "Iboga Compass",
        description: "A safety-focused suitability assessment.",
        href: "/iboga-compass",
        minutes: "15 min",
        featured: true,
      },
    ],
  },
  {
    id: "mind",
    title: "Read & Think",
    description:
      "Essays, series, and principles for tracing the ideas that connect the wider ecosystem.",
    icon: "book",
    tone: "violet",
    stops: [
      {
        id: "essays",
        label: "Essays",
        description: "Long-form writing on systems, trust, capital, and consciousness.",
        href: "/essays",
        minutes: "Open-ended",
      },
      {
        id: "series",
        label: "Series",
        description: "Multi-part explorations of specific themes.",
        href: "/series",
        minutes: "Varies",
      },
      {
        id: "living-declaration",
        label: "Living Declaration",
        description: "The ongoing statement of principles and commitments.",
        href: "/living-declaration",
        minutes: "5 min",
      },
      {
        id: "philosophy",
        label: "The Philosophy",
        description: "A concise map of the ideas behind the work.",
        href: "/the-philosophy",
        minutes: "10 min",
      },
    ],
  },
  {
    id: "consciousness",
    title: "Consciousness & Medicine",
    description:
      "Safety-first education, calibration, and reflection tools for complex personal decisions.",
    icon: "brain",
    tone: "emerald",
    stops: [
      {
        id: "pri-efficacy",
        label: "PRI Efficacy",
        description: "Review the public efficacy and methodology material.",
        href: "/pri-efficacy",
        minutes: "15 min",
      },
      {
        id: "pri-calibration",
        label: "PRI Calibration",
        description: "Understand how the readiness instrument is calibrated.",
        href: "/pri-calibration",
        minutes: "10 min",
      },
      {
        id: "iboga-ibogaine",
        label: "Iboga & Ibogaine",
        description: "A risk-aware overview of a powerful medicine.",
        href: "/iboga-ibogaine",
        minutes: "20 min",
      },
      {
        id: "consciousness-scale",
        label: "Consciousness Scale",
        description: "Reflect on where you sit on the Hawkins map.",
        href: "/consciousness-scale",
        minutes: "10 min",
      },
    ],
  },
  {
    id: "self",
    title: "Know Yourself",
    description:
      "Self-discovery assessments that connect purpose, patterns, and current circumstances.",
    icon: "heart",
    tone: "rose",
    stops: [
      {
        id: "find-your-me",
        label: "Find Your Me",
        description: "The full self-discovery suite.",
        href: "/find-your-me",
        minutes: "Varies",
      },
      {
        id: "dharma",
        label: "Dharma Finder",
        description: "Explore questions of purpose and direction.",
        href: "/dharma-finder",
        minutes: "15 min",
      },
      {
        id: "self-portrait",
        label: "Self Portrait",
        description: "Build a personalized reflection from assessment results.",
        href: "/self-portrait",
        minutes: "10 min",
      },
      {
        id: "grant-study",
        label: "Grant Study",
        description: "Reflect on research into what supports a good life.",
        href: "/grant-study",
        minutes: "15 min",
      },
    ],
  },
  {
    id: "capital",
    title: "Capital & Impact",
    description:
      "The public work on aligned capital, portfolio intelligence, and impact measurement.",
    icon: "briefcase",
    tone: "sky",
    stops: [
      {
        id: "intel",
        label: "Intel",
        description: "Portfolio and market intelligence.",
        href: "/intel",
        minutes: "15 min",
      },
      {
        id: "impact-dashboard",
        label: "Impact Dashboard",
        description: "Explore how impact is measured.",
        href: "/impact-dashboard",
        minutes: "10 min",
      },
      {
        id: "invest",
        label: "Invest",
        description: "Learn about aligned investment principles.",
        href: "/invest",
        minutes: "10 min",
      },
      {
        id: "charity-scorecard",
        label: "Charity Scorecard",
        description: "Compare evidence-informed charitable opportunities.",
        href: "/charity-scorecard",
        minutes: "10 min",
      },
    ],
  },
  {
    id: "body-culture",
    title: "Body, Kava & BrewSoul",
    description:
      "Explore body literacy, peptide education, Kava, and coffee as practices of attention.",
    icon: "flask",
    tone: "amber",
    stops: [
      {
        id: "peptide-library",
        label: "Peptide Library",
        description: "A structured peptide reference.",
        href: "/peptide-library",
        minutes: "Varies",
      },
      {
        id: "find-your-peptide",
        label: "Find Your Peptide",
        description: "A guided peptide exploration tool.",
        href: "/find-your-peptide",
        minutes: "10 min",
      },
      {
        id: "kava",
        label: "Kava Encyclopedia",
        description: "A research and culture resource for Kava.",
        href: "/kava",
        minutes: "Varies",
      },
      {
        id: "brewsoul",
        label: "BrewSoul",
        description: "Coffee, sourcing, and consciousness.",
        href: "/brewsoul",
        minutes: "Varies",
      },
    ],
  },
  {
    id: "ecosystem",
    title: "The Ecosystem",
    description: "People, communities, and the work of building what comes after extraction.",
    icon: "leaf",
    tone: "emerald",
    stops: [
      {
        id: "about",
        label: "About Tony",
        description: "The background and current work.",
        href: "/about",
        minutes: "10 min",
      },
      {
        id: "ecosystem",
        label: "Join the Ecosystem",
        description: "Find ways to participate.",
        href: "/ecosystem",
        minutes: "10 min",
      },
      {
        id: "community",
        label: "Community",
        description: "Meet the people building what comes next.",
        href: "/community",
        minutes: "10 min",
      },
      {
        id: "humanos",
        label: "Humanos",
        description: "A human-first technology philosophy.",
        href: "/humanos",
        minutes: "15 min",
      },
    ],
  },
];

export const SKIPPY_STOP_IDS = SKIPPY_TRACKS.flatMap((track) => track.stops.map((stop) => stop.id));

export function getSkippyStats(completedIds: ReadonlySet<string>) {
  const completed = SKIPPY_STOP_IDS.filter((id) => completedIds.has(id)).length;
  const total = SKIPPY_STOP_IDS.length;
  return {
    completed,
    remaining: total - completed,
    total,
    percentage: total ? Math.round((completed / total) * 100) : 0,
  };
}
