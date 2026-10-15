import { describe, expect, it } from "vitest";
import { FEATURED_COUNT, IMPACT_FUTURISM_ENTRIES, TAG_BADGE } from "@/lib/content/impact-futurism";
import { POST_ORDER } from "@/lib/content/post-order";

describe("impact-futurism", () => {
  it("curates 7 unique real essays, the first 3 featured", () => {
    expect(IMPACT_FUTURISM_ENTRIES).toHaveLength(7);
    expect(FEATURED_COUNT).toBe(3);
    const slugs = IMPACT_FUTURISM_ENTRIES.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(7);
    expect(slugs.slice(0, FEATURED_COUNT)).toEqual(["your-blood-lies-without-your-dna", "energy-is-money-money-is-memory", "when-healing-becomes-extraction"]);
    for (const s of slugs) expect(POST_ORDER, s).toContain(s);
  });

  it("gives every entry a teaser and a tag that has a badge style", () => {
    for (const e of IMPACT_FUTURISM_ENTRIES) {
      expect(e.teaser.trim()).not.toBe("");
      expect(TAG_BADGE[e.tag], e.tag).toMatch(/^bg-[a-z]+-950 text-[a-z]+-100$/);
    }
  });

  it("gives the featured three their own list teaser", () => {
    for (const e of IMPACT_FUTURISM_ENTRIES.slice(0, FEATURED_COUNT)) expect(e.listTeaser?.trim()).toBeTruthy();
  });
});
