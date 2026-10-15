import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { WHERE_NEXT, WHERE_NEXT_DEFAULT, WHERE_NEXT_HIDDEN } from "@/lib/content/where-next";

const APP = path.join(process.cwd(), "src/app");
const NEXT_CONFIG = readFileSync(path.join(process.cwd(), "next.config.ts"), "utf8");
function page(href: string, dir = APP): boolean {
  const [seg, ...rest] = href.replace(/[?#].*$/, "").split("/").filter(Boolean);
  if (!seg) return existsSync(path.join(dir, "page.tsx"));
  const entries = readdirSync(dir);
  const candidates = [seg, ...entries.filter((d) => d.startsWith("(")).map((g) => `${g}/${seg}`), ...entries.filter((d) => /^\[[^.]/.test(d))];
  return candidates.some((s) => existsSync(path.join(dir, s)) && page(rest.join("/"), path.join(dir, s)));
}
const ALL = [...Object.values(WHERE_NEXT).flat(), ...WHERE_NEXT_DEFAULT];

describe("where-next", () => {
  it("is keyed by internal paths", () => {
    for (const key of Object.keys(WHERE_NEXT)) expect(key.startsWith("/")).toBe(true);
  });

  it("gives every page suggestions with a label and teaser, never itself, no duplicates", () => {
    for (const [key, list] of Object.entries(WHERE_NEXT)) {
      expect(list.length).toBeGreaterThan(0);
      expect(new Set(list.map((s) => s.href)).size).toBe(list.length);
      for (const s of list) {
        expect(s.href, key).not.toBe(key);
        expect(s.label.trim() && s.teaser.trim()).toBeTruthy();
      }
    }
  });

  it("links only to real pages (or a configured redirect)", () => {
    for (const s of ALL) expect(page(s.href) || NEXT_CONFIG.includes(`source: "${s.href.replace(/[#?].*$/, "")}"`), s.href).toBe(true);
  });

  it("does not link to the routes it dropped", () => {
    const hrefs = ALL.map((s) => s.href);
    for (const gone of ["/shop", "/fauxtony", "/cheshire-grin"]) expect(hrefs).not.toContain(gone);
    expect(hrefs.some((h) => h.startsWith("/attention-theft/"))).toBe(false);
  });

  it("has the default 3 suggestions and the hidden routes", () => {
    expect(WHERE_NEXT_DEFAULT.map((s) => s.href)).toEqual(["/", "/find-my", "/the-letter"]);
    expect(WHERE_NEXT_HIDDEN).toEqual(["/find-your-me", "/find-my", "/discover"]);
  });
});
