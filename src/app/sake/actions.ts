"use server";

import { getUser, isAdmin, requestOrigin } from "@/lib/auth";
import { createServiceRoleClient, isServiceRoleConfigured } from "@/lib/supabase/service-role";
import { qprSakeDatabase } from "@/lib/content/sake/qpr-data";
import { getSubscriptionPlan } from "@/lib/content/sake/products";
import { BASE_PRICES, estimatedSummary, observedSummary, type LivePriceSummary, type Observation } from "@/lib/content/sake/live-prices";
import {
  alertSchema,
  reviewSchema,
  snapshotSchema,
  type AlertValues,
  type ReviewValues,
  type SnapshotValues,
} from "@/lib/content/sake/forms";
import {
  createSakeCustomer,
  createSakeOrderCheckout,
  createSakeSubscriptionCheckout,
  isSakeCheckoutEnabled,
  priceCart,
  type CartItem,
} from "@/lib/content/sake/sake-stripe";

// Sake for Sake's Sake's server features, ported from the Sake Manus app's tRPC routers
// (server/routers/reviews.ts, priceAlerts.ts, subscription.ts, shop.ts, server/stripe/checkout.ts)
// onto this site's Supabase (tables: supabase/migrations/0011_sake.sql) and Stripe. Supabase Auth
// replaces Manus OAuth; the owner check is this site's ADMIN_EMAILS. Every query runs on the server
// with the service-role key, scoped to the signed-in member, and every input is checked again with the
// same Yup schema the form uses (src/lib/content/sake/forms.ts).
//
// Fixed from the app (listed in docs/ai/project_sake_port.md):
// - Sake names, product prices and plan prices come from the server's own data, never from the browser
//   (the app trusted the sakeName sent with a review, alert or favorite).
// - One upvote per member per review (the app let anyone upvote the same review without limit).
// - Recording prices (which triggers other members' deal alerts) is owner-only; the app let any
//   signed-in visitor do it.
// - Checkout links go back to this site (requestOrigin), not to an `origin` the browser sends.
// - Flood guards on reviews, alerts, favorites and checkouts; signed-out calls say "Please sign in".
// - Payments stay off until SAKE_CHECKOUT_ENABLED=true (selling alcohol by mail needs the owner's OK).
// - "Live" prices are a fixed estimate, not new random numbers on every visit (live-prices.ts).

const UNAVAILABLE = "This couldn't be done just now. Please try again in a minute.";
const SIGN_IN = "Please sign in first.";
const TOO_MANY = "That's a lot at once. Please wait a few minutes.";
const CHECKOUT_OFF = "Ordering opens soon. Please check back.";

export type SakeResult<T = null> = { ok: true; data: T } | { ok: false; error: string; signedOut?: boolean };

export type SakeMember = {
  signedIn: boolean;
  id: string | null;
  email: string | null;
  name: string | null;
  isAdmin: boolean;
};

const SIGNED_OUT: SakeMember = { signedIn: false, id: null, email: null, name: null, isAdmin: false };

type Db = ReturnType<typeof createServiceRoleClient>;
type User = { id: string; email: string | null; name: string | null };

function nameFrom(meta: Record<string, unknown>) {
  return typeof meta.full_name === "string" ? meta.full_name : typeof meta.name === "string" ? meta.name : null;
}

/** The app's auth.me: who is signed in, if anyone. */
export async function getSakeMember(): Promise<SakeMember> {
  const user = await getUser();
  if (!user) return SIGNED_OUT;
  const name = nameFrom((user.user_metadata ?? {}) as Record<string, unknown>);
  return { signedIn: true, id: user.id, email: user.email ?? null, name, isAdmin: isAdmin(user.email) };
}

async function member(): Promise<{ user: User; db: Db } | { error: SakeResult<never> }> {
  if (!isServiceRoleConfigured()) return { error: { ok: false, error: UNAVAILABLE } };
  const user = await getUser();
  if (!user) return { error: { ok: false, error: SIGN_IN, signedOut: true } };
  const name = nameFrom((user.user_metadata ?? {}) as Record<string, unknown>);
  return { user: { id: user.id, email: user.email ?? null, name }, db: createServiceRoleClient() };
}

