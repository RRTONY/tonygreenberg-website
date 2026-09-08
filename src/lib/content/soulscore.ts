// Ported from legacy client/src/pages/SoulScore.tsx (1231 lines, the
// largest remaining legacy page) — "SoulScore™ — 12-Dimension Impact
// Measurement Engine," by ImpactSoul. Unlike the other "Find Your X"
// assessments in this migration, SoulScore isn't a question-and-answer
// quiz that resolves to a fixed archetype — it's a live interactive
// measurement engine/calculator: pick an entity type, drag 12 dimension
// sliders (weighted, one on a 0-1000 Hawkins consciousness scale, the
// other 11 on 0-100), and every score, grade, benchmark comparison, and
// derived metric (Supply Chain Composite, Consciousness-Adjusted NPV)
// recomputes in real time. This module is the real data + calculation
// engine, ported verbatim: all 12 dimensions (labels, icons, weights,
// units, real descriptions), all 8 entity types, all 7 real benchmark
// entities (Fortune 500 Avg, B Corp Avg, Patagonia, BP, an extractive gig
// platform, Avg US Worker, ImpactSoul's own Impact Worker) with their real
// per-dimension scores, the real 6-tier/30-factor supply chain model, all
// 20 "why every impact system failed" entries with real severity ratings
// and fixes, the real C-NPV formula (consciousness multiplier + discount
// adjustment), and the real gig-economy stats/5-layer stack/extractive-vs
// -regenerative comparison. Grade thresholds (S/A/B/C/D/F), consciousness
// zones (SHAME/FORCE/POWER/LOVE, the real Hawkins-scale 200-point
// force/power threshold), and severity-tier colors are ported unchanged.
//
// Color architecture: every one of the ~30 data records that needs a
// per-item accent color (12 dimensions, 6 supply tiers, 5 gig-stack
// layers) actually draws from the same 12-hex palette the dimensions
// already define — legacy just repeated hex literals inline everywhere.
// Rather than interpolate `d.color` into a className at the JSX usage site
// (which Tailwind's build-time scanner can't see — see CONTRIBUTING.md's
// "no fragment-assembled classes" rule), every hex has one entry in
// `PALETTE` below with every Tailwind class variant it's ever used in
// (text/border/border-l/border-t/bg-soft/accent) fully precomposed as a
// literal string. Data records reference a `colorKey` into `PALETTE`; the
// literal class strings still exist in this file's source text, so
// Tailwind's scanner finds them same as `c.cardBorderHover` does elsewhere
// in this codebase.

export type ColorKey =
  | "gold"
  | "goldLight"
  | "teal"
  | "red"
  | "green"
  | "purple"
  | "blue"
  | "indigo"
  | "emerald"
  | "orange"
  | "cyan"
  | "amber";

interface ColorClasses {
  hex: string;
  text: string;
  border: string;
  borderL: string;
  borderT: string;
  bgSoft: string;
  bgSolid: string;
  accent: string;
}

