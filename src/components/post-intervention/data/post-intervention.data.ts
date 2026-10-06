// Options and copy for /post-intervention, ported verbatim from legacy
// client/src/pages/PostIntervention.tsx (live shows the same copy, checked
// 2026-10-06).
export type DayChoice = 1 | 3 | 7;
export type InterventionType = "psychedelic" | "meditation" | "breathwork" | "ceremony" | "other";
export type RecommendChoice = "yes" | "no" | "unsure";

export const DAY_OPTIONS: { value: DayChoice; label: string; subtitle: string }[] = [
  { value: 1, label: "Day 1", subtitle: "Still in the glow. Raw and immediate." },
  { value: 3, label: "Day 3", subtitle: "The dust is settling. What's emerging?" },
  { value: 7, label: "Day 7", subtitle: "One week out. What actually changed?" },
];

export const INTERVENTION_TYPES: { value: InterventionType; label: string }[] = [
  { value: "psychedelic", label: "Psychedelic Medicine" },
  { value: "ceremony", label: "Ceremony / Ritual" },
  { value: "meditation", label: "Meditation / Retreat" },
  { value: "breathwork", label: "Breathwork" },
  { value: "other", label: "Other" },
];

export const SCALE_LABELS: Record<number, string> = {
  1: "Very low",
  2: "Low",
  3: "Below average",
  4: "Slightly below",
  5: "Neutral",
  6: "Slightly above",
  7: "Good",
  8: "Strong",
  9: "Very strong",
  10: "Exceptional",
};

export const SCORES = [
  { key: "integrationScore", label: "How well are you integrating the experience? (1 = struggling, 10 = deeply integrated)" },
  { key: "safetyScore", label: "How safe did you feel throughout the experience? (1 = unsafe, 10 = completely held)" },
  { key: "trustScore", label: "How much did you trust your facilitator? (1 = not at all, 10 = completely)" },
] as const;

export const OPEN_QUESTIONS = [
  { key: "wentWell", label: "What went well?", placeholder: "What felt right, held, or transformative...", rows: 4 },
  { key: "couldImprove", label: "What could have been better?", placeholder: "What felt off, rushed, or unresolved...", rows: 4 },
  { key: "messageToFacilitator", label: "A message to your facilitator (anonymous)", placeholder: "Something you want them to know but couldn't say in the room...", rows: 5 },
] as const;

export const RECOMMEND_LABELS: Record<RecommendChoice, string> = { yes: "Yes", no: "No", unsure: "Not sure" };

export const postInterventionData = {
  footer: "Anonymous · No account required · Results go to tony@tonygreenberg.com",
  copyright: "© 2026 Tony Greenberg · Only Time Buys Trust · onlytimebuystrust.com",
};
