# STATUS.md — Tony Greenberg Site

> **Living document.** Update this at every checkpoint. Last updated: 2026-04-01.

---

## What This Is

A **creative workshop and mothership** — everything is prototyped here first, then carved into standalone sites. Partly a `tonygreenberg.com` migration, but must be fully independent of Manus infrastructure.

**Five roles in one codebase:**
1. Personal brand hub — editorial magazine, manifesto, 7 Doors homepage
2. Human OS 2.0 — 18+ self-assessment/discovery tools
3. Movement platform — Attention Theft, Measurement of Becoming, crusades, ecosystem
4. Prototype lab — BrewSoul, Kava, PRI, Peptide Watch prototype here before spinning off
5. Anti-spam weapon — Spamtoast / YouveBeenReported

**Status:** Private beta. noindex/nofollow active. Being reviewed by ~20 trusted friends before going live on `tonygreenberg.com`.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS 4 |
| Routing | Wouter |
| Server | Express 4 + tRPC 11 |
| DB | MySQL via Drizzle ORM |
| Auth | Custom (migrated off Manus OAuth) |
| LLM | OpenAI (migrated off Manus invokeLLM) |
| Storage | AWS S3 (migrated off Manus storagePut/Get) |
| Payments | Stripe (integrated, currently disabled — paywall off) |
| Testing | 333 tests passing across 28 files |
| Build | ~975KB bundle / 270KB gzip |

---

## Infrastructure Migration (Manus → Independent)

- [x] Manus OAuth → real auth
- [x] invokeLLM → OpenAI
- [x] storagePut/Get → AWS S3
- [ ] `.manus.space` → `tonygreenberg.com` *(pending — remove noindex when ready)*

---

## DONE

### Blog Engine
- 90 posts (target: 109), search, category filters, reading time, hero images
- Reactions, sharing, reading progress bar, drop caps, pull quotes
- Content protection: robots.txt (blocks GPTBot/CCBot), no copy/paste, no print-to-PDF, anti-AI meta tags

### Assessments (18+)
- FindYourMe, FindYourCoffee, FindYourTherapy, FindYourSake, FindYourSpirit, FindYourReligion, FindYourDiet, FindYourMovement, FindYourSleep, FindYourKitchen, FindYourStyle, FindYourAttachmentStyle, FindYourLoveLanguage, FindYourPeptide, FindYourSexuality
- SoulScore, DharmaFinder, ConsciousnessScale, GrantStudy, PRI Assessment
- All: email gates, radar charts, PDF export, share-with-Tony, themed results

### Specialty Platforms
- **PRI Encyclopedia** — 10 modules (drug interactions, kavalactone science, iboga deep dive, mescaline deep dive, facilitator cert, etc.)
- **Kava Encyclopedia** — 10 modules standalone
- **BrewSoul** — 20+ pages (city guides, roaster directory, comparison tool, quiz, wall of shame, guest series)
- **Attention Theft Manifesto** — 6 pages (economics table, AI blocker finder, legal arsenal, weapons, wall of shame, report system)
- **Spamtoast / YouveBeenReported** — jumpscare, 3-hour countdown, fake webcam, law enforcement progress bar, $1K fine, cease-and-desist

### Platform Infrastructure
- FauxTony AI chatbot (3-question limit, session memory, Tony's voice)
- Admin dashboards: assessments, spam tracking, spam link generator, analytics
- Authentication, Stripe (integrated, paywall currently off)
- Email capture (exit-intent popup, newsletter signup, subscriber tracking)
- SEO: meta tags, Open Graph, noindex active (beta), sitemap, robots.txt
- Full mobile-first responsive design
- Behavioral overlays: exit intent, commitment escalation, floating prompts, typewriter effects
- Search palette (Cmd+K) across all content
- 333 tests passing, zero TS errors

---

## IN PROGRESS (80–90%)

- **Article footer standardization** — target format: exercise, 3 related articles, riddle, further reading, CTA — partially applied
- **Partner quotes / social proof** — strip exists, full integration across all sections ~80% done
- **Reading paths** — "Up Next" chains exist, need strategic curation
- **Inline cross-references** — target 2–3 per blog post; partially done
- **Blog post count** — 90 of 109 target posts written

---

## NOT STARTED / GAPS

| Priority | Item |
|---|---|
| 🔴 HIGH | **Assessment background theming** — 18/20 assessments have plain black backgrounds; audit score 3–6/10; need unique themed visuals per domain |
| 🔴 HIGH | **Dead-end assessment pages** — sake, therapy, love-language, soulscore lack next-step navigation |
| 🟡 MED | **Lead magnet → drip sequence** — email capture not wired to ConvertKit/Kit |
| 🟡 MED | **FauxTony analytics dashboard** — conversation metrics, topic clustering not built |
| 🟡 MED | **Content curation** — low-energy blog posts identified but not removed |
| 🟡 MED | **19 remaining blog posts** — to reach 109 target |
| 🟢 DEFERRED | **Flow Circuit Diagnostic** — percentage scoring, user blend viz — deferred to separate Flow Circuit site |
| 🟢 DEFERRED | **Remove noindex** — when ready to launch on tonygreenberg.com |

---

## Quality Gates

Before every checkpoint, run through:
- [`MASTER_QUALITY_PROMPT.md`](MASTER_QUALITY_PROMPT.md) — 7 governance standards (no dead ends, no plain black backgrounds, no placeholder text, every page links to 2+, mobile tested)
- [`QA_MASTER_PROMPT.md`](QA_MASTER_PROMPT.md) — Typography clamps, WCAG AA contrast, readability (Flesch 50–70), 44px touch targets
- [`ADMIN-FOOTER-PACKAGE.md`](ADMIN-FOOTER-PACKAGE.md) — 16-point publishing checklist for every blog post

---

## Immediate Next Steps

1. **Theme assessment backgrounds** — each of the 18 plain-black assessments needs a unique, immersive visual treatment matching its domain
2. **Fix dead-end pages** — add next-step links to sake, therapy, love-language, soulscore
3. **Standardize article footers** — apply exercise + 3 related articles + riddle + CTA to all 90 posts
4. **Wire lead magnet to email service** — connect capture to ConvertKit/Kit drip sequence
5. **Build FauxTony analytics dashboard** — conversation metrics, topic clustering
6. **Write 19 remaining blog posts** — reach 109 target
7. **Final launch prep** — remove noindex, point to tonygreenberg.com
