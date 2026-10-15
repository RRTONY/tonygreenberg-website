import { describe, expect, it } from "vitest";
import { GEM_SPARK_SUBTITLES } from "@/lib/content/gem-sparks";
import { POST_ORDER } from "@/lib/content/post-order";

describe("gem-sparks", () => {
  it("has the two real GemSpark subtitles", () => {
    expect(GEM_SPARK_SUBTITLES).toEqual({
      "five-cups": "BrewSoul Edition",
      "you-are-the-moat": "One city at a time, starting June",
    });
  });

  it("keys only real essays and has no subtitle for the post without one", () => {
    for (const slug of Object.keys(GEM_SPARK_SUBTITLES)) expect(POST_ORDER).toContain(slug);
    expect(GEM_SPARK_SUBTITLES["india-my-virtual-soul-home"]).toBeUndefined();
  });
});
