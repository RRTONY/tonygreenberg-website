// Ported from legacy client/src/pages/Articles.tsx. Real curated content —
// unchanged except 3 stale slugs corrected (see below). Plain module,
// imported only by the client-side explorer (no Server/Client boundary
// crossing concern here since nothing is re-exported from a "use client"
// file).

export const START_HERE_SLUGS = [
  "when-healing-becomes-extraction",
  "energy-is-money-money-is-memory",
  "your-blood-lies-without-your-dna",
  "you-are-the-moat",
  "the-password-is-killing-you",
  "five-cups",
  "the-1000-hour-hold",
];

export const CONTRARIAN_SLUGS = [
  "five-cups",
  "marc-andreessen-rebuttal-2020",
  "when-healing-becomes-extraction",
  "the-restaurant-with-no-menu-prices-ai-ethics-manifesto",
  "california-toll-roads-legalized-scam",
  // Corrected from "...capitalism-unless" — that slug doesn't match any
  // real post; the real post is titled without the trailing "-unless".
  "psychedelics-could-become-extractive-capitalism",
  "truth-bias-mutually-exclusive",
  "the-peptide-truth-65m-fraud-industry-vs-life-changing-medicine",
];

export const CHANGED_MIND_SLUGS = [
  "marc-andreessen-rebuttal-2020",
  "eco-vegan-realities-seriesethical-economic",
  "the-tug-of-war-ethical-vs-economic-decisions",
  // Corrected from "...co-opt-an-existing-technology" — real slug is
  // shorter, ends at "co-opt".
  "enterprise-blockchain-can-big-business-co-opt",
];

export const SHORT_READ_SLUGS = [
  "truth-bias-mutually-exclusive",
  "marc-andreessen-rebuttal-2020",
  "the-decay-of-modern-day-communication",
  "eco-vegan-realities-seriesethical-economic",
  "the-tug-of-war-ethical-vs-economic-decisions",
  "building-services-market-transhuman-era",
  // Corrected from "...culinary-art" — real slug ends "...culinary-masterpieces".
  "an-ode-to-kusaki-where-plants-become-culinary-masterpieces",
];

export const DEEP_DIVE_SLUGS = [
  "the-restaurant-with-no-menu-prices-ai-ethics-manifesto",
  "is-that-a-lot-clarisse-abelarde",
  "you-are-the-moat",
  "your-blood-lies-without-your-dna",
  "love-as-dharma-a-science-based-playbook-for-magnetic-partnership",
  "the-password-is-killing-you",
  "when-healing-becomes-extraction",
  "five-cups",
];

export const DISCOVERY_MODES = [
  { id: "All", label: "All Essays" },
  { id: "Start Here", label: "Start Here", desc: "7 foundational" },
  { id: "Short Reads", label: "Short Reads", desc: "Under 5 min" },
  { id: "Deep Dives", label: "Deep Dives", desc: "Long-form" },
  { id: "Contrarian", label: "Contrarian", desc: "Uncomfortable truths" },
  { id: "Changed His Mind", label: "Changed His Mind", desc: "Intellectual honesty" },
  { id: "Surprise Me", label: "Surprise Me", desc: "Random" },
] as const;

export const CATEGORY_ORDER = [
  "Psychedelic Medicine",
  "Systems & Innovation",
  "Business & Capital",
  "Conscious Capital",
  "Impact & Purpose",
  "Culture & Communication",
  "Living Well",
  "The Crusades",
];

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Psychedelic Medicine": "Consciousness, therapeutic frontiers, and the science of healing.",
  "Systems & Innovation": "Technology, AI, infrastructure, and the architecture of change.",
  "Business & Capital": "Enterprise strategy, procurement, and the economics of trust.",
  "Conscious Capital": "Impact investing, regenerative business, and capitalism reimagined.",
  "Impact & Purpose": "Social change, mission-driven work, and the long game.",
  "Culture & Communication": "Media, language, society, and the stories we tell.",
  "Living Well": "Health, longevity, performance, and the examined life.",
  "The Crusades": "Accountability, advocacy, and the things worth fighting for.",
};
