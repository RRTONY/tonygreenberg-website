# Tony Greenberg — Manus Site Architecture & Domain Strategy

## Complete Inventory of All Known Manus-Built Sites

Based on a full audit of the tonygreenberg.com codebase, references, and project history, here is every Manus-built site associated with your ecosystem:

---

## Category A: STANDALONE BRANDS (Own Domain, Own Identity)

These are businesses or brands that should NOT roll up to tonygreenberg.com. They have their own audience, their own brand, and their own reason to exist independently.

| # | Site | Current URL | Recommended Domain | Reason |
|---|------|-------------|-------------------|--------|
| 1 | **RampRate** | ramprate.com | ramprate.com (already live) | Enterprise IT advisory — separate B2B brand, own clients, own team |
| 2 | **ImpactSoul** | impactsoul.is | impactsoul.is (already live) | Certified B Corp, tokenization platform — separate entity |
| 3 | **Homeaglow Exposed** | homeaglowexposed.com | homeaglowexposed.com (already live) | Consumer advocacy — intentionally distanced from personal brand for legal reasons |
| 4 | **Vancefolio** | portfoliofamilyoffice.manus.space | Needs custom domain (e.g., vancefolio.com) | Family office dashboard — confidential, password-protected, client-facing |
| 5 | **Clarisse Abelarde Art** | clarisseart-jyfqwtnv.manus.space | clarisseart.com or similar | Clarisse's portfolio — her brand, not yours |
| 6 | **Fix AI Pricing** | fix-ai-pricing.manus.space | fixaipricing.com or similar | Industry article/tool — could be RampRate-adjacent or standalone |

---

## Category B: ROLL UP TO TONYGREENBERG.COM (Content belongs under your personal brand)

These are Tony's personal creations, essays, tools, and passion projects. They should either live as pages/sections within tonygreenberg.com OR redirect their manus.space URLs to the corresponding tonygreenberg.com page.

| # | Site | Current URL | Should Live At | Status |
|---|------|-------------|---------------|--------|
| 7 | **Aqueous** (Water Intelligence) | aqwaterqpr-wvzsc3ph.manus.space | tonygreenberg.com/aqueous or keep as standalone microsite | Currently linked from portfolio |
| 8 | **SoulSmoke** (Mezcal) | mezcalagave-ahru9fq8.manus.space | tonygreenberg.com/soulsmoke or keep as microsite | Passion project |
| 9 | **LiquidSun** (Tequila) | tequilaazul-fxqrr3js.manus.space | tonygreenberg.com/liquidsun or keep as microsite | Passion project |
| 10 | **Flow Circuit** (Team Performance) | flowcircuit.manus.space | tonygreenberg.com/flow-circuit or keep as microsite | Assessment tool |
| 11 | **Consciousness Dashboard** | consciousness-jqfqwzxn.manus.space | tonygreenberg.com/consciousness or keep as microsite | Personal tool |
| 12 | **Regenerative Protocol** | regenhealth-4nns6jnd.manus.space | tonygreenberg.com/regen-protocol or keep as microsite | Health protocols (restricted) |
| 13 | **The Gem Spark** (Serendipity essay) | serensynch-2agjfwhe.manus.space | tonygreenberg.com/blog/[slug] | Narrative essay — belongs in blog |
| 14 | **Human OS V2.0** | humanosv2-gxa9fnfu.manus.space | tonygreenberg.com/humanos (already integrated) | Already lives on tonygreenberg.com |
| 15 | **Intimacy Intelligence (UIIA)** | intimacyassess-tcir3hon.manus.space | tonygreenberg.com/intimacy-assessment or keep as microsite | Assessment tool |
| 16 | **Sake Guide** | sakeguide-sqt7xzxp.manus.space | tonygreenberg.com/find-your-sake (already integrated) | Already searchable on tonygreenberg.com |
| 17 | **Find My Assessments** | findmyassess-9eekxcob.manus.space | tonygreenberg.com/find-your-* (already integrated) | Religion/Spirituality finders — already on main site |
| 18 | **Find My STEM** | findmystem-s3lknc4h.manus.space | tonygreenberg.com/find-your-* | Assessment tool |
| 19 | **Sacred Waters** | sacredh2o-2vtjxat8.manus.space | Superseded by Aqueous (#7) | Older version — redirect to Aqueous |
| 20 | **Sacred Waters (v2)** | sacredwaters-x4bqmkxb.manus.space | Superseded by Aqueous (#7) | Older version — redirect to Aqueous |
| 21 | **SoulSmoke (older)** | soulsmoke-9yjr0bq0.manus.space | Superseded by #8 | Older version |
| 22 | **Regen Protocol (older)** | regenprotocol-2kxfwp7h.manus.space | Superseded by #12 | Older version |
| 23 | **Flow Circuit (older)** | flowcircuit-7ij0gy6c.manus.space | Superseded by #10 | Older version |
| 24 | **Toll Roads article** | tonygreenb-gpx9gzsf.manus.space | Already migrated to tonygreenberg.com/blog | Content absorbed |

---

## Category C: THE MAIN HUB

| # | Site | Domains | Role |
|---|------|---------|------|
| 25 | **TonyGreenberg.com** | tonygreenberg.com, www.tonygreenberg.com | Personal brand hub — everything rolls up here |
| — | *(management only)* | tonygreenberg.manus.space, tonygreenb-gxhndhxp.manus.space | CMS/management — redirect to tonygreenberg.com, never shown to public |

---

## Recommended Actions

### Immediate (Do Today)
1. **tonygreenberg.com** — I've already implemented the manus.space → tonygreenberg.com 301 redirect. Done.
2. **All Category B microsites** — Each one should have its manus.space URL blocked from indexing (add `<meta name="robots" content="noindex">` or redirect to tonygreenberg.com equivalent)

### Short-Term (This Week)
3. **RampRate** — Needs the same manus.space redirect treatment (separate project, separate session)
4. **Vancefolio** — Get a custom domain; it's client-facing and shouldn't show manus.space
5. **Clarisse's site** — Get her a proper domain (clarisseart.com or similar)

### Medium-Term (This Month)
6. **Consolidation decision** — For each Category B microsite, decide: keep as standalone microsite with custom domain, OR absorb fully into tonygreenberg.com as a page/section
7. **Kill deprecated versions** — Sites #19-24 are old versions that have been superseded. Set them to private or redirect.

---

## Token-Efficient Operating Model

| Task | Method | Token Cost |
|------|--------|-----------|
| Text edits on any site | Visual Editor in Management UI | **Zero** |
| Blog post updates | Edit JSON/files in Code panel | **Zero** |
| Style/color changes | Visual Editor | **Zero** |
| New features, new pages | Chat with Manus AI | Normal |
| Domain/redirect changes | Settings → Domains in Management UI | **Zero** |
| Database queries | Database panel in Management UI | **Zero** |

**The CMS workflow:** manus.space is your back-office. The public never sees it. Darryl uses the Management UI (Visual Editor + Code panel) for day-to-day changes at zero token cost. You use the AI chat only when you need new features built.

---

## Webmaster Access for Darryl

To give Darryl management access to each site:
1. Log into manus.im with your owner account
2. For each project, check Settings for collaborator/team access
3. If no collaborator option exists, submit a request at https://help.manus.im for team/collaborator access

Alternatively, Darryl can make zero-token edits through the Visual Editor and Code panel if he has access to the Management UI for each project.
