import { describe, expect, it } from "vitest";
import {
  CORE_THESIS, SECTION_THESIS_MAP, RESEARCH_LIBRARY, LP_COMPARABLES, CONTENT_RULES, NEVER_USE, THESIS_THREADS, THESIS_CONNECTORS,
} from "@/lib/content/thesis-threads";
import { POST_ORDER } from "@/lib/content/post-order";

describe("thesis-threads", () => {
  it("has the core thesis", () => {
    expect(CORE_THESIS.shortForm).toBe("Extraction wastes. Regeneration compounds.");
    expect(CORE_THESIS.statement).toMatch(/^Extractive capitalism/);
  });

  it("has 6 threads with unique ids and 69 unique, real essay slugs", () => {
    expect(THESIS_THREADS).toHaveLength(6);
    expect(new Set(THESIS_THREADS.map((t) => t.id)).size).toBe(6);
    const slugs = THESIS_THREADS.flatMap((t) => t.articleSlugs);
    expect(slugs).toHaveLength(69);
    expect(new Set(slugs).size).toBe(69);
    for (const s of slugs) expect(POST_ORDER, s).toContain(s);
    expect(THESIS_THREADS[0]).toMatchObject({ id: "opacity-tax", title: "The Opacity Tax" });
  });

  it("only writes connectors for real essays", () => {
    for (const [slug, line] of Object.entries(THESIS_CONNECTORS)) {
      expect(POST_ORDER, slug).toContain(slug);
      expect(line.trim()).not.toBe("");
    }
  });

  it("maps site sections to the thesis with unique slugs and data points", () => {
    expect(SECTION_THESIS_MAP.map((s) => s.slug)).toEqual(["technology", "business", "tony", "tonyg", "crusades"]);
    for (const s of SECTION_THESIS_MAP) expect(s.dataPoints.length).toBeGreaterThan(0);
  });

  it("lists research, comparables, content rules and banned phrases", () => {
    for (const r of RESEARCH_LIBRARY) expect(r.year).toBeGreaterThan(1990);
    expect(LP_COMPARABLES.at(-1)?.name).toBe("ABITs (ImpactSoul)");
    expect(Object.keys(CONTENT_RULES)).toHaveLength(6);
    expect(NEVER_USE).toContain("synergy");
  });
});
