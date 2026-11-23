// Ported unchanged from the Aqueous Manus app's client/src/lib/awiEngine.ts (exported 2026-11-24).
/*
  AQUEOUS WATER INDEX (AWI) ENGINE
  ═══════════════════════════════════════════════════════════════
  INVERTED SCALE: 1 = PERFECTION, 100 = WORST
  
  Unlike every other rating system that uses 0-100 where 100 is best,
  AWI inverts this:
  - A score of 1 means "nothing to worry about" — pure, clean, perfect FOR YOU
  - Higher numbers = more problems, more compromise, more distance from your ideal
  
  This is philosophically aligned with the Great Simplification:
  Less is more. Simplicity is the goal. 1 is perfection.
  
  THE SCORE IS ALWAYS PERSONALIZED:
  Two people in the same city see different AWI scores for the same water
  because their priorities (budget, location, contaminant concerns, 
  sustainability values, packaging preferences) are different.
  
  CROSS-REFERENCE AGGREGATE:
  We also show an "Industry Consensus" score — an aggregate of how
  public rating systems, health databases, and independent labs
  would rate the same water, normalized to our inverted scale.
*/

import type { WaterProduct, TapWaterData, QPRScore } from '@/lib/content/aqueous/water-data';

// ── User Profile (from 10-point survey) ─────────────────────

export interface UserWaterProfile {
  // Each weight is 1-10, representing how much the user cares
  healthPriority: number;       // How important is water purity to your health?
  budgetSensitivity: number;    // How price-conscious are you? (10 = very)
  environmentalConcern: number; // How much do you care about packaging/carbon?
  contaminantAwareness: number; // How concerned about PFAS, microplastics, etc?
  filterWillingness: number;    // Willing to use home filtration?
  glassPreference: number;      // Preference for glass over plastic?
  localSourcing: number;        // Preference for locally sourced water?
  carbonFootprint: number;      // How much does shipping distance matter?
  mineralContent: number;       // How important is mineral richness?
  brandSkepticism: number;      // How skeptical of big brand marketing? (10 = very)
  // Derived from geolocation
  userZipCode?: string;
  userCity?: string;
  userState?: string;
  localTapQuality?: number;     // QPR of their local tap water (0-100 old scale)
}

// Default profile (balanced user)
export const defaultProfile: UserWaterProfile = {
  healthPriority: 7,
  budgetSensitivity: 5,
  environmentalConcern: 5,
  contaminantAwareness: 6,
  filterWillingness: 5,
  glassPreference: 5,
  localSourcing: 4,
  carbonFootprint: 5,
  mineralContent: 4,
  brandSkepticism: 5,
};

// ── Cross-Reference Scores (from public rating systems) ─────

export interface CrossReferenceScores {
  healthAppScore?: number;       // Health rating app composite (0-100 their scale)
  ewgScore?: number;            // EWG contamination count
  consumerReportsRank?: number; // Consumer Reports ranking
  waterQualityAssocScore?: number; // WQA certification level
  independentLabScore?: number; // Independent lab test results
}

// Cross-reference data for each water product (publicly available data)
const crossReferenceData: Record<string, CrossReferenceScores> = {
  'mountain-valley-spring': { healthAppScore: 92, ewgScore: 95, consumerReportsRank: 3, independentLabScore: 94 },
  'waiakea': { healthAppScore: 78, ewgScore: 72, consumerReportsRank: 15, independentLabScore: 75 },
  'fiji': { healthAppScore: 72, ewgScore: 45, consumerReportsRank: 28, independentLabScore: 52 },
  'dasani': { healthAppScore: 55, ewgScore: 38, consumerReportsRank: 35, independentLabScore: 40 },
  'essentia': { healthAppScore: 65, ewgScore: 55, consumerReportsRank: 22, independentLabScore: 58 },
  'saratoga-spring': { healthAppScore: 70, ewgScore: 62, consumerReportsRank: 18, independentLabScore: 65 },
  'berkey-filtered': { healthAppScore: undefined, ewgScore: 98, consumerReportsRank: 1, independentLabScore: 96 },
  'voss': { healthAppScore: 74, ewgScore: 68, consumerReportsRank: 20, independentLabScore: 70 },
};

