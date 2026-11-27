import { AlertTriangle, DollarSign, Droplets, Filter, Heart, Leaf, Zap, type LucideIcon } from "lucide-react";

// Questions and UI copy for the Tap Water lookup and its 10-point Water Profile Survey, ported
// unchanged from the Aqueous app's client/src/pages/TapWater.tsx (2026-11-24). Kept here, not in the
// step files (CONTRIBUTING rule 19).

export type SurveyAnswers = {
  healthPriority: number;
  budgetRange: number;
  householdSize: number;
  waterUsage: number;
  environmentalConcern: number;
  contaminantAwareness: number;
  filterWillingness: number;
  glassPreference: number;
  carbonFootprint: number;
  lifestyleAlignment: number;
};

export const defaultSurvey: SurveyAnswers = {
  healthPriority: 5,
  budgetRange: 5,
  householdSize: 3,
  waterUsage: 5,
  environmentalConcern: 5,
  contaminantAwareness: 5,
  filterWillingness: 5,
  glassPreference: 5,
  carbonFootprint: 5,
  lifestyleAlignment: 5,
};

export type SurveyQuestion = {
  key: keyof SurveyAnswers;
  icon: LucideIcon;
  title: string;
  question: string;
  low: string;
  high: string;
};

export const surveyQuestions: SurveyQuestion[] = [
  {
    key: "healthPriority",
    icon: Heart,
    title: "Health Priority",
    question: "How important is water purity to your overall health strategy?",
    low: "Nice to have",
    high: "Top priority",
  },
  {
    key: "budgetRange",
    icon: DollarSign,
    title: "Budget Sensitivity",
    question: "How much are you willing to invest monthly in better water?",
    low: "Under $10/mo",
    high: "$100+/mo",
  },
  {
    key: "householdSize",
    icon: Droplets,
    title: "Household Size",
    question: "How many people in your household drink water daily?",
    low: "1 person",
    high: "6+ people",
  },
  {
    key: "waterUsage",
    icon: Droplets,
    title: "Daily Water Consumption",
    question: "How much water does your household consume daily?",
    low: "< 1 gallon",
    high: "5+ gallons",
  },
  {
    key: "environmentalConcern",
    icon: Leaf,
    title: "Environmental Concern",
    question: "How important is reducing plastic waste and carbon footprint in your water choices?",
    low: "Not a factor",
    high: "Drives my decisions",
  },
  {
    key: "contaminantAwareness",
    icon: AlertTriangle,
    title: "Contaminant Awareness",
    question: "How aware are you of the specific contaminants in your local water supply?",
    low: "Not aware at all",
    high: "Very informed",
  },
  {
    key: "filterWillingness",
    icon: Filter,
    title: "Filter Investment",
    question: "How willing are you to install a home filtration system (e.g., reverse osmosis)?",
    low: "Not interested",
    high: "Ready to install",
  },
  {
    key: "glassPreference",
    icon: Droplets,
    title: "Glass Over Plastic",
    question: "How strongly do you prefer glass-bottled water over plastic?",
    low: "No preference",
    high: "Glass only",
  },
  {
    key: "carbonFootprint",
    icon: Leaf,
    title: "Carbon Footprint",
    question: "How much does the carbon footprint of water transportation matter to you?",
    low: "Not a factor",
    high: "Critical factor",
  },
  {
    key: "lifestyleAlignment",
    icon: Zap,
    title: "Conscious Living",
    question:
      "How aligned is your lifestyle with reducing GDP-driven consumption and becoming a conscious satisfier?",
    low: "Just starting",
    high: "Fully committed",
  },
];

export type ProfileType =
  | "The Conscious Satisfier"
  | "The Regenerative Guardian"
  | "The Health Optimizer"
  | "The Eco Warrior"
  | "The Smart Economist"
  | "The Awakening Explorer";

export const profileDescriptions: Record<ProfileType, string> = {
  "The Conscious Satisfier":
    "You embody the Great Simplification — seeking maximum quality of life with minimum resource extraction. Water is sacred to you.",
  "The Regenerative Guardian":
    "You protect both your body and the planet. Every water choice is a vote for the world you want to live in.",
  "The Health Optimizer":
    "Your body is your temple. You prioritize purity and quality above all else in your water choices.",
  "The Eco Warrior": "The planet comes first. You minimize plastic, carbon, and corporate exploitation in every sip.",
  "The Smart Economist":
    "You maximize value per dollar. The best water at the lowest cost — efficiency is your superpower.",
  "The Awakening Explorer": "You are beginning your journey toward conscious consumption. Every step matters.",
};

