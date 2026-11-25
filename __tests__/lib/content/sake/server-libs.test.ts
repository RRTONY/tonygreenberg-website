import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { estimatedSummary, observedSummary, RETAILER_SOURCES } from "@/lib/content/sake/live-prices";
import { extractJson, parseMenuReply, parseScanReply } from "@/lib/content/sake/scanner";
import { alertSchema } from "@/lib/content/sake/forms";
import { getSubscriptionPlan, SUBSCRIPTION_PLANS } from "@/lib/content/sake/products";
import {
  createSakeCustomer,
  createSakeOrderCheckout,
  createSakeSubscriptionCheckout,
  isSakeCheckoutEnabled,
  priceCart,
} from "@/lib/content/sake/sake-stripe";
import { getProduct, SHIPPING_RATE_CENTS } from "@/lib/content/sake/shop-data";
import { stripeRequest } from "@/lib/stripe";
import { qprSakeDatabase } from "@/lib/content/sake/qpr-data";

vi.mock("@/lib/stripe", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/lib/stripe")>();
  return { ...real, stripeRequest: vi.fn() };
});

const cheap = qprSakeDatabase.find((s) => s.priceUS > 0 && s.priceUS < 30)!;

describe("live-prices", () => {
  it("estimates from the base price and retailer markups, without randomness", () => {
    expect(estimatedSummary(100)).toEqual({ lowestPrice: 85, lowestRetailer: "Mitsuwa Marketplace", priceDiffPct: -15, inStockCount: RETAILER_SOURCES.length, estimated: true });
    expect(estimatedSummary(100)).toEqual(estimatedSummary(100));
  });

  it("uses each retailer's latest in-stock observation", () => {
    const rows = [
      { sake_id: "a", retailer_name: "A", price: 50, in_stock: false },
      { sake_id: "a", retailer_name: "A", price: 10, in_stock: true },
      { sake_id: "a", retailer_name: "B", price: "45.5", in_stock: true },
    ];
    expect(observedSummary(50, rows)).toEqual({ lowestPrice: 45.5, lowestRetailer: "B", priceDiffPct: -9, inStockCount: 1, estimated: false });
    expect(observedSummary(undefined, [rows[0]])).toEqual({ lowestPrice: null, lowestRetailer: "", priceDiffPct: 0, inStockCount: 0, estimated: false });
    expect(observedSummary(undefined, [rows[2]]).priceDiffPct).toBe(0);
  });
});

describe("scanner parsers", () => {
  it("finds the JSON in a reply", () => {
    expect(extractJson('Here:\n```json\n{"a":1}\n```')).toEqual({ a: 1 });
    expect(extractJson("no json")).toBeNull();
    expect(extractJson("{not json}")).toBeNull();
    expect(extractJson("[1,2]")).toBeNull();
  });

  it("keeps only the scan fields, with safe defaults", () => {
    const out = parseScanReply(
      JSON.stringify({ name: "Dassai 23", brewery: "Asahi Shuzo", ricePolishRatio: "23", abv: null, estimatedRetailUS: 95, flavorNotes: ["melon", 4, ""], pairings: ["a", "b", "c", "d", "e"], confidence: "HIGH", extra: "x" }),
    )!;
    expect(out).toMatchObject({ name: "Dassai 23", nameJa: "Dassai 23", breweryJa: "Asahi Shuzo", ricePolishRatio: 23, abv: null, estimatedRetailJapan: 0, flavorNotes: ["melon"], confidence: "high" });
    expect(out.pairings).toHaveLength(4);
    expect(out).not.toHaveProperty("extra");
    expect(parseScanReply(JSON.stringify({ name: "x", confidence: "sure" }))!.confidence).toBe("low");
    expect(parseScanReply('{"name": ""}')).toBeNull();
    expect(parseScanReply("nothing")).toBeNull();
  });

  it("needs the markup and retail price, and falls back to a standard verdict", () => {
    expect(parseMenuReply('{"markupMultiple": 3}')).toBeNull();
    expect(parseMenuReply("x")).toBeNull();
    expect(parseMenuReply('{"markupMultiple": 3, "retailPriceUS": 40, "verdict": "steal"}')).toMatchObject({ markupMultiple: 3, retailPriceUS: 40, verdict: "standard", pricePerML: 0 });
    expect(parseMenuReply('{"markupMultiple": 1.5, "retailPriceUS": 40, "verdict": "great_value"}')!.verdict).toBe("great_value");
  });
});

