import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/liquid-sun/stripe-webhook/route";
import { fakeSupabase } from "@tests/helpers/supabase";
import { retrieveSubscription } from "@/lib/stripe";
import { isServiceRoleConfigured } from "@/lib/supabase/service-role";

// Real signatures (node:crypto) against the real verifier; only the Stripe subscription read is faked.
vi.mock("@/lib/stripe", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/lib/stripe")>();
  return { ...real, retrieveSubscription: vi.fn() };
});

const SECRET = "whsec_liquidsun_test";
const USER = "9b2f4a1e-1111-4222-8333-444455556666";

function request(event: unknown, { secret = SECRET, signature }: { secret?: string; signature?: string | null } = {}) {
  const body = JSON.stringify(event);
  const t = Math.floor(Date.now() / 1000);
  const sig = createHmac("sha256", secret).update(`${t}.${body}`).digest("hex");
  const headers = new Headers({ "content-type": "application/json" });
  if (signature !== null) headers.set("stripe-signature", signature ?? `t=${t},v1=${sig}`);
  return new NextRequest("http://localhost/api/liquid-sun/stripe-webhook", { method: "POST", body, headers });
}

const evt = (type: string, object: Record<string, unknown>) => ({ id: "evt_1", type, data: { object } });

const subscription = {
  id: "sub_1",
  customer: "cus_1",
  status: "active",
  cancel_at_period_end: false,
  metadata: { supabase_user_id: USER, plan: "annual" },
  items: { data: [{ current_period_end: 1_900_000_000, price: { id: "price_y", lookup_key: "liquidsun_premium_annual" } }] },
};

function maybeResults(...rows: unknown[]) {
  fakeSupabase.chain.maybeSingle.mockImplementation(async () => ({ data: rows.shift() ?? null, error: null }));
}

