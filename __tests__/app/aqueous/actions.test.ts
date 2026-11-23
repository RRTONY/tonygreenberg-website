import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  claimReferral,
  createProject,
  createReport,
  deleteProject,
  getAqueousMember,
  getDashboard,
  getMyCredit,
  getMyReferral,
  getReferralLeaderboard,
  getReport,
  listProjects,
  startCheckout,
  trackShare,
} from "@/app/aqueous/actions";
import { fakeSupabase } from "@tests/helpers/supabase";
import { headerJar } from "@tests/helpers/next";
import { createServiceRoleClient, isServiceRoleConfigured } from "@/lib/supabase/service-role";
import { isStripeConfigured } from "@/lib/stripe";
import { createAqueousCheckout, createAqueousCustomer } from "@/lib/content/aqueous/aqueous-stripe";
import type { AqueousProductType } from "@/lib/content/aqueous/products";

vi.mock("@/lib/stripe", () => ({ isStripeConfigured: vi.fn(() => true) }));
vi.mock("@/lib/content/aqueous/aqueous-stripe", () => ({
  createAqueousCustomer: vi.fn(),
  createAqueousCheckout: vi.fn(),
}));

// ─── A table-aware fake database ───
// Each `from(table)` gets its own chain that records the calls made on it. When the chain is
// awaited (or .single()/.maybeSingle() is called) `respond(query)` decides the result, so parallel
// queries (Promise.all) are answered by what they ask for, never by the order they happen to run.

type DbError = { message: string; code?: string };
type Result = { data?: unknown; error?: DbError | null; count?: number | null };
type Query = { table: string; ops: { name: string; args: unknown[] }[]; end?: "then" | "single" | "maybeSingle" };

const METHODS = ["select", "insert", "update", "upsert", "delete", "eq", "neq", "gt", "gte", "ilike", "in", "order", "limit"];
let respond: (q: Query) => Result | undefined = () => undefined;
let queries: Query[] = [];

function makeDb() {
  const from = vi.fn((table: string) => {
    const q: Query = { table, ops: [] };
    const run = (end: NonNullable<Query["end"]>) => {
      q.end = end;
      queries.push(q);
      return { data: null, error: null, count: null, ...(respond(q) ?? {}) };
    };
    const chain: Record<string, unknown> = {};
    for (const m of METHODS) {
      chain[m] = vi.fn((...args: unknown[]) => {
        q.ops.push({ name: m, args });
        return chain;
      });
    }
    chain.single = vi.fn(async () => run("single"));
    chain.maybeSingle = vi.fn(async () => run("maybeSingle"));
    chain.then = (resolve: (v: unknown) => unknown, reject?: (e: unknown) => unknown) =>
      Promise.resolve()
        .then(() => run("then"))
        .then(resolve, reject);
    return chain;
  });
  return { from };
}

const args = (q: Query, name: string) => q.ops.find((o) => o.name === name)?.args;
const has = (q: Query, name: string, ...want: unknown[]) =>
  q.ops.some((o) => o.name === name && want.every((w, i) => JSON.stringify(o.args[i]) === JSON.stringify(w)));
const isHead = (q: Query) => Boolean((args(q, "select")?.[1] as { head?: boolean } | undefined)?.head);
/** The first argument of every `name` call (insert/update/...) made on `table`. */
const written = (table: string, name: string) => queries.filter((q) => q.table === table && has(q, name)).map((q) => args(q, name)![0]);

// ─── Members ───

const ME = { id: "9b2f4a1e-1111-4222-8333-444455556666", email: "me@example.com", user_metadata: { full_name: "Mia Rivers" } };
const OWNER = { id: "0c0c0c0c-1111-4222-8333-444455556666", email: "Owner@Example.com", user_metadata: { name: "Tony" } };

function signIn(user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> } = ME) {
  fakeSupabase.auth.getUser.mockResolvedValue({ data: { user }, error: null } as never);
}

const UNAVAILABLE = "This couldn't be done just now. Please try again in a minute.";
const SIGNED_OUT_ERROR = { ok: false, error: "Please sign in first.", signedOut: true };
const TOO_MANY = "That's a lot at once. Please wait a few minutes.";
const future = new Date(Date.now() + 86_400_000).toISOString();
const past = new Date(Date.now() - 86_400_000).toISOString();

// The usual state of the referral/report tables; `extra` answers a query first when it returns something.
type World = {
  codeRow: { id?: number; code: string; share_count: number } | null;
  signups: number;
  credits: { amount: string | number }[];
  subs: { stripe_subscription_id: string; status: string; current_period_end: string | null }[];
  paid: number;
  made: number;
  purchases: unknown[];
  reports: unknown[];
};
function world(over: Partial<World> = {}, extra?: (q: Query) => Result | undefined) {
  const w: World = {
    codeRow: { id: 7, code: "AQ-ABC234", share_count: 3 },
    signups: 0,
    credits: [],
    subs: [],
    paid: 0,
    made: 0,
    purchases: [],
    reports: [],
    ...over,
  };
  respond = (q) => {
    const special = extra?.(q);
    if (special) return special;
    switch (q.table) {
      case "aqueous_referral_codes":
        return { data: w.codeRow };
      case "aqueous_referral_signups":
        return { count: w.signups };
      case "aqueous_referral_credits":
        return { data: w.credits };
      case "aqueous_subscriptions":
        return { data: w.subs };
      case "aqueous_purchases":
        return isHead(q) ? { count: w.paid } : { data: w.purchases };
      case "aqueous_reports":
        return isHead(q) ? { count: w.made } : { data: w.reports };
      default:
        return undefined;
    }
  };
}