// One entry per real hex used anywhere in SoulScore's data. Every className
// variant that gets used somewhere is spelled out in full here so Tailwind's
// scanner picks it up — never assembled from `colorKey` fragments at render.
export const PALETTE: Record<ColorKey, ColorClasses> = {
  gold: {
    hex: "#8B6914",
    text: "text-[#8B6914]",
    border: "border-[#8B6914]",
    borderL: "border-l-[#8B6914]",
    borderT: "border-t-[#8B6914]",
    bgSoft: "bg-[#8B6914]/10",
    bgSolid: "bg-[#8B6914]",
    accent: "accent-[#8B6914]",
  },
  goldLight: {
    hex: "#D4B96A",
    text: "text-[#D4B96A]",
    border: "border-[#D4B96A]",
    borderL: "border-l-[#D4B96A]",
    borderT: "border-t-[#D4B96A]",
    bgSoft: "bg-[#D4B96A]/10",
    bgSolid: "bg-[#D4B96A]",
    accent: "accent-[#D4B96A]",
  },
  teal: {
    hex: "#2a9d8f",
    text: "text-[#2a9d8f]",
    border: "border-[#2a9d8f]",
    borderL: "border-l-[#2a9d8f]",
    borderT: "border-t-[#2a9d8f]",
    bgSoft: "bg-[#2a9d8f]/10",
    bgSolid: "bg-[#2a9d8f]",
    accent: "accent-[#2a9d8f]",
  },
  red: {
    hex: "#e63946",
    text: "text-[#e63946]",
    border: "border-[#e63946]",
    borderL: "border-l-[#e63946]",
    borderT: "border-t-[#e63946]",
    bgSoft: "bg-[#e63946]/10",
    bgSolid: "bg-[#e63946]",
    accent: "accent-[#e63946]",
  },
  green: {
    hex: "#588157",
    text: "text-[#588157]",
    border: "border-[#588157]",
    borderL: "border-l-[#588157]",
    borderT: "border-t-[#588157]",
    bgSoft: "bg-[#588157]/10",
    bgSolid: "bg-[#588157]",
    accent: "accent-[#588157]",
  },
  purple: {
    hex: "#9b5de5",
    text: "text-[#9b5de5]",
    border: "border-[#9b5de5]",
    borderL: "border-l-[#9b5de5]",
    borderT: "border-t-[#9b5de5]",
    bgSoft: "bg-[#9b5de5]/10",
    bgSolid: "bg-[#9b5de5]",
    accent: "accent-[#9b5de5]",
  },
  blue: {
    hex: "#3a86a8",
    text: "text-[#3a86a8]",
    border: "border-[#3a86a8]",
    borderL: "border-l-[#3a86a8]",
    borderT: "border-t-[#3a86a8]",
    bgSoft: "bg-[#3a86a8]/10",
    bgSolid: "bg-[#3a86a8]",
    accent: "accent-[#3a86a8]",
  },
  indigo: {
    hex: "#6c5ce7",
    text: "text-[#6c5ce7]",
    border: "border-[#6c5ce7]",
    borderL: "border-l-[#6c5ce7]",
    borderT: "border-t-[#6c5ce7]",
    bgSoft: "bg-[#6c5ce7]/10",
    bgSolid: "bg-[#6c5ce7]",
    accent: "accent-[#6c5ce7]",
  },
  emerald: {
    hex: "#00b894",
    text: "text-[#00b894]",
    border: "border-[#00b894]",
    borderL: "border-l-[#00b894]",
    borderT: "border-t-[#00b894]",
    bgSoft: "bg-[#00b894]/10",
    bgSolid: "bg-[#00b894]",
    accent: "accent-[#00b894]",
  },
  orange: {
    hex: "#e17055",
    text: "text-[#e17055]",
    border: "border-[#e17055]",
    borderL: "border-l-[#e17055]",
    borderT: "border-t-[#e17055]",
    bgSoft: "bg-[#e17055]/10",
    bgSolid: "bg-[#e17055]",
    accent: "accent-[#e17055]",
  },
  cyan: {
    hex: "#00b4d8",
    text: "text-[#00b4d8]",
    border: "border-[#00b4d8]",
    borderL: "border-l-[#00b4d8]",
    borderT: "border-t-[#00b4d8]",
    bgSoft: "bg-[#00b4d8]/10",
    bgSolid: "bg-[#00b4d8]",
    accent: "accent-[#00b4d8]",
  },
  amber: {
    hex: "#D4A017",
    text: "text-[#D4A017]",
    border: "border-[#D4A017]",
    borderL: "border-l-[#D4A017]",
    borderT: "border-t-[#D4A017]",
    bgSoft: "bg-[#D4A017]/10",
    bgSolid: "bg-[#D4A017]",
    accent: "accent-[#D4A017]",
  },
};

/* ═══════════════════════════════════════════════════════════
   DIMENSIONS (real, unchanged — 12 axes, weights sum to 100)
   ═══════════════════════════════════════════════════════════ */

export interface Dimension {
  id: number;
  label: string;
  shortLabel: string;
  icon: string;
  colorKey: ColorKey;
  weight: number;
  max: number;
  unit: string;
  description: string;
}

