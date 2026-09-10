# Final Release Route and Interface Audit

## Scope

This audit covers the release candidate on `manus/production-restoration-2026-09-10` after the managed-database migration, cookie-state implementation, external-service removal, and legacy icon refactor. The candidate modifies 433 files relative to the `main` branch baseline; all changes remain inside the existing Next.js 16 App Router repository.

## Route Decisions

| Route group                                |                                       Current coverage | Decision     | Reason                                                                                                                                                   |
| ------------------------------------------ | -----------------------------------------------------: | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App Router page modules                    |                                 141 `page.tsx` modules | **Retain**   | These are the existing public-site surface and build successfully.                                                                                       |
| Production route output                    |                                    509 pages generated | **Retain**   | The final production build generated every static path successfully.                                                                                     |
| Blog articles                              |                             121 managed-database slugs | **Retain**   | Real historic content was imported from repository history and is used by existing article routes.                                                       |
| BrewSoul city and coffee detail paths      |                         23 cities and 107 coffee paths | **Retain**   | Existing directories, comparisons, and detail pages consume these paths.                                                                                 |
| Charity scorecard detail paths             |                                         103 scorecards | **Retain**   | Existing public scorecard routes and static-page generation depend on them.                                                                              |
| Active route handlers                      |                                             3 handlers | **Retain**   | `/api/search`, `/api/subscribe`, and `/api/visitor-state/[namespace]` support public search, newsletter processing, and secure persistent visitor state. |
| Canonical legacy aliases                   |                                 15 permanent redirects | **Redirect** | Consolidate duplicate Community, Manifesto, Find My, discovery, index, and Cheshire-Grin URLs onto their canonical destinations.                         |
| Attention Theft legacy subpages            |                                  9 permanent redirects | **Redirect** | Preserve inbound paths by sending them to the matching anchor in the consolidated `/attention-theft` page.                                               |
| Retired supplier/vendor flows              |                                  6 permanent redirects | **Redirect** | The former back end is unavailable; routes now point to the verified external supplier intake destination rather than producing dead links.              |
| Flow Circuit route                         |                                   1 permanent redirect | **Redirect** | Preserves the established external application destination without a client-side flash.                                                                  |
| Assessment-prefix legacy aliases           |                                  3 permanent redirects | **Redirect** | Maintains existing references while retaining the shorter canonical assessment routes.                                                                   |
| Find My Car, spam, and reported routes     |                                  3 permanent redirects | **Redirect** | Keeps legacy behavior without restoring retired one-off pages.                                                                                           |
| Retired Sanity and Supabase infrastructure | CMS studio, SDK clients, proxy and migration-only code | **Remove**   | Replaced by server-only managed-database and secure cookie implementations.                                                                              |

The configured redirect inventory contains **38 permanent redirects**. All decisions are encoded in `next.config.ts`; no temporary client-side redirect components were added.

## Interface and Component Decisions

| Check                                                              | Result                                                                                             | Decision                                                                                                                                                            |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Raw `<img>` elements in active `src/app` and `src/components` code | None; the only match was a comment                                                                 | **Pass** — responsive content images use `next/image` where applicable.                                                                                             |
| Hard-coded internal `<a href="/...">` links                        | None                                                                                               | **Pass** — internal navigation uses `next/link`; external destinations remain anchors with secure attributes where required.                                        |
| Existing component reuse                                           | Existing pages, `next/link`, `next/image`, dialogs, cards, navigation, and Lucide package retained | **Pass** — no alternate UI library or duplicate navigation system introduced.                                                                                       |
| New shared UI component                                            | `src/components/ui/inline-icons.tsx`                                                               | **Intentional exception** — a small semantic wrapper around the already installed Lucide icons removed repeated raw arrow glyphs without duplicating full controls. |
| Emoji in active pages/components                                   | None                                                                                               | **Pass** — user-interface emoji were replaced with existing semantic icons.                                                                                         |
| Raw arrows in interactive controls or short rendered status labels | Blocked by `src/test/ui-symbols.test.ts`                                                           | **Pass** — the permanent test prevents regression while excluding internal delimiters and editorial prose.                                                          |

## Cleanup Decisions

| Area                                             | Decision                                                                                                  |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Retired CMS/auth code, scripts, and dependencies | Removed after reference and build checks.                                                                 |
| Static-analysis candidates                       | Removed where unreferenced; `src/test/server-only.ts` is intentionally retained through the Vitest alias. |
| Temporary codemods used for icon conversion      | Removed after the conversion and verification run.                                                        |
| Formatting, lint, type, tests, and build         | Enforced by the `pnpm quality` script and GitHub Actions workflow.                                        |

## Release Validation

The final candidate passed Prettier, ESLint, TypeScript, **11 Vitest tests**, the permanent icon-policy audit, and the Next.js production build generating **509 of 509** pages. Representative browser checks covered public, BrewSoul, assessment, editorial, cookie-backed, and high-interaction routes at desktop and mobile sizes.

## Deferred After Publication

Google OAuth remains intentionally unimplemented until after this verified core release is published. It will require Google credentials provided through secure project settings and will use the managed database with server-managed, HttpOnly session cookies.
