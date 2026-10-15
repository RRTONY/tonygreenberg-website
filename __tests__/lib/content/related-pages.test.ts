import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { RELATED_PAGES, CHARITY_PROFILE_PATH } from "@/lib/content/related-pages";
import { POST_ORDER } from "@/lib/content/post-order";
import { LEGACY_POST_REDIRECTS } from "@/lib/content/legacy-post-redirects";
import { SEARCH_CONSOLE_REDIRECTS } from "@/lib/content/search-console-redirects";

const APP = path.join(process.cwd(), "src/app");
// Static pages only: true when src/app/<href>/page.tsx exists (route groups allowed).
function staticPage(href: string, dir = APP): boolean {
  const [seg, ...rest] = href.split("/").filter(Boolean);
  if (!seg) return existsSync(path.join(dir, "page.tsx"));
  const groups = readdirSync(dir).filter((d) => d.startsWith("("));
  return [seg, ...groups.map((g) => `${g}/${seg}`)].some((s) => existsSync(path.join(dir, s)) && staticPage(rest.join("/"), path.join(dir, s)));
}
const redirectSources = new Set([...LEGACY_POST_REDIRECTS.map(([s]) => s), ...SEARCH_CONSOLE_REDIRECTS.map(([s]) => s)]);

describe("related-pages", () => {
  it("is keyed by real pages (or the charity profile pattern)", () => {
    expect(RELATED_PAGES[CHARITY_PROFILE_PATH]).toBeDefined();
    for (const key of Object.keys(RELATED_PAGES)) {
      if (key === CHARITY_PROFILE_PATH) continue;
      expect(staticPage(key), key).toBe(true);
    }
  });

  it("gives every page 3 different links, never to itself", () => {
    for (const [key, links] of Object.entries(RELATED_PAGES)) {
      expect(links).toHaveLength(3);
      expect(new Set(links.map((l) => l.href)).size).toBe(3);
      for (const l of links) expect(l.href, key).not.toBe(key);
    }
  });

  it("links only to real pages or known essays, never to a redirect", () => {
    for (const links of Object.values(RELATED_PAGES)) {
      for (const l of links) {
        expect(l.title.trim() && l.blurb.trim()).toBeTruthy();
        expect(redirectSources.has(l.href), l.href).toBe(false);
        const essay = l.href.match(/^\/blog\/([^/]+)$/);
        if (essay) expect(POST_ORDER, l.href).toContain(essay[1]);
        else expect(staticPage(l.href), l.href).toBe(true);
      }
    }
  });
});
