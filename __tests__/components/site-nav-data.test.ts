import { describe, expect, it } from "vitest";
import { findYourMeGroups, navCategories, primaryNavLinks, socialLinks } from "@/components/site-nav-data";

const internal = [
  ...primaryNavLinks,
  ...navCategories.flatMap((c) => c.items),
  ...findYourMeGroups.flatMap((g) => g.items),
];
const MANUS = /manuscdn|manus-storage|\/api\/img\//;

describe("site-nav-data", () => {
  it("has the four primary links in order", () => {
    expect(primaryNavLinks.map((l) => [l.label, l.href])).toEqual([
      ["Read", "/blog"],
      ["Fix Myself", "/find-my"],
      ["Fix My Company", "/amplifier"],
      ["Build With Me", "/engage"],
    ]);
  });

  it("every internal link starts with / and has a label", () => {
    for (const l of internal) {
      expect(l.href, l.label).toMatch(/^\//);
      expect(l.label.trim()).not.toBe("");
    }
    for (const c of navCategories) {
      for (const i of c.items) if (i.foundation) expect(i.foundation).toMatch(/^\//);
    }
  });

  it("has no duplicate hrefs inside one group or category", () => {
    for (const c of navCategories) {
      const hrefs = c.items.map((i) => i.href);
      expect(new Set(hrefs).size, c.title).toBe(hrefs.length);
    }
    for (const g of findYourMeGroups) {
      const hrefs = g.items.map((i) => i.href);
      expect(new Set(hrefs).size, g.category).toBe(hrefs.length);
    }
  });

  it("has unique category titles and non-empty groups", () => {
    const titles = navCategories.map((c) => c.title);
    expect(new Set(titles).size).toBe(titles.length);
    for (const c of navCategories) expect(c.items.length).toBeGreaterThan(0);
    for (const g of findYourMeGroups) expect(g.items.length).toBeGreaterThan(0);
  });

  it("social links are https and no link points at Manus", () => {
    for (const s of socialLinks) expect(s.href).toMatch(/^https:\/\//);
    for (const l of [...internal, ...socialLinks]) expect(l.href).not.toMatch(MANUS);
  });
});
