-- LiquidSun (/liquid-sun) member features and Premium (2026-11-21). Run once after 0001-0008,
-- in the Supabase dashboard (SQL Editor > New query > paste this file > Run) or through the
-- Management API, as 0007/0008 were.
-- Ported from the LiquidSun Manus app's drizzle/schema.ts (partner_inquiries, subscriptions,
-- users.stripeCustomerId) to Postgres, plus the Tasting Journal ("The Log"), which the app only
-- kept in memory. The Manus database is NOT copied (owner, 2026-11-21); these start empty.
-- Not carried over: `ratings` (no page of the app ever showed BottleReviews/StarRating) and
-- `email_subscribers` (the email box posts to /api/subscribe, Kit, like the rest of the site).
--
-- Access model: same as 0001/0002/0006/0007. Row-level security is ON and there are no public
-- policies: the site's server reads and writes these tables with the service-role key
-- (src/app/liquid-sun/actions.ts and the Stripe webhook), always scoped to the signed-in member,
-- so no member id or email reaches another visitor's browser. Tony reads them in the Table Editor.

-- "The Log" (/liquid-sun/tasting-journal): one row per logged pour.
create table if not exists public.liquidsun_tasting_entries (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  producer_id text not null check (char_length(producer_id) between 1 and 128),
  rating smallint not null default 0 check (rating between 0 and 5),
  notes text check (char_length(notes) <= 5000),
  created_at timestamptz not null default now()
);
create index if not exists liquidsun_tasting_entries_user_idx on public.liquidsun_tasting_entries (user_id, created_at desc);
alter table public.liquidsun_tasting_entries enable row level security;

-- "Become a Partner" (/liquid-sun/partner): brand inquiries; Tony is emailed on each one.
create table if not exists public.liquidsun_partner_inquiries (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  brand_name text not null check (char_length(brand_name) between 1 and 256),
  contact_name text not null check (char_length(contact_name) between 1 and 256),
  contact_email text not null check (char_length(contact_email) between 3 and 320),
  nom text check (char_length(nom) <= 32),
  website text check (char_length(website) <= 512),
  tier_interest text not null default 'featured' check (tier_interest in ('featured', 'spotlight', 'altar')),
  message text check (char_length(message) <= 5000),
  status text not null default 'new' check (status in ('new', 'contacted', 'active', 'declined')),
  created_at timestamptz not null default now()
);
create index if not exists liquidsun_partner_inquiries_user_idx on public.liquidsun_partner_inquiries (user_id, created_at desc);
alter table public.liquidsun_partner_inquiries enable row level security;

-- Premium: the member's Stripe customer (users.stripeCustomerId in the app).
create table if not exists public.liquidsun_stripe_customers (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id text not null unique,
  created_at timestamptz not null default now()
);
alter table public.liquidsun_stripe_customers enable row level security;

-- Premium: subscription status, written only by the Stripe webhook (/api/liquid-sun/stripe-webhook).
-- A member is Premium while a row of theirs is 'active' or 'trialing' and not past current_period_end.
create table if not exists public.liquidsun_subscriptions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  stripe_subscription_id text not null unique,
  stripe_customer_id text not null,
  status text not null,
  price_id text,
  plan text check (plan in ('monthly', 'annual')),
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists liquidsun_subscriptions_user_idx on public.liquidsun_subscriptions (user_id, updated_at desc);
alter table public.liquidsun_subscriptions enable row level security;
