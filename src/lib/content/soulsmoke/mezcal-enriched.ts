// Ported from the SoulSmoke Manus app (client/src/data/mezcalEnriched.ts, exported 2026-11-10). Real content, unchanged.
/**
 * Enriched Mezcal Data — QPR, Food Pairing, Time-to-Glass, Rarity, Repeatability
 * 
 * This file extends the base Mezcal interface with new fields required by the
 * QPR Index and Discovery Engine.
 */

import type { Mezcal } from './mezcal-data';
import { allMezcals } from './mezcal-data';

// ── New Types ──

export type TimeToGlass = 'same-day' | '1-2-weeks' | '1-3-months' | '3-plus-months' | 'unknown';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'very-rare' | 'legendary';

export type Repeatability = 'continuous' | 'seasonal' | 'batch' | 'one-off' | 'extinct';

export type FoodPairingCategory =
  | 'Mole' | 'Seafood' | 'Grilled Meat' | 'Chocolate' | 'Cheese'
  | 'Citrus' | 'Spicy' | 'Fruit' | 'Smoke-Forward Dishes' | 'Dessert'
  | 'Charcuterie' | 'Sushi' | 'Tacos' | 'Ceviche' | 'Nuts'
  | 'Cocktails' | 'Neat Only' | 'Versatile';

export interface FoodPairing {
  category: FoodPairingCategory;
  confidence: 'proven' | 'suggested' | 'experimental';
}

export interface MezcalEnriched extends Mezcal {
  qpr: number; // Calculated by QPR engine
  timeToGlass: TimeToGlass;
  rarity: Rarity;
  repeatability: Repeatability;
  foodPairings: FoodPairing[];
}

// ── Enrichment Data Map ──
// Keyed by bottle ID, contains the new fields for each bottle

interface EnrichmentData {
  timeToGlass: TimeToGlass;
  rarity: Rarity;
  repeatability: Repeatability;
  foodPairings: FoodPairing[];
}

