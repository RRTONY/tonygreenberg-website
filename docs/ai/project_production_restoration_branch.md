# The Manus "production-restoration" branch (reviewed 2026-09-29)

> `origin/manus/production-restoration-2026-09-10` was a 57-commit branch made by the Manus agent (2026-09-09 to 09-22). It shares no git history with `main`. It was audited, the useful parts were carried over by hand, and the rest was deliberately left out.

**What it was:** Manus re-bootstrapped its own copy of this app on 2026-09-09 and kept working on
it. It removed Sanity (in favor of a Manus-managed MySQL via drizzle), removed the Netlify config
(in favor of Docker/standalone), added Vitest and Prettier, and served "recovered" images from
Manus-only `/manus-storage/` paths. That's the opposite of this repo's architecture and its
zero-Manus rule, so it could never be merged.

**Carried over (2026-09-29):**
- `/skippy` and `/ecosystem-map`, ported from the **legacy** source (the branch had trimmed
  Skippy's destination list and rewritten both pages' copy), using this repo's localStorage
  journey store instead of the branch's database-backed visitor state.
- `/subscribe`, legacy copy, working Kit signup, paid tiers informational only. This also fixed a
  live 404 (`/the-letter` already linked to `/subscribe`).
- Length caps on `/api/subscribe` (not the origin check, and not its database write).
- Charity Navigator rating shown as "3 / 4" instead of "3★".
- Its useful docs, archived with a warning banner in `docs/ai/archive/` (sitemap parity audit,
  171-image media manifest, icon audit, live-site inventory, reference-repo parity audit).

**Not carried over, on purpose:** Docker/standalone, Netlify removal, drizzle/MySQL/visitor-state
API, Vitest/Prettier (new dependencies), `app-router-props.d.ts` (Next 16's generated `PageProps`
already does this), its `/medicine-sequencing` (ours keeps legacy copy and is crawlable), and every
`/manus-storage/` or `/api/img/` URL.

**Its "recovered" images:** the nine `/manus-storage/*.webp` files were the same pictures `main`
already serves from Sanity (visually identical, re-encoded). Sanity's copies are JPEG bytes under a
`.webp` name, which is harmless because `next/image` re-encodes. Nothing to rescue there. The real
rescue was separate: see `manus-media-rescue.md`.

**Needs the owner's decision (not done):** every content-policy edit the branch made to Tony's
copy. main still has all the originals, matching legacy:
1. Quotes attributed to a named clinician (Dr. Beverly Reader, with her phone number) in the PRI
   medicine modal. Confirm permission or remove.
2. 6 PRI and 4 Facilitator Index testimonials with only initials. Possibly fabricated. Confirm or remove.
3. Star ratings (e.g. "4.8★") attached to named real people on `/peptide-matrix`.
4. `/impact-dashboard` claims ("Certified B Corp", "live token ecosystems", "working system").
5. Legal Arsenal: two invented "Proposed" bills presented alongside real law.
6. Rewrites of Tony's gratitude essay (a Sanity post) and the Attention Theft letter. Owner only.
7. 9 legacy sitemap URLs (`/connect`, `/library`, `/seven-doors`, ...) that the branch redirected
   to `/`. The live site gives them distinct titles, so better targets may exist. Redirect-map call.
8. 6 `JOURNEY_MAP` links go to Tony's own `*.manus.space` apps (chemistry, water, partner, mezcal,
   tequila, capital). Keep, move, or drop before Manus is shut off.
EOF
cd /Users/dharmketsavani/Desktop/tonyg-site && python3 - <<'EOF'
p="NEXTJS-MIGRATION-TODO.md"
s=open(p).read()
import re
def tick(prefix, text):
    global s
    lines=s.split("\n")
    for i,l in enumerate(lines):
        if l.startswith(prefix):
            lines[i]=text; s="\n".join(lines); return
    raise SystemExit("missing "+prefix)
tick("- [ ] `/skippy`", "- [x] `/skippy` — SkippyMap.tsx. Ported 2026-09-29 from the legacy source, full destination list and copy unchanged. It was unblocked because 34 of its 38 destinations now exist. The other 4 (`/friend-gate`, `/post-intervention`, `/pri-research`, `/thought-cloud`) show \"Coming Soon\" instead of a broken link. `/the-index`, `/cheshire-grin` and `/life-assessment` now link straight to their redirect targets. Progress is kept in localStorage under legacy's key, read hydration-safely. Emoji are replaced with Lucide icons. `noindex` because it's a personal page for one named person, and legacy had no SEO tags on it. A Manus branch had its own version with a trimmed list and rewritten copy, not used (see `docs/ai/project_production_restoration_branch.md`). Verified with a production build: 200, noindex, and every non-null link resolves to a real route.")
tick("- [ ] `/ecosystem-map`", "- [x] `/ecosystem-map` — EcosystemMap.tsx. Ported 2026-09-29 with legacy copy (6 phases, 18 experience descriptions, closing CTA). URLs and completion come from the shared `JOURNEY_MAP`/`useJourneyProgress` in `components/assessments/journey-tracker.tsx`. All 18 IDs resolve. Collapsed phases are hidden with CSS rather than unmounted, so all descriptions are in the server HTML. 6 experiences still link to Tony's own `*.manus.space` apps, same as /my-journey; that's an owner decision. Verified with a production build: 200, all copy in the server HTML.")
tick("- [ ] `/shop`, `/subscribe`", "- [x] `/subscribe` — Subscribe.tsx. Ported 2026-09-29: legacy copy, a working free signup through `/api/subscribe` (Kit, with a mailto fallback, same as the popup), and the $99/yr membership and $27 compilation shown as information only with no checkout. This fixed a live 404, because `/the-letter` already linked here. `/api/subscribe` also got input length caps.\n- [ ] `/shop`, `/payment-success`, `/payment-cancel` — **defer**: these are Stripe-backed; flag for the later billing-migration phase, do not port checkout logic yet, static/informational content only if ported now")
anchor="## Phase 13 — Images Needed in Sanity\n"
add=anchor+'''
- [x] **Manus media rescue (2026-09-29):** all 94 Manus-hosted image/video references in the legacy source (`/api/img/*`, `/manus-storage/*`) were checked live. **91 were still downloadable, including the `/akbar` photos the entry below calls "permanently lost"**, and all 91 are now Sanity assets (`scripts/rescue-manus-media.ts`; Sanity dedupes by SHA-1). 3 were gone (HTTP 502). The manifest `docs/ai/manus-media-rescue.md` maps each one to the legacy files that used it and its Sanity URL. They are **not wired into pages yet**: go page by page, with real alt text. `/facilitator-index`'s two diagrams are done (`scripts/rescue-facilitator-images.ts`).
'''
assert anchor in s
s=s.replace(anchor,add,1)
open(p,"w").write(s)
EOF
grep -n "akbar" NEXTJS-MIGRATION-TODO.md | head -3 | cut -c1-120