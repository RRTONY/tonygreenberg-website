import { Cog, Swords, Sprout, type LucideIcon } from "lucide-react";

// Ported from legacy client/src/data/archetypes.ts. Maps blog categories to
// 3 higher-level reader "paths" — a different curation axis than
// theme-map.ts's Core Themes. Legacy used an emoji per archetype; this app
// uses lucide-react.
export type ArchetypeKey = "builder" | "crusader" | "investor";

export type Archetype = {
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  categories: string[];
};

export const ARCHETYPES: Record<ArchetypeKey, Archetype> = {
  builder: {
    name: "The Builder",
    tagline: "I Build Systems",
    description:
      "You design what replaces broken systems. The regenerative economy needs your blueprints. You see infrastructure where others see chaos, and you build bridges where others build walls.",
    icon: Cog,
    categories: ["Systems & Innovation", "Business & Capital"],
  },
  crusader: {
    name: "The Crusader",
    tagline: "I Hold the Line",
    description:
      "You call out what others tolerate. Fraud, opacity, extraction — you name it, document it, and force accountability. The system changes because you refuse to look away.",
    icon: Swords,
    categories: ["The Crusades", "Culture & Communication"],
  },
  investor: {
    name: "The Investor",
    tagline: "I Invest in Impact",
    description:
      "You put capital where conviction lives. Not ESG theater — real asset-backed impact. You understand that the best returns come from funding what the world actually needs.",
    icon: Sprout,
    categories: ["Impact & Purpose", "Business & Capital", "Living Well"],
  },
};

export const AUTHORITY_ITEMS = [
  "Harvard H+",
  "Forbes",
  "Wired",
  "XPRIZE",
  "B Corp",
  "25 Years",
  "35+ Ventures",
  "$10B+ Advised",
];

// Real 5-question diagnostic used by `/assessment` (legacy
// `client/src/pages/Assessment.tsx`) to sort a visitor into one of the 3
// archetypes above — one point per answer, highest tally wins. Kept in
// this shared module (not duplicated into the quiz component) since it's
// the same legacy `data/archetypes.ts` source as `ARCHETYPES`/
// `AUTHORITY_ITEMS` above, not a separate concern.
export interface AssessmentQuestion {
  id: number;
  question: string;
  options: { text: string; archetype: ArchetypeKey }[];
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    question: "When you see a broken system, your first instinct is to:",
    options: [
      { text: "Design something better to replace it", archetype: "builder" },
      { text: "Expose it publicly and demand accountability", archetype: "crusader" },
      { text: "Fund the people who are already fixing it", archetype: "investor" },
    ],
  },
  {
    id: 2,
    question: "The project that excites you most right now:",
    options: [
      { text: "Building infrastructure that scales regenerative impact", archetype: "builder" },
      { text: "Investigating a company that's lying to its customers", archetype: "crusader" },
      {
        text: "Evaluating an impact investment that could change an industry",
        archetype: "investor",
      },
    ],
  },
  {
    id: 3,
    question: "Your superpower in a room full of smart people:",
    options: [
      { text: "I see the architecture nobody else sees", archetype: "builder" },
      { text: "I ask the question nobody else will ask", archetype: "crusader" },
      { text: "I connect the capital to the conviction", archetype: "investor" },
    ],
  },
  {
    id: 4,
    question: "When a company wrongs you, you:",
    options: [
      { text: "Build a competing solution that makes them irrelevant", archetype: "builder" },
      { text: "Write the exposé, file the complaint, rally the community", archetype: "crusader" },
      { text: "Divest and redirect capital to their ethical competitor", archetype: "investor" },
    ],
  },
  {
    id: 5,
    question: "The legacy you want to leave:",
    options: [
      {
        text: "Systems that outlast me — infrastructure for the next generation",
        archetype: "builder",
      },
      { text: "A record of truth that made powerful people uncomfortable", archetype: "crusader" },
      {
        text: "A portfolio of impact that proved profit and purpose aren't enemies",
        archetype: "investor",
      },
    ],
  },
];
