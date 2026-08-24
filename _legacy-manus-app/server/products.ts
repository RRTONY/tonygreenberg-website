/**
 * Stripe product definitions — single source of truth.
 * Prices are in cents (USD). Stripe creates products on-the-fly
 * via checkout session line_items with price_data.
 */

export interface Product {
  key: string;
  name: string;
  description: string;
  priceCents: number;
  mode: "payment" | "subscription";
  /** For subscriptions only */
  interval?: "month" | "year";
}

export const PRODUCTS: Record<string, Product> = {
  // ── Blog Access (paywall for posts beyond the first 20) ──
  "blog-access": {
    key: "blog-access",
    name: "Full Blog Access",
    description: "Unlimited access to all 105+ essays by Tony Greenberg. One-time purchase, lifetime access.",
    priceCents: 999,
    mode: "payment",
  },

  // ── Shop: Digital Products ──
  "essay-archive": {
    key: "essay-archive",
    name: "The Complete Essay Archive",
    description: "91 essays spanning enterprise technology, psychedelic medicine, tokenized impact, payments infrastructure, and consciousness. Twenty-five years of pattern recognition, distilled.",
    priceCents: 2700,
    mode: "payment",
  },
  "regenerative-playbook": {
    key: "regenerative-playbook",
    name: "The Regenerative Business Playbook",
    description: "The extractive-to-regenerative framework applied to real companies. Case studies, stress tests, and the architecture for building businesses that compound value.",
    priceCents: 4700,
    mode: "payment",
  },
  "vendor-intel-brief": {
    key: "vendor-intel-brief",
    name: "The Vendor Intelligence Brief",
    description: "Selected findings from the RampRate SPY Index. How to negotiate with enterprise technology vendors when you don't have a million data points.",
    priceCents: 9700,
    mode: "payment",
  },

  // ── Subscribe: Paid Membership ──
  "membership-yearly": {
    key: "membership-yearly",
    name: "Paid Membership — The Throughline",
    description: "Early access to essays, quarterly Q&A with Tony, ImpactSoul deal flow briefings, compiled collections before public release, and 'Tip Me Off' community access.",
    priceCents: 9900,
    mode: "subscription",
    interval: "year",
  },

  // ── Subscribe: Essay Compilation ──
  "essay-compilation": {
    key: "essay-compilation",
    name: "The Essay Compilation",
    description: "The top 25 essays compiled, sequenced, and annotated. The extractive economy explained. The regenerative alternative mapped.",
    priceCents: 2700,
    mode: "payment",
  },

  // ── Diamond Cut Tiers ──
  "diamond-rough-cut": {
    key: "diamond-rough-cut",
    name: "Diamond Cut — Rough Cut",
    description: "Diamond identification + CXO lens assessment. Written output: is there a product here? Engagements begin with a scoping conversation.",
    priceCents: 500000,
    mode: "payment",
  },
  "diamond-full-cut": {
    key: "diamond-full-cut",
    name: "Diamond Cut — Full Cut",
    description: "All 5 cuts: product architecture map, 3 BD introductions, written deliverable. $10,000 floor.",
    priceCents: 1000000,
    mode: "payment",
  },
  "diamond-monthly-polish": {
    key: "diamond-monthly-polish",
    name: "Diamond Cut — Monthly Polish",
    description: "Ongoing product refinement, active BD pipeline, CXO translation on demand, ImpactSoul alignment. $15,000/month.",
    priceCents: 1500000,
    mode: "subscription",
    interval: "month",
  },
};

export { FREE_BLOG_POST_COUNT } from "../shared/stripe";