beforeEach(() => {
  queries = [];
  respond = () => undefined;
  vi.mocked(createServiceRoleClient).mockReturnValue(makeDb() as never);
  vi.mocked(isServiceRoleConfigured).mockReturnValue(true);
  vi.mocked(isStripeConfigured).mockReturnValue(true);
  vi.mocked(createAqueousCustomer).mockResolvedValue({ id: "cus_new" });
  vi.mocked(createAqueousCheckout).mockResolvedValue({ id: "cs_test_1", url: "https://checkout.stripe.com/c/pay/cs_test_1" });
  vi.stubEnv("ADMIN_EMAILS", "someone@else.com, owner@example.com");
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getAqueousMember", () => {
  const signedOut = { signedIn: false, email: null, name: null, isAdmin: false, subscriptionStatus: null };

  it("is signed out without a session, or when the database isn't configured", async () => {
    expect(await getAqueousMember()).toEqual(signedOut);
    signIn();
    vi.mocked(isServiceRoleConfigured).mockReturnValue(false);
    expect(await getAqueousMember()).toEqual(signedOut);
    expect(queries).toHaveLength(0);
  });

  it("reports the member, their name and an active plan that hasn't ended", async () => {
    signIn();
    world({
      subs: [
        { stripe_subscription_id: "sub_old", status: "canceled", current_period_end: future },
        { stripe_subscription_id: "sub_1", status: "active", current_period_end: future },
      ],
    });
    expect(await getAqueousMember()).toEqual({
      signedIn: true,
      email: "me@example.com",
      name: "Mia Rivers",
      isAdmin: false,
      subscriptionStatus: "active",
    });
    const q = queries.find((x) => x.table === "aqueous_subscriptions")!;
    expect(has(q, "eq", "user_id", ME.id)).toBe(true);
    expect(has(q, "order", "updated_at", { ascending: false })).toBe(true);
  });

  it("counts a trial with no end date, and falls back to the latest row's status", async () => {
    signIn(OWNER);
    world({ subs: [{ stripe_subscription_id: "sub_t", status: "trialing", current_period_end: null }] });
    expect(await getAqueousMember()).toMatchObject({ name: "Tony", isAdmin: true, subscriptionStatus: "active" });

    world({ subs: [{ stripe_subscription_id: "sub_1", status: "active", current_period_end: past }] });
    expect(await getAqueousMember()).toMatchObject({ subscriptionStatus: "active" });
    world({ subs: [{ stripe_subscription_id: "sub_1", status: "past_due", current_period_end: future }] });
    expect(await getAqueousMember()).toMatchObject({ subscriptionStatus: "past_due" });
    world({ subs: [] });
    expect(await getAqueousMember()).toMatchObject({ subscriptionStatus: null });
  });

  it("has no name when the metadata has none, and no email when the account has none", async () => {
    signIn({ id: ME.id, email: null, user_metadata: { full_name: 42 } });
    world();
    expect(await getAqueousMember()).toMatchObject({ signedIn: true, email: null, name: null, isAdmin: false });
  });
});

describe("getMyReferral", () => {
  it("is null when signed out", async () => {
    expect(await getMyReferral()).toBeNull();
    expect(queries).toHaveLength(0);
  });

  it("returns the member's existing code with sign-ups and credit (by email)", async () => {
    signIn();
    world({ signups: 10, credits: [{ amount: "5.00" }, { amount: 5 }, { amount: "-2.5" }] });
    expect(await getMyReferral()).toEqual({ code: "AQ-ABC234", shares: 3, signups: 10, credits: "7.50", freeReportUnlocked: true });
    expect(written("aqueous_referral_codes", "insert")).toHaveLength(0);
    const credit = queries.find((q) => q.table === "aqueous_referral_credits")!;
    expect(has(credit, "ilike", "email", "me@example.com")).toBe(true);
    const count = queries.find((q) => q.table === "aqueous_referral_signups")!;
    expect(has(count, "eq", "referrer_code", "AQ-ABC234")).toBe(true);
  });

  it("is not unlocked under 10 sign-ups, and a negative balance shows as 0", async () => {
    signIn();
    world({ signups: 9, credits: [{ amount: 5 }, { amount: -12 }] });
    expect(await getMyReferral()).toMatchObject({ signups: 9, credits: "0.00", freeReportUnlocked: false });
  });

  it("has no credit without an email (no ledger lookup)", async () => {
    signIn({ id: ME.id, email: null });
    world({ credits: [{ amount: 50 }] });
    expect(await getMyReferral()).toMatchObject({ credits: "0.00" });
    expect(queries.some((q) => q.table === "aqueous_referral_credits")).toBe(false);
  });

  it("creates one code for a member who has none", async () => {
    signIn();
    world({ codeRow: null }, (q) =>
      q.table === "aqueous_referral_codes" && has(q, "insert")
        ? { data: { code: (args(q, "insert")![0] as { code: string }).code, share_count: 0 } }
        : undefined,
    );
    const stats = await getMyReferral();
    const [insert] = written("aqueous_referral_codes", "insert") as { code: string; user_id: string; email: string }[];
    expect(insert).toEqual({ code: expect.stringMatching(/^AQ-[A-HJ-NP-Z2-9]{6}$/), user_id: ME.id, email: "me@example.com" });
    expect(stats).toMatchObject({ code: insert.code, shares: 0, signups: 0 });
  });

  it("retries with a new code when the code is taken (23505)", async () => {
    signIn();
    let attempts = 0;
    world({ codeRow: null }, (q) => {
      if (q.table !== "aqueous_referral_codes" || !has(q, "insert")) return undefined;
      attempts++;
      return attempts === 1
        ? { error: { message: "duplicate key", code: "23505" } }
        : { data: { code: (args(q, "insert")![0] as { code: string }).code, share_count: 0 } };
    });
    const stats = await getMyReferral();
    const inserts = written("aqueous_referral_codes", "insert") as { code: string }[];
    expect(inserts).toHaveLength(2);
    expect(stats?.code).toBe(inserts[1].code);
    // It looked for a row from a parallel request before retrying.
    expect(queries.filter((q) => q.table === "aqueous_referral_codes" && q.end === "maybeSingle")).toHaveLength(2);
  });

  it("uses the row a parallel request just made when its insert collides", async () => {
    signIn();
    let reads = 0;
    world({ codeRow: null }, (q) => {
      if (q.table !== "aqueous_referral_codes") return undefined;
      if (has(q, "insert")) return { error: { message: "duplicate key", code: "23505" } };
      reads++;
      return { data: reads === 1 ? null : { code: "AQ-PARALL", share_count: 1 } };
    });
    expect(await getMyReferral()).toMatchObject({ code: "AQ-PARALL", shares: 1 });
    expect(written("aqueous_referral_codes", "insert")).toHaveLength(1);
  });

  it("gives up (null) after five collisions or on any other database error", async () => {
    signIn();
    world({ codeRow: null }, (q) =>
      q.table === "aqueous_referral_codes" && has(q, "insert") ? { error: { message: "duplicate key", code: "23505" } } : undefined,
    );
    expect(await getMyReferral()).toBeNull();
    expect(written("aqueous_referral_codes", "insert")).toHaveLength(5);
    expect(console.error).toHaveBeenCalledWith("[aqueous] getMyReferral:", "Could not create a referral code");

    queries = [];
    world({ codeRow: null }, (q) =>
      q.table === "aqueous_referral_codes" && has(q, "insert") ? { error: { message: "permission denied", code: "42501" } } : undefined,
    );
    expect(await getMyReferral()).toBeNull();
    expect(written("aqueous_referral_codes", "insert")).toHaveLength(1);
    expect(console.error).toHaveBeenCalledWith("[aqueous] getMyReferral:", "permission denied");
  });
});

