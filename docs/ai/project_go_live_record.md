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

**Re-checked 2026-11-04 before shutting Manus down:** all 170 Sanity URLs in the rescue manifest
return 200; Supabase public tables match the copied counts (`legacy_vendor_intake` 8,
`blog_reactions` 4, `blog_ratings` 2, `blog_commitments` 1); no code uses the Manus database.
**Not verified:** the full backup. `~/Desktop/tonyg-site-backups/` no longer exists on the
webmaster's Mac, and the private Supabase `legacy` schema couldn't be read (the
`SUPABASE_ACCESS_TOKEN` in `.env.local` is rejected as invalid; `legacy` isn't exposed to the REST
API). **Verified the same day with a new access token:** the Supabase `legacy` schema holds 55
tables, 75,089 rows, exactly the 2026-10-09 copy (the export's 56th table, the old app's
`__drizzle_migrations` log, 39 rows, was skipped on purpose). Every table in the old schema is
there (plus `drip_*` and `owner_digest_events`, which the old database had too). So all Manus data
is in Supabase: deleting the Manus database loses nothing.

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

Re-run: `node --import tsx scripts/check-live-site.ts` (added 2026-11-04: sitemap pages, noindex,
canonicals, Manus addresses, images; exits 1 on a problem; pass `http://localhost:3000` for a local
build) and `node --env-file=.env.local --import tsx scripts/check-search-console-urls.ts
https://tonygreenberg.com`.

**Found by the new check (2026-11-04):** two essays link to other Manus-hosted sites that are
still up: `/blog/is-that-a-lot-clarisse-abelarde` → `clarisseart.manus.space` and
`/blog/the-restaurant-with-no-menu-prices-ai-ethics-manifesto` → `fix-ai-pricing.manus.space`
("Sign the petition at..."). They are separate Manus projects: deleting them breaks those links.
Changing the links is Tony's copy, so it needs his yes and a new home for each (Clarisse's own
site; the petition somewhere else or dropped).

**Clarisse essay, draft ready (2026-11-04):** `clarisse.artist` doesn't resolve at all (no DNS), so
about 20 of the essay's links were already dead, and both old painting addresses now show
"Artwork Not Found". Her working site is `clarisseartist.com` (a property in the team's Search
Console); the painting is `https://clarisseartist.com/artwork/sab-cam-roll-ii` (checked in a
browser). Sanity draft `drafts.post-is-that-a-lot-clarisse-abelarde`: 15 site links and 8 painting
links pointed there, the byline's 2 `tonygreenberg.manus.space` links to `https://tonygreenberg.com`,
the address shown in the text and in "Next steps" changed to `clarisseartist.com`. The Instagram
handle `@clarisse.artist` stays. **Not published:** Tony publishes it in Studio.
**Petition essay:** `fix-ai-pricing.manus.space` has no other home yet; Tony decides.

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

**Checked all 470 Search Console addresses live (2026-11-04):** 467 load; the 3 404s are the two
old Manus `/assets/*.js` files and the removed Dr. Samuel Lee essay (on purpose). Pages sending
noindex are all on purpose: `/alex-azzi` (password-locked report, since 2026-10-07) and
`/cheshire-grin` (308 to it), `/blog/you-are-the-moat` (gated essay), `/login`, `/members`,
`/request-a-password`. Canonicals match on every page (addresses with `#section` or `?rbsnp=1`
point at the clean page, as they should). No site code change needed. The 403 rows weren't among
these addresses; they need Search Console's example list.

## Still open

- Tony accepts the Sanity invite (sent 2026-11-04 to tony@tonygreenberg.com).
- Remove the two leftover sitemap entries from Search Console (needs a yes).
- `tonygreenberg.manus.space` still answers (sends `X-Robots-Tag: noindex, nofollow`, so Google
  doesn't index it); it goes away with the Manus project.
- Delete the tonygreenberg Manus project and database (owner's yes, in the Manus account). Data
  verified in Supabase 2026-11-04, safe to delete. Keep
  `clarisseart` and `fix-ai-pricing` until the two essays stop linking to them.
