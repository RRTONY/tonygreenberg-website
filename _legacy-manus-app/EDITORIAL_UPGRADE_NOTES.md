# Editorial Upgrade Notes — "When Healing Becomes Extraction"

## Goal
Vanity Fair / Atlantic level editorial experience for slug: when-healing-becomes-extraction only.

## Fonts Available
- Fraunces (serif, display) — opsz 9..144, wght 400/700/900
- Playfair Display (serif) — wght 400/700, italic 400
- Source Serif 4 (serif, body) — opsz 8..60, wght 400/600, italic
- Source Sans 3 (sans) — wght 300/400/600/700
- DM Mono (mono) — wght 400
- Space Grotesk (sans) — wght 400/500/600/700

## Current Issues to Fix

1. **Hero too short** — `clamp(320px, 50vh, 600px)` → needs `100vh` desktop, `80vh` mobile
2. **Title in hero too small** — `clamp(1.8rem, 4vw, 3rem)` → needs `clamp(2.8rem, 6vw, 5rem)`
3. **Meta row cluttered** — format tag + date + category + read time + validity score all compete
4. **Deck/summary** — left-border italic → needs centered standfirst treatment
5. **Body text column too wide** — 780px → 680px for optimal reading
6. **Section headings too small** — `clamp(1.5rem, 2.5vw, 1.9rem)` → `clamp(1.8rem, 3vw, 2.4rem)`
7. **Pull quotes need drama** — centered, oversized italic, em-dash attribution
8. **Blockquotes** — left-border → centered italic treatment
9. **HR dividers** — `---` → ornamental three-dot (· · ·) in gold
10. **Drop cap** — already exists, good
11. **Line height** — 1.85 → 1.95 for body paragraphs

## Implementation Strategy
- Detect `post.slug === "when-healing-becomes-extraction"` in BlogPost.tsx
- Apply slug-specific overrides to:
  - Hero section (full-viewport height)
  - Meta/byline/standfirst area
  - ArticleContent wrapper (680px column, elevated styles)
  - Pass `isElevated` prop to ArticleContent
- Inside ArticleContent, when `isElevated`:
  - Larger headings
  - Centered pull quotes
  - Centered blockquote treatment
  - Ornamental dividers
  - Wider body text

## Key Selectors to Edit in BlogPost.tsx
- Line 1383: hero div height
- Line 1393: h1 in hero overlay
- Line 1400: section maxWidth
- Line 1536: summary/deck paragraph
- Line 791-795: ArticleContent wrapper maxWidth
- Line 966-984: h2 heading styles
- Line 947-965: h3 subheading styles
- Line 935-946: hr divider
- Line 212-238: ArticlePullQuote component
- Line 478-519: QuoteGroup component
- Line 1080-1093: body paragraph styles
- Line 1045-1076: first paragraph / drop cap
