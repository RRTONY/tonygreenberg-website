import { describe, expect, it } from "vitest";
import {
  START_HERE_SLUGS, CONTRARIAN_SLUGS, CHANGED_MIND_SLUGS, SHORT_READ_SLUGS, DEEP_DIVE_SLUGS,
  DISCOVERY_MODES, CATEGORY_ORDER, CATEGORY_DESCRIPTIONS,
} from "@/lib/content/articles-discovery";
import { POST_ORDER } from "@/lib/content/post-order";

const LISTS = { START_HERE_SLUGS, CONTRARIAN_SLUGS, CHANGED_MIND_SLUGS, SHORT_READ_SLUGS, DEEP_DIVE_SLUGS };

describe("articles-discovery", () => {
  it.each(Object.entries(LISTS))("%s has unique, url-safe slugs", (_name, list) => {
    expect(list.length).toBeGreaterThan(0);
    expect(new Set(list).size).toBe(list.length);
    for (const s of list) {
      expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(POST_ORDER, s).toContain(s);
    }
  });

  it("keeps the 3 corrected slugs (not the stale legacy ones)", () => {
    expect(CONTRARIAN_SLUGS).toContain("psychedelics-could-become-extractive-capitalism");
    expect(CHANGED_MIND_SLUGS).toContain("enterprise-blockchain-can-big-business-co-opt");
    expect(SHORT_READ_SLUGS).toContain("an-ode-to-kusaki-where-plants-become-culinary-masterpieces");
    const all = Object.values(LISTS).flat();
    expect(all.some((s) => s.endsWith("-unless") || s.endsWith("culinary-art"))).toBe(false);
  });

  it("has 7 Start Here essays, matching its badge", () => {
    expect(START_HERE_SLUGS).toHaveLength(7);
    expect(DISCOVERY_MODES.find((m) => m.id === "Start Here")).toMatchObject({ desc: "7 foundational" });
  });

  it("has unique discovery modes starting with All", () => {
    const ids = DISCOVERY_MODES.map((m) => m.id);
    expect(ids[0]).toBe("All");
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("describes every category in the order, and nothing else", () => {
    expect(new Set(CATEGORY_ORDER).size).toBe(CATEGORY_ORDER.length);
    expect(Object.keys(CATEGORY_DESCRIPTIONS).sort()).toEqual([...CATEGORY_ORDER].sort());
    for (const c of CATEGORY_ORDER) expect(CATEGORY_DESCRIPTIONS[c].trim()).not.toBe("");
  });
});
