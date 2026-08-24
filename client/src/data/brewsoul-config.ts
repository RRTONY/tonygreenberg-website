import type { SiteConfig } from "@/lib/intelligence-engine/types";

export const BREWSOUL_CONFIG: SiteConfig = {
  id: "brewsoul",
  name: "BrewSoul",
  tagline: "The Intelligence of Coffee",
  byline: "Not a buying guide. A reckoning.",
  baseRoute: "/brewsoul",
  mainSiteUrl: "/",
  ecosystemLinks: [
    { label: "SoulSmoke (Mezcal)", url: "https://mezcalagave-ahru9fq8.manus.space", badge: "Live" },
    { label: "LiquidSun (Tequila)", url: "https://tequilaazul-fxqrr3js.manus.space", badge: "Live" },
    { label: "Find Your Sake", url: "/find-your-sake" },
    { label: "Find Your Coffee (Quiz)", url: "/find-your-coffee" },
    { label: "Tony Greenberg", url: "/" },
  ],
  theme: {
    primary: "#6F4E37",    // coffee brown
    accent: "#C5A23C",     // gold
    warm: "#F5F0E6",       // parchment
    bg: "#FAFAF7",         // warm white
    text: "#2C1810",       // dark espresso
    cardBg: "#FAF7F0",     // cream
  },
  scoringWeights: { qpr: 0.35, availability: 0.15, wow: 0.30, scarcity: 0.20 },
  flavorAxes: [
    { key: "acidity", label: "Acidity", max: 10 },
    { key: "body", label: "Body", max: 10 },
    { key: "sweetness", label: "Sweetness", max: 10 },
    { key: "complexity", label: "Complexity", max: 10 },
    { key: "fruitiness", label: "Fruitiness", max: 10 },
    { key: "chocolate", label: "Chocolate/Nutty", max: 10 },
  ],
  tierLabels: ["☕", "☕☕", "☕☕☕", "👑"],
  tierRanges: [82, 86, 90, 92],
  shameCategories: [
    "The Greenwashers",
    "The Stale Shelf Sitters",
    "The Fake Specialty",
    "The Farmer Exploiters",
    "The Mold Deniers",
    "The Marketing Frauds",
  ],
  voiceRules: "Opinionated, evidence-based, never cruel. Celebrate the craft. Call out the fraud. Make the reader smarter with every sentence.",
};
