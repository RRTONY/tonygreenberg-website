# Full Live-Site Parity Inventory

## Scope and Evidence

This inventory compares the public URL set exposed by the live [`tonygreenberg.com` sitemap][1], the public reference implementation in [`RRTONY/tonygreenberg`][2], and the active Next.js App Router project. It is an implementation decision record, not a claim that every legacy service is suitable for direct migration. The live sitemap supplies the canonical indexed URL list; the reference repository supplies legacy page, component, styling, and media behavior.

> The active project remains a **Next.js 16 App Router** application. Reference Vite/React modules are design and behavior evidence only; they are not copied as a framework or runtime dependency.

| Measure                                               | Count | Interpretation                                                                                           |
| ----------------------------------------------------- | ----: | -------------------------------------------------------------------------------------------------------- |
| Indexed live sitemap paths                            |   292 | Includes public pages, static article URLs, aliases, redirects, and image endpoints.                     |
| Direct active `src/app/**/page.tsx` routes            |   145 | Does not count generated dynamic article, coffee, city, or scorecard paths individually.                 |
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

| Live path                                                         | Category                              | Required handling                                                                                                                                                          |
| ----------------------------------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/connect`                                                        | Verified homepage fallback            | Permanent redirect to `/`; public retrieval shows no distinct route content.                                                                                               |
| `/health`, `/library`, `/heroes`, `/impact`, `/projects`, `/quiz` | Verified homepage fallbacks           | Permanent redirects to `/`; public retrieval shows no distinct route content.                                                                                              |
| `/seven-doors`                                                    | Verified homepage fallback            | Permanent redirect to `/`; public retrieval shows no distinct route content.                                                                                               |
| `/built-on-manus`                                                 | Verified homepage fallback            | Permanent redirect to `/`; public retrieval shows no approved distinct product-attribution content.                                                                        |
| `/clock-keeper-part-2`                                            | Consent-sensitive response collection | Public retrieval shows optional name/email fields and five long-form prompts. Port only after an explicit consent, retention, access-control, and managed-database review. |
| `/fauxtony`                                                       | AI-assisted discovery                 | Requires a separate server-side AI integration, abuse protection, and content-scope review; do not copy a legacy client-side implementation.                               |
| `/shop`                                                           | Authenticated and payment-dependent   | Deferred until secure Google OAuth and approved checkout architecture are completed.                                                                                       |
| `/subscribe`                                                      | Newsletter marketing surface          | Native free subscription page implemented with the managed endpoint and cookie-backed visitor state; legacy paid tiers remain deferred.                                    |
| `/supplier-intake`                                                | External supplier workflow            | Existing redirect covers the external RampRate workflow. Keep as a redirect until an approved managed-database intake replacement is designed.                             |
| `/cheshire-grin`                                                  | Restricted report                     | Existing redirect protects the legacy report surface. Preserve the restriction until approved authentication is added.                                                     |

### Public Fallback Evidence

Direct public retrieval on 11 September 2026 found that `/built-on-manus`, `/connect`, `/health`, `/library`, `/heroes`, `/impact`, `/projects`, `/quiz`, and `/seven-doors` all rendered the live homepage rather than unique route content. These are therefore legacy fallback URLs, not evidence for additional content ports. The active project should avoid duplicate pages and may use canonical redirects once their routing behavior is covered by tests.

The remaining distinct live candidates are deliberately classified by integration risk. `/clock-keeper-part-2` is an open-ended name, email, and free-text collection flow, so its persistence and consent design must precede any port. `/fauxtony` is an AI answer-generation feature and requires a separately reviewed model, source-grounding, and misuse-safety implementation. `/shop` and legacy paid offers require an approved checkout provider and product/fulfillment configuration. These live-page observations do not justify copying their retired client-only implementations into the current release.

All continuing comparison evidence in this audit is obtained from public live routes and the supplied `RRTONY/tonygreenberg` reference repository. No account-level platform controls are required for the route, visual, component, image, or interaction review.

### Visual Pattern Check: Shop

The public Shop page confirms the active visual system rather than introducing a new style direction: a near-black editorial hero with cream high-contrast serif display copy and gold accent words, followed by a warm parchment body and restrained border-defined product cards. The three product CTAs are sign-in-gated purchase actions, not static links, and the remaining tool cards are intentionally marked unavailable. This corroborates the existing charcoal/cream/gold Next.js design tokens while confirming that the transactional controls must remain deferred until authentication and checkout are deliberately designed.

### Visual Pattern Check: Clock Keeper

The public Clock Keeper page uses the same near-black, lightly textured hero; mono gold eyebrow; cream serif headline; and gold/outlined action-pair pattern already present in the active project. Below the hero, it converts into a parchment form surface with five selectable response modes, optional identity fields, and five long-form response fields. Public retrieval on 11 September 2026 did not reveal an explicit consent, retention, or access-control statement alongside this collection. The visual system is reusable evidence, but the interaction is not a static page: its submission collects optional contact data together with sensitive free-form responses. A secure storage-retention, consent, and authenticated review model is required before this flow can be ported.

### Shared Style-System Check

The active Next.js global token layer already defines the observed brand gold (`#8B6914` and `#D4B96A`), near-black/cream theme pair (`#0A0A10` and `#F5F0E0`), serif heading font, and mono metadata font. This matches the public Shop and Clock Keeper visual evidence. Route-level work should therefore extend the existing tokens and shared layout rather than import reference CSS or create a competing design system.

