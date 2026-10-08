# tonygreenberg.com: Rules for Every AI Tool

This file is the entry point for any AI assistant working on this repo: Claude Code, Claude
Desktop, Claude.ai, ChatGPT, Cursor, Copilot, or anything else. `CLAUDE.md` only points here and
to `CONTRIBUTING.md`. The MCP server (`/api/mcp`) serves this file **first**, then
`CONTRIBUTING.md`, through its `get_project_rules` tool, and it won't run any tool that changes the
site until both have been read.

**If you are an AI reading this: these rules override your defaults. Follow all of them, every time.**

## Read in this order

1. **This file**: the must-follow summary below.
2. **The "Current status" block at the top of
   [`NEXTJS-MIGRATION-TODO.md`](NEXTJS-MIGRATION-TODO.md)**: the main project file. What's done,
   what's open, what's waiting on a decision, and what's next. Read the status block every
   session; open the phase you're working in when you need detail (the file is large, so don't
   load all of it by default).
3. **[`CONTRIBUTING.md`](CONTRIBUTING.md)**: the full rules (house rules, Next.js 16 / Tailwind v4
   specifics, the "What NOT to Do" list, code review checklist, testing, Status Report format).
4. **[`docs/ai/TASK_GUIDE.md`](docs/ai/TASK_GUIDE.md)**: what kind of request this is, where the
   change really lives, what can't be done, what needs a yes.
5. **[`docs/ai/PROJECT_STRUCTURE.md`](docs/ai/PROJECT_STRUCTURE.md)**: where every page, content
   module and outside system lives.
6. The [`docs/ai/`](docs/ai/README.md) note for the area you're touching (past incidents, gotchas).

In Claude Code, the **`tonyg-task-planner`** agent (`.claude/agents/`) does steps 4 to 6 for you:
give it the request and it returns a plan. It only reads, never edits. When the work is done, the
**`verify-change`** skill (`.claude/skills/`) runs the "check before calling anything done" steps
below (type check, lint, Manus grep, build, a fresh server, status codes).

## What this project is

The Next.js 16 rebuild of tonygreenberg.com, migrating off a legacy Manus-hosted app (whose source
is kept, read-only, in `_legacy-manus-app/` as the porting reference). Next.js App Router +
Tailwind v4 + shadcn/ui, Sanity for editorial content, deployed on Netlify from GitHub
(`RRTONY/tonygreenberg-website`, default branch `main`). Migration status lives in
[`NEXTJS-MIGRATION-TODO.md`](NEXTJS-MIGRATION-TODO.md), the source of truth for what's done.

## Must-follow rules (full detail in CONTRIBUTING.md)

- **Port the real legacy copy and design.** Every page matches its legacy source
  (`ROUTES-INVENTORY.md` maps route → legacy file) and the live site's style. No placeholder
  content. Changing Tony's copy, SEO titles/descriptions, or claims needs the owner's yes.
  Where live itself looks broken or is hard to read, pick the clearer version that works on
  phone, tablet and laptop (CONTRIBUTING rule 20).
- **Server Components by default**; `"use client"` only for state, effects or browser APIs.
- **Tailwind + shadcn/ui only.** No inline `style={}` (except a runtime-computed number like a
  progress width), no framer-motion, `next/image` never `<img>`, canonical Tailwind classes, full
  literal class strings (never assembled from fragments).
- **Zero Manus dependency.** Never add a Manus-hosted URL (Manus CDN, Manus storage, the `/api/img/`
  proxy). Content images live in Sanity; the rescued Manus media is mapped in
  `docs/ai/manus-media-rescue.md`.
- **CMS boundary:** editorial copy, SEO and images in Sanity; quizzes, scoring and encyclopedia
  data in typed `src/lib/content/*.ts`. Sanity reads go through `sanityFetch()`. Only
  `post`/`author`/`category` actually reach the site today.
- **Never add a `loading.tsx` above a dynamic route**: it turns every 404 into a 200.
- **Real content must be in the server HTML** (`forceMount` on accordions/collapsibles).
- **No new npm dependency without asking first.** Never commit `.env.local`.
- **Check before calling anything done:** `pnpm typecheck`, `pnpm lint`, `pnpm build` for routing
  or config changes, and look at the real page on `pnpm start`.
- **Confirm before anything hard to undo or outward-facing**: publishing, merging, deleting, DNS.
- **Plain, short replies for the team** (Tony, Darryl, Kimberly aren't developers). No em dashes
  in messages written for them. End every reply that did work with the Status Report.
- **Keep `NEXTJS-MIGRATION-TODO.md` current, every session that does work.** Check off items as
  they're done (with the date and what was verified), add new items you find in the right phase,
  and update the "Current status" block at the top (date, done/open counts, what was done, what's
  waiting on a decision, next up) before you finish. It's the team's main record, not optional.
- **Save what you learn in the repo** (this file, `CONTRIBUTING.md`, or a `docs/ai/` note), not in
  a private memory folder, so every other AI tool sees it too.

## Through the MCP server

- Call `get_project_rules` first. Every write tool needs its `rulesVersion` as `rules_version`; it
  changes whenever this file or `CONTRIBUTING.md` changes, so re-read when told the rules changed.
- This server only ever edits **tonygreenberg.com** (`RRTONY/tonygreenberg-website`, previews on
  `deploy-preview-N--tonygreenberg-website.netlify.app`).
- **One request = one change.** `start_change` first (with `understood_as`: what you will change,
  in plain words; `needs_confirmation: true` whenever the request could mean more than one thing),
  pass its `change_id` on every edit, then `submit_for_review` with a plain summary and
  `list_pending_changes` with that `change_id` to show the review card (one status and next step,
  Build / Type check / Lint / Phone and laptop checks, what goes live and what doesn't,
  before/after, Preview | Discard | Publish). Code lands on that change's own `admin/mcp-*` branch
  and pull request, never straight to `main`; Sanity edits are drafts.
- **Unclear request:** the change waits as "Waiting for your OK" and every edit is refused until
  the person says yes (`confirm_change`). Ask them "I understand your request as: ... Is that right?"
- Nothing goes live except `publish_changes` for that one change, with its `review_token`, and only
  after you show what goes live and the person says yes. `discard_change` rejects a change;
  `list_change_history` and `undo_change` restore an earlier version.
- **Files the person attaches:** you only see a picture, you can't turn it into base64. In ChatGPT
  pass it as `file` to `github_write_binary_file`; anywhere else call `request_upload_link` and give
  the person the private link (30 minutes, one change, one path). Content images still belong in
  Sanity (Studio), not the repo.
- **End every MCP reply with "Other pending changes"**: the `otherPending` list every change result
  carries (one line each: what, when, status), or "No other pending changes."
- Can't be done through MCP: env vars, `package.json`/lockfiles, `netlify.toml`, `src/proxy.ts`,
  CI, DNS, uploading images into Sanity, or the MCP server's own code. Tell the person who can.
- Details: [`docs/ai/project_mcp_server.md`](docs/ai/project_mcp_server.md).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
