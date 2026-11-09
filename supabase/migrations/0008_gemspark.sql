-- The GemSpark (/gem-spark) reader features (2026-11-10). Run once after 0001-0007,
-- in the Supabase dashboard: SQL Editor > New query > paste this file > Run.
-- Ported from the GemSpark Manus app's drizzle/schema.ts (story_submissions,
-- featured_sparks, page_views) to Postgres. Nothing is copied from Manus
-- (webmaster, 2026-11-10: "we don't want anything to use in manus"); these start
-- empty. Its newsletter_subscribers table is not ported: signups go to Kit
-- through /api/subscribe like every other form on the site.
--
-- Access model: same as 0006/0007. Row-level security is ON and there are no
-- public policies: the site's server reads and writes these tables with the
-- service-role key (src/app/gem-spark/actions.ts). Tony reads submissions and
-- picks featured sparks in the Table Editor (the Manus app's /admin page is not
-- ported). `session_id` is the anonymous visitor id (the tg_sid cookie).

-- "Share Your Spark": a reader's story, optional email. Tony is emailed each one.
create table if not exists public.gemspark_story_submissions (
  id bigint generated always as identity primary key,
  story text not null check (char_length(story) between 10 and 10000),
  email text,
  session_id text not null,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists gemspark_story_submissions_created_idx on public.gemspark_story_submissions (created_at desc);
create index if not exists gemspark_story_submissions_session_idx on public.gemspark_story_submissions (session_id, created_at desc);
alter table public.gemspark_story_submissions enable row level security;

-- Reader stories Tony chooses to show on the page ("Featured GemSparks").
-- Add a row (is_active = true) in the Table Editor to feature one; lower
-- display_order shows first.
create table if not exists public.gemspark_featured_sparks (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 255),
  story text not null check (char_length(story) >= 10),
  tagline text,
  location text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  submission_id bigint references public.gemspark_story_submissions (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists gemspark_featured_sparks_active_idx on public.gemspark_featured_sparks (is_active, display_order);
alter table public.gemspark_featured_sparks enable row level security;

-- One row per read, for the page's public "Impact Report" (long-form and
-- short-form read counts). No IP or user agent is stored.
create table if not exists public.gemspark_page_views (
  id bigint generated always as identity primary key,
  page text not null check (page in ('long-form', 'short-form')),
  session_id text not null,
  created_at timestamptz not null default now()
);
create index if not exists gemspark_page_views_page_idx on public.gemspark_page_views (page);
create index if not exists gemspark_page_views_session_idx on public.gemspark_page_views (session_id, page, created_at desc);
alter table public.gemspark_page_views enable row level security;
