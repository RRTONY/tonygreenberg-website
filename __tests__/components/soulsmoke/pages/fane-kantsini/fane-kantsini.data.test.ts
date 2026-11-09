import { describe, expect, it } from "vitest";
import {
  COLLECTIVE_CONTENT,
  MAIN_MONTAGE_TRANSCRIPT,
  ORIGIN_STORY,
  faneKantsiniMedia,
  formatTimestamp,
} from "@/components/soulsmoke/pages/fane-kantsini/fane-kantsini.data";

describe("fane-kantsini data", () => {
  it("has the origin story in both languages, each with the one linked paragraph", () => {
    for (const lang of ["en", "es"] as const) {
      const linked = ORIGIN_STORY[lang].paragraphs.filter((p) => typeof p !== "string");
      expect(linked).toHaveLength(1);
      expect(ORIGIN_STORY[lang].closing).toHaveLength(3);
    }
  });

  it("keeps the collective copy and a 100-second transcript", () => {
    expect(COLLECTIVE_CONTENT.philosophy.points).toHaveLength(3);
    expect(MAIN_MONTAGE_TRANSCRIPT).toHaveLength(20);
    expect(MAIN_MONTAGE_TRANSCRIPT.at(-1)?.end).toBe(100);
  });

  it("has no Manus-hosted media (missing pieces are null until rescued)", () => {
    expect(JSON.stringify(faneKantsiniMedia)).not.toMatch(/manus/i);
    expect(faneKantsiniMedia.photos).toHaveLength(8);
  });

  it("formats transcript times as m:ss", () => {
    expect(formatTimestamp(0)).toBe("0:00");
    expect(formatTimestamp(65)).toBe("1:05");
  });
});
