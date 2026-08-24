/**
 * Intelligence Engine — Generic types for any topic site
 * (coffee, mezcal, sake, tea, wine, etc.)
 * One config + data file per topic drives all pages.
 */

/* ─── Scoring ─── */
export interface ScoringWeights {
  qpr: number;       // quality-price ratio weight
  availability: number;
  wow: number;
  scarcity: number;
}

export interface FlavorAxis {
  key: string;
  label: string;
  max: number;
}

/* ─── Catalog Item (the core product) ─── */
export interface CatalogItem {
  id: string;
  name: string;
  producer: string;
  producerCountry: string;
  producerShipsGlobal: boolean;
  originCountry: string;
  originRegion: string;
  originFarm?: string;
  altitude?: number;
  variety: string;
  species?: string;
  processingMethod: string;
  processingDetail?: string;
  roastLevel?: string;       // coffee-specific but generic enough
  cuppingScore?: number;
  cuppingSource?: string;
  flavorProfile: Record<string, number>;  // keyed by FlavorAxis.key
  tastingNotes: string[];
  priceUsd: number;
  unitGrams: number;
  moldTestStatus?: "verified" | "claims" | "untested" | "failed";
  moldTestSource?: string;
  producerTransparencyGrade: "A" | "B" | "C" | "D" | "F";
  farmerSharePct?: number;
  farmerShareUsd?: number;
  cMarketPremiumPct?: number;
  buyLinks: { label: string; url: string }[];
  scarcityProxy: number;     // 0-100
  limitedRelease: boolean;
  microlotSizeKg?: number;
  harvestYear?: number;
  inStock: boolean;
  deliveryDaysEst?: number;
  shipCostUsdEst?: number;
  varietyRarityScore: number; // 1-10
  weirdnessScore: number;    // 0-10
  competitionWins?: string[];
  climateRiskRegion?: string;
  recommendedBrewMethods?: string[];
  foodPairingSuggestions?: string[];
  connoisseurNote?: string;
  wowProxy: number;          // 0-100
  roastDate?: string;        // ISO date
  peakWindowDays?: [number, number]; // e.g. [7, 21]
  imageUrl?: string;
  // Computed (filled by scoring engine)
  scores?: ComputedScores;
}

export interface ComputedScores {
  qpr: number;
  availability: number;
  scarcity: number;
  wow: number;
  overall: number;
  tier: 1 | 2 | 3 | 4;       // ☕ / ☕☕ / ☕☕☕ / 👑
  freshness: "green" | "yellow" | "red" | "unknown";
}

/* ─── Variety / Species ─── */
export interface VarietyEntry {
  id: string;
  name: string;
  species?: string;
  origin: string;
  genetics: string;
  growingConditions: string;
  yieldLevel: string;
  diseaseResistance: string;
  caffeineLevel: string;
  cupProfile: string;
  rarityScore: number;       // 1-10
  whereGrown: string[];
  competitionWins?: string[];
  buyLinks?: { label: string; url: string }[];
  parentVarieties?: string[];
  description: string;
}

/* ─── Producer / Roaster ─── */
export interface ProducerEntry {
  id: string;
  name: string;
  country: string;
  region?: string;
  transparencyScore: number;  // 0-100
  qualityScore: number;
  varietyRange: number;
  farmerEquityGrade: "A" | "B" | "C" | "D" | "F";
  innovationScore: number;
  shipsGlobal: boolean;
  overallGrade: "A" | "B" | "C" | "D" | "F";
  url?: string;
  description: string;
  philosophy?: string;
}

/* ─── Farm / Origin Passport ─── */
export interface FarmEntry {
  id: string;
  name: string;
  producer: string;
  country: string;
  region: string;
  altitude?: string;
  varieties: string[];
  processingMethods: string[];
  harvestMonths: string;
  certifications: string[];
  farmerShareData?: string;
  story: string;
  currentLots?: string[];
  pastLots?: string[];
  imageUrl?: string;
}

/* ─── Processing Method ─── */
export interface ProcessingMethod {
  id: string;
  name: string;
  category: "classic" | "experimental" | "decaf";
  description: string;
  flavorImpact: string;
  complexity: number;         // 1-10
  controversy?: string;
}

/* ─── Wall of Shame Entry ─── */
export interface ShameEntry {
  id: string;
  rank: number;
  brand: string;
  category: string;
  evidence: string;
  severity: number;           // 1-100
  response?: string;
  appealLink?: string;
}

/* ─── Experience ─── */
export interface ExperienceEntry {
  id: string;
  name: string;
  type: "tasting" | "farm-visit" | "competition" | "city-guide" | "weird";
  location: string;
  country: string;
  lat?: number;
  lng?: number;
  price?: string;
  description: string;
  url?: string;
}

/* ─── Glossary Term ─── */
export interface GlossaryTerm {
  id: string;
  term: string;
  category: string;
  definition: string;
  whyItMatters: string;
  relatedPage?: string;
}

/* ─── Health Claim ─── */
export interface HealthClaim {
  id: string;
  type: "benefit" | "risk";
  title: string;
  detail: string;
  citation?: string;
  magnitude?: string;
}

/* ─── Pairing ─── */
export interface PairingEntry {
  origin: string;
  foods: string[];
  drinks?: string[];
  antiPairings?: string[];
}

/* ─── Flight / Drop ─── */
export interface FlightEntry {
  id: string;
  name: string;
  theme: string;
  description: string;
  coffeeIds: string[];
  priceUsd: number;
  scarcity?: string;
}

/* ─── Quiz Question ─── */
export interface QuizQuestion {
  id: string;
  screen: number;
  question: string;
  subtext?: string;
  type: "single" | "multi" | "slider" | "palate-grid";
  options?: { label: string; value: string; emoji?: string; tag?: string }[];
  sliderMin?: number;
  sliderMax?: number;
  sliderLabels?: Record<number, string>;
  palateItems?: { item: string; options: string[]; tag: string }[];
}

/* ─── Identity Type (quiz result) ─── */
export interface IdentityType {
  id: string;
  name: string;
  tagline: string;
  description: string;
  flavorPrefs: string[];
  priceRange: string;
  brewMethod: string;
  matchTags: string[];
  path?: string[];             // recommended page sequence
  topCoffeeIds?: string[];
  gearRecs?: { name: string; price: string; buyUrl?: string }[];
  badge?: string;
}

/* ─── Dollar Breakdown ─── */
export interface DollarBreakdown {
  id: string;
  segment: string;
  farmerPct: number;
  exporterPct: number;
  importerPct: number;
  roasterPct: number;
  retailerPct: number;
  farmerDollars: number;
  totalPrice: number;
  commentary: string;
}

/* ─── Site Configuration ─── */
export interface SiteConfig {
  id: string;                 // e.g. "brewsoul"
  name: string;               // e.g. "BrewSoul"
  tagline: string;
  byline: string;
  baseRoute: string;          // e.g. "/brewsoul"
  mainSiteUrl: string;
  ecosystemLinks: { label: string; url: string; badge?: string }[];
  theme: {
    primary: string;
    accent: string;
    warm: string;
    bg: string;
    text: string;
    cardBg: string;
  };
  scoringWeights: ScoringWeights;
  flavorAxes: FlavorAxis[];
  tierLabels: [string, string, string, string]; // e.g. ["☕","☕☕","☕☕☕","👑"]
  tierRanges: [number, number, number, number]; // e.g. [82, 86, 90, 92]
  shameCategories: string[];
  voiceRules: string;
}