export const DIMENSIONS: Dimension[] = [
  { id: 1, label: "Consciousness", shortLabel: "CONSC", icon: "◉", colorKey: "gold", weight: 12, max: 1000, unit: "Hawkins Scale", description: "20=Shame → 1000=Enlightenment. 200=critical threshold: below=force, above=power" },
  { id: 2, label: "Carbon & Climate", shortLabel: "CARBN", icon: "🌍", colorKey: "teal", weight: 10, max: 100, unit: "tCO₂e", description: "Scope 1-3 + sequestration + trajectory to net-positive" },
  { id: 3, label: "Labor Justice", shortLabel: "LABOR", icon: "⚖", colorKey: "red", weight: 10, max: 100, unit: "LJI", description: "Wage equity, benefits, safety, dignity, CEO-to-median ratio" },
  { id: 4, label: "Supply Chain", shortLabel: "SUPLC", icon: "🔗", colorKey: "green", weight: 10, max: 100, unit: "SCI", description: "6-tier depth: Tier1 → Tier4 origin ecosystems → logistics → end-of-life" },
  { id: 5, label: "Cultural Preservation", shortLabel: "CULTR", icon: "🏛", colorKey: "purple", weight: 8, max: 100, unit: "CPI", description: "Indigenous rights, sacred sites, traditional knowledge sovereignty" },
  { id: 6, label: "Community Multiplier", shortLabel: "COMTY", icon: "🏘", colorKey: "blue", weight: 8, max: 100, unit: "CMX", description: "Dollar recirculation, local hiring, community ownership %, power-sharing" },
  { id: 7, label: "Financial Justice", shortLabel: "FINJT", icon: "💎", colorKey: "goldLight", weight: 8, max: 100, unit: "FJI", description: "Stakeholder vs shareholder return distribution" },
  { id: 8, label: "Governance & Trust", shortLabel: "GOVNT", icon: "🏗", colorKey: "indigo", weight: 7, max: 100, unit: "GTI", description: "Board diversity, stakeholder representation, transparency" },
  { id: 9, label: "Resource Circularity", shortLabel: "RSCRC", icon: "♻", colorKey: "emerald", weight: 7, max: 100, unit: "RCI", description: "Circular material use, waste-to-value, water stewardship" },
  { id: 10, label: "Human Dignity", shortLabel: "DGITY", icon: "✊", colorKey: "orange", weight: 7, max: 100, unit: "HDI", description: "Worker autonomy, portable credentials, mental health" },
  { id: 11, label: "Regenerative Innovation", shortLabel: "REGEN", icon: "🧬", colorKey: "cyan", weight: 7, max: 100, unit: "RII", description: "Net-positive R&D, open-source, biomimicry" },
  { id: 12, label: "Radical Transparency", shortLabel: "TRANS", icon: "◈", colorKey: "amber", weight: 6, max: 100, unit: "RTI", description: "Real-time reporting, blockchain verification, independent audits" },
];

export const TOTAL_WEIGHT = DIMENSIONS.reduce((s, d) => s + d.weight, 0);

export const ENTITY_TYPES = [
  { id: "individual", label: "Individual", icon: "👤" },
  { id: "gig-worker", label: "Gig Worker", icon: "⚡" },
  { id: "team", label: "Team", icon: "👥" },
  { id: "company", label: "Company", icon: "🏢" },
  { id: "ceo", label: "CEO", icon: "👑" },
  { id: "supply-chain", label: "Supply Chain", icon: "🔗" },
  { id: "fund", label: "Fund", icon: "📊" },
  { id: "token", label: "Tokenized Asset", icon: "🪙" },
];

export interface BenchmarkEntity {
  name: string;
  tag?: string;
  scores: number[]; // 12 values matching DIMENSIONS order
}

export const BENCHMARKS: BenchmarkEntity[] = [
  { name: "Fortune 500 Avg", tag: "F500", scores: [110, 35, 40, 30, 15, 20, 25, 45, 30, 35, 40, 30] },
  { name: "B Corp Avg", tag: "BCORP", scores: [225, 62, 68, 55, 45, 60, 55, 70, 58, 65, 50, 65] },
  { name: "Patagonia", tag: "PATA", scores: [430, 88, 92, 85, 70, 82, 78, 90, 95, 90, 85, 92] },
  { name: "BP (ESG 'AA' rated)", tag: "BP", scores: [75, 18, 45, 25, 10, 15, 20, 55, 15, 40, 30, 35] },
  { name: "Extractive Gig Platform", tag: "UBER", scores: [95, 25, 22, 20, 5, 10, 12, 30, 20, 15, 45, 20] },
  { name: "Avg US Worker", tag: "USWK", scores: [175, 30, 0, 0, 20, 35, 25, 0, 30, 0, 20, 25] },
  { name: "ImpactSoul Impact Worker", tag: "ISOL", scores: [280, 65, 80, 60, 55, 70, 65, 55, 60, 85, 50, 75] },
];