function fail(where: string, message: string): SakeResult<never> {
  console.error(`[sake] ${where}:`, message);
  return { ok: false, error: UNAVAILABLE };
}

async function validate<T>(schema: { validate: (v: unknown, o: object) => Promise<T> }, input: unknown) {
  try {
    return { value: await schema.validate(input, { stripUnknown: true, abortEarly: true }) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Please check the form." };
  }
}

const sakeById = (id: string | null | undefined) => (id ? qprSakeDatabase.find((s) => s.id === id) : undefined);
const sakeTypes = new Set(qprSakeDatabase.map((s) => s.type));
const sinceMinutes = (m: number) => new Date(Date.now() - m * 60 * 1000).toISOString();
const isId = (n: unknown): n is number => typeof n === "number" && Number.isInteger(n) && n > 0;
const blankToNull = (v: string | undefined | null) => (v && v.trim() ? v.trim() : null);

async function recentCount(db: Db, table: string, userId: string, minutes: number) {
  const { count } = await db.from(table).select("id", { count: "exact", head: true }).eq("user_id", userId).gte("created_at", sinceMinutes(minutes));
  return count ?? 0;
}

// ─── Reviews ───

export type SakeReview = {
  id: number;
  userName: string;
  sakeId: string;
  sakeName: string;
  rating: number;
  tastingNote: string | null;
  flavorTags: string[];
  servingTemp: string | null;
  purchaseLocation: string | null;
  pricePaidCents: number | null;
  wouldBuyAgain: boolean;
  upvotes: number;
  createdAt: string;
  /** True when the signed-in member has upvoted it (always false signed out). */
  upvotedByMe: boolean;
  /** True when the signed-in member wrote it. */
  mine: boolean;
};

export type ReviewStats = { avgRating: number; totalReviews: number; wouldBuyAgainPct: number; avgPricePaid: number };

type ReviewRow = {
  id: number;
  user_id: string;
  user_name: string | null;
  sake_id: string;
  sake_name: string;
  rating: number;
  tasting_note: string | null;
  flavor_tags: unknown;
  serving_temp: string | null;
  purchase_location: string | null;
  price_paid_cents: number | null;
  would_buy_again: boolean;
  upvotes: number;
  created_at: string;
};

const REVIEW_COLUMNS =
  "id, user_id, user_name, sake_id, sake_name, rating, tasting_note, flavor_tags, serving_temp, purchase_location, price_paid_cents, would_buy_again, upvotes, created_at";

function toReview(r: ReviewRow, me: string | null, upvoted: Set<number>): SakeReview {
  return {
    id: r.id,
    userName: r.user_name || "Anonymous",
    sakeId: r.sake_id,
    sakeName: r.sake_name,
    rating: r.rating,
    tastingNote: r.tasting_note,
    flavorTags: Array.isArray(r.flavor_tags) ? (r.flavor_tags as unknown[]).filter((t): t is string => typeof t === "string") : [],
    servingTemp: r.serving_temp,
    purchaseLocation: r.purchase_location,
    pricePaidCents: r.price_paid_cents,
    wouldBuyAgain: r.would_buy_again,
    upvotes: r.upvotes,
    createdAt: r.created_at,
    upvotedByMe: upvoted.has(r.id),
    mine: me !== null && r.user_id === me,
  };
}

const NO_STATS: ReviewStats = { avgRating: 0, totalReviews: 0, wouldBuyAgainPct: 0, avgPricePaid: 0 };

/** Reviews of one sake, newest first, with the app's stats (reviews.getBySake). Public. */
export async function getReviewsBySake(sakeId: string, limit = 20): Promise<{ reviews: SakeReview[]; stats: ReviewStats }> {
  if (!isServiceRoleConfigured() || !sakeById(sakeId)) return { reviews: [], stats: NO_STATS };
  const db = createServiceRoleClient();
  const take = Math.min(Math.max(Math.trunc(limit) || 20, 1), 50);
  const [{ data, error }, { data: all }] = await Promise.all([
    db.from("sake_reviews").select(REVIEW_COLUMNS).eq("sake_id", sakeId).eq("is_visible", true).order("created_at", { ascending: false }).limit(take),
    db.from("sake_reviews").select("rating, would_buy_again, price_paid_cents").eq("sake_id", sakeId).eq("is_visible", true).limit(5000),
  ]);
  if (error) {
    console.error("[sake] getReviewsBySake:", error.message);
    return { reviews: [], stats: NO_STATS };
  }
  const rows = (data ?? []) as ReviewRow[];
  const user = await getUser();
  let upvoted = new Set<number>();
  if (user && rows.length) {
    const { data: votes } = await db
      .from("sake_review_upvotes")
      .select("review_id")
      .eq("user_id", user.id)
      .in("review_id", rows.map((r) => r.id));
    upvoted = new Set(((votes ?? []) as { review_id: number }[]).map((v) => v.review_id));
  }
  const statRows = (all ?? []) as { rating: number; would_buy_again: boolean; price_paid_cents: number | null }[];
  const total = statRows.length;
  const paid = statRows.filter((r) => typeof r.price_paid_cents === "number");
  const stats: ReviewStats = total
    ? {
        avgRating: statRows.reduce((s, r) => s + r.rating, 0) / total,
        totalReviews: total,
        wouldBuyAgainPct: Math.round((statRows.filter((r) => r.would_buy_again).length / total) * 100),
        avgPricePaid: paid.length ? paid.reduce((s, r) => s + (r.price_paid_cents ?? 0), 0) / paid.length : 0,
      }
    : NO_STATS;
  return { reviews: rows.map((r) => toReview(r, user?.id ?? null, upvoted)), stats };
}

/** Adds the member's tasting note (reviews.create). The sake's name comes from the database. */
export async function createReview(input: ReviewValues): Promise<SakeResult<{ id: number }>> {
  const m = await member();
  if ("error" in m) return m.error;
  const checked = await validate(reviewSchema, input);
  if ("error" in checked) return { ok: false, error: checked.error ?? "Please check the form." };
  const v = checked.value;
  const sake = sakeById(v.sakeId);
  if (!sake) return { ok: false, error: "Unknown sake." };
  if ((await recentCount(m.db, "sake_reviews", m.user.id, 10)) >= 5) return { ok: false, error: TOO_MANY };
  const { data, error } = await m.db
    .from("sake_reviews")
    .insert({
      user_id: m.user.id,
      user_name: m.user.name || "Anonymous",
      sake_id: sake.id,
      sake_name: sake.name,
      rating: v.rating,
      tasting_note: blankToNull(v.tastingNote),
      flavor_tags: v.flavorTags ?? [],
      serving_temp: blankToNull(v.servingTemp),
      purchase_location: blankToNull(v.purchaseLocation),
      price_paid_cents: typeof v.pricePaidCents === "number" ? v.pricePaidCents : null,
      would_buy_again: v.wouldBuyAgain ?? true,
    })
    .select("id")
    .single();
  if (error || !data) return fail("createReview", error?.message ?? "no row");
  return { ok: true, data: { id: (data as { id: number }).id } };
}

/** Upvotes a review once per member (reviews.upvote). Returns the new count. */
export async function upvoteReview(reviewId: number): Promise<SakeResult<{ upvotes: number }>> {
  const m = await member();
  if ("error" in m) return m.error;
  if (!isId(reviewId)) return { ok: false, error: "Unknown review." };
  const { data: review } = await m.db.from("sake_reviews").select("id").eq("id", reviewId).eq("is_visible", true).maybeSingle();
  if (!review) return { ok: false, error: "Unknown review." };
  const { error } = await m.db.from("sake_review_upvotes").insert({ review_id: reviewId, user_id: m.user.id });
  if (error && error.code !== "23505") return fail("upvoteReview", error.message);
  const { count } = await m.db.from("sake_review_upvotes").select("review_id", { count: "exact", head: true }).eq("review_id", reviewId);
  const upvotes = count ?? 0;
  const { error: updateError } = await m.db.from("sake_reviews").update({ upvotes }).eq("id", reviewId);
  if (updateError) return fail("upvoteReview count", updateError.message);
  return { ok: true, data: { upvotes } };
}

/** The member's own tasting notes, newest first (reviews.getMyReviews). Empty when signed out. */
export async function getMyReviews(): Promise<SakeResult<SakeReview[]>> {
  const m = await member();
  if ("error" in m) return m.error;
  const { data, error } = await m.db
    .from("sake_reviews")
    .select(REVIEW_COLUMNS)
    .eq("user_id", m.user.id)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) return fail("getMyReviews", error.message);
  return { ok: true, data: ((data ?? []) as ReviewRow[]).map((r) => toReview(r, m.user.id, new Set())) };
}

