import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { HOME_DOORS } from "@/lib/content/home-doors";

describe("home-doors", () => {
  it("has the four doors 01..04: Read, Diagnose, Engage, Verify", () => {
    expect(HOME_DOORS.map((d) => [d.num, d.title])).toEqual([["01", "Read"], ["02", "Diagnose"], ["03", "Engage"], ["04", "Verify"]]);
  });

  it("links Read to the archive anchor and the rest to real pages", () => {
    expect(HOME_DOORS[0].href).toBe("#essays-archive");
    for (const d of HOME_DOORS.slice(1)) {
      expect(d.href).toMatch(/^\//);
      expect(existsSync(path.join(process.cwd(), "src/app", d.href, "page.tsx")), d.href).toBe(true);
    }
  });

  it("uses Sanity images with matching dimensions, never Manus", () => {
    for (const d of HOME_DOORS) {
      expect(d.img).toMatch(/^https:\/\/cdn\.sanity\.io\/images\//);
      expect(d.img).not.toMatch(/manuscdn|\/manus-storage\/|\/api\/img\//);
      expect(d.img).toContain(`-${d.imgWidth}x${d.imgHeight}.`);
    }
  });

  it("fills in copy, bullets, a CTA and an icon fallback, with {count} only on Read", () => {
    for (const d of HOME_DOORS) {
      expect(d.headline && d.body && d.cta && d.sub).toBeTruthy();
      expect(d.bullets).toHaveLength(3);
      expect(d.icon).toBeTruthy();
    }
    const withCount = HOME_DOORS.filter((d) => d.bullets.some((b) => b.includes("{count}")));
    expect(withCount.map((d) => d.title)).toEqual(["Read"]);
  });
});
