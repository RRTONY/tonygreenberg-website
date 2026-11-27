import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { PREMIUM_PRICES, PREMIUM_PRODUCT, type LiquidsunPlan } from "@/lib/content/liquidsun/premium";

// Stripe over its REST API with fetch, no SDK (no new npm dependency; same approach as the
// bottle scanners' Anthropic calls). Ported from the LiquidSun Manus app's server/stripe/stripe.ts
// and webhook.ts (2026-11-21). Keys: STRIPE_SECRET_KEY (server only) and STRIPE_WEBHOOK_SECRET.
// The webhook signature is checked here with node:crypto, the way Stripe's SDK does it
// (HMAC-SHA256 of "<timestamp>.<raw body>", compared in constant time, 5-minute tolerance).

const STRIPE_API = "https://api.stripe.com/v1";

export class StripeError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/** True for a test-mode key (sk_test_...). The Premium page only shows the test-card hint then. */
export function isStripeTestMode() {
  return (process.env.STRIPE_SECRET_KEY ?? "").startsWith("sk_test_");
}

type Params = Record<string, string | number | boolean | undefined | null>;

/** Flat bracket-notation params ("line_items[0][price]") as Stripe's form encoding expects. */
export function encodeParams(params: Params) {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    body.append(key, String(value));
  }
  return body;
}

export async function stripeRequest<T>(method: "GET" | "POST", path: string, params: Params = {}): Promise<T> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new StripeError("Stripe is not configured", 503);
  const body = encodeParams(params);
  const url = method === "GET" && body.toString() ? `${STRIPE_API}${path}?${body}` : `${STRIPE_API}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      ...(method === "POST" ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: method === "POST" ? body : undefined,
    signal: AbortSignal.timeout(20_000),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: { message?: string } };
  if (!res.ok) throw new StripeError(data.error?.message || `Stripe returned ${res.status}`, res.status);
  return data;
}

type Price = { id: string; lookup_key: string | null; unit_amount: number | null; recurring: { interval: string } | null };
type List<T> = { data: T[] };

const priceCache: Partial<Record<LiquidsunPlan, string>> = {};

/**
 * The Stripe price id for a plan, found by its lookup key; the product and both prices are
 * created the first time (ensurePricesExist in the app, which searched by product metadata).
 */
export async function getPlanPriceId(plan: LiquidsunPlan): Promise<string> {
  const cached = priceCache[plan];
  if (cached) return cached;
  const wanted = PREMIUM_PRICES[plan];
  const found = await stripeRequest<List<Price>>("GET", "/prices", { "lookup_keys[]": wanted.lookupKey, active: true });
  const match = found.data.find((p) => p.unit_amount === wanted.amount && p.recurring?.interval === wanted.interval);
  if (match) return (priceCache[plan] = match.id);

  const products = await stripeRequest<List<{ id: string }>>("GET", "/products/search", {
    query: `metadata['app']:'liquidsun_premium'`,
  });
  const productId =
    products.data[0]?.id ??
    (
      await stripeRequest<{ id: string }>("POST", "/products", {
        name: PREMIUM_PRODUCT.name,
        description: PREMIUM_PRODUCT.description,
        "metadata[app]": "liquidsun_premium",
      })
    ).id;
  const created = await stripeRequest<Price>("POST", "/prices", {
    product: productId,
    unit_amount: wanted.amount,
    currency: wanted.currency,
    "recurring[interval]": wanted.interval,
    lookup_key: wanted.lookupKey,
    transfer_lookup_key: true,
  });
  return (priceCache[plan] = created.id);
}

export async function createCustomer(opts: { email: string | null; userId: string }) {
  return stripeRequest<{ id: string }>("POST", "/customers", {
    email: opts.email ?? undefined,
    "metadata[supabase_user_id]": opts.userId,
    "metadata[app]": "liquidsun",
  });
}

export async function createCheckoutSession(opts: {
  customerId: string;
  priceId: string;
  userId: string;
  plan: LiquidsunPlan;
  origin: string;
}) {
  const session = await stripeRequest<{ id: string; url: string | null }>("POST", "/checkout/sessions", {
    customer: opts.customerId,
    mode: "subscription",
    "line_items[0][price]": opts.priceId,
    "line_items[0][quantity]": 1,
    success_url: `${opts.origin}/liquid-sun/premium/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${opts.origin}/liquid-sun/premium`,
    allow_promotion_codes: true,
    client_reference_id: opts.userId,
    "metadata[supabase_user_id]": opts.userId,
    "metadata[plan]": opts.plan,
    "subscription_data[metadata][supabase_user_id]": opts.userId,
    "subscription_data[metadata][plan]": opts.plan,
  });
  if (!session.url) throw new StripeError("Stripe did not return a checkout link", 502);
  return session.url;
}

export async function createPortalSession(opts: { customerId: string; origin: string }) {
  const session = await stripeRequest<{ url: string }>("POST", "/billing_portal/sessions", {
    customer: opts.customerId,
    return_url: `${opts.origin}/liquid-sun/premium`,
  });
  return session.url;
}

export type StripeSubscription = {
  id: string;
  customer: string;
  status: string;
  cancel_at_period_end?: boolean;
  current_period_end?: number;
  metadata?: Record<string, string>;
  items?: { data: { current_period_end?: number; price?: { id: string; lookup_key?: string | null } }[] };
};

export function retrieveSubscription(id: string) {
  return stripeRequest<StripeSubscription>("GET", `/subscriptions/${encodeURIComponent(id)}`);
}

const TOLERANCE_SECONDS = 300;

/**
 * Checks a `Stripe-Signature` header ("t=<unix>,v1=<hex>[,v1=...]") against the raw request body.
 * Returns the parsed event, or null when the signature, timestamp or body is not valid.
 */
export function verifyStripeWebhook<T = unknown>(
  rawBody: string,
  header: string | null,
  secret: string,
  now = Math.floor(Date.now() / 1000),
): T | null {
  if (!header || !secret) return null;
  const parts = header.split(",").map((p) => p.trim().split("="));
  const timestamp = Number(parts.find(([k]) => k === "t")?.[1]);
  const signatures = parts.filter(([k, v]) => k === "v1" && v).map(([, v]) => v);
  if (!Number.isFinite(timestamp) || signatures.length === 0) return null;
  if (Math.abs(now - timestamp) > TOLERANCE_SECONDS) return null;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`, "utf8").digest();
  const ok = signatures.some((sig) => {
    const given = Buffer.from(sig, "hex");
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
  if (!ok) return null;
  try {
    return JSON.parse(rawBody) as T;
  } catch {
    return null;
  }
}
