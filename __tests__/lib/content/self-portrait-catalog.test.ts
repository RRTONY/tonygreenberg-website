import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { SELF_PORTRAIT_CATALOG, SELF_PORTRAIT_CATALOG_BY_SLUG } from "@/lib/content/self-portrait-catalog";

describe("self-portrait-catalog", () => {
  it("has 13 unique assessment slugs with a title and summary", () => {
    expect(SELF_PORTRAIT_CATALOG).toHaveLength(13);
    expect(new Set(SELF_PORTRAIT_CATALOG.map((e) => e.slug)).size).toBe(13);
    for (const e of SELF_PORTRAIT_CATALOG) expect(e.title.trim() && e.summary.trim()).toBeTruthy();
  });

  it("names a real top-level page for every slug", () => {
    for (const e of SELF_PORTRAIT_CATALOG) expect(existsSync(path.join(process.cwd(), "src/app", e.slug, "page.tsx")), e.slug).toBe(true);
  });

  it("looks entries up by slug", () => {
    expect(SELF_PORTRAIT_CATALOG_BY_SLUG["the-mirror"]?.title).toBe("The Mirror");
    expect(SELF_PORTRAIT_CATALOG_BY_SLUG.assessment?.title).toBe("Reader Path");
    expect(SELF_PORTRAIT_CATALOG_BY_SLUG["not-an-assessment"]).toBeUndefined();
    expect(Object.keys(SELF_PORTRAIT_CATALOG_BY_SLUG)).toHaveLength(SELF_PORTRAIT_CATALOG.length);
  });
});
