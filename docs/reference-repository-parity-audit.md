# Reference Repository Parity Audit

## Comparison Scope

This audit compares the active **Next.js 16 App Router** project with the private
`RRTONY/tonygreenberg` reference repository. The reference is a React/Vite/Express
application; it is a source of real content, routes, components, and design intent, not a
framework template to copy directly.

| Surface                     |      Reference repository |            Active project | Decision                                                                                                        |
| --------------------------- | ------------------------: | ------------------------: | --------------------------------------------------------------------------------------------------------------- |
| Declared application routes |                       197 |           141 page routes | Review the 59 reference-only candidates by behavior, not by count alone.                                        |
| Page and feature components | 183 pages, 109 components | 141 pages, 169 components | Preserve existing Next.js feature components; do not import Vite/Wouter components directly.                    |
| Reference-only candidates   |                        59 |                         — | 33 are already handled by canonical Next.js redirects; 26 need explicit retain, rebuild, or redirect decisions. |

## Route Decisions

The active project already replaces 33 reference-only paths with server-side canonical redirects.
Those include duplicate assessment aliases, the consolidated Attention Theft sections, legacy
supplier-intake routes, the old Manifesto path, spam-confrontation paths, and legacy content
aliases. These redirects are intentional improvements over client-side `window.location.replace`
behavior because they work without JavaScript and preserve a single canonical URL.

| Remaining reference-only route group                                 | Current assessment                                                                                 | Required treatment                                                                                                                                                                      |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/medicine-sequencing`, `/ecosystem-map`                             | Public reference experiences with no direct Next.js page equivalent found in the route map.        | Ported into existing Next.js PRI and assessment feature areas using shared components, current routes, secure cookie-backed progress, and focused tests.                                |
| `/clock-keeper-part-2`                                               | Public response form with custom authentication and a tRPC submission/count backend.               | Rebuild only with a managed-database response table, a validated server route, explicit consent, spam protection, and tests; do not present a success state until persistence succeeds. |
| `/skippy`                                                            | Personalized public site compass that contains stale routes and uses browser `localStorage`.       | Rebuild only after each destination is verified or replaced; reuse the managed visitor-state route rather than browser storage and remove references to deferred workflows.             |
| `/pri-research`                                                      | Admin-only legacy research dashboard using custom authentication, tRPC, and calibration records.   | Defer until managed Google OAuth, admin roles, approved research-data access, and export authorization are implemented.                                                                 |
| `/fauxtony`, `/shared-chat/:shareId`, `/my-highlights`, `/my-impact` | Conversation and user-history features tied to the legacy custom-auth, OpenAI, and tRPC services.  | Defer until managed Google OAuth and a separately approved conversation-data architecture are in place. Do not fabricate chat history or copy unavailable credentials.                  |
| `/friend-gate`, `/friend-survey/:token`, `/post-intervention`        | Legacy workflows depend on tRPC mutations, email relays, browser storage, and server-side polling. | Rebuild only as a dedicated approved feature with managed-database tables, server routes, secure cookies, validation, and tests.                                                        |
| `/shop`, `/subscribe`, `/payment-success`, `/payment-cancel`         | Stripe and billing paths from the reference application.                                           | Keep deferred until the separate billing phase; the active project intentionally has no live checkout.                                                                                  |
| `/admin/*`, `/analytics`, `/edit/frqncy`                             | Internal administrative or beta-authoring surfaces.                                                | Exclude from the public migration until approved roles and managed Google OAuth are implemented.                                                                                        |
| `/` and `/404`                                                       | Framework routing differences.                                                                     | The active root page and `not-found` boundary already serve their Next.js equivalents.                                                                                                  |

## Style and Component Findings

The active project already contains established feature areas for blog, assessments, BrewSoul,
HumanOS, Kava, marketing, PRI, and shared UI. New parity work must reuse those areas and the
existing Lucide-based icon system. Images must use `next/image`; internal navigation must use
`next/link`; persistent state must remain server-managed through cookies and the managed database.

The reference project itself lists incomplete assessment theming and missing next-step links as
known gaps. They are not evidence of an active-project regression and should not be copied as
unfinished behavior. Any new visual port must first be compared with the active page at desktop
and mobile sizes.

## Deployment Finding

The failed production deployment built the Next.js application successfully, then attempted to
upload a Vite-style `/usr/src/app/dist/public` directory. The project now uses Next.js standalone
output and a server-owned Docker runtime that copies `.next/standalone`, `.next/static`, and
`public`; the deployment contract test rejects a `dist/public` uploader path. The build must be
re-attempted from a checkpoint that includes this Dockerfile because the reported failing build
predates the repair.

## Next Actions

The next implementation pass will first fix the deployment contract. It will then inspect the
five self-contained public feature candidates listed above and port only verified, compatible
functionality into existing Next.js feature folders with focused tests and visual validation.
