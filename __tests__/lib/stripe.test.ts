import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Stripe over REST: every call goes through a stubbed fetch, so nothing reaches Stripe.

type Call = { url: string; method: string; body: URLSearchParams | null; headers: Record<string, string> };

let calls: Call[];
let replies: { status?: number; body: unknown }[];

function stubStripe(...answers: { status?: number; body: unknown }[]) {
  calls = [];
  replies = [...answers];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init: RequestInit) => {
      calls.push({
        url,
        method: String(init.method),
        body: (init.body as URLSearchParams) ?? null,
        headers: init.headers as Record<string, string>,
      });
      const next = replies.shift() ?? { body: {} };
      return new Response(typeof next.body === "string" ? next.body : JSON.stringify(next.body), { status: next.status ?? 200 });
    }),
  );
}

async function load() {
  vi.resetModules();
  return import("@/lib/stripe");
}

beforeEach(() => {
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_abc");
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe("config", () => {
  it("knows whether Stripe is set up and in test mode", async () => {
    const s = await load();
    expect(s.isStripeConfigured()).toBe(true);
    expect(s.isStripeTestMode()).toBe(true);
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_live_x");
    expect(s.isStripeTestMode()).toBe(false);
    vi.stubEnv("STRIPE_SECRET_KEY", "");
    expect(s.isStripeConfigured()).toBe(false);
    expect(s.isStripeTestMode()).toBe(false);
  });

  it("encodes params as Stripe's bracketed form, skipping empty values", async () => {
    const { encodeParams } = await load();
    expect(encodeParams({ a: "1", "b[c]": 2, d: true, e: undefined, f: null }).toString()).toBe("a=1&b%5Bc%5D=2&d=true");
  });
});

describe("stripeRequest", () => {
  it("sends GET params in the query string with the secret key", async () => {
    const { stripeRequest } = await load();
    stubStripe({ body: { ok: 1 } });
    expect(await stripeRequest("GET", "/prices", { active: true })).toEqual({ ok: 1 });
    expect(calls[0].url).toBe("https://api.stripe.com/v1/prices?active=true");
    expect(calls[0].headers.Authorization).toBe("Bearer sk_test_abc");
    expect(calls[0].body).toBeNull();
  });

  it("sends a GET without params to the bare path", async () => {
    const { stripeRequest } = await load();
    stubStripe({ body: {} });
    await stripeRequest("GET", "/balance");
    expect(calls[0].url).toBe("https://api.stripe.com/v1/balance");
  });

  it("sends POST params as a form body", async () => {
    const { stripeRequest } = await load();
    stubStripe({ body: { id: "x" } });
    await stripeRequest("POST", "/customers", { email: "a@b.co" });
    expect(calls[0].method).toBe("POST");
    expect(calls[0].headers["Content-Type"]).toBe("application/x-www-form-urlencoded");
    expect(calls[0].body?.get("email")).toBe("a@b.co");
  });

  it("passes Stripe's error message through, or the status", async () => {
    const { stripeRequest, StripeError } = await load();
    stubStripe({ status: 400, body: { error: { message: "No such customer" } } }, { status: 500, body: "not json" });
    await expect(stripeRequest("GET", "/x")).rejects.toMatchObject({ message: "No such customer", status: 400 });
    const err = (await stripeRequest("GET", "/x").catch((e: unknown) => e)) as InstanceType<typeof StripeError>;
    expect(err).toBeInstanceOf(StripeError);
    expect(err.message).toBe("Stripe returned 500");
  });

  it("is a 503 when no key is set", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "");
    const { stripeRequest } = await load();
    await expect(stripeRequest("GET", "/x")).rejects.toMatchObject({ status: 503 });
  });
});

describe("getPlanPriceId", () => {
  it("finds the price by its lookup key and caches it", async () => {
    const { getPlanPriceId } = await load();
    stubStripe({
      body: {
        data: [
          { id: "price_wrong", unit_amount: 500, recurring: { interval: "month" } },
          { id: "price_month", unit_amount: 999, recurring: { interval: "month" } },
        ],
      },
    });
    expect(await getPlanPriceId("monthly")).toBe("price_month");
    expect(calls[0].url).toContain("lookup_keys%5B%5D=liquidsun_premium_monthly");
    expect(await getPlanPriceId("monthly")).toBe("price_month");
    expect(calls).toHaveLength(1);
  });

  it("creates the product and the price the first time", async () => {
    const { getPlanPriceId } = await load();
    stubStripe({ body: { data: [] } }, { body: { data: [] } }, { body: { id: "prod_1" } }, { body: { id: "price_year" } });
    expect(await getPlanPriceId("annual")).toBe("price_year");
    expect(calls[1].url).toContain("/products/search");
    expect(calls[2].url).toBe("https://api.stripe.com/v1/products");
    expect(calls[2].body?.get("metadata[app]")).toBe("liquidsun_premium");
    expect(calls[2].body?.get("name")).toBe("LiquidSun Premium");
    const price = calls[3].body!;
    expect(price.get("product")).toBe("prod_1");
    expect(price.get("unit_amount")).toBe("7999");
    expect(price.get("recurring[interval]")).toBe("year");
    expect(price.get("lookup_key")).toBe("liquidsun_premium_annual");
    expect(price.get("currency")).toBe("usd");
  });

  it("reuses an existing product", async () => {
    const { getPlanPriceId } = await load();
    stubStripe({ body: { data: [] } }, { body: { data: [{ id: "prod_old" }] } }, { body: { id: "price_m" } });
    expect(await getPlanPriceId("monthly")).toBe("price_m");
    expect(calls).toHaveLength(3);
    expect(calls[2].body?.get("product")).toBe("prod_old");
    expect(calls[2].body?.get("unit_amount")).toBe("999");
  });
});

