import { describe, expect, it } from "vitest";
import { FAME } from "@/lib/content/brewsoul-decaf";

describe("brewsoul-decaf Hall of Fame", () => {
  it("lists the 13 real brands with unique names", () => {
    expect(FAME).toHaveLength(13);
    expect(new Set(FAME.map((b) => b.name)).size).toBe(13);
    expect(FAME[0].name).toBe("Holistic Roasters Biodynamic Decaf");
  });

  it("fills every field and uses the Swiss Water process", () => {
    for (const b of FAME) {
      for (const v of Object.values(b)) expect(String(v).trim()).not.toBe("");
      expect(b.process).toMatch(/^Swiss Water/);
    }
  });

  it("has per-ounce prices in $x.xx form and https links", () => {
    for (const b of FAME) {
      expect(b.perOz).toMatch(/^\$\d+\.\d{2}$/);
      expect(b.url).toMatch(/^https:\/\//);
      expect(b.url).not.toMatch(/manuscdn|\/manus-storage\/|\/api\/img\//);
    }
  });

  it("uses full literal Tailwind colour classes", () => {
    for (const b of FAME) {
      expect(b.colorClass).toMatch(/^bg-\[#[0-9a-f]{6}\]$/i);
      expect(b.borderClass).toMatch(/^border-l-\[#[0-9a-f]{6}\]$/i);
    }
  });
});