// ─── Deal alerts ───

export type DealAlert = {
  id: number;
  alertType: "specific" | "category" | "all";
  sakeId: string | null;
  sakeName: string | null;
  sakeCategory: string | null;
  priceThreshold: string | null;
  minDiscountPct: number;
  notifyInApp: boolean;
  notifyEmail: boolean;
  isActive: boolean;
  zipCode: string | null;
  createdAt: string;
};

type AlertRow = {
  id: number;
  alert_type: DealAlert["alertType"];
  sake_id: string | null;
  sake_name: string | null;
  sake_category: string | null;
  price_threshold: string | number | null;
  min_discount_pct: number;
  notify_in_app: boolean;
  notify_email: boolean;
  is_active: boolean;
  zip_code: string | null;
  created_at: string;
};

const ALERT_COLUMNS =
  "id, alert_type, sake_id, sake_name, sake_category, price_threshold, min_discount_pct, notify_in_app, notify_email, is_active, zip_code, created_at";

const toAlert = (r: AlertRow): DealAlert => ({
  id: r.id,
  alertType: r.alert_type,
  sakeId: r.sake_id,
  sakeName: r.sake_name,
  sakeCategory: r.sake_category,
  priceThreshold: r.price_threshold === null ? null : Number(r.price_threshold).toFixed(2),
  minDiscountPct: r.min_discount_pct,
  notifyInApp: r.notify_in_app,
  notifyEmail: r.notify_email,
  isActive: r.is_active,
  zipCode: r.zip_code,
  createdAt: r.created_at,
});