describe("forms and plans", () => {
  it("accepts empty optional fields and rejects bad ZIP codes and prices", async () => {
    const base = { alertType: "all", sakeId: "", sakeCategory: "", priceThreshold: "", minDiscountPct: 10, zipCode: "" };
    await expect(alertSchema.validate(base)).resolves.toBeTruthy();
    await expect(alertSchema.validate({ ...base, zipCode: "1234" })).rejects.toThrow("5-digit");
    await expect(alertSchema.validate({ ...base, priceThreshold: "abc" })).rejects.toThrow("price");
    await expect(alertSchema.validate({ ...base, alertType: "specific" })).rejects.toThrow("choose a sake");
  });

  it("has the app's three boxes", () => {
    expect(SUBSCRIPTION_PLANS.map((p) => [p.id, p.priceCentsMonthly])).toEqual([
      ["sub-explorer", 5900],
      ["sub-connoisseur", 9900],
      ["sub-omakase", 19900],
    ]);
    expect(getSubscriptionPlan("sub-omakase")?.tier).toBe("omakase");
    expect(getSubscriptionPlan("x")).toBeUndefined();
  });
});

describe("sake-stripe", () => {
  beforeEach(() => vi.mocked(stripeRequest).mockReset());
  afterEach(() => vi.unstubAllEnvs());

  it("is open only with a Stripe key and SAKE_CHECKOUT_ENABLED=true", () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "");
    vi.stubEnv("SAKE_CHECKOUT_ENABLED", "true");
    expect(isSakeCheckoutEnabled()).toBe(false);
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_x");
    expect(isSakeCheckoutEnabled()).toBe(true);
    vi.stubEnv("SAKE_CHECKOUT_ENABLED", "yes");
    expect(isSakeCheckoutEnabled()).toBe(false);
  });

  it("prices a cart from the catalog and rejects bad carts", () => {
    const product = getProduct(cheap.id)!;
    expect(priceCart([{ productId: cheap.id, quantity: 2 }])).toEqual({
      items: [{ productId: cheap.id, name: product.name, quantity: 2, unitCents: product.priceCents }],
      subtotalCents: product.priceCents * 2,
      shippingCents: product.priceCents * 2 < 7500 ? SHIPPING_RATE_CENTS : 0,
    });
    expect(priceCart([])).toBeNull();
    expect(priceCart([{ productId: cheap.id, quantity: 13 }])).toBeNull();
    expect(priceCart([{ productId: cheap.id, quantity: 1.5 }])).toBeNull();
    expect(priceCart([{ productId: "nope", quantity: 1 }])).toBeNull();
    expect(priceCart([{ productId: cheap.id, quantity: 1 }, { productId: cheap.id, quantity: 1 }])).toBeNull();
    expect(priceCart([{ productId: cheap.id, quantity: 12 }])!.shippingCents).toBe(0);
  });

  it("sends Stripe the server's prices, shipping and return links", async () => {
    vi.mocked(stripeRequest).mockResolvedValue({ id: "cs_1", url: "https://stripe.test/cs_1" });
    const cart = priceCart([{ productId: cheap.id, quantity: 1 }])!;
    await expect(
      createSakeOrderCheckout({ customerId: "cus_1", userId: "u1", email: null, name: null, cart, origin: "https://tonygreenberg.com" }),
    ).resolves.toEqual({ id: "cs_1", url: "https://stripe.test/cs_1" });
    const params = vi.mocked(stripeRequest).mock.calls[0][2] as Record<string, unknown>;
    expect(params["line_items[0][price_data][unit_amount]"]).toBe(cart.items[0].unitCents);
    expect(params["line_items[1][price_data][product_data][name]"]).toBe("Standard Shipping");
    expect(params["metadata[app]"]).toBe("sake");
    expect(params.success_url).toBe(`https://tonygreenberg.com/sake/bottle/${cheap.id}?order=success&session_id={CHECKOUT_SESSION_ID}`);

    await createSakeSubscriptionCheckout({ customerId: "cus_1", userId: "u1", email: "a@b.c", name: "A", plan: SUBSCRIPTION_PLANS[0], origin: "https://x.test" });
    const sub = vi.mocked(stripeRequest).mock.calls[1][2] as Record<string, unknown>;
    expect(sub.mode).toBe("subscription");
    expect(sub["line_items[0][price_data][unit_amount]"]).toBe(5900);
    expect(sub["subscription_data[metadata][plan_tier]"]).toBe("explorer");
    expect(sub.cancel_url).toBe("https://x.test/sake/subscription?cancelled=true");

    await createSakeCustomer({ email: null, userId: "u1" });
    expect(vi.mocked(stripeRequest).mock.calls[2][1]).toBe("/customers");
  });

  it("fails when Stripe returns no checkout link", async () => {
    vi.mocked(stripeRequest).mockResolvedValue({ id: "cs_1", url: null });
    const cart = priceCart([{ productId: cheap.id, quantity: 1 }])!;
    await expect(createSakeOrderCheckout({ customerId: "c", userId: "u", email: null, name: null, cart, origin: "o" })).rejects.toThrow("checkout link");
    await expect(
      createSakeSubscriptionCheckout({ customerId: "c", userId: "u", email: null, name: null, plan: SUBSCRIPTION_PLANS[0], origin: "o" }),
    ).rejects.toThrow("checkout link");
  });
});