describe("trackShare", () => {
  it("does nothing for a signed-out visitor or a member without a code", async () => {
    expect(await trackShare()).toEqual({ ok: true, data: null });
    expect(queries).toHaveLength(0);
    signIn();
    world({ codeRow: null });
    expect(await trackShare()).toEqual({ ok: true, data: null });
    expect(written("aqueous_referral_codes", "update")).toHaveLength(0);
  });

  it("adds one to the member's share count", async () => {
    signIn();
    world();
    expect(await trackShare()).toEqual({ ok: true, data: null });
    expect(written("aqueous_referral_codes", "update")).toEqual([{ share_count: 4 }]);
    const update = queries.find((q) => has(q, "update"))!;
    expect(has(update, "eq", "id", 7)).toBe(true);
  });

  it("fails quietly when the update fails", async () => {
    signIn();
    world({}, (q) => (has(q, "update") ? { error: { message: "boom" } } : undefined));
    expect(await trackShare()).toEqual({ ok: false, error: UNAVAILABLE });
    expect(console.error).toHaveBeenCalledWith("[aqueous] trackShare:", "boom");
  });
});

describe("claimReferral", () => {
  const referrer = { code: "AQ-ABC234", email: "Friend@Example.com" };

  function claimWorld(over: { referrer?: unknown; existing?: unknown; recent?: number; total?: number; insert?: Result; credits?: Result } = {}) {
    respond = (q) => {
      if (q.table === "aqueous_referral_codes") return { data: "referrer" in over ? over.referrer : referrer };
      if (q.table === "aqueous_referral_signups") {
        if (has(q, "insert")) return over.insert ?? { data: { id: 55 } };
        if (has(q, "update")) return {};
        if (q.end === "maybeSingle") return { data: over.existing ?? null };
        return { count: has(q, "gte") ? (over.recent ?? 0) : (over.total ?? 1) };
      }
      if (q.table === "aqueous_referral_credits") return over.credits ?? {};
      return undefined;
    };
  }

  it("is unavailable without the database", async () => {
    vi.mocked(isServiceRoleConfigured).mockReturnValue(false);
    expect(await claimReferral("AQ-ABC234", { email: "new@example.com" })).toEqual({ ok: false, error: UNAVAILABLE });
  });

  it("checks the email and the code before touching the database", async () => {
    expect(await claimReferral("AQ-ABC234", { email: "not-an-email" })).toEqual({ ok: false, error: "Please enter a valid email." });
    expect(await claimReferral("AQ-ABC234", { email: "" })).toEqual({ ok: false, error: "Please enter your email." });
    expect(await claimReferral("AQ-ABC234", { email: "a@b.co", name: "x".repeat(256) })).toEqual({
      ok: false,
      error: "That name is too long.",
    });
    for (const bad of ["ABC234", "AQ-ABC23", "AQ-ABC2345", "AQ-ABC 23", null as unknown as string]) {
      expect(await claimReferral(bad, { email: "new@example.com" })).toEqual({ ok: false, error: "That referral link isn't valid." });
    }
    expect(queries).toHaveLength(0);
  });

  it("rejects a code nobody owns, and the referrer's own email", async () => {
    claimWorld({ referrer: null });
    expect(await claimReferral("AQ-ZZZ999", { email: "new@example.com" })).toEqual({ ok: false, error: "That referral link isn't valid." });
    claimWorld();
    expect(await claimReferral("AQ-ABC234", { email: "friend@EXAMPLE.com" })).toEqual({
      ok: false,
      error: "You can't claim your own referral link.",
    });
    expect(written("aqueous_referral_signups", "insert")).toHaveLength(0);
  });

  it("says already claimed when the email claimed any code before", async () => {
    claimWorld({ existing: { id: 3 } });
    expect(await claimReferral("AQ-ABC234", { email: "New@Example.com" })).toEqual({ ok: true, data: { alreadyClaimed: true } });
    const lookup = queries.find((q) => q.table === "aqueous_referral_signups")!;
    expect(has(lookup, "eq", "referred_email", "new@example.com")).toBe(true);
    expect(written("aqueous_referral_signups", "insert")).toHaveLength(0);
  });

  it("stops a flood of claims on one code (5 in 10 minutes)", async () => {
    claimWorld({ recent: 5 });
    expect(await claimReferral("AQ-ABC234", { email: "new@example.com" })).toEqual({ ok: false, error: TOO_MANY });
    const flood = queries.find((q) => has(q, "gte"))!;
    expect(has(flood, "eq", "referrer_code", "AQ-ABC234")).toBe(true);
    const since = new Date(args(flood, "gte")![1] as string).getTime();
    expect(Math.abs(Date.now() - 10 * 60 * 1000 - since)).toBeLessThan(5000);
    expect(written("aqueous_referral_signups", "insert")).toHaveLength(0);
  });

  it("records the sign-up and $5 for both sides, then reports the total", async () => {
    claimWorld({ recent: 4, total: 10 });
    expect(await claimReferral("  aq-abc234 ", { email: "  New@Example.com ", name: " Nia " })).toEqual({
      ok: true,
      data: { alreadyClaimed: false, totalSignups: 10, freeReportUnlocked: true },
    });
    expect(written("aqueous_referral_signups", "insert")).toEqual([
      { referrer_code: "AQ-ABC234", referred_email: "new@example.com", referred_name: "Nia" },
    ]);
    expect(written("aqueous_referral_credits", "insert")).toEqual([
      [
        { email: "new@example.com", amount: 5, reason: "referral_discount", referral_signup_id: 55 },
        { email: "Friend@Example.com", amount: 5, reason: "referral_reward", referral_signup_id: 55 },
      ],
    ]);
    expect(written("aqueous_referral_signups", "update")).toEqual([{ discount_applied: true, referrer_credited: true }]);
    expect(has(queries.find((q) => has(q, "update"))!, "eq", "id", 55)).toBe(true);
  });

  it("gives only the visitor's $5 when the referrer has no email, and no name is null", async () => {
    claimWorld({ referrer: { code: "AQ-ABC234", email: null }, total: 2 });
    expect(await claimReferral("AQ-ABC234", { email: "new@example.com", name: "" })).toEqual({
      ok: true,
      data: { alreadyClaimed: false, totalSignups: 2, freeReportUnlocked: false },
    });
    expect((written("aqueous_referral_signups", "insert")[0] as { referred_name: unknown }).referred_name).toBeNull();
    expect(written("aqueous_referral_credits", "insert")).toEqual([
      [{ email: "new@example.com", amount: 5, reason: "referral_discount", referral_signup_id: 55 }],
    ]);
    expect(written("aqueous_referral_signups", "update")).toEqual([{ discount_applied: true, referrer_credited: false }]);
  });

  it("treats a racing duplicate insert as already claimed", async () => {
    claimWorld({ insert: { error: { message: "duplicate", code: "23505" } } });
    expect(await claimReferral("AQ-ABC234", { email: "new@example.com" })).toEqual({ ok: true, data: { alreadyClaimed: true } });
    expect(written("aqueous_referral_credits", "insert")).toHaveLength(0);
  });

  it("fails quietly when the sign-up or the credits can't be saved", async () => {
    claimWorld({ insert: { error: { message: "insert failed" } } });
    expect(await claimReferral("AQ-ABC234", { email: "new@example.com" })).toEqual({ ok: false, error: UNAVAILABLE });
    claimWorld({ insert: { data: null } });
    expect(await claimReferral("AQ-ABC234", { email: "new@example.com" })).toEqual({ ok: false, error: UNAVAILABLE });
    expect(console.error).toHaveBeenCalledWith("[aqueous] claimReferral:", "no row");
    claimWorld({ credits: { error: { message: "credit failed" } } });
    expect(await claimReferral("AQ-ABC234", { email: "new@example.com" })).toEqual({ ok: false, error: UNAVAILABLE });
    expect(console.error).toHaveBeenCalledWith("[aqueous] claimReferral credits:", "credit failed");
    expect(written("aqueous_referral_signups", "update")).toHaveLength(0);
  });
});

