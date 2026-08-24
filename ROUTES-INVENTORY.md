# Legacy Route Inventory — source for NEXTJS-MIGRATION-TODO.md

Full catalog of every reachable URL in the legacy Vite/wouter app (`client/src/App.tsx`), used as the
map for porting pages into `web/` one at a time. Router resolution order in the legacy app: (1) exact
`/living-declaration`, (2) `/humanos/*` own `<Switch>`, (3) `STANDALONE_ROUTES` (~120 routes, own layout,
no main nav/footer), (4) everything else via `MainRouter` inside the full `Layout`. ~20 paths are
defined twice (once in `STANDALONE_ROUTES`, once — dead — in `MainRouter`); only the standalone
definition is ever reachable, so duplicates are omitted below.

**Totals:** ~150 unique reachable URLs across 172 `.tsx` page files. 5 files are dead code (unrouted)
and are dropped, not ported: `pages/HumanOS.tsx`, `pages/ComponentShowcase.tsx`,
`pages/VendorIntakeForm.tsx`, `pages/VendorIntakeLong.tsx`, and 5 pre-consolidation manifesto
sub-pages (`AttentionEconomics.tsx`, `BlockerFinder.tsx`, `LegalDatabase.tsx`, `TenWeapons.tsx`,
`ReportSpammer.tsx` — folded into `AttentionTheft.tsx`).

Categories match the phases in `NEXTJS-MIGRATION-TODO.md`. Full per-route detail (URL, source
component, one-line description) lives in the corresponding Phase 4-9 checklists in that file —
this document is the categorized summary plus the data-file map.

## Category counts

| Category | Routes | Migration phase |
|---|---|---|
| Marketing / brand / content-tool pages | 30 | Phase 4 |
| Blog (index, post template, search, archive, curated views) | 6 | Phase 5 |
| BrewSoul (coffee encyclopedia + tools) | 28 | Phase 6 |
| PRI + Kava encyclopedias | 19 | Phase 7 |
| Attention Theft Manifesto | 7 | Phase 8 |
| Assessments (HumanOS + Find-Your-* + hub/composite tools) | 33 | Phase 9 |
| FauxTony chatbot | 2 | Phase 10 |
| Admin / auth / billing / spam — **out of scope this pass** | 12 | deferred |

## Key data files backing ported content

| File | Size | Shape | Feeds |
|---|---|---|---|
| `client/src/data/blogData.json` | 2.1 MB, 121 records | `{ id, slug, title, subtitle, summary, author, date, category, tags[], keywords[], readTime, image, originalContent (markdown), ... }` | Sanity `post` migration (Phase 1) |
| `client/src/data/blogListingData.json` | 234 KB, 110 records | Lightweight index shape (no body) | Blog index cards (superseded once Sanity is live — verify no drift vs. `blogData.json` before dropping) |
| `client/src/data/footerData.json` | 215 KB | Footer link/content structure | Phase 3 footer |
| `client/src/data/mirrorData.json` | 36 KB | Backing data for `/life-assessment` | Phase 9 |
| `client/src/data/brewsoul-coffees-expanded.ts`, `brewsoul-encyclopedia.ts`, `brewsoul-chains.ts` | 84/70/61 KB | Coffee + encyclopedia + supply-chain data | Phase 6 |
| `client/src/data/cityData.ts` | 53 KB | BrewSoul city guides | Phase 6 |
| `client/src/data/charityData.ts` | 64 KB | Charity Scorecard data | Phase 4 |
| `client/src/data/wallOfShameData.ts` | 23 KB | BrewSoul wall-of-shame content | Phase 6 |
| `client/src/data/readingPaths.ts`, `linkMap.ts`, `searchablePages.ts` | 44/—/41 KB | Internal cross-linking structure — **preserve link graph when porting**, don't just port pages in isolation | Phases 4-9 |
| `client/src/pages/pri/data.ts`, `iboga-compass-data.ts`, `iboga-compass-engine.ts`, `iboga-facility-data.ts`, `mescaline-module.ts`, `safety-data.ts`, `medicine-images.ts` | — | PRI scoring/domain data | Phase 7 |
| ⚠️ `client/src/data/blogPosts.ts` (82 KB) | — | Looks like a **legacy/alternate blog data module** distinct from `blogData.json` | Reconcile before migration — confirm `blogData.json` is authoritative, don't silently drop content that only lives in `blogPosts.ts` |

## Verified image-sourcing audit (blog posts, 2026-08-22)

Ran against `blogData.json`'s 121 records' `image` field:

- **98** → generic `og-default.jpg` fallback (no real hero image exists yet)
- **17** → real image, already on RampRate's own CloudFront (`d2xsxph8kpxj0f.cloudfront.net`) — portable
- **4** → legacy `/api/img/...` dynamic proxy route — source file must be recovered
- **1** → literal `/manus-storage/...` path — must be rescued before Manus is decommissioned
- **1** → no `image` field at all (`heart-protocol-addendum`)

See `NEXTJS-MIGRATION-TODO.md` Phase 13 for the actionable checklist.
