// Retailer prices for Sake for Sake's Sake (QPR Rankings badges, deal alerts), from the Sake Manus
// app's server/routers/priceAlerts.ts. The app had no price feed: it said "simulated live price data"
// and made up a new random price (±8%) and a random in-stock flag (85%) for 12 sakes on every request,
// so the same page showed different "live" prices on each visit. Here the numbers are deterministic:
// each retailer's price is the sake's base price times that retailer's markup (the app's own figures,
// without the random part), all marked `estimated`. Once the site owner records real observations
// (recordPriceSnapshot in src/app/sake/actions.ts, table sake_price_snapshots), those win.

export type RetailerSource = { id: string; name: string; url: string; markup: number };

export const RETAILER_SOURCES: RetailerSource[] = [
  { id: "tippsy", name: "Tippsy", url: "https://www.tippsysake.com", markup: 1.0 },
  { id: "true-sake", name: "True Sake", url: "https://www.truesake.com", markup: 1.05 },
  { id: "sakaya", name: "Sakaya NYC", url: "https://sakayanyc.com", markup: 1.08 },
  { id: "sake-social", name: "Sake Social", url: "https://www.sakesocial.com", markup: 0.98 },
  { id: "mitsuwa", name: "Mitsuwa Marketplace", url: "https://www.mitsuwa.com", markup: 0.85 },
  { id: "hmart", name: "H Mart", url: "https://www.hmart.com", markup: 0.88 },
  { id: "wine-com", name: "Wine.com", url: "https://www.wine.com", markup: 1.12 },
  { id: "drizly", name: "Drizly", url: "https://drizly.com", markup: 1.15 },
];

/** Base US prices the app priced from (matches its qprData.ts at the time). */
export const BASE_PRICES: Record<string, number> = {
  "born-gold": 38,
  "tedorigawa-silver": 22,
  "masumi-okuden": 28,
  "hakkaisan-tokubetsu": 32,
  "kubota-manju": 85,
  "dassai-23": 95,
  "juyondai-honmaru": 250,
  "kokuryu-ryu": 45,
  "dewazakura-oka": 30,
  "suigei-tokubetsu": 25,
  "nanbu-bijin-tokubetsu": 28,
  "tengumai-yamahai": 35,
};

export type LivePriceSummary = {
  lowestPrice: number | null;
  lowestRetailer: string;
  priceDiffPct: number;
  inStockCount: number;
  /** True when the price is the base-times-markup estimate, false when it's a recorded observation. */
  estimated: boolean;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

/** The app's getAllLivePrices shape for one sake, from the base price (no recorded observations). */
export function estimatedSummary(basePrice: number): LivePriceSummary {
  const prices = RETAILER_SOURCES.map((r) => ({ name: r.name, price: round2(basePrice * r.markup) }));
  const lowest = prices.reduce((min, p) => (p.price < min.price ? p : min), prices[0]);
  return {
    lowestPrice: lowest.price,
    lowestRetailer: lowest.name,
    priceDiffPct: Math.round(((lowest.price - basePrice) / basePrice) * 100),
    inStockCount: prices.length,
    estimated: true,
  };
}

export type Observation = { sake_id: string; retailer_name: string; price: number | string; in_stock: boolean };

/** Lowest in-stock recorded price for a sake (latest observation per retailer, newest first in `rows`). */
export function observedSummary(basePrice: number | undefined, rows: Observation[]): LivePriceSummary {
  const latest = new Map<string, Observation>();
  for (const row of rows) if (!latest.has(row.retailer_name)) latest.set(row.retailer_name, row);
  const inStock = [...latest.values()].filter((r) => r.in_stock).map((r) => ({ name: r.retailer_name, price: Number(r.price) }));
  if (inStock.length === 0) return { lowestPrice: null, lowestRetailer: "", priceDiffPct: 0, inStockCount: 0, estimated: false };
  const lowest = inStock.reduce((min, p) => (p.price < min.price ? p : min), inStock[0]);
  return {
    lowestPrice: round2(lowest.price),
    lowestRetailer: lowest.name,
    priceDiffPct: basePrice ? Math.round(((lowest.price - basePrice) / basePrice) * 100) : 0,
    inStockCount: inStock.length,
    estimated: false,
  };
}