describe("getReferralLeaderboard", () => {
  it("is empty without the database or without sign-ups", async () => {
    vi.mocked(isServiceRoleConfigured).mockReturnValue(false);
    expect(await getReferralLeaderboard()).toEqual([]);
    vi.mocked(isServiceRoleConfigured).mockReturnValue(true);
    respond = () => ({ data: [] });
    expect(await getReferralLeaderboard()).toEqual([]);
    expect(queries.some((q) => q.table === "aqueous_referral_codes")).toBe(false);
  });

  function leaderboardWorld() {
    const signups = [
      ...Array(3).fill({ referrer_code: "AQ-BBBBBB" }),
      ...Array(5).fill({ referrer_code: "AQ-AAAAAA" }),
      { referrer_code: "AQ-CCCCCC" },
      ...Array(2).fill({ referrer_code: "AQ-DDDDDD" }),
    ];
    respond = (q) =>
      q.table === "aqueous_referral_signups"
        ? { data: signups }
        : {
            data: [
              { code: "AQ-AAAAAA", email: "jane@gmail.com" },
              { code: "AQ-BBBBBB", email: "alexander@x.io" },
              { code: "AQ-CCCCCC", email: null },
            ],
          };
  }

  it("ranks codes by sign-ups and masks the owners' emails", async () => {
    leaderboardWorld();
    expect(await getReferralLeaderboard()).toEqual([
      { code: "AQ-AAAAAA", signups: 5, displayName: "j***@gmail.com" },
      { code: "AQ-BBBBBB", signups: 3, displayName: "a****@x.io" },
      { code: "AQ-DDDDDD", signups: 2, displayName: "Anonymous" },
      { code: "AQ-CCCCCC", signups: 1, displayName: "Anonymous" },
    ]);
    const codes = queries.find((q) => q.table === "aqueous_referral_codes")!;
    expect(args(codes, "in")).toEqual(["code", ["AQ-AAAAAA", "AQ-BBBBBB", "AQ-DDDDDD", "AQ-CCCCCC"]]);
  });

  it("keeps the limit between 1 and 50", async () => {
    leaderboardWorld();
    expect((await getReferralLeaderboard(2)).map((r) => r.code)).toEqual(["AQ-AAAAAA", "AQ-BBBBBB"]);
    expect(await getReferralLeaderboard(0)).toHaveLength(1);
    expect(await getReferralLeaderboard(500)).toHaveLength(4);
  });
});

