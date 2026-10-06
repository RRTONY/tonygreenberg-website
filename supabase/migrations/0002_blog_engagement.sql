-- Blog post engagement for tonygreenberg.com (2026-10-07). Run once in the
-- Supabase dashboard after 0001: SQL Editor > New query > paste this file > Run.
-- Ported from the legacy app's comments / postReactions / blogRatings /
-- commitments tables (drizzle/schema.ts, MySQL) to Postgres.
--
-- Access model: same as 0001. Row-level security is ON and there are no
-- public policies: the site's server reads and writes these tables with the
-- service-role key (src/app/blog/[slug]/engagement-actions.ts), so a visitor's
-- email address or session id never reaches the browser.

-- "Discourse": reader comments under each essay. Shown on the essay as soon as
-- they're posted, like live; Tony gets an email for each one. `hidden` lets him
-- take one down in the Table Editor without deleting it.
create table if not exists public.blog_comments (
  id bigint generated always as identity primary key,
  post_slug text not null,
  user_id uuid references auth.users (id) on delete set null,
  name text not null,
  email text,
  session_id text,
  content text not null,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists blog_comments_post_idx on public.blog_comments (post_slug, created_at desc);
alter table public.blog_comments enable row level security;

-- "Did this land?" / "What's the verdict?": one reaction per browser session
-- per essay, with an optional short note.
create table if not exists public.blog_reactions (
  id bigint generated always as identity primary key,
  post_slug text not null,
  reaction text not null check (reaction in ('up', 'neutral', 'down')),
  session_id text not null,
  comment text,
  created_at timestamptz not null default now(),
  unique (post_slug, session_id)
);
alter table public.blog_reactions enable row level security;

-- "Rate this thinking".
create table if not exists public.blog_ratings (
  id bigint generated always as identity primary key,
  post_slug text not null,
  rating text not null check (rating in ('completely', 'partially', 'not-yet')),
  session_id text not null,
  created_at timestamptz not null default now(),
  unique (post_slug, session_id)
);
alter table public.blog_ratings enable row level security;

-- "Micro-commitment": what a reader says they'll do differently.
create table if not exists public.blog_commitments (
  id bigint generated always as identity primary key,
  post_slug text not null,
  commitment text not null,
  session_id text not null,
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists blog_commitments_post_idx on public.blog_commitments (post_slug, created_at desc);
alter table public.blog_commitments enable row level security;
