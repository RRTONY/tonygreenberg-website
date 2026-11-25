/**
 * Unified Sake Data — merges sakeBottles (12 curated, EVI/EEI) and qprSakeDatabase (113, QPR)
 * into a single collection with a common interface for the Collection page.
 * Deduplicates 7 overlapping entries, preferring the richer SakeBottle data.
 */
import { sakeBottles, type SakeBottle } from "@/lib/content/sake/sake-data";
import { qprSakeDatabase, type QPRSake } from "@/lib/content/sake/qpr-data";

export interface UnifiedSake {
  id: string;
  name: string;
  nameJa: string;
  brewery: string;
  breweryJa: string;
  prefecture: string;
  prefectureJa: string;
  type: string;
  typeJa: string;
  rice: string;
  riceJa: string;
  polishRatio: number;
  smv: number;
  acidity: number;
  abv: number;
  aromaProfile: string[];
  servingTemp: string;
  servingTempJa: string;
  description: string;
  descriptionJa: string;
  // Scoring — unified: use EVI/EEI if available, else derive from QPR scores
  evi: number;  // 1-10 scale
  eei: number;  // 1-10 scale
  // QPR data (available for QPR entries)
  qualityScore?: number;
  experienceScore?: number;
  priceUS?: number;
  priceJapan?: number;
  qprTier?: string;
  usAvailability?: string;
  // Price display
  priceRange: string;
  // Flavor
  flavorNotes: string;
  flavorNotesJa: string;
  // Beginner/Connoisseur notes (only from SakeBottle entries)
  beginnerNote?: string;
  beginnerNoteJa?: string;
  connoisseurNote?: string;
  connoisseurNoteJa?: string;
  // Pairing
  pairingEn?: string[];
  pairingJa?: string[];
  // Label kanji
  labelKanji?: string;
  // Source flag
  source: 'curated' | 'qpr' | 'both';
}

function priceFromUS(priceUS: number): string {
  if (priceUS <= 20) return '$';
  if (priceUS <= 45) return '$$';
  if (priceUS <= 80) return '$$$';
  return '$$$$';
}

function deriveEVI(qpr: QPRSake): number {
  // Map qualityScore (0-100) to EVI (1-10), weighted by QPR value
  const base = qpr.qualityScore / 10;
  const valueBonus = Math.max(0, (qpr.qprUS - 1) * 0.5);
  return Math.min(10, Math.max(1, Math.round((base + valueBonus) * 10) / 10));
}

function deriveEEI(qpr: QPRSake): number {
  // Map experienceScore (0-100) to EEI (1-10)
  return Math.min(10, Math.max(1, Math.round(qpr.experienceScore / 10 * 10) / 10));
}

function fromSakeBottle(sb: SakeBottle): UnifiedSake {
  return {
    id: sb.id,
    name: sb.name,
    nameJa: sb.nameJa,
    brewery: sb.brewery,
    breweryJa: sb.breweryJa,
    prefecture: sb.prefecture,
    prefectureJa: sb.prefectureJa,
    type: sb.type,
    typeJa: sb.typeJa,
    rice: sb.rice,
    riceJa: sb.riceJa,
    polishRatio: sb.polishRatio,
    smv: sb.smv,
    acidity: sb.acidity,
    abv: sb.abv,
    aromaProfile: sb.aromaProfile,
    servingTemp: sb.servingTemp,
    servingTempJa: sb.servingTempJa,
    description: sb.description,
    descriptionJa: sb.descriptionJa,
    evi: sb.evi,
    eei: sb.eei,
    priceRange: sb.priceRange,
    flavorNotes: sb.flavorNotes,
    flavorNotesJa: sb.flavorNotesJa,
    beginnerNote: sb.beginnerNote,
    beginnerNoteJa: sb.beginnerNoteJa,
    connoisseurNote: sb.connoisseurNote,
    connoisseurNoteJa: sb.connoisseurNoteJa,
    source: 'curated',
  };
}

function fromQPRSake(qpr: QPRSake): UnifiedSake {
  return {
    id: qpr.id,
    name: qpr.name,
    nameJa: qpr.nameJa,
    brewery: qpr.brewery,
    breweryJa: qpr.breweryJa,
    prefecture: qpr.prefecture,
    prefectureJa: qpr.prefectureJa,
    type: qpr.type,
    typeJa: qpr.typeJa,
    rice: qpr.riceVariety,
    riceJa: qpr.riceVarietyJa,
    polishRatio: qpr.ricePolishRatio,
    smv: qpr.smv,
    acidity: qpr.acidity,
    abv: qpr.abv,
    aromaProfile: qpr.aromaProfile,
    servingTemp: qpr.servingTemp,
    servingTempJa: qpr.servingTempJa,
    description: qpr.description,
    descriptionJa: qpr.descriptionJa,
    evi: deriveEVI(qpr),
    eei: deriveEEI(qpr),
    qualityScore: qpr.qualityScore,
    experienceScore: qpr.experienceScore,
    priceUS: qpr.priceUS,
    priceJapan: qpr.priceJapan,
    qprTier: qpr.qprTier,
    usAvailability: qpr.usAvailability,
    priceRange: priceFromUS(qpr.priceUS),
    flavorNotes: qpr.flavorProfile.join(', '),
    flavorNotesJa: qpr.flavorProfileJa.join('、'),
    pairingEn: qpr.pairingEn,
    pairingJa: qpr.pairingJa,
    labelKanji: qpr.labelKanji,
    source: 'qpr',
  };
}

function mergeDuplicate(sb: SakeBottle, qpr: QPRSake): UnifiedSake {
  const base = fromSakeBottle(sb);
  return {
    ...base,
    qualityScore: qpr.qualityScore,
    experienceScore: qpr.experienceScore,
    priceUS: qpr.priceUS,
    priceJapan: qpr.priceJapan,
    qprTier: qpr.qprTier,
    usAvailability: qpr.usAvailability,
    pairingEn: qpr.pairingEn,
    pairingJa: qpr.pairingJa,
    labelKanji: qpr.labelKanji,
    source: 'both',
  };
}

// Build the unified collection
const qprById = new Map(qprSakeDatabase.map(q => [q.id, q]));

const merged: UnifiedSake[] = [];

// First: add all SakeBottle entries (with QPR enrichment if available)
for (const sb of sakeBottles) {
  const qpr = qprById.get(sb.id);
  if (qpr) {
    merged.push(mergeDuplicate(sb, qpr));
    qprById.delete(sb.id); // remove so we don't add it again
  } else {
    merged.push(fromSakeBottle(sb));
  }
}

// Second: add remaining QPR entries that aren't in sakeBottles
for (const qpr of Array.from(qprById.values())) {
  merged.push(fromQPRSake(qpr));
}

export const unifiedSakeDatabase: UnifiedSake[] = merged;

// Utility: get unique values for filters
export function getUniqueTypes(): string[] {
  return Array.from(new Set(merged.map(s => s.type))).sort();
}

export function getUniquePrefectures(): string[] {
  return Array.from(new Set(merged.map(s => s.prefecture))).sort();
}

export function getUniqueRice(): string[] {
  return Array.from(new Set(merged.map(s => s.rice))).filter(Boolean).sort();
}

export function getUniqueAromas(): string[] {
  return Array.from(new Set(merged.flatMap(s => s.aromaProfile))).sort();
}

export function getUniqueTiers(): string[] {
  return Array.from(new Set(merged.map(s => s.qprTier).filter(Boolean) as string[])).sort();
}
