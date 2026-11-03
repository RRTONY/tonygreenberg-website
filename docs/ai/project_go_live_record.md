# Go-live record: tonygreenberg.com on Netlify (checked 2026-11-04)

> One page answering "where does the site live, what is the source of truth, how do changes
> reach it, how do we roll back, and what was tested". Written 2026-11-04 after an outside status
> report called the migration "RED"; every claim in it was re-checked against the live site.

## Where the site runs (verified 2026-11-04 with `dig` and response headers)

- `tonygreenberg.com` A record → `75.2.60.5` (Netlify); `www` CNAME →
  `tonygreenberg-website.netlify.app`. Responses carry `server: Netlify` and Next.js cache headers.
- Name servers are still Hostinger (`ns1/ns2.dns-parking.com`). DNS changes happen there.
- The DNS switch to Netlify had happened by 2026-11-04 (the exact day it was made isn't recorded in
  this repo). "Production" and "the Netlify copy" are now the same site.

## Source of truth

| What | Lives in | Notes |
| --- | --- | --- |
| Code, page copy written in code, quizzes, scoring, encyclopedia data | GitHub `RRTONY/tonygreenberg-website`, branch `main` | Netlify builds every push to `main` |
| Essays, authors, categories, images, SEO fields | Sanity project `a3q1cyqs`, dataset `production` | Edited in `/studio` |
| Logins, quiz saves, form submissions, chat history | Supabase | Old site's real data copied 2026-10-09 |
| Email list | Kit | 27 of the old site's 36 subscribers added 2026-10-09 |
| Nothing | Manus | See "Manus" below |

## How changes reach the live site

1. Code: pull request → Netlify deploy preview → merge to `main` → Netlify builds and publishes.
2. Content: publish in Sanity Studio → Sanity webhook calls `/api/revalidate` → the affected pages
   refresh within seconds. No deploy needed.
3. Through Claude (MCP server, `docs/ai/project_mcp_server.md`): code edits become a pull request,
   Sanity edits become drafts; nothing goes live without `publish_changes` and a yes.

## Rollback gate

- **Code / a bad deploy:** Netlify → site `tonygreenberg-website` → Deploys → pick the last good
  deploy → "Publish deploy". Takes effect in seconds, no DNS change. Then revert the pull request on
  `main` so the next build doesn't bring it back.
- **Content:** Sanity Studio → the document → History → restore the earlier version → Publish.
- **Rolling back to Manus is not an option any more** (owner, 2026-11-04: "I don't want to keep
  anything in Manus"). On 2026-11-04 Manus no longer serves `tonygreenberg.com` (TLS fails on its
  addresses), though `tonygreenberg.manus.space` still answers.
- Gate for any big change: deploy preview builds and passes checks, the person sees what goes live,
  says yes, then merge. After merging, run the sitemap sweep below.

## Manus (owner, 2026-11-04: keep nothing there)

Everything is already out of Manus:
- Images: 91 of 94 rescued into Sanity on 2026-09-28 (3 were already gone), `manus-media-rescue.md`.
  The live site uses zero Manus addresses (all 502 pages checked 2026-11-04).
