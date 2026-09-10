import { describe, expect, it } from "vitest";
import { getSkippyStats, SKIPPY_STOP_IDS, SKIPPY_TRACKS } from "@/lib/content/skippy-map";

describe("Skippy map content", () => {
  it("uses unique, internal destinations for every verified stop", () => {
    expect(new Set(SKIPPY_STOP_IDS).size).toBe(SKIPPY_STOP_IDS.length);
    expect(
      SKIPPY_TRACKS.flatMap((track) => track.stops).every((stop) => stop.href.startsWith("/")),
    ).toBe(true);
  });

  it("counts only known stops toward completion progress", () => {
    const stats = getSkippyStats(new Set([SKIPPY_STOP_IDS[0]!, "not-a-stop"]));

    expect(stats.completed).toBe(1);
    expect(stats.total).toBe(SKIPPY_STOP_IDS.length);
  });
});
