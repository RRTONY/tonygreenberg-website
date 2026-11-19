import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { POST_REDIRECTS, postHref, resolveInternalHref } from "@/lib/content/post-redirects";

describe("postHref", () => {
  it("links a redirected post straight to its full page", () => {
    expect(postHref("akbar-cuisine-restoration-economics")).toBe("/akbar");
  });

  it("links every other post to /blog/<slug>", () => {
    expect(postHref("five-cups")).toBe("/blog/five-cups");
    expect(postHref("")).toBe("/blog/");
  });

  it("only maps posts whose redirect is also in next.config.ts", () => {
    const config = readFileSync(path.join(process.cwd(), "next.config.ts"), "utf8");
    for (const [slug, dest] of Object.entries(POST_REDIRECTS)) {
      expect(config).toContain(slug);
      expect(dest.startsWith("/")).toBe(true);
    }
  });
});

describe("resolveInternalHref", () => {
  it("rewrites a redirected /blog link and keeps its hash or query", () => {
    expect(resolveInternalHref("/blog/akbar-cuisine-restoration-economics")).toBe("/akbar");
    expect(resolveInternalHref("/blog/akbar-cuisine-restoration-economics#menu")).toBe("/akbar#menu");
    expect(resolveInternalHref("/blog/akbar-cuisine-restoration-economics?x=1")).toBe("/akbar?x=1");
  });

  it("drops the old /assessments/ prefix for the three moved assessments", () => {
    expect(resolveInternalHref("/assessments/dharma-finder")).toBe("/dharma-finder");
    expect(resolveInternalHref("/assessments/grant-study?step=2")).toBe("/grant-study?step=2");
    expect(resolveInternalHref("/assessments/consciousness-scale#top")).toBe("/consciousness-scale#top");
  });

  it("sends WordPress-era post addresses (slash or not, relative or full) straight to /blog", () => {
    const ev = "/blog/find-my-ev-paul-scott-wont-let-you-buy-a-gas-car";
    expect(resolveInternalHref("/find-my-ev/")).toBe(ev);
    expect(resolveInternalHref("/find-my-ev")).toBe(ev);
    expect(resolveInternalHref("https://tonygreenberg.com/find-my-ev/")).toBe(ev);
    expect(resolveInternalHref("https://www.tonygreenberg.com/apologize/#top")).toBe("/blog/apologize#top");
  });

  it("sends links to the moved PRI pages straight to psychedelicreadiness.com", () => {
    expect(resolveInternalHref("/psychedelic-readiness-index")).toBe("https://psychedelicreadiness.com/");
    expect(resolveInternalHref("https://tonygreenberg.com/psychedelic-readiness-index?m=kava")).toBe("https://psychedelicreadiness.com/?m=kava");
    expect(resolveInternalHref("/facilitator-index")).toBe("https://psychedelicreadiness.com/facilitator-index");
  });

  it("leaves everything else alone", () => {
    expect(resolveInternalHref("/about/")).toBe("/about/");
    expect(resolveInternalHref("https://tonygreenberg.com/about")).toBe("https://tonygreenberg.com/about");
    expect(resolveInternalHref("/blog/five-cups")).toBe("/blog/five-cups");
    expect(resolveInternalHref("/assessments/dharma-finder-2")).toBe("/assessments/dharma-finder-2");
    expect(resolveInternalHref("/assessments")).toBe("/assessments");
    expect(resolveInternalHref("https://example.com/blog/akbar-cuisine-restoration-economics")).toBe("https://example.com/blog/akbar-cuisine-restoration-economics");
    expect(resolveInternalHref("")).toBe("");
  });
});
