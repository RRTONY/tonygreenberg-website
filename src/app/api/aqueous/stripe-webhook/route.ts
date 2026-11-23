import { NextResponse, type NextRequest } from "next/server";
import { createServiceRoleClient, isServiceRoleConfigured } from "@/lib/supabase/service-role";
import { retrieveSubscription, verifyStripeWebhook, type StripeSubscription } from "@/lib/stripe";
import { esc, sendEmail } from "@/lib/email";
import { AQUEOUS_PRODUCTS } from "@/lib/content/aqueous/products";

// Aqueous's Stripe webhook, ported from the Aqueous Manus app's server/stripe.ts handleWebhookEvent
// (2026-11-24). Stripe calls it when a checkout finishes and when the $5/month plan changes; it marks
// the purchase completed (aqueous_purchases), takes any referral credit used off the member's balance
// (the app never did), records the plan's status (aqueous_subscriptions), and emails Tony (the app
// only logged it). The signature is checked against the raw body with AQUEOUS_STRIPE_WEBHOOK_SECRET
// (its own Stripe endpoint, so its own signing secret) before anything is read.
// Set up in Stripe: Developers > Webhooks > endpoint https://tonygreenberg.com/api/aqueous/stripe-webhook,
// events checkout.session.completed, checkout.session.expired, customer.subscription.created/updated/deleted.

type StripeEvent = { id: string; type: string; data: { object: Record<string, unknown> } };

const OWNER_EMAIL = "tony@tonygreenberg.com";
const str = (v: unknown) => (typeof v === "string" && v ? v : null);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
type Db = ReturnType<typeof createServiceRoleClient>;

function periodEnd(sub: StripeSubscription) {
  const seconds = sub.current_period_end ?? sub.items?.data?.[0]?.current_period_end;
  return typeof seconds === "number" ? new Date(seconds * 1000).toISOString() : null;
}

async function saveSubscription(db: Db, sub: StripeSubscription, userIdHint: string | null) {
  let userId = userIdHint && UUID.test(userIdHint) ? userIdHint : null;
  const metaUser = sub.metadata?.supabase_user_id;
  if (!userId && metaUser && UUID.test(metaUser)) userId = metaUser;
  if (!userId) {
    const { data } = await db.from("aqueous_stripe_customers").select("user_id").eq("stripe_customer_id", sub.customer).maybeSingle();
    userId = (data?.user_id as string | undefined) ?? null;
  }
  if (!userId) {
    console.warn("[aqueous webhook] no member for subscription", sub.id);
    return;
  }
  const { error } = await db.from("aqueous_subscriptions").upsert(
    {
      stripe_subscription_id: sub.id,
      user_id: userId,
      stripe_customer_id: sub.customer,
      status: sub.status,
      current_period_end: periodEnd(sub),
      cancel_at_period_end: Boolean(sub.cancel_at_period_end),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );
  if (error) throw new Error(error.message);
}

async function completeCheckout(db: Db, obj: Record<string, unknown>) {
  const sessionId = str(obj.id);
  if (!sessionId) return;
  const meta = (obj.metadata as Record<string, unknown> | undefined) ?? {};
  if (meta.app !== "aqueous") return; // another product's checkout on the same Stripe account

  const { data: purchase } = await db
    .from("aqueous_purchases")
    .select("id, user_id, product_type, status, credit_applied")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();
  if (!purchase) {
    console.warn("[aqueous webhook] no purchase for session", sessionId);
    return;
  }
  const p = purchase as { id: number; user_id: string; product_type: string; status: string; credit_applied: string | number };
  if (p.status === "completed") return; // Stripe can send the same event twice

  const { error } = await db
    .from("aqueous_purchases")
    .update({ status: "completed", stripe_payment_intent_id: str(obj.payment_intent) })
    .eq("id", p.id);
  if (error) throw new Error(error.message);

  const email = str(meta.customer_email) ?? str((obj.customer_details as Record<string, unknown> | undefined)?.email);
  const credit = Number(p.credit_applied);
  if (credit > 0 && email) {
    await db.from("aqueous_referral_credits").insert({ email, amount: -credit, reason: "checkout", purchase_id: p.id });
  }

  const customerId = str(obj.customer);
  if (customerId && UUID.test(p.user_id)) {
    await db.from("aqueous_stripe_customers").upsert({ user_id: p.user_id, stripe_customer_id: customerId }, { onConflict: "user_id" });
  }
  const subscriptionId = str(obj.subscription);
  if (subscriptionId) await saveSubscription(db, await retrieveSubscription(subscriptionId), p.user_id);

  const isPlan = p.product_type === "subscription";
  await sendEmail(
    OWNER_EMAIL,
    `Aqueous: new ${isPlan ? "subscriber" : "report purchase"}`,
    `<p>${esc(isPlan ? AQUEOUS_PRODUCTS.subscription.name : AQUEOUS_PRODUCTS.report.name)} purchased by ${esc(email ?? "a member")}.</p>`,
  );
}

export async function POST(request: NextRequest) {
  const secret = process.env.AQUEOUS_STRIPE_WEBHOOK_SECRET;
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
      case "checkout.session.completed":
        await completeCheckout(db, obj);
        break;
      case "checkout.session.expired": {
        const sessionId = str(obj.id);
        if (sessionId) await db.from("aqueous_purchases").update({ status: "expired" }).eq("stripe_session_id", sessionId).eq("status", "pending");
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = obj as unknown as StripeSubscription;
        if (sub.metadata?.app !== "aqueous") break;
        await saveSubscription(db, sub, null);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[aqueous webhook]", event.type, err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}
