import "server-only";
import { StripeError, stripeRequest } from "@/lib/stripe";
import { AQUEOUS_PRODUCTS, type AqueousProductType } from "@/lib/content/aqueous/products";

// Aqueous checkout over Stripe's REST API (the shared src/lib/stripe.ts request helper, no SDK),
// ported from the Aqueous Manus app's server/stripe.ts. Same as the app: inline price data (no
// saved Stripe products), the $20 report as a one-time payment, the $5/month plan as a subscription,
// and referral credit applied to the report as a one-time coupon (capped so at least $0.50 is charged,
// Stripe's minimum). Success returns to /aqueous/payment/success, cancel to /aqueous/pricing.

export async function createAqueousCustomer(opts: { email: string | null; userId: string }) {
  return stripeRequest<{ id: string }>("POST", "/customers", {
    email: opts.email ?? undefined,
    "metadata[supabase_user_id]": opts.userId,
    "metadata[app]": "aqueous",
  });
}

export async function createAqueousCheckout(opts: {
  customerId: string;
  userId: string;
  email: string | null;
  productType: AqueousProductType;
  origin: string;
  creditCents: number;
}) {
  const product = AQUEOUS_PRODUCTS[opts.productType];
  const isSubscription = product.mode === "subscription";

  let couponId: string | null = null;
  if (opts.creditCents > 0 && !isSubscription) {
    const coupon = await stripeRequest<{ id: string }>("POST", "/coupons", {
      amount_off: opts.creditCents,
      currency: "usd",
      duration: "once",
      name: `Referral Credit ($${(opts.creditCents / 100).toFixed(2)})`,
      max_redemptions: 1,
    });
    couponId = coupon.id;
  }

  const session = await stripeRequest<{ id: string; url: string | null }>("POST", "/checkout/sessions", {
    customer: opts.customerId,
    mode: product.mode,
    "line_items[0][quantity]": 1,
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": product.priceInCents,
    "line_items[0][price_data][product_data][name]": product.name,
    "line_items[0][price_data][product_data][description]": product.description,
    ...(isSubscription ? { "line_items[0][price_data][recurring][interval]": AQUEOUS_PRODUCTS.subscription.interval } : {}),
    success_url: `${opts.origin}/aqueous/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${opts.origin}/aqueous/pricing`,
    client_reference_id: opts.userId,
    // Stripe won't take promotion codes together with a discount (the app deleted the flag then too).
    ...(couponId ? { "discounts[0][coupon]": couponId } : { allow_promotion_codes: true }),
    "metadata[app]": "aqueous",
    "metadata[supabase_user_id]": opts.userId,
    "metadata[customer_email]": opts.email ?? "",
    "metadata[product_type]": opts.productType,
    "metadata[credit_applied]": opts.creditCents,
    ...(isSubscription
      ? { "subscription_data[metadata][app]": "aqueous", "subscription_data[metadata][supabase_user_id]": opts.userId }
      : {}),
  });
  if (!session.url) throw new StripeError("Stripe did not return a checkout link", 502);
  return { id: session.id, url: session.url };
}
