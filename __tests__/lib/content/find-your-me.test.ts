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
  // Only 3 of these 17 slugs are in POST_ORDER / legacy blogData; the rest can only
  // be checked against Sanity, which tests never read. So this checks shape only.
  it("recommends 17 unique, url-safe essay slugs", () => {
    expect(ALL_ARTICLE_SLUGS).toHaveLength(17);
    for (const s of ALL_ARTICLE_SLUGS) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(ALL_ARTICLE_SLUGS).toContain("love-as-dharma-a-science-based-playbook-for-magnetic-partnership");
    expect(POST_ORDER).toContain("love-as-dharma-a-science-based-playbook-for-magnetic-partnership");
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