describe("customers, checkout and portal", () => {
  it("creates a customer tagged with the member id", async () => {
    const { createCustomer } = await load();
    stubStripe({ body: { id: "cus_1" } }, { body: { id: "cus_2" } });
    expect(await createCustomer({ email: "me@x.co", userId: "u1" })).toEqual({ id: "cus_1" });
    expect(calls[0].body?.get("email")).toBe("me@x.co");
    expect(calls[0].body?.get("metadata[supabase_user_id]")).toBe("u1");
    await createCustomer({ email: null, userId: "u2" });
    expect(calls[1].body?.has("email")).toBe(false);
  });

  it("creates a subscription checkout session for the member", async () => {
    const { createCheckoutSession } = await load();
    stubStripe({ body: { id: "cs_1", url: "https://checkout.stripe.com/x" } });
    const url = await createCheckoutSession({
      customerId: "cus_1",
      priceId: "price_1",
      userId: "u1",
      plan: "annual",
      origin: "https://tonygreenberg.com",
    });
    expect(url).toBe("https://checkout.stripe.com/x");
    const b = calls[0].body!;
    expect(calls[0].url).toBe("https://api.stripe.com/v1/checkout/sessions");
    expect(b.get("mode")).toBe("subscription");
    expect(b.get("customer")).toBe("cus_1");
    expect(b.get("line_items[0][price]")).toBe("price_1");
    expect(b.get("line_items[0][quantity]")).toBe("1");
    expect(b.get("client_reference_id")).toBe("u1");
    expect(b.get("success_url")).toBe("https://tonygreenberg.com/liquid-sun/premium/success?session_id={CHECKOUT_SESSION_ID}");
    expect(b.get("cancel_url")).toBe("https://tonygreenberg.com/liquid-sun/premium");
    expect(b.get("subscription_data[metadata][supabase_user_id]")).toBe("u1");
    expect(b.get("subscription_data[metadata][plan]")).toBe("annual");
    expect(b.get("allow_promotion_codes")).toBe("true");
  });

  it("fails when Stripe returns no checkout link", async () => {
    const { createCheckoutSession } = await load();
    stubStripe({ body: { id: "cs_1", url: null } });
    await expect(
      createCheckoutSession({ customerId: "c", priceId: "p", userId: "u", plan: "monthly", origin: "https://x.co" }),
    ).rejects.toMatchObject({ status: 502 });
  });

  it("opens the billing portal and reads a subscription", async () => {
    const { createPortalSession, retrieveSubscription } = await load();
    stubStripe({ body: { url: "https://billing.stripe.com/p" } }, { body: { id: "sub_1", status: "active" } });
    expect(await createPortalSession({ customerId: "cus_1", origin: "https://x.co" })).toBe("https://billing.stripe.com/p");
    expect(calls[0].body?.get("return_url")).toBe("https://x.co/liquid-sun/premium");
    expect(await retrieveSubscription("sub_1")).toMatchObject({ status: "active" });
    expect(calls[1].url).toBe("https://api.stripe.com/v1/subscriptions/sub_1");
  });
});

describe("verifyStripeWebhook", () => {
  const secret = "whsec_test";
  const body = JSON.stringify({ id: "evt_1", type: "checkout.session.completed" });
  const now = 1_800_000_000;
  const sign = (payload: string, t = now, key = secret) => createHmac("sha256", key).update(`${t}.${payload}`).digest("hex");

  it("accepts a valid signature", async () => {
    const { verifyStripeWebhook } = await load();
    expect(verifyStripeWebhook(body, `t=${now},v1=${sign(body)}`, secret, now)).toEqual({
      id: "evt_1",
      type: "checkout.session.completed",
    });
  });

  it("accepts any matching v1 among several", async () => {
    const { verifyStripeWebhook } = await load();
    const header = `t=${now},v1=${"0".repeat(64)},v0=abc,v1=${sign(body)}`;
    expect(verifyStripeWebhook(body, header, secret, now)).not.toBeNull();
  });

  it("uses the current time by default", async () => {
    const { verifyStripeWebhook } = await load();
    const t = Math.floor(Date.now() / 1000);
    expect(verifyStripeWebhook(body, `t=${t},v1=${sign(body, t)}`, secret)).not.toBeNull();
  });

  it("rejects a wrong secret, a changed body, an old timestamp and bad headers", async () => {
    const { verifyStripeWebhook } = await load();
    expect(verifyStripeWebhook(body, `t=${now},v1=${sign(body, now, "other")}`, secret, now)).toBeNull();
    expect(verifyStripeWebhook(`${body} `, `t=${now},v1=${sign(body)}`, secret, now)).toBeNull();
    expect(verifyStripeWebhook(body, `t=${now - 301},v1=${sign(body, now - 301)}`, secret, now)).toBeNull();
    expect(verifyStripeWebhook(body, null, secret, now)).toBeNull();
    expect(verifyStripeWebhook(body, `t=${now},v1=${sign(body)}`, "", now)).toBeNull();
    expect(verifyStripeWebhook(body, `v1=${sign(body)}`, secret, now)).toBeNull();
    expect(verifyStripeWebhook(body, `t=${now}`, secret, now)).toBeNull();
    expect(verifyStripeWebhook(body, `t=${now},v1=abcd`, secret, now)).toBeNull();
  });

  it("rejects a signed body that isn't JSON", async () => {
    const { verifyStripeWebhook } = await load();
    expect(verifyStripeWebhook("not json", `t=${now},v1=${sign("not json")}`, secret, now)).toBeNull();
  });
});
