import { describe, expect, it } from "vitest";
import { PRODUCTS, type Product } from "./products";
import { FREE_BLOG_POST_COUNT } from "../shared/stripe";

describe("Stripe Products", () => {
  it("has all expected product keys defined", () => {
    const expectedKeys = [
      "blog-access",
      "essay-archive",
      "regenerative-playbook",
      "vendor-intel-brief",
      "membership-yearly",
      "essay-compilation",
      "diamond-rough-cut",
      "diamond-full-cut",
      "diamond-monthly-polish",
    ];
    for (const key of expectedKeys) {
      expect(PRODUCTS[key]).toBeDefined();
      expect(PRODUCTS[key].key).toBe(key);
    }
  });

  it("has valid price in cents for every product", () => {
    for (const [key, product] of Object.entries(PRODUCTS)) {
      expect(product.priceCents).toBeGreaterThan(0);
      expect(Number.isInteger(product.priceCents)).toBe(true);
    }
  });

  it("has valid mode for every product", () => {
    for (const [key, product] of Object.entries(PRODUCTS)) {
      expect(["payment", "subscription"]).toContain(product.mode);
    }
  });

  it("subscription products have an interval", () => {
    for (const [key, product] of Object.entries(PRODUCTS)) {
      if (product.mode === "subscription") {
        expect(product.interval).toBeDefined();
        expect(["month", "year"]).toContain(product.interval);
      }
    }
  });

  it("payment products do not have an interval", () => {
    for (const [key, product] of Object.entries(PRODUCTS)) {
      if (product.mode === "payment") {
        expect(product.interval).toBeUndefined();
      }
    }
  });

  it("has non-empty name and description for every product", () => {
    for (const [key, product] of Object.entries(PRODUCTS)) {
      expect(product.name.length).toBeGreaterThan(0);
      expect(product.description.length).toBeGreaterThan(0);
    }
  });

  // ── Price Sanity Checks ──

  it("blog-access is $9.99", () => {
    expect(PRODUCTS["blog-access"].priceCents).toBe(999);
    expect(PRODUCTS["blog-access"].mode).toBe("payment");
  });

  it("essay-archive is $27", () => {
    expect(PRODUCTS["essay-archive"].priceCents).toBe(2700);
  });

  it("regenerative-playbook is $47", () => {
    expect(PRODUCTS["regenerative-playbook"].priceCents).toBe(4700);
  });

  it("vendor-intel-brief is $97", () => {
    expect(PRODUCTS["vendor-intel-brief"].priceCents).toBe(9700);
  });

  it("membership-yearly is $99/yr subscription", () => {
    expect(PRODUCTS["membership-yearly"].priceCents).toBe(9900);
    expect(PRODUCTS["membership-yearly"].mode).toBe("subscription");
    expect(PRODUCTS["membership-yearly"].interval).toBe("year");
  });

  it("essay-compilation is $27", () => {
    expect(PRODUCTS["essay-compilation"].priceCents).toBe(2700);
  });

  it("diamond-rough-cut is $5,000", () => {
    expect(PRODUCTS["diamond-rough-cut"].priceCents).toBe(500000);
    expect(PRODUCTS["diamond-rough-cut"].mode).toBe("payment");
  });

  it("diamond-full-cut is $10,000", () => {
    expect(PRODUCTS["diamond-full-cut"].priceCents).toBe(1000000);
    expect(PRODUCTS["diamond-full-cut"].mode).toBe("payment");
  });

  it("diamond-monthly-polish is $15,000/mo subscription", () => {
    expect(PRODUCTS["diamond-monthly-polish"].priceCents).toBe(1500000);
    expect(PRODUCTS["diamond-monthly-polish"].mode).toBe("subscription");
    expect(PRODUCTS["diamond-monthly-polish"].interval).toBe("month");
  });
});

describe("FREE_BLOG_POST_COUNT", () => {
  it("is set to 9999 (paywall disabled)", () => {
    expect(FREE_BLOG_POST_COUNT).toBe(9999);
  });

  it("is a positive integer", () => {
    expect(FREE_BLOG_POST_COUNT).toBeGreaterThan(0);
    expect(Number.isInteger(FREE_BLOG_POST_COUNT)).toBe(true);
  });
});

describe("Product catalog integrity", () => {
  it("has no duplicate product keys", () => {
    const keys = Object.keys(PRODUCTS);
    const uniqueKeys = new Set(keys);
    expect(keys.length).toBe(uniqueKeys.size);
  });

  it("has exactly 9 products", () => {
    expect(Object.keys(PRODUCTS).length).toBe(9);
  });

  it("every product key matches its key field", () => {
    for (const [key, product] of Object.entries(PRODUCTS)) {
      expect(product.key).toBe(key);
    }
  });
});