const enrichmentMap: Record<string, EnrichmentData> = {
  // ═══════════════════════════════════════════
  // US MARKET — THE GRAIL (High Value, High Experience)
  // ═══════════════════════════════════════════
  'us-1': { // Del Maguey Chichicapa
    timeToGlass: '1-2-weeks',
    rarity: 'uncommon',
    repeatability: 'seasonal',
    foodPairings: [
      { category: 'Mole', confidence: 'proven' },
      { category: 'Grilled Meat', confidence: 'proven' },
      { category: 'Cheese', confidence: 'suggested' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  'us-2': { // Del Maguey Vida
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'proven' },
      { category: 'Tacos', confidence: 'proven' },
      { category: 'Citrus', confidence: 'suggested' },
      { category: 'Versatile', confidence: 'proven' },
    ],
  },
  'us-3': { // Banhez Espadín/Barril
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'proven' },
      { category: 'Fruit', confidence: 'suggested' },
      { category: 'Tacos', confidence: 'proven' },
      { category: 'Versatile', confidence: 'proven' },
    ],
  },
  'us-4': { // Mezcal Union Joven
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'proven' },
      { category: 'Grilled Meat', confidence: 'suggested' },
      { category: 'Tacos', confidence: 'proven' },
    ],
  },
  'us-5': { // Bozal Ensamble
    timeToGlass: '1-2-weeks',
    rarity: 'uncommon',
    repeatability: 'seasonal',
    foodPairings: [
      { category: 'Mole', confidence: 'proven' },
      { category: 'Cheese', confidence: 'suggested' },
      { category: 'Chocolate', confidence: 'experimental' },
      { category: 'Neat Only', confidence: 'suggested' },
    ],
  },
  'us-6': { // Del Maguey Pechuga
    timeToGlass: '1-2-weeks',
    rarity: 'rare',
    repeatability: 'seasonal',
    foodPairings: [
      { category: 'Mole', confidence: 'proven' },
      { category: 'Fruit', confidence: 'proven' },
      { category: 'Chocolate', confidence: 'proven' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  'us-7': { // El Jolgorio Tobalá
    timeToGlass: '1-2-weeks',
    rarity: 'rare',
    repeatability: 'batch',
    foodPairings: [
      { category: 'Seafood', confidence: 'proven' },
      { category: 'Ceviche', confidence: 'proven' },
      { category: 'Fruit', confidence: 'suggested' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  'us-8': { // El Jolgorio Madrecuixe
    timeToGlass: '1-2-weeks',
    rarity: 'rare',
    repeatability: 'batch',
    foodPairings: [
      { category: 'Grilled Meat', confidence: 'proven' },
      { category: 'Spicy', confidence: 'suggested' },
      { category: 'Cheese', confidence: 'proven' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  'us-9': { // Vago Madrecuixe Aquilino
    timeToGlass: '1-2-weeks',
    rarity: 'uncommon',
    repeatability: 'batch',
    foodPairings: [
      { category: 'Grilled Meat', confidence: 'proven' },
      { category: 'Spicy', confidence: 'proven' },
      { category: 'Cheese', confidence: 'suggested' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  'us-10': { // Vago Cuixe Tío Rey
    timeToGlass: '1-3-months',
    rarity: 'very-rare',
    repeatability: 'batch',
    foodPairings: [
      { category: 'Mole', confidence: 'proven' },
      { category: 'Smoke-Forward Dishes', confidence: 'proven' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  // US MARKET — SKIP THESE (Low Value, Low Experience)
  'us-11': { // Casamigos Joven
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'proven' },
    ],
  },
  'us-12': { // Ilegal Joven
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'proven' },
      { category: 'Tacos', confidence: 'suggested' },
    ],
  },
  'us-13': { // Montelobos Espadín
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'proven' },
      { category: 'Smoke-Forward Dishes', confidence: 'suggested' },
    ],
  },
  'us-14': { // Sombra Espadín
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'proven' },
    ],
  },
  'us-15': { // Koch Elote
    timeToGlass: '1-2-weeks',
    rarity: 'uncommon',
    repeatability: 'seasonal',
    foodPairings: [
      { category: 'Grilled Meat', confidence: 'suggested' },
      { category: 'Tacos', confidence: 'proven' },
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
  'us-16': { // Clase Azul Mezcal
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
  'us-17': { // Dos Hombres Espadín
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'proven' },
    ],
  },
  'us-18': { // Monte Alban
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
  'us-19': { // Gusano Rojo
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
  // US MARKET — HIDDEN GEMS & OVERPRICED
  'us-20': { // Nuestra Soledad San Baltazar
    timeToGlass: '1-2-weeks',
    rarity: 'uncommon',
    repeatability: 'seasonal',
    foodPairings: [
      { category: 'Grilled Meat', confidence: 'proven' },
      { category: 'Smoke-Forward Dishes', confidence: 'proven' },
      { category: 'Cheese', confidence: 'suggested' },
      { category: 'Neat Only', confidence: 'suggested' },
    ],
  },
  'us-21': { // Vago Cuixe Emigdio Jarquín
    timeToGlass: '1-2-weeks',
    rarity: 'uncommon',
    repeatability: 'batch',
    foodPairings: [
      { category: 'Grilled Meat', confidence: 'proven' },
      { category: 'Spicy', confidence: 'suggested' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  'us-22': { // Vago Ensamble Salomón
    timeToGlass: '1-2-weeks',
    rarity: 'uncommon',
    repeatability: 'batch',
    foodPairings: [
      { category: 'Mole', confidence: 'proven' },
      { category: 'Grilled Meat', confidence: 'suggested' },
      { category: 'Cheese', confidence: 'proven' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  'us-23': { // Lalocura Espadín (Durango)
    timeToGlass: '1-2-weeks',
    rarity: 'uncommon',
    repeatability: 'seasonal',
    foodPairings: [
      { category: 'Seafood', confidence: 'proven' },
      { category: 'Fruit', confidence: 'proven' },
      { category: 'Ceviche', confidence: 'suggested' },
      { category: 'Versatile', confidence: 'proven' },
    ],
  },
  'us-24': { // Derrumbes Durango
    timeToGlass: '1-2-weeks',
    rarity: 'uncommon',
    repeatability: 'seasonal',
    foodPairings: [
      { category: 'Grilled Meat', confidence: 'proven' },
      { category: 'Spicy', confidence: 'proven' },
      { category: 'Smoke-Forward Dishes', confidence: 'proven' },
    ],
  },
  'us-25': { // Mal Bien Espadín
    timeToGlass: '1-2-weeks',
    rarity: 'uncommon',
    repeatability: 'batch',
    foodPairings: [
      { category: 'Grilled Meat', confidence: 'proven' },
      { category: 'Cheese', confidence: 'suggested' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },

  // ═══════════════════════════════════════════
  // MEXICO MARKET
  // ═══════════════════════════════════════════
  'mx-1': { // Real Minero Espadín
    timeToGlass: '1-3-months',
    rarity: 'rare',
    repeatability: 'seasonal',
    foodPairings: [
      { category: 'Mole', confidence: 'proven' },
      { category: 'Seafood', confidence: 'proven' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  'mx-2': { // Real Minero Largo
    timeToGlass: '3-plus-months',
    rarity: 'legendary',
    repeatability: 'one-off',
    foodPairings: [
      { category: 'Neat Only', confidence: 'proven' },
      { category: 'Chocolate', confidence: 'experimental' },
    ],
  },
  'mx-3': { // Tres Colibrí Capón
    timeToGlass: '3-plus-months',
    rarity: 'very-rare',
    repeatability: 'batch',
    foodPairings: [
      { category: 'Mole', confidence: 'proven' },
      { category: 'Chocolate', confidence: 'suggested' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  'mx-4': { // Mezcaloteca Tobalá
    timeToGlass: '1-3-months',
    rarity: 'rare',
    repeatability: 'batch',
    foodPairings: [
      { category: 'Seafood', confidence: 'proven' },
      { category: 'Ceviche', confidence: 'proven' },
      { category: 'Fruit', confidence: 'proven' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  'mx-5': { // 5 Sentidos Jabalí
    timeToGlass: '1-3-months',
    rarity: 'rare',
    repeatability: 'batch',
    foodPairings: [
      { category: 'Cheese', confidence: 'proven' },
      { category: 'Charcuterie', confidence: 'proven' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  'mx-6': { // Real Minero Tobalá
    timeToGlass: '3-plus-months',
    rarity: 'very-rare',
    repeatability: 'batch',
    foodPairings: [
      { category: 'Neat Only', confidence: 'proven' },
      { category: 'Fruit', confidence: 'suggested' },
      { category: 'Chocolate', confidence: 'experimental' },
    ],
  },
  'mx-7': { // 5 Sentidos Sierra Negra
    timeToGlass: '1-3-months',
    rarity: 'very-rare',
    repeatability: 'batch',
    foodPairings: [
      { category: 'Grilled Meat', confidence: 'proven' },
      { category: 'Spicy', confidence: 'proven' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  'mx-8': { // Real Minero Arroqueño
    timeToGlass: '3-plus-months',
    rarity: 'very-rare',
    repeatability: 'batch',
    foodPairings: [
      { category: 'Mole', confidence: 'proven' },
      { category: 'Neat Only', confidence: 'proven' },
      { category: 'Chocolate', confidence: 'suggested' },
    ],
  },
  'mx-9': { // Mezcaloteca Coyote
    timeToGlass: '1-3-months',
    rarity: 'rare',
    repeatability: 'batch',
    foodPairings: [
      { category: 'Grilled Meat', confidence: 'proven' },
      { category: 'Spicy', confidence: 'proven' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  'mx-10': { // Real Minero Pechuga de Mole
    timeToGlass: '3-plus-months',
    rarity: 'legendary',
    repeatability: 'one-off',
    foodPairings: [
      { category: 'Mole', confidence: 'proven' },
      { category: 'Chocolate', confidence: 'proven' },
      { category: 'Spicy', confidence: 'proven' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  'mx-11': { // Wahaka Espadín
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'proven' },
      { category: 'Tacos', confidence: 'suggested' },
    ],
  },
  'mx-12': { // Alipús San Andrés
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'proven' },
      { category: 'Tacos', confidence: 'proven' },
      { category: 'Versatile', confidence: 'suggested' },
    ],
  },
  'mx-13': { // Alipús Reposado
    timeToGlass: 'same-day',
    rarity: 'uncommon',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
  'mx-14': { // Zignum Silver
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
  'mx-15': { // Bruxo No. 1
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'proven' },
      { category: 'Tacos', confidence: 'suggested' },
    ],
  },
  'mx-16': { // Gusano Rojo (Mexico)
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
  'mx-17': { // Monte Alban (Mexico)
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
  'mx-18': { // Scorpion Mezcal (Mexico)
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
  'mx-19': { // Crema de Mezcal
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Dessert', confidence: 'suggested' },
    ],
  },
  'mx-20': { // Beneva Espadín
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
  // Mexico Hidden Gems
  'mx-21': { // 5 Sentidos Coyote
    timeToGlass: '1-3-months',
    rarity: 'rare',
    repeatability: 'batch',
    foodPairings: [
      { category: 'Grilled Meat', confidence: 'proven' },
      { category: 'Spicy', confidence: 'proven' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  'mx-22': { // 5 Sentidos Madrecuixe Eduardo
    timeToGlass: '1-3-months',
    rarity: 'rare',
    repeatability: 'batch',
    foodPairings: [
      { category: 'Grilled Meat', confidence: 'proven' },
      { category: 'Cheese', confidence: 'proven' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  'mx-23': { // Mezcaloteca Barril
    timeToGlass: '1-3-months',
    rarity: 'rare',
    repeatability: 'batch',
    foodPairings: [
      { category: 'Mole', confidence: 'proven' },
      { category: 'Fruit', confidence: 'suggested' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  'mx-24': { // Mezcaloteca Cuishe
    timeToGlass: '1-3-months',
    rarity: 'rare',
    repeatability: 'batch',
    foodPairings: [
      { category: 'Grilled Meat', confidence: 'proven' },
      { category: 'Spicy', confidence: 'suggested' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  'mx-25': { // Real Minero Cuixe
    timeToGlass: '3-plus-months',
    rarity: 'very-rare',
    repeatability: 'batch',
    foodPairings: [
      { category: 'Neat Only', confidence: 'proven' },
      { category: 'Spicy', confidence: 'proven' },
      { category: 'Smoke-Forward Dishes', confidence: 'proven' },
    ],
  },

  // ═══════════════════════════════════════════
  // FANE KANTSINI COLLECTION
  // ═══════════════════════════════════════════
  'mx-26': { // Fane Kantsini Chuparrosas
    timeToGlass: '3-plus-months',
    rarity: 'legendary',
    repeatability: 'one-off',
    foodPairings: [
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  'mx-27': { // Fane Kantsini Pelón Verde
    timeToGlass: '3-plus-months',
    rarity: 'very-rare',
    repeatability: 'batch',
    foodPairings: [
      { category: 'Grilled Meat', confidence: 'proven' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  'mx-28': { // Fane Kantsini Tobalá
    timeToGlass: '3-plus-months',
    rarity: 'very-rare',
    repeatability: 'batch',
    foodPairings: [
      { category: 'Seafood', confidence: 'proven' },
      { category: 'Fruit', confidence: 'suggested' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  'mx-29': { // Fane Kantsini Madre Cuishe
    timeToGlass: '3-plus-months',
    rarity: 'very-rare',
    repeatability: 'batch',
    foodPairings: [
      { category: 'Grilled Meat', confidence: 'proven' },
      { category: 'Spicy', confidence: 'suggested' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  'mx-30': { // Fane Kantsini Tepeztate
    timeToGlass: '3-plus-months',
    rarity: 'very-rare',
    repeatability: 'one-off',
    foodPairings: [
      { category: 'Mole', confidence: 'proven' },
      { category: 'Spicy', confidence: 'proven' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  'mx-31': { // Fane Kantsini Chato
    timeToGlass: '3-plus-months',
    rarity: 'very-rare',
    repeatability: 'batch',
    foodPairings: [
      { category: 'Grilled Meat', confidence: 'proven' },
      { category: 'Cheese', confidence: 'suggested' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },
  'mx-32': { // Fane Kantsini Coyote
    timeToGlass: '3-plus-months',
    rarity: 'very-rare',
    repeatability: 'batch',
    foodPairings: [
      { category: 'Grilled Meat', confidence: 'proven' },
      { category: 'Spicy', confidence: 'proven' },
      { category: 'Neat Only', confidence: 'proven' },
    ],
  },

  // ═══════════════════════════════════════════
  // SKIP THESE — Celebrity & Industrial
  // ═══════════════════════════════════════════
  'skip-1': { // Casamigos Mezcal
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
  'skip-2': { // Clase Azul Mezcal
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
  'skip-3': { // Dos Hombres
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
  'skip-4': { // Gusano Rojo (Skip)
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
  'skip-5': { // Monte Alban (Skip)
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
  'skip-6': { // Scorpion Mezcal (Skip)
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
  'skip-7': { // Saldo Joven
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
  'skip-8': { // Zignum Silver (Skip)
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
  'skip-9': { // Bozal Cuixe
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'proven' },
      { category: 'Tacos', confidence: 'suggested' },
    ],
  },
  'skip-10': { // Ilegal Joven (Skip)
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'proven' },
    ],
  },
  'skip-11': { // Ojo de Tigre
    timeToGlass: '1-2-weeks',
    rarity: 'uncommon',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
  'skip-12': { // Marca Negra Espadín
    timeToGlass: '1-2-weeks',
    rarity: 'uncommon',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
  'skip-13': { // Ilegal Añejo
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Dessert', confidence: 'suggested' },
    ],
  },
  'skip-14': { // Meteoro Espadín
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'proven' },
      { category: 'Grilled Meat', confidence: 'suggested' },
    ],
  },
  'skip-15': { // Gem & Bolt
    timeToGlass: '1-2-weeks',
    rarity: 'uncommon',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
  'skip-16': { // Koch Espadín
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'proven' },
      { category: 'Tacos', confidence: 'suggested' },
    ],
  },
  'skip-17': { // Ilegal Reposado
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'proven' },
    ],
  },
  'skip-18': { // Mezcal Amarás Cupreata
    timeToGlass: '1-2-weeks',
    rarity: 'uncommon',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'proven' },
      { category: 'Versatile', confidence: 'suggested' },
    ],
  },
  'skip-19': { // Banhez Reposado
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'proven' },
    ],
  },
  'skip-20': { // Ilegal Pechuga
    timeToGlass: '1-2-weeks',
    rarity: 'uncommon',
    repeatability: 'seasonal',
    foodPairings: [
      { category: 'Fruit', confidence: 'suggested' },
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
  'skip-21': { // Derrumbes Oaxaca
    timeToGlass: '1-2-weeks',
    rarity: 'uncommon',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'proven' },
      { category: 'Tacos', confidence: 'suggested' },
    ],
  },
  'skip-22': { // Yuu Baal
    timeToGlass: '1-2-weeks',
    rarity: 'uncommon',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
  'skip-23': { // Peloton de la Muerte
    timeToGlass: '1-2-weeks',
    rarity: 'uncommon',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'proven' },
    ],
  },
  'skip-24': { // Gracias a Dios
    timeToGlass: 'same-day',
    rarity: 'common',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
  'skip-25': { // Marca Negra Espadin (duplicate check)
    timeToGlass: '1-2-weeks',
    rarity: 'uncommon',
    repeatability: 'continuous',
    foodPairings: [
      { category: 'Cocktails', confidence: 'suggested' },
    ],
  },
};

// ── Default enrichment for any bottle not explicitly mapped ──
const defaultEnrichment: EnrichmentData = {
  timeToGlass: 'unknown',
  rarity: 'common',
  repeatability: 'continuous',
  foodPairings: [{ category: 'Versatile', confidence: 'experimental' }],
};

// ── Build Enriched Data ──
import { calculateQPR } from './qpr-engine';

export function enrichAllMezcals(): MezcalEnriched[] {
  // First pass: create enriched bottles without QPR
  const enriched: MezcalEnriched[] = allMezcals.map(bottle => {
    const data = enrichmentMap[bottle.id] ?? defaultEnrichment;
    return {
      ...bottle,
      qpr: 0, // placeholder
      timeToGlass: data.timeToGlass,
      rarity: data.rarity,
      repeatability: data.repeatability,
      foodPairings: data.foodPairings,
    };
  });

  // Second pass: calculate QPR (needs all bottles for peer comparison)
  for (const bottle of enriched) {
    bottle.qpr = calculateQPR(bottle, allMezcals, 'us');
  }

  return enriched;
}

// Singleton cache
let _enrichedCache: MezcalEnriched[] | null = null;

export function getAllEnrichedMezcals(): MezcalEnriched[] {
  if (!_enrichedCache) {
    _enrichedCache = enrichAllMezcals();
  }
  return _enrichedCache;
}

// Get unique food pairing categories from all bottles
export function getAllFoodPairingCategories(): FoodPairingCategory[] {
  const categories = new Set<FoodPairingCategory>();
  const enriched = getAllEnrichedMezcals();
  for (const bottle of enriched) {
    for (const pairing of bottle.foodPairings) {
      categories.add(pairing.category);
    }
  }
  return Array.from(categories).sort();
}

// Get enriched mezcal by brand and expression/name
export function getEnrichedMezcalByBrandExpression(brand: string, expression: string): MezcalEnriched | undefined {
  const enriched = getAllEnrichedMezcals();
  return enriched.find(b => 
    b.brand.toLowerCase() === brand.toLowerCase() && 
    (b.name.toLowerCase() === expression.toLowerCase() ||
     b.name.toLowerCase().includes(expression.toLowerCase()) ||
     expression.toLowerCase().includes(b.name.toLowerCase()))
  );
}
