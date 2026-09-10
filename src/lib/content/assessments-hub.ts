// Ported from legacy client/src/pages/Assessments.tsx's `ASSESSMENTS`
// array — "Three Maps. One Journey," the deep-instrument hub distinct from
// `/find-my` (that page is the wide directory of all 26 "Find My ___"
// tools; this one is three specific, much longer research-grounded
// instruments — Dharma Finder, Consciousness Scale, Grant Study — that
// happen to also be listed as one category inside `/find-my`'s directory).
// Real title/subtitle/description/time/icon/accent content for all three
// ported unchanged and verbatim.
//
// All three real routes (`/dharma-finder`, `/consciousness-scale`,
// `/grant-study` — no `/assessments/` prefix, see each page's own port
// note) now exist elsewhere in this migration; `slug` below links each
// card directly.
export interface AssessmentPreview {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  time: string;
  icon: string;
  accent: string;
}

export const ASSESSMENTS: AssessmentPreview[] = [
  {
    slug: "dharma-finder",
    title: "The Dharma Finder",
    subtitle: "Inspired by Daniel Schmachtenberger",
    description:
      "Twenty-five questions distilled from Schmachtenberger's Dharma Inquiry — a framework for discovering your unique purpose, the intersection of your gifts and the world's needs. Not what you should do. What you can't not do.",
    time: "15–20 min",
    icon: "◎",
    accent: "#8B6914",
  },
  {
    slug: "consciousness-scale",
    title: "The Consciousness Scale",
    subtitle: "Based on David R. Hawkins' Map of Consciousness",
    description:
      "Where do you currently sit on the spectrum from Shame to Enlightenment? Twenty-five questions that map your dominant energy field across Hawkins' calibrated levels. Not a judgment — a compass.",
    time: "15–20 min",
    icon: "△",
    accent: "#6B4C8A",
  },
  {
    slug: "grant-study",
    title: "The Grant Study Assessment",
    subtitle: "Based on 85 Years of Harvard Research",
    description:
      "The longest study of human happiness ever conducted. Five factors predict lifelong wellbeing: relationships, adaptive coping, generativity, career satisfaction, and physical vitality. This assessment maps where you stand on each.",
    time: "15–20 min",
    icon: "♡",
    accent: "#2E8B57",
  },
];