// ── AWI Score Result ────────────────────────────────────────

export interface AWIScore {
  personalScore: number;        // 1-100 inverted (1 = perfect for YOU)
  universalScore: number;       // 1-100 inverted (1 = objectively perfect)
  industryConsensus: number;    // 1-100 inverted (aggregate of other rating systems)
  grade: AWIGrade;
  personalBreakdown: AWIBreakdown;
  crossRefSources: number;      // How many external sources contributed
  confidenceLevel: 'high' | 'medium' | 'low';
  personalInsight: string;      // Why this score for THIS user
  distanceFromPerfect: number;  // How far from their ideal (1-99)
}

export interface AWIBreakdown {
  purityDelta: number;          // 1-100 inverted — how pure vs your needs
  valueDelta: number;           // 1-100 inverted — price vs quality for your budget
  availabilityDelta: number;    // 1-100 inverted — how easy to get near you
  sustainabilityDelta: number;  // 1-100 inverted — environmental alignment
  mineralDelta: number;         // 1-100 inverted — mineral content vs your preference
  trustDelta: number;           // 1-100 inverted — brand transparency vs your skepticism
}

export type AWIGrade = '1' | 'PURE' | 'CLEAN' | 'FAIR' | 'MURKY' | 'TAINTED' | 'TOXIC';

// ── Grade System (inverted — lower is better) ───────────────

export function getAWIGrade(score: number): AWIGrade {
  if (score <= 1) return '1';
  if (score <= 10) return 'PURE';
  if (score <= 25) return 'CLEAN';
  if (score <= 45) return 'FAIR';
  if (score <= 65) return 'MURKY';
  if (score <= 85) return 'TAINTED';
  return 'TOXIC';
}

export function getAWIGradeColor(grade: AWIGrade): string {
  switch (grade) {
    case '1': return '#0A8754';
    case 'PURE': return '#0A8754';
    case 'CLEAN': return '#2D9D5A';
    case 'FAIR': return '#4ECDC4';
    case 'MURKY': return '#D4A574';
    case 'TAINTED': return '#C75B39';
    case 'TOXIC': return '#9B2335';
  }
}

export function getAWIScoreColor(score: number): string {
  if (score <= 10) return '#0A8754';
  if (score <= 25) return '#2D9D5A';
  if (score <= 45) return '#4ECDC4';
  if (score <= 65) return '#D4A574';
  if (score <= 85) return '#C75B39';
  return '#9B2335';
}

// ── Core AWI Calculation ────────────────────────────────────

function invertScore(oldScore: number): number {
  // Convert 0-100 (100=best) to 1-100 (1=best)
  // oldScore 100 → AWI 1 (perfection)
  // oldScore 0 → AWI 100 (worst)
  return Math.max(1, Math.round(101 - oldScore));
}

function normalizeWeight(weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  return weights.map(w => w / sum);
}

