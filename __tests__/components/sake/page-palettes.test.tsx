import { describe, expect, it } from "vitest";
import { guidePalette, ritualPalette } from "@/components/sake/page-palettes";

describe("page palettes", () => {
  it("gives the Kintsugi and Austere class sets", () => {
    expect(guidePalette(false).gold).toBe("text-[#c9a227]");
    expect(guidePalette(true).gold).toBe("text-red-800");
    expect(ritualPalette(false).page).toContain("bg-[#0d1321]");
    expect(ritualPalette(true).page).toContain("bg-[#f5f0e8]");
  });
});