export interface SupplyTier {
  name: string;
  colorKey: ColorKey;
  factors: string[];
}

export const SUPPLY_TIERS: SupplyTier[] = [
  { name: "Tier 1: Direct Suppliers", colorKey: "green", factors: ["Labor practices", "Environmental compliance", "Consciousness calibration", "Conflict minerals", "Living wage"] },
  { name: "Tier 2: Components", colorKey: "red", factors: ["Child labor", "Water contamination", "Chemical safety", "Community displacement", "Indigenous land rights"] },
  { name: "Tier 3: Raw Materials", colorKey: "amber", factors: ["Extraction violence", "Deforestation", "Cobalt/lithium ethics", "Artisanal mining conditions", "Biodiversity"] },
  { name: "Tier 4: Origin Ecosystems", colorKey: "teal", factors: ["Soil health", "Watershed integrity", "Cultural site proximity", "Sacred land", "Climate vulnerability"] },
  { name: "Logistics", colorKey: "indigo", factors: ["Last-mile emissions", "Packaging circularity", "Cold chain energy", "Warehouse worker safety", "Gig delivery dignity"] },
  { name: "End of Life", colorKey: "orange", factors: ["E-waste destination", "Recyclability rate", "Landfill toxicity", "Circular recovery %", "Community health"] },
];

export interface FailurePattern {
  title: string;
  severity: number;
  fix: string;
}

export const FAILURES: FailurePattern[] = [
  { title: "No baseline ever set", severity: 10, fix: "SoulScore auto-generates baseline on first measurement" },
  { title: "ESG correlates with greenwashing", severity: 10, fix: "12-axis eliminates single-dimension gaming" },
  { title: "Supply chain = carbon only", severity: 10, fix: "6-tier, 30-factor analysis" },
  { title: "$41T ESG funds zero standards", severity: 10, fix: "Open-source scoring, on-chain verification" },
  { title: "No individual impact identity", severity: 10, fix: "Personal SoulScore: portable, sovereign, cumulative" },
  { title: "76.4M gig workers unmeasured", severity: 10, fix: "Impact Worker credential + tokens" },
  { title: "CEO consciousness unmeasured", severity: 9, fix: "Leadership calibration correlated to C-NPV" },
  { title: "Dashboards before data architecture", severity: 9, fix: "Data collection first, measurement auto-generates" },
  { title: "Self-reported data = truth", severity: 9, fix: "On-chain verification + third-party consciousness audit" },
  { title: "Every impact platform died", severity: 10, fix: "AI-native architecture, not dashboards on broken data" },
  { title: "Cultural impact invisible", severity: 9, fix: "Cultural Preservation Index" },
  { title: "Community multiplier unmeasured", severity: 9, fix: "Dollar recirculation tracking" },
  { title: "Labor justice weakest ESG pillar", severity: 9, fix: "Independent Labor Justice Index" },
  { title: "No consciousness layer anywhere", severity: 9, fix: "Hawkins-calibrated Corporate Consciousness Scale" },
  { title: "Impact tokens don't exist", severity: 10, fix: "ABIT: verified outcomes minted as tradeable tokens" },
  { title: "Regenerative can't be scored", severity: 9, fix: "SoulScore measures net-positive" },
  { title: "Worker dignity not a metric", severity: 10, fix: "Human Dignity Index" },
  { title: "No stakeholder justice measurement", severity: 9, fix: "Financial Justice Index" },
  { title: "Measurement costs > benefit", severity: 9, fix: "AI-native: 90% cost reduction" },
  { title: "No universal impact language", severity: 9, fix: "SoulScore = universal unit" },
];

export function severityClasses(severity: number): { bgSolid: string; border: string } {
  if (severity >= 10) return { bgSolid: PALETTE.red.bgSolid, border: PALETTE.red.borderT };
  if (severity >= 9) return { bgSolid: PALETTE.orange.bgSolid, border: PALETTE.orange.borderT };
  return { bgSolid: PALETTE.amber.bgSolid, border: PALETTE.amber.borderT };
}

/* ═══════════════════════════════════════════════════════════
   GIG ECONOMY (real stats + 5-layer stack + extractive/regenerative)
   ═══════════════════════════════════════════════════════════ */