describe("directory projects", () => {
  const row = { id: 2, name: "Aqueous", description: null, url: "/aqueous", tag: "water", sort_order: 1 };

  it("lists projects in order, or nothing without the database or on an error", async () => {
    respond = () => ({ data: [row] });
    expect(await listProjects()).toEqual([{ id: 2, name: "Aqueous", description: null, url: "/aqueous", tag: "water", sortOrder: 1 }]);
    const q = queries[0];
    expect(q.table).toBe("aqueous_projects");
    expect(has(q, "order", "sort_order", { ascending: true })).toBe(true);

    respond = () => ({ data: null, error: { message: "nope" } });
    expect(await listProjects()).toEqual([]);
    expect(console.error).toHaveBeenCalledWith("[aqueous] listProjects:", "nope");
    vi.mocked(isServiceRoleConfigured).mockReturnValue(false);
    expect(await listProjects()).toEqual([]);
  });

  it("lets only the owner add or delete one", async () => {
    expect(await createProject({ name: "X", url: "/x" })).toEqual(SIGNED_OUT_ERROR);
    expect(await deleteProject(2)).toEqual(SIGNED_OUT_ERROR);
    signIn();
    const notOwner = { ok: false, error: "Only the site owner can do that." };
    expect(await createProject({ name: "X", url: "/x" })).toEqual(notOwner);
    expect(await deleteProject(2)).toEqual(notOwner);
    vi.mocked(isServiceRoleConfigured).mockReturnValue(false);
    signIn(OWNER);
    expect(await createProject({ name: "X", url: "/x" })).toEqual({ ok: false, error: UNAVAILABLE });
    expect(queries).toHaveLength(0);
  });

  it("checks the project form on the server", async () => {
    signIn(OWNER);
    expect(await createProject({ name: "", url: "/x" })).toEqual({ ok: false, error: "Please enter a project name." });
    expect(await createProject({ name: "   ", url: "/x" })).toEqual({ ok: false, error: "Please enter a project name." });
    expect(await createProject({ name: "X", url: "" })).toEqual({ ok: false, error: "Please enter a URL." });
    for (const url of ["//evil.com", "javascript:alert(1)", "ftp://x.com", "not a url"]) {
      expect(await createProject({ name: "X", url })).toEqual({
        ok: false,
        error: "Please enter a full address (https://...) or a path starting with /.",
      });
    }
    expect(queries).toHaveLength(0);
  });

  it("adds a project at the end of the list, with empty optional fields saved as null", async () => {
    signIn(OWNER);
    respond = (q) => (has(q, "insert") ? { data: { id: 9 } } : { data: [{ sort_order: 4 }] });
    expect(await createProject({ name: " Liquid Sun ", url: "https://tonygreenberg.com/liquid-sun", description: "", tag: "" })).toEqual({
      ok: true,
      data: { id: 9 },
    });
    expect(written("aqueous_projects", "insert")).toEqual([
      { name: "Liquid Sun", url: "https://tonygreenberg.com/liquid-sun", description: null, tag: null, sort_order: 5 },
    ]);

    queries = [];
    respond = (q) => (has(q, "insert") ? { data: { id: 1 } } : { data: [] });
    await createProject({ name: "First", url: "/first", description: "About", tag: "new" });
    expect(written("aqueous_projects", "insert")).toEqual([{ name: "First", url: "/first", description: "About", tag: "new", sort_order: 1 }]);
  });

  it("fails quietly when the insert fails", async () => {
    signIn(OWNER);
    respond = (q) => (has(q, "insert") ? { error: { message: "insert failed" } } : { data: [] });
    expect(await createProject({ name: "X", url: "/x" })).toEqual({ ok: false, error: UNAVAILABLE });
  });

  it("deletes a project by a real id", async () => {
    signIn(OWNER);
    expect(await deleteProject(0)).toEqual({ ok: false, error: "Unknown project." });
    expect(await deleteProject(1.5)).toEqual({ ok: false, error: "Unknown project." });
    expect(await deleteProject(4)).toEqual({ ok: true, data: null });
    const del = queries.find((q) => has(q, "delete"))!;
    expect(del.table).toBe("aqueous_projects");
    expect(has(del, "eq", "id", 4)).toBe(true);
    respond = () => ({ error: { message: "delete failed" } });
    expect(await deleteProject(4)).toEqual({ ok: false, error: UNAVAILABLE });
  });
});

describe("getMyCredit", () => {
  it("is 0 when signed out, else the member's balance", async () => {
    expect(await getMyCredit()).toBe(0);
    signIn();
    world({ credits: [{ amount: "5" }, { amount: "2.255" }] });
    expect(await getMyCredit()).toBe(7.26);
  });
});

