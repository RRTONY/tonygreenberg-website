// Data for /dharma-finder. Ported from legacy client/src/pages/DharmaFinder.tsx — a real
// 25-question open-reflection inquiry distilled from Daniel
// Schmachtenberger's Dharma Inquiry, grouped into 4 real sections
// (Capacities/Values/Propensities/The Shadow Inquiry) each with a real
// framing quote, plus 3 real interstitial quotes shown between sections.
// Unlike the other "Find Your X" assessments in this ecosystem, this one
// has no multiple-choice dimensions to score — every question is a free-
// text reflection prompt, and legacy's own `generateDharmaProfile`
// derives "archetypal roles" and "core values" via keyword-matching over
// the free text. All 25 questions, all 4 section quotes, all 3
// interstitial quotes, and the keyword-matching profile logic (including
// its exact keyword lists and the "Seeker"/"deep values" fallback
// strings) are ported unchanged and verbatim. Because there's no
// dimension set, `AssessmentIntro`'s "Dimensions" stat is filled with the
// section count (4) as the closest honest structural analog — same kind
// of best-fit-under-a-fixed-label judgment call as AssessmentIntro's own
// accentColor exception; no `AssessmentRadarChart` is used since there
// are no real per-dimension scores to plot.
//
// Real bug found and fixed: legacy's result-screen JSX had the
// `<AssessmentResultActions>` component and its trailing "Retake
// Assessment" text both rendered *inside* the "Retake Assessment"
// `<button>` element (a comment, a component, and a text node sitting
// between `<button onClick=...>` and its label, `</button>` closing much
// later) — invalid HTML (a button-containing-component that itself
// renders buttons, i.e. a button inside a button), the same bug class
// already caught and fixed on `/find-your-religion` and
// `/find-your-spirit`. Fixed here the same way: `AssessmentResultActions`
// renders as a sibling before the Retake button, not nested inside it.
//
// Real dead-link bug found and fixed: legacy's "Journey Continues" grid
// linked to `/assessments/consciousness-scale` and `/assessments/grant-study`
// — neither exists in this migration (`grant-study` isn't built yet at
// all) and the real route for the former is `/consciousness-scale`
// (ported alongside this page). Only links to routes verified live in
// this app are kept; `/assessments/grant-study` is dropped rather than
// shipped as a 404, same "coming" honesty already applied to this
// experience's own directory listing in `lib/content/find-your-me.ts`.
//
// `EmailGate` is new here — legacy showed results immediately with no
// capture step (it never had one; it just posted to the now-removed
// `trpc.assessments.submit`). Added for ecosystem consistency with every
// other "Find Your X" page built in this migration, per this app's
// established EmailGate + AssessmentResultActions pattern.
export type Quote = { text: string; author: string };
export type Question = { id: number; text: string; category: string };
export type Section = { title: string; subtitle: string; quote: Quote; questions: Question[] };

