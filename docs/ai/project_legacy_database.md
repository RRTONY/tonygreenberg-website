# The old site's database (Manus / TiDB), checked 2026-10-09

The legacy app kept its data in a MySQL-compatible TiDB database on Manus (schema:
`_legacy-manus-app/drizzle/schema.ts`). It goes away with Manus. The owner shared the connection
details on 2026-10-09; they live only in `.env.local` as `LEGACY_DATABASE_URL` (never commit,
never paste in docs). **The password was also pasted into a chat, so rotate it after the copy is
finished**, then delete `LEGACY_DATABASE_URL`.

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

## Still to decide (owner)

- The 36 **email subscribers** belong in Kit (the newsletter), not Supabase. Adding them may send
  Kit's confirmation emails: needs a yes.
- The few real rows that have a home in Supabase (reactions, ratings, micro-commitment) can be
  copied after `supabase/migrations/0001` and `0002` are run. Account-linked rows only match new
  accounts by email.
- The rest (assessment results, PRI consents, manifesto responses, vendor intake, Cheshire
  submission): keep in the backup only, or build tables for them.

Reading it again: a throwaway Python venv with `pymysql` + `certifi` (TLS is required), outside
the project, so no new package. Only `SHOW`/`SELECT`; TiDB has no real read-only session mode.