describe("startCheckout", () => {
  type CheckoutOver = {
    recent?: number;
    openWithCredit?: number;
    customer?: string | null;
    credits?: { amount: number }[];
    purchase?: Result;
    holdError?: DbError;
  };
  function checkoutWorld(over: CheckoutOver = {}) {
    respond = (q) => {
      if (q.table === "aqueous_purchases") {
        if (has(q, "insert")) return over.purchase ?? { data: { id: 31 } };
        return { count: has(q, "gt") ? (over.openWithCredit ?? 0) : (over.recent ?? 0) };
      }
      if (q.table === "aqueous_stripe_customers") {
        return q.end === "maybeSingle" ? { data: over.customer === null ? null : { stripe_customer_id: over.customer ?? "cus_saved" } } : {};
      }
      if (q.table === "aqueous_referral_credits") {
        return has(q, "insert") ? { error: over.holdError ?? null } : { data: over.credits ?? [] };
      }
      return undefined;
    };
  }
  const creditLookups = () => queries.filter((q) => q.table === "aqueous_referral_credits" && has(q, "select"));

  it("needs a signed-in member, a known product and Stripe", async () => {
    expect(await startCheckout("report")).toEqual(SIGNED_OUT_ERROR);
    signIn();
    checkoutWorld();
    expect(await startCheckout("gold" as AqueousProductType)).toEqual({ ok: false, error: "Unknown product." });
    vi.mocked(isStripeConfigured).mockReturnValue(false);
    expect(await startCheckout("report")).toEqual({ ok: false, error: "Checkout isn't available yet. Please try again later." });
    expect(createAqueousCheckout).not.toHaveBeenCalled();
  });

  it("stops after 5 checkouts in 10 minutes", async () => {
    signIn();
    checkoutWorld({ recent: 5 });
    expect(await startCheckout("report")).toEqual({ ok: false, error: TOO_MANY });
    const flood = queries.find((q) => q.table === "aqueous_purchases")!;
    expect(has(flood, "eq", "user_id", ME.id)).toBe(true);
    expect(has(flood, "gte")).toBe(true);
    expect(createAqueousCheckout).not.toHaveBeenCalled();
  });

  it("starts a report checkout with the saved customer and records it as pending", async () => {
    signIn();
    checkoutWorld();
    expect(await startCheckout("report")).toEqual({ ok: true, data: { url: "https://checkout.stripe.com/c/pay/cs_test_1" } });
    expect(createAqueousCustomer).not.toHaveBeenCalled();
    expect(createAqueousCheckout).toHaveBeenCalledWith({
      customerId: "cus_saved",
      userId: ME.id,
      email: "me@example.com",
      productType: "report",
      origin: "https://tonygreenberg.com",
      creditCents: 0,
    });
    expect(written("aqueous_purchases", "insert")).toEqual([
      { user_id: ME.id, stripe_session_id: "cs_test_1", product_type: "report", status: "pending", credit_applied: "0.00" },
    ]);
    // Credit isn't looked up unless it's asked for, and nothing is held without it.
    expect(queries.some((q) => q.table === "aqueous_referral_credits")).toBe(false);
  });

  it("creates and saves a Stripe customer the first time", async () => {
    signIn();
    checkoutWorld({ customer: null });
    await startCheckout("subscription");
    expect(createAqueousCustomer).toHaveBeenCalledWith({ email: "me@example.com", userId: ME.id });
    expect(written("aqueous_stripe_customers", "upsert")).toEqual([{ user_id: ME.id, stripe_customer_id: "cus_new" }]);
    expect(createAqueousCheckout).toHaveBeenCalledWith(expect.objectContaining({ customerId: "cus_new", productType: "subscription" }));
  });

  it("applies the member's credit to the report and holds it off the balance", async () => {
    signIn();
    checkoutWorld({ credits: [{ amount: 5 }, { amount: 2.5 }] });
    expect(await startCheckout("report", true)).toMatchObject({ ok: true });
    expect(createAqueousCheckout).toHaveBeenCalledWith(expect.objectContaining({ creditCents: 750 }));
    expect(written("aqueous_purchases", "insert")[0]).toMatchObject({ credit_applied: "7.50" });
    expect(written("aqueous_referral_credits", "insert")).toEqual([
      { email: "me@example.com", amount: -7.5, reason: "checkout", purchase_id: 31 },
    ]);
    // Only one credit checkout may be open: it looked for a pending one with credit from the last 24h.
    const open = queries.find((q) => q.table === "aqueous_purchases" && has(q, "gt"))!;
    expect(has(open, "gt", "credit_applied", 0)).toBe(true);
    expect(has(open, "eq", "status", "pending")).toBe(true);
    expect(has(open, "eq", "user_id", ME.id)).toBe(true);
    const since = new Date(open.ops.find((o) => o.name === "gte")!.args[1] as string).getTime();
    expect(Math.abs(Date.now() - 24 * 60 * 60 * 1000 - since)).toBeLessThan(5000);
  });

  it("caps the credit so Stripe still charges $0.50", async () => {
    signIn();
    checkoutWorld({ credits: [{ amount: 25 }] });
    await startCheckout("report", true);
    expect(createAqueousCheckout).toHaveBeenCalledWith(expect.objectContaining({ creditCents: 1950 }));
    expect(written("aqueous_purchases", "insert")[0]).toMatchObject({ credit_applied: "19.50" });
    expect(written("aqueous_referral_credits", "insert")).toEqual([
      { email: "me@example.com", amount: -19.5, reason: "checkout", purchase_id: 31 },
    ]);
  });

  it("doesn't offer credit already held by another open checkout", async () => {
    signIn();
    checkoutWorld({ credits: [{ amount: 25 }], openWithCredit: 1 });
    expect(await startCheckout("report", true)).toMatchObject({ ok: true });
    expect(createAqueousCheckout).toHaveBeenCalledWith(expect.objectContaining({ creditCents: 0 }));
    expect(creditLookups()).toHaveLength(0);
    expect(written("aqueous_referral_credits", "insert")).toHaveLength(0);
  });

  it("applies no credit for a member without an email, or with a zero balance", async () => {
    signIn({ id: ME.id, email: null });
    checkoutWorld({ credits: [{ amount: 25 }] });
    await startCheckout("report", true);
    expect(createAqueousCheckout).toHaveBeenLastCalledWith(expect.objectContaining({ creditCents: 0, email: null }));
    expect(queries.some((q) => q.table === "aqueous_referral_credits")).toBe(false);

    signIn();
    queries = [];
    checkoutWorld({ credits: [] });
    await startCheckout("report", true);
    expect(createAqueousCheckout).toHaveBeenLastCalledWith(expect.objectContaining({ creditCents: 0 }));
    expect(written("aqueous_referral_credits", "insert")).toHaveLength(0);
  });

  it("never applies credit to the monthly plan", async () => {
    signIn();
    checkoutWorld({ credits: [{ amount: 25 }] });
    await startCheckout("subscription", true);
    expect(createAqueousCheckout).toHaveBeenCalledWith(expect.objectContaining({ creditCents: 0 }));
    expect(queries.some((q) => q.table === "aqueous_referral_credits")).toBe(false);
  });

  it("returns to the host the visitor came from", async () => {
    signIn();
    checkoutWorld();
    headerJar.set("x-forwarded-host", "deploy-preview-9--site.netlify.app");
    headerJar.set("x-forwarded-proto", "http");
    await startCheckout("report");
    expect(createAqueousCheckout).toHaveBeenLastCalledWith(expect.objectContaining({ origin: "http://deploy-preview-9--site.netlify.app" }));
    headerJar.clear();
    headerJar.set("host", "localhost:3000");
    await startCheckout("report");
    expect(createAqueousCheckout).toHaveBeenLastCalledWith(expect.objectContaining({ origin: "https://localhost:3000" }));
  });

  it("fails quietly when Stripe, the purchase record or the credit hold fails", async () => {
    signIn();
    checkoutWorld();
    vi.mocked(createAqueousCheckout).mockRejectedValue(new Error("card_declined"));
    expect(await startCheckout("report")).toEqual({ ok: false, error: UNAVAILABLE });
    expect(console.error).toHaveBeenCalledWith("[aqueous] startCheckout:", "card_declined");

    vi.mocked(createAqueousCheckout).mockRejectedValue("plain string");
    expect(await startCheckout("report")).toEqual({ ok: false, error: UNAVAILABLE });
    expect(console.error).toHaveBeenCalledWith("[aqueous] startCheckout:", "plain string");

    vi.mocked(createAqueousCheckout).mockResolvedValue({ id: "cs_2", url: "https://checkout.stripe.com/x" });
    checkoutWorld({ purchase: { error: { message: "insert failed" } } });
    expect(await startCheckout("report")).toEqual({ ok: false, error: UNAVAILABLE });
    expect(console.error).toHaveBeenCalledWith("[aqueous] startCheckout record:", "insert failed");
    checkoutWorld({ purchase: { data: null } });
    expect(await startCheckout("report")).toEqual({ ok: false, error: UNAVAILABLE });
    expect(console.error).toHaveBeenCalledWith("[aqueous] startCheckout record:", "no row");

    checkoutWorld({ credits: [{ amount: 5 }], holdError: { message: "hold failed" } });
    expect(await startCheckout("report", true)).toEqual({ ok: false, error: UNAVAILABLE });
    expect(console.error).toHaveBeenCalledWith("[aqueous] startCheckout hold:", "hold failed");
  });
});