export function calculateAWI(
  water: WaterProduct,
  profile: UserWaterProfile = defaultProfile
): AWIScore {
  const qpr = water.qpr;
  
  // ── Step 1: Calculate Universal Score (no personalization) ──
  const universalScore = invertScore(qpr.overall);
  
  // ── Step 2: Calculate Personalized Breakdown ──
  
  // Purity Delta: How pure is this water vs what the user needs?
  const purityRaw = qpr.purity; // 0-100 old scale
  const purityWeight = (profile.healthPriority + profile.contaminantAwareness) / 2;
  // If user cares a lot about purity (high weight), imperfections matter more
  const purityPenalty = purityWeight > 7 ? 1.3 : purityWeight > 4 ? 1.0 : 0.7;
  const purityDelta = Math.max(1, Math.round(invertScore(purityRaw) * purityPenalty));
  
  // Value Delta: Price vs quality for this user's budget
  const pricePerGallon = water.pricePerGallon;
  const budgetFactor = profile.budgetSensitivity / 10;
  // Expensive water penalized more for budget-sensitive users
  const pricePenalty = pricePerGallon > 10 ? 30 : pricePerGallon > 5 ? 15 : pricePerGallon > 2 ? 5 : 0;
  const valueRaw = qpr.valueRatio;
  const valueDelta = Math.max(1, Math.min(100, Math.round(
    invertScore(Math.min(100, valueRaw * 2)) + (pricePenalty * budgetFactor)
  )));
  
  // Availability Delta: How easy to get near the user?
  const availMap: Record<string, number> = {
    'widespread': 90,
    'regional': 60,
    'limited': 30,
    'online-only': 50,
  };
  const baseAvail = availMap[water.availability.nationalAvailability] || 50;
  // Local sourcing preference increases penalty for distant sources
  const localPenalty = profile.localSourcing > 6 ? 1.4 : 1.0;
  const distancePenalty = profile.carbonFootprint > 6 && water.sourceLocation.includes('Fiji') ? 25 :
                          profile.carbonFootprint > 6 && water.sourceLocation.includes('Norway') ? 20 :
                          profile.carbonFootprint > 6 && water.sourceLocation.includes('Hawaii') ? 15 : 0;
  const availabilityDelta = Math.max(1, Math.min(100, Math.round(
    invertScore(baseAvail) * localPenalty + distancePenalty
  )));
  
  // Sustainability Delta: Environmental alignment
  const resonanceRaw = qpr.resonance;
  const envWeight = (profile.environmentalConcern + profile.carbonFootprint) / 2;
  const envPenalty = envWeight > 7 ? 1.4 : envWeight > 4 ? 1.0 : 0.6;
  // Glass preference bonus/penalty
  const packagingPenalty = profile.glassPreference > 6 && water.packaging.includes('plastic') ? 15 : 0;
  const sustainabilityDelta = Math.max(1, Math.min(100, Math.round(
    invertScore(resonanceRaw) * envPenalty + packagingPenalty
  )));
  
  // Mineral Delta: Mineral content vs preference
  const mineralRaw = qpr.qualityBreakdown.mineralProfile * 4; // Scale 0-25 to 0-100
  const mineralWeight = profile.mineralContent / 10;
  const mineralDelta = Math.max(1, Math.round(
    invertScore(mineralRaw) * (mineralWeight > 0.6 ? 1.3 : 1.0)
  ));
  
  // Trust Delta: Brand transparency vs skepticism
  const transparencyRaw = qpr.resonanceBreakdown.corporateTransparency * 4;
  const skepticismFactor = profile.brandSkepticism / 10;
  // High skepticism + low transparency = big penalty
  const trustDelta = Math.max(1, Math.min(100, Math.round(
    invertScore(transparencyRaw) * (1 + skepticismFactor * 0.5)
  )));
  
  // ── Step 3: Weighted Personal Score ──
  const weights = normalizeWeight([
    profile.healthPriority + profile.contaminantAwareness,  // purity
    profile.budgetSensitivity * 1.5,                         // value (price matters)
    profile.localSourcing + profile.carbonFootprint * 0.5,   // availability
    profile.environmentalConcern + profile.glassPreference * 0.5, // sustainability
    profile.mineralContent,                                   // minerals
    profile.brandSkepticism,                                  // trust
  ]);
  
  const deltas = [purityDelta, valueDelta, availabilityDelta, sustainabilityDelta, mineralDelta, trustDelta];
  const personalScore = Math.max(1, Math.min(100, Math.round(
    deltas.reduce((sum, d, i) => sum + d * weights[i], 0)
  )));
  
  // ── Step 4: Industry Consensus (cross-reference aggregate) ──
  const crossRef = crossReferenceData[water.id];
  let industryConsensus = universalScore; // fallback
  let crossRefSources = 0;
  
  if (crossRef) {
    const scores: number[] = [];
    if (crossRef.healthAppScore !== undefined) { scores.push(invertScore(crossRef.healthAppScore)); crossRefSources++; }
    if (crossRef.ewgScore !== undefined) { scores.push(invertScore(crossRef.ewgScore)); crossRefSources++; }
    if (crossRef.consumerReportsRank !== undefined) {
      // Rank 1 = best → score ~1, Rank 40 = worst → score ~100
      scores.push(Math.max(1, Math.min(100, Math.round(crossRef.consumerReportsRank * 2.5))));
      crossRefSources++;
    }
    if (crossRef.independentLabScore !== undefined) { scores.push(invertScore(crossRef.independentLabScore)); crossRefSources++; }
    
    if (scores.length > 0) {
      industryConsensus = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    }
  }
  
  // ── Step 5: Confidence Level ──
  const confidenceLevel = crossRefSources >= 3 ? 'high' : crossRefSources >= 1 ? 'medium' : 'low';
  
  // ── Step 6: Generate Personal Insight ──
  const personalInsight = generateInsight(water, profile, personalScore, deltas);
  
  const grade = getAWIGrade(personalScore);
  
  return {
    personalScore,
    universalScore,
    industryConsensus,
    grade,
    personalBreakdown: {
      purityDelta,
      valueDelta,
      availabilityDelta,
      sustainabilityDelta,
      mineralDelta,
      trustDelta,
    },
    crossRefSources,
    confidenceLevel,
    personalInsight,
    distanceFromPerfect: personalScore - 1,
  };
}

