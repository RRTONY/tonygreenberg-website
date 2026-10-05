// Questions and copy for the BrewSoul taste quiz (/brewsoul/quiz). Ported
// from legacy client/src/pages/brewsoul/BrewSoulQuiz.tsx: 7 questions scored
// against each coffee's real `flavorProfile`. Real content, unchanged.

import { Cherry, Citrus, Coffee, Droplet, Droplets, FlaskConical, Wallet, type LucideIcon } from "lucide-react";

export type QuizQuestion = {
  q: string;
  dim: string;
  icon: LucideIcon;
  opts: { text: string; score: number }[];
};

export const QUESTIONS: QuizQuestion[] = [
  {
    q: "How do you feel about bright, citrusy acidity?",
    dim: "acidity",
    icon: Citrus,
    opts: [
      { text: "Love it — the brighter the better", score: 9 },
      { text: "I enjoy some brightness", score: 6 },
      { text: "Prefer smooth and mellow", score: 3 },
      { text: "Hate it — give me zero acidity", score: 1 },
    ],
  },
  {
    q: "Body preference — how heavy in the mouth?",
    dim: "body",
    icon: Coffee,
    opts: [
      { text: "Tea-like, delicate, transparent", score: 3 },
      { text: "Medium, balanced, silky", score: 5 },
      { text: "Full, creamy, coating", score: 8 },
      { text: "Thick, syrupy, chewy", score: 10 },
    ],
  },
  {
    q: "Sweetness — what kind?",
    dim: "sweetness",
    icon: Droplet,
    opts: [
      { text: "Floral honey, raw sugar", score: 8 },
      { text: "Stone fruit, caramel", score: 6 },
      { text: "Dark chocolate, molasses", score: 4 },
      { text: "I don't care about sweetness", score: 2 },
    ],
  },
  {
    q: "Complexity — how adventurous?",
    dim: "complexity",
    icon: FlaskConical,
    opts: [
      { text: "Surprise me — the weirder the better", score: 10 },
      { text: "I like interesting but approachable", score: 7 },
      { text: "Clean and predictable is fine", score: 4 },
      { text: "Just good coffee, nothing fancy", score: 2 },
    ],
  },
  {
    q: "Fruit forward or chocolate forward?",
    dim: "fruitiness",
    icon: Cherry,
    opts: [
      { text: "Berries, citrus, tropical fruit all day", score: 9 },
      { text: "Some fruit is nice, balanced", score: 6 },
      { text: "Chocolate, nuts, caramel please", score: 3 },
      { text: "No preference", score: 5 },
    ],
  },
  {
    q: "How do you usually brew?",
    dim: "brew",
    icon: Droplets,
    opts: [
      { text: "Pour-over (V60, Chemex, Kalita)", score: 0 },
      { text: "Espresso", score: 0 },
      { text: "French press / AeroPress", score: 0 },
      { text: "Cold brew", score: 0 },
      { text: "Drip machine", score: 0 },
    ],
  },
  {
    q: "Budget per bag?",
    dim: "budget",
    icon: Wallet,
    opts: [
      { text: "Under $15", score: 15 },
      { text: "$15–25", score: 25 },
      { text: "$25–45", score: 45 },
      { text: "$45+ — quality over price", score: 200 },
    ],
  },
];

export const quizData = {
  intro: {
    eyebrow: "Taste Profile Builder",
    titleLine1: "Seven questions.",
    titleLine2: "Your perfect cup, decoded.",
    body: (count: number) =>
      `We'll map your palate across acidity, body, sweetness, complexity, and fruit preference — then match you to coffees from our catalog of ${count} scored beans.`,
  },
  back: "Back",
  skip: "Skip — browse all coffees",
  results: {
    eyebrow: "Your Palate Matches",
    title: "We Found Your Coffees",
    body: "Ranked by how well they match your palate preferences across acidity, body, sweetness, complexity, and fruit.",
    retake: "Retake Quiz",
    browse: "Browse All Coffees",
  },
};
