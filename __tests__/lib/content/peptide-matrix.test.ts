import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ENTITIES, QUADRANTS, DANGER_MECHANISMS, EVIDENCE_CRITERIA, REVIEW_SOURCES, CROSS_LINKS } from "@/lib/content/peptide-matrix";
import { POST_ORDER } from "@/lib/content/post-order";

describe("peptide-matrix", () => {
  it("has unique entity ids in a known quadrant", () => {
    expect(new Set(ENTITIES.map((e) => e.id)).size).toBe(ENTITIES.length);
    const quadrants = [...QUADRANTS.map((q) => q.id as string), "REGULATORY"];
    for (const e of ENTITIES) expect(quadrants).toContain(e.quadrant);
  });

  it("never gives a named person (influencer or doctor) a star rating", () => {
    for (const e of ENTITIES.filter((x) => x.type === "influencer" || x.type === "doctor")) expect(e.reviews, e.name).toBe(0);
  });

  it("keeps ratings 0-5 and evidence 0-100", () => {
    for (const e of ENTITIES) {
      expect(e.reviews).toBeGreaterThanOrEqual(0);
      expect(e.reviews).toBeLessThanOrEqual(5);
      expect(e.evidence).toBeGreaterThanOrEqual(0);
      expect(e.evidence).toBeLessThanOrEqual(100);
    }
  });

  it("has 4 quadrants Q1..Q4 with hex colours", () => {
    expect(QUADRANTS.map((q) => q.id)).toEqual(["Q1", "Q2", "Q3", "Q4"]);
    for (const q of QUADRANTS) expect(q.color).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it("signs evidence points to match whether they help or hurt", () => {
    for (const c of EVIDENCE_CRITERIA) {
      if (c.positive === false) expect(c.points).toMatch(/^−\d+$/);
      else expect(c.points).toMatch(/^\+\d+$/);
    }
    expect(DANGER_MECHANISMS).toHaveLength(5);
    expect(new Set(REVIEW_SOURCES).size).toBe(REVIEW_SOURCES.length);
  });

  it("cross-links only to pages and essays that exist", () => {
    for (const l of CROSS_LINKS) {
      if (l.href.startsWith("/blog/")) expect(POST_ORDER).toContain(l.href.slice(6));
      else expect(existsSync(path.join(process.cwd(), "src/app", l.href, "page.tsx")), l.href).toBe(true);
    }
  });
});
