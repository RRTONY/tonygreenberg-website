# The old site's database (Manus / TiDB), checked 2026-10-09

The legacy app kept its data in a MySQL-compatible TiDB database on Manus (schema:
`_legacy-manus-app/drizzle/schema.ts`). It goes away with Manus. The owner shared the connection
details on 2026-10-09. `LEGACY_DATABASE_URL` was removed from `.env.local` on 2026-10-10 (owner:
"remove the old db"; everything is backed up and copied into Supabase). **The password was also
pasted into a chat: rotate it on Manus, or simply let it die with Manus at shutdown.**

## Backup

Every table (56 tables, 75,128 rows) was exported read-only on 2026-10-09 to
`~/Desktop/tonyg-site-backups/legacy-db-export-2026-10-09/` on the webmaster's Mac (one JSON file
per table with its `CREATE TABLE`, plus `_summary.json`; folder mode 700, files 600). It holds
personal data (emails, names): never commit it or upload it anywhere public.

## What is real and what is test data

Most rows are automated tests from the Manus agent (same timestamps across tables, e.g.
2026-07-13 19:11; test session ids; identical answers). Checked by pattern, not by reading
personal data:

| Table | Rows | Real |
| --- | --- | --- |
| `page_views` | 65,462 | analytics (GA4 has the same picture) |
| `search_queries` | 2,669 | analytics |
| `assessment_results` | 1,032 | ~24 (1,008 have test session ids) |
| `community_contacts` | 1,010 | 0 (2 distinct test emails) |
| `manifesto_responses` | 1,010 | 2 (505 blank, 503 identical) |
| `pri_consents` | 387 | ~17 (370 signed "TG") |
| `pri_corrections` | 364 | 0 (all the same suggestion) |
| `email_subscribers` | 36 | 36 (distinct, none test-looking) |
| `vendor_intake` | 8 | 8 stage-1 forms, 1 contact email |
| `users` | 5 | 5 (old site accounts) |
| `short_urls` | 198 | all (share links, see below) |
| reactions / ratings / commitments / referral code | 4 / 2 / 1 / 1 | yes |
| comments, highlights, PRI calibrations, Clock Keeper, post-intervention, friend gate | 0 | none |

## Done with it so far

- **Short share links** `/s/<code>` (198): redirects in `src/lib/content/short-links.ts`, read by
  `next.config.ts`. 196 land on a working page; `f9n4eq` (`/blog/blood-is-the-api`) and `jwd9jx`
  (`/movement-signup`) point at pages that don't exist on live either.

## Done on 2026-10-09 (owner said yes)

- **Email subscribers → Kit, with no email sent:** 5 of the 36 were already in Kit (the old site
  synced them). The other 31 were added through a brand-new tag, `Legacy site import 2026-10-09`
  (id 24416119; Kit sends no confirmation for tag subscriptions, and a new tag has no automations).
  Kit accepted 27; it silently drops the other 4 (addresses on its suppression list, e.g. past
  bounces or complaints). They stay in the backup only. Do not retry through a form: forms send
  the confirmation email.
