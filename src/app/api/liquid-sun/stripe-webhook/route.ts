import { NextResponse, type NextRequest } from "next/server";
import { createServiceRoleClient, isServiceRoleConfigured } from "@/lib/supabase/service-role";
import { retrieveSubscription, verifyStripeWebhook, type StripeSubscription } from "@/lib/stripe";

// LiquidSun Premium's Stripe webhook, ported from the LiquidSun Manus app's server/stripe/webhook.ts
// (2026-11-21). Stripe calls it for checkout and subscription changes; it records the member's
// subscription status in Supabase (liquidsun_subscriptions, 0009_liquidsun.sql), which is what
// the /liquid-sun pages read to know who is Premium. The signature is checked against the raw body
// with STRIPE_WEBHOOK_SECRET before anything is read. Set up in Stripe: Developers > Webhooks >
// endpoint https://tonygreenberg.com/api/liquid-sun/stripe-webhook, events checkout.session.completed,
// customer.subscription.created/updated/deleted, invoice.payment_failed.

type StripeEvent = { id: string; type: string; data: { object: Record<string, unknown> } };

const str = (v: unknown) => (typeof v === "string" && v ? v : null);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function periodEnd(sub: StripeSubscription) {
  // Older API versions put current_period_end on the subscription, newer ones on each item.
  const seconds = sub.current_period_end ?? sub.items?.data?.[0]?.current_period_end;
  return typeof seconds === "number" ? new Date(seconds * 1000).toISOString() : null;
}

function planOf(sub: StripeSubscription) {
  const fromMeta = sub.metadata?.plan;
  if (fromMeta === "monthly" || fromMeta === "annual") return fromMeta;
  const key = sub.items?.data?.[0]?.price?.lookup_key;
  if (key === "liquidsun_premium_monthly") return "monthly";
  if (key === "liquidsun_premium_annual") return "annual";
  return null;
}

async function saveSubscription(db: ReturnType<typeof createServiceRoleClient>, sub: StripeSubscription, userIdHint: string | null) {
  let userId = userIdHint && UUID.test(userIdHint) ? userIdHint : null;
  const metaUser = sub.metadata?.supabase_user_id;
  if (!userId && metaUser && UUID.test(metaUser)) userId = metaUser;
  if (!userId) {
    const { data } = await db.from("liquidsun_stripe_customers").select("user_id").eq("stripe_customer_id", sub.customer).maybeSingle();
    userId = (data?.user_id as string | undefined) ?? null;
  }
  if (!userId) {
    console.warn("[liquidsun webhook] no member for subscription", sub.id);
    return;
  }
  const { error } = await db.from("liquidsun_subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: sub.id,
      stripe_customer_id: sub.customer,
      status: sub.status,
      price_id: sub.items?.data?.[0]?.price?.id ?? null,
      plan: planOf(sub),
      current_period_end: periodEnd(sub),
      cancel_at_period_end: Boolean(sub.cancel_at_period_end),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );
  if (error) throw new Error(error.message);
}

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  const raw = await request.text();
  const event = verifyStripeWebhook<StripeEvent>(raw, request.headers.get("stripe-signature"), secret);
  if (!event || typeof event.type !== "string") {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  if (!isServiceRoleConfigured()) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
  const db = createServiceRoleClient();
  const obj = event.data?.object ?? {};

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const subscriptionId = str(obj.subscription);
        const customerId = str(obj.customer);
        const userId = str(obj.client_reference_id) ?? str((obj.metadata as Record<string, unknown> | undefined)?.supabase_user_id);
        if (customerId && userId && UUID.test(userId)) {
          await db
            .from("liquidsun_stripe_customers")
            .upsert({ user_id: userId, stripe_customer_id: customerId }, { onConflict: "user_id" });
        }
        if (subscriptionId) await saveSubscription(db, await retrieveSubscription(subscriptionId), userId);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = obj as unknown as StripeSubscription;
        if (str(sub.id) && str(sub.customer)) {
          await saveSubscription(db, event.type === "customer.subscription.deleted" ? { ...sub, status: "canceled" } : sub, null);
        }
        break;
      }
      case "invoice.payment_failed": {
        const parent = obj.parent as { subscription_details?: { subscription?: unknown } } | undefined;
        const subId = str(obj.subscription) ?? str(parent?.subscription_details?.subscription);
        if (subId) {
          await db
            .from("liquidsun_subscriptions")
            .update({ status: "past_due", updated_at: new Date().toISOString() })
            .eq("stripe_subscription_id", subId);
        }
        break;
      }
      default:
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[liquidsun webhook] failed:", event.type, err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
