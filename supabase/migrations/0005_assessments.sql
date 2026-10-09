-- Quiz results and members' journey progress (2026-10-10). Run once after
-- 0001-0004, in the Supabase dashboard: SQL Editor > New query > paste this
-- file > Run. Ported from the legacy app's assessment_results and
-- journey_progress tables (drizzle/schema.ts), so Manus can be switched off.
--
-- Access model: same as 0001/0002. Row-level security is ON with no public
-- policies; the site's server reads and writes with the service-role key
-- (src/app/assessments/actions.ts), so session ids never reach the browser.

-- Every finished quiz, anonymous or signed in. `assessment` is the quiz's page
-- address without the slash (e.g. 'find-your-coffee', 'consciousness-scale').
-- `summary` is the result in words (archetype, level, top match) when the quiz
-- passes one; `score` a number where the quiz has one.
create table if not exists public.assessment_results (
  id bigint generated always as identity primary key,
  assessment text not null,
  session_id text not null,
  user_id uuid references auth.users (id) on delete set null,
  summary text,
  score integer,
  created_at timestamptz not null default now()
);
create index if not exists assessment_results_assessment_idx on public.assessment_results (assessment, created_at desc);
create index if not exists assessment_results_session_idx on public.assessment_results (session_id, created_at desc);
alter table public.assessment_results enable row level security;

-- Which "Find Your ___" experiences a signed-in member has finished, so the
-- Journey Tracker follows them across devices (visitors who aren't signed in
-- keep using their browser only). `experience_id` matches JOURNEY_MAP's ids
-- in src/components/assessments/journey-tracker.tsx.
create table if not exists public.journey_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  experience_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, experience_id)
);
alter table public.journey_progress enable row level security;

-- Copy the old site's real quiz results from the private `legacy` archive.
-- Legacy's own automated tests used session ids starting with 'test' (1,008 of
-- 1,032 rows); those are left out. Old accounts don't exist in Supabase Auth,
-- so user ids are dropped. Safe to run again: copied rows carry a 'legacy-'
-- session prefix and are skipped if already present.
-- Legacy's assessmentType names are mapped to the new page addresses.
insert into public.assessment_results (assessment, session_id, summary, score, created_at)
select
  case coalesce(r->>'assessmentType', r->>'assessmenttype')
    when 'mirror' then 'the-mirror'
    when 'dharma' then 'dharma-finder'
    when 'consciousness' then 'consciousness-scale'
    when 'therapy' then 'find-your-therapy'
    when 'psychedelic-readiness' then 'psychedelic-readiness-index'
    when 'find-your-me' then 'find-your-me'
    when 'grant-study' then 'grant-study'
    when 'soulscore' then 'soulscore'
    when 'self-portrait' then 'self-portrait'
    when 'iboga-compass' then 'iboga-compass'
    when 'brewsoul-quiz' then 'brewsoul-quiz'
    when 'kava' then 'kava'
    else 'find-your-' || coalesce(r->>'assessmentType', r->>'assessmenttype')
  end,
  'legacy-' || coalesce(r->>'sessionId', r->>'sessionid'),
  left(coalesce(r->>'resultSummary', r->>'resultsummary'), 2000),
  nullif(coalesce(r->>'totalScore', r->>'totalscore'), '')::numeric::integer,
  coalesce((coalesce(r->>'createdAt', r->>'createdat'))::timestamptz, now())
from (select to_jsonb(t) as r from legacy.assessment_results t) src
where coalesce(r->>'sessionId', r->>'sessionid') !~* '^test'
  and not exists (
    select 1 from public.assessment_results a
    where a.session_id = 'legacy-' || coalesce(r->>'sessionId', r->>'sessionid')
      and a.created_at = coalesce((coalesce(r->>'createdAt', r->>'createdat'))::timestamptz, now())
  );

select assessment, count(*) from public.assessment_results group by assessment order by 2 desc;
