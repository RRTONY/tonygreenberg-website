import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { SHORT_LINKS } from "@/lib/content/short-links";
import { POST_ORDER } from "@/lib/content/post-order";

const APP = path.join(process.cwd(), "src/app");
const NEXT_CONFIG = readFileSync(path.join(process.cwd(), "next.config.ts"), "utf8");
function page(href: string, dir = APP): boolean {
  const [seg, ...rest] = href.replace(/[?#].*$/, "").split("/").filter(Boolean);
  if (!seg) return existsSync(path.join(dir, "page.tsx"));
  const entries = readdirSync(dir);
  const candidates = [seg, ...entries.filter((d) => d.startsWith("(")).map((g) => `${g}/${seg}`), ...entries.filter((d) => /^\[[^.]/.test(d))];
  return candidates.some((s) => existsSync(path.join(dir, s)) && page(rest.join("/"), path.join(dir, s)));
}
const isEssay = (t: string) => /^\/blog\/[^/]+$/.test(t);

describe("short-links", () => {
  it("has 198 unique, url-safe codes", () => {
    expect(SHORT_LINKS).toHaveLength(198);
    expect(new Set(SHORT_LINKS.map(([c]) => c)).size).toBe(198);
    for (const [code] of SHORT_LINKS) expect(code).toMatch(/^[a-z0-9-]+$/);
  });

  it("points every code at an internal address, never Manus", () => {
    for (const [, target] of SHORT_LINKS) {
      expect(target.startsWith("/")).toBe(true);
      expect(target).not.toMatch(/manus|\/api\/img\//);
    }
  });

  it("points almost every essay link at a known essay", () => {
    const unknown = SHORT_LINKS.filter(([, t]) => isEssay(t) && !POST_ORDER.includes(t.slice(6))).map(([, t]) => t);
    // These two are not in POST_ORDER; whether they exist can only be checked in Sanity.
    expect([...new Set(unknown)].sort()).toEqual(["/blog/blood-is-the-api", "/blog/the-tollbooth-and-the-alternative"]);
  });

  // /movement-signup is neither a page nor a redirect, so this shared link 404s
  // after cutover (the whole point of the list is that old links keep working).
  it.fails("BUG: a short link points at a page that does not exist", () => {
    for (const [code, t] of SHORT_LINKS) {
      if (isEssay(t)) continue;
      expect(page(t) || NEXT_CONFIG.includes(`source: "${t}"`), `${code} -> ${t}`).toBe(true);
    }
  });
});