const MAX_ALERTS = 50;

/** The member's alerts, newest first (priceAlerts.getMyAlerts). */
export async function getMyAlerts(): Promise<SakeResult<DealAlert[]>> {
  const m = await member();
  if ("error" in m) return m.error;
  const { data, error } = await m.db.from("sake_deal_alerts").select(ALERT_COLUMNS).eq("user_id", m.user.id).order("created_at", { ascending: false });
  if (error) return fail("getMyAlerts", error.message);
  return { ok: true, data: ((data ?? []) as AlertRow[]).map(toAlert) };
}

/** Creates a price-drop alert (priceAlerts.createAlert). In-app notices only, as in the app's form. */
export async function createAlert(input: AlertValues): Promise<SakeResult<{ id: number }>> {
  const m = await member();
  if ("error" in m) return m.error;
  const checked = await validate(alertSchema, input);
  if ("error" in checked) return { ok: false, error: checked.error ?? "Please check the form." };
  const v = checked.value;
  const sake = v.alertType === "specific" ? sakeById(v.sakeId) : undefined;
  if (v.alertType === "specific" && !sake) return { ok: false, error: "Please choose a sake." };
  if (v.alertType === "category" && !sakeTypes.has(v.sakeCategory ?? "")) return { ok: false, error: "Please choose a type." };
  const { count } = await m.db.from("sake_deal_alerts").select("id", { count: "exact", head: true }).eq("user_id", m.user.id);
  if ((count ?? 0) >= MAX_ALERTS) return { ok: false, error: `You can keep up to ${MAX_ALERTS} alerts. Please delete one first.` };
  if ((await recentCount(m.db, "sake_deal_alerts", m.user.id, 10)) >= 10) return { ok: false, error: TOO_MANY };
  const { data, error } = await m.db
    .from("sake_deal_alerts")
    .insert({
      user_id: m.user.id,
      alert_type: v.alertType,
      sake_id: sake?.id ?? null,
      sake_name: sake?.name ?? null,
      sake_category: v.alertType === "category" ? v.sakeCategory : null,
      price_threshold: v.priceThreshold ? Number(v.priceThreshold).toFixed(2) : null,
      min_discount_pct: v.minDiscountPct,
      notify_in_app: true,
      notify_email: false,
      zip_code: blankToNull(v.zipCode),
    })
    .select("id")
    .single();
  if (error || !data) return fail("createAlert", error?.message ?? "no row");
  return { ok: true, data: { id: (data as { id: number }).id } };
}

