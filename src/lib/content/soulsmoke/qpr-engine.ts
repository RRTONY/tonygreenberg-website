// Ported from the SoulSmoke Manus app (client/src/data/qprEngine.ts, exported 2026-11-10). Real content, unchanged.
/**
 * QPR (Quality-Price Ratio) Index Engine
 * 
 * A 5-component weighted formula that produces a 1.0-10.0 score:
 *   QPR = (E × 0.35) + (P × 0.25) + (A × 0.15) + (I × 0.15) + (R × 0.10)
 * 
 * Components:
 *   E = Experience Score (from EEI)
 *   P = Price Fairness (vs peer group median)
 *   A = Availability Factor (can you get it?)
 *   I = Production Integrity (method + batch size + tradition)
 *   R = Repeatability (can you buy it again?)
 */

import type { Mezcal } from './mezcal-data';
import type { MezcalEnriched, TimeToGlass, Rarity, Repeatability } from './mezcal-enriched';

// ── Component Weights ──
const WEIGHT_EXPERIENCE = 0.35;
const WEIGHT_PRICE_FAIRNESS = 0.25;
const WEIGHT_AVAILABILITY = 0.15;
const WEIGHT_INTEGRITY = 0.15;
const WEIGHT_REPEATABILITY = 0.10;

// ── Experience Score (E) ──
// Direct mapping from EEI — the sensory backbone
function calcExperience(eei: number): number {
  return Math.max(1, Math.min(10, eei));
}

// ── Price Fairness (P) ──
// Compares bottle price to peer group median (same agave + method + market)
function calcPriceFairness(bottle: Mezcal, allBottles: Mezcal[]): number {
  // Find peer group: same agave type, same method, same market
  const peers = allBottles.filter(b =>
    b.agave === bottle.agave &&
    b.method === bottle.method &&
    b.id !== bottle.id
  );

  // If no peers in exact match, broaden to same method only
  const peerGroup = peers.length >= 2 ? peers : allBottles.filter(b =>
    b.method === bottle.method &&
    b.id !== bottle.id
  );

  if (peerGroup.length === 0) return 5.0; // No peers = fair by default

  const prices = peerGroup.map(b => b.price).sort((a, b) => a - b);
  const median = prices.length % 2 === 0
    ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
    : prices[Math.floor(prices.length / 2)];

  const ratio = median / bottle.price;
  return Math.max(1, Math.min(10, ratio * 5));
}

// ── Availability Factor (A) ──
const AVAILABILITY_BASE: Record<string, number> = {
  'easy': 9.0,
  'moderate': 7.0,
  'hard': 5.0,
  'rare': 3.0,
  'unicorn': 1.5,
};

function calcAvailability(bottle: Mezcal, userMarket: 'us' | 'mexico' = 'us'): number {
  let score = AVAILABILITY_BASE[bottle.availability] ?? 5.0;

  // Penalize bottles that are only available in the other market
  if (userMarket === 'us' && bottle.market === 'mexico') {
    const penalties: Record<string, number> = {
      'hard': -1.0,
      'rare': -1.5,
      'unicorn': -2.0,
    };
    score += (penalties[bottle.availability] ?? 0);
  }

  return Math.max(1, Math.min(10, score));
}

// ── Production Integrity (I) ──
const METHOD_SCORES: Record<string, number> = {
  'ancestral': 3.5,
  'artisanal': 2.0,
  'industrial': 0.5,
};

const LOT_SCORES: Record<string, number> = {
  'micro': 3.0,
  'small': 2.0,
  'medium': 1.5,
  'large': 1.0,
  'industrial': 0.0,
};

function calcIntegrity(bottle: Mezcal): number {
  const methodScore = METHOD_SCORES[bottle.method] ?? 2.0;
  const lotScore = LOT_SCORES[bottle.lotSize ?? 'medium'] ?? 1.5;
  const allocationBonus = bottle.allocationOnly ? 1.0 : 0;

  // Raw sum ranges from 0.5 (industrial+industrial+no) to 7.5 (ancestral+micro+allocation)
  // Normalize to 1-10 scale
  const raw = methodScore + lotScore + allocationBonus;
  return Math.max(1, Math.min(10, (raw / 7.5) * 9 + 1));
}

