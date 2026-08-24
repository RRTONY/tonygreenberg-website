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
