-- Member features for tonygreenberg.com (2026-10-06). Run once in the
-- Supabase dashboard: SQL Editor > New query > paste this file > Run.
-- Ported from the legacy app's drizzle/schema.ts (MySQL) to Postgres, keyed
-- to Supabase Auth users (auth.users) instead of legacy's own users table.
--
-- Access model: every table has row-level security ON. Visitors can only
-- read their own rows (highlights, referral code, referrals they made).
-- Form submissions (Clock Keeper, post-intervention, friend gate, PRI
-- calibrations) are written and read only by the server with the
-- service-role key, so there are no public policies on them at all.

-- Saved passages from essays (/my-highlights).
create table if not exists public.highlights (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  post_slug text not null,
  text text not null,
  context text,
  created_at timestamptz not null default now()
);
create index if not exists highlights_user_idx on public.highlights (user_id, created_at desc);
alter table public.highlights enable row level security;
create policy "highlights: read own" on public.highlights for select using (auth.uid() = user_id);
create policy "highlights: add own" on public.highlights for insert with check (auth.uid() = user_id);
create policy "highlights: delete own" on public.highlights for delete using (auth.uid() = user_id);

-- One shareable invite code per member (/my-impact).
create table if not exists public.referral_codes (
  user_id uuid primary key references auth.users (id) on delete cascade,
  code text not null unique,
  created_at timestamptz not null default now()
);
alter table public.referral_codes enable row level security;
create policy "referral_codes: read own" on public.referral_codes for select using (auth.uid() = user_id);

-- Who joined through whose invite, and how deeply they engaged.
create table if not exists public.referrals (
  id bigint generated always as identity primary key,
  referrer_id uuid not null references auth.users (id) on delete cascade,
  referred_user_id uuid not null unique references auth.users (id) on delete cascade,
  referral_code text not null,
  depth_score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists referrals_referrer_idx on public.referrals (referrer_id);
alter table public.referrals enable row level security;
create policy "referrals: read the ones you made" on public.referrals for select using (auth.uid() = referrer_id);

-- /clock-keeper-part-2 answers (anonymous allowed).
create table if not exists public.clock_keeper_responses (
  id bigint generated always as identity primary key,
  respondent_name text,
  respondent_email text,
  q1 text, q2 text, q3 text, q4 text, q5 text, q6 text,
  q7 text, q8 text, q9 text, q10 text, q11 text, q12 text,
  reframe text,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.clock_keeper_responses enable row level security;

-- /post-intervention check-ins.
create table if not exists public.post_intervention_assessments (
  id uuid primary key default gen_random_uuid(),
  session_token text not null,
  day_choice integer not null,
  facilitator_ref text,
  intervention_type text not null default 'psychedelic'
    check (intervention_type in ('psychedelic', 'meditation', 'breathwork', 'ceremony', 'other')),
  integration_score integer,
  safety_score integer,
  trust_score integer,
  would_recommend text check (would_recommend in ('yes', 'no', 'unsure')),
  responses jsonb,
  went_well text,
  could_improve text,
  message_to_facilitator text,
  notified boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.post_intervention_assessments enable row level security;

-- /friend-gate: a seeker asks three friends before medicine work.
create table if not exists public.friend_gate_sessions (
  id bigint generated always as identity primary key,
  seeker_token text not null unique,
  seeker_name text,
  status text not null default 'pending' check (status in ('pending', 'open', 'blocked')),
  resolved_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
alter table public.friend_gate_sessions enable row level security;

create table if not exists public.friend_gate_slots (
  id bigint generated always as identity primary key,
  session_id bigint not null references public.friend_gate_sessions (id) on delete cascade,
  slot_index integer not null check (slot_index between 0 and 2),
  friend_name text,
  contact_type text not null check (contact_type in ('email', 'phone')),
  contact_value text not null,
  contact_hash text not null,
  survey_token text not null unique,
  otp_hash text,
  otp_expires_at timestamptz,
  verified boolean not null default false,
  verified_at timestamptz,
  survey_response jsonb,
  verdict text check (verdict in ('support', 'wait', 'unsure')),
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  unique (session_id, slot_index)
);
alter table public.friend_gate_slots enable row level security;

-- PRI calibration results shared for research (/pri-research reads these).
create table if not exists public.pri_calibrations (
  id bigint generated always as identity primary key,
  session_id text not null,
  user_id uuid references auth.users (id) on delete set null,
  rankings jsonb not null,
  pairwise_choices jsonb not null,
  dim_scores jsonb not null,
  research_opt_in boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.pri_calibrations enable row level security;