export type AlertPatch = { isActive?: boolean; priceThreshold?: number | null; minDiscountPct?: number; notifyInApp?: boolean; notifyEmail?: boolean };

/** Updates one of the member's alerts (priceAlerts.updateAlert). */
export async function updateAlert(id: number, patch: AlertPatch): Promise<SakeResult> {
  const m = await member();
  if ("error" in m) return m.error;
  if (!isId(id)) return { ok: false, error: "Unknown alert." };
  const set: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof patch?.isActive === "boolean") set.is_active = patch.isActive;
  if (typeof patch?.notifyInApp === "boolean") set.notify_in_app = patch.notifyInApp;
  if (typeof patch?.notifyEmail === "boolean") set.notify_email = patch.notifyEmail;
  if (patch?.priceThreshold === null) set.price_threshold = null;
  else if (typeof patch?.priceThreshold === "number") {
    if (!(patch.priceThreshold >= 0 && patch.priceThreshold <= 100000)) return { ok: false, error: "Please enter a price between 0 and 100,000." };
    set.price_threshold = patch.priceThreshold.toFixed(2);
  }
  if (patch?.minDiscountPct !== undefined) {
    if (!Number.isInteger(patch.minDiscountPct) || patch.minDiscountPct < 1 || patch.minDiscountPct > 90)
      return { ok: false, error: "Please enter a number from 1 to 90." };
    set.min_discount_pct = patch.minDiscountPct;
  }
  const { error } = await m.db.from("sake_deal_alerts").update(set).eq("id", id).eq("user_id", m.user.id);
  if (error) return fail("updateAlert", error.message);
  return { ok: true, data: null };
}

/** Deletes one of the member's alerts (priceAlerts.deleteAlert). */
export async function deleteAlert(id: number): Promise<SakeResult> {
  const m = await member();
  if ("error" in m) return m.error;
  if (!isId(id)) return { ok: false, error: "Unknown alert." };
  const { error } = await m.db.from("sake_deal_alerts").delete().eq("id", id).eq("user_id", m.user.id);
  if (error) return fail("deleteAlert", error.message);
  return { ok: true, data: null };
}

// ─── Notifications ───

export type DealNotification = {
  id: number;
  sakeId: string;
  sakeName: string;
  retailerName: string;
  newPrice: string;
  oldPrice: string;
  discountPct: number;
  isRead: boolean;
  createdAt: string;
};

type NotificationRow = {
  id: number;
  sake_id: string;
  sake_name: string;
  retailer_name: string;
  new_price: string | number;
  old_price: string | number;
  discount_pct: number;
  is_read: boolean;
  created_at: string;
};

/** The member's price-drop notices and unread count (priceAlerts.getMyNotifications). */
export async function getMyNotifications(
  opts: { limit?: number; unreadOnly?: boolean } = {},
): Promise<SakeResult<{ notifications: DealNotification[]; unreadCount: number }>> {
  const m = await member();
  if ("error" in m) return m.error;
  const limit = Math.min(Math.max(Math.trunc(opts.limit ?? 20) || 20, 1), 100);
  let query = m.db
    .from("sake_deal_notifications")
    .select("id, sake_id, sake_name, retailer_name, new_price, old_price, discount_pct, is_read, created_at")
    .eq("user_id", m.user.id)
    .eq("is_dismissed", false)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (opts.unreadOnly) query = query.eq("is_read", false);
  const [{ data, error }, { count }] = await Promise.all([
    query,
    m.db.from("sake_deal_notifications").select("id", { count: "exact", head: true }).eq("user_id", m.user.id).eq("is_read", false).eq("is_dismissed", false),
  ]);
  if (error) return fail("getMyNotifications", error.message);
  return {
    ok: true,
    data: {
      notifications: ((data ?? []) as NotificationRow[]).map((n) => ({
        id: n.id,
        sakeId: n.sake_id,
        sakeName: n.sake_name,
        retailerName: n.retailer_name,
        newPrice: Number(n.new_price).toFixed(2),
        oldPrice: Number(n.old_price).toFixed(2),
        discountPct: n.discount_pct,
        isRead: n.is_read,
        createdAt: n.created_at,
      })),
      unreadCount: count ?? 0,
    },
  };
}

