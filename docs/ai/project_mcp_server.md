# MCP server (`/api/mcp`)

Added 2026-09-29. Ported from ramprate-ui's admin MCP server (`src/lib/admin/`,
`src/app/api/mcp/`), cut down to its core. There is **no admin page or chat UI**. AI tools
(Claude Code, Claude Desktop, the Claude.ai org connector) connect straight to `/api/mcp`, and
their own agent loop drives the tools.

History: an earlier, smaller version was built 2026-09-09 and removed 2026-09-10 (Phase 11 in
`NEXTJS-MIGRATION-TODO.md`). Rebuilt on the owner's request on 2026-09-29, this time with ramprate's
per-person roles and rules gate.

## How it works

- **Code edits** go through GitHub's REST API (`github-client.ts`, plain `fetch`) to one branch
  named `admin/mcp-<date>-<random>`, never straight to `main`. The PR opens automatically on the
  first commit. Every call finds "the pending change" by asking GitHub for an open `admin/mcp-*`
  PR (stateless, so it runs fine on Netlify Functions), which means one edit is in flight at a time.
- **Sanity edits** are always saved as `drafts.<id>` (`sanity-content.ts`, using the server-only
  write client). Only the types in `SANITY_EDITABLE_TYPES` (`guardrails.ts`) are allowed.
- **Going live = `publish_changes`**: merges the PR (squash) and publishes the pending Sanity
  drafts. It refuses while the PR's checks (the Netlify deploy preview) are pending or failing.
- **Rules gate:** `get_project_rules` returns `AGENTS.md` first (the entry point and must-follow
  summary), then `CONTRIBUTING.md` (full rules), plus `docs/ai/TASK_GUIDE.md`,
  `docs/ai/PROJECT_STRUCTURE.md` and the `docs/ai/` note list, all read from `main`. It also returns
  a `rulesVersion` (a hash of both files' git blob shas, cached 5 minutes), so editing either file
  changes it. Every tool that changes something needs `rules_version` set to that value and
  refuses to run without it, with a stale one, or if the rules can't be loaded. This is a hard
  gate because some clients ignore server instructions.
- **Guardrails:** `guardrails.ts` denylists `.env*`, `package.json`, `pnpm-lock.yaml`,
  `pnpm-workspace.yaml`, `netlify.toml`, `.mcp.json`, `.github/`, `src/proxy.ts`,
  `src/lib/admin/`, `src/lib/sanity/write-client.ts` and `src/app/api/mcp/`. `package.json`,
  `netlify.toml`, workflow files and `src/proxy.ts` can be read but not written. The GitHub
  owner/repo (`RRTONY/tonygreenberg-website`) is a hardcoded constant, never a parameter.
- **GitHub only when needed:** a call only looks up the pending branch/PR when its tool actually
  needs GitHub, so `sanity_*`, `seo_check_page` and `check_code_quality` still work without
  `GITHUB_TOKEN`. (ramprate-ui resolves it on every call.)

## Tools

| Tool | Role needed | Rules-gated |
| --- | --- | --- |
| `get_project_rules`, `list_pending_changes` | read | |
| `github_list_dir`, `github_read_file` | read | |
| `check_code_quality` (ESLint + CONTRIBUTING.md house-rule patterns) | read | |
| `check_pr_status`, `get_check_log_excerpt` | read | |
| `seo_check_page` (live site's title/meta/canonical/OG/H1/JSON-LD) | read | |
| `sanity_query`, `sanity_get_document` | read | |
| `github_write_file`, `github_write_binary_file`, `github_delete_file` | edit | yes |
| `sanity_patch_document`, `sanity_create_document` | edit | yes |
| `publish_changes` | write | yes |

Not ported from ramprate-ui on purpose: OAuth sign-in (the `/oauth/authorize` page, `/.well-known`
metadata), Lighthouse, GA4/Search Console, ClickUp, Slack, email, PDF reports, and the ChatGPT/MCP
Apps widget. Prettier formatting is also left out, because this repo doesn't use Prettier.

## Env vars (set in Netlify's dashboard, not just `.env.local`)

| Var | Purpose |
| --- | --- |
| `GITHUB_TOKEN` | Fine-grained PAT scoped to `RRTONY/tonygreenberg-website` only: Contents + Pull requests read/write, Actions + Commit statuses read |
| `SANITY_API_TOKEN` | Must be an **Editor** token for the Sanity write tools (already used by scripts) |
| `MCP_ADMIN_USERS` | JSON array, one entry per person: `[{"name":"...","email":"...","role":"read\|edit\|write","token":"<openssl rand -hex 32>"}]`. Tokens must be 32+ chars. Remove someone by deleting their entry and redeploying. Without this var, `/api/mcp` returns 500 (only that route is affected) |
| `MCP_SITE_ORIGIN` | Optional. The origin `seo_check_page` fetches. Until DNS cutover, set it to the Netlify site URL, because tonygreenberg.com still serves the legacy app. Don't repoint `NEXT_PUBLIC_SITE_URL` for this, since it also drives canonical URLs |

## Connecting

- **Claude Code:** `claude mcp add --transport http tonygreenberg-admin <site-origin>/api/mcp
  --header "Authorization: Bearer <your token>"`. A team-wide `.mcp.json` (URL only, no token) can
  be committed once the production URL is settled.
- **Claude Desktop / Claude.ai Team org connector:** custom connector, URL `<site-origin>/api/mcp`,
  header `Authorization: Bearer <token>`. Give an org connector its own `MCP_ADMIN_USERS` entry.
- **Client with no header support:** `<site-origin>/api/mcp/<token>`. Prefer the header route,
  because URLs end up in logs.

## Verified (2026-09-29, local dev server)

401 with no or bad token; 405 on GET; `initialize` returns the server info and instructions;
`tools/list` shows 16 tools for a write user and 10 for a read user, with `rules_version`
required on the 6 gated tools; a read user calling a write tool is refused; the token-in-URL route
works; `check_code_quality` flags an inline style, `<img>` and a Manus URL; `sanity_query` returns
live data; `seo_check_page` fetches the live site; gated tools refuse when the rules can't be
loaded. **Not yet verified:** the GitHub flow end to end (branch → PR → checks → merge), because no
`GITHUB_TOKEN` was available locally. Do that against a real PR before relying on
`publish_changes`.
