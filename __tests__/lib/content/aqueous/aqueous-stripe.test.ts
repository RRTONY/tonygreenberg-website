import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createAqueousCheckout, createAqueousCustomer } from "@/lib/content/aqueous/aqueous-stripe";
import { StripeError } from "@/lib/stripe";

// Stripe over REST through the shared helper: fetch is stubbed, so nothing reaches Stripe.

type Call = { url: string; method: string; body: Record<string, string> };
let calls: Call[];

function stubStripe(...answers: { status?: number; body: unknown }[]) {
  calls = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init: RequestInit) => {
      calls.push({ url, method: String(init.method), body: Object.fromEntries(init.body as URLSearchParams) });
      const next = answers.shift() ?? { body: {} };
      return new Response(JSON.stringify(next.body), { status: next.status ?? 200 });
    }),
  );
}

const base = { customerId: "cus_1", userId: "user-1", email: "mia@example.com", origin: "https://tonygreenberg.com", creditCents: 0 };

beforeEach(() => {
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_abc");
});
afterEach(() => vi.unstubAllEnvs());

describe("createAqueousCustomer", () => {
  it("creates a customer tagged with the member and the app", async () => {
    stubStripe({ body: { id: "cus_9" } });
    expect(await createAqueousCustomer({ email: "mia@example.com", userId: "user-1" })).toEqual({ id: "cus_9" });
    expect(calls[0]).toEqual({
      url: "https://api.stripe.com/v1/customers",
      method: "POST",
      body: { email: "mia@example.com", "metadata[supabase_user_id]": "user-1", "metadata[app]": "aqueous" },
    });
  });

  it("leaves the email out when the member has none", async () => {
    stubStripe({ body: { id: "cus_9" } });
    await createAqueousCustomer({ email: null, userId: "user-1" });
    expect(calls[0].body).not.toHaveProperty("email");
  });
});

describe("createAqueousCheckout", () => {
  it("sells the $20 report as a one-time payment, with promotion codes allowed", async () => {
    stubStripe({ body: { id: "cs_1", url: "https://checkout.stripe.com/c/pay/cs_1" } });
    expect(await createAqueousCheckout({ ...base, productType: "report" })).toEqual({ id: "cs_1", url: "https://checkout.stripe.com/c/pay/cs_1" });
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe("https://api.stripe.com/v1/checkout/sessions");
    expect(calls[0].body).toEqual({
      customer: "cus_1",
      mode: "payment",
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][unit_amount]": "2000",
      "line_items[0][price_data][product_data][name]": "Personalized AWI Water Report",
      "line_items[0][price_data][product_data][description]": expect.stringContaining("Aqueous Water Index report"),
      success_url: "https://tonygreenberg.com/aqueous/payment/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://tonygreenberg.com/aqueous/pricing",
      client_reference_id: "user-1",
      allow_promotion_codes: "true",
      "metadata[app]": "aqueous",
      "metadata[supabase_user_id]": "user-1",
      "metadata[customer_email]": "mia@example.com",
      "metadata[product_type]": "report",
      "metadata[credit_applied]": "0",
    });
  });

  it("applies referral credit to the report as a one-time coupon", async () => {
    stubStripe({ body: { id: "coupon_1" } }, { body: { id: "cs_2", url: "https://checkout.stripe.com/x" } });
    await createAqueousCheckout({ ...base, productType: "report", creditCents: 750, email: null });
    expect(calls[0].url).toBe("https://api.stripe.com/v1/coupons");
    expect(calls[0].body).toEqual({
      amount_off: "750",
      currency: "usd",
      duration: "once",
      name: "Referral Credit ($7.50)",
      max_redemptions: "1",
    });
    expect(calls[1].body).toMatchObject({ "discounts[0][coupon]": "coupon_1", "metadata[credit_applied]": "750", "metadata[customer_email]": "" });
    expect(calls[1].body).not.toHaveProperty("allow_promotion_codes");
  });

  it("sells the $5 plan monthly, tags the subscription, and never makes a coupon for it", async () => {
    stubStripe({ body: { id: "cs_3", url: "https://checkout.stripe.com/y" } });
    await createAqueousCheckout({ ...base, productType: "subscription", creditCents: 500 });
    expect(calls).toHaveLength(1);
    expect(calls[0].body).toMatchObject({
      mode: "subscription",
      "line_items[0][price_data][unit_amount]": "500",
      "line_items[0][price_data][product_data][name]": "Aqueous Monthly Insights",
      "line_items[0][price_data][recurring][interval]": "month",
      "subscription_data[metadata][app]": "aqueous",
      "subscription_data[metadata][supabase_user_id]": "user-1",
      allow_promotion_codes: "true",
    });
  });

  it("fails when Stripe returns no checkout link", async () => {
    stubStripe({ body: { id: "cs_4", url: null } });
    const err = await createAqueousCheckout({ ...base, productType: "report" }).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(StripeError);
    expect(err).toMatchObject({ message: "Stripe did not return a checkout link", status: 502 });
  });

  it("passes on Stripe's own errors", async () => {
    stubStripe({ status: 400, body: { error: { message: "No such customer" } } });
    await expect(createAqueousCheckout({ ...base, productType: "report" })).rejects.toThrow("No such customer");
  });
});
