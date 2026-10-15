import { describe, expect, it } from "vitest";
import { KIT_TAG_MAP, KIT_DYNAMIC_TAG_PREFIXES, resolveKitTag } from "@/lib/content/kit-source-tags";

describe("resolveKitTag", () => {
  it("returns the mapped tag for a known source", () => {
    expect(resolveKitTag("footer")).toBe("Website Footer");
    expect(resolveKitTag("find-your-me")).toBe("Assessment: Find Your Me");
    expect(resolveKitTag("assessment-crusader")).toBe("Assessment: Crusader");
  });

  it("maps EmailGate's find-your- aliases to the same tag as the bare keys", () => {
    for (const k of ["consciousness-scale", "grant-study", "dharma-finder"]) {
      expect(resolveKitTag(`find-your-${k}`)).toBe(resolveKitTag(k));
    }
  });

  it("matches dynamic sources by prefix", () => {
    expect(resolveKitTag("jewel-box:five-cups")).toBe("Exit Intent: Jewel Box");
    expect(resolveKitTag("outburst-you-are-the-moat")).toBe("Blog: Subscribe Outburst");
    expect(resolveKitTag("micro-yes-3")).toBe("Blog: Micro-Yes Flow");
    expect(resolveKitTag("tip-me-off")).toBe("Engagement: Tip Me Off");
  });

  it("falls back to a generated Source tag for unknown or empty sources", () => {
    expect(resolveKitTag("something-new")).toBe("Source: something-new");
    expect(resolveKitTag("")).toBe("Source: ");
  });

  // KIT_TAG_MAP is a plain object, so KIT_TAG_MAP["constructor"] finds
  // Object.prototype.constructor and returns a function instead of a string.
  // The source comes from the browser, so anyone can send it.
  it.fails("BUG: a source named like an Object.prototype key returns a function, not a tag", () => {
    expect(resolveKitTag("constructor")).toBe("Source: constructor");
    expect(resolveKitTag("toString")).toBe("Source: toString");
  });

  it("has non-empty tags everywhere", () => {
    for (const tag of [...Object.values(KIT_TAG_MAP), ...KIT_DYNAMIC_TAG_PREFIXES.map(([, t]) => t)]) expect(tag.trim()).not.toBe("");
  });
});
