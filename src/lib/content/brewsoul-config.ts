// Ported from legacy client/src/data/brewsoul-config.ts — BrewSoul's own
// theme tokens and voice rules. Real content, unchanged. BrewSoul is a
// self-contained "sub-site" with its own coffee-brown/gold palette,
// deliberately not the main site's design tokens (matching legacy's own
// choice to give it a distinct visual identity from tonygreenberg.com).
export const BREWSOUL_THEME = {
  primary: "#6F4E37", // coffee brown
  accent: "#C5A23C", // gold
  warm: "#F5F0E6", // parchment
  bg: "#FAFAF7", // warm white
  text: "#2C1810", // dark espresso
  cardBg: "#FAF7F0", // cream
} as const;

export const BREWSOUL_TAGLINE = "The Intelligence of Coffee";
export const BREWSOUL_BYLINE = "Not a buying guide. A reckoning.";

export interface EcosystemLink {
  label: string;
  url: string;
  badge?: string;
}

// "SoulSmoke"/"LiquidSun" are live external sibling products (checked:
// both 200 OK); "/find-your-sake" doesn't exist in this app yet — same
// deliberate forward-reference already used elsewhere in this migration
// for /find-my, tracked as a real upcoming page rather than a mistake.
export const BREWSOUL_ECOSYSTEM: EcosystemLink[] = [
  { label: "Tony Greenberg", url: "/" },
  { label: "SoulSmoke (Mezcal)", url: "https://mezcalagave-ahru9fq8.manus.space", badge: "Live" },
  { label: "LiquidSun (Tequila)", url: "https://tequilaazul-fxqrr3js.manus.space", badge: "Live" },
  { label: "Find Your Sake", url: "/find-your-sake" },
];

export const BREWSOUL_SCORING_WEIGHTS = { qpr: 0.35, availability: 0.15, wow: 0.3, scarcity: 0.2 };

export const BREWSOUL_FLAVOR_AXES = [
  { key: "acidity", label: "Acidity", max: 10 },
  { key: "body", label: "Body", max: 10 },
  { key: "sweetness", label: "Sweetness", max: 10 },
  { key: "complexity", label: "Complexity", max: 10 },
  { key: "fruitiness", label: "Fruitiness", max: 10 },
  { key: "chocolate", label: "Chocolate/Nutty", max: 10 },
] as const;

export const BREWSOUL_TIER_LABELS = ["☕", "☕☕", "☕☕☕", "👑"];
export const BREWSOUL_TIER_RANGES = [82, 86, 90, 92];

export const BREWSOUL_SHAME_CATEGORIES = [
  "The Greenwashers",
  "The Stale Shelf Sitters",
  "The Fake Specialty",
  "The Farmer Exploiters",
  "The Mold Deniers",
  "The Marketing Frauds",
];

export const BREWSOUL_VOICE_RULES =
  "Opinionated, evidence-based, never cruel. Celebrate the craft. Call out the fraud. Make the reader smarter with every sentence.";