beforeEach(() => {
  vi.stubEnv("STRIPE_WEBHOOK_SECRET", SECRET);
  vi.mocked(isServiceRoleConfigured).mockReturnValue(true);
  vi.mocked(retrieveSubscription).mockResolvedValue(subscription);
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => vi.unstubAllEnvs());

describe("POST /api/liquid-sun/stripe-webhook", () => {
  it("is 503 without a webhook secret", async () => {
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "");
    expect((await POST(request(evt("x", {})))).status).toBe(503);
  });

  it("rejects a missing or wrong signature before touching the database", async () => {
    expect((await POST(request(evt("x", {}), { signature: null }))).status).toBe(400);
    expect((await POST(request(evt("x", {}), { secret: "whsec_other" }))).status).toBe(400);
    expect((await POST(request(evt("x", {}), { signature: "t=1,v1=00" }))).status).toBe(400);
    expect(fakeSupabase.from).not.toHaveBeenCalled();
  });

  it("is 500 when the database isn't configured", async () => {
    vi.mocked(isServiceRoleConfigured).mockReturnValue(false);
    expect((await POST(request(evt("x", {})))).status).toBe(500);
  });

  it("records the customer and the subscription after checkout", async () => {
    const res = await POST(
      request(evt("checkout.session.completed", { subscription: "sub_1", customer: "cus_1", client_reference_id: USER })),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ received: true });
    expect(fakeSupabase.upsert).toHaveBeenCalledWith({ user_id: USER, stripe_customer_id: "cus_1" }, { onConflict: "user_id" });
    expect(retrieveSubscription).toHaveBeenCalledWith("sub_1");
    expect(fakeSupabase.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: USER,
        stripe_subscription_id: "sub_1",
        stripe_customer_id: "cus_1",
        status: "active",
        price_id: "price_y",
        plan: "annual",
        current_period_end: new Date(1_900_000_000 * 1000).toISOString(),
        cancel_at_period_end: false,
      }),
      { onConflict: "stripe_subscription_id" },
    );
  });

  it("takes the member from the session metadata and skips a bad id", async () => {
    await POST(
      request(evt("checkout.session.completed", { subscription: "sub_1", customer: "cus_1", metadata: { supabase_user_id: USER } })),
    );
    expect(fakeSupabase.upsert).toHaveBeenCalledWith({ user_id: USER, stripe_customer_id: "cus_1" }, { onConflict: "user_id" });

    vi.mocked(fakeSupabase.upsert).mockClear();
    await POST(request(evt("checkout.session.completed", { customer: "cus_1", client_reference_id: "not-a-uuid" })));
    expect(fakeSupabase.upsert).not.toHaveBeenCalled();
  });

  it("updates the status on subscription changes", async () => {
    await POST(request(evt("customer.subscription.updated", { ...subscription, status: "past_due", cancel_at_period_end: true })));
    expect(fakeSupabase.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ status: "past_due", cancel_at_period_end: true }),
      { onConflict: "stripe_subscription_id" },
    );
  });

  it("marks a deleted subscription canceled", async () => {
    await POST(request(evt("customer.subscription.deleted", subscription)));
    expect(fakeSupabase.upsert).toHaveBeenCalledWith(expect.objectContaining({ status: "canceled" }), expect.anything());
  });

  it("finds the member by Stripe customer when the subscription has no metadata", async () => {
    maybeResults({ user_id: USER });
    await POST(
      request(
        evt("customer.subscription.created", {
          id: "sub_2",
          customer: "cus_9",
          status: "trialing",
          current_period_end: 1_900_000_000,
          items: { data: [{ price: { id: "price_m", lookup_key: "liquidsun_premium_monthly" } }] },
        }),
      ),
    );
    expect(fakeSupabase.eq).toHaveBeenCalledWith("stripe_customer_id", "cus_9");
    expect(fakeSupabase.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: USER, plan: "monthly", status: "trialing", price_id: "price_m" }),
      expect.anything(),
    );
  });

  it("skips a subscription that belongs to no member, and an unknown plan", async () => {
    maybeResults(null);
    const res = await POST(request(evt("customer.subscription.updated", { id: "sub_3", customer: "cus_x", status: "active" })));
    expect(res.status).toBe(200);
    expect(fakeSupabase.upsert).not.toHaveBeenCalled();

    maybeResults({ user_id: USER });
    await POST(request(evt("customer.subscription.updated", { id: "sub_3", customer: "cus_x", status: "active", items: { data: [] } })));
    expect(fakeSupabase.upsert).toHaveBeenCalledWith(expect.objectContaining({ plan: null, current_period_end: null }), expect.anything());
  });

  it("ignores subscription events without ids", async () => {
    await POST(request(evt("customer.subscription.updated", { status: "active" })));
    expect(fakeSupabase.upsert).not.toHaveBeenCalled();
  });

  it("marks a failed payment past due (old and new invoice shapes)", async () => {
    await POST(request(evt("invoice.payment_failed", { subscription: "sub_1" })));
    expect(fakeSupabase.update).toHaveBeenCalledWith(expect.objectContaining({ status: "past_due" }));
    expect(fakeSupabase.eq).toHaveBeenCalledWith("stripe_subscription_id", "sub_1");

    vi.mocked(fakeSupabase.eq).mockClear();
    await POST(request(evt("invoice.payment_failed", { parent: { subscription_details: { subscription: "sub_7" } } })));
    expect(fakeSupabase.eq).toHaveBeenCalledWith("stripe_subscription_id", "sub_7");

    vi.mocked(fakeSupabase.update).mockClear();
    await POST(request(evt("invoice.payment_failed", {})));
    expect(fakeSupabase.update).not.toHaveBeenCalled();
  });

  it("acknowledges events it doesn't handle", async () => {
    const res = await POST(request(evt("customer.created", {})));
    expect(res.status).toBe(200);
  });

  it("is 500 when saving fails, so Stripe retries", async () => {
    fakeSupabase.chain.then = (resolve, reject) =>
      Promise.resolve({ data: null, error: { message: "db down" }, count: null }).then(resolve, reject);
    const res = await POST(request(evt("customer.subscription.updated", subscription)));
    expect(res.status).toBe(500);
  });
});
