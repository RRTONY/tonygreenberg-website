// The five questions and five response modes for /clock-keeper-part-2.
// Ported verbatim from legacy client/src/pages/ClockKeeperPartII.tsx (live
// shows the same copy, checked 2026-10-06).
export interface ClockKeeperQuestion {
  key: "q1" | "q2" | "q3" | "q4" | "q5";
  num: number;
  title: string;
  prompt: string;
  placeholder: string;
}

export const CLOCK_KEEPER_QUESTIONS: ClockKeeperQuestion[] = [
  {
    key: "q1",
    num: 1,
    title: "The Model",
    prompt: "You developed a model to explain how people behave and what they say. You said you're satisfied with it. What does it look like? Not the full architecture — just enough that someone encountering it could recognize whether they're inside the same pattern.",
    placeholder: "The model, in whatever form it takes...",
  },
  {
    key: "q2",
    num: 2,
    title: "The Practice",
    prompt: "\"Seek first to understand before being understood.\" What did fifty years of that practice teach you that couldn't have been learned any other way? What did it cost? What did it reveal?",
    placeholder: "What understanding taught you...",
  },
  {
    key: "q3",
    num: 3,
    title: "The Spectrum",
    prompt: "Wilber's 8 memes. Where do you sit on that spectrum — and what does the world look like from there? What do the people at the other memes look like from your vantage point?",
    placeholder: "The view from where you stand...",
  },
  {
    key: "q4",
    num: 4,
    title: "The Form",
    prompt: "You said your work was to be understood, and you were of limited success. If successful transmission were possible — not probable, just possible — what form would it take? A book? A conversation? A structure? Silence with annotations?",
    placeholder: "The shape transmission could take...",
  },
  {
    key: "q5",
    num: 5,
    title: "The Offering",
    prompt: "If this were a gift to God — not to Tony, not to humanity, not to posterity — just an offering to the pattern itself. What would you leave?",
    placeholder: "The gift to the pattern...",
  },
];

export const CLOCK_KEEPER_MODES = [
  { id: "direct", label: "Direct Response", desc: "Answer 1–5 questions with whatever precision feels right" },
  { id: "meta", label: "The Pattern Itself", desc: "Skip all 5 — just describe the model directly" },
  { id: "reframe", label: "Reframe Entirely", desc: "These are the wrong questions. Provide the right ones." },
  { id: "jazz", label: "Jazz Improvisation", desc: "Pick a theme and let it find its own structure" },
  { id: "minimum", label: "Minimum Viable Trace", desc: "One thing. The most important thing. Nothing else." },
] as const;

export type ClockKeeperMode = (typeof CLOCK_KEEPER_MODES)[number]["id"];
