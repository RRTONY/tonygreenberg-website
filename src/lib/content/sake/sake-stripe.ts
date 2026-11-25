import "server-only";
import { isStripeConfigured, StripeError, stripeRequest } from "@/lib/stripe";
import { FREE_SHIPPING_THRESHOLD_CENTS, SHIPPING_RATE_CENTS, getProduct } from "@/lib/content/sake/shop-data";
import type { SubscriptionPlan } from "@/lib/content/sake/products";
import { sakeDetailPath, sk } from "@/lib/content/sake/nav";

// Sake checkout over Stripe's REST API (the shared src/lib/stripe.ts request helper, no SDK), ported
// from the Sake Manus app's server/stripe/checkout.ts and server/routers/subscription.ts. Same as the
// app: inline price data, US shipping addresses only, flat $9.99 shipping under $75, promotion codes
// allowed, and the monthly boxes as subscriptions.
// Changed:
// - Payments are OFF unless SAKE_CHECKOUT_ENABLED=true is set as well as the Stripe key. Selling
//   alcohol by mail needs the owner's approval and the right licences first, so the buttons show
//   "coming soon" until then (isSakeCheckoutEnabled).
// - Every price comes from the server's catalog (shop-data.ts), never from the browser.
// - The app returned paid orders to /orders, a page it never had (a 404 after paying); orders now
//   return to the sake's own page, subscriptions to /sake/subscription as before.

export function isSakeCheckoutEnabled() {
  return isStripeConfigured() && process.env.SAKE_CHECKOUT_ENABLED === "true";
}

export const MAX_QUANTITY = 12;

export type CartItem = { productId: string; quantity: number };
export type PricedItem = { productId: string; name: string; quantity: number; unitCents: number };

/** Prices a cart from the catalog. Null when any item is unknown, unavailable or out of range. */
export function priceCart(items: CartItem[]): { items: PricedItem[]; subtotalCents: number; shippingCents: number } | null {
  if (!Array.isArray(items) || items.length === 0 || items.length > 20) return null;
  const priced: PricedItem[] = [];
  for (const item of items) {
    const product = typeof item?.productId === "string" ? getProduct(item.productId) : undefined;
    const quantity = Number(item?.quantity);
    if (!product || !product.available || product.priceCents <= 0) return null;
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) return null;
    if (priced.some((p) => p.productId === product.id)) return null;
    priced.push({ productId: product.id, name: product.name, quantity, unitCents: product.priceCents });
  }
  const subtotalCents = priced.reduce((sum, p) => sum + p.unitCents * p.quantity, 0);
  return { items: priced, subtotalCents, shippingCents: subtotalCents < FREE_SHIPPING_THRESHOLD_CENTS ? SHIPPING_RATE_CENTS : 0 };
}

export async function createSakeCustomer(opts: { email: string | null; userId: string }) {
  return stripeRequest<{ id: string }>("POST", "/customers", {
    email: opts.email ?? undefined,
    "metadata[supabase_user_id]": opts.userId,
    "metadata[app]": "sake",
  });
}

export async function createSakeOrderCheckout(opts: {
  customerId: string;
  userId: string;
  email: string | null;
  name: string | null;
  cart: NonNullable<ReturnType<typeof priceCart>>;
  origin: string;
}) {
  const params: Record<string, string | number | boolean | undefined> = {
    customer: opts.customerId,
    mode: "payment",
    client_reference_id: opts.userId,
    allow_promotion_codes: true,
    "shipping_address_collection[allowed_countries][0]": "US",
    "metadata[app]": "sake",
    "metadata[supabase_user_id]": opts.userId,
    "metadata[customer_email]": opts.email ?? "",
    "metadata[customer_name]": opts.name ?? "",
  };
  opts.cart.items.forEach((item, i) => {
    const product = getProduct(item.productId)!;
    params[`line_items[${i}][quantity]`] = item.quantity;
    params[`line_items[${i}][price_data][currency]`] = "usd";
    params[`line_items[${i}][price_data][unit_amount]`] = item.unitCents;
    params[`line_items[${i}][price_data][product_data][name]`] = product.name;
    params[`line_items[${i}][price_data][product_data][description]`] = `${product.type} — ${product.prefecture} — ${product.bottleSizeMl}ml`;
  });
  if (opts.cart.shippingCents > 0) {
    const i = opts.cart.items.length;
    params[`line_items[${i}][quantity]`] = 1;
    params[`line_items[${i}][price_data][currency]`] = "usd";
    params[`line_items[${i}][price_data][unit_amount]`] = opts.cart.shippingCents;
    params[`line_items[${i}][price_data][product_data][name]`] = "Standard Shipping";
    params[`line_items[${i}][price_data][product_data][description]`] =
      `Free shipping on orders over $${(FREE_SHIPPING_THRESHOLD_CENTS / 100).toFixed(0)}`;
  }
  const back = `${opts.origin}${sakeDetailPath(opts.cart.items[0].productId)}`;
  params.success_url = `${back}?order=success&session_id={CHECKOUT_SESSION_ID}`;
  params.cancel_url = `${back}?order=cancelled`;

  const session = await stripeRequest<{ id: string; url: string | null; amount_total?: number | null }>("POST", "/checkout/sessions", params);
  if (!session.url) throw new StripeError("Stripe did not return a checkout link", 502);
  return { id: session.id, url: session.url };
}

export async function createSakeSubscriptionCheckout(opts: {
  customerId: string;
  userId: string;
  email: string | null;
  name: string | null;
  plan: SubscriptionPlan;
  origin: string;
}) {
  const session = await stripeRequest<{ id: string; url: string | null }>("POST", "/checkout/sessions", {
    customer: opts.customerId,
    mode: "subscription",
    "line_items[0][quantity]": 1,
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": opts.plan.priceCentsMonthly,
    "line_items[0][price_data][recurring][interval]": "month",
    "line_items[0][price_data][product_data][name]": `${opts.plan.name} — Monthly Sake Box`,
    "line_items[0][price_data][product_data][description]": opts.plan.description,
    client_reference_id: opts.userId,
    allow_promotion_codes: true,
    "shipping_address_collection[allowed_countries][0]": "US",
    "metadata[app]": "sake",
    "metadata[supabase_user_id]": opts.userId,
    "metadata[plan_id]": opts.plan.id,
    "metadata[plan_tier]": opts.plan.tier,
    "metadata[customer_email]": opts.email ?? "",
    "metadata[customer_name]": opts.name ?? "",
    "subscription_data[metadata][app]": "sake",
    "subscription_data[metadata][supabase_user_id]": opts.userId,
    "subscription_data[metadata][plan_tier]": opts.plan.tier,
    success_url: `${opts.origin}${sk("/subscription")}?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${opts.origin}${sk("/subscription")}?cancelled=true`,
  });
  if (!session.url) throw new StripeError("Stripe did not return a checkout link", 502);
  return { id: session.id, url: session.url };
}
