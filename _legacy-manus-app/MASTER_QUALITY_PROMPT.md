# MASTER QUALITY PROMPT — TonyG Site

**This is the governing quality standard for every page, component, and feature on this site.
Run this checklist BEFORE every checkpoint. No exceptions.**

---

## 1. NAVIGATION & INTERCONNECTIVITY (Zero Dead Ends)

- [ ] Every page has a visible way back to the homepage (logo, back link, or nav)
- [ ] Every standalone page (assessments, tools) has the StandaloneNav component
- [ ] Every page within Layout has the full site nav + footer
- [ ] Every assessment links to at least 2–3 related assessments at the end
- [ ] Every essay links to related essays and relevant assessments
- [ ] The "Find My" hub links to ALL assessments — no orphans
- [ ] Search indexes (SearchPalette + TonyDiscovery) include EVERY page on the site
- [ ] No 404 links anywhere — every href points to a real, content-filled page
- [ ] Footer appears on all Layout pages with site-wide links
- [ ] Mobile hamburger menu works and includes all major sections

## 2. VISUAL QUALITY (No Ugly, No Boring, No Black Holes)

- [ ] No plain black (#000 or #0A0A10) backgrounds without texture, imagery, or gradient
- [ ] Every assessment has a themed, immersive background (not generic dark void)
- [ ] Text is always readable against its background (contrast check)
- [ ] No widows (single words on a line) — minimum 2-3 words per line
- [ ] Consistent font stack: Playfair Display (headings), Source Sans 3 (body), DM Mono (labels)
- [ ] Consistent color palette: Gold #D4B96A, Dark #0A0A10, Parchment #FAFAF7, Warm #C4A882
- [ ] Images are high quality, properly sized, and loaded from CDN (not local)
- [ ] Loading states use skeletons or branded spinners (not blank white screens)
- [ ] Hover states on all interactive elements
- [ ] Smooth transitions between pages and states
- [ ] Mobile-first: every page looks great on phone FIRST, then desktop

## 3. CONTENT COMPLETENESS (No Empty Pages, No Placeholders)

- [ ] Every page linked in navigation has real content (not "Coming Soon")
- [ ] Every assessment has all questions, all archetypes, and full results
- [ ] Results pages show radar charts, descriptions, and next steps
- [ ] Email gates work and lead to actual results
- [ ] WhatsNext component appears at the end of every assessment
- [ ] JourneyTracker marks assessments complete when finished
- [ ] No placeholder text ("Lorem ipsum", "TODO", "Coming soon") visible to users

## 4. USER JOURNEY (Magical, Not Frustrating)

- [ ] First-time visitors see the welcome banner and 90-second tour option
- [ ] The "Three Doors" on the homepage lead to real, engaging content
- [ ] Assessment flow: Landing → Questions → Email Gate → Results → Next Steps
- [ ] Every results page suggests 2-3 related assessments to continue the journey
- [ ] "Pick Up the Phone" and "FauxTony" are accessible from every section
- [ ] Subscribe/newsletter capture is present but not aggressive
- [ ] The site feels like a cohesive experience, not disconnected pages

## 5. TECHNICAL HEALTH

- [ ] No TypeScript errors in the build
- [ ] No console errors in the browser
- [ ] All images load (no broken image icons)
- [ ] Pages load in under 3 seconds
- [ ] Lazy loading works for code-split pages
- [ ] Mobile viewport is correct (no horizontal scroll)
- [ ] All forms submit correctly
- [ ] Auth flow works (login, logout, session persistence)

## 6. INTERCONNECTIVITY MAP

Every page should connect to at least 2 other pages. The site is a web, not a tree.

```
Homepage ←→ Three Doors ←→ All Sections
    ↕
Find My Hub ←→ All Assessments ←→ Results → Related Assessments
    ↕
Essays ←→ Related Essays ←→ Related Assessments
    ↕
SoulScore ←→ Assessments ←→ Impact Tools
    ↕
Pick Up the Phone / FauxTony (accessible from everywhere)
```

## 7. PRE-CHECKPOINT RITUAL

Before EVERY checkpoint:
1. Run this entire checklist mentally
2. Check the 5 most recently changed pages in the browser
3. Test on mobile viewport (375px width)
4. Verify search includes all pages
5. Click through at least one complete user journey
6. Check for TypeScript errors
7. Verify no local file paths in code (all assets on CDN)

---

**RULE: If you can't get back to the homepage from any page, the page is broken.
If a page has a plain black background with no visual interest, the page is ugly.
If a page doesn't link to related content, the page is a dead end.
Fix all three before checkpointing.**
