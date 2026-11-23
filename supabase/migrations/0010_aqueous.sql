-- Aqueous (/aqueous) referrals, projects, purchases, subscriptions and AWI reports (2026-11-24).
-- Run once after 0001-0009, in the Supabase dashboard (SQL Editor > New query > paste this file > Run)
-- or through the Management API, as 0007-0009 were.
-- Ported from the Aqueous Manus app's drizzle/schema.ts (referral_codes, referral_signups,
-- referral_credits, projects, purchases, reports, users.stripeCustomerId/subscriptionId/Status) to
-- Postgres. The Manus database is NOT copied (same rule as SoulSmoke/LiquidSun); these start empty,
-- except the Directory's "My Projects" rows, seeded below from the app's own seed query.
-- Not carried over: `email_subscribers` (the home page email box posts to /api/subscribe, Kit, like the
-- rest of the site) and `users` (Supabase Auth replaces Manus OAuth).
--
-- Access model: same as 0001/0002/0006-0009. Row-level security is ON and there are no public
-- policies: the site's server reads and writes these tables with the service-role key
-- (src/app/aqueous/actions.ts, the report route and the Stripe webhook), always scoped to the
-- signed-in member, so no member id or email reaches another visitor's browser. Tony reads them in
-- the Table Editor.

-- One referral code per member ("AQ-XXXXXX"). Credits are keyed by email, as in the app.
create table if not exists public.aqueous_referral_codes (
  id bigint generated always as identity primary key,
  code text not null unique check (code ~ '^AQ-[A-Z0-9]{6}$'),
  user_id uuid unique references auth.users (id) on delete cascade,
  email text check (char_length(email) <= 320),
  share_count integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.aqueous_referral_codes enable row level security;

-- Someone who arrived through a ?ref= link and claimed the $5 discount with their email.
-- One claim per email in total (the app allowed one per email per code, so the same email could
-- earn a referrer credit from every code).
create table if not exists public.aqueous_referral_signups (
  id bigint generated always as identity primary key,
  referrer_code text not null references public.aqueous_referral_codes (code) on delete cascade,
  referred_email text not null unique check (char_length(referred_email) between 3 and 320),
  referred_name text check (char_length(referred_name) <= 255),
  discount_applied boolean not null default false,
  referrer_credited boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists aqueous_referral_signups_code_idx on public.aqueous_referral_signups (referrer_code, created_at desc);
alter table public.aqueous_referral_signups enable row level security;

-- Ledger of $5 credits (referral_reward for the referrer, referral_discount for the new person) and
-- the credit spent at checkout (a negative row, reason 'checkout', so the balance can't be reused;
-- the app never deducted it).
create table if not exists public.aqueous_referral_credits (
  id bigint generated always as identity primary key,
  email text not null check (char_length(email) between 3 and 320),
  amount numeric(10, 2) not null,
  reason text not null check (reason in ('referral_reward', 'referral_discount', 'checkout')),
  referral_signup_id bigint references public.aqueous_referral_signups (id) on delete set null,
  purchase_id bigint,
  created_at timestamptz not null default now()
);
create index if not exists aqueous_referral_credits_email_idx on public.aqueous_referral_credits (lower(email));
alter table public.aqueous_referral_credits enable row level security;

-- The Directory's "My Projects" (owner adds/removes; everyone reads).
create table if not exists public.aqueous_projects (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 255),
  description text check (char_length(description) <= 2000),
  url text not null check (char_length(url) between 1 and 500),
  tag text check (char_length(tag) <= 50),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.aqueous_projects enable row level security;

-- The app's seed rows (.manus/db query of 2026-02-16), with Aqueous's own link pointing at /aqueous.
-- "The Way Out" (added 2026-02-18) is left out: its only address is a Manus site (thewayout-fciushx2),
-- and this site has no Manus links. Add it back here (Table Editor) once it has a new home.
insert into public.aqueous_projects (name, description, url, tag, sort_order)
select * from (values
  ('Aqueous', 'The world''s first personalized water rating. Know what flows through your life.', '/aqueous', 'Water Intelligence', 1),
  ('RampRate', 'Global infrastructure advisory. 20+ years of wisdom, discernment, and relationships powering the world''s most powerful companies.', 'https://ramprate.com', 'Infrastructure Advisory', 2),
  ('Impact Soul', 'Where sacred geometry meets conscious technology. The intersection of human potential and digital transformation.', 'https://impactsoul.is', 'Conscious Tech', 3),
  ('Joy and Woe', 'The creative studio behind the vision. Strategy, design, and the art of building things that matter.', 'https://joyandwoe.com', 'Creative Studio', 4)
) as seed (name, description, url, tag, sort_order)
where not exists (select 1 from public.aqueous_projects);

-- The member's Stripe customer (users.stripeCustomerId in the app).
create table if not exists public.aqueous_stripe_customers (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id text not null unique,
  created_at timestamptz not null default now()
);
alter table public.aqueous_stripe_customers enable row level security;

-- Checkouts: the $20 report (mode payment) and the $5/month plan (mode subscription).
create table if not exists public.aqueous_purchases (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  stripe_session_id text not null unique,
  stripe_payment_intent_id text,
  product_type text not null check (product_type in ('report', 'subscription')),
  status text not null default 'pending' check (status in ('pending', 'completed', 'expired')),
  credit_applied numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists aqueous_purchases_user_idx on public.aqueous_purchases (user_id, created_at desc);
alter table public.aqueous_purchases enable row level security;

-- The $5/month plan's status, kept current by the webhook (users.subscriptionId/Status in the app).
create table if not exists public.aqueous_subscriptions (
  stripe_subscription_id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  stripe_customer_id text not null,
  status text not null,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  updated_at timestamptz not null default now()
);
create index if not exists aqueous_subscriptions_user_idx on public.aqueous_subscriptions (user_id, updated_at desc);
alter table public.aqueous_subscriptions enable row level security;

-- Personalized AWI reports, written by Claude (the app used Manus's built-in model).
create table if not exists public.aqueous_reports (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  purchase_id bigint references public.aqueous_purchases (id) on delete set null,
  title text not null default 'Your Personalized AWI Report' check (char_length(title) <= 500),
  water_profile jsonb,
  report_content text check (char_length(report_content) <= 60000),
  status text not null default 'pending' check (status in ('pending', 'generating', 'complete', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists aqueous_reports_user_idx on public.aqueous_reports (user_id, created_at desc);
alter table public.aqueous_reports enable row level security;