// ── Repeatability (R) ──
const REPEATABILITY_SCORES: Record<Repeatability, number> = {
  'continuous': 9.0,
  'seasonal': 7.0,
  'batch': 5.0,
  'one-off': 3.0,
  'extinct': 1.0,
};

function calcRepeatability(repeatability: Repeatability): number {
  return REPEATABILITY_SCORES[repeatability] ?? 5.0;
}

// ── Main QPR Calculation ──
export function calculateQPR(
  bottle: MezcalEnriched,
  allBottles: Mezcal[],
  userMarket: 'us' | 'mexico' = 'us'
): number {
  const E = calcExperience(bottle.eei);
  const P = calcPriceFairness(bottle, allBottles);
  const A = calcAvailability(bottle, userMarket);
  const I = calcIntegrity(bottle);
  const R = calcRepeatability(bottle.repeatability);

  const qpr = (E * WEIGHT_EXPERIENCE) +
    (P * WEIGHT_PRICE_FAIRNESS) +
    (A * WEIGHT_AVAILABILITY) +
    (I * WEIGHT_INTEGRITY) +
    (R * WEIGHT_REPEATABILITY);

  return Math.round(qpr * 10) / 10; // Round to 1 decimal
}

// ── QPR Component Breakdown (for transparency display) ──
export interface QPRBreakdown {
  qpr: number;
  experience: number;
  priceFairness: number;
  availability: number;
  integrity: number;
  repeatability: number;
}

export function getQPRBreakdown(
  bottle: MezcalEnriched,
  allBottles: Mezcal[],
  userMarket: 'us' | 'mexico' = 'us'
): QPRBreakdown {
  const experience = Math.round(calcExperience(bottle.eei) * 10) / 10;
  const priceFairness = Math.round(calcPriceFairness(bottle, allBottles) * 10) / 10;
  const availability = Math.round(calcAvailability(bottle, userMarket) * 10) / 10;
  const integrity = Math.round(calcIntegrity(bottle) * 10) / 10;
  const repeatability = Math.round(calcRepeatability(bottle.repeatability) * 10) / 10;

  const qpr = Math.round(
    (experience * WEIGHT_EXPERIENCE) +
    (priceFairness * WEIGHT_PRICE_FAIRNESS) +
    (availability * WEIGHT_AVAILABILITY) +
    (integrity * WEIGHT_INTEGRITY) +
    (repeatability * WEIGHT_REPEATABILITY)
  * 10) / 10;

  return { qpr, experience, priceFairness, availability, integrity, repeatability };
}

// ── QPR Label ──
export function getQPRLabel(qpr: number): { label: string; color: string; description: string } {
  if (qpr >= 8.5) return { label: 'Extraordinary Value', color: '#22c55e', description: 'Stop reading. Go buy this. Now.' };
  if (qpr >= 7.0) return { label: 'Strong Value', color: '#84cc16', description: 'Delivers well above its price point' };
  if (qpr >= 5.5) return { label: 'Fair', color: '#eab308', description: 'You get what you pay for' };
  if (qpr >= 4.0) return { label: 'Questionable', color: '#f97316', description: 'The math doesn\'t add up' };
  return { label: 'Avoid', color: '#ef4444', description: 'You\'re paying for marketing, not mezcal' };
}

// ── Rarity Label ──
export function getRarityLabel(rarity: Rarity): { label: string; icon: string } {
  switch (rarity) {
    case 'common': return { label: 'Common', icon: '●' };
    case 'uncommon': return { label: 'Uncommon', icon: '◆' };
    case 'rare': return { label: 'Rare', icon: '★' };
    case 'very-rare': return { label: 'Very Rare', icon: '✦' };
    case 'legendary': return { label: 'Legendary', icon: '♛' };
    default: return { label: 'Unknown', icon: '○' };
  }
}

// ── Time to Glass Label ──
export function getTimeToGlassLabel(ttg: TimeToGlass): string {
  switch (ttg) {
    case 'same-day': return 'Same Day';
    case '1-2-weeks': return '1-2 Weeks';
    case '1-3-months': return '1-3 Months';
    case '3-plus-months': return '3+ Months';
    case 'unknown': return 'Unknown';
    default: return 'Unknown';
  }
}
