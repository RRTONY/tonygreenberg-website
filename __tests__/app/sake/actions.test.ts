import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createAlert,
  createReview,
  deleteAlert,
  getAllLivePrices,
  getMyAlerts,
  getMyFavorites,
  getMyNotifications,
  getMyReviews,
  getMySubscription,
  getReviewsBySake,
  getSakeMember,
  isSakeCheckoutOpen,
  markNotificationsRead,
  recordPriceSnapshot,
  startOrderCheckout,
  startSubscriptionCheckout,
  toggleFavorite,
  updateAlert,
  upvoteReview,
} from "@/app/sake/actions";
import { fakeSupabase } from "@tests/helpers/supabase";
import { createServiceRoleClient, isServiceRoleConfigured } from "@/lib/supabase/service-role";
import {
  createSakeCustomer,
  createSakeOrderCheckout,
  createSakeSubscriptionCheckout,
  isSakeCheckoutEnabled,
  priceCart,
} from "@/lib/content/sake/sake-stripe";
import { qprSakeDatabase } from "@/lib/content/sake/qpr-data";

vi.mock("@/lib/content/sake/sake-stripe", async (importOriginal) => {
  const real = await importOriginal<typeof import("@/lib/content/sake/sake-stripe")>();
  return {
    ...real,
    isSakeCheckoutEnabled: vi.fn(() => true),
    createSakeCustomer: vi.fn(),
    createSakeOrderCheckout: vi.fn(),
    createSakeSubscriptionCheckout: vi.fn(),
  };
});

// ─── A table-aware fake database (same shape as __tests__/app/aqueous/actions.test.ts) ───

type DbError = { message: string; code?: string };
type Result = { data?: unknown; error?: DbError | null; count?: number | null };
type Query = { table: string; ops: { name: string; args: unknown[] }[] };
const METHODS = ["select", "insert", "update", "upsert", "delete", "eq", "neq", "gt", "gte", "in", "not", "order", "limit"];
let respond: (q: Query) => Result | undefined = () => undefined;
let queries: Query[] = [];

