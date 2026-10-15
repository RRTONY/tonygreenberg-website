import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BREWSOUL_CATEGORIES, CAT_COLORS, BREWSOUL_TOTAL_PAGES, PAGE_CATEGORY_MAP } from "@/lib/content/brewsoul-directory";

const ALL_PAGES = BREWSOUL_CATEGORIES.flatMap((c) => c.pages);

describe("brewsoul-directory", () => {
  it("has unique category titles, each with a full colour set", () => {
    const titles = BREWSOUL_CATEGORIES.map((c) => c.title);
    expect(new Set(titles).size).toBe(titles.length);
    expect(titles[0]).toBe("Start Here");
    for (const t of titles) {
      const colors = CAT_COLORS[t];
      expect(colors, t).toBeDefined();
      for (const cls of Object.values(colors)) expect(cls).toMatch(/\[#[0-9A-F]{6}\]/i);
    }
  });

  it("links every page to a unique /brewsoul path with a label, description and icon", () => {
    const paths = ALL_PAGES.map((p) => p.path);
    expect(new Set(paths).size).toBe(paths.length);
    for (const p of ALL_PAGES) {
      expect(p.path).toMatch(/^\/brewsoul\/[a-z0-9/-]+$/);
      expect(p.label.trim()).not.toBe("");
      expect(p.desc.trim()).not.toBe("");
      expect(p.icon).toBeTruthy();
    }
  });

  it("links only to pages that exist in the app", () => {
    for (const p of ALL_PAGES) {
      const file = path.join(process.cwd(), "src/app", p.path, "page.tsx");
      expect(existsSync(file), p.path).toBe(true);
    }
  });

  it("counts the total pages", () => {
    expect(BREWSOUL_TOTAL_PAGES).toBe(ALL_PAGES.length);
    expect(BREWSOUL_TOTAL_PAGES).toBeGreaterThan(10);
  });

  it("maps every page path to its category and badge colour", () => {
    expect(Object.keys(PAGE_CATEGORY_MAP)).toHaveLength(ALL_PAGES.length);
    expect(PAGE_CATEGORY_MAP["/brewsoul/quiz"]).toEqual({ category: "Start Here", color: CAT_COLORS["Start Here"].badge });
    expect(PAGE_CATEGORY_MAP["/brewsoul/guest/shanita-nicholas"]?.category).toBe("Guest Series");
    expect(PAGE_CATEGORY_MAP["/not-a-brewsoul-page"]).toBeUndefined();
  });
});
