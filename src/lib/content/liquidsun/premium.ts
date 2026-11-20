// LiquidSun Premium plans and feature lists, ported unchanged from the LiquidSun Manus app's
// server/stripe/products.ts (2026-11-21). Shared by the /liquid-sun/premium page and the Stripe
// helpers (src/lib/stripe.ts); prices are in cents.

export type LiquidsunPlan = "monthly" | "annual";

export const PREMIUM_PRODUCT = {
  name: "LiquidSun Premium",
  description:
    "Unlock buy links, panel scores, the full Flavor Matrix, price alerts, and community ratings. Support independent tequila journalism.",
};

export const PREMIUM_PRICES = {
  monthly: { amount: 999, currency: "usd", interval: "month", label: "$9.99/mo", lookupKey: "liquidsun_premium_monthly" },
  annual: {
    amount: 7999,
    currency: "usd",
    interval: "year",
    label: "$79.99/yr",
    savings: "Save 33%",
    lookupKey: "liquidsun_premium_annual",
  },
} as const;

export const PREMIUM_FEATURES = [
  "Real buy links with live pricing from 3+ retailers",
  "CRT panel scores and community ratings",
  "Full Flavor Matrix with advanced filtering",
  "Price drop alerts on your favorite bottles",
  "Unlimited tasting journal entries",
  "Early access to new bottle reviews",
  "Ad-free browsing experience",
  "Support independent tequila journalism",
];

export const FREE_FEATURES = [
  "Browse the curated collection",
  "Read distillery profiles and stories",
  "Flavor tags and descriptions",
  "The Manifesto and editorial content",
  "Limited Flavor Matrix access",
];

/** Subscription statuses that count as Premium (the app checked `status === "active"`; a trial counts too). */
export const PREMIUM_STATUSES = ["active", "trialing"];
