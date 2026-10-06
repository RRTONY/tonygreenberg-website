import type { MirrorDimensionId } from "@/lib/content/mirror-data";

// All UI copy for The Mirror flow (CONTRIBUTING rule 19). The questions,
// dimensions and article mappings themselves stay in
// src/lib/content/mirror-data.ts (shared with the essay pages).
//
// Intro copy matched to live tonygreenberg.com/the-mirror (2026-10-07).

export const SHARE_URL = "https://tonygreenberg.com/the-mirror";
export const ACCENT = "#836311";

// Live's ecosystem pills. Live links three of them to *.manus.space apps
// (Intimacy Assessment, Sacred Waters, SoulSmoke Mezcal); zero-Manus rule,
// so those render as plain labels with no link (Sacred Waters and SoulSmoke
// were 404 on 2026-10-07 anyway). Flow Circuit keeps live's off-site URL;
// Human OS is our own /humanos.
export type EcosystemPill = { label: string; href?: string; external?: boolean };

export const ECOSYSTEM_PILLS: EcosystemPill[] = [
  { label: "Intimacy Assessment" },
  { label: "Flow Circuit", href: "https://flow.tonygreenberg.com", external: true },
  { label: "Sacred Waters" },
  { label: "SoulSmoke Mezcal" },
  { label: "Human OS", href: "/humanos" },
];

export const SATELLITE_SITES: { name: string; url: string; dimension: MirrorDimensionId; desc: string }[] = [
  { name: "Find Your Partner", url: "https://intimacyassess-tcir3hon.manus.space", dimension: "relationships", desc: "15-question deep dive into your intimacy patterns" },
  { name: "Find Your Team", url: "/flow-circuit", dimension: "consciousness", desc: "Measure your flow state across work, play, and presence" },
  { name: "Find Your Water", url: "https://aqwaterqpr-wvzsc3ph.manus.space", dimension: "body", desc: "The biochemistry of water and its role in your biology" },
  { name: "Find Your Mezcal", url: "https://mezcalagave-ahru9fq8.manus.space", dimension: "consciousness", desc: "Sacred ceremony meets artisanal craft" },
  { name: "Human OS", url: "/humanos", dimension: "purpose", desc: "The operating system for human potential" },
  { name: "Find Your Chemistry", url: "https://regenhealth-4nns6jnd.manus.space", dimension: "body", desc: "Biochemistry optimization for your best self" },
];

export const JOURNEY_CONTINUES = [
  { name: "Find Your Purpose", hook: "The Dharma Finder — what you can't stop doing.", url: "/dharma-finder", badge: "25 Qs" },
  { name: "Find Your Therapy", hook: "Matched to your wiring, not a waitlist.", url: "/find-your-therapy", badge: "25 Qs" },
  { name: "Find Your Spirit", hook: "Map your beliefs across 10 dimensions.", url: "/find-your-spirit", badge: "35 Qs" },
  { name: "Find Your Level", hook: "Where you sit on the consciousness scale.", url: "/consciousness-scale", badge: "25 Qs" },
  { name: "Find Your Score", hook: "85 years of Harvard data, one assessment.", url: "/grant-study", badge: "25 Qs" },
  { name: "Find Your Me", hook: "The gateway to the whole ecosystem.", url: "/find-your-me", badge: "5 Qs" },
];

export const theMirrorData = {
  intro: {
    eyebrow: "The Mirror",
    titleLine1: "How Far Are You",
    titleLine2: "From Yourself?",
    subhead:
      "Eighteen questions. Six dimensions. One honest map of where you are — and how fast you can get to where you belong.",
    body: "This isn't a personality quiz. It's a measurement. Of your distance from your truth, your friction, your flow. Every answer routes you to the articles, the sites, and the people who can close the gap.",
    cta: "Begin The Mirror",
    meta: "~ 4 minutes · no wrong answers · your results are private",
    measureEyebrow: "Six Dimensions of Flow",
    measureTitle: "What We Measure",
    flowLabel: "Flow",
    frictionLabel: "Friction",
    ecosystemEyebrow: "The Ecosystem",
    ecosystemTitle: "Your Results Connect To Everything",
    ecosystemBody:
      "Your assessment maps to 90 articles, 11 satellite sites, and a community of people on the same journey. Each layer pulls you deeper.",
    ecosystemCta: "Take The Assessment",
  },
  questions: {
    exit: "Exit",
    previous: "Previous",
    questionOf: "Question",
  },
  results: {
    eyebrow: "Your Mirror",
    title: "Your Distance From Flow",
    mapEyebrow: "Your Map",
    mapTitle: "Six Dimensions",
    insightsEyebrow: "Dimension Insights",
    insightsTitle: "Where You Are",
    readingEyebrow: "Your Prescribed Reading",
    readingTitle: "Articles That Mirror Your Growth Edge",
    readingBody:
      "Based on your assessment, these articles will challenge the dimensions where you have the most room to grow. Each one is a mirror — read it and notice what it reflects back.",
    readingReflectionPrefix: "This article is a mirror for",
    deeperEyebrow: "Go Deeper",
    deeperTitle: "Your Next Stations",
    deeperBody:
      "Based on your dimensions, these satellite experiences will take you deeper into the areas where you're ready to grow.",
    shareEyebrow: "The Invitation",
    shareTitle: "Share The Mirror",
    shareBody:
      "This assessment was designed to be shared. Send it to at least 10 people — your partner, your team, your family, your tribe. When everyone maps their dimensions, you can see where you complement each other, where you collide, and where you can grow together.",
    shareButton: "Share With Your People",
    shareLinkLabel: "Share this link:",
    shareCopy: "Copy",
    shareText: (score: number) =>
      `I just took The Mirror — a life assessment that measures your distance from flow. My score: ${score}/9. Take yours:`,
    shareEmailSubject: "Take The Mirror — Life Assessment",
    shareFooter1: "Find your tribe. Find your partner. Find your joy.",
    shareFooter2: "It starts with knowing where you are.",
    continuesEyebrow: "The Journey Continues",
    continuesBody: "You've held up the mirror. Now explore the dimensions that shape what you saw.",
    communityTitle: "Join The Community",
    communityBody: "Find your tribe, your partner, your collaborators. Upload your contacts and start connecting.",
    retakeTitle: "Retake The Mirror",
    retakeBody: "Come back in a month. See how far you've moved. The measurement is the medicine.",
  },
};

export function getFlowLabel(score: number): string {
  if (score >= 8) return "Deep Flow";
  if (score >= 6) return "Approaching Flow";
  if (score >= 4) return "In Transition";
  if (score >= 2) return "Friction Zone";
  return "Starting Point";
}

export function scoreTextClass(score: number): string {
  if (score >= 8) return "text-emerald-700";
  if (score >= 6) return "text-emerald-600";
  if (score >= 4) return "text-amber-700";
  return "text-red-800";
}

export function scoreBarClass(score: number): string {
  if (score >= 7) return "bg-emerald-600";
  if (score >= 5) return "bg-amber-600";
  return "bg-red-600";
}
