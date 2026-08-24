# Master QA Prompt — TonyG Site

## Purpose

This document is the permanent quality assurance protocol for every page on tonygreenberg.manus.space. It must be consulted and applied before any page is shipped, checkpointed, or presented to the user. No exceptions.

---

## 1. Mobile-First Typography (MANDATORY)

Every font size decision starts at 375px viewport width (iPhone SE). If it cannot be read comfortably on a phone held at arm's length, it fails.

| Element | Minimum Mobile Size | Desktop Max | Format |
|---|---|---|---|
| H1 (page title) | 2rem (32px) | 3.5rem | `clamp(2rem, 6vw, 3.5rem)` |
| H2 (section heading) | 1.8rem (28.8px) | 3rem | `clamp(1.8rem, 5vw, 3rem)` |
| H3 (subsection) | 1.4rem (22.4px) | 2.2rem | `clamp(1.4rem, 4vw, 2.2rem)` |
| Body text | 1.05rem (16.8px) | 1.2rem | `clamp(1.05rem, 2.8vw, 1.2rem)` |
| Card body text | 1rem (16px) | 1.1rem | Minimum `1rem` |
| Labels / eyebrows | 0.8rem (12.8px) | 0.9rem | `clamp(0.8rem, 2vw, 0.9rem)` |
| Mono / metadata | 0.82rem (13.1px) | 0.95rem | Minimum `0.82rem` |
| Badges / tags | 0.78rem (12.5px) | 0.85rem | Minimum `0.78rem` |
| Buttons | 0.95rem (15.2px) | 1.05rem | `clamp(0.95rem, 2.5vw, 1.05rem)` |
| Input fields | 1rem (16px) | 1.1rem | Minimum `1rem` (prevents iOS zoom) |

**Hard rule: No font size below 0.78rem (12.5px) anywhere on the site. Period.**

**Line height minimums:**
- Body text: 1.75 minimum (1.8 preferred)
- Headings: 1.15 minimum
- Cards: 1.6 minimum
- Labels: 1.4 minimum

**Widow prevention:** No line should end with fewer than 3 words on any device. Use CSS `text-wrap: balance` on headings and `text-wrap: pretty` on body text where supported.

---

## 2. Color Contrast (WCAG AA Mandatory, AAA Preferred)

Every text-on-background combination must pass WCAG AA (4.5:1 for body text, 3:1 for large text). Test with actual computed colors, not assumptions.

| Combination | Required Ratio | Status Check |
|---|---|---|
| Light text on dark bg (`#F0EAE0` on `#0C0C18`) | 14.8:1 | Passes AAA |
| Muted text on dark bg (`#C8BFB0` on `#0C0C18`) | 10.2:1 | Passes AAA |
| Sub text on dark bg (`#A89E90` on `#0C0C18`) | 6.8:1 | Passes AA |
| Dark text on light bg (`#1A1A2E` on `#FAF7F2`) | 14.1:1 | Passes AAA |
| Muted text on light bg (`#4A4A5A` on `#FAF7F2`) | 7.2:1 | Passes AA |
| Gold accent (`#E8B820`) on dark bg | 7.4:1 | Passes AA |
| Red accent (`#FF4136`) on dark bg | 4.6:1 | Passes AA (large text only) |
| Green accent (`#2D8A56`) on dark bg | 4.2:1 | Borderline — use for large text/headings only |
| Red on light bg (`#CC2200` on `#FAF7F2`) | 6.8:1 | Passes AA |

**Rules:**
- Never use accent colors (gold, red, green) for body text smaller than 1.1rem
- Always pair `bg-*` with explicit `text-*` — never rely on inheritance
- Test glassmorphism overlays: text on `rgba()` backgrounds must still pass contrast when the background image is fully loaded
- On image overlays: minimum 60% opacity dark gradient before placing text

---

## 3. Image Quality and Visibility

Every image must be visible, loaded, and purposeful. No ghost images at 8% opacity pretending to be decoration.

| Check | Requirement |
|---|---|
| Image loads | HTTP 200, renders on mobile Safari, Chrome, Firefox |
| Image is visible | Opacity minimum 0.3 for background images, 1.0 for content images |
| Image has alt text | Descriptive, not empty string (unless purely decorative divider) |
| Image aspect ratio | Responsive — no fixed `height` without `object-fit: cover` |
| Image file format | WebP preferred, PNG fallback. No broken URLs |
| Glassmorphism images | Must be prominent section headers, not invisible wallpaper |
| Hero images | Full-width, max-height clamped, gradient fade at bottom |
| CDN delivery | All images served from CDN, not local filesystem |

**Style requirements:**
- Japanese minimalism meets sacred geometry
- Glitched finish where appropriate (reflects "Be the Glitch" theme)
- Metaphorical elevation — images should make you think, not just fill space
- Provocative, cutting-edge, mind-expanding aesthetic
- No stock photo energy. No corporate clip art. No generic gradients pretending to be imagery.

---

## 4. Readability Index

Every page must score well on these readability dimensions. This is not optional.

