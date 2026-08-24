# TonyG Site — Editorial Spacing Guide

This document defines the spacing system for the entire site. Every new page, component, or section should follow these rules to maintain **editorial-quality density** — tight enough to feel crafted, generous enough to breathe.

---

## Core Principle

**Rhythm over uniformity.** Different content types get different spacing. A heading needs more air above it than below. A pull quote needs less padding than a full section break. The goal is a reading experience that feels like a well-typeset magazine, not a PowerPoint deck.

---

## Spacing Scale

| Token | Value | Use |
|-------|-------|-----|
| `xs` | `0.4rem` (6px) | Inline gaps, tag spacing |
| `sm` | `0.8rem` (13px) | Between related elements (label → content) |
| `md` | `1.1rem` (18px) | Paragraph bottom margin, list item spacing |
| `lg` | `1.5rem` (24px) | Section separators, card margins, footer blocks |
| `xl` | `2rem` (32px) | Major section padding, page-level containers |

---

## Typography Spacing

| Element | Top Margin | Bottom Margin | Line Height |
|---------|-----------|---------------|-------------|
| `<h1>` page title | 0 | `0.35rem` | 1.08 |
| `<h2>` section heading | `2rem` | `0.8rem` | 1.25 |
| `<h3>` sub-heading | `1.5rem` | `0.6rem` | 1.3 |
| Body paragraph `<p>` | 0 | `1.1rem` | 1.75 |
| List item | 0 | `0.5rem` | 1.65 |
| Pull quote / blockquote | `1.5rem` | `1.5rem` | 1.6 |
| Bold emphasis callout | `0.5rem` | `0.5rem` | 1.7 |
| Section label (DM Mono) | `1.5rem` | `0.4rem` | — |

---

## Component Spacing

| Component | Margin Bottom | Internal Padding |
|-----------|--------------|-----------------|
| Section wrapper (`<Section>`) | — | `2rem 1.5rem` |
| Article footer blocks (Lesson, Deepen, etc.) | `1.5rem` | `1.5rem 1.8rem` |
| Card / link block in grid | — (grid gap: `0.8rem`) | `1rem 1.2rem` |
| Email capture (mid-article) | `1.5rem` top & bottom | `1.5rem` |
| Email capture (footer) | `0.5rem` top | — |
| Ornamental divider (◆ ◆ ◆) | `1.5rem` top & bottom | — |
| Spacer component | — | `1.5rem` height |
| AdageStrip (dark quote band) | `1.5rem` top & bottom | `2rem 1.5rem` |
| Prev/Next navigation | — | `1.5rem 0` |
| Authority block | `1.5rem` | `1.2rem 1.5rem` |

---

## Section Header Pattern

All section headers (FURTHER READING, CONTINUE THE THREAD, VOICES IN THIS SPACE, etc.) follow:

```
marginBottom: 0.8rem
paddingBottom: 0.4rem
borderBottom: 1px solid rgba(139,105,20,0.15)
```

---

## Grid Gaps

| Context | Gap |
|---------|-----|
| Related posts / cards | `0.8rem` – `1rem` |
| Tag chips | `0.5rem` |
| Button groups | `0.8rem` |
| Series navigation items | `0.5rem` |

---

## Anti-Patterns (Do NOT)

1. **Do not use uniform `2.5rem` margins** on all sections — this creates the "padded" feeling.
2. **Do not use `3rem+` top margins** on headings — `2rem` is the max for H2.
3. **Do not use `1.8rem+` paragraph margins** — `1.1rem` is the standard.
4. **Do not use `2rem+` internal padding** on cards — `1.5rem` max.
5. **Do not use line-height above `1.8`** for body text — `1.75` is the standard.
6. **Do not add extra spacers** between sections that already have margin-bottom.

---

## Mobile Adjustments

On screens below `640px`:
- Section padding: `1.5rem 1rem`
- Card padding: `1rem`
- H2 top margin: `1.5rem`
- Paragraph margin: `1rem`

---

## Quick Reference for New Pages

When building a new page:

1. Wrap content in `<Section>` (auto: `2rem 1.5rem` padding, `860px` max-width)
2. Use `<SectionTitle>` for main headings (auto: `1rem` bottom margin)
3. Set paragraph `marginBottom: "1.1rem"` and `lineHeight: 1.75`
4. Set card grids to `gap: "0.8rem"` or `gap: "1rem"`
5. Set footer/enrichment blocks to `marginBottom: "1.5rem"` and `padding: "1.5rem 1.8rem"`
6. Use `<Divider>` between major sections, `<OrnamentalDivider>` for decorative breaks
7. Never exceed `2rem` for any single margin or padding value unless it's a page-level container
