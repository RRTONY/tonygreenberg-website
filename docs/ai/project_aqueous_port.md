# Aqueous port (/aqueous)

Aqueous ("Know What Flows Through Your Life", the AWI water rating) was a separate Manus app
(`aqwaterqpr-wvzsc3ph.manus.space`). Its source was exported from Manus (`~/Downloads/aqueous` on the webmaster's
Mac: Vite + React 19 + wouter + tRPC + Drizzle/MySQL + Manus OAuth + Stripe SDK + Manus's built-in LLM). The owner
asked for it to be rebuilt on tonygreenberg.com with the **same UI, styles and animations, minus anything Manus**,
at `/aqueous`, as its own sub-site, the same way as LiquidSun (`project_liquidsun_port.md`, whose recipe this
follows). Ported 2026-11-24 on branch `feat/aqueous`.

## Where things live

| Original (Aqueous app) | Here |
| --- | --- |
| `client/src/App.tsx` router (21 routes) | `src/app/aqueous/**/page.tsx` (`/` → `/aqueous`, `/water/:id` → `/aqueous/water/[id]`, 8 static) |
| `client/src/index.css` | `src/app/aqueous/aqueous.css`: every selector under `.aqueous-root`, the app's light palette as shadcn tokens, `aq-` keyframes, light-only even in the site's dark mode |
| Google Fonts link | `src/lib/fonts/aqueous-fonts.ts` (Cormorant Garamond, DM Sans, JetBrains Mono) |
| `AWIProfileContext`, `ReferralContext`, `useAuth` | `src/components/aqueous/aqueous-providers.tsx` (`useAWIProfile`, `useReferral`, `useMember`; same localStorage keys) |
| `Navigation`, `Footer`, `ContentProtection`, `ReferralClaimModal` | `src/components/aqueous/` (rendered once in `src/app/aqueous/layout.tsx`) |
| `ShareButton`, `AWIBadge`, `QPRBadge`, `WaterCard`, `ui/button` | `src/components/aqueous/` (`share-button`, `awi-badge`, `qpr-badge`, `water-card`, `ui`) |
| pages | `src/components/aqueous/pages/` (Tap Water is a step registry under `pages/tap-water/`) |
| `lib/waterData.ts`, `awiEngine.ts`, `zipData.ts` | `src/lib/content/aqueous/water-data.ts`, `awi-engine.ts`, `zip-data.ts` (unchanged) |
| `SEOHead` `SEO` map | `src/lib/content/aqueous/seo.ts` (`AQUEOUS_SEO`, the app's own titles/descriptions word for word) + `structured-data.ts` |
| framer-motion | `src/components/aqueous/motion.tsx` (`Reveal` with Aqueous's 0px viewport, re-using LiquidSun's helpers) + tw-animate classes + `aq-bob` / `aq-sway` / `aq-ripple` |
| `server/routers.ts`, `db.ts`, `stripe.ts`, `products.ts` | `src/app/aqueous/actions.ts`, `src/lib/content/aqueous/aqueous-stripe.ts`, `products.ts` |
| Stripe webhook | `src/app/api/aqueous/stripe-webhook/route.ts` (`AQUEOUS_STRIPE_WEBHOOK_SECRET`, its own endpoint) |
| report generator (Manus LLM, background + polling) | `src/app/api/aqueous/reports/[id]/generate/route.ts`: Claude (`claude-haiku-5-5`) streamed to the page, saved when done; same prompt (`report-prompt.ts`) |
| `drizzle/schema.ts` | `supabase/migrations/0010_aqueous.sql` (RLS on, no policies; **not applied yet**) |
| homepage email capture (own table) | `/api/subscribe` (Kit), source `aqueous-homepage` → tag "Aqueous: Homepage" |
| images (Manus CDN) | Sanity; `src/lib/content/aqueous/images.ts` |

## Images

The app's 4 photos (hero, water drops, lab, spring) were **already deleted on Manus** (HTTP 403 "Unknown Key";
the live Manus site showed them broken too). The webmaster chose free Unsplash stand-ins on the same subjects
(ids in `images.ts`), uploaded to Sanity; Tony can swap the originals in. The 7 bottle photos the app
hot-linked from Unsplash are in Sanity too (`water-data.ts`). The app's own water-drop icons (192px and the 180px phone icon) are `src/app/aqueous/icon.png` and `apple-icon.png`, copied once from Manus (2026-11-24), so /aqueous pages show them.

## Changed on purpose (rule 20 and security)

- Removed: Manus OAuth/LLM/storage/analytics, `AIChatBox`, `DashboardLayout`, `ManusDialog`,
  `ComponentShowcase`, "The Way Out" (only on Manus: `thewayout-fciushx2`), fauxTony links (chatbot cancelled,
  owner 2026-10-09). Links to Tony's essays now open the same posts on this site's `/blog`.
- Server: a visitor who isn't signed in has no referral code (the app minted a useless one per page load);
  one referral claim per email, not your own code, flood guards; referral credit is held when a checkout
  starts and given back if it expires (the app never deducted it); a report needs a paid report purchase or
  the free one at 10 sign-ups (the app let any signed-in visitor make the $20 report for free); a failed
  report is retried, not replaced.
- UI fixes: referral popup remembers "dismissed" and is an accessible dialog; keyboard access on Collective Map
  dots, Integrity table, AWI rows; tables scroll inside their box at 375px; "More" menu opens on tap/focus.

## Not finished / needs the owner

- Apply `0010_aqueous.sql` (until then the pages work, but Directory projects, referrals, checkout, dashboard
  and reports can't save).
- Stripe: create the endpoint `https://tonygreenberg.com/api/aqueous/stripe-webhook` (events
  `checkout.session.completed`, `checkout.session.expired`, `customer.subscription.created|updated|deleted`) and set
  `AQUEOUS_STRIPE_WEBHOOK_SECRET` in Netlify; live keys + OK on $20 / $5 a month before real payments.
- Payment-success page copy still says the report "arrives in your inbox"; members now generate it from the
  dashboard (owner to decide wording). Tony's original photos.
