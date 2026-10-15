import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LINK_MAP, autoLinkSegments } from "@/lib/content/link-map";
import { POST_ORDER } from "@/lib/content/post-order";

describe("LINK_MAP", () => {
  it("links to https sites or internal pages that exist, never Manus", () => {
    for (const [name, href] of Object.entries(LINK_MAP)) {
      expect(name.trim()).not.toBe("");
      expect(href).not.toMatch(/manus|\/api\/img\//);
      if (href.startsWith("/blog/")) expect(POST_ORDER, name).toContain(href.slice(6));
      else if (href.startsWith("/")) expect(existsSync(path.join(process.cwd(), "src/app", href, "page.tsx")), `${name} -> ${href}`).toBe(true);
      else expect(href, name).toMatch(/^https:\/\//);
    }
  });

  it("sends RampRate and the manifesto names to the right places", () => {
    expect(LINK_MAP.RampRate).toBe("https://ramprate.com");
    expect(LINK_MAP["The Manifesto"]).toBe("/living-declaration");
    expect(LINK_MAP.FRQNCY).toBe("/blog/frqncy-the-bus-that-restores-the-world");
  });
});

describe("autoLinkSegments", () => {
  it("returns the text unchanged when nothing matches, and nothing for empty text", () => {
    expect(autoLinkSegments("Nothing to see here")).toEqual(["Nothing to see here"]);
    expect(autoLinkSegments("")).toEqual([]);
  });

  it("links a known name between plain text segments", () => {
    expect(autoLinkSegments("I founded RampRate in 2000.")).toEqual(["I founded ", { text: "RampRate", href: "https://ramprate.com" }, " in 2000."]);
  });

  it("prefers the longest name and links each name only once", () => {
    expect(autoLinkSegments("Akbar Cuisine of India")).toEqual([{ text: "Akbar Cuisine of India", href: "/akbar" }]);
    const segs = autoLinkSegments("RampRate, then RampRate again.");
    expect(segs.filter((s) => typeof s !== "string")).toEqual([{ text: "RampRate", href: "https://ramprate.com" }]);
  });

  it("respects word boundaries", () => {
    expect(autoLinkSegments("Meta-Pattern thinking")).toEqual(["Meta-Pattern thinking"]);
    expect(autoLinkSegments("(Meta)")).toEqual(["(", { text: "Meta", href: LINK_MAP.Meta }, ")"]);
  });

  // Fixed 2026-10-16: only the first occurrence of each name used to be
  // checked, so a later stand-alone mention was never linked.
  it("still links a name whose first appearance is inside another word", () => {
    expect(autoLinkSegments("RampRate-ish and RampRate")).toContainEqual({ text: "RampRate", href: "https://ramprate.com" });
  });
});
