/**
 * Archetype data for the 3 paths: Builder, Crusader, Investor
 * Maps blog categories to archetypes and provides assessment questions.
 */

export type ArchetypeKey = "builder" | "crusader" | "investor";

export interface Archetype {
  name: string;
  tagline: string;
  description: string;
  color: string;
  icon: string;
  pathUrl: string;
  categories: string[];
}

export const ARCHETYPES: Record<ArchetypeKey, Archetype> = {
  builder: {
    name: "The Builder",
    tagline: "I Build Systems",
    description:
      "You design what replaces broken systems. The regenerative economy needs your blueprints. You see infrastructure where others see chaos, and you build bridges where others build walls.",
    color: "#7A6520",
    icon: "⚙️",
    pathUrl: "/path/builder",
    categories: ["Systems & Innovation", "Business & Capital"],
  },
  crusader: {
    name: "The Crusader",
    tagline: "I Hold the Line",
    description:
      "You call out what others tolerate. Fraud, opacity, extraction — you name it, document it, and force accountability. The system changes because you refuse to look away.",
    color: "#8B2020",
    icon: "⚔️",
    pathUrl: "/path/crusader",
    categories: ["The Crusades", "Culture & Communication"],
  },
  investor: {
    name: "The Investor",
    tagline: "I Invest in Impact",
    description:
      "You put capital where conviction lives. Not ESG theater — real asset-backed impact. You understand that the best returns come from funding what the world actually needs.",
    color: "#1A6B4A",
    icon: "🌱",
    pathUrl: "/path/investor",
    categories: ["Impact & Purpose", "Business & Capital", "Living Well"],
  },
};

export const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    question: "When you see a broken system, your first instinct is to:",
    options: [
      { text: "Design something better to replace it", archetype: "builder" as ArchetypeKey },
      { text: "Expose it publicly and demand accountability", archetype: "crusader" as ArchetypeKey },
      { text: "Fund the people who are already fixing it", archetype: "investor" as ArchetypeKey },
    ],
  },
  {
    id: 2,
    question: "The project that excites you most right now:",
    options: [
      { text: "Building infrastructure that scales regenerative impact", archetype: "builder" as ArchetypeKey },
      { text: "Investigating a company that's lying to its customers", archetype: "crusader" as ArchetypeKey },
      { text: "Evaluating an impact investment that could change an industry", archetype: "investor" as ArchetypeKey },
    ],
  },
  {
    id: 3,
    question: "Your superpower in a room full of smart people:",
    options: [
      { text: "I see the architecture nobody else sees", archetype: "builder" as ArchetypeKey },
      { text: "I ask the question nobody else will ask", archetype: "crusader" as ArchetypeKey },
      { text: "I connect the capital to the conviction", archetype: "investor" as ArchetypeKey },
    ],
  },
  {
    id: 4,
    question: "When a company wrongs you, you:",
    options: [
      { text: "Build a competing solution that makes them irrelevant", archetype: "builder" as ArchetypeKey },
      { text: "Write the exposé, file the complaint, rally the community", archetype: "crusader" as ArchetypeKey },
      { text: "Divest and redirect capital to their ethical competitor", archetype: "investor" as ArchetypeKey },
    ],
  },
  {
    id: 5,
    question: "The legacy you want to leave:",
    options: [
      { text: "Systems that outlast me — infrastructure for the next generation", archetype: "builder" as ArchetypeKey },
      { text: "A record of truth that made powerful people uncomfortable", archetype: "crusader" as ArchetypeKey },
      { text: "A portfolio of impact that proved profit and purpose aren't enemies", archetype: "investor" as ArchetypeKey },
    ],
  },
];

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
