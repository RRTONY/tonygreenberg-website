"use server";

import { headers } from "next/headers";
import { getUser, isAdmin } from "@/lib/auth";
import { createServiceRoleClient, isServiceRoleConfigured } from "@/lib/supabase/service-role";
import { isStripeConfigured } from "@/lib/stripe";
import { claimSchema, projectSchema, type ClaimValues, type ProjectValues } from "@/lib/content/aqueous/forms";
import {
  ACTIVE_SUBSCRIPTION_STATUSES,
  AQUEOUS_PRODUCTS,
  FREE_REPORT_SIGNUPS,
  type AqueousProductType,
} from "@/lib/content/aqueous/products";
import { createAqueousCheckout, createAqueousCustomer } from "@/lib/content/aqueous/aqueous-stripe";

// Aqueous's server features, ported from the Aqueous Manus app's tRPC routers (server/routers.ts,
// db.ts, stripe.ts) onto this site's Supabase (tables: supabase/migrations/0010_aqueous.sql) and
// Stripe. Supabase Auth replaces Manus OAuth; the owner check is this site's ADMIN_EMAILS. Every
// query runs on the server with the service-role key, scoped to the signed-in member, and every
// form input is checked again with the same Yup schema the form uses.
//
// Fixed from the app (flagged in docs/ai/project_aqueous_port.md):
// - A visitor who isn't signed in has no referral code (the app made a new, unusable code on every
//   page load for them); members get one code each, credited to their email as before.
// - One referral claim per email in total, not your own code, and a flood guard per code.
// - Credit spent at checkout is taken off the balance (the app never deducted it).
// - A report needs a paid report purchase or the free report at 10 sign-ups (the app let any
//   signed-in visitor generate the $20 report for free).

const SITE = "https://tonygreenberg.com";
const UNAVAILABLE = "This couldn't be done just now. Please try again in a minute.";
const SIGN_IN = "Please sign in first.";
const TOO_MANY = "That's a lot at once. Please wait a few minutes.";

export type AqueousResult<T = null> = { ok: true; data: T } | { ok: false; error: string; signedOut?: boolean };

type Db = ReturnType<typeof createServiceRoleClient>;
type Member = { id: string; email: string | null; name: string | null };

async function member(): Promise<{ user: Member; db: Db } | { error: AqueousResult<never> }> {
  if (!isServiceRoleConfigured()) return { error: { ok: false, error: UNAVAILABLE } };
  const user = await getUser();
  if (!user) return { error: { ok: false, error: SIGN_IN, signedOut: true } };
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const name = typeof meta.full_name === "string" ? meta.full_name : typeof meta.name === "string" ? meta.name : null;
  return { user: { id: user.id, email: user.email ?? null, name }, db: createServiceRoleClient() };
}

function fail(where: string, message: string): AqueousResult<never> {
  console.error(`[aqueous] ${where}:`, message);
  return { ok: false, error: UNAVAILABLE };
}

async function validate<T>(schema: { validate: (v: unknown, o: object) => Promise<T> }, input: unknown) {
  try {
    return { value: await schema.validate(input, { stripUnknown: true, abortEarly: true }) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Please check the form." };
  }
}

const money = (n: number) => n.toFixed(2);

function randomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `AQ-${Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("")}`;
}

/** The member's credit balance in dollars (the ledger keyed by email, as in the app). */
async function creditFor(db: Db, email: string | null) {
  if (!email) return 0;
  const { data } = await db.from("aqueous_referral_credits").select("amount").ilike("email", email);
  const total = ((data ?? []) as { amount: string | number }[]).reduce((sum, r) => sum + Number(r.amount), 0);
  return Math.max(0, Math.round(total * 100) / 100);
}

async function signupCount(db: Db, code: string) {
  const { count } = await db
    .from("aqueous_referral_signups")
    .select("id", { count: "exact", head: true })
    .eq("referrer_code", code);
  return count ?? 0;
}

async function subscriptionFor(db: Db, userId: string) {
  const { data } = await db
    .from("aqueous_subscriptions")
    .select("stripe_subscription_id, status, current_period_end")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(5);
  const rows = (data ?? []) as { stripe_subscription_id: string; status: string; current_period_end: string | null }[];
  const now = Date.now();
  const live = rows.find(
    (r) =>
      ACTIVE_SUBSCRIPTION_STATUSES.includes(r.status) &&
      (!r.current_period_end || new Date(r.current_period_end).getTime() > now),
  );
  return { id: live?.stripe_subscription_id ?? null, status: live ? "active" : (rows[0]?.status ?? null) };
}