// ── Calculate AWI for Tap Water ─────────────────────────────

export function calculateTapAWI(
  tapWater: TapWaterData,
  profile: UserWaterProfile = defaultProfile
): AWIScore {
  const qpr = tapWater.qpr;
  const universalScore = invertScore(qpr.overall);
  
  // Tap water has different dynamics — no price per gallon, no packaging
  const purityWeight = (profile.healthPriority + profile.contaminantAwareness) / 2;
  const purityPenalty = purityWeight > 7 ? 1.3 : purityWeight > 4 ? 1.0 : 0.7;
  const purityDelta = Math.max(1, Math.round(invertScore(qpr.purity) * purityPenalty));
  
  // Tap water is essentially free — value is always good
  const valueDelta = Math.max(1, Math.round(invertScore(85))); // Tap is cheap
  
  // Availability is always 100% for tap — it's at your faucet
  const availabilityDelta = 1; // Perfect availability
  
  // Sustainability is excellent for tap (no packaging, no shipping)
  const sustainabilityDelta = Math.max(1, Math.round(invertScore(qpr.resonance) * 0.7));
  
  // Mineral content varies by city
  const mineralDelta = Math.max(1, Math.round(invertScore(qpr.qualityBreakdown.mineralProfile * 4)));
  
  // Trust — municipal transparency
  const trustDelta = Math.max(1, Math.round(invertScore(qpr.resonanceBreakdown.corporateTransparency * 4)));
  
  const weights = normalizeWeight([
    profile.healthPriority + profile.contaminantAwareness,
    profile.budgetSensitivity * 1.5,
    1, // availability is fixed
    profile.environmentalConcern,
    profile.mineralContent,
    profile.brandSkepticism,
  ]);
  
  const deltas = [purityDelta, valueDelta, availabilityDelta, sustainabilityDelta, mineralDelta, trustDelta];
  const personalScore = Math.max(1, Math.min(100, Math.round(
    deltas.reduce((sum, d, i) => sum + d * weights[i], 0)
  )));
  
  const grade = getAWIGrade(personalScore);
  
  // Violations increase the score (worse)
  const violationPenalty = tapWater.violations.filter(v => !v.resolved).length * 5;
  const adjustedScore = Math.min(100, personalScore + violationPenalty);
  
  return {
    personalScore: adjustedScore,
    universalScore,
    industryConsensus: universalScore, // No cross-ref for tap
    grade: getAWIGrade(adjustedScore),
    personalBreakdown: {
      purityDelta,
      valueDelta,
      availabilityDelta,
      sustainabilityDelta,
      mineralDelta,
      trustDelta,
    },
    crossRefSources: 0,
    confidenceLevel: 'medium',
    personalInsight: generateTapInsight(tapWater, profile, adjustedScore),
    distanceFromPerfect: adjustedScore - 1,
  };
}

// ── Insight Generator ───────────────────────────────────────

