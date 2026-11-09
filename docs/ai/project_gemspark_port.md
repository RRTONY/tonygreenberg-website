# The GemSpark port (/gem-spark)

The GemSpark ("The Fusion Between Serendipity and Synchronicity", Tony's story) was a separate Manus
app (`serensynch-2agjfwhe.manus.space`). Its source export is `~/Downloads/serendipity-synchronicity`
on the webmaster's Mac (Vite + React 19 + wouter + tRPC + Drizzle/MySQL). Rebuilt here on 2026-11-10
with the same copy, markup and look, minus Manus, as a standalone section (SiteChrome hides the main
header/footer, as on the app). Same porting rules as `project_soulsmoke_port.md`.

## Where things live

| App | Here |
| --- | --- |
| `/` (Home.tsx, long form) | `src/app/gem-spark/page.tsx` (Server Component, `revalidate = 300` for featured sparks) |
| `/short`, `/es/short` | `src/app/gem-spark/short/page.tsx`, `src/app/gem-spark/es/short/page.tsx` (`lang="es"`) |
| components | `src/components/gemspark/*` (kebab-case), interactive ones are small client components |
| `index.css` | `src/app/gem-spark/gemspark.css`, all scoped to `.gemspark-root` (layout wrapper): default fonts, sparkle keyframe, paragraph spacing (`section p + p`), print styles |
| images (Manus CDN + `/manus-storage`) | Sanity, `src/lib/content/gemspark/images.ts` (EXIF/GPS stripped; panorama resized 15,928 → 6,000px) |
| per-page SEO | `src/lib/content/gemspark/seo.ts` |
| tRPC `stories.submit`, `analytics.*`, `featured.list` | `src/app/gem-spark/actions.ts` → Supabase, `supabase/migrations/0008_gemspark.sql` (run 2026-11-10; RLS on, no policies) |
| `newsletter.subscribe` | `/api/subscribe` → Kit, source `short-form-popup` → tag "GemSpark: Newsletter" |

Fonts: live rendered in the browser defaults (its Playfair `<link>` was never applied; checked the live
CSS), so no web font is loaded. Live also never loaded the typography plugin, so the short pages'
`prose` classes were dropped (no visual change).

## Data (Supabase, nothing copied from Manus)

- `gemspark_story_submissions`: "Share Your Spark" stories (no sign-in, flood guard 5 per browser per
  10 min). Tony is emailed each one.
- `gemspark_featured_sparks`: to feature a story, add a row in the Table Editor (`is_active = true`,
  lower `display_order` first). With none, the page shows the app's "Coming Soon" card.
- `gemspark_page_views`: one row per read (per browser per page per 30 min), feeding the public
  Impact Report counts. No IP or user agent stored. Counts started at 0 on this site.

Not ported: `/admin` (Tony uses the Table Editor and Kit), ComponentShowcase, ManusDialog, AIChatBox,
Map, the app's own subscribers table, and framer-motion (entrances are `tw-animate-css` classes; the
unused scroll opacity/scale was dropped).

## Checked (2026-11-10)

Build static (`○`), one H1 per page, canonicals, sitemap (3), site search. Page heights equal live's at
375 and 1280 (long 16,745 / 15,435 px; short 4,640 / 3,570; ES 4,746 / 3,700), no sideways scroll or
console errors at 375/820/1280. Real run on the production build: reads counted, story saved, "Your
GemSpark Has Been Received" shown; all test rows deleted afterwards.
