import { describe, expect, it } from "vitest";
import { MIRROR_DIMENSIONS, MIRROR_QUESTIONS, MIRROR_ARTICLES, MIRROR_ARTICLE_SLUGS } from "@/lib/content/mirror-data";

const IDS = ["relationships", "purpose", "body", "truth", "tribe", "consciousness"];

describe("mirror-data", () => {
  it("has the 6 dimensions with their copy", () => {
    expect(MIRROR_DIMENSIONS.map((d) => d.id)).toEqual(IDS);
    for (const d of MIRROR_DIMENSIONS) {
      for (const f of [d.name, d.icon, d.description, d.flowState, d.frictionState]) expect(f.trim()).not.toBe("");
    }
  });

  it("asks 18 questions, 3 per dimension numbered 1..3", () => {
    expect(MIRROR_QUESTIONS).toHaveLength(18);
    for (const id of IDS) {
      expect(MIRROR_QUESTIONS.filter((q) => q.dimension === id).map((q) => q.number).sort()).toEqual([1, 2, 3]);
    }
  });

  it("gives every question options with unique, positive scores", () => {
    for (const q of MIRROR_QUESTIONS) {
      expect(q.options.length).toBeGreaterThanOrEqual(3);
      const scores = q.options.map((o) => o.score);
      expect(new Set(scores).size).toBe(scores.length);
      for (const o of q.options) {
        expect(o.text.trim()).not.toBe("");
        expect(o.score).toBeGreaterThan(0);
      }
    }
  });

  it("maps 85 essays to dimensions, with only the known inert 'action' entry outside them", () => {
    expect(MIRROR_ARTICLE_SLUGS).toHaveLength(85);
    expect(MIRROR_ARTICLE_SLUGS).toEqual(Object.keys(MIRROR_ARTICLES));
    const outside = Object.entries(MIRROR_ARTICLES).filter(([, a]) => !IDS.includes(a.dimension));
    expect(outside.map(([slug, a]) => [slug, a.dimension])).toEqual([["find-my-ev-paul-scott-wont-let-you-buy-a-gas-car", "action"]]);
    // The stray legacy top-level key was dropped, not carried over as an 86th mirror.
    expect(MIRROR_ARTICLES["the-peptide-truth-65m-fraud-industry-vs-life-changing-medicine"]).toBeUndefined();
  });

  it("gives every mapping a url-safe slug, a reflection and a prompt", () => {
    for (const [slug, a] of Object.entries(MIRROR_ARTICLES)) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(a.reflection.trim() && a.prompt.trim()).toBeTruthy();
    }
  });
});
