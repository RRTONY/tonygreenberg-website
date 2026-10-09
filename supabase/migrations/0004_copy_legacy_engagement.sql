-- Copy the old site's real essay engagement into the tables the essays read
-- (2026-10-10). Run once after 0002, in the Supabase dashboard: SQL Editor >
-- New query > paste this file > Run. Safe to run again: rows already copied
-- are skipped.
--
-- Source: the private `legacy` schema (every old Manus table, copied
-- 2026-10-09; see docs/ai/project_legacy_database.md). These are the only old
-- tables with rows that a feature on the new site shows:
--   legacy.post_reactions    -> public.blog_reactions   ("Did this land?")
--   legacy.blog_ratings      -> public.blog_ratings     ("Rate this thinking")
--   legacy.micro_commitments -> public.blog_commitments ("Micro-commitment")
-- The old site's user ids are dropped: they point at its own users table, not
-- Supabase Auth. Old comments, highlights, PRI calibrations, Clock Keeper,
-- post-intervention and friend gate tables were empty, so nothing to copy.
--
-- Rows are read through to_jsonb() so this works whether the archive kept the
-- old camelCase column names ("postSlug") or lower-cased them (postslug).

insert into public.blog_reactions (post_slug, reaction, session_id, comment, created_at)
select
  coalesce(r->>'postSlug', r->>'postslug', r->>'post_slug'),
  r->>'reaction',
  coalesce(r->>'sessionId', r->>'sessionid', r->>'session_id'),
  nullif(btrim(r->>'comment'), ''),
  coalesce((coalesce(r->>'createdAt', r->>'createdat', r->>'created_at'))::timestamptz, now())
from (select to_jsonb(t) as r from legacy.post_reactions t) src
where r->>'reaction' in ('up', 'neutral', 'down')
on conflict (post_slug, session_id) do nothing;

insert into public.blog_ratings (post_slug, rating, session_id, created_at)
select
  coalesce(r->>'postSlug', r->>'postslug', r->>'post_slug'),
  r->>'rating',
  coalesce(r->>'sessionId', r->>'sessionid', r->>'session_id'),
  coalesce((coalesce(r->>'createdAt', r->>'createdat', r->>'created_at'))::timestamptz, now())
from (select to_jsonb(t) as r from legacy.blog_ratings t) src
where r->>'rating' in ('completely', 'partially', 'not-yet')
on conflict (post_slug, session_id) do nothing;

-- blog_commitments has no unique key, so skip rows already copied by matching
-- essay + session + text.
insert into public.blog_commitments (post_slug, commitment, session_id, created_at)
select c.post_slug, c.commitment, c.session_id, c.created_at
from (
  select
    coalesce(r->>'postSlug', r->>'postslug', r->>'post_slug') as post_slug,
    btrim(r->>'commitment') as commitment,
    coalesce(r->>'sessionId', r->>'sessionid', r->>'session_id') as session_id,
    coalesce((coalesce(r->>'createdAt', r->>'createdat', r->>'created_at'))::timestamptz, now()) as created_at
  from (select to_jsonb(t) as r from legacy.micro_commitments t) src
) c
where c.commitment <> ''
  and not exists (
    select 1 from public.blog_commitments b
    where b.post_slug = c.post_slug and b.session_id = c.session_id and b.commitment = c.commitment
  );

-- Check: how many old rows each table now holds.
select 'blog_reactions' as table_name, count(*) from public.blog_reactions
union all select 'blog_ratings', count(*) from public.blog_ratings
union all select 'blog_commitments', count(*) from public.blog_commitments;