// ─── Member ───

export type AqueousMember = {
  signedIn: boolean;
  email: string | null;
  name: string | null;
  isAdmin: boolean;
  subscriptionStatus: string | null;
};

const SIGNED_OUT: AqueousMember = { signedIn: false, email: null, name: null, isAdmin: false, subscriptionStatus: null };

/** Who is visiting (the app's auth.me): signed in or not, owner or not, plan status. */
export async function getAqueousMember(): Promise<AqueousMember> {
  const m = await member();
  if ("error" in m) return SIGNED_OUT;
  const sub = await subscriptionFor(m.db, m.user.id);
  return {
    signedIn: true,
    email: m.user.email,
    name: m.user.name,
    isAdmin: isAdmin(m.user.email),
    subscriptionStatus: sub.status,
  };
}

// ─── Referrals ───

export type ReferralStats = { code: string; shares: number; signups: number; credits: string; freeReportUnlocked: boolean };

async function codeFor(db: Db, user: Member) {
  const { data: existing } = await db.from("aqueous_referral_codes").select("code, share_count").eq("user_id", user.id).maybeSingle();
  if (existing) return existing as { code: string; share_count: number };
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomCode();
    const { data, error } = await db
      .from("aqueous_referral_codes")
      .insert({ code, user_id: user.id, email: user.email })
      .select("code, share_count")
      .single();
    if (!error && data) return data as { code: string; share_count: number };
    if (error && error.code !== "23505") throw new Error(error.message);
    // 23505: the code (or a row for this member, from a parallel request) already exists. Retry/re-read.
    const { data: again } = await db.from("aqueous_referral_codes").select("code, share_count").eq("user_id", user.id).maybeSingle();
    if (again) return again as { code: string; share_count: number };
  }
  throw new Error("Could not create a referral code");
}

/** The member's own code and stats (the app's referral.getCode + referral.stats). Null when signed out. */
export async function getMyReferral(): Promise<ReferralStats | null> {
  const m = await member();
  if ("error" in m) return null;
  try {
    const row = await codeFor(m.db, m.user);
    const signups = await signupCount(m.db, row.code);
    const credits = await creditFor(m.db, m.user.email);
    return {
      code: row.code,
      shares: row.share_count,
      signups,
      credits: money(credits),
      freeReportUnlocked: signups >= FREE_REPORT_SIGNUPS,
    };
  } catch (err) {
    console.error("[aqueous] getMyReferral:", err instanceof Error ? err.message : err);
    return null;
  }
}

/** Counts one share of the member's link (referral.trackShare). Signed-out shares aren't counted. */
export async function trackShare(): Promise<AqueousResult> {
  const m = await member();
  if ("error" in m) return { ok: true, data: null };
  const { data } = await m.db.from("aqueous_referral_codes").select("id, share_count").eq("user_id", m.user.id).maybeSingle();
  if (!data) return { ok: true, data: null };
  const row = data as { id: number; share_count: number };
  const { error } = await m.db.from("aqueous_referral_codes").update({ share_count: row.share_count + 1 }).eq("id", row.id);
  if (error) return fail("trackShare", error.message);
  return { ok: true, data: null };
}

export type ClaimResult = { alreadyClaimed: boolean; totalSignups?: number; freeReportUnlocked?: boolean };

