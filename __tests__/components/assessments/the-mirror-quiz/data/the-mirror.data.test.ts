import { describe, expect, it } from "vitest";
import { MIRROR_DIMENSIONS } from "@/lib/content/mirror-data";
import {
  ECOSYSTEM_PILLS,
  JOURNEY_CONTINUES,
  SATELLITE_SITES,
  SHARE_URL,
  getFlowLabel,
  scoreBarClass,
  scoreTextClass,
  theMirrorData,
} from "@/components/assessments/the-mirror-quiz/data/the-mirror.data";

describe("the-mirror data", () => {
  it("getFlowLabel bands at 2, 4, 6 and 8", () => {
    expect(getFlowLabel(0)).toBe("Starting Point");
    expect(getFlowLabel(1)).toBe("Starting Point");
    expect(getFlowLabel(2)).toBe("Friction Zone");
    expect(getFlowLabel(4)).toBe("In Transition");
    expect(getFlowLabel(6)).toBe("Approaching Flow");
    expect(getFlowLabel(8)).toBe("Deep Flow");
    expect(getFlowLabel(9)).toBe("Deep Flow");
  });

  it("score classes are full literal classes per band", () => {
    expect(scoreTextClass(8)).toBe("text-emerald-700");
    expect(scoreTextClass(6)).toBe("text-emerald-600");
    expect(scoreTextClass(4)).toBe("text-amber-700");
    expect(scoreTextClass(3)).toBe("text-red-800");
    expect(scoreBarClass(7)).toBe("bg-emerald-600");
    expect(scoreBarClass(5)).toBe("bg-amber-600");
    expect(scoreBarClass(4)).toBe("bg-red-600");
  });

  it("satellite sites point at real dimensions and internal links start with /", () => {
    const ids = MIRROR_DIMENSIONS.map((d) => d.id);
    for (const s of SATELLITE_SITES) {
      expect(ids).toContain(s.dimension);
      expect(s.url).toMatch(/^\//);
    }
    for (const j of JOURNEY_CONTINUES) expect(j.url).toMatch(/^\//);
    for (const p of ECOSYSTEM_PILLS) {
      if (!p.href) continue;
      expect(p.external ? p.href.startsWith("https://") : p.href.startsWith("/")).toBe(true);
    }
    expect(new Set(ECOSYSTEM_PILLS.map((p) => p.label)).size).toBe(ECOSYSTEM_PILLS.length);
  });

  it("share text includes the score out of 9", () => {
    expect(theMirrorData.results.shareText(7)).toContain("My score: 7/9");
    expect(SHARE_URL).toBe("https://tonygreenberg.com/the-mirror");
  });
});
