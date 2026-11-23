// Aqueous products and pricing, ported unchanged from the Aqueous Manus app's server/products.ts
// (exported 2026-11-24). Shared by the Pricing page and the server checkout.

export const AQUEOUS_PRODUCTS = {
  /** One-time personalized AWI report — $20 (or $15 with referral credit) */
  report: {
    name: "Personalized AWI Water Report",
    description:
      "Your unique Aqueous Water Index report — personalized rankings, contaminant analysis, and recommendations based on your profile.",
    priceInCents: 2000,
    mode: "payment" as const,
  },
  /** Monthly subscription — $5/mo for ongoing insights */
  subscription: {
    name: "Aqueous Monthly Insights",
    description:
      "Monthly water intelligence — updated rankings, new water reviews, contaminant alerts, and early access to features.",
    priceInCents: 500,
    mode: "subscription" as const,
    interval: "month" as const,
  },
} as const;

export type AqueousProductType = keyof typeof AQUEOUS_PRODUCTS;

/** Sign-ups a referrer needs for the free report (the app's threshold). */
export const FREE_REPORT_SIGNUPS = 10;

/** Subscription statuses that count as an active plan. */
export const ACTIVE_SUBSCRIPTION_STATUSES = ["active", "trialing"];
