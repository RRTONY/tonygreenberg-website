-- SoulSmoke (/soul-smoke) member features (2026-11-10). Run once after 0001-0006,
-- in the Supabase dashboard: SQL Editor > New query > paste this file > Run.
-- Ported from the SoulSmoke Manus app's drizzle/schema.ts (tasting_journal,
-- price_alerts, trade_listings, trade_messages, business_profiles,
-- bottle_interests) to Postgres. The Manus database is NOT copied (webmaster,
-- 2026-11-10: "we don't want anything to use in manus"); these start empty.
-- producer_profiles / lead_connections were admin-only with no page; Tony can
-- add them later if he wants that workflow.
--
-- As on SoulSmoke, everything here belongs to a signed-in member (Supabase
-- Auth instead of Manus OAuth). The Trade Board and the per-bottle demand
-- counts are readable by everyone, through the site's server only.
--
-- Access model: same as 0001/0002/0006. Row-level security is ON and there are
-- no public policies: the site's server reads and writes these tables with the
-- service-role key (src/app/soul-smoke/actions.ts), always scoped to the
-- signed-in member, so no member id or email reaches another visitor's
-- browser. Tony reads them in the Table Editor. Prices are in cents.

create table if not exists public.soulsmoke_tasting_entries (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  mezcal_name text not null check (char_length(mezcal_name) between 1 and 255),
  producer text,
  agave_type text,
  region text,
  abv text,
  rating smallint check (rating between 1 and 5),
  notes text,
  smoke_level smallint check (smoke_level between 1 and 5),
  sweetness_level smallint check (sweetness_level between 1 and 5),
  complexity_level smallint check (complexity_level between 1 and 5),
  would_buy_again boolean not null default false,
  tasted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists soulsmoke_tasting_entries_user_idx on public.soulsmoke_tasting_entries (user_id, tasted_at desc);
alter table public.soulsmoke_tasting_entries enable row level security;

create table if not exists public.soulsmoke_price_alerts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  mezcal_name text not null check (char_length(mezcal_name) between 1 and 255),
  target_price integer check (target_price >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists soulsmoke_price_alerts_user_idx on public.soulsmoke_price_alerts (user_id, created_at desc);
alter table public.soulsmoke_price_alerts enable row level security;

create table if not exists public.soulsmoke_trade_listings (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  mezcal_name text not null check (char_length(mezcal_name) between 1 and 255),
  producer text,
  agave_type text,
  abv text,
  bottle_size text,
  condition text not null default 'sealed' check (condition in ('sealed', 'opened', 'partial')),
  fill_level text,
  listing_type text not null default 'both' check (listing_type in ('trade', 'sell', 'both')),
  asking_price integer check (asking_price >= 0),
  seeking_bottles text,
  description text,
  location text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists soulsmoke_trade_listings_active_idx on public.soulsmoke_trade_listings (is_active, created_at desc);
create index if not exists soulsmoke_trade_listings_user_idx on public.soulsmoke_trade_listings (user_id, created_at desc);
alter table public.soulsmoke_trade_listings enable row level security;

create table if not exists public.soulsmoke_trade_messages (
  id bigint generated always as identity primary key,
  listing_id bigint not null references public.soulsmoke_trade_listings (id) on delete cascade,
  sender_id uuid not null references auth.users (id) on delete cascade,
  receiver_id uuid not null references auth.users (id) on delete cascade,
  message text not null check (char_length(message) between 1 and 2000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists soulsmoke_trade_messages_receiver_idx on public.soulsmoke_trade_messages (receiver_id, created_at desc);
create index if not exists soulsmoke_trade_messages_sender_idx on public.soulsmoke_trade_messages (sender_id, created_at desc);
alter table public.soulsmoke_trade_messages enable row level security;

create table if not exists public.soulsmoke_business_profiles (
  id bigint generated always as identity primary key,
  user_id uuid not null unique references auth.users (id) on delete cascade,
  business_type text not null check (business_type in ('retailer', 'bar', 'restaurant', 'distributor', 'importer', 'other')),
  business_name text not null check (char_length(business_name) between 1 and 255),
  contact_name text,
  contact_email text,
  phone text,
  website text,
  city text,
  state text,
  country text default 'US',
  license_type text,
  annual_volume text,
  focus_categories text,
  bio text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.soulsmoke_business_profiles enable row level security;

create table if not exists public.soulsmoke_bottle_interests (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  business_profile_id bigint references public.soulsmoke_business_profiles (id) on delete set null,
  bottle_id text not null check (char_length(bottle_id) between 1 and 50),
  bottle_name text not null check (char_length(bottle_name) between 1 and 255),
  interest_type text not null default 'consumer' check (interest_type in ('consumer', 'retailer', 'distributor')),
  quantity text,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists soulsmoke_bottle_interests_bottle_idx on public.soulsmoke_bottle_interests (bottle_id);
create index if not exists soulsmoke_bottle_interests_user_idx on public.soulsmoke_bottle_interests (user_id, created_at desc);
alter table public.soulsmoke_bottle_interests enable row level security;
