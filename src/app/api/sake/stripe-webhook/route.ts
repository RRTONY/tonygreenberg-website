import { NextResponse, type NextRequest } from "next/server";
import { createServiceRoleClient, isServiceRoleConfigured } from "@/lib/supabase/service-role";
import { retrieveSubscription, verifyStripeWebhook, type StripeSubscription } from "@/lib/stripe";
import { esc, sendEmail } from "@/lib/email";

// Sake for Sake's Sake's Stripe webhook, ported from the Sake Manus app's server/stripe/checkout.ts
// webhook (2026-11-26). Stripe calls it when a checkout finishes or expires and when a monthly box
// subscription changes. It marks the order paid with the shipping details Stripe collected
// (sake_orders: the row was made with server prices when checkout started; the app built the order
// from item ids it had put in the session metadata), records the subscription's status
// (sake_subscriptions; the app never recorded subscriptions at all), and emails Tony so the order can
// be fulfilled (the app only logged it). The signature is checked against the raw body with
// SAKE_STRIPE_WEBHOOK_SECRET (its own Stripe endpoint, so its own signing secret) before anything is
// read. The app's shortcut that answered any `evt_test_` event without a signature isn't carried over.
// Set up in Stripe: Developers > Webhooks > endpoint https://tonygreenberg.com/api/sake/stripe-webhook,
// events checkout.session.completed, checkout.session.expired, customer.subscription.created/updated/deleted.

type StripeEvent = { id: string; type: string; data: { object: Record<string, unknown> } };
type Db = ReturnType<typeof createServiceRoleClient>;

const OWNER_EMAIL = "tony@tonygreenberg.com";
const TIERS = ["explorer", "connoisseur", "omakase"];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const str = (v: unknown) => (typeof v === "string" && v ? v : null);

function periodEnd(sub: StripeSubscription) {
  const seconds = sub.current_period_end ?? sub.items?.data?.[0]?.current_period_end;
  return typeof seconds === "number" ? new Date(seconds * 1000).toISOString() : null;
}

async function saveSubscription(db: Db, sub: StripeSubscription, userIdHint: string | null) {
  let userId = userIdHint && UUID.test(userIdHint) ? userIdHint : null;
  const metaUser = sub.metadata?.supabase_user_id;
  if (!userId && metaUser && UUID.test(metaUser)) userId = metaUser;
  if (!userId) {
    const { data } = await db.from("sake_stripe_customers").select("user_id").eq("stripe_customer_id", sub.customer).maybeSingle();
    userId = (data?.user_id as string | undefined) ?? null;
  }
  if (!userId) {
    console.warn("[sake webhook] no member for subscription", sub.id);
    return;
  }
  const tier = sub.metadata?.plan_tier;
  const fields = {
    user_id: userId,
    stripe_customer_id: sub.customer,
    status: sub.status,
    current_period_end: periodEnd(sub),
    cancel_at_period_end: Boolean(sub.cancel_at_period_end),
    updated_at: new Date().toISOString(),
    ...(tier && TIERS.includes(tier) ? { plan_tier: tier } : {}),
  };
  const { data: existing } = await db.from("sake_subscriptions").select("id").eq("stripe_subscription_id", sub.id).maybeSingle();
  if (existing) {
    const { error } = await db.from("sake_subscriptions").update(fields).eq("id", (existing as { id: number }).id);
    if (error) throw new Error(error.message);
    return;
  }
  if (!fields.plan_tier) {
    console.warn("[sake webhook] no plan tier for subscription", sub.id);
    return;
  }
  const { error } = await db.from("sake_subscriptions").insert({ ...fields, stripe_subscription_id: sub.id });
  if (error && error.code !== "23505") throw new Error(error.message);
}

async function completeCheckout(db: Db, obj: Record<string, unknown>) {
  const sessionId = str(obj.id);
  if (!sessionId) return;
  const meta = (obj.metadata as Record<string, unknown> | undefined) ?? {};
  if (meta.app !== "sake") return; // another product's checkout on the same Stripe account
  const email = str(meta.customer_email) ?? str((obj.customer_details as Record<string, unknown> | undefined)?.email);
  const userId = str(meta.supabase_user_id);

  const customerId = str(obj.customer);
  if (customerId && userId && UUID.test(userId)) {
    const { error } = await db.from("sake_stripe_customers").upsert({ user_id: userId, stripe_customer_id: customerId }, { onConflict: "user_id" });
    if (error) throw new Error(error.message);
  }

  if (obj.mode === "subscription") {
    const subscriptionId = str(obj.subscription);
    if (subscriptionId) await saveSubscription(db, await retrieveSubscription(subscriptionId), userId);
    await sendEmail(
      OWNER_EMAIL,
      "Sake for Sake's Sake: new box subscriber",
      `<p>${esc(String(meta.plan_tier ?? "A"))} box subscription started by ${esc(email ?? "a member")}.</p>`,
    );
    return;
  }

  const { data: order } = await db.from("sake_orders").select("id, status, items, total_cents").eq("stripe_session_id", sessionId).maybeSingle();
  if (!order) {
    console.warn("[sake webhook] no order for session", sessionId);
    return;
  }
  const o = order as { id: number; status: string; items: { name: string; quantity: number }[]; total_cents: number };
  if (o.status !== "pending" && o.status !== "expired") return; // Stripe can send the same event twice

  const shipping =
    (obj.collected_information as { shipping_details?: { name?: string; address?: unknown } } | undefined)?.shipping_details ??
    (obj.shipping_details as { name?: string; address?: unknown } | undefined) ??
    null;
  const { error } = await db
    .from("sake_orders")
    .update({
      status: "paid",
      stripe_payment_intent_id: str(obj.payment_intent),
      total_cents: typeof obj.amount_total === "number" ? obj.amount_total : o.total_cents,
      currency: str(obj.currency) ?? "usd",
      shipping_name: shipping?.name ?? null,
      shipping_address: shipping?.address ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", o.id);
  if (error) throw new Error(error.message);

  const lines = (Array.isArray(o.items) ? o.items : []).map((i) => `<li>${esc(String(i.quantity))} × ${esc(String(i.name))}</li>`).join("");
  await sendEmail(
    OWNER_EMAIL,
    "Sake for Sake's Sake: new order to ship",
    `<p>Order #${o.id} paid by ${esc(email ?? "a member")} ($${((typeof obj.amount_total === "number" ? obj.amount_total : o.total_cents) / 100).toFixed(2)}).</p><ul>${lines}</ul>`,
  );
}

export async function POST(request: NextRequest) {
  const secret = process.env.SAKE_STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  const raw = await request.text();
  const event = verifyStripeWebhook<StripeEvent>(raw, request.headers.get("stripe-signature"), secret);
  if (!event || typeof event.type !== "string") return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  if (!isServiceRoleConfigured()) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
  const db = createServiceRoleClient();
  const obj = event.data?.object ?? {};

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await completeCheckout(db, obj);
        break;
      case "checkout.session.expired": {
        const sessionId = str(obj.id);
        if (!sessionId) break;
        const { error } = await db
          .from("sake_orders")
          .update({ status: "expired", updated_at: new Date().toISOString() })
          .eq("stripe_session_id", sessionId)
          .eq("status", "pending");
        if (error) throw new Error(error.message);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = obj as unknown as StripeSubscription;
        if (sub.metadata?.app !== "sake") break;
        await saveSubscription(db, sub, null);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[sake webhook]", event.type, err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}
