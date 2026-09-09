# Working rules for this codebase

Read this before making changes. It's short on purpose — when it's silent on something, match the
nearest existing pattern in the repo rather than inventing a new one.

## Non-Negotiable Rules

1. **Server Components by default.** Only add `"use client"` when a component actually needs
   state, effects, or a browser API. Don't reach for it out of habit.
2. **Styling is Tailwind + shadcn/ui.** Reach for an existing shadcn primitive
   (`src/components/ui/`) before writing a new one. Need one that isn't installed yet?
   `pnpm dlx shadcn@latest add <component>` — don't hand-roll what shadcn already ships.
3. **No inline `style={}` in app code.** See the Tailwind section below for the exact scope and
   the one legitimate exception.
5. **No framer-motion.** Use CSS transitions or `tailwindcss-animate` utilities. This app doesn't
   carry that dependency on purpose (same convention as ramprate-ui) — don't reintroduce it.
6. **Multi-field forms with real validation use Formik + Yup**, not hand-rolled `useState` per
   field. A single-field form (an email input, a search box) doesn't need either — reach for them
   once a form has more than one or two fields or needs conditional/cross-field validation.
7. **Pending/loading states use a real spinner, never ellipsis text.** A button mid-submit shows
   `<Loader2 className="size-4 animate-spin" />` (lucide-react) next to its label — not
   `"Loading…"` or `"Signing in…"`. A route/section still fetching data uses the shadcn `Skeleton`
   component (see `loading.tsx`), not placeholder text. This is a house rule, not a Next.js/shadcn
   default — update it here if it ever changes, rather than drifting page by page.
8. **Images are always `next/image`.** Never a bare `<img>` tag. A new remote image host has to be
   added to `images.remotePatterns` in `next.config.ts` before it'll load — see the image rules
   below before you do that.
9. **Sanity reads go through `sanityFetch()`** (`src/lib/sanity/client.ts`), not `client.fetch()`
   directly — it tags every query so Sanity webhook-triggered revalidation (Phase 11) actually
   invalidates the right pages.
10. **`src/lib/sanity/write-client.ts` is server-only**, enforced by the `server-only` import.
    Never import it from a Client Component. Standalone Node scripts (`scripts/`) can't import it
    either — see the comment at the top of `scripts/migrate-blog-posts.ts` for why; they construct
    their own short-lived client instead.
11. **Content boundary:** editorial copy, page SEO fields, and images belong in Sanity.
    Assessment/quiz questions, scoring logic, and encyclopedia data (BrewSoul, PRI, Kava) belong
    in typed `.ts` modules in this repo — they're application logic, not articles. Don't move one
    into the other without updating `NEXTJS-MIGRATION-TODO.md`'s CMS-boundary note.
12. **Zero Manus dependency, including temporarily.** Never add a `*.manuscdn.com`,
    `/manus-storage/`, or `/api/img/` URL to config, code, or new content. If you find one while
    porting a page, that asset needs to be rescued and re-hosted in Sanity first, not proxied.
13. **A component/hook/lib file with zero real consumers is either wired in or deleted** — not
    left "for later" unless it's explicitly on-deck for a documented upcoming phase (check
    `NEXTJS-MIGRATION-TODO.md` before assuming that exception applies). See "Automated
    Enforcement" below for why this can't be left to tooling.
14. Run `pnpm typecheck` before calling a change done. `pnpm lint` too if you touched anything
    non-trivial — see "Automated Enforcement" for what it does and doesn't catch.
15. Never commit `.env.local` — it's gitignored. Add any new env var to `.env.local.example`
    (with no value) in the same change so the next person knows it exists.
16. **No new dependency without discussing it with the user first.** This applies to `package.json`
    additions of any kind — a new npm package, not just a heavy one. If a task seems to need one,
    say so and what it's for before adding it, rather than installing it unilaterally.

## Next.js (App Router, v16)

- This is Next.js 16, which has real breaking changes vs. the Next 13-15 patterns most training
  data assumes — read `node_modules/next/dist/docs/` (or `AGENTS.md`) before assuming an older
  API applies. The ones that bite most often here:
  - `params` and `searchParams` are **Promises** everywhere, including in `generateMetadata`,
    `sitemap.ts`, and `opengraph-image.tsx` — always `await` them, no sync fallback exists.
  - `middleware.ts` is `proxy.ts` now, exporting a `proxy` function, Node.js runtime only.
  - `images.domains` doesn't exist — use `images.remotePatterns` in `next.config.ts`.
