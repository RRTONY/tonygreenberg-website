-- Site forms that save and email Tony (2026-10-10). Run once after 0001-0005,
-- in the Supabase dashboard: SQL Editor > New query > paste this file > Run.
-- Ported from the legacy app's pri_consents / pri_corrections /
-- manifesto_responses / cheshire_submissions / facilitator_submissions /
-- spam_reports tables (drizzle/schema.ts, MySQL) to Postgres, plus a new
-- brewsoul_submissions table (legacy only kept those in the browser). The
-- port had turned these forms into pre-filled emails; they save again now.
-- The old rows were test data and stay in the private `legacy` schema: this
-- file copies nothing.
--
-- Access model: same as 0001/0002. Row-level security is ON and there are no
-- public policies: the site's server writes these tables with the
-- service-role key (src/app/forms/actions.ts), so a visitor's email address or
-- session id never reaches the browser. Tony reads them in the Table Editor.
-- `session_id` is the anonymous visitor id (the tg_sid cookie), the same one
-- quiz results and essay reactions use.

-- PRI "Before You Go In" gate: the initials a visitor typed to accept the
-- disclaimer. An audit trail only; no email.
create table if not exists public.pri_consents (
  id bigint generated always as identity primary key,
  initials text not null check (char_length(initials) between 2 and 10),
  consent_version text not null default '1.0',
  session_id text not null,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists pri_consents_session_idx on public.pri_consents (session_id, created_at desc);
alter table public.pri_consents enable row level security;

-- PRI "Suggest a Correction" on a medicine. `status` / `admin_notes` are for
-- Tony's review in the Table Editor.
create table if not exists public.pri_corrections (
  id bigint generated always as identity primary key,
  medicine_id text not null,
  field_name text not null,
  current_content text,
  suggested_content text not null,
  source_url text,
  submitter_name text,
  submitter_email text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_notes text,
  session_id text not null,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists pri_corrections_created_idx on public.pri_corrections (created_at desc);
create index if not exists pri_corrections_session_idx on public.pri_corrections (session_id, created_at desc);
alter table public.pri_corrections enable row level security;

-- /living-declaration "Submit My Blueprint": six optional questions plus an
-- optional name and email.
create table if not exists public.manifesto_responses (
  id bigint generated always as identity primary key,
  name text,
  email text,
  biggest_challenge text,
  what_to_measure text,
  reference_sites text,
  new_indices text,
  how_to_participate text,
  abundant_life text,
  session_id text not null,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists manifesto_responses_created_idx on public.manifesto_responses (created_at desc);
create index if not exists manifesto_responses_session_idx on public.manifesto_responses (session_id, created_at desc);
alter table public.manifesto_responses enable row level security;

-- "Submit Your Story" on /protecting-your-business and /alex-azzi (legacy's
-- CheshireGrin intake). Anonymous by design, so no user_id. `source_page`
-- says which case page it came from.
create table if not exists public.cheshire_submissions (
  id bigint generated always as identity primary key,
  source_page text not null,
  relationship text not null,
  city text,
  date_range text,
  promised_vs_delivered text not null,
  received_payment text not null check (received_payment in ('yes', 'partial', 'no')),
  amount_owed text,
  has_documentation text,
  willing_to_contact boolean not null default false,
  contact_email text,
  how_heard text,
  status text not null default 'new' check (status in ('new', 'reviewed', 'actionable', 'archived')),
  session_id text not null,
  created_at timestamptz not null default now()
);
create index if not exists cheshire_submissions_created_idx on public.cheshire_submissions (created_at desc);
create index if not exists cheshire_submissions_session_idx on public.cheshire_submissions (session_id, created_at desc);
alter table public.cheshire_submissions enable row level security;

-- /facilitator-index: the full 108-item paste-in ('full') and the 15-question
-- Quick Intake ('quick', with its derived archetype). Anonymous by design
-- (a coded identity, never an account), so no user_id.
create table if not exists public.facilitator_submissions (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('full', 'quick')),
  coded_identity text,
  archetype text,
  responses text not null,
  referral_consent boolean not null default false,
  referral_region text,
  referral_contact text,
  locale text,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'matched')),
  session_id text not null,
  created_at timestamptz not null default now()
);
create index if not exists facilitator_submissions_created_idx on public.facilitator_submissions (created_at desc);
create index if not exists facilitator_submissions_session_idx on public.facilitator_submissions (session_id, created_at desc);
alter table public.facilitator_submissions enable row level security;

-- "Report A Spammer" on the Attention Theft manifesto. `verified` is for
-- Tony; nothing here is shown publicly.
create table if not exists public.spam_reports (
  id bigint generated always as identity primary key,
  company_name text not null,
  sender_email text not null,
  spam_type text not null check (spam_type in ('cold-outreach', 'unsolicited-newsletter', 'ai-generated-spam', 'phishing-scam')),
  frequency text not null check (frequency in ('one-time', 'weekly', 'daily', 'multiple-daily')),
  description text not null,
  reporter_email text,
  verified boolean not null default false,
  session_id text not null,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists spam_reports_created_idx on public.spam_reports (created_at desc);
create index if not exists spam_reports_session_idx on public.spam_reports (session_id, created_at desc);
alter table public.spam_reports enable row level security;

-- /brewsoul/submit: suggest a coffee ('submit') or appeal a score ('appeal').
create table if not exists public.brewsoul_submissions (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('submit', 'appeal')),
  coffee_name text not null,
  roaster text,
  url text,
  notes text,
  status text not null default 'new' check (status in ('new', 'reviewed', 'added', 'declined')),
  session_id text not null,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists brewsoul_submissions_created_idx on public.brewsoul_submissions (created_at desc);
create index if not exists brewsoul_submissions_session_idx on public.brewsoul_submissions (session_id, created_at desc);
alter table public.brewsoul_submissions enable row level security;
