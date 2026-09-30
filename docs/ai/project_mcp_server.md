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
  `docs/ai/PROJECT_STRUCTURE.md`, the "Current status" block of `NEXTJS-MIGRATION-TODO.md` (the main project file; only that block, as `migrationStatus`, since the whole file is ~200 KB) and the `docs/ai/` note list, all read from `main`. It also returns
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

## Sign-in (OAuth 2.1, added 2026-09-30)

Ported from ramprate-ui's `mcp-oauth.ts` so a team member connects Claude.ai, Claude Desktop or
ChatGPT by just adding `<site-origin>/api/mcp` and signing in, with no token to copy.

- **Stateless:** no database. Every client id, sign-in code, access token and refresh token is an
  HMAC-signed blob (`tgmcp_client.*`, `tgmcp_code.*`, `tgmcp_at.*`, `tgmcp_rt.*`), each kind with
  its own key derived from `MCP_OAUTH_SECRET`. Codes and tokens are also keyed to
  `MCP_LOGIN_PASSWORD`, so changing the password signs everyone out. Every request looks the email
  up in `MCP_ADMIN_USERS` again, so removing someone cuts them off on their next request.
- **Flow:** `/api/mcp` without a token → 401 with `WWW-Authenticate` pointing at
  `/.well-known/oauth-protected-resource/api/mcp` → `/.well-known/oauth-authorization-server` →
  `POST /api/oauth/register` (dynamic registration; ChatGPT may send a client metadata URL
  instead) → the browser opens **`/oauth/authorize`** (the sign-in page: email + shared password,
  sign-in and consent in one step) → `POST /api/oauth/authorize` → redirect back with a one-time
  code (5 min) → `POST /api/oauth/token` with the PKCE verifier → access token (1 h) + refresh
  token (30 days).
- **Only real callbacks:** sign-in codes are only ever sent to claude.ai, claude.com, chatgpt.com,
  chat.openai.com or localhost (plus `MCP_OAUTH_REDIRECT_HOSTS`), so a look-alike connector can't
  use our sign-in page to collect access. The page names the app from the callback host, not from
  what the app calls itself.
- **Limits:** 8 failed sign-ins per 15 minutes per IP and per email (in memory, so it resets on a
  cold start). PKCE S256 required. The page is noindex and hides the site header/footer
  (`site-chrome.tsx`).
- Files: `src/lib/admin/mcp-oauth.ts`, `src/app/oauth/authorize/page.tsx`,
  `src/app/api/oauth/{register,authorize,token}/route.ts`,
  `src/app/.well-known/oauth-{protected-resource,authorization-server}/[[...path]]/route.ts`. All
  are on the guardrails denylist, so the MCP tools can't edit their own sign-in.
- **Verified 2026-09-30** on a local production build (19-step script): discovery, registration
  (untrusted host refused), page render, wrong password / unknown email refused without the
  password in the URL, code + state redirect, wrong PKCE refused, tokens issued, MCP initialize and
  role-filtered `tools/list` (16 write / 10 read), refresh, tampered token refused, personal token
  still working. **Not yet verified:** a real Claude.ai / ChatGPT connector against the deployed
  site (needs the env vars set in Netlify).

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

Not ported from ramprate-ui on purpose: Lighthouse, GA4/Search Console, ClickUp, Slack, email, PDF reports, and the ChatGPT/MCP
Apps widget. Prettier formatting is also left out, because this repo doesn't use Prettier.

## Env vars (set in Netlify's dashboard, not just `.env.local`)

| Var | Purpose |
| --- | --- |
| `GITHUB_TOKEN` | Fine-grained PAT scoped to `RRTONY/tonygreenberg-website` only: Contents + Pull requests read/write, Actions + Commit statuses read |
| `SANITY_API_TOKEN` | Must be an **Editor** token for the Sanity write tools (already used by scripts) |
| `MCP_ADMIN_USERS` | JSON array, one entry per person: `[{"name":"...","email":"...","role":"read\|edit\|write","token":"<optional, openssl rand -hex 32>"}]`. An email lets them sign in on `/oauth/authorize`; a token (32+ chars) is optional, for header-only apps like Claude Code. Remove someone by deleting their entry and redeploying. Without this var, `/api/mcp` returns 500 (only that route is affected) |
| `MCP_LOGIN_PASSWORD` | Shared team password for the `/oauth/authorize` sign-in page. Changing it signs everyone out |
| `MCP_OAUTH_SECRET` | Signs sign-in codes and tokens (`openssl rand -hex 32`). Without it sign-in fails; personal tokens still work |
| `MCP_PUBLIC_ORIGIN` | Optional. The origin the OAuth metadata advertises (e.g. `https://tonygreenberg.com`). Defaults to the request host, or Netlify's main URL for `*.netlify.app` requests |
| `MCP_OAUTH_REDIRECT_HOSTS` | Optional. Extra comma-separated sign-in callback hosts |
| `MCP_SITE_ORIGIN` | Optional. The origin `seo_check_page` fetches. Until DNS cutover, set it to the Netlify site URL, because tonygreenberg.com still serves the legacy app. Don't repoint `NEXT_PUBLIC_SITE_URL` for this, since it also drives canonical URLs |

## Connecting

- **Claude Code:** `claude mcp add --transport http tonygreenberg-admin <site-origin>/api/mcp
  --header "Authorization: Bearer <your token>"`. A team-wide `.mcp.json` (URL only, no token) can
  be committed once the production URL is settled.
- **Claude.ai / Claude Desktop / ChatGPT:** add a custom connector with URL
  `<site-origin>/api/mcp` and nothing else. The app opens the sign-in page; sign in with your email
  from `MCP_ADMIN_USERS` and the team password.
- **Claude.ai Team org connector with a fixed header:** `Authorization: Bearer <token>`, with its
  own `MCP_ADMIN_USERS` entry.
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
