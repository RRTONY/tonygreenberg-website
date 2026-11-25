# Sake for Sake's Sake port (/sake)

Sake for Sake's Sake ("The Definitive Sake Experience", the EXV™ sake guide) was a separate Manus app. Its source
was exported from Manus (`~/Downloads/sake-for-sakes-sake` on the webmaster's Mac: Vite + React 19 + wouter + tRPC +
Drizzle/MySQL + Manus OAuth + Stripe SDK + Manus's built-in LLM and S3 storage). The owner asked for it on
tonygreenberg.com with the **same UI, styles and animations, minus anything Manus**, at `/sake`, as its own
sub-site, the same way as Aqueous (`project_aqueous_port.md`) and LiquidSun. Ported 2026-11-26 on branch
`feat/sake`. Scope chosen by the webmaster: everything at once (all 65 routes, server features included).

## Where things live

| Original (Sake app) | Here |
| --- | --- |
| `client/src/App.tsx` router (65 routes) | `src/app/sake/**/page.tsx` (`/` → `/sake`, `/rice` → `/sake/rice`...). The app's `/sake/:id` is `/sake/bottle/[id]` so an id can't collide with a page name. Route list: `sakeRoutes` in `src/lib/content/sake/nav.ts` |
| `client/src/index.css` | `src/app/sake/sake.css`: every selector under `.sake-root`, the app's dark Kintsugi palette as shadcn tokens, Austere (`.sake-austere`) as the second set, `--sk-*` variables for the colors the app picked in JS per look |
| Google Fonts link | `src/lib/fonts/sake-fonts.ts` (Cormorant Garamond, Noto Sans, Noto Sans JP, JetBrains Mono). `font-sans` reads `--font-body` (globals.css `@theme inline`), so the section sets `--font-body` |
| `AestheticContext`, `LanguageContext`, `ModeContext`, `FavoritesContext`, `useAuth` | `src/components/sake/sake-providers.tsx` (`useAesthetic`, `useLanguage`, `useMode`, `useFavorites` with the app's `sake-favorites-v1` key, `useMember`, `useSakePortalClass`) |
| `Navigation`, `BottomNav`, `GlobalSearch`, `GlobalFooter`, `SocialShare`, `ContentProtection` | `src/components/sake/` (`sake-nav`, `sake-bottom-nav`, `global-search`, `sake-footer`, `social-share`, `content-protection`), rendered once in `src/app/sake/layout.tsx` |
| pages | `src/components/sake/pages/` |
| `lib/*.ts` data | `src/lib/content/sake/*.ts` (kebab-case names, contents unchanged) |
| framer-motion | `src/components/sake/motion.tsx` (Aqueous/LiquidSun helpers) + tw-animate classes |
| `server/routers/*`, `server/stripe/*`, `drizzle/schema.ts` | `src/app/sake/actions.ts`, `src/lib/content/sake/sake-stripe.ts`, `supabase/migrations/0011_sake.sql` (**not applied yet**) |
| sake scanner / menu analyzer (Manus LLM + S3) | Claude over fetch (`src/app/api/sake/...`), no image storage |
| images (Manus CDN) | `src/lib/content/sake/images.ts` (all `null` for now), `<SakeImage>` |
| no favicon / share image | `src/app/sake/icon.png`, `apple-icon.png`, `opengraph-image.png`, `twitter-image.png`: the app's gold 酒 logo on its indigo, rendered from Hiragino Mincho (2026-11-26) |

## SEO

The app had one title and description for the whole site (`client/index.html`) and nothing per page. Here the
home page keeps them word for word; every other page is titled with its menu label ("Rice Encyclopedia |
Sake for Sake's Sake™") and described with its own intro line. The app's robots rule (`noarchive, noimageindex,
max-snippet:160`) is kept. Favorites and My Reviews are noindex; `/privacy` and `/dmca` show the Terms page
(as in the app) with the canonical on `/sake/terms`. All listed pages and every sake detail page are in
`src/app/sitemap.ts`. Each page has WebPage + breadcrumb JSON-LD (`src/components/sake/sake-json-ld.tsx`).

## Images

All 15 app pictures (5 scene photos: hero, brewing, rice, aroma, prefecture; 10 bottle renders by sake type)
were already deleted on Manus (HTTP 403, checked 2026-11-26) and the export has no image files. Until
stand-ins are chosen and uploaded to Sanity, pages show the app's own ink-wash gradient where a picture was
(what the app showed in Austere mode). Fill an entry in `images.ts` with a Sanity CDN url and it appears
everywhere that picture was used.

## Changed on purpose (rule 20, security, clean-up)

- Removed: Manus OAuth/LLM/storage/analytics/debug collector, `AIChatBox`, `DashboardLayout`, `ManusDialog`,
  `ComponentShowcase`, `Map` (Manus maps proxy, unused).
- ContentProtection: the hidden `/trap/scraper-detected` link (a page that never existed) and the developer-tools
  console warnings are gone; copying inside form fields is left alone. Copy credit and the 500-character cut stay.
- Search: the QPR Rankings entry pointed at `/qpr-rankings` (404 in the app); it opens `/sake/qpr`.
- Bottle picture matching: `includes("can")` matched "Ameri**can**"; "can" must be its own word.
- 404 page: the app left the Manus template's white/blue card; it uses the section's colors.
- Dialogs portal out of `.sake-root`; `useSakePortalClass()` keeps them in the Sake palette.
- Page-by-page changes are listed in each file's header comment.

## Not finished / needs the owner

- Apply `0011_sake.sql`. Until then reviews, deal alerts, server favorites, orders and subscriptions can't save.
- Checkout is off until `SAKE_CHECKOUT_ENABLED=true`: selling alcohol by mail needs Tony's decision and the
  right licences. Then a Stripe webhook endpoint `https://tonygreenberg.com/api/sake/stripe-webhook` and
  `SAKE_STRIPE_WEBHOOK_SECRET` in Netlify.
- Stand-in or original pictures for the 15 images.
