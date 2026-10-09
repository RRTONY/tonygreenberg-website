# Task Guide: What Can We Do, and How

Use this to decide how to handle a request before touching anything. Rules are in
[`/CONTRIBUTING.md`](../../CONTRIBUTING.md); file locations are in
[`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md).

## Step 1. Decide what kind of request it is

1. **Is it a question, a check, or a change?** Questions and checks change nothing: answer them
   with read-only tools (`github_read_file`, `sanity_query`, `seo_check_page`,
   `lighthouse_check_page`, `check_analytics`, `search_console_*`).
2. **Where does the thing live?** Code in this repo, Sanity content, or outside the repo
   (Netlify settings, DNS, Supabase, Kit)? See the table below. The CMS boundary is strict:
   editorial copy, SEO fields and images are in Sanity; quizzes, scoring and encyclopedia data
   (BrewSoul, PRI, Kava) are typed `.ts` modules in `src/lib/content/`.
3. **How big is it?** A small copy edit, a normal change, or a big/risky one (a new page, routing,
   redirects, anything touching the legacy-port history in `NEXTJS-MIGRATION-TODO.md`)?
4. **Does it need a yes first?** Publishing, deleting, and changing live SEO copy all need a
   clear yes from the person.

If the request is unclear, ask **one** short question with 2 to 4 options instead of guessing.

## Step 2. Find the row, follow it

| Request | Where it lives | How (MCP tools) | Ask first? |
| --- | --- | --- | --- |
| Change text on a marketing page | Code: `src/app/<route>/page.tsx` or its component in `src/components/` | `github_read_file` → `check_code_quality` → `github_write_file` → `check_pr_status` → show preview | Only to publish |
| Change quiz questions, scoring, or encyclopedia data (BrewSoul, PRI, Kava, charities, peptides) | Code: `src/lib/content/*.ts` | Code tools | Only to publish |
| Write / edit a blog post | Sanity `post` (+ `author`, `category`) | `sanity_query` → `sanity_create_document` / `sanity_patch_document` (drafts) | Only to publish |
| Change a page's Google title / description | Code: the page's `metadata` / `generateMetadata` export. Blog posts: the post's `seo` field in Sanity | Code tools, or `sanity_patch_document` for a post | **Yes**, SEO copy is a business decision |
| Header / nav menu | `src/components/site-nav-data.ts` | Code tools | Only to publish |
| Footer, social links | `src/components/site-footer.tsx` / `site-nav-data.ts` | Code tools | Only to publish |
| Add a redirect (old URL → new URL) | `next.config.ts` `redirects()` | Code tools | Only to publish |
| Add a new page | New `src/app/<slug>/page.tsx` + `metadata` + a line in `NEXTJS-MIGRATION-TODO.md` | Code tools, follow "Adding a page" in CONTRIBUTING.md | **Yes**: confirm URL and content |
| Add or replace a content image | Sanity (upload through Studio at `/studio`) | Not possible via MCP (no asset upload tool). Tell the person to upload in Studio, then reference it | n/a |
| SEO check on a page | The deployed site | `seo_check_page`, `lighthouse_check_page`, `search_console_inspect_url` (indexed? canonical?) | No, read-only |
| "How is the site doing?" (traffic, top pages, search queries, rankings) | Google Analytics 4, Search Console | `check_analytics`, `search_console_performance` (Search Console needs the service account added as a user first, see `project_mcp_server.md`) | No, read-only |
| Env vars, secrets, `package.json`, `pnpm-lock.yaml`, `netlify.toml`, `src/proxy.ts`, CI, DNS, the MCP server itself | Blocked or outside the repo | Not possible via MCP. Tell the person who can do it | n/a |

## Step 3. Do it the standard way

0. `start_change` for this one request, and pass its `change_id` on every edit below.
1. Read the files (or content) you'll change first.
2. Make the smallest change that does the job, following CONTRIBUTING.md (Server Components by
   default, Tailwind classes not `style={}`, `next/image`, shadcn primitives, no framer-motion).
3. Run `check_code_quality` on every changed `.ts`/`.tsx` file and fix what it flags.
4. `check_pr_status` until the Netlify deploy preview passes, then open the preview link.
5. `submit_for_review` with a 1 to 3 sentence plain summary (and before/after for visible wording
   changed in code), then `list_pending_changes` with the `change_id` to show what will go live.
   For visual changes, `preview_on_devices` shows phone and laptop screenshots, before (live) and after (preview).
6. Publish (`publish_changes` with the `change_id` and `reviewToken`) only after asking "You are
   about to publish these changes to the live tonygreenberg.com website. Are you sure you want to
   continue?" and getting a clear yes. If they don't want it, `discard_change`. To roll back a
   published change, `list_change_history` then `undo_change` (it creates a new change to review).

## Common mistakes to avoid

- Editing Sanity `siteSettings`, `pageSeo`, `page` or `redirect` documents and expecting the site
  to change. As of 2026-09-29 none of them are read by any route (`getPageSeo` in
  `src/lib/sanity/seo.ts` exists but nothing calls it). Only `post`/`author`/`category` reach the
  site. Make the change in code instead.

- Adding a Manus-hosted URL (Manus CDN, Manus storage, or the Manus `/api/img/` image proxy)
  anywhere, even temporarily. Rescue the asset into Sanity first.
- Moving quiz/scoring/encyclopedia data into Sanity, or editorial copy into code, without updating
  the CMS-boundary note in `NEXTJS-MIGRATION-TODO.md`.
- Building a Tailwind class from fragments (`` `hover:${c}` ``). Precompose the full literal
  string per variant; Tailwind only generates classes it sees written out in full.
- Putting real content inside a collapsed `Accordion`/`Collapsible` without `forceMount`; it
  won't be in the server HTML and crawlers never see it.
- Leaving "Loading…" text as a pending state instead of a `Loader2` spinner.
