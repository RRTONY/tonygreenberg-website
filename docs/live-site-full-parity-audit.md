# Full Live-Site Parity Inventory

## Scope and Evidence

This inventory compares the public URL set exposed by the live [`tonygreenberg.com` sitemap][1], the public reference implementation in [`RRTONY/tonygreenberg`][2], and the active Next.js App Router project. It is an implementation decision record, not a claim that every legacy service is suitable for direct migration. The live sitemap supplies the canonical indexed URL list; the reference repository supplies legacy page, component, styling, and media behavior.

> The active project remains a **Next.js 16 App Router** application. Reference Vite/React modules are design and behavior evidence only; they are not copied as a framework or runtime dependency.

| Measure                                               | Count | Interpretation                                                                                           |
| ----------------------------------------------------- | ----: | -------------------------------------------------------------------------------------------------------- |
| Indexed live sitemap paths                            |   292 | Includes public pages, static article URLs, aliases, redirects, and image endpoints.                     |
| Direct active `src/app/**/page.tsx` routes            |   144 | Does not count generated dynamic article, coffee, city, or scorecard paths individually.                 |
| Non-blog live paths without a direct active page      |    44 | Includes 9 image endpoints and 22 paths already covered by configured redirects.                         |
| Current root-level candidates requiring a disposition |    13 | Listed below and deliberately divided into aliases, safe public ports, and gated/service-dependent work. |

## Live Feature Coverage

| Area                                               | Active coverage                                                                    | Live behavior to preserve                                                                                            | Current parity disposition                                                             |
| -------------------------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Core identity, essays, journeys, clients, projects | Active Next.js pages, shared header/footer, and content repository                 | Dark editorial surfaces, cream/gold accents, serif display headings, restrained mono metadata, Four Doors navigation | Covered; inspect page-level media and copy discrepancies as part of the route batches. |
| Articles and editorial archive                     | Blog index, categories, static article pages, managed content database             | Search/filtering, reading metadata, image-led article cards, editorial hierarchy                                     | Covered by dynamic routes and the managed content repository.                          |
| Self-discovery and PRI tools                       | Assessment, Self Portrait, PRI, Facilitator, Iboga, Consciousness, and Kava routes | Multi-step flows, safety context, cookie-backed returning state, clear progression                                   | Covered by active pages and secure server-managed visitor-state namespace.             |
| BrewSoul                                           | Landing, directory, city, coffee, research, collection, and assessment routes      | Premium cream/charcoal/gold research interface, persistent progress, filters, iconography                            | Covered by active pages and cookie-backed visitor state.                               |
| Public reference parity pages                      | `/medicine-sequencing`, `/ecosystem-map`, `/skippy`                                | Sequenced exploration, destination cards, progress signaling, responsive editorial layouts                           | Implemented as native Next.js routes with focused tests and icon-only controls.        |

## Remaining Sitemap Dispositions