- Database: every table exported 2026-10-09 (backup on the webmaster's Mac); real data moved to
  Supabase and Kit, share links into `short-links.ts`, `project_legacy_database.md`.
- Left to do, in the Manus account (owner's action, needs a yes): delete the Manus project and its
  database (this also takes `tonygreenberg.manus.space` down). This can't be undone, so do it only
  after the backup folder has been checked.

## Owner access

Tony needs to publish without a developer. Content publishing needs only a Sanity Studio login
(`tonygreenberg.com/studio`, Sanity project `a3q1cyqs` → Members) or the MCP server through Claude
(`project_mcp_server.md`). **Checked 2026-11-04 (`pnpm exec sanity users list`): Tony is NOT a
member.** The only members are "RampRate Impactsoul" (Administrator) and the `tonygreenberg`
robot token (Editor). Fix: `pnpm exec sanity users invite <tony's email> --role editor` (or
Administrator), or Sanity Manage → Members → Invite. **Invited 2026-11-04** (owner's yes): tony@tonygreenberg.com as Administrator. He has to accept the
emailed invite; until then he still can't sign in. Check with `pnpm exec sanity users list`.

## QA run 2026-11-04 (live tonygreenberg.com)

- Sitemap: 502 addresses, all 200 (121 essays + 7 category pages under `/blog/`; correct, not a bug).
- Images: all 275 distinct Sanity images used by those pages return 200; zero Manus addresses.
- Old site's router: 189 routes; 178 load, 11 are 404 on purpose (`/admin/*`, `/analytics`,
  `/edit/frqncy`, `/payment-success`, `/payment-cancel`, `/404`).
- `/medicine` and `/heroes`: never real pages (legacy had no `/medicine` route; `/heroes` showed
  live's own 404), so the 404 is correct. Real pages `/iboga-ibogaine`, `/iboga-compass`,
  `/medicine-sequencing` are 200 with their Sanity images.
- Search Console addresses (471, last 16 months): 465 land on a working page, 3 go to other sites
  on purpose, 3 are 404 on purpose (two old Manus `/assets/*.js` files, and
  `/blog/the-case-file-dr-samuel-lee`, removed by the owner 2026-10-09).
- Browser (Chromium, 375 / 820 / 1280px): 14 key pages, no sideways scroll, no broken images, no
  page errors, GA4 (`G-4GVW40S47N`) loaded on all of them.
- Sign-up endpoint `/api/subscribe` rejects a blank email (400); no real sign-up was sent.
- robots.txt 200 with the sitemap line.

Re-run: sitemap sweep (curl every `<loc>`), `node --env-file=.env.local --import tsx
scripts/check-search-console-urls.ts https://tonygreenberg.com`.

## Search Console (2026-11-04)

`https://tonygreenberg.com/sitemap.xml` resubmitted 2026-11-04 (Google last read it 2026-10-27:
502 addresses, 0 errors, 82 warnings left over from the old site's sitemap). Two old leftover
sitemap entries still listed with 2 errors each: `https://tonygreenberg.com/tonygreenberg.com/sitemap.xml`
and `https://tonygreenberg.com/sitemap_index.xml`; removing them from Search Console needs a yes.

Leftover sitemap entries removed 2026-11-04 (owner's yes); Google's listing then showed only
`sitemap.xml`: 502 submitted, 0 errors, 0 warnings.

### "Why pages aren't indexed" report (owner's screenshot, 2026-11-04)

Inspected 20 evenly spread sitemap pages with URL Inspection: 11 indexed with matching
canonicals; 2 essays "Blocked by robots.txt" (last crawled 2026-05, the old site) and 2 "Crawled -
currently not indexed" (last crawled 2026-06, the old site); 5 not visited yet (new pages). Today's
robots.txt blocks only `/api/`, `/.well-known/`, `/admin`, `/studio`. So most of that report is
the old Manus site's history, and Google refreshes it as it recrawls. "Page with redirect" (432)
and "Alternate page with proper canonical tag" (174) are expected (old addresses we redirect).
Fix in the Search Console website (the API can't): open each row → "Validate fix"; optionally
"Request indexing" for key pages. The small rows (404 ×4, 403 ×4, soft 404 ×2, Google chose a
different canonical ×11, noindex ×84) need their example addresses (row → export) to check.

## Still open

- Tony accepts the Sanity invite (sent 2026-11-04 to tony@tonygreenberg.com).
- Remove the two leftover sitemap entries from Search Console (needs a yes).
- `tonygreenberg.manus.space` still answers (sends `X-Robots-Tag: noindex, nofollow`, so Google
  doesn't index it); it goes away with the Manus project.
- Delete the Manus project and database (owner's yes, done in the Manus account).