/** A visitor from a ?ref= link claims the $5 discount with their email (referral.claim). */
export async function claimReferral(referrerCode: string, input: ClaimValues): Promise<AqueousResult<ClaimResult>> {
  if (!isServiceRoleConfigured()) return { ok: false, error: UNAVAILABLE };
  const checked = await validate(claimSchema, input);
  if ("error" in checked) return { ok: false, error: checked.error ?? "Please check the form." };
  const code = String(referrerCode ?? "").trim().toUpperCase();
  if (!/^AQ-[A-Z0-9]{6}$/.test(code)) return { ok: false, error: "That referral link isn't valid." };
  const email = checked.value.email.toLowerCase();
  const name = checked.value.name || null;
  const db = createServiceRoleClient();

  const { data: referrer } = await db.from("aqueous_referral_codes").select("code, email").eq("code", code).maybeSingle();
  if (!referrer) return { ok: false, error: "That referral link isn't valid." };
  const ref = referrer as { code: string; email: string | null };
  if (ref.email && ref.email.toLowerCase() === email) return { ok: false, error: "You can't claim your own referral link." };

  const { data: existing } = await db.from("aqueous_referral_signups").select("id").eq("referred_email", email).maybeSingle();
  if (existing) return { ok: true, data: { alreadyClaimed: true } };

  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count: recent } = await db
    .from("aqueous_referral_signups")
    .select("id", { count: "exact", head: true })
    .eq("referrer_code", code)
    .gte("created_at", since);
  if ((recent ?? 0) >= 5) return { ok: false, error: TOO_MANY };

  const { data: signup, error } = await db
    .from("aqueous_referral_signups")
    .insert({ referrer_code: code, referred_email: email, referred_name: name })
    .select("id")
    .single();
  if (error?.code === "23505") return { ok: true, data: { alreadyClaimed: true } };
  if (error || !signup) return fail("claimReferral", error?.message ?? "no row");
  const signupId = (signup as { id: number }).id;

  const credits = [{ email, amount: 5, reason: "referral_discount", referral_signup_id: signupId }];
  if (ref.email) credits.push({ email: ref.email, amount: 5, reason: "referral_reward", referral_signup_id: signupId });
  const { error: creditError } = await db.from("aqueous_referral_credits").insert(credits);
  if (creditError) return fail("claimReferral credits", creditError.message);
  await db
    .from("aqueous_referral_signups")
    .update({ discount_applied: true, referrer_credited: Boolean(ref.email) })
    .eq("id", signupId);

  const totalSignups = await signupCount(db, code);
  return { ok: true, data: { alreadyClaimed: false, totalSignups, freeReportUnlocked: totalSignups >= FREE_REPORT_SIGNUPS } };
}

export type LeaderboardRow = { code: string; signups: number; displayName: string };

/** Top referrers by sign-ups, emails masked (referral.leaderboard). */
export async function getReferralLeaderboard(limit = 10): Promise<LeaderboardRow[]> {
  if (!isServiceRoleConfigured()) return [];
  const db = createServiceRoleClient();
  const { data } = await db.from("aqueous_referral_signups").select("referrer_code").limit(5000);
  const counts = new Map<string, number>();
  for (const r of (data ?? []) as { referrer_code: string }[]) counts.set(r.referrer_code, (counts.get(r.referrer_code) ?? 0) + 1);
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, Math.min(Math.max(limit, 1), 50));
  if (top.length === 0) return [];
  const { data: codes } = await db.from("aqueous_referral_codes").select("code, email").in("code", top.map(([c]) => c));
  const emails = new Map(((codes ?? []) as { code: string; email: string | null }[]).map((c) => [c.code, c.email]));
  return top.map(([code, signups]) => {
    const email = emails.get(code) ?? "";
    // Mask email for privacy: j****@gmail.com (the app's rule)
    const displayName = email
      ? email.replace(/^(.)(.*)(@.*)$/, (_, a: string, b: string, c: string) => a + "*".repeat(Math.min(b.length, 4)) + c)
      : "Anonymous";
    return { code, signups, displayName };
  });
}

// ─── Directory projects ───

export type AqueousProject = { id: number; name: string; description: string | null; url: string; tag: string | null; sortOrder: number };

export async function listProjects(): Promise<AqueousProject[]> {
  if (!isServiceRoleConfigured()) return [];
  const db = createServiceRoleClient();
  const { data, error } = await db
    .from("aqueous_projects")
    .select("id, name, description, url, tag, sort_order")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });
  if (error) {
    console.error("[aqueous] listProjects:", error.message);
    return [];
  }
  return ((data ?? []) as { id: number; name: string; description: string | null; url: string; tag: string | null; sort_order: number }[]).map(
    (p) => ({ id: p.id, name: p.name, description: p.description, url: p.url, tag: p.tag, sortOrder: p.sort_order }),
  );
}

async function owner() {
  const m = await member();
  if ("error" in m) return m;
  if (!isAdmin(m.user.email)) return { error: { ok: false as const, error: "Only the site owner can do that." } };
  return m;
}