export const SECTIONS: Section[] = [
  {
    title: "Capacities",
    subtitle: "Removing limitations to see what emerges",
    quote: {
      text: "Dharma roughly means: the path of right action; the path of greatest integrity; the path of choices that don't create suffering and optimally help heal it.",
      author: "Daniel Schmachtenberger",
    },
    questions: [
      { id: 1, text: "If your financial needs were already met for the rest of your life, what would you spend your days doing?", category: "capacities" },
      { id: 2, text: "If you had the resources of the world's wealthiest people, what cause or creation would you pour them into?", category: "capacities" },
      { id: 3, text: "If you could go back to school with no constraints, what would you study — and why?", category: "capacities" },
      { id: 4, text: "If you could instantly download any skill, which three would you choose?", category: "capacities" },
      { id: 5, text: "If fear and self-doubt vanished overnight, what would you do differently tomorrow morning?", category: "capacities" },
      { id: 6, text: "If your main character deficits were resolved — the patterns you know hold you back — what would become possible?", category: "capacities" },
      { id: 7, text: "If you had the perfect team supporting you, what would you build?", category: "capacities" },
      { id: 8, text: "If your life started over with a clean slate — no previous commitments, no baggage — what path would you walk?", category: "capacities" },
    ],
  },
  {
    title: "Values",
    subtitle: "What you care about, love, find meaningful",
    quote: {
      text: "The meaning of life is to find your gift. The purpose of life is to give it away.",
      author: "Pablo Picasso",
    },
    questions: [
      { id: 9, text: "Who are you most inspired by? What about them calls to something deep in you?", category: "values" },
      { id: 10, text: "What issues in the world upset you the most — the ones that make you want to act, not just scroll past?", category: "values" },
      { id: 11, text: "What do you see as most deeply wrong with or off in the world right now?", category: "values" },
      { id: 12, text: "What do you find the most beauty in? What moves you to tears or silence?", category: "values" },
      { id: 13, text: "Looking back from the end of your life, who would you be most proud to have been?", category: "values" },
      { id: 14, text: "What would you work on if you could succeed but no one would ever know you did it?", category: "values" },
      { id: 15, text: "What would you sacrifice personal benefit for? What matters more than comfort?", category: "values" },
      { id: 16, text: "What is sacred to you? Not what you've been told is sacred — what you actually hold as inviolable?", category: "values" },
      { id: 17, text: "If all your personal desires were already met, what would you then care about?", category: "values" },
    ],
  },
  {
    title: "Propensities",
    subtitle: "Your native gifts and intrinsic motivations",
    quote: {
      text: "Don't ask what the world needs. Ask what makes you come alive, and go do it. Because what the world needs is people who have come alive.",
      author: "Howard Thurman",
    },
    questions: [
      { id: 18, text: "What are you naturally good at — the things that seem to come easy while others struggle?", category: "propensities" },
      { id: 19, text: "What types of activities leave you feeling replenished rather than drained?", category: "propensities" },
      { id: 20, text: "What are you willing to do even when it taxes you — the hard work that doesn't feel like punishment?", category: "propensities" },
      { id: 21, text: "What do you enjoy doing for its own sake, independent of results or recognition?", category: "propensities" },
      { id: 22, text: "What is your attention repeatedly called to? What can you not stop noticing?", category: "propensities" },
      { id: 23, text: "Where have you felt the most pride or satisfaction related to something you actually did?", category: "propensities" },
      { id: 24, text: "When have you felt most fully alive — not just happy, but alive?", category: "propensities" },
    ],
  },
  {
    title: "The Shadow Inquiry",
    subtitle: "What is not dharma — the honest reckoning",
    quote: {
      text: "Until you make the unconscious conscious, it will direct your life and you will call it fate.",
      author: "Carl Jung",
    },
    questions: [
      { id: 25, text: "Where are you deceiving yourself? Where are you not living in alignment with your own values — and what would change if you stopped?", category: "shadow" },
    ],
  },
];

export const ALL_QUESTIONS = SECTIONS.flatMap((s) => s.questions);
export const TOTAL = ALL_QUESTIONS.length;