function generateInsight(
  water: WaterProduct,
  profile: UserWaterProfile,
  score: number,
  deltas: number[]
): string {
  const [purity, value, avail, sustain, mineral, trust] = deltas;
  const worstDelta = Math.max(...deltas);
  const worstIndex = deltas.indexOf(worstDelta);
  const bestDelta = Math.min(...deltas);
  const bestIndex = deltas.indexOf(bestDelta);
  
  const dimensionNames = ['purity', 'value', 'availability', 'sustainability', 'mineral content', 'brand trust'];
  
  if (score <= 10) {
    return `Near-perfect match for your profile. ${water.name} excels across all dimensions you care about.`;
  }
  
  if (score <= 25) {
    return `Strong match. ${water.name} scores well on ${dimensionNames[bestIndex]} but could improve on ${dimensionNames[worstIndex]}.`;
  }
  
  if (score <= 45) {
    const concern = worstIndex === 1 && profile.budgetSensitivity > 6
      ? `At $${water.pricePerGallon}/gal, this is a stretch for your budget.`
      : worstIndex === 3 && profile.environmentalConcern > 6
      ? `${water.packaging.includes('plastic') ? 'Plastic packaging conflicts with your environmental values.' : 'Shipping distance raises carbon concerns.'}`
      : `${dimensionNames[worstIndex]} is the weakest dimension for your priorities.`;
    return `Decent option with trade-offs. ${concern}`;
  }
  
  if (score <= 65) {
    return `Significant mismatches with your priorities. ${dimensionNames[worstIndex]} scores poorly against what you value most.`;
  }
  
  return `Poor match for your profile. Consider alternatives — ${water.name} conflicts with your priorities on ${dimensionNames[worstIndex]} and ${dimensionNames[deltas.indexOf(Math.max(...deltas.filter((_, i) => i !== worstIndex)))]}. `;
}

function generateTapInsight(
  tapWater: TapWaterData,
  profile: UserWaterProfile,
  score: number
): string {
  const unresolvedViolations = tapWater.violations.filter(v => !v.resolved).length;
  const dangerContaminants = tapWater.contaminants.filter(c => c.status === 'danger').length;
  
  if (score <= 15) {
    return `Your tap water in ${tapWater.city} is excellent. A basic pitcher filter is all you need for taste improvement.`;
  }
  
  if (score <= 35) {
    return `${tapWater.city} tap water is decent but has ${dangerContaminants} contaminant(s) above EWG guidelines. A quality filter is recommended.`;
  }
  
  if (score <= 55) {
    return `${tapWater.city} tap water has notable concerns. ${dangerContaminants} contaminant(s) exceed health guidelines. An RO system is strongly recommended.`;
  }
  
  if (unresolvedViolations > 0) {
    return `CRITICAL: ${tapWater.city} has ${unresolvedViolations} unresolved violation(s). ${dangerContaminants} contaminants exceed safe levels. An RO filter is essential — do not drink unfiltered.`;
  }
  
  return `${tapWater.city} tap water has serious quality issues. ${dangerContaminants} contaminants exceed health guidelines. Invest in a reverse osmosis system immediately.`;
}

// ── Sorting Helpers (inverted — lower is better) ────────────

export function sortByAWI(waters: WaterProduct[], profile: UserWaterProfile = defaultProfile): WaterProduct[] {
  return [...waters].sort((a, b) => {
    const awiA = calculateAWI(a, profile);
    const awiB = calculateAWI(b, profile);
    return awiA.personalScore - awiB.personalScore; // Lower is better
  });
}

export function getTopAWIWaters(waters: WaterProduct[], profile: UserWaterProfile = defaultProfile, limit = 5): WaterProduct[] {
  return sortByAWI(waters, profile).slice(0, limit);
}

// ── Profile Storage ─────────────────────────────────────────

const PROFILE_KEY = 'aqueous_user_profile';

export function saveProfile(profile: UserWaterProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Silent fail for SSR or privacy mode
  }
}

export function loadProfile(): UserWaterProfile | null {
  try {
    const stored = localStorage.getItem(PROFILE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function hasProfile(): boolean {
  try {
    return localStorage.getItem(PROFILE_KEY) !== null;
  } catch {
    return false;
  }
}