/** Owner only (projects.create). */
export async function createProject(input: ProjectValues): Promise<AqueousResult<{ id: number }>> {
  const o = await owner();
  if ("error" in o) return o.error;
  const checked = await validate(projectSchema, input);
  if ("error" in checked) return { ok: false, error: checked.error ?? "Please check the form." };
  const v = checked.value;
  const { data: last } = await o.db.from("aqueous_projects").select("sort_order").order("sort_order", { ascending: false }).limit(1);
  const nextOrder = (((last ?? []) as { sort_order: number }[])[0]?.sort_order ?? 0) + 1;
  const { data, error } = await o.db
    .from("aqueous_projects")
    .insert({ name: v.name, url: v.url, description: v.description || null, tag: v.tag || null, sort_order: nextOrder })
    .select("id")
    .single();
  if (error || !data) return fail("createProject", error?.message ?? "no row");
  return { ok: true, data: { id: (data as { id: number }).id } };
}

/** Owner only (projects.delete). */
export async function deleteProject(id: number): Promise<AqueousResult> {
  const o = await owner();
  if ("error" in o) return o.error;
  if (!Number.isInteger(id) || id <= 0) return { ok: false, error: "Unknown project." };
  const { error } = await o.db.from("aqueous_projects").delete().eq("id", id);
  if (error) return fail("deleteProject", error.message);
  return { ok: true, data: null };
}

// ─── Checkout ───

/** The member's credit balance (stripe.getCredit). */
export async function getMyCredit(): Promise<number> {
  const m = await member();
  if ("error" in m) return 0;
  return creditFor(m.db, m.user.email);
}

async function origin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : SITE;
}

/** Starts Stripe Checkout for the report or the monthly plan (stripe.createCheckout). */
export async function startCheckout(productType: AqueousProductType, applyCredit = false): Promise<AqueousResult<{ url: string }>> {
  const m = await member();
  if ("error" in m) return m.error;
  if (!(productType in AQUEOUS_PRODUCTS)) return { ok: false, error: "Unknown product." };
  if (!isStripeConfigured()) return { ok: false, error: "Checkout isn't available yet. Please try again later." };
  const { user, db } = m;

  // At most 5 checkouts started per member per 10 minutes.
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count } = await db.from("aqueous_purchases").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", since);
  if ((count ?? 0) >= 5) return { ok: false, error: TOO_MANY };

  try {
    const { data: saved } = await db.from("aqueous_stripe_customers").select("stripe_customer_id").eq("user_id", user.id).maybeSingle();
    let customerId = (saved as { stripe_customer_id: string } | null)?.stripe_customer_id ?? null;
    if (!customerId) {
      customerId = (await createAqueousCustomer({ email: user.email, userId: user.id })).id;
      await db.from("aqueous_stripe_customers").upsert({ user_id: user.id, stripe_customer_id: customerId }, { onConflict: "user_id" });
    }

    const product = AQUEOUS_PRODUCTS[productType];
    let creditCents = 0;
    if (applyCredit && product.mode === "payment") {
      const credit = await creditFor(db, user.email);
      creditCents = Math.max(0, Math.min(Math.round(credit * 100), product.priceInCents - 50)); // Stripe min $0.50
    }

    const session = await createAqueousCheckout({
      customerId,
      userId: user.id,
      email: user.email,
      productType,
      origin: await origin(),
      creditCents,
    });
    const { error } = await db.from("aqueous_purchases").insert({
      user_id: user.id,
      stripe_session_id: session.id,
      product_type: productType,
      status: "pending",
      credit_applied: money(creditCents / 100),
    });
    if (error) return fail("startCheckout record", error.message);
    return { ok: true, data: { url: session.url } };
  } catch (err) {
    return fail("startCheckout", err instanceof Error ? err.message : String(err));
  }
}

// ─── Dashboard ───

export type AqueousPurchase = { id: number; productType: string; status: string; creditApplied: string; createdAt: string };
export type AqueousReportSummary = { id: number; title: string; status: string; createdAt: string };

export type AqueousDashboard = {
  user: { name: string | null; email: string | null; isAdmin: boolean };
  purchases: AqueousPurchase[];
  reports: AqueousReportSummary[];
  referral: ReferralStats | null;
  credit: number;
  subscription: { id: string | null; status: string | null };
  /** Reports the member may still generate: paid report purchases + the free one at 10 sign-ups, minus reports made. */
  reportsAvailable: number;
};

