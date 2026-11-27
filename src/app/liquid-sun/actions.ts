"use server";

import { headers } from "next/headers";
import { getUser } from "@/lib/auth";
import { createServiceRoleClient, isServiceRoleConfigured } from "@/lib/supabase/service-role";
import { esc, sendEmail } from "@/lib/email";
import { partnerSchema, tastingSchema, type PartnerValues, type TastingValues } from "@/lib/content/liquidsun/forms";
import { PREMIUM_STATUSES, type LiquidsunPlan } from "@/lib/content/liquidsun/premium";
import {
  createCheckoutSession,
  createCustomer,
  createPortalSession,
  getPlanPriceId,
  isStripeConfigured,
} from "@/lib/stripe";

// LiquidSun's server features, ported from the LiquidSun Manus app's tRPC routers onto this site's
// Supabase (tables: supabase/migrations/0009_liquidsun.sql) and Stripe (src/lib/stripe.ts):
// partner.submit, subscription.getStatus / createCheckout / createPortal, plus "The Log"
// (the app's tasting journal kept entries only until the page was closed). As on SoulSmoke, these
// need a signed-in member (Supabase Auth replaces Manus OAuth); every query is scoped to that
// member here on the server. Every input is checked again with the same Yup schema the form uses.

const OWNER_EMAIL = "tony@tonygreenberg.com";
const SITE = "https://tonygreenberg.com";
const UNAVAILABLE = "This couldn't be saved just now. Please try again in a minute.";
const SIGN_IN = "Please sign in first.";
const TOO_MANY = "That's a lot at once. Please wait a few minutes.";

export type LiquidsunResult<T = null> = { ok: true; data: T } | { ok: false; error: string; signedOut?: boolean };

type Db = ReturnType<typeof createServiceRoleClient>;
type Member = { id: string; email: string | null };

async function member(): Promise<{ user: Member; db: Db } | { error: LiquidsunResult<never> }> {
  if (!isServiceRoleConfigured()) return { error: { ok: false, error: UNAVAILABLE } };
  const user = await getUser();
  if (!user) return { error: { ok: false, error: SIGN_IN, signedOut: true } };
  return { user: { id: user.id, email: user.email ?? null }, db: createServiceRoleClient() };
}

function fail(where: string, message: string): LiquidsunResult<never> {
  console.error(`[liquidsun] ${where}:`, message);
  return { ok: false, error: UNAVAILABLE };
}

// At most `limit` new rows per member in `table` per 10 minutes.
async function flooded(db: Db, table: string, userId: string, limit: number) {
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count } = await db.from(table).select("id", { count: "exact", head: true }).eq("user_id", userId).gte("created_at", since);
  return (count ?? 0) >= limit;
}

async function validate<T>(schema: { validate: (v: unknown, o: object) => Promise<T> }, input: unknown) {
  try {
    return { value: await schema.validate(input, { stripUnknown: true, abortEarly: true }) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Please check the form." };
  }
}

async function isPremiumMember(db: Db, userId: string) {
  const { data } = await db
    .from("liquidsun_subscriptions")
    .select("status, current_period_end")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(5);
  const now = Date.now();
  const rows = (data ?? []) as { status: string; current_period_end: string | null }[];
  const live = rows.find(
    (r) => PREMIUM_STATUSES.includes(r.status) && (!r.current_period_end || new Date(r.current_period_end).getTime() > now),
  );
  return { isPremium: Boolean(live), status: live?.status ?? rows[0]?.status ?? null, currentPeriodEnd: live?.current_period_end ?? null };
}

export type LiquidsunMember = {
  signedIn: boolean;
  isPremium: boolean;
  subscriptionStatus: string | null;
  currentPeriodEnd: string | null;
  hasCustomer: boolean;
};

const SIGNED_OUT: LiquidsunMember = {
  signedIn: false,
  isPremium: false,
  subscriptionStatus: null,
  currentPeriodEnd: null,
  hasCustomer: false,
};

/** Whether a member is signed in and Premium (the app's auth.me + subscription.getStatus). */
export async function getLiquidsunMember(): Promise<LiquidsunMember> {
  const user = await getUser();
  if (!user) return SIGNED_OUT;
  if (!isServiceRoleConfigured()) return { ...SIGNED_OUT, signedIn: true };
  const db = createServiceRoleClient();
  const [premium, customer] = await Promise.all([
    isPremiumMember(db, user.id),
    db.from("liquidsun_stripe_customers").select("stripe_customer_id").eq("user_id", user.id).maybeSingle(),
  ]);
  return {
    signedIn: true,
    isPremium: premium.isPremium,
    subscriptionStatus: premium.status,
    currentPeriodEnd: premium.currentPeriodEnd,
    hasCustomer: Boolean(customer.data?.stripe_customer_id),
  };
}

// ── The Log (tasting journal) ──

export type LogEntry = { id: string; producerId: string; rating: number; notes: string; date: string };
type LogRow = { id: number; producer_id: string; rating: number; notes: string | null; created_at: string };
const toLog = (r: LogRow): LogEntry => ({
  id: String(r.id),
  producerId: r.producer_id,
  rating: r.rating,
  notes: r.notes ?? "",
  date: r.created_at,
});

export async function listLogEntries(): Promise<LiquidsunResult<LogEntry[]>> {
  const m = await member();
  if ("error" in m) return m.error;
  const { data, error } = await m.db
    .from("liquidsun_tasting_entries")
    .select("id, producer_id, rating, notes, created_at")
    .eq("user_id", m.user.id)
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) return fail("list log", error.message);
  return { ok: true, data: (data as LogRow[]).map(toLog) };
}

