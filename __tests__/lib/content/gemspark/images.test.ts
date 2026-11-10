import { describe, expect, it } from "vitest";
import { gemsparkImages } from "@/lib/content/gemspark/images";

describe("gemsparkImages", () => {
  it("hosts every image on Sanity, never Manus, with its size in the address and real alt text", () => {
    for (const img of Object.values(gemsparkImages)) {
      expect(img.src).toMatch(/^https:\/\/cdn\.sanity\.io\/images\//);
      expect(img.src).toContain(`-${img.width}x${img.height}.`);
      expect(img.alt.trim()).not.toBe("");
    }
  });
});
