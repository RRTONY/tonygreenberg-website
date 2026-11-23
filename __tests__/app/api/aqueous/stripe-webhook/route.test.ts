import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/aqueous/stripe-webhook/route";
import { createServiceRoleClient, isServiceRoleConfigured } from "@/lib/supabase/service-role";
import { retrieveSubscription, type StripeSubscription } from "@/lib/stripe";
import { sendEmail } from "@/lib/email";

// Real signatures (node:crypto) against the real verifier; only the Stripe subscription read is faked.
vi.mock("@/lib/stripe", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/lib/stripe")>();
  return { ...real, retrieveSubscription: vi.fn() };
});

// A table-aware fake database: each from(table) records its calls, `respond` answers it.
type Result = { data?: unknown; error?: { message: string } | null };
type Query = { table: string; ops: { name: string; args: unknown[] }[]; end?: string };
const METHODS = ["select", "insert", "update", "upsert", "delete", "eq", "in"];
let respond: (q: Query) => Result | undefined = () => undefined;
let queries: Query[] = [];
function makeDb() {
  const from = vi.fn((table: string) => {
    const q: Query = { table, ops: [] };
    const run = (end: string) => {
      q.end = end;
      queries.push(q);
      return { data: null, error: null, ...(respond(q) ?? {}) };
    };
    const chain: Record<string, unknown> = {};
    for (const m of METHODS) {
      chain[m] = vi.fn((...args: unknown[]) => {
        q.ops.push({ name: m, args });
        return chain;
      });
    }
    chain.maybeSingle = vi.fn(async () => run("maybeSingle"));
    chain.then = (resolve: (v: unknown) => unknown, reject?: (e: unknown) => unknown) =>
      Promise.resolve()
        .then(() => run("then"))
        .then(resolve, reject);
    return chain;
  });
  return { from };
}
const has = (q: Query, name: string, ...want: unknown[]) =>
  q.ops.some((o) => o.name === name && want.every((w, i) => JSON.stringify(o.args[i]) === JSON.stringify(w)));
const written = (table: string, name: string) =>
  queries.filter((q) => q.table === table && has(q, name)).map((q) => q.ops.find((o) => o.name === name)!.args);

const SECRET = "whsec_aqueous_test";
const USER = "9b2f4a1e-1111-4222-8333-444455556666";

function request(event: unknown, { secret = SECRET, signature }: { secret?: string; signature?: string | null } = {}) {
  const body = JSON.stringify(event);
  const t = Math.floor(Date.now() / 1000);
  const sig = createHmac("sha256", secret).update(`${t}.${body}`).digest("hex");
  const headers = new Headers({ "content-type": "application/json" });
  if (signature !== null) headers.set("stripe-signature", signature ?? `t=${t},v1=${sig}`);
  return new NextRequest("http://localhost/api/aqueous/stripe-webhook", { method: "POST", body, headers });
}
const evt = (type: string, object: Record<string, unknown>) => ({ id: "evt_1", type, data: { object } });

const subscription: StripeSubscription = {
  id: "sub_1",
  customer: "cus_1",
  status: "active",
  cancel_at_period_end: true,
  metadata: { app: "aqueous", supabase_user_id: USER },
  items: { data: [{ current_period_end: 1_900_000_000 }] },
};

const session = (over: Record<string, unknown> = {}) => ({
  id: "cs_1",
  payment_intent: "pi_1",
  customer: "cus_1",
  metadata: { app: "aqueous", customer_email: "mia@example.com" },
  ...over,
});

type Purchase = { id: number; user_id: string; product_type: string; status: string; credit_applied: string | number };
const reportPurchase: Purchase = { id: 21, user_id: USER, product_type: "report", status: "pending", credit_applied: "5.00" };

type WorldOver = {
  updateError?: string;
  customerUser?: string | null;
  customerError?: string;
  upsertError?: string;
  expired?: { id: number }[] | null;
  releaseError?: string;
};
function purchaseWorld(purchase: Purchase | null, over: WorldOver = {}) {
  respond = (q) => {
    if (q.table === "aqueous_purchases") {
      if (q.end === "maybeSingle") return { data: purchase };
      if (has(q, "update") && has(q, "select")) return { data: over.expired ?? null };
      if (has(q, "update")) return { error: over.updateError ? { message: over.updateError } : null };
    }
    if (q.table === "aqueous_stripe_customers") {
      if (q.end === "maybeSingle") return { data: over.customerUser ? { user_id: over.customerUser } : null };
      if (has(q, "upsert") && over.customerError) return { error: { message: over.customerError } };
    }
    if (q.table === "aqueous_subscriptions" && over.upsertError) return { error: { message: over.upsertError } };
    if (q.table === "aqueous_referral_credits" && over.releaseError) return { error: { message: over.releaseError } };
    return undefined;
  };
}
/** Index of the first run query on `table` that made a `name` call. */
const at = (table: string, name: string) => queries.findIndex((q) => q.table === table && has(q, name));

