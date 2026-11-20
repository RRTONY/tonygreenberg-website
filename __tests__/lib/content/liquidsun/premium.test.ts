import { describe, expect, it } from "vitest";
import { FREE_FEATURES, PREMIUM_FEATURES, PREMIUM_PRICES, PREMIUM_STATUSES } from "@/lib/content/liquidsun/premium";
import { LIQUIDSUN_AUDIO, LIQUIDSUN_STARDUST_URL, liquidsunImages } from "@/lib/content/liquidsun/images";

describe("LiquidSun Premium plans", () => {
  it("keeps the app's prices: $9.99 a month, $79.99 a year", () => {
    expect(PREMIUM_PRICES.monthly).toMatchObject({ amount: 999, interval: "month", currency: "usd", lookupKey: "liquidsun_premium_monthly" });
    expect(PREMIUM_PRICES.annual).toMatchObject({ amount: 7999, interval: "year", lookupKey: "liquidsun_premium_annual" });
    expect(PREMIUM_FEATURES).toHaveLength(8);
    expect(FREE_FEATURES).toHaveLength(5);
    expect(PREMIUM_STATUSES).toEqual(["active", "trialing"]);
  });
});

describe("LiquidSun media", () => {
  it("is all on Sanity, never Manus, with alt text and sizes", () => {
    for (const img of Object.values(liquidsunImages)) {
      expect(img.src).toMatch(/^https:\/\/cdn\.sanity\.io\/images\/a3q1cyqs\/production\/[0-9a-f]{40}-\d+x\d+\.webp$/);
      expect(img.src).toContain(`-${img.width}x${img.height}.`);
      expect(img.alt.length).toBeGreaterThan(5);
    }
    for (const url of [LIQUIDSUN_STARDUST_URL, ...Object.values(LIQUIDSUN_AUDIO)]) {
      expect(url).toMatch(/^https:\/\/cdn\.sanity\.io\//);
      expect(url).not.toMatch(/manus/);
    }
  });
});
