// @vitest-environment node
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import sitemap from "@/app/sitemap";
import { client } from "@/lib/sanity/client";
import { allPostSlugsQuery } from "@/lib/sanity/queries";
import { POST_REDIRECTS } from "@/lib/content/post-redirects";
import { BREWSOUL_COFFEES } from "@/lib/content/brewsoul-coffees";
import { CHARITIES } from "@/lib/content/charity-data";

const ROOT = path.resolve(import.meta.dirname, "../..");
const APP = path.join(ROOT, "src/app");
const SITE = "https://tonygreenberg.com";

// Every page.tsx in src/app, keyed by URL path (route groups dropped).
function pageFiles(dir = APP, out = new Map<string, string>()) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) pageFiles(full, out);
    else if (name === "page.tsx") {
      const route = "/" + path.relative(APP, dir).split(path.sep).filter((s) => !/^\(.*\)$/.test(s)).join("/");
      out.set(route === "/" ? "/" : route.replace(/\/$/, ""), full);
    }
  }
  return out;
}

const REDIRECT_PREFIX = Object.keys(POST_REDIRECTS)[0];

function withData(categories: unknown[] = []) {
  vi.mocked(client.fetch).mockImplementation((async (query: string) =>
    query === allPostSlugsQuery
      ? [
          { slug: "five-cups", _updatedAt: "2026-10-01" },
          { slug: "you-are-the-moat", _updatedAt: "2026-10-01" },
          ...(REDIRECT_PREFIX ? [{ slug: REDIRECT_PREFIX, _updatedAt: "2026-10-01" }] : []),
        ]
      : categories) as never);
}

describe("sitemap.xml", () => {
  it("lists only absolute https URLs on this site, with no duplicates", async () => {
    withData([{ slug: { current: "business" }, postCount: 10 }]);
    const urls = (await sitemap()).map((e) => e.url);
    for (const u of urls) expect(u.startsWith(SITE)).toBe(true);
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls[0]).toBe(SITE);
  });

  it("leaves out password-protected and redirecting posts", async () => {
    withData();
    const urls = (await sitemap()).map((e) => e.url);
    expect(urls).toContain(`${SITE}/blog/five-cups`);
    expect(urls).not.toContain(`${SITE}/blog/you-are-the-moat`);
    if (REDIRECT_PREFIX) expect(urls).not.toContain(`${SITE}/blog/${REDIRECT_PREFIX}`);
  });

  it("leaves out thin (noindex) categories", async () => {
    withData([
      { slug: { current: "business" }, postCount: 10 },
      { slug: { current: "tiny" }, postCount: 1 },
    ]);
    const urls = (await sitemap()).map((e) => e.url);
    expect(urls).toContain(`${SITE}/blog/category/business`);
    expect(urls).not.toContain(`${SITE}/blog/category/tiny`);
  });

  it("includes every coffee and charity page", async () => {
    withData();
    const urls = new Set((await sitemap()).map((e) => e.url));
    for (const c of BREWSOUL_COFFEES) expect(urls.has(`${SITE}/brewsoul/coffee/${c.id}`)).toBe(true);
    for (const c of CHARITIES) expect(urls.has(`${SITE}/charity-scorecard/${c.slug}`)).toBe(true);
  });

  it("every fixed page listed exists, isn't noindex, and isn't a redirect", async () => {
    withData();
    const pages = pageFiles();
    const config = readFileSync(path.join(ROOT, "next.config.ts"), "utf8");
    const redirected = new Set([...config.matchAll(/source:\s*"(\/[^":*]*)"/g)].map((m) => m[1]));
    const fixed = (await sitemap())
      .map((e) => e.url.slice(SITE.length) || "/")
      .filter((p) => p !== "/" && !/^\/(blog\/|blog\/category\/|brewsoul\/(coffee|cities)\/|charity-scorecard\/)./.test(p));
    const problems: string[] = [];
    for (const route of fixed) {
      const file = pages.get(route);
      if (!file) {
        problems.push(`${route}: no page.tsx`);
        continue;
      }
      const src = readFileSync(file, "utf8");
      if (/index:\s*false/.test(src)) problems.push(`${route}: noindex`);
      if (/^\s*(permanentRedirect|redirect)\(/m.test(src)) problems.push(`${route}: redirects`);
      if (redirected.has(route)) problems.push(`${route}: redirected in next.config.ts`);
    }
    expect(problems).toEqual([]);
  });

  it("leaves out the account pages, Studio and member-only pages", async () => {
    withData();
    const urls = (await sitemap()).map((e) => e.url.slice(SITE.length));
    for (const p of ["/login", "/signup", "/forgot-password", "/reset-password", "/studio", "/my-highlights", "/my-impact", "/pri-research", "/oauth/authorize"]) {
      expect(urls).not.toContain(p);
    }
  });

  it("skips a Sanity category with no slug instead of crashing the sitemap", async () => {
    withData([{ slug: null, postCount: 10 }]);
    await expect(sitemap()).resolves.toBeInstanceOf(Array);
    expect((await sitemap()).some((e) => /\/blog\/category\/(undefined|null)?$/.test(e.url))).toBe(false);
  });
});
