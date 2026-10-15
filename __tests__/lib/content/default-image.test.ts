import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { DEFAULT_OG_IMAGE, DEFAULT_ESSAY_HERO } from "@/lib/content/default-image";

describe("default-image", () => {
  it("points the OG fallback at a file that exists in public/", () => {
    expect(DEFAULT_OG_IMAGE).toBe("/images/default-og.png");
    expect(existsSync(path.join(process.cwd(), "public", DEFAULT_OG_IMAGE))).toBe(true);
  });

  it("hosts the essay hero on Sanity, not Manus, with its real size", () => {
    expect(DEFAULT_ESSAY_HERO.src).toMatch(/^https:\/\/cdn\.sanity\.io\/images\/a3q1cyqs\/production\//);
    expect(DEFAULT_ESSAY_HERO.src).not.toMatch(/manuscdn|\/manus-storage\/|\/api\/img\//);
    expect(DEFAULT_ESSAY_HERO.src).toContain(`-${DEFAULT_ESSAY_HERO.width}x${DEFAULT_ESSAY_HERO.height}.`);
    expect(DEFAULT_ESSAY_HERO.width).toBeGreaterThanOrEqual(1200);
  });
});
