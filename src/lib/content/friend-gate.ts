// The six friend-survey questions, ported verbatim from legacy
// server/routers/friendGate.ts (FRIEND_SURVEY_QUESTIONS).
export type FriendQuestion =
  | { id: string; question: string; hint: string; type: "scale"; labels: string[] }
  | { id: string; question: string; hint: string; type: "verdict"; options: { value: "support" | "wait" | "unsure"; label: string }[] }
  | { id: string; question: string; hint: string; type: "text" };

export const FRIEND_SURVEY_QUESTIONS: FriendQuestion[] = [
  {
    id: "q1",
    question: "In your honest view, is your friend in a stable, grounded place right now — emotionally, physically, and in their relationships?",
    hint: "Think about the last few months, not just today.",
    type: "scale",
    labels: ["Definitely not", "Somewhat", "Mostly yes", "Yes", "Absolutely"],
  },
  {
    id: "q2",
    question: "Have you seen your friend handle difficulty or stress well recently — without falling apart or making decisions they later regret?",
    hint: "This is about resilience, not perfection.",
    type: "scale",
    labels: ["Not really", "Sometimes", "Usually", "Yes", "Consistently"],
  },
  {
    id: "q3",
    question: "Is there anything unresolved in their life right now — a loss, a conflict, a major transition — that you think they should work through first?",
    hint: "Be honest. This is private.",
    type: "scale",
    labels: ["Yes, significant things", "A few things", "Minor things", "Not much", "Nothing I can think of"],
  },
  {
    id: "q4",
    question: "Do you believe your friend is doing this for the right reasons — genuine curiosity, healing, or growth — rather than escape, pressure, or impulse?",
    hint: "Trust your gut here.",
    type: "scale",
    labels: ["I'm not sure", "Somewhat", "Mostly yes", "Yes", "Without a doubt"],
  },
  {
    id: "q5",
    question: "Do you support your friend moving forward with this kind of inner work at this time in their life?",
    hint: "This is the core question. Your answer matters.",
    type: "verdict",
    options: [
      { value: "support", label: "Yes — I support them moving forward" },
      { value: "wait", label: "Not yet — I think they need more time" },
      { value: "unsure", label: "I'm genuinely unsure" },
    ],
  },
  {
    id: "q6",
    question: "Is there anything you want your friend to know before they proceed? (Optional — they will not know this came from you.)",
    hint: "This is your chance to say what you might not say to their face.",
    type: "text",
  },
];

export const TRUST_QUOTE = "You are not just you. You are an organism embedded in relationships. Those relationships deserve a vote.";
export const BETTER_SAFE_QUOTE = "Better safe than sorry is a start. Better safest than safe is wisdom. Better nothing than disaster is love.";
export const FRIEND_GATE_FOOTER = "© 2026 Tony Greenberg · Only Time Buys Trust · onlytimebuystrust.com";