export const INTERSTITIAL_QUOTES: Quote[] = [
  { text: "The privilege of a lifetime is to become who you truly are.", author: "Carl Jung" },
  { text: "We are not human beings having a spiritual experience. We are spiritual beings having a human experience.", author: "Pierre Teilhard de Chardin" },
  { text: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.", author: "Rumi" },
];

export interface DharmaProfile {
  archetypes: string[];
  coreValues: string[];
  completionDepth: number;
  totalAnswered: number;
}

export function generateDharmaProfile(answers: Record<number, string>): DharmaProfile {
  const filled = Object.values(answers).filter((a) => a.trim().length > 0);
  const themes: string[] = [];
  const patterns: string[] = [];

  const capacityAnswers = [1, 2, 3, 4, 5, 6, 7, 8].map((id) => answers[id] || "").join(" ").toLowerCase();
  if (capacityAnswers.includes("creat") || capacityAnswers.includes("build") || capacityAnswers.includes("design") || capacityAnswers.includes("art")) themes.push("Creator / Builder");
  if (capacityAnswers.includes("teach") || capacityAnswers.includes("mentor") || capacityAnswers.includes("guide") || capacityAnswers.includes("help")) themes.push("Guide / Teacher");
  if (capacityAnswers.includes("heal") || capacityAnswers.includes("therap") || capacityAnswers.includes("care") || capacityAnswers.includes("support")) themes.push("Healer / Caretaker");
  if (capacityAnswers.includes("lead") || capacityAnswers.includes("organiz") || capacityAnswers.includes("manag") || capacityAnswers.includes("direct")) themes.push("Leader / Organizer");
  if (capacityAnswers.includes("research") || capacityAnswers.includes("discover") || capacityAnswers.includes("learn") || capacityAnswers.includes("study")) themes.push("Explorer / Researcher");
  if (capacityAnswers.includes("connect") || capacityAnswers.includes("communit") || capacityAnswers.includes("people") || capacityAnswers.includes("together")) themes.push("Connector / Community Builder");

  const valueAnswers = [9, 10, 11, 12, 13, 14, 15, 16, 17].map((id) => answers[id] || "").join(" ").toLowerCase();
  if (valueAnswers.includes("justice") || valueAnswers.includes("equal") || valueAnswers.includes("fair")) patterns.push("Justice & Equity");
  if (valueAnswers.includes("nature") || valueAnswers.includes("environment") || valueAnswers.includes("earth") || valueAnswers.includes("planet")) patterns.push("Ecological Stewardship");
  if (valueAnswers.includes("truth") || valueAnswers.includes("honest") || valueAnswers.includes("authentic")) patterns.push("Truth & Authenticity");
  if (valueAnswers.includes("love") || valueAnswers.includes("compassion") || valueAnswers.includes("kind")) patterns.push("Love & Compassion");
  if (valueAnswers.includes("freedom") || valueAnswers.includes("libert") || valueAnswers.includes("autonomy")) patterns.push("Freedom & Sovereignty");
  if (valueAnswers.includes("beauty") || valueAnswers.includes("art") || valueAnswers.includes("music") || valueAnswers.includes("creat")) patterns.push("Beauty & Creative Expression");
  if (valueAnswers.includes("conscious") || valueAnswers.includes("spirit") || valueAnswers.includes("sacred") || valueAnswers.includes("soul")) patterns.push("Consciousness & Spiritual Growth");

  if (themes.length === 0) themes.push("Seeker — your path is still crystallizing");
  if (patterns.length === 0) patterns.push("Your values run deep — they may resist easy categorization");

  return {
    archetypes: themes.slice(0, 3),
    coreValues: patterns.slice(0, 4),
    completionDepth: Math.round((filled.length / TOTAL) * 100),
    totalAnswered: filled.length,
  };
}

export const ACCENT = "#836311";

// Index of the section a question (0-based) belongs to, and that section's
// first question index.
export function sectionOf(questionIndex: number): { section: number; start: number } {
  let start = 0;
  for (let i = 0; i < SECTIONS.length; i++) {
    if (questionIndex < start + SECTIONS[i].questions.length) return { section: i, start };
    start += SECTIONS[i].questions.length;
  }
  return { section: SECTIONS.length - 1, start: start - SECTIONS[SECTIONS.length - 1].questions.length };
}

// UI copy. The question screen follows live (2026-10-06): no intro screen,
// it opens on Part 1's header and question 1.
export const dharmaData = {
  title: "Dharma Finder",
  partOf: (n: number, total: number, title: string) => `Part ${n} of ${total} · ${title}`,
  questionOf: (n: number, total: number) => `Question ${n} of ${total}`,
  placeholder: "Take your time. There are no wrong answers — only honest ones...",
  previous: "Previous",
  next: "Next",
  finish: "See My Dharma Profile",
  pace: "You can skip questions and come back — or leave them blank. The inquiry honors your pace.",
  creditBefore: "Based on",
  creditLink: "Daniel Schmachtenberger's Dharma Inquiry",
  creditHref: "https://civilizationemerging.com/dharma-inquiry-original-version/",
  creditAfter: "· Curated by Tony Greenberg",
  fullVersion: "Full 3-hour version (200+ questions) available at civilizationemerging.com",
};