export type UrgencyLevel = "critical" | "high" | "moderate" | "low";

// Full literal class strings per urgency level (never assembled from fragments).
export const urgencyCopy: Record<
  Exclude<UrgencyLevel, "low">,
  { box: string; icon: string; title: string; heading: string; body: string }
> = {
  critical: {
    box: "bg-red-50 border border-red-200",
    icon: "text-red-600",
    title: "text-red-800",
    heading: "CRITICAL: A reverse osmosis filter is essential for this water supply.",
    body: "Multiple contaminants exceed EPA limits. Do not drink unfiltered.",
  },
  high: {
    box: "bg-orange-50 border border-orange-200",
    icon: "text-orange-600",
    title: "text-orange-800",
    heading: "HIGH PRIORITY: An RO filter is strongly recommended for your health.",
    body: "Several contaminants exceed health guidelines. Filtration will make a significant difference.",
  },
  moderate: {
    box: "bg-amber-50 border border-amber-200",
    icon: "text-amber-600",
    title: "text-amber-800",
    heading: "MODERATE: A quality filter would meaningfully improve your water.",
    body: "Some contaminants above EWG health guidelines. Filtration recommended for optimal health.",
  },
};

export function urgencyFor(score: number): UrgencyLevel {
  return score < 35 ? "critical" : score < 50 ? "high" : score < 65 ? "moderate" : "low";
}

export const popularCities = ["Santa Monica", "Los Angeles", "New York", "Chicago", "Fresno", "Houston", "Phoenix"];

// The app's QPR pillar colors, as literal classes.
export const cityPillars = [
  { label: "Quality", key: "quality", color: "text-[#0A8754]" },
  { label: "Purity", key: "purity", color: "text-[#4ECDC4]" },
  { label: "Resonance", key: "resonance", color: "text-[#B87333]" },
] as const;

// getScoreColor() returns one of five hex colors; the app painted the urgency bar with it inline.
// Same colors as literal classes so only the width stays a runtime style.
export const scoreBarClass: Record<string, string> = {
  "#0A8754": "bg-[#0A8754]",
  "#4ECDC4": "bg-[#4ECDC4]",
  "#B87333": "bg-[#B87333]",
  "#C75B39": "bg-[#C75B39]",
  "#9B2335": "bg-[#9B2335]",
};

export const costRows = [
  { option: "Branded Bottled Water", monthly: "$40-80", annual: "$480-960", saved: "0 (adds ~60/mo)", bad: true },
  { option: "Pitcher Filter (Brita/ZeroWater)", monthly: "$8-15", annual: "$96-180", saved: "~720/year" },
  {
    option: "RO System",
    monthly: "$3-8 (after install)",
    annual: "$36-96 + $200 install",
    saved: "~1,440/year",
    best: true,
  },
  { option: "Spring Water Delivery (Glass)", monthly: "$30-60", annual: "$360-720", saved: "~720/year (reusable)" },
];

export const tapWaterData = {
  title: "Tap Water Lookup",
  intro:
    "Search by city, state, or ZIP code — or let us detect your location. All data sourced from EPA SDWIS, EWG Tap Water Database, and publicly filed Consumer Confidence Reports.",
  searchPlaceholder: "Enter city, state, or ZIP code (e.g. 90405, Santa Monica)...",
  useLocation: "Use my location",
  takeSurvey: "Take the Water Profile Survey",
  geo: {
    unsupported: "Geolocation is not supported by your browser.",
    noCity: "Could not determine your city. Try entering your ZIP code.",
    failed: "Failed to look up your location. Try entering your ZIP code.",
    denied: "Location access denied. Please enter your city or ZIP code manually.",
  },
  survey: {
    back: "Back to search",
    title: "Water Profile Survey",
    generic: "Help us understand your water needs",
    cancel: "Cancel",
    previous: "Previous",
    next: "Next",
    finish: "See My Results",
  },
};