describe("getDashboard", () => {
  const purchase = { id: 1, product_type: "report", status: "completed", credit_applied: "5", created_at: "2026-11-20T00:00:00Z" };
  const report = { id: 3, title: "My AWI Report", status: "complete", created_at: "2026-11-21T00:00:00Z" };

  it("needs a signed-in member", async () => {
    expect(await getDashboard()).toEqual(SIGNED_OUT_ERROR);
  });

  it("gathers purchases, reports, referral, credit, plan and reports left", async () => {
    signIn();
    world({
      purchases: [purchase],
      reports: [report],
      signups: 10,
      credits: [{ amount: 5 }],
      subs: [{ stripe_subscription_id: "sub_1", status: "active", current_period_end: future }],
      paid: 2,
      made: 1,
    });
    const res = await getDashboard();
    expect(res).toEqual({
      ok: true,
      data: {
        user: { name: "Mia Rivers", email: "me@example.com", isAdmin: false },
        purchases: [{ id: 1, productType: "report", status: "completed", creditApplied: "5.00", createdAt: "2026-11-20T00:00:00Z" }],
        reports: [{ id: 3, title: "My AWI Report", status: "complete", createdAt: "2026-11-21T00:00:00Z" }],
        referral: { code: "AQ-ABC234", shares: 3, signups: 10, credits: "5.00", freeReportUnlocked: true },
        credit: 5,
        subscription: { id: "sub_1", status: "active" },
        // 2 paid + 1 free (10 sign-ups) - 1 made
        reportsAvailable: 2,
      },
    });
    const paid = queries.find((q) => q.table === "aqueous_purchases" && isHead(q))!;
    expect(has(paid, "eq", "product_type", "report")).toBe(true);
    expect(has(paid, "eq", "status", "completed")).toBe(true);
    const made = queries.find((q) => q.table === "aqueous_reports" && isHead(q))!;
    expect(has(made, "neq", "status", "failed")).toBe(true);
  });

  it("never shows fewer than 0 reports left, and only counts the free one at 10 sign-ups", async () => {
    signIn();
    world({ paid: 0, made: 3, signups: 10 });
    expect(await getDashboard()).toMatchObject({ ok: true, data: { reportsAvailable: 0, purchases: [], reports: [] } });
    world({ paid: 1, made: 0, signups: 9 });
    expect(await getDashboard()).toMatchObject({ ok: true, data: { reportsAvailable: 1 } });
  });

  it("fails quietly when the purchases or reports can't be read", async () => {
    signIn();
    world({}, (q) => (q.table === "aqueous_reports" && !isHead(q) ? { error: { message: "reports down" } } : undefined));
    expect(await getDashboard()).toEqual({ ok: false, error: UNAVAILABLE });
    expect(console.error).toHaveBeenCalledWith("[aqueous] getDashboard:", "reports down");
  });
});

