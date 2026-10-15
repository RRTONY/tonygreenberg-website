import { describe, expect, it } from "vitest";
import { FEATURED_THEMES } from "@/lib/content/theme-map";
import { CATEGORY_ORDER } from "@/lib/content/articles-discovery";

describe("theme-map", () => {
  it("features the 4 homepage themes in order", () => {
    expect(FEATURED_THEMES.map((t) => t.key)).toEqual(["Systems & Innovation", "Business & Capital", "Culture & Communication", "The Crusades"]);
  });

  it("maps each theme to a real category with a url-safe slug", () => {
    for (const t of FEATURED_THEMES) {
      expect(CATEGORY_ORDER).toContain(t.key);
      expect(t.categorySlug).toMatch(/^[a-z]+(-[a-z]+)*$/);
      expect(t.categorySlug).toBe(t.key.toLowerCase().replace(/&/g, "").replace(/\s+/g, "-").replace(/-+/g, "-"));
    }
  });

  it("gives every theme an icon, hex colour and description", () => {
    for (const t of FEATURED_THEMES) {
      expect(t.icon).toBeTruthy();
      expect(t.color).toMatch(/^#[0-9A-F]{6}$/i);
      expect(t.description.trim()).not.toBe("");
    }
  });
});
