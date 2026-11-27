# LiquidSun port (/liquid-sun)

LiquidSun ("The Soul of Tequila") was a separate Manus app (`tequilaazul-fxqrr3js.manus.space`). Its source
was exported from Manus (`~/Downloads/tequila-azul` on the webmaster's Mac: Vite + React 19 + wouter + tRPC +
Drizzle/MySQL + Manus OAuth + Stripe SDK). The owner asked for it to be rebuilt on tonygreenberg.com with the
**same code, UI, copy (EN and ES) and style, minus anything Manus**, at `/liquid-sun`, as its own sub-site (own
header, no tonygreenberg.com header/footer), the same way SoulSmoke was (`docs/ai/project_soulsmoke_port.md`,
which is the recipe this followed rule for rule). Ported 2026-11-21 on branch `feat/liquidsun`.

## Where things live

| Original (LiquidSun app) | Here |
| --- | --- |
| `client/src/App.tsx` router (32 routes) | `src/app/liquid-sun/**/page.tsx` (`/` → `/liquid-sun`, `/altar` → `/liquid-sun/altar`) |
| `client/src/index.css` | `src/app/liquid-sun/liquidsun.css`: every selector under `.liquidsun-root`, the app's colors as shadcn tokens on the wrapper, `ls-` keyframes, the app's radius scale, a section-wide `prefers-reduced-motion` rule |
| Google Fonts link | `src/lib/fonts/liquidsun-fonts.ts` (Space Mono, the body face; headings keep the app's unloaded "Playfair Display", serif stack, as visitors saw it) |
| `LanguageContext` + `useAuth` + `subscription.getStatus` | `src/components/liquidsun/liquidsun-providers.tsx` (`useLanguage`, `useMember`; same `tequila-language` storage key) |
| translations | `src/lib/content/liquidsun/translations.ts` |
| `Navigation`, `LanguageToggle` | `src/components/liquidsun/liquidsun-nav.tsx` (menu data in `src/lib/content/liquidsun/nav.ts`, `ls("/x")` adds the prefix, `liquidsunRoutes` feeds the sitemap) |
| App.tsx "Digital Fortress", `AudioController` | `src/components/liquidsun/liquidsun-effects.tsx` (`ContentProtection`, `AudioController`, wind + grind sounds in Sanity) |
| `GatedContent`, `TierBadge`, `FeaturedBadge` | `gated-content.tsx`, `badges.tsx` in `src/components/liquidsun/` |
| The app's shadcn primitives (card, button, badge, separator, table, input, textarea) | `src/components/liquidsun/ui.tsx` (the app's own class strings; the site's newer shadcn components look different) |
| framer-motion | `src/components/liquidsun/motion.tsx` (`Reveal` for whileInView, `usePresenceSwap` for AnimatePresence, `usePrefersReducedMotion`) + tw-animate-css classes + `ls-` keyframes |
| `client/src/lib/producers.ts` | `src/lib/content/liquidsun/producers.ts` (unchanged data; images now `liquidsunImages`) |
| `FlavorMatrix.tsx` | `src/components/liquidsun/flavor-matrix/` |
| `server/stripe/products.ts` | `src/lib/content/liquidsun/premium.ts` |
| `server/stripe/stripe.ts`, `webhook.ts` | `src/lib/stripe.ts` (REST over fetch, no SDK; webhook signature check with node:crypto) + `src/app/api/liquid-sun/stripe-webhook/route.ts` |
| `server/routers.ts` (partner, subscription) | `src/app/liquid-sun/actions.ts` (server actions, scoped to the signed-in member) |
| `drizzle/schema.ts` | `supabase/migrations/0009_liquidsun.sql` (applied 2026-11-21 through the Management API; RLS on, no policies) |
| every form | Formik + Yup; schemas in `src/lib/content/liquidsun/forms.ts`, re-checked in the server actions |
| one site-wide title | `liquidsunMetadata({ path, title, description, noindex? })` in `src/lib/content/liquidsun/seo.ts` + `<LiquidsunJsonLd {...seo} />` (`structured-data.ts`) in every page |
| images (Manus CDN, `client/public/images`) | Sanity; `src/lib/content/liquidsun/images.ts` (`liquidsunImages.<name>` = `{src,width,height,alt}`), list in `docs/ai/manus-media-rescue.md` |
| (no icon) | `src/app/liquid-sun/icon.png`: a sun in the wordmark's amber, drawn for the port because the app had none |

## How to port or change a page

Same rules as SoulSmoke (see that doc, "How to port a page"): a Server Component `page.tsx` with `const seo`
(title = the page's own H1 + " | LiquidSun", description = its own intro), the page component in
`src/components/liquidsun/pages/`, `next/link` + `ls()`, `next/image`, no `style={}` except runtime numbers,
canonical Tailwind, lucide icons for UI emoji, Formik + Yup for forms, tests in `__tests__/` at 90% lines.
LiquidSun-specific:

- Use the primitives from `@/components/liquidsun/ui`, not `@/components/ui`, so cards and buttons keep the app's look.
- Animations: mount entrances are tw-animate classes (`animate-in fade-in slide-in-from-bottom-[50px] duration-1000 fill-mode-both`), scroll-ins are `<Reveal enter="...">`, swaps are `usePresenceSwap(value, exitMs)`. Keep the app's timings and say in a comment which framer-motion props they replace.
- A page's share image is its hero: add it to `PAGE_HEROES` in `seo.ts`.
- The sound button (`<AudioController />`) sits only on pages that had it in the app (Home, Altar, Pilgrimage, Speakeasy, Quadrant, Flavor Finder, Bottle Scanner, Partner, Premium, Premium Success).

## Server features (no Manus)

- **Sign-in:** this site's Supabase Auth replaces Manus OAuth. Locked items link to `/login?next=<this page>`.
  Buy links and panel scores stay blurred behind a free sign-in, as on the app.
- **Premium (owner: full Stripe checkout):** `/liquid-sun/premium` → `startPremiumCheckout(plan)` → Stripe Checkout
  (subscription, $9.99/month or $79.99/year, prices found by lookup key `liquidsun_premium_monthly` /
  `liquidsun_premium_annual` and created on first use) → back to `/liquid-sun/premium/success`. "Manage
  Subscription" opens Stripe's customer portal. The webhook (`/api/liquid-sun/stripe-webhook`; events
  `checkout.session.completed`, `customer.subscription.created|updated|deleted`, `invoice.payment_failed`) writes
  `liquidsun_subscriptions`; a member is Premium while a row is `active`/`trialing` and not past
  `current_period_end`. The test-card hint shows only on a test key. Premium unlocks `GatedContent type="premium"`;
  the app itself never gated anything else behind Premium (its buy links and scores need only a free sign-in).
- **Partner inquiries:** signed-in members (like SoulSmoke's business form), saved to `liquidsun_partner_inquiries`
  and emailed to Tony.
- **The Log (tasting journal):** the app kept entries only in memory. Signed-in members' entries are saved to
  `liquidsun_tasting_entries`; signed-out visitors can still log for the visit, with a "Sign in to keep your log" line.
- **Email capture:** `/api/subscribe` (Kit) with source `liquidsun-homepage` → tag "LiquidSun: Homepage".
- **Bottle Scanner:** the app faked it (always "Fortaleza Blanco" after 3 seconds). It now reads the label with the
  Anthropic Messages API over fetch (`/api/liquid-sun/bottle-scanner`, `ANTHROPIC_API_KEY`), same result card.
- **Pilgrimage map:** Google Maps through Manus's proxy → OpenStreetMap embed with the four zones as buttons.

Flood guard: a few rows per member per 10 minutes per table. Flagged in code for the owner (unchanged from the
app, nothing is sent): the Activity Ticker's "Live" items are fixed sample lines; Flavor Matrix "Notify Me" (SMS)
and "Download for Instagram"; The Assholes "Submit a Sinner"; Trade Board "Bid"/"Set Alert", Voices "Play"/"Record
Now", Squad Riders "Enlist Now" buttons.

## Not carried over (on purpose)

- `AIChatBox` / `trpc.ai.chat`, `DashboardLayout`, `ManusDialog`, `ComponentShowcase`, `__manus__/debug-collector.js`,
  Manus analytics (umami), Manus OAuth.
- `BottleReviews`, `StarRating` (`trpc.ratings.*`), `WhereToBuy`, `ProtectedImage`, `EmailSignup`, `PlaceholderPage`:
  no page of the app used them, so no `ratings` table either (same rule as SoulSmoke).
- The app's page-wide text-selection lock and console banner: SoulSmoke's port dropped its equivalents, so this one did too.
- `unlock.mp3`, `hero-tahona.jpg` and 11 bottle photos: referenced by the code but never on the live site (Manus served
  an HTML page). Speakeasy uses the tahona photo instead; those bottles show a neutral placeholder.
- The Manus database (users, ratings, email_subscribers, partner_inquiries, subscriptions): not copied.

## Fixed from live (rule 20)

Home rendered the menu twice; dropdowns open on keyboard focus and tap; Flavor Finder's card no longer hangs off the
phone screen; Jalisco Map, Bottle Scanner and Speakeasy grow with their content instead of a fixed screen height;
Library's stretched link covered the whole page; Flavor Matrix dots are buttons (hover card opens on focus/tap);
paragraph gaps on the essay pages (the app's `prose` classes did nothing).

## Going live with real payments

Owner must supply live Stripe keys and approve pricing. Then: set `STRIPE_SECRET_KEY` (sk_live_),
`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_live_) and `STRIPE_WEBHOOK_SECRET` (from a live-mode webhook endpoint at
`https://tonygreenberg.com/api/liquid-sun/stripe-webhook` with the five events above) in Netlify; turn on the
customer portal in live mode (Stripe > Settings > Billing > Customer portal). The live product and prices are
created on the first checkout (lookup keys above).