The restored Human OS hero was visually rechecked at 1280px, 768px, and 375px widths. The verified hero asset, contrast overlay, heading hierarchy, status label, and responsive navigation all remained legible without overflow at those breakpoints.

### Visual Pattern Check: Facilitator Index

The active Facilitator Index already matches the reference page’s warm cream-to-amber-to-rose research surface, full-bleed amber/purple hero image, cream serif heading, gold mono eyebrow, and translucent watermark treatment. The reference additionally places a Twelve Bands diagram before Band 0 and a five-axis compass diagram after Band J. Both existing live image endpoints were verified as publicly available and are restored in the native component without introducing a new visual source. The full-index expansion, restored diagrams, and Lucide disclosure control were then checked at desktop and mobile breakpoints.

## Image and Media Reconciliation Rules

All reference media must be reconciled route by route before replacement. A source image is reused only when it is both available and permitted for the current page. Public images use `next/image`; internal navigation uses `next/link`; assets are allow-listed in `next.config.ts`. The active homepage’s Tony Greenberg API image source has been revalidated through the current `next/image` policy.

The current source scan identifies 132 remote image URLs in the reference repository and 70 in the active Next.js source, with 65 exact URLs shared. The 67 reference-only URLs are not treated as automatic omissions: they include media for unported payment, restricted-report, authenticated, supplier, and legacy-only flows as well as assets from routes already represented with current live API sources. Each candidate must be reconciled against an active route and an approved public purpose before it is reused or rehosted.

Reference-only image declarations are concentrated in the legacy blog data, assessment, peptide, PRI, Human OS, attention-theft, and restricted-report source areas. The active project already contains native public pages for the substantive assessment, peptide, PRI, Human OS, and attention-theft areas; residual asset candidates in those areas require visual comparison before replacement, while the restricted Cheshire/Report Spammer surfaces remain intentionally excluded.

If a reference asset is unavailable, a matching replacement is created only after the page’s visual target, intended subject, licensing, and alt text are recorded. New assets are stored outside the project source tree and served through the approved managed asset path. No image is silently substituted with unrelated stock imagery.

### Retired Sanity CDN Replacement Record

