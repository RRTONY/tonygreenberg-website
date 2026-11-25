/**
 * Shop Data — frontend-accessible product catalog
 * Dynamically generates products from the full qprData database
 */

import { qprSakeDatabase } from "@/lib/content/sake/qpr-data";

export interface SakeProduct {
  id: string;
  name: string;
  nameJa: string;
  description: string;
  priceCents: number;
  bottleSizeMl: number;
  type: string;
  prefecture: string;
  available: boolean;
}

export const SAKE_PRODUCTS: SakeProduct[] = qprSakeDatabase.map(sake => ({
  id: sake.id,
  name: sake.name,
  nameJa: sake.nameJa,
  description: sake.description,
  priceCents: Math.round(sake.priceUS * 100),
  bottleSizeMl: 720,
  type: sake.type,
  prefecture: sake.prefecture,
  available: sake.priceUS > 0,
}));

export function getProduct(id: string): SakeProduct | undefined {
  return SAKE_PRODUCTS.find(p => p.id === id);
}

export function getAvailableProducts(): SakeProduct[] {
  return SAKE_PRODUCTS.filter(p => p.available);
}

export const SHIPPING_RATE_CENTS = 999;
export const FREE_SHIPPING_THRESHOLD_CENTS = 7500;