describe("createReport", () => {
  function reportWorld(
    over: Partial<World> = {},
    { insert = { data: { id: 12 } }, latest = { id: 1 }, failed = null, reset = {} }: { insert?: Result; latest?: unknown; failed?: unknown; reset?: Result } = {},
  ) {
    world(over, (q) => {
      if (q.table === "aqueous_reports" && has(q, "insert")) return insert;
      if (q.table === "aqueous_reports" && has(q, "update")) return reset;
      if (q.table === "aqueous_reports" && q.end === "maybeSingle") return { data: failed };
      if (q.table === "aqueous_purchases" && q.end === "maybeSingle") return { data: latest };
      return undefined;
    });
  }

  it("needs a signed-in member", async () => {
    expect(await createReport()).toEqual(SIGNED_OUT_ERROR);
  });

  it("needs a paid report or the free one", async () => {
    signIn();
    reportWorld({ paid: 1, made: 1, signups: 3 });
    expect(await createReport()).toEqual({
      ok: false,
      error: "Reports come with a report purchase ($20), or free once 10 people sign up with your link.",
    });
    expect(written("aqueous_reports", "insert")).toHaveLength(0);
  });

  it("starts a report on the latest paid purchase, keeping only clean profile numbers", async () => {
    signIn();
    reportWorld({ paid: 1, made: 0 });
    const profile = { quality: 40, purity: 35.5, "bad key": 9, resonance: Number.NaN, hacked: "x" as unknown as number };
    expect(await createReport(profile)).toEqual({ ok: true, data: { reportId: 12 } });
    expect(written("aqueous_reports", "insert")).toEqual([
      { user_id: ME.id, purchase_id: 1, water_profile: { quality: 40, purity: 35.5 }, status: "pending" },
    ]);
    const latest = queries.find((q) => q.table === "aqueous_purchases" && q.end === "maybeSingle")!;
    expect(has(latest, "eq", "status", "completed")).toBe(true);
    // It looked for a failed report of the member's own first.
    const failedLookup = queries.find((q) => q.table === "aqueous_reports" && q.end === "maybeSingle")!;
    expect(has(failedLookup, "eq", "user_id", ME.id)).toBe(true);
    expect(has(failedLookup, "eq", "status", "failed")).toBe(true);
    expect(has(failedLookup, "order", "created_at", { ascending: false })).toBe(true);
  });

  it("uses the free report (no purchase) and caps the profile at 20 entries", async () => {
    signIn();
    reportWorld({ paid: 0, made: 0, signups: 10 }, { insert: { data: { id: 13 } }, latest: null });
    const big = Object.fromEntries(Array.from({ length: 25 }, (_, i) => [`k${String.fromCharCode(97 + i)}`, i]));
    expect(await createReport(big)).toEqual({ ok: true, data: { reportId: 13 } });
    const insert = written("aqueous_reports", "insert")[0] as { purchase_id: unknown; water_profile: Record<string, number> };
    expect(insert.purchase_id).toBeNull();
    expect(Object.keys(insert.water_profile)).toHaveLength(20);

    queries = [];
    await createReport(null);
    expect((written("aqueous_reports", "insert")[0] as { water_profile: unknown }).water_profile).toBeNull();
  });

  it("restarts the member's latest failed report instead of adding a new one", async () => {
    signIn();
    reportWorld({ paid: 1, made: 0 }, { failed: { id: 8 } });
    expect(await createReport({ quality: 60 })).toEqual({ ok: true, data: { reportId: 8 } });
    expect(written("aqueous_reports", "insert")).toHaveLength(0);
    expect(written("aqueous_reports", "update")).toEqual([
      { status: "pending", water_profile: { quality: 60 }, report_content: null, updated_at: expect.any(String) },
    ]);
    const reset = queries.find((q) => q.table === "aqueous_reports" && has(q, "update"))!;
    expect(has(reset, "eq", "id", 8)).toBe(true);
    // Only while it's still failed (a parallel run may have restarted it).
    expect(has(reset, "eq", "status", "failed")).toBe(true);
    expect(queries.some((q) => q.table === "aqueous_purchases" && q.end === "maybeSingle")).toBe(false);
  });

  it("can't turn one allowance into two reports by letting one fail", async () => {
    // One paid report; the first attempt failed, so it doesn't count as made and 1 is still available.
    signIn();
    reportWorld({ paid: 1, made: 0 }, { failed: { id: 8 } });
    const first = await createReport();
    const second = await createReport();
    // Both calls hand back the same report, never a second one.
    expect(first).toEqual({ ok: true, data: { reportId: 8 } });
    expect(second).toEqual({ ok: true, data: { reportId: 8 } });
    expect(written("aqueous_reports", "insert")).toHaveLength(0);
  });

  it("fails quietly when the report can't be saved or restarted", async () => {
    signIn();
    reportWorld({ paid: 1 }, { insert: { error: { message: "insert failed" } } });
    expect(await createReport()).toEqual({ ok: false, error: UNAVAILABLE });
    reportWorld({ paid: 1 }, { insert: { data: null } });
    expect(await createReport()).toEqual({ ok: false, error: UNAVAILABLE });
    expect(console.error).toHaveBeenCalledWith("[aqueous] createReport:", "no row");
    reportWorld({ paid: 1 }, { failed: { id: 8 }, reset: { error: { message: "reset failed" } } });
    expect(await createReport()).toEqual({ ok: false, error: UNAVAILABLE });
    expect(console.error).toHaveBeenCalledWith("[aqueous] createReport reset:", "reset failed");
  });
});

describe("getReport", () => {
  it("needs a signed-in member and a real id", async () => {
    expect(await getReport(1)).toEqual(SIGNED_OUT_ERROR);
    signIn();
    expect(await getReport(0)).toEqual({ ok: false, error: "Report not found" });
    expect(await getReport(2.5)).toEqual({ ok: false, error: "Report not found" });
    expect(queries).toHaveLength(0);
  });

  it("only finds the member's own report", async () => {
    signIn();
    respond = () => ({ data: null });
    expect(await getReport(4)).toEqual({ ok: false, error: "Report not found" });
    const q = queries[0];
    expect(has(q, "eq", "id", 4)).toBe(true);
    expect(has(q, "eq", "user_id", ME.id)).toBe(true);
  });

  it("returns the report, or fails quietly on an error", async () => {
    signIn();
    respond = () => ({
      data: { id: 4, title: "My AWI Report", status: "complete", report_content: "# Report", created_at: "2026-11-21T00:00:00Z" },
    });
    expect(await getReport(4)).toEqual({
      ok: true,
      data: { id: 4, title: "My AWI Report", status: "complete", reportContent: "# Report", createdAt: "2026-11-21T00:00:00Z" },
    });
    respond = () => ({ error: { message: "read failed" } });
    expect(await getReport(4)).toEqual({ ok: false, error: UNAVAILABLE });
  });
});