export async function addLogEntry(input: TastingValues): Promise<LiquidsunResult<LogEntry>> {
  const checked = await validate(tastingSchema(), input);
  if ("error" in checked) return { ok: false, error: checked.error ?? UNAVAILABLE };
  const m = await member();
  if ("error" in m) return m.error;
  if (await flooded(m.db, "liquidsun_tasting_entries", m.user.id, 30)) return { ok: false, error: TOO_MANY };
  const v = checked.value;
  const { data, error } = await m.db
    .from("liquidsun_tasting_entries")
    .insert({ user_id: m.user.id, producer_id: v.producerId, rating: v.rating, notes: v.notes?.trim() || null })
    .select("id, producer_id, rating, notes, created_at")
    .single();
  if (error) return fail("add log", error.message);
  return { ok: true, data: toLog(data as LogRow) };
}

export async function deleteLogEntry(id: string): Promise<LiquidsunResult> {
  if (!/^\d{1,18}$/.test(id)) return { ok: false, error: UNAVAILABLE };
  const m = await member();
  if ("error" in m) return m.error;
  const { error } = await m.db.from("liquidsun_tasting_entries").delete().eq("id", id).eq("user_id", m.user.id);
  if (error) return fail("delete log", error.message);
  return { ok: true, data: null };
}

// ── Become a Partner (partner.submit) ──

export async function submitPartnerInquiry(input: PartnerValues): Promise<LiquidsunResult> {
  const checked = await validate(partnerSchema(), input);
  if ("error" in checked) return { ok: false, error: checked.error ?? UNAVAILABLE };
  const m = await member();
  if ("error" in m) return m.error;
  if (await flooded(m.db, "liquidsun_partner_inquiries", m.user.id, 5)) return { ok: false, error: TOO_MANY };
  const v = checked.value;
  const row = {
    user_id: m.user.id,
    brand_name: v.brandName.trim(),
    contact_name: v.contactName.trim(),
    contact_email: v.contactEmail.trim(),
    nom: v.nom?.trim() || null,
    website: v.website?.trim() || null,
    tier_interest: v.tierInterest,
    message: v.message?.trim() || null,
  };
  const { error } = await m.db.from("liquidsun_partner_inquiries").insert(row);
  if (error) return fail("partner", error.message);
  // The app's notifyOwner: "New Partner Inquiry: <brand>" with the same lines.
  const lines: [string, string | null][] = [
    ["Brand", row.brand_name],
    ["Contact", `${row.contact_name} (${row.contact_email})`],
    ["NOM", row.nom],
    ["Website", row.website],
    ["Tier Interest", row.tier_interest.toUpperCase()],
    ["Message", row.message],
    ["Member email", m.user.email],
  ];
  const body = lines
    .filter(([, value]) => value)
    .map(
      ([k, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#666;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;white-space:pre-wrap">${esc(value as string)}</td></tr>`,
    )
    .join("");
  await sendEmail(
    OWNER_EMAIL,
    `LiquidSun: New Partner Inquiry: ${row.brand_name}`,
    `<p>A brand asked to partner with LiquidSun.</p><table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">${body}</table><p><a href="${SITE}/liquid-sun/partner">${SITE}/liquid-sun/partner</a></p>`,
  );
  return { ok: true, data: null };
}

// ── Premium (subscription.createCheckout / createPortal) ──

/** The site's own origin for Stripe's return links: the request's host, or the configured site URL. */
async function siteOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  if (host && /^[a-z0-9.-]+(:\d+)?$/i.test(host)) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_SITE_URL || SITE;
}

const PAYMENTS_UNAVAILABLE = "Checkout isn't available just now. Please try again in a minute.";

export async function startPremiumCheckout(plan: LiquidsunPlan): Promise<LiquidsunResult<{ url: string }>> {
  if (plan !== "monthly" && plan !== "annual") return { ok: false, error: PAYMENTS_UNAVAILABLE };
  if (!isStripeConfigured()) return { ok: false, error: PAYMENTS_UNAVAILABLE };
  const m = await member();
  if ("error" in m) return m.error;
  try {
    const premium = await isPremiumMember(m.db, m.user.id);
    if (premium.isPremium) return { ok: false, error: "You're already Premium." };
    const { data: existing } = await m.db
      .from("liquidsun_stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", m.user.id)
      .maybeSingle();
    let customerId = existing?.stripe_customer_id as string | undefined;
    if (!customerId) {
      customerId = (await createCustomer({ email: m.user.email, userId: m.user.id })).id;
      const { error } = await m.db.from("liquidsun_stripe_customers").insert({ user_id: m.user.id, stripe_customer_id: customerId });
      if (error) return fail("save customer", error.message);
    }
    const priceId = await getPlanPriceId(plan);
    const url = await createCheckoutSession({ customerId, priceId, userId: m.user.id, plan, origin: await siteOrigin() });
    return { ok: true, data: { url } };
  } catch (err) {
    console.error("[liquidsun] checkout:", err instanceof Error ? err.message : err);
    return { ok: false, error: PAYMENTS_UNAVAILABLE };
  }
}

export async function openBillingPortal(): Promise<LiquidsunResult<{ url: string }>> {
  if (!isStripeConfigured()) return { ok: false, error: PAYMENTS_UNAVAILABLE };
  const m = await member();
  if ("error" in m) return m.error;
  const { data } = await m.db.from("liquidsun_stripe_customers").select("stripe_customer_id").eq("user_id", m.user.id).maybeSingle();
  const customerId = data?.stripe_customer_id as string | undefined;
  if (!customerId) return { ok: false, error: "No Stripe customer found. Please subscribe first." };
  try {
    return { ok: true, data: { url: await createPortalSession({ customerId, origin: await siteOrigin() }) } };
  } catch (err) {
    console.error("[liquidsun] portal:", err instanceof Error ? err.message : err);
    return { ok: false, error: "Failed to open billing portal" };
  }
}