| Live path                                                         | Category                                    | Required handling                                                                                                                                                                                           |
| ----------------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/connect`                                                        | Canonical alias                             | Redirect to the current contact/engagement route after route-level content check.                                                                                                                           |
| `/health`, `/library`, `/heroes`, `/impact`, `/projects`, `/quiz` | Canonical aliases                           | Map each to its active canonical page after verifying its intended current destination. Do not duplicate indexed content.                                                                                   |
| `/seven-doors`                                                    | Legacy orientation route                    | The live route currently has an inactive/404 behavior. Preserve only if reference source shows a self-contained public page; otherwise create a canonical redirect and remove it from the sitemap path set. |
| `/built-on-manus`                                                 | Product attribution                         | Treat as optional informational content. Do not add branding or product claims without approved copy.                                                                                                       |
| `/clock-keeper-part-2`                                            | Potential self-contained legacy public page | Port only after its response flow, stored data, privacy policy, and backend requirement are reviewed.                                                                                                       |
| `/fauxtony`                                                       | AI-assisted discovery                       | Requires a separate server-side AI integration, abuse protection, and content-scope review; do not copy a legacy client-side implementation.                                                                |
| `/shop`                                                           | Authenticated and payment-dependent         | Deferred until secure Google OAuth and approved checkout architecture are completed.                                                                                                                        |
| `/subscribe`                                                      | Newsletter and membership surface           | The newsletter endpoint is active; a dedicated marketing page can be added from approved membership copy without representing payment tiers as active.                                                      |
| `/supplier-intake`                                                | External supplier workflow                  | Existing redirect covers the external RampRate workflow. Keep as a redirect until an approved managed-database intake replacement is designed.                                                              |
| `/cheshire-grin`                                                  | Restricted report                           | Existing redirect protects the legacy report surface. Preserve the restriction until approved authentication is added.                                                                                      |

## Image and Media Reconciliation Rules

All reference media must be reconciled route by route before replacement. A source image is reused only when it is both available and permitted for the current page. Public images use `next/image`; internal navigation uses `next/link`; assets are allow-listed in `next.config.ts`. The active homepage’s Tony Greenberg API image source has been revalidated through the current `next/image` policy.

If a reference asset is unavailable, a matching replacement is created only after the page’s visual target, intended subject, licensing, and alt text are recorded. New assets are stored outside the project source tree and served through the approved managed asset path. No image is silently substituted with unrelated stock imagery.

### Retired Sanity CDN Replacement Record

The nine remaining active references to the retired Sanity project image host were each retrieved directly from their original immutable asset URL and uploaded without visual substitution to approved managed storage on 11 September 2026. The `.webp` filenames are retained for continuity with the source references, although file inspection identifies the recovered image bytes as JPEG. The application serves the managed paths with `next/image`; the regression test at `src/test/managed-media.test.ts` prevents the retired host from returning to active source.

| Active route      | Image role           | Managed storage path                                      |
| ----------------- | -------------------- | --------------------------------------------------------- |
| `/about`          | Tony portrait        | `/manus-storage/about-walkthrough-portrait_f97955e3.webp` |
| `/about`          | Editorial hero       | `/manus-storage/the-letter-hero_f831d229.webp`            |
| `/the-letter`     | Editorial hero       | `/manus-storage/the-letter-hero_f831d229.webp`            |
| `/the-letter`     | Four Doors: Read     | `/manus-storage/the-letter-feature-one_dd233ff1.webp`     |
| `/the-letter`     | Four Doors: Diagnose | `/manus-storage/the-letter-feature-two_4f6cea31.webp`     |
| `/the-letter`     | Four Doors: Engage   | `/manus-storage/the-letter-feature-three_41e72f90.webp`   |
| `/the-letter`     | Four Doors: Verify   | `/manus-storage/the-letter-feature-four_f14845b3.webp`    |
| `/the-body`       | Hero                 | `/manus-storage/the-body-hero_1ede8372.webp`              |
| `/the-nightstand` | Hero                 | `/manus-storage/the-nightstand-hero_ffcf4739.webp`        |
| `/the-web`        | Hero                 | `/manus-storage/the-web-hero_06f8b491.webp`               |
| `/walk-through`   | Tony portrait hero   | `/manus-storage/about-walkthrough-portrait_f97955e3.webp` |

At the validation checkpoint, the public managed-storage URL returned an edge redirect followed by a `200 image/webp` response. The local Next.js development server does not proxy `/manus-storage/*`, which is expected to be handled by the managed platform edge. Separately, a post-checkpoint inspection of the configured public domain continued to emit the pre-checkpoint Sanity image markup despite a deployment-success notification. Therefore, the asset migration is source- and storage-verified, while final public deployment-media verification remains open in the deployment checklist until the served application revision advances.

## Implementation Priority

1. Complete route-level image, content, link, and responsive comparison for active high-traffic public pages.
2. Add safe canonical redirects or standalone public pages from the remaining sitemap table, beginning with approved aliases and the newsletter surface.
3. Evaluate `clock-keeper-part-2` against managed-database form, privacy, and consent requirements before porting it.
4. Keep AI, payment, supplier, restricted-report, and Google OAuth work as separate secure integration phases.
5. Re-run quality, responsive browser, and production-runtime validation after every restoration batch.

## References

[1]: https://tonygreenberg.com/sitemap.xml "Tony Greenberg live sitemap"
[2]: https://github.com/RRTONY/tonygreenberg "Tony Greenberg reference repository"