- **Server Components fetch data directly** (`await sanityFetch(...)` inline in the component) —
  don't wrap a fetch in a `useEffect` unless the component is genuinely a Client Component with a
  browser-only reason to be one.
- **Every route needs `generateMetadata` or a static `metadata` export.** No page ships without a
  title/description — see "Adding a page" below.
- **Every dynamic route with a bounded set of values gets `generateStaticParams`** (see
  `app/blog/[slug]/page.tsx`) so it's actually static-generated, not rendered on every request.
- **`proxy.ts` runs on every matched request — guard anything in it that depends on config that
  might not exist yet.** It took the entire site down once already (every route 500'd) because it
  assumed Supabase env vars were set; it now no-ops if they aren't. Keep that pattern for any
  future proxy logic: fail open, not closed, when optional config is missing.

## Tailwind CSS (v4)

- **No inline `style={}` props in app code.** If a value can be a Tailwind class — including
  arbitrary-value syntax like `bg-[#6B3D99]` or `top-[13px]` — use the class, not `style`. This
  applies to everything under `src/app/`, `src/components/` (excluding `src/components/ui/`, see
  below), and `src/lib/`.
  - **The one legitimate exception:** a value computed at runtime that genuinely can't be a static
    class, because Tailwind classes are resolved at build time — e.g. `nav-progress-bar.tsx`'s
    `width: ${progress}%` driven by React state. Even then, keep the *static* parts (color,
    transition, shadow) as classes and use `style` only for the number that has to be dynamic.
  - **shadcn-generated files in `src/components/ui/` are exempt.** They're vendored primitives
    (e.g. Radix's `Progress` indicator position) — don't hand-edit them to remove a `style` prop
    the shadcn CLI generated; regenerating would just bring it back.
- **Reach for a design token before a raw color.** `brand-gold`, `brand-gold-light`, `background`,
  `foreground`, `muted-foreground`, `border`, etc. are defined in `globals.css` and mapped to
  Tailwind color utilities (`text-brand-gold`, `bg-background`, ...). A raw hex in a class (like
  `to-[#6B3D99]` above) should be rare enough that it's worth asking whether it deserves its own
  token instead.
- **Canonical class names only** — e.g. `bg-linear-to-br` not `bg-gradient-to-br`, `z-9999` not
  `z-[9999]`. The IDE will flag the non-canonical form; fix it rather than ignoring the warning.
- Dark mode is the `.dark` class (next-themes), not `prefers-color-scheme` media queries directly —
  use `dark:` variants, which Tailwind already wires to that class via `@custom-variant dark` in
  `globals.css`.

## What NOT to Do

Real mistakes caught in this repo so far, not hypotheticals:

```tsx
// ❌ → ✅
style={{ background: "linear-gradient(135deg, #8B6914 0%, #6B3D99 100%)" }}
  → className="bg-linear-to-br from-brand-gold to-[#6B3D99]"

{pending ? "Signing in…" : "Sign in"}
  → {pending && <Loader2 className="size-4 animate-spin" />}Sign in

useEffect(() => setMobileOpen(false), [pathname])              // resets state on prop change via
  → if (pathname !== prevPathname) {                           // an effect — costs an extra render
       setPrevPathname(pathname); setMobileOpen(false);         // pass; React's docs recommend
     }                                                           // adjusting state during render instead

const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])                           // mount-flag-via-effect for SSR/CSR
  → useSyncExternalStore(() => () => {}, () => true, () => false) // gating — this is exactly the
                                                                   // documented use case for it

`middleware.ts` / `params` used synchronously / `images.domains`
  → `proxy.ts` / `await params` / `images.remotePatterns`         — Next 15 muscle memory, wrong on 16

A shadcn component installed "just in case" and never imported (e.g. `carousel.tsx`) sitting
around failing lint on a rule unrelated to why it was added
  → delete it; re-add with the CLI if a page genuinely needs it later

Leftover `create-next-app` starter assets (`next.svg`, `vercel.svg`, ...) after the homepage
was replaced
  → deleted; nothing should ship that the shipped pages don't actually reference

<AccordionContent>{realContentWithLinks}</AccordionContent>          // Radix doesn't render
  → <AccordionContent forceMount>{realContentWithLinks}</AccordionContent>  // collapsed-panel
                                                                      // children into the DOM at
                                                                      // all by default — every
                                                                      // link inside was invisible
                                                                      // to crawlers until clicked
```

const styles = { tech: { border: "border-[#2563eb]" } }             // building a class from
className={`hover:${c.border}/20`}                                    // fragments at the usage
  → className={c.cardBorderHover}  // = "hover:border-l-[#2563eb]"    // site never generates real
                                                                        // CSS — Tailwind's scanner
                                                                        // needs the complete
                                                                        // literal string present
                                                                        // in source; precompose
                                                                        // every exact variant

className="border border-border border-l-4 border-[#2563eb]/30"      // an all-sides border-color
  → className="border border-border border-l-4 border-l-[#2563eb]/30"  // utility fights the base
                                                                          // border-border on the
                                                                          // other 3 sides — use a
                                                                          // directional utility
                                                                          // when only one side
                                                                          // should get the color
```

**Rule of thumb (dynamic classes):** a small, known-at-build-time set of variants (a handful of
category colors, status states) gets fully precomposed literal class strings, one full string per
variant — never assembled from fragments at the JSX usage site. Verify with a real production
build (`pnpm build`, then grep the compiled CSS under `.next/static/chunks/*.css`) when in doubt —
seeing the class name in rendered HTML is not enough proof, since a class Tailwind never scanned
still gets output as text but does nothing.

**Rule of thumb (accordion crawlability):** any `Accordion`/`Collapsible`/`Tabs`-style component holding real content
(links, copy a user should be able to find) — not just a decorative reveal — needs `forceMount`
(or the primitive's equivalent) and a quick `curl | grep` check that the content actually appears
in the raw server-rendered HTML, not just after hydration. Don't assume a shadcn primitive is
crawlable by default; verify it, the way `/journeys` was checked here.

## Automated Enforcement

What's mechanically caught vs. what needs a manual/AI check — know which is which before assuming
something's clean:

- **`pnpm typecheck`** (`tsc --noEmit`) catches type errors, including the Next.js 16
  `PageProps<'/route'>`/`LayoutProps<'/route'>` route-type mismatches — but only after
  `pnpm dev`/`build`/`next typegen` has generated route types for every current route. A brand-new
  route can show phantom type errors until one of those runs once.
- **`pnpm lint`** (ESLint via `eslint-config-next`) catches unused imports/vars within a file,
  React hook rule violations (`react-hooks/set-state-in-effect` caught two real bugs during this
  migration — see the table above), and Tailwind's canonical-class suggestions in-editor.
- **What neither catches — must be checked by hand:**
  - **A whole file with zero real consumers.** An unused *import inside* a file gets flagged; an
    entire *component/hook/lib file* nobody imports does not — ESLint has no project-wide "is this
    file's export used anywhere" rule configured here. Check with
    `grep -rl "from [\"']@/path/to/file" src` (excluding the file itself) before assuming
    something built for an earlier idea is still needed. Don't apply this to files explicitly
    built ahead of a documented, currently-active upcoming phase — check
    `NEXTJS-MIGRATION-TODO.md` before assuming that exception applies, and note that a *cancelled*
    phase (see Phase 10/Phase 11's 2026-09-10 entries) is the opposite case: code built ahead of a
    phase that then got cancelled should be removed, not kept "just in case."
  - **Content fidelity.** Nothing lints "this ported page's copy still matches the legacy
    source." That's a manual side-by-side check against the file named in `ROUTES-INVENTORY.md`.
  - **Zero-Manus-dependency.** Nothing automatically flags a new `/api/img/` or `manuscdn.com`
    reference — `grep -rn "manuscdn\|manus-storage\|/api/img/" src public` before considering a
    porting pass done.

## Audit Methodology (a11y / performance / bundle size)

When asked to fix a specific Lighthouse/PageSpeed/axe finding, or to "check accessibility" or
"check performance" generally, don't stop at the one flagged page — sweep every route and fix the
shared component causing it, not just the reported instance. A violation on `/` from a shared
`site-header`/carousel/form component is usually reproduced on every other page that renders it.

Two specific Next.js App Router pitfalls to check for, since they're easy to introduce silently:

- **A shared metadata/layout helper calling `headers()` or `cookies()` forces the *entire site*
  dynamic**, even pages with zero personalization — killing static rendering, CDN caching, and
  bfcache. First-pass check: run `pnpm build` and look at the route table — if most/all routes
  show `ƒ (Dynamic)` instead of `○ (Static)`, look for a Dynamic API call in whatever
  `generateMetadata`/canonical-URL helper every page shares. (This repo does have real, intentional
  per-request cookie reads — e.g. `returning-visitor-hero.tsx`, `/self-portrait` — so a dynamic
  route isn't automatically a bug; confirm it's actually reading personalized state before "fixing"
  it away.)
- **A barrel `index.ts` re-export can leak a heavy dependency (Formik, a crypto polyfill, etc.)
  into every page's initial JS**, even pages that never use the feature that needs it, if
  `layout.tsx` or another root-level import pulls a component through that barrel instead of
  importing it directly. If bundle size looks off, check what a shared barrel pulls in
  transitively before assuming the size is legitimate.
- **Never trust a single local Lighthouse run's Performance score** — CPU contention on a dev
  machine can swing the same unchanged build's score by 10-15 points across back-to-back runs.
  Test against a real production build (`pnpm build && pnpm start`, never `pnpm dev` — dev mode is
  always heavier and produces misleading "unused JavaScript"/bundle-size warnings) or, better,
  against the deployed Netlify site/deploy preview.

## SEO

- No SEO tooling is vendored into this repo. If Claude's current session has the `claude-seo`
  skill/agent family available (`seo`, `seo-audit`, `seo-technical`, `seo-schema`, `seo-geo`, etc.),
  use that for an actual audit rather than reinventing one inline; otherwise write metadata/schema
  by hand following this file's other rules.
- Baseline expectations for every ported page regardless: real per-page `generateMetadata`
  (title/description/OG), a canonical URL, and — for anything CMS-backed — a Sanity `seo`/`pageSeo`
  document rather than hardcoded metadata that an editor can't change without a deploy.

## Adding a page

1. Find it in `ROUTES-INVENTORY.md` / the matching phase in `NEXTJS-MIGRATION-TODO.md` — that's
   the source-of-truth mapping from the legacy `client/src/pages/*.tsx` file to the new route.
2. Port the real copy/structure from that legacy file. Don't ship placeholder content.
3. Add `generateMetadata` (title, description, OG image) — pull from a Sanity `page`/`pageSeo`
   document where the content is CMS-backed, otherwise write it statically.
4. Check the line off in `NEXTJS-MIGRATION-TODO.md`.

## Adding or changing a Sanity schema field

1. Edit the relevant file in `src/sanity/schemas/`. New type → also add it to `schemas/index.ts`.
2. `pnpm dev`, open `/studio` — schema changes hot-reload, no restart needed.
3. If the field feeds a page, update the matching GROQ query in `src/lib/sanity/queries.ts` to
   select it — Sanity queries are opt-in per field, a field that exists but isn't queried won't
   show up in `sanityFetch()` results.

## Images

- **Every content image lives in Sanity**, uploaded through Studio (`/studio`) or a script using
  the write-client pattern in `scripts/migrate-blog-posts.ts`. `public/` in this app is for
  site-chrome assets only (favicon, static brand marks that aren't editorial) — not content.
- **Minimum 1200×630 for anything used as a hero or OG image.** Sanity's `urlFor().auto('format')`
  (see `src/lib/sanity/image.ts`) serves WebP/AVIF automatically — don't pre-convert before upload.
- **Alt text is required, not optional.** Every image needs real, descriptive `alt` — it's an
  accessibility requirement and an SEO signal, not paperwork.
- **Missing images get tracked per-item, not skipped silently.** `BLOG-IMAGE-BRIEFS.md` (repo
  root) is the template: one row per item still needing a real image, with a suggested
  generation/sourcing prompt and a checkbox. Use the same pattern for any other content batch
  that's missing images (BrewSoul coffee photos, PRI facility images, etc. — see
  `NEXTJS-MIGRATION-TODO.md` Phase 13).
- **No image-generation tool is connected in this environment as of this writing.** Until one is
  (an MCP image-gen extension, or similar), source images manually or via a designer and note
  where each came from — licensing traceability matters for anything not generated from scratch.
  If a generation tool does get connected, feed it the "suggested prompt" column from the
  relevant briefs file directly.
