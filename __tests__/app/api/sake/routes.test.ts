import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST as scan } from "@/app/api/sake/scanner/route";
import { POST as analyze } from "@/app/api/sake/menu-analyzer/route";
import { POST as webhook } from "@/app/api/sake/stripe-webhook/route";
import { createServiceRoleClient, isServiceRoleConfigured } from "@/lib/supabase/service-role";
import { retrieveSubscription, type StripeSubscription } from "@/lib/stripe";
import { sendEmail } from "@/lib/email";

vi.mock("@/lib/stripe", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/lib/stripe")>();
  return { ...real, retrieveSubscription: vi.fn() };
});

const post = (url: string, body: unknown, headers: Record<string, string> = {}) =>
  new NextRequest(url, { method: "POST", body: typeof body === "string" ? body : JSON.stringify(body), headers });
const claude = (text: string) => new Response(JSON.stringify({ content: [{ type: "text", text }] }), { status: 200 });
const IMAGE = "data:image/jpeg;base64,/9j/AAAA";

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("ANTHROPIC_API_KEY", "sk-ant-test");
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("POST /api/sake/scanner", () => {
  it("checks the body and the image", async () => {
    expect((await scan(post("http://x/api", "{bad"))).status).toBe(400);
    expect((await scan(post("http://x/api", { imageBase64: "data:text/plain;base64,AAAA" }))).status).toBe(400);
    const big = `data:image/png;base64,${"A".repeat(7 * 1024 * 1024)}`;
    expect((await scan(post("http://x/api", { imageBase64: big }))).status).toBe(400);
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    expect((await scan(post("http://x/api", { imageBase64: IMAGE }))).status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends the photo to Claude with the app's prompt and returns the parsed result", async () => {
    fetchMock.mockResolvedValue(claude('{"name":"Born Gold","confidence":"high","flavorNotes":["melon"]}'));
    const res = await scan(post("http://x/api", { imageBase64: IMAGE }));
    expect(res.status).toBe(200);
    expect((await res.json()).result).toMatchObject({ name: "Born Gold", confidence: "high" });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.model).toBe("claude-haiku-5-5");
    expect(body.system).toContain("You are a sake identification expert.");
    expect(body.messages[0].content[0]).toEqual({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: "/9j/AAAA" } });
  });

  it("says so when the label can't be read or Claude fails", async () => {
    fetchMock.mockResolvedValue(claude("I can't see a bottle."));
    expect((await scan(post("http://x/api", { imageBase64: IMAGE }))).status).toBe(422);
    fetchMock.mockResolvedValue(new Response("", { status: 500 }));
    expect((await scan(post("http://x/api", { imageBase64: IMAGE }))).status).toBe(502);
  });
});

describe("POST /api/sake/menu-analyzer", () => {
  it("checks the name, price and serving size", async () => {
    expect((await analyze(post("http://x/api", "{bad"))).status).toBe(400);
    expect((await analyze(post("http://x/api", { sakeName: " ", menuPrice: 20 }))).status).toBe(400);
    expect((await analyze(post("http://x/api", { sakeName: "Dassai", menuPrice: -1 }))).status).toBe(400);
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    expect((await analyze(post("http://x/api", { sakeName: "Dassai", menuPrice: 20 }))).status).toBe(503);
  });

  it("returns the analysis, using a known serving size", async () => {
    fetchMock.mockResolvedValue(claude('{"markupMultiple":3.2,"retailPriceUS":40,"verdict":"premium"}'));
    const res = await analyze(post("http://x/api", { sakeName: "Dassai  45", menuPrice: 60, servingSize: "a barrel" }));
    expect((await res.json()).analysis).toMatchObject({ markupMultiple: 3.2, verdict: "premium" });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.messages[0].content).toBe("Sake: Dassai 45\nMenu Price: $60\nServing Size: 300ml tokkuri");
    fetchMock.mockResolvedValue(claude("no"));
    expect((await analyze(post("http://x/api", { sakeName: "Dassai", menuPrice: 60 }))).status).toBe(502);
  });
});

// ─── Webhook ───

