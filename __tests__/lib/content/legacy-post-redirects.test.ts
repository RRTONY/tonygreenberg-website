import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LEGACY_POST_REDIRECTS } from "@/lib/content/legacy-post-redirects";
import { POST_ORDER } from "@/lib/content/post-order";

describe("legacy-post-redirects", () => {
  it("has unique old paths, each a single top-level segment", () => {
    const paths = LEGACY_POST_REDIRECTS.map(([p]) => p);
    expect(new Set(paths).size).toBe(paths.length);
    for (const p of paths) expect(p).toMatch(/^\/[a-z0-9-]+$/);
  });

  it("sends every old path to a real essay", () => {
    for (const [p, slug] of LEGACY_POST_REDIRECTS) expect(POST_ORDER, `${p} -> ${slug}`).toContain(slug);
    expect(LEGACY_POST_REDIRECTS).toContainEqual(["/find-my-ev", "find-my-ev-paul-scott-wont-let-you-buy-a-gas-car"]);
  });

  it("never clashes with a page that exists in the app", () => {
    for (const [p] of LEGACY_POST_REDIRECTS) expect(existsSync(path.join(process.cwd(), "src/app", p, "page.tsx")), p).toBe(false);
  });
});