/** Marks some or all of the member's notices read (priceAlerts.markRead). */
export async function markNotificationsRead(opts: { notificationIds?: number[]; markAll?: boolean }): Promise<SakeResult> {
  const m = await member();
  if ("error" in m) return m.error;
  let query = m.db.from("sake_deal_notifications").update({ is_read: true }).eq("user_id", m.user.id);
  if (!opts?.markAll) {
    const ids = (opts?.notificationIds ?? []).filter(isId).slice(0, 100);
    if (ids.length === 0) return { ok: true, data: null };
    query = query.in("id", ids);
  }
  const { error } = await query;
  if (error) return fail("markNotificationsRead", error.message);
  return { ok: true, data: null };
}

// ─── Tracked sakes (server favorites) ───

export type TrackedSake = { id: number; sakeId: string; sakeName: string; targetPrice: string | null; createdAt: string };

const MAX_FAVORITES = 200;

/** Sakes the member tracks for price (priceAlerts.getMyFavorites). */
export async function getMyFavorites(): Promise<SakeResult<TrackedSake[]>> {
  const m = await member();
  if ("error" in m) return m.error;
  const { data, error } = await m.db
    .from("sake_favorites")
    .select("id, sake_id, sake_name, target_price, created_at")
    .eq("user_id", m.user.id)
    .order("created_at", { ascending: false });
  if (error) return fail("getMyFavorites", error.message);
  return {
    ok: true,
    data: ((data ?? []) as { id: number; sake_id: string; sake_name: string; target_price: string | number | null; created_at: string }[]).map((f) => ({
      id: f.id,
      sakeId: f.sake_id,
      sakeName: f.sake_name,
      targetPrice: f.target_price === null ? null : Number(f.target_price).toFixed(2),
      createdAt: f.created_at,
    })),
  };
}

/** Starts or stops tracking a sake (priceAlerts.toggleFavorite). */
export async function toggleFavorite(sakeId: string, targetPrice?: number): Promise<SakeResult<{ favorited: boolean }>> {
  const m = await member();
  if ("error" in m) return m.error;
  const sake = sakeById(sakeId);
  if (!sake) return { ok: false, error: "Unknown sake." };
  if (targetPrice !== undefined && !(typeof targetPrice === "number" && targetPrice >= 0 && targetPrice <= 100000))
    return { ok: false, error: "Please enter a price between 0 and 100,000." };
  const { data: removed, error: deleteError } = await m.db
    .from("sake_favorites")
    .delete()
    .eq("user_id", m.user.id)
    .eq("sake_id", sake.id)
    .select("id");
  if (deleteError) return fail("toggleFavorite", deleteError.message);
  if ((removed ?? []).length > 0) return { ok: true, data: { favorited: false } };
  const { count } = await m.db.from("sake_favorites").select("id", { count: "exact", head: true }).eq("user_id", m.user.id);
  if ((count ?? 0) >= MAX_FAVORITES) return { ok: false, error: `You can track up to ${MAX_FAVORITES} sakes.` };
  const { error } = await m.db.from("sake_favorites").insert({
    user_id: m.user.id,
    sake_id: sake.id,
    sake_name: sake.name,
    target_price: typeof targetPrice === "number" ? targetPrice.toFixed(2) : null,
  });
  if (error && error.code !== "23505") return fail("toggleFavorite insert", error.message);
  return { ok: true, data: { favorited: true } };
}

// ─── Prices ───

