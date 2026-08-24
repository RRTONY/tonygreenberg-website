# Design Brainstorm — Tony Greenberg Personal Site

<response>
<text>

## Idea 1: "The Folio" — Editorial Broadsheet

**Design Movement**: Inspired by long-form editorial design from The New Yorker, Monocle, and Kinfolk — where typography leads and content breathes. A broadsheet newspaper reimagined for the web.

**Core Principles**:
1. Content-first hierarchy — text is the hero, images are punctuation
2. Asymmetric column layouts that break the grid intentionally
3. Warm materiality — paper-like textures, ink-like type, tactile feel
4. Progressive disclosure — content reveals itself as you scroll

**Color Philosophy**: Warm parchment (#FAFAF7) as canvas, near-black (#111) as ink, antique gold (#8B6914 → #D4B96A spectrum) as editorial accent — evoking aged paper, brass fixtures, and the warmth of a well-lit study. The gold is never decorative — it signals importance, like a gilded page edge.

**Layout Paradigm**: Single-column editorial flow with occasional full-bleed dark strips that break rhythm. Content sections alternate between intimate reading width (780px) and expansive dark-background showcases (full-width). Navigation floats as a frosted-glass sticky bar.

**Signature Elements**:
1. Gold left-border pull quotes that feel like marginalia
2. Dark "adage strips" — cinematic interruptions with quotes on near-black backgrounds
3. Numbered "door cards" that indent on hover, suggesting physical doors opening

**Interaction Philosophy**: Subtle and purposeful — hover states that suggest rather than shout. Cards lift gently, text shifts left as if making room. No bouncing, no spinning, no confetti. The interaction language says "I'm paying attention to you."

**Animation**: Fade-in-up on scroll entry (8px translateY, 300ms ease). Page transitions use a gentle opacity crossfade. Hover states use 200-300ms transitions. No parallax — the content IS the spectacle.

**Typography System**: Playfair Display (serif) for headlines — elegant, high-contrast, literary. Source Sans 3 for body — clean, readable, professional. DM Mono for labels/tags — technical precision, like typewriter annotations on a manuscript.

</text>
<probability>0.08</probability>
</response>

<response>
<text>

## Idea 2: "The Vault" — Brutalist Transparency

**Design Movement**: Neo-brutalist web design meets Swiss typography — raw, honest, structural. Think Bloomberg Terminal meets a gallery catalog. Exposed grid, monospaced type, stark contrasts.

**Core Principles**:
1. Radical transparency — structure is visible, nothing is hidden
2. Information density without clutter — every pixel earns its place
3. Monochrome foundation with surgical color interventions
4. Grid as architecture — visible lines, explicit columns

**Color Philosophy**: Pure white (#FFFFFF) and pure black (#000000) as the foundation. A single accent: electric amber (#FFB800) used sparingly — like a highlighter on a legal document. No gradients. No soft edges. Color is a decision, not a decoration.

**Layout Paradigm**: Visible 12-column grid with content blocks that snap to columns. Sidebar navigation on the left (always visible). Content flows in a newspaper-column style with explicit section breaks using horizontal rules.

**Signature Elements**:
1. Visible grid lines that fade on scroll
2. Monospaced section headers with ALL-CAPS and extreme letter-spacing
3. "Redacted" text blocks for confidential content — actual black bars

**Interaction Philosophy**: Click-to-reveal. Sections start collapsed. The user builds their own reading experience. Hover states are instant — no easing, no delay. Binary: on or off.

**Animation**: None by default. Content appears instantly. Optional: a single typewriter effect on the hero tagline. Motion is reserved for functional feedback only (loading states, form submissions).

**Typography System**: Space Grotesk for headlines — geometric, modern, authoritative. IBM Plex Mono for everything else — the entire site feels like a terminal readout. No serif fonts. Readability through spacing, not style.

</text>
<probability>0.04</probability>
</response>

<response>
<text>

## Idea 3: "The Salon" — Warm Maximalist Storytelling

**Design Movement**: Inspired by 1970s Penguin book covers meets contemporary storytelling platforms like The Atavist. Rich, warm, layered — like walking into a room full of interesting objects and conversations.

**Core Principles**:
1. Narrative flow — the site reads like a book, not a brochure
2. Layered depth — overlapping elements, stacked cards, z-axis play
3. Warm chromatic richness — earth tones, aged metals, deep shadows
4. Personal voice — the design itself has personality and opinion

**Color Philosophy**: Deep espresso (#1A1410) as primary dark, warm cream (#F5EDE0) as light, burnished copper (#B87333) as accent, forest green (#2D5F3A) for links — evoking a leather-bound study with brass lamps and green-glass reading lights. The palette says "sit down, stay a while."

**Layout Paradigm**: Staggered card layout with overlapping elements. Hero sections use large-scale photography with text overlays. Content sections alternate between left-aligned narrative blocks and right-floating sidebar annotations. Cards stack and overlap slightly, creating depth.

**Signature Elements**:
1. "Torn paper" edges on section dividers — organic, handmade feel
2. Circular portrait frames with thick borders — like cameos or medallions
3. Floating annotation bubbles that appear on hover — like marginalia in a used book

**Interaction Philosophy**: Exploratory and rewarding. Hover reveals hidden layers. Scroll triggers subtle parallax on background elements. Cards fan out like a hand of playing cards. The site rewards curiosity.

**Animation**: Staggered entrance animations (each card delays 100ms after the previous). Smooth scroll-linked opacity changes. Background elements move at 0.5x scroll speed. Hover states expand cards with a spring-physics ease.

**Typography System**: Libre Baskerville for headlines — warm, literary, trustworthy. Nunito Sans for body — friendly, open, approachable. Courier Prime for quotes and asides — like handwritten notes in the margin.

</text>
<probability>0.06</probability>
</response>

---

## Selected Approach: Idea 1 — "The Folio" (Editorial Broadsheet)

This approach most faithfully honors the existing design template provided by Tony, which already uses Playfair Display, Source Sans 3, DM Mono, the warm parchment/gold/dark palette, and the editorial single-column flow. Rather than reinventing the wheel, we'll elevate this established design language into a fully-realized React SPA with smooth page transitions, scroll-triggered animations, and a responsive mobile experience.