type Query = { table: string; ops: { name: string; args: unknown[] }[] };
let respond: (q: Query) => { data?: unknown; error?: { message: string; code?: string } | null } | undefined = () => undefined;
let queries: Query[] = [];
function makeDb() {
  return {
    from: vi.fn((table: string) => {
      const q: Query = { table, ops: [] };
      const run = () => {
        queries.push(q);
        return { data: null, error: null, ...(respond(q) ?? {}) };
      };
      const chain: Record<string, unknown> = {};
      for (const m of ["select", "insert", "update", "upsert", "eq"]) {
        chain[m] = vi.fn((...args: unknown[]) => {
          q.ops.push({ name: m, args });
          return chain;
        });
      }
      chain.maybeSingle = vi.fn(async () => run());
      chain.then = (resolve: (v: unknown) => unknown, reject?: (e: unknown) => unknown) => Promise.resolve().then(run).then(resolve, reject);
      return chain;
    }),
  };
}
const SECRET = "whsec_test";
const USER = "9b2f4a1e-1111-4222-8333-444455556666";
function signed(event: unknown) {
  const raw = JSON.stringify(event);
  const t = Math.floor(Date.now() / 1000);
  const sig = createHmac("sha256", SECRET).update(`${t}.${raw}`, "utf8").digest("hex");
  return post("http://x/api/sake/stripe-webhook", raw, { "stripe-signature": `t=${t},v1=${sig}` });
}
const updates = (table: string) => queries.filter((q) => q.table === table && q.ops.some((o) => o.name === "update")).map((q) => q.ops.find((o) => o.name === "update")!.args[0]);

describe("POST /api/sake/stripe-webhook", () => {
  beforeEach(() => {
    queries = [];
    respond = () => undefined;
    vi.stubEnv("SAKE_STRIPE_WEBHOOK_SECRET", SECRET);
    vi.mocked(createServiceRoleClient).mockReturnValue(makeDb() as never);
    vi.mocked(isServiceRoleConfigured).mockReturnValue(true);
    vi.mocked(sendEmail).mockClear();
  });

  it("needs its secret and a valid signature", async () => {
    vi.stubEnv("SAKE_STRIPE_WEBHOOK_SECRET", "");
    expect((await webhook(signed({ type: "x", data: { object: {} } }))).status).toBe(503);
    vi.stubEnv("SAKE_STRIPE_WEBHOOK_SECRET", SECRET);
    expect((await webhook(post("http://x/api", "{}", { "stripe-signature": "t=1,v1=00" }))).status).toBe(400);
    vi.mocked(isServiceRoleConfigured).mockReturnValue(false);
    expect((await webhook(signed({ type: "x", data: { object: {} } }))).status).toBe(500);
  });

  it("marks a paid order with its shipping details and emails the owner, once", async () => {
    respond = (q) =>
      q.table === "sake_orders" && q.ops.some((o) => o.name === "select")
        ? { data: { id: 5, status: "pending", items: [{ name: "Born Gold", quantity: 2 }], total_cents: 9000 } }
        : undefined;
    const event = {
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_1",
          mode: "payment",
          customer: "cus_1",
          amount_total: 9999,
          payment_intent: "pi_1",
          metadata: { app: "sake", supabase_user_id: USER, customer_email: "a@b.c" },
          collected_information: { shipping_details: { name: "Mia", address: { city: "Austin" } } },
        },
      },
    };
    expect((await webhook(signed(event))).status).toBe(200);
    expect(updates("sake_orders")[0]).toMatchObject({ status: "paid", total_cents: 9999, shipping_name: "Mia", shipping_address: { city: "Austin" } });
    expect(sendEmail).toHaveBeenCalledWith("tony@tonygreenberg.com", expect.stringContaining("new order"), expect.stringContaining("2 × Born Gold"));

    queries = [];
    respond = (q) => (q.table === "sake_orders" ? { data: { id: 5, status: "paid", items: [], total_cents: 9000 } } : undefined);
    await webhook(signed(event));
    expect(updates("sake_orders")).toHaveLength(0);
  });

  it("ignores other apps' checkouts and unknown sessions", async () => {
    await webhook(signed({ type: "checkout.session.completed", data: { object: { id: "cs_x", metadata: { app: "aqueous" } } } }));
    await webhook(signed({ type: "checkout.session.completed", data: { object: { id: "cs_y", metadata: { app: "sake" } } } }));
    expect(updates("sake_orders")).toHaveLength(0);
  });

  it("records a new box subscription and later status changes", async () => {
    const sub: StripeSubscription = { id: "sub_1", customer: "cus_1", status: "active", current_period_end: 1800000000, metadata: { app: "sake", supabase_user_id: USER, plan_tier: "connoisseur" } };
    vi.mocked(retrieveSubscription).mockResolvedValue(sub);
    const checkout = { type: "checkout.session.completed", data: { object: { id: "cs_2", mode: "subscription", subscription: "sub_1", customer: "cus_1", metadata: { app: "sake", supabase_user_id: USER, plan_tier: "connoisseur" } } } };
    expect((await webhook(signed(checkout))).status).toBe(200);
    const insert = queries.find((q) => q.table === "sake_subscriptions" && q.ops.some((o) => o.name === "insert"))!;
    expect(insert.ops.find((o) => o.name === "insert")!.args[0]).toMatchObject({ stripe_subscription_id: "sub_1", plan_tier: "connoisseur", status: "active", user_id: USER });
    expect(sendEmail).toHaveBeenCalled();

    queries = [];
    respond = (q) => (q.table === "sake_subscriptions" && q.ops.some((o) => o.name === "select") ? { data: { id: 9 } } : undefined);
    await webhook(signed({ type: "customer.subscription.deleted", data: { object: { ...sub, status: "canceled" } } }));
    expect(updates("sake_subscriptions")[0]).toMatchObject({ status: "canceled" });
    queries = [];
    await webhook(signed({ type: "customer.subscription.updated", data: { object: { ...sub, metadata: { app: "aqueous" } } } }));
    expect(queries).toHaveLength(0);
  });

  it("expires an unpaid order and reports handler failures so Stripe retries", async () => {
    await webhook(signed({ type: "checkout.session.expired", data: { object: { id: "cs_3" } } }));
    expect(updates("sake_orders")[0]).toMatchObject({ status: "expired" });
    respond = () => ({ error: { message: "db down" } });
    expect((await webhook(signed({ type: "checkout.session.expired", data: { object: { id: "cs_3" } } }))).status).toBe(500);
  });
});

