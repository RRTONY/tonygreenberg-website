import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { SEARCH_CONSOLE_REDIRECTS, SEARCH_CONSOLE_TEMPORARY_REDIRECTS } from "@/lib/content/search-console-redirects";
import { LEGACY_POST_REDIRECTS } from "@/lib/content/legacy-post-redirects";
import { POST_ORDER } from "@/lib/content/post-order";

const APP = path.join(process.cwd(), "src/app");
// Resolves an address against src/app (route groups and [dynamic] folders allowed).
function page(href: string, dir = APP, allowDynamic = true): boolean {
  const [seg, ...rest] = href.replace(/[?#].*$/, "").split("/").filter(Boolean);
  if (!seg) return existsSync(path.join(dir, "page.tsx"));
  const entries = readdirSync(dir);
  const candidates = [seg, ...entries.filter((d) => d.startsWith("(")).map((g) => `${g}/${seg}`)];
  if (allowDynamic) candidates.push(...entries.filter((d) => /^\[[^.]/.test(d)));
  return candidates.some((s) => existsSync(path.join(dir, s)) && page(rest.join("/"), path.join(dir, s), allowDynamic));
}
const ALL = [...SEARCH_CONSOLE_REDIRECTS, ...SEARCH_CONSOLE_TEMPORARY_REDIRECTS];

describe("search-console-redirects", () => {
  it("has unique sources, none repeated in the legacy post redirects", () => {
    const sources = ALL.map(([s]) => s);
    expect(new Set(sources).size).toBe(sources.length);
    const legacy = new Set(LEGACY_POST_REDIRECTS.map(([s]) => s));
    for (const s of sources) {
      expect(s.startsWith("/")).toBe(true);
      expect(legacy.has(s), s).toBe(false);
    }
  });

  it("never shadows a real static page", () => {
    for (const [s] of ALL) if (!s.includes(":")) expect(page(s, APP, false), s).toBe(false);
  });

  it("sends people to a known essay or a real page", () => {
    for (const [s, d] of ALL) {
      const essay = d.match(/^\/blog\/([^/]+)$/);
      if (essay) expect(POST_ORDER, `${s} -> ${d}`).toContain(essay[1]);
      else expect(page(d), `${s} -> ${d}`).toBe(true);
    }
  });

  it("keeps the About page and shop mappings", () => {
    expect(SEARCH_CONSOLE_REDIRECTS).toContainEqual(["/transforming-industries-and-perceptions-tonyg", "/about"]);
    expect(SEARCH_CONSOLE_TEMPORARY_REDIRECTS).toEqual([["/shop", "/subscribe"]]);
    expect(ALL.map(([s]) => s)).not.toContain("/terms");
  });
});