| Dimension | Target | How to Verify |
|---|---|---|
| Flesch Reading Ease | 50-70 (accessible but not dumbed down) | Run content through readability scorer |
| Average sentence length | 15-25 words | Manual check on key paragraphs |
| Paragraph length | 2-4 sentences max | Visual scan |
| Line length (measure) | 55-75 characters per line | `max-width` on text containers |
| Spacing between sections | Minimum 3rem padding | Visual check on mobile |
| Touch targets | Minimum 44x44px | All buttons, links, interactive elements |
| Scroll depth indicators | Present on long pages | Progress bar or section markers |

---

## 5. Influence and Credibility Scoring

Every claim, every statistic, every assertion on the site must be grounded. Rate each page section:

| Credibility Factor | Score (1-10) | Requirements |
|---|---|---|
| Source attribution | 8+ required | Named sources, linked references, dated evidence |
| Scientific backing | 7+ required | Peer-reviewed where applicable, named researchers |
| Legal defensibility | 9+ required | Timestamped, documented, factual, no defamation risk |
| Emotional resonance | 8+ required | Moves the reader without manipulating |
| Authority positioning | 8+ required | Tony's expertise clearly established, not assumed |
| Social proof | 7+ required | Real testimonials, real clients, real outcomes |
| Transparency | 9+ required | Disclaimers present, conflicts disclosed, opinions labeled |

**For the VerifiedTribe / CheshireGrin page specifically:**
- Every claim about the subject must have documentary evidence cited
- Every legal assertion must include disclaimer ("not legal advice")
- The SunlightProtocol must reference its ethical framework sources (Byron Katie, Tristan Harris)
- Red flags must be generalizable, not just case-specific

---

## 6. Scientific and Research Validation

When the site references science, medicine, psychology, or data:

| Check | Requirement |
|---|---|
| Named studies | Full citation: author, year, journal, DOI where available |
| Statistics | Source, sample size, methodology noted |
| Medical claims | FDA status, clinical trial phase, safety disclaimers |
| Psychological frameworks | Named originator, publication, peer review status |
| Consciousness/Hawkins scores | Clearly labeled as "framework-based assessment, not clinical measure" |
| PRI medicine data | Receptor pharmacology sourced, safety data referenced, legal status current |
| Dosage information | Harm reduction context, not medical advice disclaimer |

---

## 7. Navigation and Flow (No Dead Ends)

| Check | Requirement |
|---|---|
| Home button | Always visible, always works, on every page |
| Site Index link | In footer or WhereNext component on every page |
| "Keep Going" suggestions | 2-3 contextual next pages at bottom of every page |
| Back navigation | Browser back works, no broken history states |
| Breadcrumbs | On deep pages (PRI medicine details, blog posts) |
| Cross-linking | Every page links to at least 2 other pages |
| Search accessibility | Cmd+K or Tony avatar search reachable from every page |
| Mobile menu | Hamburger menu with all major sections, works on all pages |

---

## 8. Performance and Technical

| Check | Requirement |
|---|---|
| TypeScript | Zero errors (`npx tsc --noEmit` clean) |
| Tests | All vitest tests passing |
| Lighthouse Performance | 80+ on mobile |
| Largest Contentful Paint | Under 2.5s |
| Cumulative Layout Shift | Under 0.1 |
| First Input Delay | Under 100ms |
| Image lazy loading | All below-fold images use `loading="lazy"` |
| Font loading | Display swap, preloaded, no FOIT |
| Bundle size | Code-split by route, no single chunk over 500KB |

---

## 9. Aesthetic Alignment

Every page must pass the aesthetic filter. This is Tony's brand — not generic, not corporate, not "classy."

| Aesthetic Dimension | Target |
|---|---|
| Japanese minimalism | Clean lines, intentional whitespace, nothing superfluous |
| Sacred geometry | Subtle geometric patterns in backgrounds, dividers, or imagery |
| Glitched finish | Controlled imperfection in images and transitions |
| Anti-frilly | No decorative flourishes, no cursive, no ornamental borders |
| Rule-breaking UX | At least one unconventional interaction per page |
| Movement | Parallax, fade-ins, scroll-triggered reveals — the site breathes |
| Color palette | Natural high-contrast: parchment, ink, saffron, terracotta. No blue+gold combo |
| Typography | Fraunces display, Cabinet Grotesk body, DM Mono accents. Consistent everywhere |
| Emotional temperature | Warm but sharp. Inviting but challenging. Never cold, never soft |

---

## 10. Pre-Checkpoint Ritual

Before every `webdev_save_checkpoint`, execute this sequence:

1. **Read todo.md** — verify all completed items marked `[x]`
2. **Run `npx tsc --noEmit`** — zero errors
3. **Run `pnpm test`** — all tests passing
4. **Mobile screenshot check** — view key pages at 375px width
5. **Font size audit** — grep for any `fontSize` below `0.78rem`
6. **Contrast spot-check** — verify text is readable on 3 random sections
7. **Image load check** — verify all images return HTTP 200
8. **Navigation check** — confirm WhereNext component renders on the page
9. **Widow check** — scan headings and key text for single-word orphan lines
10. **Credibility check** — verify sources are cited for factual claims

**If any check fails, fix it before checkpointing. No exceptions.**

---

## Application

This prompt applies to:
- Every new page created
- Every page redesign
- Every content update that touches UI
- Every checkpoint before delivery

The agent must reference this document at the start of every design or content task. It is not a suggestion. It is the standard.