describe("POST /api/sake/stripe-webhook: subscription edge cases", () => {
  beforeEach(() => {
    queries = [];
    respond = () => undefined;
    vi.stubEnv("SAKE_STRIPE_WEBHOOK_SECRET", SECRET);
    vi.mocked(createServiceRoleClient).mockReturnValue(makeDb() as never);
    vi.mocked(isServiceRoleConfigured).mockReturnValue(true);
  });

  it("finds the member from the saved customer, and skips subscriptions it can't place", async () => {
    const sub = { id: "sub_9", customer: "cus_9", status: "active", metadata: { app: "sake", plan_tier: "omakase" } };
    respond = (q) => (q.table === "sake_stripe_customers" ? { data: { user_id: USER } } : undefined);
    await webhook(signed({ type: "customer.subscription.created", data: { object: sub } }));
    expect(queries.some((q) => q.table === "sake_subscriptions" && q.ops.some((o) => o.name === "insert"))).toBe(true);

    queries = [];
    respond = () => undefined;
    await webhook(signed({ type: "customer.subscription.created", data: { object: sub } }));
    expect(queries.some((q) => q.table === "sake_subscriptions" && q.ops.some((o) => o.name === "insert"))).toBe(false);

    queries = [];
    await webhook(signed({ type: "customer.subscription.created", data: { object: { ...sub, metadata: { app: "sake", supabase_user_id: USER } } } }));
    expect(queries.some((q) => q.table === "sake_subscriptions" && q.ops.some((o) => o.name === "insert"))).toBe(false);
  });

  it("ignores unknown events and events without a session id", async () => {
    expect((await webhook(signed({ type: "invoice.paid", data: { object: {} } }))).status).toBe(200);
    expect((await webhook(signed({ type: "checkout.session.expired", data: { object: {} } }))).status).toBe(200);
    expect((await webhook(signed({ type: "checkout.session.completed", data: { object: {} } }))).status).toBe(200);
    expect(queries).toHaveLength(0);
  });
});
