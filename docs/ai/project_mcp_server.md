# MCP server (`/api/mcp`)

Added 2026-09-29. Ported from ramprate-ui's admin MCP server (`src/lib/admin/`,
`src/app/api/mcp/`), cut down to its core. There is **no admin page or chat UI**. AI tools
(Claude Code, Claude Desktop, the Claude.ai org connector, ChatGPT) connect straight to `/api/mcp`,
and their own agent loop drives the tools. It only ever edits tonygreenberg.com
(`RRTONY/tonygreenberg-website`). Hosts that support MCP Apps (ChatGPT, Claude.ai) show the
review as a card (`mcp-ui-widgets.ts`, since 2026-10-09); others get the same result as JSON.

History: an earlier, smaller version was built 2026-09-09 and removed 2026-09-10 (Phase 11 in
`NEXTJS-MIGRATION-TODO.md`). Rebuilt on the owner's request on 2026-09-29, this time with ramprate's
per-person roles and rules gate.

## How it works

- **One request = one change (since 2026-10-02, ported from ramprate-ui's change sets).**
  `start_change` creates a record `adminChange.<yyyymmdd-xxxxxx>` in Sanity (type `adminChange`,
  read-only in Studio under "Website change history"; dotted ids are never public). Every edit
  passes its `change_id`. Code goes through GitHub's REST API (`github-client.ts`, plain `fetch`) to
  that change's own branch `admin/mcp-<key>`, and its PR opens on the first commit. Each Sanity
  document an edit touches is "claimed" by the change, with a copy of the live version (for
  before/after and undo); a document another waiting change owns, or one with unsaved Studio edits,
  is refused. Files: `change-sets.ts` (records, review, publish, discard, undo, history, tidy-up
  against GitHub), `change-describe.ts` (plain-language pages affected, before/after, review token,
  status labels), `mcp-tool-context.ts`, `device-preview.ts`.
- **Statuses:** Draft → Ready for review (`submit_for_review`; any later edit sends it back to Draft)
  → Published or Discarded. A change merged or closed directly in GitHub is marked to match the
  next time waiting changes are listed.
- **Sanity edits** are always saved as `drafts.<id>` (`sanity-content.ts`, using the server-only
  write client). Only the types in `SANITY_EDITABLE_TYPES` (`guardrails.ts`) are allowed.
- **Going live = `publish_changes`** for ONE change, with the `reviewToken` from its
  `list_pending_changes` review (a fingerprint of the PR's head commit plus each draft's revision):
  it refuses if anything changed after the review, if the change isn't Ready for review, or while
  the PR's checks are pending or failing, and checks everything before changing anything. It merges
  that change's PR (squash, pinned to the reviewed commit) and publishes only that change's drafts.
  Drafts made in Studio or by scripts (31 waiting for review on 2026-10-02) are listed as
  `unrelatedDrafts` and never published. (Earlier the same day it published every draft in the
  dataset; before that fix any one-line edit would have pushed all 31 live.)
- **Discard / history / undo:** `discard_change` closes the PR, deletes the branch and the change's
  drafts. `list_change_history` lists every change (who, when, what, status). `undo_change` builds a
  NEW change "Undo: …" that restores the files and documents as they were before; it refuses if
  they were changed again since, and goes live only through the normal review and publish.
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
  role-filtered `tools/list` (16 write / 10 read at the time; 22 / 16 since 2026-10-02), refresh, tampered token refused, personal token
  still working. **Not yet verified:** a real Claude.ai / ChatGPT connector against the deployed
  site (needs the env vars set in Netlify).

## Tools

| Tool | Role needed | Rules-gated |
| --- | --- | --- |
| `get_project_rules`, `list_pending_changes`, `list_change_history` | read | |
| `preview_on_devices` (phone + laptop screenshots, before = live tonygreenberg.com, after = the change's preview) | read | |
| `github_list_dir`, `github_read_file` | read | |
| `check_code_quality` (ESLint + CONTRIBUTING.md house-rule patterns) | read | |
| `check_pr_status`, `get_check_log_excerpt` | read | |
| `seo_check_page` (live site's title/meta/canonical/OG/H1/JSON-LD) | read | |
| `sanity_query`, `sanity_get_document` | read | |
| `check_analytics` (GA4: sessions, users, pageviews, top 10 pages) | read | |
| `search_console_sites`, `search_console_performance`, `search_console_inspect_url`, `search_console_sitemaps` (list only) | read | |
| `lighthouse_check_page` (PageSpeed Insights scores + top failing audits) | read | |
| `github_write_file`, `github_write_binary_file`, `github_delete_file` | edit | yes |
| `sanity_patch_document`, `sanity_create_document` | edit | yes |
| `start_change`, `confirm_change`, `submit_for_review`, `discard_change`, `undo_change` | edit | yes |
| `request_upload_link` (private 30-minute page to drop a file into one change) | edit | yes |
| `publish_changes` (one change, with its `review_token`) | write | yes |

GA4, Search Console and Lighthouse were ported 2026-10-02 (`google-auth.ts`, `ga4-client.ts`,
`gsc-client.ts`, `lighthouse-check.ts`), all read-only: unlike ramprate-ui, `search_console_sitemaps`
can't submit or delete. Still not ported: ClickUp and email (need `CLICKUP_API_TOKEN` /
`RESEND_API_KEY` and a verified sender, none set up for this site), PDF reports (a new dependency,
`@react-pdf/renderer`), `check_deploy` (Netlify API; the review already reads Netlify's build from
GitHub's checks). Prettier formatting is also left out, because this repo doesn't use Prettier.

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
| `GOOGLE_GA_CLIENT_EMAIL`, `GOOGLE_GA_PRIVATE_KEY` | Google service account for `check_analytics` and `search_console_*` (the same `vcos-ga4-reader@...` account ramprate-ui uses; its Cloud project already has the Search Console API on). Keep the key's literal `\n` escapes |
| `GA4_PROPERTY_ID_TONYGREENBERG` | GA4 property for `check_analytics` (the service account has access; verified 2026-10-02) |
| `GOOGLE_API_KEY` | PageSpeed Insights key for `lighthouse_check_page` (no anonymous quota). Restrict it to the PageSpeed Insights API. Not created yet |
| `MCP_SITE_ORIGIN` | Optional. The origin `seo_check_page` and `lighthouse_check_page` fetch. Until DNS cutover, set it to the Netlify site URL, because tonygreenberg.com still serves the legacy app. Don't repoint `NEXT_PUBLIC_SITE_URL` for this, since it also drives canonical URLs |

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

## Verified (2026-10-02, production build on localhost)

`tools/list` shows 22 tools for a write user. `check_analytics` returns real GA4 numbers (1,233
sessions in 7 days). `search_console_*` work too, since the service account was added to the
`https://tonygreenberg.com/` (URL-prefix) Search Console property on 2026-10-02: 99 clicks / 1,663
impressions in 28 days, homepage indexed, sitemap read (284 URLs, 0 errors, 82 warnings). Before
that it saw only `sc-domain:clarisseartist.com`. Search Console users are a separate list from the
Google Analytics account's users: being an Analytics admin gives no Search Console access. `lighthouse_check_page` reports the missing
`GOOGLE_API_KEY`. `seo_check_page` now decodes `&#x27;`-style entities in titles and descriptions
(it showed `Tony Greenberg&#x27;s` before). `publish_changes` refuses unknown draft ids before
touching GitHub or Sanity.

## Gotchas (from ramprate-ui's run of the same server)

- **Netlify's synchronous function limit is ~10 s on the free plan (26 s on Pro) and isn't set in
  `netlify.toml`.** A Lighthouse run takes 20 to 60 s, so `lighthouse_check_page` will likely time
  out on Netlify; it works from a long-running server. `check_pr_status` keeps its own wait under
  ~20 s for the same reason.
- **Netlify's deploy-preview check shows "pending" for about 90 s** after a push before it starts.
  Call `check_pr_status` again rather than reporting a failure.
- **Search Console access and the Search Console API being on are two separate switches.** The API
  is on in the service account's Cloud project; the per-property user still has to be added.
- **Never share one token across people** (ramprate had one leak in a screen share): one
  `MCP_ADMIN_USERS` entry per person, so removing someone is one entry.

## Verified: per-request change flow (2026-10-02, production build on localhost, real GitHub + Sanity)

One throwaway change, then discarded (`docs/mcp-flow-test.md` + a test category draft): an edit
without `change_id` is refused; `start_change` → its own branch `admin/mcp-20261001-p14pch` and PR
#2 on the first write; the category draft was claimed by the change; publish before review refused;
`submit_for_review` → Ready for review; the review showed the summary, a server-written facts line
("No other changes are included"), before/after (including the Sanity title change), and all 31
existing drafts as `unrelatedDrafts` (not included); publish with a wrong `review_token` refused;
`discard_change` closed the PR unmerged, deleted the branch and the draft; history shows it as
Discarded; publishing it afterwards refused. 28 tools listed for a write user.

**Blocker found:** the PR's `lint-changed-files` check failed, because `main` still has the old
`.github/workflows/pr-lint.yml` (Node 20, which crashes pnpm 11). The fix (Node 22 + `next typegen`)
is on the `migration/...` branch, not on `main`. Until that is merged, every MCP change fails its
site check and can't be published. Not yet exercised: a real publish and `undo_change` (they need a
passing check), and `preview_on_devices` (needs `GOOGLE_API_KEY`).

## Synced with ramprate-ui (2026-10-09)

ramprate-ui's three MCP updates since our 2026-10-02 copy (its #46, "attached files" and "Other
Pending Changes"), plus the review card we had left out, were merged in: a three-way merge per file
(base = ramprate-ui `39bc3da`, the version we copied), keeping every tonygreenberg.com difference.
`mcp-server.ts` was taken from ramprate-ui and re-adapted (our rules text, `migrationStatus`, no
`check_deploy`/ClickUp/email).

- **One status, one next step, one button row:** `reviewOutcome` in `change-describe.ts` gives each
  change a single state (Waiting for your OK, Working, Checking, Ready for review, Failed, Stuck,
  Published, Discarded) and `nextStep`. Checks are listed separately: Build and Type check
  (Netlify's preview build, which runs `next build`), Lint (the server lints the changed files
  itself, stored as `lint` on the record; errors block, warnings don't), GitHub checks (the
  `pr-lint.yml` jobs), Phone and laptop preview (optional). `getPRChecksDetail` tells Netlify's
  checks apart by the `" - tonygreenberg-website"` suffix of its check runs (`NETLIFY_RUN` in
  `github-client.ts`; must match the Netlify site name).
- **Confirm before unclear changes:** `start_change` needs `understood_as` and
  `needs_confirmation`, takes `applies_to` (both/desktop/mobile) and an optional
  `conversation_url` (chatgpt.com / claude.ai only). Unclear changes wait for `confirm_change`;
  every edit is refused until then.
- **Screenshots:** before (live `https://tonygreenberg.com`, which is the old app until DNS
  cutover) and after (the preview), phone and laptop, shown in the card (images travel in `_meta`,
  not the model's text). 45 s cap; warmed up in the background with `after()` once the build
  passes; Retry re-takes only what's missing. Works without `GOOGLE_API_KEY` at Google's low
  anonymous quota; the key raises it.
- **Attached files:** `github_write_binary_file` takes `file` (ChatGPT's attachment),
  `source_url` (public https) or `base64Content`; `request_upload_link` gives a signed 30-minute
  page at `/api/mcp/upload` for one change and one path (signed with `MCP_OAUTH_SECRET`, user
  re-checked against `MCP_ADMIN_USERS`). Size limits 4 MB (page) / 8 MB (download) and the bytes
  must match the file's extension. `binary-upload.ts`, `src/app/api/mcp/upload/route.ts`.
- **Other Pending Changes:** every change result carries `otherPending` + `otherPendingNote`, and
  the AI ends its reply with that list (CONTRIBUTING.md's Status Report has the line). New
  `conversationUrl` field on `adminChange`.
- **Lint inside the deployed function:** `next.config.ts` lists `eslint` and `eslint-config-next`
  in `serverExternalPackages` (ramprate saw "Cannot find module 'fast-glob'" live). ramprate's
  `outputFileTracingIncludes` globs are **not** used: with pnpm they match linked package folders
  and Turbopack panics ("Is a directory"). Checked in `.next/server/app/api/mcp/route.js.nft.json`:
  eslint, its config, plugins and fast-glob are all traced.
- **Card URI** `ui://tonygreenberg-admin/pending-changes-v5.html`. ChatGPT caches a card's HTML by
  URI, so bump the version whenever `mcp-ui-widgets.ts` changes.
- **Verified locally (production build, 2026-10-09, read-only calls):** 30 tools for a write user,
  the card resource is served and its script is valid JavaScript, `get_project_rules` returns
  `migrationStatus`, `list_pending_changes` returns `otherPending`, `check_code_quality` runs
  ESLint, `/api/mcp/upload` refuses a missing or bad link (401). Not yet run: a full change on a
  deploy preview (start, confirm, edit, review card, screenshots, publish/discard).
