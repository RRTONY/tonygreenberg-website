import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  DIMENSIONS, DIMENSION_LABELS, QUESTIONS, ARCHETYPES, ALL_ARTICLE_SLUGS, WOUND_TO_CATEGORY, WOUND_CARDS,
  DIRECTORY, DIRECTORY_TOTAL, DIRECTORY_LIVE, DIRECTORY_COMING,
} from "@/lib/content/find-your-me";
import { POST_ORDER } from "@/lib/content/post-order";

const NEXT_CONFIG = readFileSync(path.join(process.cwd(), "next.config.ts"), "utf8");
const routeExists = (href: string) =>
  existsSync(path.join(process.cwd(), "src/app", href, "page.tsx")) || NEXT_CONFIG.includes(`source: "${href}"`);

describe("find-your-me quiz", () => {
  it("has 6 dimensions, each labelled, and one archetype per dimension", () => {
    expect(DIMENSIONS).toEqual(["relationships", "purpose", "body", "truth", "tribe", "consciousness"]);
    for (const d of DIMENSIONS) expect(DIMENSION_LABELS[d].trim()).not.toBe("");
    expect(ARCHETYPES.map((a) => a.id).sort()).toEqual([...DIMENSIONS].sort());
  });

  it("has 5 questions with 5 choices each, weighting only real dimensions from 1 to 10", () => {
    expect(QUESTIONS).toHaveLength(5);
    for (const q of QUESTIONS) {
      expect(q.choices).toHaveLength(5);
      for (const c of q.choices) {
        expect(Object.keys(c.dimensions).length).toBeGreaterThan(0);
        for (const [d, w] of Object.entries(c.dimensions)) {
          expect(DIMENSIONS).toContain(d);
          expect(w).toBeGreaterThanOrEqual(1);
          expect(w).toBeLessThanOrEqual(10);
        }
      }
    }
  });

  it("weights each choice's first-listed dimension at 7 or more", () => {
    for (const q of QUESTIONS) for (const c of q.choices) expect(Object.values(c.dimensions)[0]).toBeGreaterThanOrEqual(7);
  });
});

describe("find-your-me archetypes and links", () => {
  // Checked against Sanity 2026-10-16: 8 of the picks are real essays (5 were
  // under an old, longer address and now point at the real one). The other 11
  // were never written, not on live either; the quiz hides them. Replacing them
  // with real essays needs Tony's picks: move each from NEVER_WRITTEN as it goes.
  const NEVER_WRITTEN = [
    "the-science-of-being-alone-why-solitude-is-a-superpower",
    "the-built-world-is-a-mirror-of-the-people-who-built-it",
    "the-trust-economy-why-the-next-trillion-dollar-companies-will-be-built-on-radical-transparency",
    "the-great-ai-swindle-how-big-tech-is-selling-you-a-future-it-cant-deliver",
    "the-gdp-delusion-why-the-worlds-favorite-metric-is-its-most-dangerous-lie",
    "the-great-rewiring-how-to-build-systems-that-dont-extract",
    "the-art-of-the-long-game-why-patience-is-the-most-undervalued-asset-in-business",
    "the-longevity-paradox-why-living-longer-means-nothing-if-you-dont-live-deeper",
    "homeaglow-the-anatomy-of-a-consumer-fraud",
  ];

  it("every recommended essay is a real essay, or a known never-written pick the quiz hides", () => {
    for (const s of ALL_ARTICLE_SLUGS) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    const unknown = ALL_ARTICLE_SLUGS.filter((s) => !POST_ORDER.includes(s) && !NEVER_WRITTEN.includes(s));
    expect(unknown).toEqual([]);
    expect(ALL_ARTICLE_SLUGS.filter((s) => POST_ORDER.includes(s))).toHaveLength(8);
    for (const a of ARCHETYPES) expect(a.articles.length).toBeGreaterThan(0);
  });

  it("links archetypes and wound cards only to pages that exist (or real https sites)", () => {
    const paths = [
      ...ARCHETYPES.flatMap((a) => [...a.deeperAssessments.map((d) => d.path), a.nextStep.path, ...a.sites.map((s) => s.url)]),
      ...WOUND_CARDS.flatMap((w) => w.links.map((l) => l.path)),
    ];
    for (const p of paths) {
      if (p.startsWith("http")) expect(p).toMatch(/^https:\/\//);
      else expect(routeExists(p), p).toBe(true);
      expect(p).not.toMatch(/manus|\/api\/img\//);
    }
  });

  it("maps every wound to one of the directory categories", () => {
    const categories = DIRECTORY.map((s) => s.category);
    expect(WOUND_CARDS).toHaveLength(8);
    for (const w of WOUND_CARDS) expect(categories).toContain(WOUND_TO_CATEGORY[w.wound]);
  });

  it("marks directory items live only when their page exists", () => {
    for (const s of DIRECTORY) {
      for (const i of s.items) {
        if (i.status === "live") expect(routeExists(i.url), i.url).toBe(true);
      }
    }
  });

  it("counts directory totals", () => {
    const items = DIRECTORY.flatMap((s) => s.items);
    expect(DIRECTORY_TOTAL).toBe(items.length);
    expect(DIRECTORY_LIVE).toBe(items.filter((i) => i.status === "live").length);
    expect(DIRECTORY_COMING).toBe(DIRECTORY_TOTAL - DIRECTORY_LIVE);
    expect(new Set(items.map((i) => i.url)).size).toBe(items.length);
  });
});
