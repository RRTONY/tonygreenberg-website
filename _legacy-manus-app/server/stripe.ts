/**
 * Stripe integration — checkout sessions, webhook handler, purchase queries.
 */
import Stripe from "stripe";
import { ENV } from "./_core/env";
import { PRODUCTS } from "./products";
import { getDb } from "./db";
import { users, purchases, subscriptions } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    if (!ENV.stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    _stripe = new Stripe(ENV.stripeSecretKey, { apiVersion: "2025-03-31.basil" as any });
  }
  return _stripe;
}

// ── Checkout Session ──

export async function createCheckoutSession(opts: {
  productKey: string;
  userId: number;
  userEmail?: string | null;
  userName?: string | null;
  origin: string;
  successPath?: string;
  cancelPath?: string;
}): Promise<{ url: string }> {
  const stripe = getStripe();
  const product = PRODUCTS[opts.productKey];
  if (!product) throw new Error(`Unknown product: ${opts.productKey}`);

  const stripeCustomerId = await getOrCreateCustomer(opts.userId, opts.userEmail, opts.userName);

  const successUrl = `${opts.origin}${opts.successPath || "/payment-success"}?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${opts.origin}${opts.cancelPath || "/payment-cancel"}`;

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    customer: stripeCustomerId,
    client_reference_id: opts.userId.toString(),
    allow_promotion_codes: true,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      user_id: opts.userId.toString(),
      product_key: opts.productKey,
      customer_email: opts.userEmail || "",
      customer_name: opts.userName || "",
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceCents,
          ...(product.mode === "subscription" && product.interval
            ? { recurring: { interval: product.interval } }
            : {}),
        },
        quantity: 1,
      },
    ],
    mode: product.mode,
  };

  const session = await stripe.checkout.sessions.create(sessionParams);
  return { url: session.url! };
}

// ── Customer Management ──

async function getOrCreateCustomer(
  userId: number,
  email?: string | null,
  name?: string | null,
): Promise<string> {
  const stripe = getStripe();
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (user?.stripeCustomerId) return user.stripeCustomerId;

  const customer = await stripe.customers.create({
    email: email || undefined,
    name: name || undefined,
    metadata: { user_id: userId.toString() },
  });

  await db.update(users).set({ stripeCustomerId: customer.id }).where(eq(users.id, userId));
  return customer.id;
}

// ── Purchase Queries ──

export async function getUserPurchases(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(purchases).where(eq(purchases.userId, userId));
}

export async function hasUserPurchased(userId: number, productKey: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const rows = await db
    .select()
    .from(purchases)
    .where(and(eq(purchases.userId, userId), eq(purchases.productKey, productKey), eq(purchases.status, "completed")))
    .limit(1);
  return rows.length > 0;
}

export async function hasActiveSubscription(userId: number, productKey: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const rows = await db
    .select()
    .from(subscriptions)
    .where(and(eq(subscriptions.userId, userId), eq(subscriptions.productKey, productKey), eq(subscriptions.status, "active")))
    .limit(1);
  return rows.length > 0;
}

/** Check if user has blog access (purchased blog-access OR has active membership) */
export async function hasBlogAccess(userId: number): Promise<boolean> {
  const [purchased, subscribed] = await Promise.all([
    hasUserPurchased(userId, "blog-access"),
    hasActiveSubscription(userId, "membership-yearly"),
  ]);
  return purchased || subscribed;
}

// ── Webhook Processing ──

export async function handleWebhookEvent(event: Stripe.Event) {
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return { verified: true };
  }

  const db = await getDb();
  if (!db) throw new Error("Database not available for webhook processing");

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = parseInt(session.metadata?.user_id || session.client_reference_id || "0");
      const productKey = session.metadata?.product_key || "";

      if (!userId || !productKey) {
        console.error("[Webhook] Missing user_id or product_key in session metadata");
        break;
      }

      const product = PRODUCTS[productKey];
      if (!product) {
        console.error(`[Webhook] Unknown product key: ${productKey}`);
        break;
      }

      if (product.mode === "payment") {
        await db.insert(purchases).values({
          userId,
          stripeSessionId: session.id,
          stripePaymentIntentId: (session.payment_intent as string) || null,
          productKey,
          amountCents: product.priceCents,
          currency: "usd",
          status: "completed",
        });
        console.log(`[Webhook] Purchase recorded: user=${userId} product=${productKey}`);
      } else if (product.mode === "subscription") {
        const subscriptionId = session.subscription as string;
        if (subscriptionId) {
          await db.insert(subscriptions).values({
            userId,
            stripeSubscriptionId: subscriptionId,
            productKey,
            status: "active",
          });
          console.log(`[Webhook] Subscription recorded: user=${userId} product=${productKey}`);
        }
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const status = sub.status;
      const mappedStatus = status === "active" ? "active"
        : status === "canceled" ? "canceled"
        : status === "past_due" ? "past_due"
        : "unpaid";

      await db
        .update(subscriptions)
        .set({
          status: mappedStatus,
          currentPeriodEnd: new Date((sub as any).current_period_end * 1000),
        })
        .where(eq(subscriptions.stripeSubscriptionId, sub.id));
      console.log(`[Webhook] Subscription updated: ${sub.id} → ${mappedStatus}`);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await db
        .update(subscriptions)
        .set({ status: "canceled" })
        .where(eq(subscriptions.stripeSubscriptionId, sub.id));
      console.log(`[Webhook] Subscription canceled: ${sub.id}`);
      break;
    }

    default:
      console.log(`[Webhook] Unhandled event type: ${event.type}`);
  }

  return { received: true };
}

export function verifyWebhookSignature(payload: Buffer, signature: string): Stripe.Event {
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(payload, signature, ENV.stripeWebhookSecret);
}