async function reportAllowance(db: Db, userId: string, freeReportUnlocked: boolean) {
  const [{ count: paid }, { count: made }] = await Promise.all([
    db.from("aqueous_purchases").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("product_type", "report").eq("status", "completed"),
    db.from("aqueous_reports").select("id", { count: "exact", head: true }).eq("user_id", userId).neq("status", "failed"),
  ]);
  return Math.max(0, (paid ?? 0) + (freeReportUnlocked ? 1 : 0) - (made ?? 0));
}

/** Everything the /aqueous/dashboard page shows (dashboard.overview). */
export async function getDashboard(): Promise<AqueousResult<AqueousDashboard>> {
  const m = await member();
  if ("error" in m) return m.error;
  const { user, db } = m;
  const [purchases, reports, referral, credit, subscription] = await Promise.all([
    db.from("aqueous_purchases").select("id, product_type, status, credit_applied, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
    db.from("aqueous_reports").select("id, title, status, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
    getMyReferral(),
    creditFor(db, user.email),
    subscriptionFor(db, user.id),
  ]);
  if (purchases.error || reports.error) return fail("getDashboard", (purchases.error ?? reports.error)?.message ?? "");
  return {
    ok: true,
    data: {
      user: { name: user.name, email: user.email, isAdmin: isAdmin(user.email) },
      purchases: ((purchases.data ?? []) as { id: number; product_type: string; status: string; credit_applied: string | number; created_at: string }[]).map((p) => ({
        id: p.id,
        productType: p.product_type,
        status: p.status,
        creditApplied: money(Number(p.credit_applied)),
        createdAt: p.created_at,
      })),
      reports: ((reports.data ?? []) as { id: number; title: string; status: string; created_at: string }[]).map((r) => ({
        id: r.id,
        title: r.title,
        status: r.status,
        createdAt: r.created_at,
      })),
      referral,
      credit,
      subscription,
      reportsAvailable: await reportAllowance(db, user.id, Boolean(referral?.freeReportUnlocked)),
    },
  };
}

// ─── Reports ───

/**
 * Starts a new report (reports.generate). Returns its id; the page then opens
 * /aqueous/report/<id>, which streams the writing from /api/aqueous/reports/<id>/generate.
 */
export async function createReport(waterProfile?: Record<string, number> | null): Promise<AqueousResult<{ reportId: number }>> {
  const m = await member();
  if ("error" in m) return m.error;
  const { user, db } = m;
  const referral = await getMyReferral();
  const available = await reportAllowance(db, user.id, Boolean(referral?.freeReportUnlocked));
  if (available <= 0) {
    return { ok: false, error: "Reports come with a report purchase ($20), or free once 10 people sign up with your link." };
  }
  const profile =
    waterProfile && typeof waterProfile === "object"
      ? Object.fromEntries(
          Object.entries(waterProfile)
            .filter(([k, v]) => /^[a-zA-Z]{1,40}$/.test(k) && typeof v === "number" && Number.isFinite(v))
            .slice(0, 20),
        )
      : null;
  const { data: purchase } = await db
    .from("aqueous_purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_type", "report")
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { data, error } = await db
    .from("aqueous_reports")
    .insert({ user_id: user.id, purchase_id: (purchase as { id: number } | null)?.id ?? null, water_profile: profile, status: "pending" })
    .select("id")
    .single();
  if (error || !data) return fail("createReport", error?.message ?? "no row");
  return { ok: true, data: { reportId: (data as { id: number }).id } };
}

export type AqueousReport = { id: number; title: string; status: string; reportContent: string | null; createdAt: string };

/** One of the member's own reports (reports.get). */
export async function getReport(id: number): Promise<AqueousResult<AqueousReport>> {
  const m = await member();
  if ("error" in m) return m.error;
  if (!Number.isInteger(id) || id <= 0) return { ok: false, error: "Report not found" };
  const { data, error } = await m.db
    .from("aqueous_reports")
    .select("id, title, status, report_content, created_at")
    .eq("id", id)
    .eq("user_id", m.user.id)
    .maybeSingle();
  if (error) return fail("getReport", error.message);
  if (!data) return { ok: false, error: "Report not found" };
  const r = data as { id: number; title: string; status: string; report_content: string | null; created_at: string };
  return { ok: true, data: { id: r.id, title: r.title, status: r.status, reportContent: r.report_content, createdAt: r.created_at } };
}