beforeEach(() => {
  queries = [];
  respond = () => undefined;
  vi.mocked(createServiceRoleClient).mockReturnValue(makeDb() as never);
  vi.stubEnv("AQUEOUS_STRIPE_WEBHOOK_SECRET", SECRET);
  vi.mocked(isServiceRoleConfigured).mockReturnValue(true);
  vi.mocked(retrieveSubscription).mockResolvedValue(subscription);
  vi.mocked(sendEmail).mockResolvedValue(true);
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => vi.unstubAllEnvs());

describe("POST /api/aqueous/stripe-webhook", () => {
  it("is 503 without its webhook secret", async () => {
    vi.stubEnv("AQUEOUS_STRIPE_WEBHOOK_SECRET", "");
    const res = await POST(request(evt("x", {})));
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "Webhook not configured" });
  });

  it("rejects a missing, wrong or malformed signature before touching the database", async () => {
    expect((await POST(request(evt("x", {}), { signature: null }))).status).toBe(400);
    expect((await POST(request(evt("x", {}), { secret: "whsec_liquidsun" }))).status).toBe(400);
    expect((await POST(request(evt("x", {}), { signature: "t=1,v1=00" }))).status).toBe(400);
    // Correctly signed, but not an event.
    const res = await POST(request({ hello: "world" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid signature" });
    expect(createServiceRoleClient).not.toHaveBeenCalled();
  });

  it("is 500 when the database isn't configured", async () => {
    vi.mocked(isServiceRoleConfigured).mockReturnValue(false);
    expect((await POST(request(evt("checkout.session.completed", session())))).status).toBe(500);
  });

  it("ignores another product's checkout, a session without an id, and other event types", async () => {
    for (const e of [
      evt("checkout.session.completed", session({ metadata: { app: "liquidsun" } })),
      evt("checkout.session.completed", session({ metadata: undefined })),
      evt("checkout.session.completed", session({ id: "" })),
      evt("invoice.paid", { id: "in_1" }),
      { id: "evt_2", type: "checkout.session.completed" },
    ]) {
      const res = await POST(request(e));
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ received: true });
    }
    expect(queries).toHaveLength(0);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("skips a checkout with no matching purchase", async () => {
    purchaseWorld(null);
    expect((await POST(request(evt("checkout.session.completed", session())))).status).toBe(200);
    expect(console.warn).toHaveBeenCalledWith("[aqueous webhook] no purchase for session", "cs_1");
    expect(written("aqueous_purchases", "update")).toHaveLength(0);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("completes a report purchase after saving the customer, and emails Tony (the credit was held at checkout)", async () => {
    purchaseWorld(reportPurchase);
    const res = await POST(request(evt("checkout.session.completed", session())));
    expect(res.status).toBe(200);
    const lookup = queries.find((q) => q.table === "aqueous_purchases")!;
    expect(has(lookup, "eq", "stripe_session_id", "cs_1")).toBe(true);
    expect(written("aqueous_stripe_customers", "upsert")).toEqual([
      [{ user_id: USER, stripe_customer_id: "cus_1" }, { onConflict: "user_id" }],
    ]);
    expect(written("aqueous_purchases", "update")).toEqual([[{ status: "completed", stripe_payment_intent_id: "pi_1" }]]);
    expect(has(queries.find((q) => has(q, "update"))!, "eq", "id", 21)).toBe(true);
    // Marked completed last, so a failed step before it is retried by Stripe.
    expect(at("aqueous_stripe_customers", "upsert")).toBeLessThan(at("aqueous_purchases", "update"));
    // No credit row here: startCheckout already took it off the balance.
    expect(queries.some((q) => q.table === "aqueous_referral_credits")).toBe(false);
    expect(retrieveSubscription).not.toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalledWith(
      "tony@tonygreenberg.com",
      "Aqueous: new report purchase",
      "<p>Personalized AWI Water Report purchased by mia@example.com.</p>",
    );
  });

  it("is 500 and leaves the purchase pending when the customer can't be saved", async () => {
    purchaseWorld(reportPurchase, { customerError: "customer failed" });
    expect((await POST(request(evt("checkout.session.completed", session())))).status).toBe(500);
    expect(console.error).toHaveBeenCalledWith("[aqueous webhook]", "checkout.session.completed", "customer failed");
    expect(written("aqueous_purchases", "update")).toHaveLength(0);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("completes a purchase only once when Stripe sends the event twice", async () => {
    purchaseWorld({ ...reportPurchase, status: "completed" });
    expect((await POST(request(evt("checkout.session.completed", session())))).status).toBe(200);
    expect(written("aqueous_purchases", "update")).toHaveLength(0);
    expect(written("aqueous_referral_credits", "insert")).toHaveLength(0);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("takes the email from the customer details", async () => {
    purchaseWorld({ ...reportPurchase, credit_applied: "0.00", user_id: "not-a-uuid" });
    await POST(
      request(
        evt("checkout.session.completed", session({ metadata: { app: "aqueous", customer_email: "" }, customer_details: { email: "a<b>@x.com" } })),
      ),
    );
    // A purchase whose user id isn't a real member id isn't linked to the Stripe customer.
    expect(written("aqueous_stripe_customers", "upsert")).toHaveLength(0);
    expect(sendEmail).toHaveBeenCalledWith(expect.any(String), expect.any(String), expect.stringContaining("a&lt;b&gt;@x.com"));
  });

  it("says 'a member' without an email, and skips the customer without a Stripe customer id", async () => {
    purchaseWorld(reportPurchase);
    await POST(request(evt("checkout.session.completed", session({ metadata: { app: "aqueous" }, customer: null, payment_intent: null }))));
    expect(written("aqueous_purchases", "update")).toEqual([[{ status: "completed", stripe_payment_intent_id: null }]]);
    expect(written("aqueous_stripe_customers", "upsert")).toHaveLength(0);
    expect(sendEmail).toHaveBeenCalledWith(expect.any(String), expect.any(String), expect.stringContaining("purchased by a member."));
  });

  it("saves the plan after a subscription checkout", async () => {
    purchaseWorld({ ...reportPurchase, product_type: "subscription", credit_applied: 0 });
    const res = await POST(request(evt("checkout.session.completed", session({ subscription: "sub_1" }))));
    expect(res.status).toBe(200);
    expect(retrieveSubscription).toHaveBeenCalledWith("sub_1");
    const [[row, options]] = written("aqueous_subscriptions", "upsert") as [Record<string, unknown>, unknown][];
    expect(row).toEqual({
      stripe_subscription_id: "sub_1",
      user_id: USER,
      stripe_customer_id: "cus_1",
      status: "active",
      current_period_end: new Date(1_900_000_000 * 1000).toISOString(),
      cancel_at_period_end: true,
      updated_at: expect.any(String),
    });
    expect(options).toEqual({ onConflict: "stripe_subscription_id" });
    expect(at("aqueous_subscriptions", "upsert")).toBeLessThan(at("aqueous_purchases", "update"));
    expect(sendEmail).toHaveBeenCalledWith(
      "tony@tonygreenberg.com",
      "Aqueous: new subscriber",
      "<p>Aqueous Monthly Insights purchased by mia@example.com.</p>",
    );
  });

  it("is 500 and leaves the purchase pending when the plan can't be saved", async () => {
    purchaseWorld({ ...reportPurchase, product_type: "subscription" }, { upsertError: "plan failed" });
    expect((await POST(request(evt("checkout.session.completed", session({ subscription: "sub_1" }))))).status).toBe(500);
    expect(written("aqueous_purchases", "update")).toHaveLength(0);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("is 500 (so Stripe retries) when the purchase can't be updated", async () => {
    purchaseWorld(reportPurchase, { updateError: "db down" });
    const res = await POST(request(evt("checkout.session.completed", session())));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Handler failed" });
    expect(console.error).toHaveBeenCalledWith("[aqueous webhook]", "checkout.session.completed", "db down");
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("marks a pending purchase expired and gives back the credit it was holding", async () => {
    purchaseWorld(null, { expired: [{ id: 21 }] });
    expect((await POST(request(evt("checkout.session.expired", { id: "cs_9" })))).status).toBe(200);
    expect(written("aqueous_purchases", "update")).toEqual([[{ status: "expired" }]]);
    const update = queries.find((q) => q.table === "aqueous_purchases")!;
    expect(has(update, "eq", "stripe_session_id", "cs_9")).toBe(true);
    expect(has(update, "eq", "status", "pending")).toBe(true);
    expect(has(update, "select", "id")).toBe(true);
    const release = queries.find((q) => q.table === "aqueous_referral_credits")!;
    expect(has(release, "delete")).toBe(true);
    expect(has(release, "in", "purchase_id", [21])).toBe(true);
    expect(has(release, "eq", "reason", "checkout")).toBe(true);
  });

  it("gives nothing back when no pending purchase expired, or the event has no session", async () => {
    purchaseWorld(null, { expired: [] });
    expect((await POST(request(evt("checkout.session.expired", { id: "cs_9" })))).status).toBe(200);
    purchaseWorld(null, { expired: null });
    expect((await POST(request(evt("checkout.session.expired", { id: "cs_9" })))).status).toBe(200);
    expect(queries.some((q) => q.table === "aqueous_referral_credits")).toBe(false);

    queries = [];
    expect((await POST(request(evt("checkout.session.expired", {})))).status).toBe(200);
    expect(queries).toHaveLength(0);
  });

  it("is 500 when the held credit can't be given back", async () => {
    purchaseWorld(null, { expired: [{ id: 21 }], releaseError: "release failed" });
    expect((await POST(request(evt("checkout.session.expired", { id: "cs_9" })))).status).toBe(500);
    expect(console.error).toHaveBeenCalledWith("[aqueous webhook]", "checkout.session.expired", "release failed");
  });

  describe("subscription events", () => {
    it("ignores another product's subscription", async () => {
      for (const type of ["customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"]) {
        expect((await POST(request(evt(type, { ...subscription, metadata: { app: "liquidsun" } })))).status).toBe(200);
      }
      expect((await POST(request(evt("customer.subscription.updated", { ...subscription, metadata: undefined })))).status).toBe(200);
      expect(queries).toHaveLength(0);
    });

    it("saves the plan for the member in its metadata, with the top-level period end", async () => {
      const res = await POST(
        request(evt("customer.subscription.deleted", { ...subscription, status: "canceled", current_period_end: 1_800_000_000, cancel_at_period_end: undefined })),
      );
      expect(res.status).toBe(200);
      const [[row]] = written("aqueous_subscriptions", "upsert") as [Record<string, unknown>][];
      expect(row).toMatchObject({
        user_id: USER,
        status: "canceled",
        current_period_end: new Date(1_800_000_000 * 1000).toISOString(),
        cancel_at_period_end: false,
      });
      expect(queries.some((q) => q.table === "aqueous_stripe_customers")).toBe(false);
    });

    it("finds the member by the Stripe customer when the metadata has no valid id", async () => {
      purchaseWorld(null, { customerUser: USER });
      await POST(request(evt("customer.subscription.updated", { ...subscription, items: undefined, metadata: { app: "aqueous", supabase_user_id: "nope" } })));
      const lookup = queries.find((q) => q.table === "aqueous_stripe_customers")!;
      expect(has(lookup, "eq", "stripe_customer_id", "cus_1")).toBe(true);
      const [[row]] = written("aqueous_subscriptions", "upsert") as [Record<string, unknown>][];
      expect(row).toMatchObject({ user_id: USER, current_period_end: null });
    });

    it("skips a subscription with no known member", async () => {
      purchaseWorld(null, { customerUser: null });
      expect((await POST(request(evt("customer.subscription.created", { ...subscription, metadata: { app: "aqueous" } })))).status).toBe(200);
      expect(console.warn).toHaveBeenCalledWith("[aqueous webhook] no member for subscription", "sub_1");
      expect(written("aqueous_subscriptions", "upsert")).toHaveLength(0);
    });

    it("is 500 when the plan can't be saved", async () => {
      purchaseWorld(null, { upsertError: "upsert failed" });
      expect((await POST(request(evt("customer.subscription.updated", subscription)))).status).toBe(500);
      expect(console.error).toHaveBeenCalledWith("[aqueous webhook]", "customer.subscription.updated", "upsert failed");
    });
  });
});