- **Supplier intake forms → Supabase** (owner's choice; the rest stays in the backup only): table
  `legacy_vendor_intake` (`supabase/migrations/0003_legacy_vendor_intake.sql`, each legacy row kept
  whole in `data`) and `scripts/import-legacy-vendor-intake.ts` (upsert on `legacy_id`, reads
  `vendor_intake.json` from the backup). Done 2026-10-09: the 8 forms are in the table.
- **Daily Provocations:** the one legacy line missing here (2026-10-07) added to
  `src/lib/content/daily-provocations.ts`.

- **Everything else → Supabase** (owner: "add all data in old db to new supabase"): all 55 data
  tables copied into a private `legacy` schema (75,089 rows, counts verified; `__drizzle_migrations`
  skipped), same columns with Postgres types (int → bigint, timestamps → timestamptz, json → jsonb),
  row-level security on, schema not in PostgREST's exposed list and no anon/authenticated usage.
  Done through the Management API (`POST /v1/projects/<ref>/database/query`) with a personal access
  token, not the site's keys. Readable in the dashboard's Table Editor (schema `legacy`).

## Where the archived data is used on the site (checked 2026-10-10)

Every site feature that stores data already reads Supabase (`grep -rn '\.from("' src`). Mapped
each `legacy` table to them:

- **Used:** `post_reactions`, `blog_ratings`, `micro_commitments` → `public.blog_reactions`,
  `blog_ratings`, `blog_commitments` (shown on every essay). Copy script:
  `supabase/migrations/0004_copy_legacy_engagement.sql` (inside the database, idempotent, reads
  rows via `to_jsonb()` so the archive's column-name case doesn't matter). Owner asked
  ("use it in the Supabase db"); **run 2026-10-10** through the Management API (4 / 2 / 1 rows). A row whose old essay address was
  later renamed stays in the table but won't show on the essay.
- **Empty in the old site, nothing to copy:** comments, highlights, PRI calibrations, Clock
  Keeper, post-intervention, friend gate.
- **Quiz results and journey progress (built 2026-10-10, owner chose):** `public.assessment_results`
  (every finish, anonymous allowed, result in words + score) and `public.journey_progress`
  (signed-in members, synced across devices); `supabase/migrations/0005_assessments.sql` also copies
  the 24 real legacy results (test sessions `^test` skipped, legacy names mapped to page addresses).
  Code: `src/app/assessments/actions.ts`, called from `journey-tracker.tsx`'s `markComplete` and
  `result-log.ts`'s `saveAssessmentResult` through `lib/assessments/record-finish.ts`, which merges
  both calls for one finish into a single server call (they used to queue, ~2.7 s each, and the
  result text was lost if the visitor left within ~5 s). The server also skips a repeat for the same
  visitor + quiz within 30 minutes. **Run 2026-10-10** (24 old results copied) and tested in a browser. Visitor id: the `tg_sid` cookie shared with essays
  (`src/lib/visitor-session.ts`). Tony reads results in Supabase's Table Editor (no admin page).
- **No matching feature, stays in `legacy` only:** `users` and the one `referral_codes` row (old
  accounts can't move to Supabase Auth without new passwords), `pri_consents`, `manifesto_responses`,
  `community_contacts`, `page_views`, `search_queries` and the rest.

Reading it again: a throwaway Python venv with `pymysql` + `certifi` (TLS is required), outside
the project, so no new package. Only `SHOW`/`SELECT`; TiDB has no real read-only session mode.

## Everything the old database did, for the Manus shutdown (checked 2026-10-10)

Every legacy tRPC procedure that touched the database (`_legacy-manus-app/server/routers.ts` and
`server/routers/*`), against the new site:

- **On the new site already:** email signups (Kit, `src/app/api/subscribe/route.ts`), essay
  comments / reactions / ratings / micro-commitments / Ask Tony, highlights, invites, Clock Keeper,
  post-intervention, friend gate, PRI calibrations (all Supabase), supplier forms (RampRate's Apps
  Script; stage 2 redirects to ramprate.com), accounts (Supabase Auth), short links (fixed list),
  quiz results and journey progress (2026-10-10).
- **Simplified to a pre-filled email or the browser only:** PRI consent (`sessionStorage`, ~17
  real legacy rows: the biggest gap), Living Declaration / manifesto, PRI corrections, Cheshire
  stories, facilitator submissions, spam reports, Engage audit (dropped). Each could save to
  Supabase like the quizzes if the owner wants; until Resend is set up, saved entries would only
  be visible in the Table Editor.
- **Not ported on purpose:** FauxTony + shared chats (cancelled), reading streaks, notifications,
  read counters, search logging, guest edits, community directory, AI features that used Manus's
  LLM (coffee prescription AI, AI search, daily provocation generator, next-read), Stripe, spam
  tracking, admin dashboards.
- **Manus services with no replacement:** in-app owner alerts (`notifyOwner`, ~20 calls; only
  comments, Ask Tony and friend gate email Tony, through Resend), the new-subscriber alert.
- **Found: no Google Analytics tag on the new site.** Legacy loads GA4 `G-4GVW40S47N` in
  `client/index.html`; nothing in `src/` does, so visitor stats would stop at cutover. Tracked in
  `NEXTJS-MIGRATION-TODO.md` Phase 12.
