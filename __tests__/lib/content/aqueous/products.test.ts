import { describe, expect, it } from "vitest";
import { ACTIVE_SUBSCRIPTION_STATUSES, AQUEOUS_PRODUCTS, FREE_REPORT_SIGNUPS } from "@/lib/content/aqueous/products";

describe("Aqueous products", () => {
  it("prices the report at $20 one-time and the plan at $5 a month", () => {
    expect(AQUEOUS_PRODUCTS.report).toMatchObject({ name: "Personalized AWI Water Report", priceInCents: 2000, mode: "payment" });
    expect(AQUEOUS_PRODUCTS.subscription).toMatchObject({ name: "Aqueous Monthly Insights", priceInCents: 500, mode: "subscription", interval: "month" });
    for (const p of Object.values(AQUEOUS_PRODUCTS)) expect(p.description.length).toBeGreaterThan(20);
  });

  it("unlocks the free report at 10 sign-ups and counts active and trialing plans", () => {
    expect(FREE_REPORT_SIGNUPS).toBe(10);
    expect(ACTIVE_SUBSCRIPTION_STATUSES).toEqual(["active", "trialing"]);
  });
});
