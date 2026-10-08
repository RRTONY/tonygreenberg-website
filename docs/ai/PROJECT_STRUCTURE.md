# Project Structure

Where everything in this repo lives. Rules are in [`/CONTRIBUTING.md`](../../CONTRIBUTING.md);
how to handle a request is in [`TASK_GUIDE.md`](TASK_GUIDE.md). Last checked 2026-09-29.

## At a glance

- **App:** Next.js 16 App Router (TypeScript), Tailwind CSS v4 + shadcn/ui, deployed on Netlify
  (`@netlify/plugin-nextjs`). Default branch: `main`. Package manager: pnpm.
- **Content:** Sanity (project `a3q1cyqs`, dataset `production`), Studio embedded at `/studio`.
- **Status:** mid-migration from a legacy Manus-hosted Vite/Express app. tonygreenberg.com's DNS
  still points at the legacy app until cutover (Phase 14 of `NEXTJS-MIGRATION-TODO.md`).

## Top-level folders

| Path | What it is |
| --- | --- |
| `src/app/` | Every route: `src/app/<route>/page.tsx`. API routes in `src/app/api/` |
| `src/components/` | Shared components, grouped by section (`blog/`, `brewsoul/`, `kava/`, `pri/`, `assessments/`, `marketing/`, ...). `ui/` is shadcn-generated, don't hand-edit |
| `src/lib/content/` | Typed content/data modules: quizzes, scoring, encyclopedias (BrewSoul, PRI, Kava), charity/peptide data |
| `src/lib/sanity/` | Sanity read client + `sanityFetch()`, GROQ queries, image URL builder, server-only write client |
| `src/lib/admin/` | The MCP server (see below). Off-limits to MCP edits |
| `src/sanity/schemas/` | Sanity schema types (`post`, `author`, `category`, `page`, `pageSeo`, `seo`, `siteSettings`, `redirect`) |
| `src/proxy.ts` | Next.js 16 proxy (was middleware): visit-count cookie + Supabase session refresh. Fails open |
| `scripts/` | One-off Node scripts (blog migration, image rescue, backfills), plus `build-migration-status-report.py`, which regenerates `Migration-Status-Report.xlsx` (the team's spreadsheet copy of `NEXTJS-MIGRATION-TODO.md`; never edit the spreadsheet by hand, re-run the script after updating the todo file) |
| `docs/ai/` | These notes |
| `_legacy-manus-app/` | The old app's source, kept only as the porting reference. Not built or deployed |
| `NEXTJS-MIGRATION-TODO.md` / `ROUTES-INVENTORY.md` | Migration checklist and legacy-file → new-route map |

## Where each page's text lives

- **Marketing, assessment, BrewSoul, PRI, Kava, peptide pages:** in code, in the route's
  `page.tsx`, its component under `src/components/`, and/or a data module in `src/lib/content/`.
- **Blog posts (`/blog/[slug]`, `/blog/category/[slug]`, `/essays`):** Sanity `post` documents.
  Since 2026-10-07 the blocks around each essay are Sanity fields too ("Essay extras" tab in
  Studio): format tag, validity, editor's note, provenance note switch, Before you read, The
  Lesson, Next steps, Voices, Also involves, Since this was written, Try this, Where this leads,
  riddle, Go deeper, video moment, "The thread continues" picks (`readNext`), byline override and
  the optional "Updated for today" second version (`updatedBody`). Still in code: per-category
  Further Reading (`lib/content/further-reading.ts`), series (`lib/content/essay-series.ts`),
  The Mirror reflections (`lib/content/mirror-data.ts`, shared with the quiz), legacy's
  Previous/Next order (`lib/content/post-order.ts`) and the Elixir product block
  (`components/blog/elixir-collection.tsx`). Link to a post with `postHref(slug)` and pass
  Sanity-stored hrefs through `resolveInternalHref()` (`lib/content/post-redirects.ts`), so
  posts that moved (e.g. the Akbar essay → `/akbar`) are linked directly, not through a redirect.
- **Live-only pages** (on the live site but not in `_legacy-manus-app/`, listed at the end of
  `ROUTES-INVENTORY.md`): e.g. `/america-unbundled-field-guide`, text in its `page.tsx`, the
  question form in `src/components/america-unbundled/`.
- **Page titles/descriptions:** each route's `metadata`/`generateMetadata` export. Blog posts use
  their Sanity `seo` field.

## Shared site pieces

| Piece | File |
| --- | --- |
| Header / nav | `src/components/site-header.tsx`, menu data in `src/components/site-nav-data.ts` |
| Footer | `src/components/site-footer.tsx` |
| "Request an AI summary" logo tiles (blog posts + footer; also the share bar's Ask AI menu) | `src/components/ai-summary-links.tsx`: always links the production domain |
| Page chrome wrapper | `src/components/site-chrome.tsx` |
| Search | `src/components/search-modal.tsx` (header pop-up), `src/components/search/site-search.tsx` (`/search` page, filter chips), `src/lib/search-engine.ts`, `src/app/api/search/` (`?all=1` adds coffees and charities) |
| JSON-LD | `src/lib/structured-data.ts` |
| Post dates (one formatter, fixed time zone) | `src/lib/format-post-date.ts` |
| Essay page (`/blog/[slug]`) | `src/app/blog/[slug]/page.tsx`; body rules `lib/sanity/legacy-body.ts` + `lib/sanity/essay-body.ts` (anchors, pull quote, GemSpark card, breaks), renderer `lib/sanity/portable-text.tsx`, fonts `lib/fonts/essay-fonts.ts` (loaded on essays only), Contents sidebar `components/blog/article-toc.tsx`, version switch `components/blog/essay-version.tsx`, closing blocks `components/blog/post-closing.tsx` |
| Essay engagement (Discourse comments, reactions, Rate this thinking, Micro-commitment, Ask Tony) | `components/blog/engagement/`, server actions `src/app/blog/[slug]/engagement-actions.ts`, tables in `supabase/migrations/0002_blog_engagement.sql` (comments and Ask Tony email Tony via Resend) |
| "Keep going" strip above the footer (every page) | `src/components/where-next.tsx`, data `src/lib/content/where-next.ts` |
| Daily Provocation on `/the-letter` (today's line, Share, search past ones) | `src/components/marketing/daily-provocation.tsx`, archive `src/lib/content/daily-provocations.ts` (newest first; add new lines at the top) |
| Live's editorial look on marketing pages (narrow column, short red divider) | `src/components/marketing/editorial-divider.tsx`, used by `/invest`, `/amplifier`, `/diamond-cut`, `/the-letter` |
| Member accounts (Supabase Auth, email + password) | `src/app/(auth)/` (login, signup, forgot/reset password, `actions.ts`), `src/app/auth/callback/`, `src/lib/auth.ts` (`getUser`, `requireUser`, `isAdmin` via `ADMIN_EMAILS`) |
| Member features (Supabase tables in `supabase/migrations/0001_member_features.sql`) | `/my-highlights` (+ `components/blog/highlight-save-button.tsx`), `/my-impact` (`lib/referrals.ts`), `/clock-keeper-part-2`, `/post-intervention`, `/friend-gate` + `/friend-survey/[token]` (`lib/friend-gate.ts`, email via `lib/email.ts` / Resend), `/pri-research` (admin; `lib/pri-research.ts`), password-gated essays (`lib/gated-posts.ts`) |
| Theme (light/dark via `.dark` class) | `src/components/theme-provider.tsx`, tokens in `src/app/globals.css` |
| Redirects | `next.config.ts` `redirects()` |
| Error pages | 404: `src/app/not-found.tsx` (title) + `src/components/not-found-redirect.tsx` (live's 3-second redirect home); page errors: `src/app/error.tsx` (inside the header/footer, "Try again" re-fetches); root layout failures: `src/app/global-error.tsx` (own `<html>`, no header). Never add a `loading.tsx` above a dynamic route (404s become 200s) |
| Essay archive on `/` and `/blog` (search, category filters, Show all) | `src/components/blog/home-archive.tsx`; the page sends 12 posts (`summarizeArchive`, `src/lib/content/essay-archive.ts`), the full list is the static `/essays-archive.json` (`src/app/essays-archive.json/route.ts`), loaded on first use |
| Homepage "Recent Updates" band | `src/components/marketing/recent-updates.tsx`, topic pills and `pickRecentUpdatePosts` in `src/lib/content/recent-updates.ts` |

## API routes (`src/app/api/`)

| Route | What it does |
| --- | --- |
| `subscribe/` | Newsletter signup → Kit (ConvertKit) |
| `search/` | Site search |
| `revalidate/` | Sanity webhook → tag revalidation |
| `mcp/`, `mcp/[token]/` | The MCP server for AI tools (below) |
| `oauth/{register,authorize,token}/` | The MCP server's sign-in (OAuth) endpoints; the sign-in page itself is `src/app/oauth/authorize/`, the metadata `src/app/.well-known/` |

## MCP server (`src/lib/admin/`)

Lets Claude Code / Claude Desktop / Claude.ai edit this repo's code (as a GitHub PR on an
`admin/mcp-*` branch) and Sanity content (drafts only), and read Google Analytics, Search Console
and Lighthouse data (`ga4-client.ts`, `gsc-client.ts`, `lighthouse-check.ts`). Full notes:
[`project_mcp_server.md`](project_mcp_server.md).

## Outside the repo (can't be changed by editing files here)

- Netlify site settings and env vars, DNS for tonygreenberg.com
- Sanity project settings / API tokens (content itself is editable via MCP, as drafts)
- Supabase project (not provisioned yet, Phase 2), Kit newsletter account