/** Lowest price per sake for the QPR Rankings badges (priceAlerts.getAllLivePrices). Public. */
export async function getAllLivePrices(): Promise<{ prices: Record<string, LivePriceSummary>; lastUpdated: string }> {
  const prices: Record<string, LivePriceSummary> = {};
  for (const [id, base] of Object.entries(BASE_PRICES)) prices[id] = estimatedSummary(base);
  let lastUpdated = new Date().toISOString();
  if (isServiceRoleConfigured()) {
    const { data, error } = await createServiceRoleClient()
      .from("sake_price_snapshots")
      .select("sake_id, retailer_name, price, in_stock, observed_at")
      .gte("observed_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order("observed_at", { ascending: false })
      .limit(5000);
    if (error) console.error("[sake] getAllLivePrices:", error.message);
    const rows = (data ?? []) as (Observation & { observed_at: string })[];
    if (rows.length) lastUpdated = rows[0].observed_at;
    const bySake = new Map<string, Observation[]>();
    for (const row of rows) bySake.set(row.sake_id, [...(bySake.get(row.sake_id) ?? []), row]);
    for (const [id, list] of bySake) prices[id] = observedSummary(BASE_PRICES[id], list);
  }
  return { prices, lastUpdated };
}

/**
 * Records a retailer price and notifies members whose alerts it matches (priceAlerts.recordSnapshot).
 * Site owner only; the app let any signed-in visitor post prices.
 */
export async function recordPriceSnapshot(input: SnapshotValues): Promise<SakeResult<{ id: number; notified: number }>> {
  const m = await member();
  if ("error" in m) return m.error;
  if (!isAdmin(m.user.email)) return { ok: false, error: "Only the site owner can do that." };
  const checked = await validate(snapshotSchema, input);
  if ("error" in checked) return { ok: false, error: checked.error ?? "Please check the form." };
  const v = checked.value;
  const sake = sakeById(v.sakeId);
  if (!sake) return { ok: false, error: "Unknown sake." };
  const { data: snap, error } = await m.db
    .from("sake_price_snapshots")
    .insert({
      sake_id: sake.id,
      sake_name: sake.name,
      retailer_id: v.retailerId,
      retailer_name: v.retailerName,
      price: v.price.toFixed(2),
      previous_price: typeof v.previousPrice === "number" ? v.previousPrice.toFixed(2) : null,
      in_stock: v.inStock ?? true,
      bottle_size_ml: v.bottleSizeMl ?? 720,
      source_url: blankToNull(v.sourceUrl),
    })
    .select("id")
    .single();
  if (error || !snap) return fail("recordPriceSnapshot", error?.message ?? "no row");
  const snapshotId = (snap as { id: number }).id;

  let notified = 0;
  if (typeof v.previousPrice === "number" && v.previousPrice > 0 && v.price < v.previousPrice) {
    const discountPct = Math.round(((v.previousPrice - v.price) / v.previousPrice) * 100);
    const { data: alerts, error: alertError } = await m.db
      .from("sake_deal_alerts")
      .select("id, user_id, alert_type, sake_id, sake_category, price_threshold, min_discount_pct")
      .eq("is_active", true)
      .limit(5000);
    if (alertError) return fail("recordPriceSnapshot alerts", alertError.message);
    // The app matched 'all' and 'specific' alerts; 'category' alerts never fired. They match the sake's type now.
    const matches = (
      (alerts ?? []) as { id: number; user_id: string; alert_type: string; sake_id: string | null; sake_category: string | null; price_threshold: string | number | null; min_discount_pct: number }[]
    ).filter(
      (a) =>
        (a.alert_type === "all" || (a.alert_type === "specific" && a.sake_id === sake.id) || (a.alert_type === "category" && a.sake_category === sake.type)) &&
        discountPct >= (a.min_discount_pct ?? 10) &&
        (a.price_threshold === null || v.price <= Number(a.price_threshold)),
    );
    if (matches.length) {
      const { error: notifyError } = await m.db.from("sake_deal_notifications").insert(
        matches.map((a) => ({
          user_id: a.user_id,
          alert_id: a.id,
          snapshot_id: snapshotId,
          sake_id: sake.id,
          sake_name: sake.name,
          retailer_name: v.retailerName,
          new_price: v.price.toFixed(2),
          old_price: v.previousPrice!.toFixed(2),
          discount_pct: discountPct,
        })),
      );
      if (notifyError) return fail("recordPriceSnapshot notify", notifyError.message);
      notified = matches.length;
    }
  }
  return { ok: true, data: { id: snapshotId, notified } };
}

// ─── Checkout ───

/** Whether ordering is open (Stripe set up and SAKE_CHECKOUT_ENABLED=true). Pages show "coming soon" when not. */
export async function isSakeCheckoutOpen(): Promise<boolean> {
  return isSakeCheckoutEnabled();
}

async function customerFor(db: Db, user: User) {
  const { data: saved } = await db.from("sake_stripe_customers").select("stripe_customer_id").eq("user_id", user.id).maybeSingle();
  const existing = (saved as { stripe_customer_id: string } | null)?.stripe_customer_id;
  if (existing) return existing;
  const created = (await createSakeCustomer({ email: user.email, userId: user.id })).id;
  await db.from("sake_stripe_customers").upsert({ user_id: user.id, stripe_customer_id: created }, { onConflict: "user_id" });
  return created;
}

/** Starts Stripe Checkout for bottles (shop.createCheckout). Prices come from the server's catalog. */
export async function startOrderCheckout(items: CartItem[]): Promise<SakeResult<{ url: string }>> {
  const m = await member();
  if ("error" in m) return m.error;
  if (!isSakeCheckoutEnabled()) return { ok: false, error: CHECKOUT_OFF };
  const cart = priceCart(items);
  if (!cart) return { ok: false, error: "Some of those bottles aren't available. Please try again." };
  if ((await recentCount(m.db, "sake_orders", m.user.id, 10)) >= 5) return { ok: false, error: TOO_MANY };
  try {
    const customerId = await customerFor(m.db, m.user);
    const session = await createSakeOrderCheckout({
      customerId,
      userId: m.user.id,
      email: m.user.email,
      name: m.user.name,
      cart,
      origin: await requestOrigin(),
    });
    const { error } = await m.db.from("sake_orders").insert({
      user_id: m.user.id,
      stripe_session_id: session.id,
      status: "pending",
      total_cents: cart.subtotalCents + cart.shippingCents,
      items: cart.items,
    });
    if (error) return fail("startOrderCheckout record", error.message);
    return { ok: true, data: { url: session.url } };
  } catch (err) {
    return fail("startOrderCheckout", err instanceof Error ? err.message : String(err));
  }
}

export type MySubscription = { planTier: string; status: string; currentPeriodEnd: string | null; cancelAtPeriodEnd: boolean } | null;

/** The member's newest box subscription (subscription.getMySubscription). Null when signed out or none. */
export async function getMySubscription(): Promise<MySubscription> {
  const m = await member();
  if ("error" in m) return null;
  const { data } = await m.db
    .from("sake_subscriptions")
    .select("plan_tier, status, current_period_end, cancel_at_period_end")
    .eq("user_id", m.user.id)
    .not("stripe_subscription_id", "is", null)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  const r = data as { plan_tier: string; status: string; current_period_end: string | null; cancel_at_period_end: boolean };
  return { planTier: r.plan_tier, status: r.status, currentPeriodEnd: r.current_period_end, cancelAtPeriodEnd: r.cancel_at_period_end };
}

/** Starts Stripe Checkout for a monthly box (subscription.createSubscriptionCheckout). */
export async function startSubscriptionCheckout(planId: string): Promise<SakeResult<{ url: string }>> {
  const m = await member();
  if ("error" in m) return m.error;
  if (!isSakeCheckoutEnabled()) return { ok: false, error: CHECKOUT_OFF };
  const plan = getSubscriptionPlan(String(planId ?? ""));
  if (!plan) return { ok: false, error: "Plan not found." };
  const sub = await getMySubscription();
  if (sub && ["active", "trialing", "past_due"].includes(sub.status)) return { ok: false, error: "You already have an active subscription." };
  const since = sinceMinutes(10);
  const { count } = await m.db.from("sake_subscriptions").select("id", { count: "exact", head: true }).eq("user_id", m.user.id).gte("created_at", since);
  if ((count ?? 0) >= 5) return { ok: false, error: TOO_MANY };
  try {
    const customerId = await customerFor(m.db, m.user);
    const session = await createSakeSubscriptionCheckout({
      customerId,
      userId: m.user.id,
      email: m.user.email,
      name: m.user.name,
      plan,
      origin: await requestOrigin(),
    });
    // A pending row so a started checkout counts toward the flood guard; the webhook fills it in.
    const { error } = await m.db
      .from("sake_subscriptions")
      .insert({ user_id: m.user.id, stripe_customer_id: customerId, plan_tier: plan.tier, status: "incomplete" });
    if (error) return fail("startSubscriptionCheckout record", error.message);
    return { ok: true, data: { url: session.url } };
  } catch (err) {
    return fail("startSubscriptionCheckout", err instanceof Error ? err.message : String(err));
  }
}