export const GIG_STATS = [
  { label: "US Freelancers", value: "76.4M" },
  { label: "US Earnings", value: "$1.27T" },
  { label: "Impact Platforms", value: "0" },
  { label: "Global Market", value: "$3.8T" },
];

export interface GigLayer {
  name: string;
  desc: string;
  colorKey: ColorKey;
  icon: string;
}

export const GIG_LAYERS: GigLayer[] = [
  { name: "DAO Governance", desc: "Workers vote on impact allocation", colorKey: "gold", icon: "🏛" },
  { name: "Impact Tokens", desc: "ABIT per verified outcome, appreciates with underlying asset", colorKey: "amber", icon: "🪙" },
  { name: "Impact Attribution", desc: "Every task → outcome chain → individual SoulScore", colorKey: "cyan", icon: "📊" },
  { name: "Dignity Infrastructure", desc: "Portable credentials, benefits, mental health", colorKey: "purple", icon: "✊" },
  { name: "Fair Compensation", desc: "Market rate floor, zero extraction", colorKey: "green", icon: "💰" },
];

export const CNPV_REFERENCE_POINTS = [
  { name: "Patagonia", hawkins: 430, premium: "+33%" },
  { name: "B Corp Avg", hawkins: 225, premium: "+12.5%" },
  { name: "Fortune 500 Avg", hawkins: 110, premium: "+1%" },
  { name: "BP", hawkins: 75, premium: "-2.5%" },
];

/* ═══════════════════════════════════════════════════════════
   CALCULATION ENGINE (real formulas, unchanged)
   ═══════════════════════════════════════════════════════════ */

export function normalize(value: number, dim: Dimension): number {
  return dim.max === 1000 ? (value / 1000) * 100 : value;
}

export function calcSoulScore(scores: number[]): number {
  let sum = 0;
  for (let i = 0; i < DIMENSIONS.length; i++) {
    sum += normalize(scores[i], DIMENSIONS[i]) * DIMENSIONS[i].weight;
  }
  return sum / TOTAL_WEIGHT;
}

export function getGrade(score: number): { letter: string; colorKey: ColorKey } {
  if (score >= 85) return { letter: "S", colorKey: "gold" };
  if (score >= 70) return { letter: "A", colorKey: "teal" };
  if (score >= 55) return { letter: "B", colorKey: "green" };
  if (score >= 40) return { letter: "C", colorKey: "amber" };
  if (score >= 25) return { letter: "D", colorKey: "orange" };
  return { letter: "F", colorKey: "red" };
}

export function getConsciousnessZone(hawkins: number): { zone: string; colorKey: ColorKey; bg: string } {
  if (hawkins >= 500) return { zone: "LOVE", colorKey: "gold", bg: "bg-[#FDF8E8]" };
  if (hawkins >= 200) return { zone: "POWER", colorKey: "teal", bg: "bg-[#E8F5F2]" };
  if (hawkins >= 100) return { zone: "FORCE", colorKey: "orange", bg: "bg-[#FDF0ED]" };
  return { zone: "SHAME", colorKey: "red", bg: "bg-[#FDE8EA]" };
}

// SCI×30% + LJI×20% + Carbon×15% + RCI×15% + CPI×10% + HDI×10%
export function calcSupplyChainComposite(scores: number[]): number {
  return scores[3] * 0.3 + scores[2] * 0.2 + scores[1] * 0.15 + scores[8] * 0.15 + scores[4] * 0.1 + scores[9] * 0.1;
}

export function calcCNPV(fcf: number, consciousness: number, years: number, discount: number): { standard: number; adjusted: number; premium: number } {
  const multiplier = 1.0 + (consciousness - 100) / 1000;
  const discountAdj = Math.min(Math.max((consciousness - 100) / 50, 0) * 0.004, 0.02);
  let standard = 0;
  let adjusted = 0;
  for (let t = 1; t <= years; t++) {
    standard += fcf / Math.pow(1 + discount / 100, t);
    adjusted += (fcf * multiplier) / Math.pow(1 + (discount / 100 - discountAdj), t);
  }
  return { standard, adjusted, premium: standard > 0 ? ((adjusted - standard) / standard) * 100 : 0 };
}

export function formatCurrency(n: number): string {
  if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}
