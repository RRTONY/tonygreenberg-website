import { describe, expect, it } from "vitest";
import { CURATED_JOURNEYS } from "@/lib/content/curated-journeys";
import { POST_ORDER } from "@/lib/content/post-order";

describe("curated-journeys", () => {
  it("has 7 journeys with unique ids, titles and icons", () => {
    expect(CURATED_JOURNEYS).toHaveLength(7);
    expect(new Set(CURATED_JOURNEYS.map((j) => j.id)).size).toBe(7);
    expect(CURATED_JOURNEYS[0]).toMatchObject({ id: "crusades", title: "The Crusade Files" });
    for (const j of CURATED_JOURNEYS) {
      expect(j.title.trim()).not.toBe("");
      expect(j.icon).toBeTruthy();
    }
  });

  it("lists unique essay slugs per journey, all of them real essays", () => {
    for (const j of CURATED_JOURNEYS) {
      expect(j.postSlugs.length).toBeGreaterThan(0);
      expect(new Set(j.postSlugs).size).toBe(j.postSlugs.length);
      for (const s of j.postSlugs) expect(POST_ORDER, `${j.id}: ${s}`).toContain(s);
    }
  });
});