The nine remaining active references to the retired Sanity project image host were each retrieved directly from their original immutable asset URL and uploaded without visual substitution to approved managed storage on 11 September 2026. Initial uploads retained `.webp` filenames while containing JPEG bytes, which caused browser decoding failures when the storage edge correctly labelled them `image/webp`. Each image was deterministically converted to true WebP without cropping or semantic alteration, then reuploaded to the mapped paths below. The application serves the managed paths with `next/image`; the regression test at `src/test/managed-media.test.ts` prevents the retired host from returning to active source.

| Active route      | Image role           | Managed storage path                                      |
| ----------------- | -------------------- | --------------------------------------------------------- |
| `/about`          | Tony portrait        | `/manus-storage/about-walkthrough-portrait_9c975c3f.webp` |
| `/about`          | Editorial hero       | `/manus-storage/the-letter-hero_6f76d90a.webp`            |
| `/the-letter`     | Editorial hero       | `/manus-storage/the-letter-hero_6f76d90a.webp`            |
| `/the-letter`     | Four Doors: Read     | `/manus-storage/the-letter-feature-one_638e12a9.webp`     |
| `/the-letter`     | Four Doors: Diagnose | `/manus-storage/the-letter-feature-two_4830a9d3.webp`     |
| `/the-letter`     | Four Doors: Engage   | `/manus-storage/the-letter-feature-three_ff78fd8a.webp`   |
| `/the-letter`     | Four Doors: Verify   | `/manus-storage/the-letter-feature-four_2dee4cb5.webp`    |
| `/the-body`       | Hero                 | `/manus-storage/the-body-hero_6b1613eb.webp`              |
| `/the-nightstand` | Hero                 | `/manus-storage/the-nightstand-hero_6e067b51.webp`        |
| `/the-web`        | Hero                 | `/manus-storage/the-web-hero_39e97b3f.webp`               |
| `/walk-through`   | Tony portrait hero   | `/manus-storage/about-walkthrough-portrait_9c975c3f.webp` |

At the validation checkpoint, the public managed-storage URL returned an edge redirect followed by a `200 image/webp` response. The local Next.js development server does not proxy `/manus-storage/*`, which is expected to be handled by the managed platform edge. Separately, early post-checkpoint inspections of the configured public domain emitted pre-checkpoint Sanity image markup and returned the former custom 404 for the new `/subscribe` route, including after the legacy Netlify configuration was removed and the platform acknowledged a successful deployment.

Public verification on 11 September 2026 at 10:34 UTC then confirmed that the configured domain had advanced to the current application revision. `https://tonygreenweb-xsv9qbd3.manus.space/subscribe` returned `200` with `x-powered-by: Next.js` and the restored subscription-page signature. `https://tonygreenweb-xsv9qbd3.manus.space/the-letter` emitted the recovered `/manus-storage/the-letter-*` paths and contained zero references to `cdn.sanity.io/images/a3q1cyqs`. The managed production-log endpoint still reports that no Cloud Run service is available, so this audit records public runtime evidence rather than making an unsupported claim about the provider's internal container topology or static-upload mechanics.

The public `/subscribe` page was also visually checked at the default desktop viewport. It rendered the current dark charcoal hero, cream-and-gold serif heading, parchment subscription panel, labelled email field, and free-newsletter disclosure rather than the former custom 404. This validates the restored route's public presentation and confirms that its live navigation and form surface use the current Next.js revision.

## Implementation Priority

1. Complete route-level image, content, link, and responsive comparison for active high-traffic public pages.
2. Add safe canonical redirects or standalone public pages from the remaining sitemap table, beginning with approved aliases and the newsletter surface.
3. Evaluate `clock-keeper-part-2` against managed-database form, privacy, and consent requirements before porting it.
4. Keep AI, payment, supplier, restricted-report, and Google OAuth work as separate secure integration phases.
5. Re-run quality, responsive browser, and production-runtime validation after every restoration batch.

## References

[1]: https://tonygreenberg.com/sitemap.xml "Tony Greenberg live sitemap"
[2]: https://github.com/RRTONY/tonygreenberg "Tony Greenberg reference repository"
