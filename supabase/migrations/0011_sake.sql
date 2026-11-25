-- Sake for Sake's Sake (/sake) reviews, deal alerts, saved sakes, orders and subscriptions (2026-11-26).
-- Run once after 0001-0010, in the Supabase dashboard (SQL Editor > New query > paste this file > Run)
-- or through the Management API, as 0007-0010 were.
-- Ported from the Sake Manus app's drizzle/schema.ts (priceSnapshots, dealAlerts, dealNotifications,
-- sakeFavorites, orders, sakeReviews, sakeSubscriptions, users.stripeCustomerId) to Postgres. The Manus
-- database is NOT copied (same rule as SoulSmoke/LiquidSun/Aqueous); every table starts empty.
-- Not carried over: `users` (Supabase Auth replaces Manus OAuth).
-- Added: sake_review_upvotes (one upvote per member per review; the app let anyone upvote any review
-- any number of times) and sake_stripe_customers (users.stripeCustomerId in the app).
--
-- Access model: same as 0001/0002/0006-0010. Row-level security is ON and there are no public
-- policies: the site's server reads and writes these tables with the service-role key
-- (src/app/sake/actions.ts and the Stripe webhook), always scoped to the signed-in member, so no
-- member id or email reaches another visitor's browser. Tony reads them in the Table Editor.

-- Retail price observations (priceSnapshots). Written only by the site owner (recordPriceSnapshot);
-- the app let any signed-in visitor write prices, which then triggered other members' deal alerts.
create table if not exists public.sake_price_snapshots (
  id bigint generated always as identity primary key,
  sake_id text not null check (char_length(sake_id) between 1 and 128),
  sake_name text not null check (char_length(sake_name) between 1 and 256),
  retailer_id text not null check (char_length(retailer_id) between 1 and 128),
  retailer_name text not null check (char_length(retailer_name) between 1 and 256),
  price numeric(8, 2) not null check (price >= 0),
  previous_price numeric(8, 2) check (previous_price >= 0),
  in_stock boolean not null default true,
  bottle_size_ml integer not null default 720 check (bottle_size_ml between 1 and 10000),
  source_url text check (char_length(source_url) <= 1000),
  observed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists sake_price_snapshots_sake_idx on public.sake_price_snapshots (sake_id, retailer_id, observed_at desc);
alter table public.sake_price_snapshots enable row level security;

-- A member's price-drop alert (dealAlerts): one sake, one sake type, or every deal.
create table if not exists public.sake_deal_alerts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  alert_type text not null default 'all' check (alert_type in ('specific', 'category', 'all')),
  sake_id text check (char_length(sake_id) <= 128),
  sake_name text check (char_length(sake_name) <= 256),
  sake_category text check (char_length(sake_category) <= 128),
  price_threshold numeric(8, 2) check (price_threshold >= 0),
  min_discount_pct integer not null default 10 check (min_discount_pct between 1 and 90),
  notify_in_app boolean not null default true,
  notify_email boolean not null default false,
  is_active boolean not null default true,
  zip_code text check (zip_code ~ '^[0-9]{5}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (alert_type <> 'specific' or sake_id is not null),
  check (alert_type <> 'category' or sake_category is not null)
);
create index if not exists sake_deal_alerts_user_idx on public.sake_deal_alerts (user_id, created_at desc);
alter table public.sake_deal_alerts enable row level security;

-- A price drop that matched a member's alert (dealNotifications).
create table if not exists public.sake_deal_notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  alert_id bigint references public.sake_deal_alerts (id) on delete set null,
  snapshot_id bigint references public.sake_price_snapshots (id) on delete set null,
  sake_id text not null check (char_length(sake_id) between 1 and 128),
  sake_name text not null check (char_length(sake_name) between 1 and 256),
  retailer_name text not null check (char_length(retailer_name) between 1 and 256),
  new_price numeric(8, 2) not null,
  old_price numeric(8, 2) not null,
  discount_pct integer not null check (discount_pct between 0 and 100),
  is_read boolean not null default false,
  is_dismissed boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists sake_deal_notifications_user_idx on public.sake_deal_notifications (user_id, created_at desc);
alter table public.sake_deal_notifications enable row level security;

-- Sakes a member tracks for price (sakeFavorites). One row per member per sake. (The heart on pages
-- that saves to the visitor's own browser is separate and never reaches the server.)
create table if not exists public.sake_favorites (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  sake_id text not null check (char_length(sake_id) between 1 and 128),
  sake_name text not null check (char_length(sake_name) between 1 and 256),
  target_price numeric(8, 2) check (target_price >= 0),
  created_at timestamptz not null default now(),
  unique (user_id, sake_id)
);
alter table public.sake_favorites enable row level security;

-- Tasting notes and ratings (sakeReviews). user_name is the name shown with the review.
create table if not exists public.sake_reviews (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  user_name text check (char_length(user_name) <= 256),
  sake_id text not null check (char_length(sake_id) between 1 and 128),
  sake_name text not null check (char_length(sake_name) between 1 and 256),
  rating integer not null check (rating between 1 and 5),
  tasting_note text check (char_length(tasting_note) <= 2000),
  flavor_tags jsonb not null default '[]'::jsonb,
  serving_temp text check (char_length(serving_temp) <= 64),
  purchase_location text check (char_length(purchase_location) <= 256),
  price_paid_cents integer check (price_paid_cents between 0 and 100000),
  would_buy_again boolean not null default true,
  upvotes integer not null default 0 check (upvotes >= 0),
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists sake_reviews_sake_idx on public.sake_reviews (sake_id, created_at desc) where is_visible;
create index if not exists sake_reviews_user_idx on public.sake_reviews (user_id, created_at desc);
alter table public.sake_reviews enable row level security;

-- Who upvoted which review; sake_reviews.upvotes is the count of these rows.
create table if not exists public.sake_review_upvotes (
  review_id bigint not null references public.sake_reviews (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (review_id, user_id)
);
alter table public.sake_review_upvotes enable row level security;

-- The member's Stripe customer (users.stripeCustomerId in the app).
create table if not exists public.sake_stripe_customers (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id text not null unique,
  created_at timestamptz not null default now()
);
alter table public.sake_stripe_customers enable row level security;

-- Bottle orders (orders). A row is made when checkout starts (pending) and marked paid by the webhook,
-- so the amount and items come from the server, never from the browser.
create table if not exists public.sake_orders (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  stripe_session_id text not null unique,
  stripe_payment_intent_id text,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled', 'expired')),
  total_cents integer not null check (total_cents >= 0),
  currency text not null default 'usd' check (char_length(currency) = 3),
  items jsonb not null,
  shipping_name text check (char_length(shipping_name) <= 256),
  shipping_address jsonb,
  tracking_number text check (char_length(tracking_number) <= 128),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists sake_orders_user_idx on public.sake_orders (user_id, created_at desc);
alter table public.sake_orders enable row level security;

-- Monthly sake box subscriptions (sakeSubscriptions), kept current by the webhook. status is Stripe's
-- subscription status (active, trialing, past_due, canceled, unpaid, incomplete, paused...).
create table if not exists public.sake_subscriptions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  plan_tier text not null check (plan_tier in ('explorer', 'connoisseur', 'omakase')),
  status text not null default 'incomplete' check (char_length(status) <= 32),
  taste_profile jsonb,
  preferred_types jsonb,
  flavor_preferences jsonb,
  shipping_name text check (char_length(shipping_name) <= 256),
  shipping_address jsonb,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists sake_subscriptions_user_idx on public.sake_subscriptions (user_id, updated_at desc);
alter table public.sake_subscriptions enable row level security;
