import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { SEARCH_DIRECTORY, withEssayCount } from "@/lib/content/search-directory";

const APP = path.join(process.cwd(), "src/app");
const NEXT_CONFIG = readFileSync(path.join(process.cwd(), "next.config.ts"), "utf8");
function page(href: string, dir = APP): boolean {
  const [seg, ...rest] = href.replace(/[?#].*$/, "").split("/").filter(Boolean);
  if (!seg) return existsSync(path.join(dir, "page.tsx"));
  const entries = readdirSync(dir);
  const candidates = [seg, ...entries.filter((d) => d.startsWith("(")).map((g) => `${g}/${seg}`), ...entries.filter((d) => /^\[[^.]/.test(d))];
  return candidates.some((s) => existsSync(path.join(dir, s)) && page(rest.join("/"), path.join(dir, s)));
}

describe("SEARCH_DIRECTORY", () => {
  it("has unique hrefs with a title, description and tags", () => {
    const hrefs = SEARCH_DIRECTORY.map((p) => p.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const p of SEARCH_DIRECTORY) {
      expect(p.title.trim() && p.description.trim()).toBeTruthy();
      expect(p.tags?.length).toBeGreaterThan(0);
    }
  });

  it("links internally only to real pages (or a next.config redirect), and externally only over https", () => {
    for (const p of SEARCH_DIRECTORY) {
      expect(p.href).not.toMatch(/manuscdn|\/manus-storage\/|\/api\/img\//);
      if (p.href.startsWith("/")) expect(page(p.href) || NEXT_CONFIG.includes(`source: "${p.href}"`), p.href).toBe(true);
      else expect(p.href, p.title).toMatch(/^https:\/\//);
    }
  });

  it("uses the canonical assessment routes, not the old /assessments/ ones", () => {
    const hrefs = SEARCH_DIRECTORY.map((p) => p.href);
    expect(hrefs.some((h) => h.startsWith("/assessments/"))).toBe(false);
    expect(hrefs).toContain("/attention-theft#report");
  });
});

describe("withEssayCount", () => {
  it("fills {count} with the real number and leaves other items untouched", () => {
    const out = withEssayCount(SEARCH_DIRECTORY, 121);
    expect(out.find((p) => p.href === "/blog")?.description).toMatch(/^121 essays/);
    expect(out.some((p) => p.description.includes("{count}"))).toBe(false);
    const other = SEARCH_DIRECTORY.findIndex((p) => !p.description.includes("{count}"));
    expect(out[other]).toBe(SEARCH_DIRECTORY[other]);
  });

  it("does not change the original list and handles an empty one", () => {
    withEssayCount(SEARCH_DIRECTORY, 5);
    expect(SEARCH_DIRECTORY[0].description).toContain("{count}");
    expect(withEssayCount([], 3)).toEqual([]);
  });
});
