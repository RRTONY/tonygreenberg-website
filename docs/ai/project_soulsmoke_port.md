# SoulSmoke port (/soul-smoke)

SoulSmoke ("The Miracle of Mezcal") was a separate Manus app (`mezcalagave-ahru9fq8.manus.space`).
The webmaster exported its source from Manus on 2026-11-10 (`~/Downloads/mezcal` on their Mac: Vite +
React 19 + wouter + tRPC + Drizzle/MySQL + Manus OAuth). The owner asked for it to be rebuilt on
tonygreenberg.com with the **same code, UI and style, minus anything Manus**, at `/soul-smoke`, as
its own sub-site (own header, no tonygreenberg.com header/footer), with SEO, sitemap and site-search
entries. Same pattern as `/brewsoul`.

## Where things live

| Original (SoulSmoke app) | Here |
| --- | --- |
| `client/src/App.tsx` router (34 routes) | `src/app/soul-smoke/**/page.tsx` (`/` → `/soul-smoke`, `/us-hunt` → `/soul-smoke/us-hunt`) |
| `client/src/index.css` | `src/app/soul-smoke/soulsmoke.css`, generated: every selector scoped under `.soulsmoke-root`, `html.mode-aficionado` → `.soulsmoke-root[data-mode="aficionado"]`, keyframes prefixed `ss-` (class names like `glitch`, `grain`, `animate-fade-in` are unchanged) |
| `@theme` colors | shadcn tokens set on `.soulsmoke-root` (so `bg-background`, `bg-card`, `text-muted-foreground`, `border-border` show SoulSmoke's palette); `terracotta sage coral indigo ochre cream earth` added to `globals.css` `@theme` |
| Google Fonts link | `src/lib/fonts/soulsmoke-fonts.ts` (next/font) |
| `LanguageContext`, `ViewModeContext`, `FavoritesContext` | `src/components/soulsmoke/soulsmoke-providers.tsx` (`useLanguage`, `useViewMode`, `useFavorites`, same localStorage keys) |
| translations | `src/lib/content/soulsmoke/translations.ts` |
| `Navigation`, `ViewModeToggle`, `LanguageToggle` | `src/components/soulsmoke/soulsmoke-nav.tsx` |
| `PageJourney` | `src/components/soulsmoke/page-journey.tsx` |
| `EmailSignup` | `src/components/soulsmoke/email-signup.tsx` (posts to `/api/subscribe`, Kit tag `soulsmoke-*` in `kit-source-tags.ts`) |
| `SmokeCursor`, `AmbientSound`, `ContentProtection` | `src/components/soulsmoke/soulsmoke-effects.tsx` (fire sound rescued to Sanity) |
| `client/src/data/*.ts` | `src/lib/content/soulsmoke/mezcal-data.ts`, `mezcal-enriched.ts`, `qpr-engine.ts` (unchanged content) |
| `client/public/images/*.webp` | Sanity; `src/lib/content/soulsmoke/images.ts` (`soulsmokeImages.<camelName>` = `{src,width,height,alt}`) |
| menu + route list | `src/lib/content/soulsmoke/nav.ts` (`ss("/us-hunt")` adds the `/soul-smoke` prefix; `soulsmokeRoutes` feeds the sitemap) |
| one site-wide title | per page: `soulsmokeMetadata({ path, title, description })` in `src/lib/content/soulsmoke/seo.ts` |

## How to port a page (the rules every SoulSmoke page follows)

1. `src/app/soul-smoke/<route>/page.tsx`: a Server Component that exports
   `metadata = soulsmokeMetadata({ path: "/<route>", title: "<the page's own H1> | SoulSmoke", description: "<the page's own intro sentence(s)>" })`
   and renders the page component. Never invent copy for title/description: take it from the page.
2. `src/components/soulsmoke/pages/<kebab-name>.tsx` (or a folder `pages/<kebab-name>/` for a big
   page): the original page's JSX and logic, **same markup, classes, copy (EN and ES), behaviour**.
   Add `"use client"` only if it uses state, effects, the providers' hooks or browser APIs (most do).
3. Mechanical changes only:
   - `wouter` → `next/link` (`<Link href={ss("/x")}>`, no nested `<div>` wrapper needed: put the
     wrapper's classes on the Link), `useLocation` → `usePathname`/`useRouter` (`next/navigation`),
     `useParams` → page props. Every internal path goes through `ss()`.
   - Context hooks from `@/components/soulsmoke/soulsmoke-providers`; data from `@/lib/content/soulsmoke/*`.
   - `<img>` and CSS `url(/images/x.webp)` → `next/image` with `soulsmokeImages` (`fill` +
     `object-cover` for backgrounds; `brightness-[0.6]` etc. for `filter`). A CSS background that a
     `glitch-image` pseudo-element must inherit can stay a literal `bg-[url(<sanity url>?w=1920&auto=format)]` class.
   - **No `style={}`** except numbers computed at runtime (scroll offsets, progress widths, chart
     coordinates). Static styles become Tailwind classes (`[text-shadow:...]`, `bg-[#hex]`,
     `brightness-[0.6]`). Conditional styles become two full literal class strings (never built
     from fragments).
   - Canonical Tailwind: `bg-linear-to-*` (not `bg-gradient-to-*`), `shrink-0`, `size-5`, `z-9999`.
   - No framer-motion: CSS transitions / `animate-*` / `tw-animate-css` (`animate-in fade-in slide-in-from-bottom-4`).
   - Emoji used as UI icons → lucide-react icons (`aria-hidden="true"`), typed arrows in buttons → `ArrowRight`.
     Emoji inside the data/copy text stay.
   - Buttons that navigate: `<Button asChild><Link .../></Button>`.
   - Pending state: `<Loader2 className="size-4 animate-spin" />`, never "Loading...".
   - Collapsed panels with real content (Accordion/Collapsible/Tabs): `forceMount` + hide when closed,
     so the text is in the server HTML.
   - Fix live's flaws only where clearly broken (unreadable contrast, squeezed inputs, sideways
     scroll at 375px), and note each in a comment.
4. **Manus pieces are removed, not stubbed:** Manus OAuth/`useAuth` (member features use this site's
   Supabase sign-in instead, see 5), `trpc` (see below), Manus analytics, `ManusDialog`, `AIChatBox`,
   `DashboardLayout`, `ComponentShowcase` (dev demo, not ported).
5. Server features (`trpc.*`) without Manus:
   - `mailingList.subscribe` → `EmailSignup` (done).
   - Member features → Supabase (webmaster, 2026-11-10: "use the current db"). Tables in
     `supabase/migrations/0007_soulsmoke.sql` (run 2026-11-10 through the Management API; RLS on,
     no policies, so only the server's service-role key reaches them). Server actions in
     `src/app/soul-smoke/actions.ts`, each scoped to the signed-in member (`getUser()`):
     `tastingJournal` → `list/add/deleteTastingEntry`; `priceAlerts` → `list/add/deletePriceAlert`;
     `tradeBoard` → `listTradeListings` (public, returns `isMine` instead of owner ids),
     `create/deleteTradeListing`, `sendTradeMessage` (stores it and emails the seller with the
     sender's email to reply to; Manus only stored it); `leadGen.*BusinessProfile` →
     `getMyBusinessProfile`/`saveBusinessProfile` (emails Tony on create); `leadGen.wantBottle` →
     `wantBottle` (emails Tony). As on SoulSmoke these need a signed-in member: signed-out visitors
     see the original "Sign in" boxes, linking to `/login?next=/soul-smoke/...` (Supabase Auth
     replaces Manus OAuth). Not ported (no page used them): `bottleDemand`, `getMyInterests`,
     `myListings`, `messages`, and the admin-only producer profiles / lead connections (Tony uses
     the Table Editor). Flood guard: a few rows per member per 10 minutes per table.
   - Favorites (hunt list), language and view mode stay in the visitor's browser (they did on
     SoulSmoke too) via `useLocalStore(key, fallback)` from `src/components/soulsmoke/hooks/use-local-store.ts`.
   - `bottleScanner.analyze` → `src/app/api/soul-smoke/bottle-scanner/route.ts`, same system
     prompt, Anthropic Messages API over `fetch` (no SDK), `ANTHROPIC_API_KEY`, size-limited.
6. Google Maps (`components/Map.tsx`) went through Manus's proxy: the Oaxaca map uses an
   OpenStreetMap embed (`<iframe>` to `openstreetmap.org/export/embed.html` with a bbox and marker)
   plus the same list of places.
7. Tests: `__tests__/` mirrors `src/` (e.g. `__tests__/components/soulsmoke/pages/us-hunt.test.tsx`),
   90% lines per file. Wrap renders in `SoulsmokeProviders`. Run only your files:
   `PATH=~/.nvm/versions/node/v24.18.0/bin:$PATH pnpm exec vitest run <test> --coverage --coverage.include=<src> --coverage.reporter=text`.

## Not carried over (on purpose)

- `ComponentShowcase.tsx` (dev demo), `DashboardLayout`, `AIChatBox`, `ManusDialog`,
  `SocialShare` and `OptimizedImage` (no page used them).
- `fire-loop.mp3`, `wind-ambient.mp3`: in the export but no code plays them.
- SoulSmoke's index.html says "© 2025 Tony Huang"; not copied (owner to confirm the name).

## Header layout (2026-11-10)

The original header overlapped on most screens. Fixed here: the logo link is `shrink-0`; the full menu shows
from `xl` (1280px), the hamburger below; below `sm` the SoulSmoke/Aficionado and EN/ES switches sit at the top
of the opened menu; both switches are `h-9 shrink-0 whitespace-nowrap`; the mode switch is icon-only between
`xl` and `2xl` so the row fits at 1280. Page "Back to Home" links sit at `top-24` (below the fixed header).
Check any header change at 320, 375, 820, 1024, 1280 and 1440px.

## Old data (decided 2026-11-10)

SoulSmoke's Manus database (TiDB: users, subscribers, tasting_journal, price_alerts, trade_listings,
trade_messages, business_profiles, producer_profiles, bottle_interests, lead_connections) is **not**
copied. The webmaster: "we don't want anything to use in manus". The export held only one query
result, a test signup. The rebuilt site starts empty; nothing reads from or depends on Manus.

## SEO (2026-11-10)

Per-page metadata via `soulsmokeMetadata` (author/copyright Tony Greenberg). Structured data via
`<SoulsmokeJsonLd {...seo} />` in every `page.tsx` (`src/lib/content/soulsmoke/structured-data.ts`): WebPage or
CollectionPage + BreadcrumbList + the SoulSmoke guide (CreativeWork); US Hunt and Mexico Source add an ItemList of
bottles (names only: no prices or ratings). A new page: wrap its metadata in `const seo = {...}` and add the component.
All pages are listed in `public/llms.txt`.
