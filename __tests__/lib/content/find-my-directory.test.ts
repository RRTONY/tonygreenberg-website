import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { FEATURED, CATEGORIES, FIND_MY_TOTAL, FIND_MY_LIVE, FIND_MY_COMING } from "@/lib/content/find-my-directory";
import { DIRECTORY } from "@/lib/content/find-your-me";

const NEXT_CONFIG = readFileSync(path.join(process.cwd(), "next.config.ts"), "utf8");
const routeExists = (href: string) =>
  existsSync(path.join(process.cwd(), "src/app", href, "page.tsx")) || NEXT_CONFIG.includes(`source: "${href}"`);

const ALL = [...FEATURED, ...CATEGORIES.flatMap((c) => c.items)];

describe("find-my-directory", () => {
  it("has a featured row and 6 unique categories", () => {
    expect(FEATURED.map((f) => f.href)).toEqual(["/find-your-me", "/find-your-ev"]);
    expect(CATEGORIES.map((c) => c.key)).toEqual(["body", "mind", "relationships", "identity", "deep", "impact"]);
  });

  it("uses unique internal hrefs with full item details", () => {
    const hrefs = ALL.map((l) => l.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const l of ALL) {
      expect(l.href).toMatch(/^\/[a-z0-9-]+$/);
      expect(l.title.trim() && l.tagline.trim()).toBeTruthy();
      expect(l.color).toMatch(/^#[0-9A-F]{6}$/i);
      expect(l.icon).toBeTruthy();
    }
  });

  it("only marks a link live when its page (or redirect) exists, and coming when it does not", () => {
    for (const l of ALL) expect({ href: l.href, live: routeExists(l.href) }).toEqual({ href: l.href, live: l.status === "live" });
  });

  it("reuses find-your-me's status for shared links, except the documented /flow-circuit override", () => {
    const fromMe = new Map(DIRECTORY.flatMap((s) => s.items).map((i) => [i.url, i.status]));
    for (const l of ALL) {
      if (!fromMe.has(l.href)) continue;
      if (l.href === "/flow-circuit") expect([fromMe.get(l.href), l.status]).toEqual(["coming", "live"]);
      else expect(l.status, l.href).toBe(fromMe.get(l.href));
    }
  });

  it("counts total, live and coming items", () => {
    expect(FIND_MY_TOTAL).toBe(ALL.length);
    expect(FIND_MY_LIVE).toBe(ALL.filter((l) => l.status === "live").length);
    expect(FIND_MY_COMING).toBe(FIND_MY_TOTAL - FIND_MY_LIVE);
    expect(FIND_MY_COMING).toBe(1);
  });
});
