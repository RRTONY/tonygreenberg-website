# TonyGreenberg.com — Next.js app

This is the Next.js rebuild of tonygreenberg.com, replacing the Manus-hosted app. It lives inside the
same project as the legacy code (`../client`, `../server`, `../shared` at the repo root) so real content
can be ported directly rather than rebuilt from scratch. The legacy app stays untouched and running
until DNS cutover — see `../NEXTJS-MIGRATION-TODO.md` for the full migration plan and
`../ROUTES-INVENTORY.md` for the page-by-page source map.

## Stack

- **Next.js 16** (App Router, Turbopack) + TypeScript
- **Tailwind CSS v4** + **shadcn/ui** (Radix base) — same design-system convention used elsewhere on the team
- **Sanity** — editorial content only: blog posts, page copy, SEO metadata, images. Studio embedded at `/studio`.
- **Supabase** — auth/login, the publish-approval log, and chatbot conversation history
- **Claude API** (`@anthropic-ai/sdk`) — FauxTony chatbot backend, called server-side only via a Route Handler
- `next/image` for every image; no framer-motion — CSS transitions / `tailwindcss-animate` only

Assessment/quiz logic, scoring, and encyclopedia data (BrewSoul, PRI, Kava) are **not** Sanity content —
they stay as typed `.ts` modules in this codebase, ported from the legacy `client/src/data/` and
`client/src/pages/pri/` files.

Working rules for code changes and images live in [`CONTRIBUTING.md`](CONTRIBUTING.md) — read it
before making changes.

## Getting started

```bash
cp .env.local.example .env.local   # fill in Sanity/Supabase/Anthropic keys
pnpm install
pnpm dev
```

- `pnpm dev` — dev server at http://localhost:3000
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm lint` — ESLint
- `pnpm sanity:dev` — run Sanity Studio standalone (also reachable at `/studio` inside the app)

## Next.js 16 notes

This app was scaffolded against Next.js 16.3.1, which has real breaking changes vs. Next 13-15 App
Router conventions (see `node_modules/next/dist/docs/` and `AGENTS.md` in this folder — read before
assuming older-Next patterns apply). The ones that matter most for this codebase:

- `params`/`searchParams` are Promises everywhere, including in `sitemap.ts`/`opengraph-image.tsx` — no sync fallback.
- `middleware.ts` is renamed to `proxy.ts` (Node.js runtime only, no Edge).
- `next.config.ts`: `images.domains` → `images.remotePatterns`; `turbopack` is a top-level key; Turbopack is the default builder.
- Caching is opt-in via `'use cache'` + `cacheLife()`/`cacheTag()` from `next/cache`, not fetch-cache-by-default.