function makeDb() {
  const from = vi.fn((table: string) => {
    const q: Query = { table, ops: [] };
    const run = () => {
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
    chain.single = vi.fn(async () => run());
    chain.maybeSingle = vi.fn(async () => run());
    chain.then = (resolve: (v: unknown) => unknown, reject?: (e: unknown) => unknown) =>
      Promise.resolve().then(run).then(resolve, reject);
    return chain;
  });
  return { from };
}

const args = (q: Query, name: string) => q.ops.find((o) => o.name === name)?.args;
const has = (q: Query, name: string, ...want: unknown[]) =>
  q.ops.some((o) => o.name === name && want.every((w, i) => JSON.stringify(o.args[i]) === JSON.stringify(w)));
const isHead = (q: Query) => Boolean((args(q, "select")?.[1] as { head?: boolean } | undefined)?.head);
const written = (table: string, name: string) => queries.filter((q) => q.table === table && has(q, name)).map((q) => args(q, name)![0]);

const ME = { id: "9b2f4a1e-1111-4222-8333-444455556666", email: "me@example.com", user_metadata: { full_name: "Mia Rivers" } };
const OWNER = { id: "0c0c0c0c-1111-4222-8333-444455556666", email: "owner@example.com", user_metadata: {} };
const signIn = (user: typeof ME | typeof OWNER = ME) =>
  fakeSupabase.auth.getUser.mockResolvedValue({ data: { user }, error: null } as never);

const SIGNED_OUT = { ok: false, error: "Please sign in first.", signedOut: true };
const UNAVAILABLE = "This couldn't be done just now. Please try again in a minute.";
const TOO_MANY = "That's a lot at once. Please wait a few minutes.";
const sake = qprSakeDatabase[0];

beforeEach(() => {
  queries = [];
  respond = () => undefined;
  vi.mocked(createServiceRoleClient).mockReturnValue(makeDb() as never);
  vi.mocked(isServiceRoleConfigured).mockReturnValue(true);
  vi.mocked(isSakeCheckoutEnabled).mockReturnValue(true);
  vi.mocked(createSakeCustomer).mockResolvedValue({ id: "cus_new" });
  vi.mocked(createSakeOrderCheckout).mockResolvedValue({ id: "cs_1", url: "https://checkout.stripe.com/c/pay/cs_1" });
  vi.mocked(createSakeSubscriptionCheckout).mockResolvedValue({ id: "cs_2", url: "https://checkout.stripe.com/c/pay/cs_2" });
  vi.stubEnv("ADMIN_EMAILS", "owner@example.com");
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => vi.unstubAllEnvs());

describe("getSakeMember", () => {
  it("is signed out without a session and names the member with one", async () => {
    expect(await getSakeMember()).toEqual({ signedIn: false, id: null, email: null, name: null, isAdmin: false });
    signIn();
    expect(await getSakeMember()).toEqual({ signedIn: true, id: ME.id, email: ME.email, name: "Mia Rivers", isAdmin: false });
    signIn(OWNER);
    expect((await getSakeMember()).isAdmin).toBe(true);
  });
});

describe("reviews", () => {
  const row = {
    id: 1,
    user_id: ME.id,
    user_name: "Mia Rivers",
    sake_id: sake.id,
    sake_name: sake.name,
    rating: 4,
    tasting_note: "Pear",
    flavor_tags: ["fruity", 3],
    serving_temp: null,
    purchase_location: null,
    price_paid_cents: 3000,
    would_buy_again: true,
    upvotes: 2,
    created_at: "2026-11-01T00:00:00Z",
  };

  it("lists a sake's reviews with stats, marking the member's own and upvoted ones", async () => {
    signIn();
    respond = (q) => {
      if (q.table === "sake_review_upvotes") return { data: [{ review_id: 1 }] };
      if (q.table === "sake_reviews" && has(q, "limit", 20)) return { data: [row] };
      if (q.table === "sake_reviews") return { data: [{ rating: 4, would_buy_again: true, price_paid_cents: 3000 }, { rating: 2, would_buy_again: false, price_paid_cents: null }] };
      return undefined;
    };
    const out = await getReviewsBySake(sake.id);
    expect(out.reviews[0]).toMatchObject({ id: 1, userName: "Mia Rivers", flavorTags: ["fruity"], upvotedByMe: true, mine: true, wouldBuyAgain: true });
    expect(out.stats).toEqual({ avgRating: 3, totalReviews: 2, wouldBuyAgainPct: 50, avgPricePaid: 3000 });
  });

  it("returns nothing for an unknown sake or without the database", async () => {
    expect(await getReviewsBySake("not-a-sake")).toEqual({ reviews: [], stats: { avgRating: 0, totalReviews: 0, wouldBuyAgainPct: 0, avgPricePaid: 0 } });
    vi.mocked(isServiceRoleConfigured).mockReturnValue(false);
    expect((await getReviewsBySake(sake.id)).reviews).toEqual([]);
    expect(queries).toHaveLength(0);
  });

  it("logs a failed read and shows no reviews", async () => {
    respond = (q) => (q.table === "sake_reviews" && has(q, "limit", 20) ? { error: { message: "boom" } } : undefined);
    expect((await getReviewsBySake(sake.id)).reviews).toEqual([]);
  });

  it("creates a review with the sake's real name, checking the form and the flood guard", async () => {
    expect(await createReview({ sakeId: sake.id, rating: 5 } as never)).toEqual(SIGNED_OUT);
    signIn();
    expect(await createReview({ sakeId: sake.id, rating: 9 } as never)).toMatchObject({ ok: false });
    expect(await createReview({ sakeId: "made-up", rating: 5 } as never)).toEqual({ ok: false, error: "Unknown sake." });
    respond = (q) => (q.table === "sake_reviews" && isHead(q) ? { count: 5 } : undefined);
    expect(await createReview({ sakeId: sake.id, rating: 5 } as never)).toEqual({ ok: false, error: TOO_MANY });
    respond = (q) => (q.table === "sake_reviews" && !isHead(q) ? { data: { id: 42 } } : { count: 0 });
    const out = await createReview({ sakeId: sake.id, rating: 5, tastingNote: "  ", sakeName: "Fake name" } as never);
    expect(out).toEqual({ ok: true, data: { id: 42 } });
    expect(written("sake_reviews", "insert")[0]).toMatchObject({ sake_name: sake.name, user_name: "Mia Rivers", tasting_note: null, rating: 5 });
  });

  it("reports a failed insert", async () => {
    signIn();
    respond = (q) => (q.table === "sake_reviews" && !isHead(q) ? { error: { message: "x" } } : { count: 0 });
    expect(await createReview({ sakeId: sake.id, rating: 3 } as never)).toEqual({ ok: false, error: UNAVAILABLE });
  });

  it("counts one upvote per member", async () => {
    signIn();
    expect(await upvoteReview(-1)).toEqual({ ok: false, error: "Unknown review." });
    expect(await upvoteReview(7)).toEqual({ ok: false, error: "Unknown review." });
    respond = (q) => {
      if (q.table === "sake_reviews" && has(q, "select")) return { data: { id: 7 } };
      if (q.table === "sake_review_upvotes" && has(q, "insert")) return { error: { message: "dup", code: "23505" } };
      if (q.table === "sake_review_upvotes") return { count: 3 };
      return undefined;
    };
    expect(await upvoteReview(7)).toEqual({ ok: true, data: { upvotes: 3 } });
    expect(written("sake_reviews", "update")[0]).toEqual({ upvotes: 3 });
  });

  it("returns the member's own reviews", async () => {
    expect(await getMyReviews()).toEqual(SIGNED_OUT);
    signIn();
    respond = (q) => (q.table === "sake_reviews" ? { data: [{ ...row, flavor_tags: null }] } : undefined);
    const out = await getMyReviews();
    expect(out.ok && out.data[0]).toMatchObject({ id: 1, flavorTags: [], mine: true });
    expect(queries[0].ops).toContainEqual({ name: "eq", args: ["user_id", ME.id] });
  });
});

describe("deal alerts", () => {
  const form = { alertType: "specific" as const, sakeId: sake.id, sakeCategory: "", priceThreshold: "40", minDiscountPct: 15, zipCode: "10001" };

  it("creates an alert from the form, with the server's sake name", async () => {
    expect(await createAlert(form)).toEqual(SIGNED_OUT);
    signIn();
    respond = (q) => (q.table === "sake_deal_alerts" && !isHead(q) ? { data: { id: 3 } } : { count: 0 });
    expect(await createAlert(form)).toEqual({ ok: true, data: { id: 3 } });
    expect(written("sake_deal_alerts", "insert")[0]).toMatchObject({
      user_id: ME.id,
      alert_type: "specific",
      sake_name: sake.name,
      price_threshold: "40.00",
      min_discount_pct: 15,
      zip_code: "10001",
      notify_email: false,
    });
  });

  it("rejects bad input, unknown types and too many alerts", async () => {
    signIn();
    expect(await createAlert({ ...form, zipCode: "12" })).toEqual({ ok: false, error: "Please enter a 5-digit ZIP code." });
    expect(await createAlert({ ...form, alertType: "category", sakeId: "", sakeCategory: "Wine" })).toEqual({ ok: false, error: "Please choose a type." });
    respond = (q) => (q.table === "sake_deal_alerts" && isHead(q) && !has(q, "gte") ? { count: 50 } : { count: 0 });
    expect((await createAlert({ ...form, alertType: "all", sakeId: "" })).ok).toBe(false);
    respond = (q) => (q.table === "sake_deal_alerts" && isHead(q) && has(q, "gte") ? { count: 10 } : { count: 0 });
    expect(await createAlert({ ...form, alertType: "all", sakeId: "" })).toEqual({ ok: false, error: TOO_MANY });
  });

  it("lists, updates and deletes only the member's alerts", async () => {
    signIn();
    respond = (q) =>
      q.table === "sake_deal_alerts" && has(q, "order")
        ? {
            data: [
              {
                id: 1,
                alert_type: "all",
                sake_id: null,
                sake_name: null,
                sake_category: null,
                price_threshold: 30,
                min_discount_pct: 10,
                notify_in_app: true,
                notify_email: false,
                is_active: true,
                zip_code: null,
                created_at: "x",
              },
            ],
          }
        : undefined;
    const list = await getMyAlerts();
    expect(list.ok && list.data[0]).toMatchObject({ id: 1, alertType: "all", priceThreshold: "30.00", isActive: true });
    expect(await updateAlert(0, {})).toEqual({ ok: false, error: "Unknown alert." });
    expect(await updateAlert(1, { minDiscountPct: 95 })).toEqual({ ok: false, error: "Please enter a number from 1 to 90." });
    expect(await updateAlert(1, { priceThreshold: -1 })).toMatchObject({ ok: false });
    expect(await updateAlert(1, { isActive: false, priceThreshold: null, notifyEmail: true, notifyInApp: false })).toEqual({ ok: true, data: null });
    expect(written("sake_deal_alerts", "update")[0]).toMatchObject({ is_active: false, price_threshold: null, notify_email: true, notify_in_app: false });
    expect(await deleteAlert(1)).toEqual({ ok: true, data: null });
    const del = queries.find((q) => q.table === "sake_deal_alerts" && has(q, "delete"))!;
    expect(del.ops).toContainEqual({ name: "eq", args: ["user_id", ME.id] });
    expect(await deleteAlert(-4)).toEqual({ ok: false, error: "Unknown alert." });
  });
});

describe("notifications", () => {
  it("lists notices with the unread count and marks them read", async () => {
    signIn();
    respond = (q) =>
      q.table === "sake_deal_notifications" && isHead(q)
        ? { count: 2 }
        : {
            data: [
              { id: 9, sake_id: sake.id, sake_name: sake.name, retailer_name: "Tippsy", new_price: 30, old_price: "40", discount_pct: 25, is_read: false, created_at: "x" },
            ],
          };
    const out = await getMyNotifications({ limit: 500, unreadOnly: true });
    expect(out).toMatchObject({ ok: true, data: { unreadCount: 2, notifications: [{ id: 9, newPrice: "30.00", oldPrice: "40.00", isRead: false }] } });
    expect(await markNotificationsRead({ notificationIds: [] })).toEqual({ ok: true, data: null });
    expect(await markNotificationsRead({ notificationIds: [9, -1] })).toEqual({ ok: true, data: null });
    expect(await markNotificationsRead({ markAll: true })).toEqual({ ok: true, data: null });
    expect(written("sake_deal_notifications", "update")).toEqual([{ is_read: true }, { is_read: true }]);
  });
});

describe("tracked sakes", () => {
  it("toggles a sake on and off for the member", async () => {
    expect(await toggleFavorite(sake.id)).toEqual(SIGNED_OUT);
    signIn();
    expect(await toggleFavorite("made-up")).toEqual({ ok: false, error: "Unknown sake." });
    expect(await toggleFavorite(sake.id, -5)).toMatchObject({ ok: false });
    respond = (q) => (q.table === "sake_favorites" && has(q, "delete") ? { data: [{ id: 1 }] } : undefined);
    expect(await toggleFavorite(sake.id)).toEqual({ ok: true, data: { favorited: false } });
    respond = (q) => (q.table === "sake_favorites" && has(q, "delete") ? { data: [] } : { count: 0 });
    expect(await toggleFavorite(sake.id, 30)).toEqual({ ok: true, data: { favorited: true } });
    expect(written("sake_favorites", "insert")[0]).toMatchObject({ sake_name: sake.name, target_price: "30.00" });
    respond = (q) => (q.table === "sake_favorites" && has(q, "delete") ? { data: [] } : { count: 200 });
    expect((await toggleFavorite(sake.id)).ok).toBe(false);
  });

  it("lists tracked sakes", async () => {
    signIn();
    respond = () => ({ data: [{ id: 1, sake_id: sake.id, sake_name: sake.name, target_price: null, created_at: "x" }] });
    expect(await getMyFavorites()).toEqual({ ok: true, data: [{ id: 1, sakeId: sake.id, sakeName: sake.name, targetPrice: null, createdAt: "x" }] });
  });
});

describe("prices", () => {
  it("gives a fixed estimate per sake, replaced by recorded prices when there are some", async () => {
    vi.mocked(isServiceRoleConfigured).mockReturnValue(false);
    const est = await getAllLivePrices();
    expect(est.prices["born-gold"]).toEqual({ lowestPrice: 32.3, lowestRetailer: "Mitsuwa Marketplace", priceDiffPct: -15, inStockCount: 8, estimated: true });
    vi.mocked(isServiceRoleConfigured).mockReturnValue(true);
    respond = () => ({
      data: [
        { sake_id: "born-gold", retailer_name: "Tippsy", price: "35", in_stock: true, observed_at: "2026-11-20T00:00:00Z" },
        { sake_id: "born-gold", retailer_name: "Tippsy", price: "20", in_stock: true, observed_at: "2026-11-01T00:00:00Z" },
      ],
    });
    const live = await getAllLivePrices();
    expect(live.prices["born-gold"]).toEqual({ lowestPrice: 35, lowestRetailer: "Tippsy", priceDiffPct: -8, inStockCount: 1, estimated: false });
    expect(live.lastUpdated).toBe("2026-11-20T00:00:00Z");
  });

  it("lets only the owner record a price, and notifies matching alerts", async () => {
    const snap = { sakeId: sake.id, retailerId: "tippsy", retailerName: "Tippsy", price: 30, previousPrice: 40, inStock: true, bottleSizeMl: 720 };
    signIn();
    expect(await recordPriceSnapshot(snap)).toEqual({ ok: false, error: "Only the site owner can do that." });
    signIn(OWNER);
    expect(await recordPriceSnapshot({ ...snap, sakeId: "x" })).toEqual({ ok: false, error: "Unknown sake." });
    respond = (q) => {
      if (q.table === "sake_price_snapshots") return { data: { id: 11 } };
      if (q.table === "sake_deal_alerts")
        return {
          data: [
            { id: 1, user_id: "a", alert_type: "all", sake_id: null, sake_category: null, price_threshold: null, min_discount_pct: 10 },
            { id: 2, user_id: "b", alert_type: "specific", sake_id: "other", sake_category: null, price_threshold: null, min_discount_pct: 10 },
            { id: 3, user_id: "c", alert_type: "category", sake_id: null, sake_category: sake.type, price_threshold: "25", min_discount_pct: 10 },
            { id: 4, user_id: "d", alert_type: "category", sake_id: null, sake_category: sake.type, price_threshold: null, min_discount_pct: 50 },
            { id: 5, user_id: "e", alert_type: "category", sake_id: null, sake_category: sake.type, price_threshold: null, min_discount_pct: 20 },
          ],
        };
      return undefined;
    };
    expect(await recordPriceSnapshot(snap)).toEqual({ ok: true, data: { id: 11, notified: 2 } });
    const sent = written("sake_deal_notifications", "insert")[0] as { user_id: string; discount_pct: number }[];
    expect(sent.map((n) => n.user_id)).toEqual(["a", "e"]);
    expect(sent[0].discount_pct).toBe(25);
  });
});

describe("checkout", () => {
  it("reports whether ordering is open", async () => {
    expect(await isSakeCheckoutOpen()).toBe(true);
    vi.mocked(isSakeCheckoutEnabled).mockReturnValue(false);
    expect(await isSakeCheckoutOpen()).toBe(false);
  });

  it("refuses orders while closed, for unknown bottles and too often", async () => {
    expect(await startOrderCheckout([{ productId: sake.id, quantity: 1 }])).toEqual(SIGNED_OUT);
    signIn();
    vi.mocked(isSakeCheckoutEnabled).mockReturnValue(false);
    expect(await startOrderCheckout([{ productId: sake.id, quantity: 1 }])).toEqual({ ok: false, error: "Ordering opens soon. Please check back." });
    vi.mocked(isSakeCheckoutEnabled).mockReturnValue(true);
    expect((await startOrderCheckout([{ productId: "nope", quantity: 1 }])).ok).toBe(false);
    respond = (q) => (q.table === "sake_orders" && isHead(q) ? { count: 5 } : undefined);
    expect(await startOrderCheckout([{ productId: sake.id, quantity: 1 }])).toEqual({ ok: false, error: TOO_MANY });
  });

  it("starts an order priced by the server and records it", async () => {
    signIn();
    respond = (q) => (q.table === "sake_orders" && isHead(q) ? { count: 0 } : undefined);
    const out = await startOrderCheckout([{ productId: sake.id, quantity: 2 }]);
    expect(out).toEqual({ ok: true, data: { url: "https://checkout.stripe.com/c/pay/cs_1" } });
    const cart = priceCart([{ productId: sake.id, quantity: 2 }])!;
    expect(written("sake_orders", "insert")[0]).toMatchObject({ stripe_session_id: "cs_1", status: "pending", total_cents: cart.subtotalCents + cart.shippingCents });
    expect(written("sake_stripe_customers", "upsert")[0]).toEqual({ user_id: ME.id, stripe_customer_id: "cus_new" });
  });

  it("reports a Stripe failure", async () => {
    signIn();
    respond = (q) => (q.table === "sake_stripe_customers" ? { data: { stripe_customer_id: "cus_old" } } : { count: 0 });
    vi.mocked(createSakeOrderCheckout).mockRejectedValue(new Error("stripe down"));
    expect(await startOrderCheckout([{ productId: sake.id, quantity: 1 }])).toEqual({ ok: false, error: UNAVAILABLE });
    expect(createSakeCustomer).not.toHaveBeenCalled();
  });

  it("starts a box subscription once, and shows the member's plan", async () => {
    expect(await getMySubscription()).toBeNull();
    signIn();
    expect(await startSubscriptionCheckout("nope")).toEqual({ ok: false, error: "Plan not found." });
    respond = (q) =>
      q.table === "sake_subscriptions" && has(q, "not")
        ? { data: { plan_tier: "explorer", status: "active", current_period_end: null, cancel_at_period_end: false } }
        : undefined;
    expect(await getMySubscription()).toEqual({ planTier: "explorer", status: "active", currentPeriodEnd: null, cancelAtPeriodEnd: false });
    expect(await startSubscriptionCheckout("sub-explorer")).toEqual({ ok: false, error: "You already have an active subscription." });
    respond = (q) => (q.table === "sake_subscriptions" && isHead(q) ? { count: 0 } : undefined);
    expect(await startSubscriptionCheckout("sub-omakase")).toEqual({ ok: true, data: { url: "https://checkout.stripe.com/c/pay/cs_2" } });
    expect(written("sake_subscriptions", "insert")[0]).toMatchObject({ plan_tier: "omakase", status: "incomplete" });
    vi.mocked(isSakeCheckoutEnabled).mockReturnValue(false);
    expect((await startSubscriptionCheckout("sub-omakase")).ok).toBe(false);
  });
});

describe("failure paths", () => {
  it("turns database errors into the friendly message", async () => {
    signIn();
    respond = () => ({ error: { message: "db down" } });
    for (const out of [
      await getMyReviews(),
      await getMyAlerts(),
      await getMyFavorites(),
      await getMyNotifications(),
      await updateAlert(1, { isActive: true }),
      await deleteAlert(1),
      await markNotificationsRead({ markAll: true }),
      await toggleFavorite(sake.id),
    ]) {
      expect(out).toEqual({ ok: false, error: UNAVAILABLE });
    }
  });

  it("reports failed writes when starting alerts, upvotes and checkouts", async () => {
    signIn();
    respond = (q) => (q.table === "sake_deal_alerts" && !isHead(q) ? { error: { message: "x" } } : { count: 0 });
    expect(await createAlert({ alertType: "all", sakeId: "", sakeCategory: "", priceThreshold: "", minDiscountPct: 10, zipCode: "" })).toEqual({ ok: false, error: UNAVAILABLE });
    respond = (q) => {
      if (q.table === "sake_reviews" && has(q, "select")) return { data: { id: 7 } };
      if (q.table === "sake_review_upvotes" && has(q, "insert")) return { error: { message: "x" } };
      return undefined;
    };
    expect(await upvoteReview(7)).toEqual({ ok: false, error: UNAVAILABLE });
    respond = (q) => (q.table === "sake_orders" && !isHead(q) ? { error: { message: "x" } } : { count: 0 });
    expect(await startOrderCheckout([{ productId: sake.id, quantity: 1 }])).toEqual({ ok: false, error: UNAVAILABLE });
    respond = (q) => (q.table === "sake_subscriptions" && has(q, "insert") ? { error: { message: "x" } } : { count: 0 });
    expect(await startSubscriptionCheckout("sub-explorer")).toEqual({ ok: false, error: UNAVAILABLE });
    vi.mocked(createSakeSubscriptionCheckout).mockRejectedValue(new Error("stripe"));
    respond = () => ({ count: 0 });
    expect(await startSubscriptionCheckout("sub-explorer")).toEqual({ ok: false, error: UNAVAILABLE });
    respond = () => ({ count: 10 });
    expect(await startSubscriptionCheckout("sub-explorer")).toEqual({ ok: false, error: TOO_MANY });
  });

  it("records a price with no drop without notifying, and reports snapshot failures", async () => {
    signIn(OWNER);
    respond = (q) => (q.table === "sake_price_snapshots" ? { data: { id: 1 } } : undefined);
    expect(await recordPriceSnapshot({ sakeId: sake.id, retailerId: "t", retailerName: "T", price: 30, sourceUrl: "" } as never)).toEqual({ ok: true, data: { id: 1, notified: 0 } });
    expect(await recordPriceSnapshot({ sakeId: sake.id, retailerId: "t", retailerName: "T", price: -3 } as never)).toMatchObject({ ok: false });
    respond = () => ({ error: { message: "x" } });
    expect(await recordPriceSnapshot({ sakeId: sake.id, retailerId: "t", retailerName: "T", price: 3 } as never)).toEqual({ ok: false, error: UNAVAILABLE });
    respond = (q) => (q.table === "sake_price_snapshots" ? { data: { id: 1 } } : { error: { message: "x" } });
    expect(await recordPriceSnapshot({ sakeId: sake.id, retailerId: "t", retailerName: "T", price: 3, previousPrice: 9 } as never)).toEqual({ ok: false, error: UNAVAILABLE });
  });

  it("is unavailable without the database", async () => {
    signIn();
    vi.mocked(isServiceRoleConfigured).mockReturnValue(false);
    expect(await getMyAlerts()).toEqual({ ok: false, error: UNAVAILABLE });
  });
});
