import { describe, expect, it } from "vitest";
import { getFurtherReading } from "@/lib/content/further-reading";
import { CATEGORY_ORDER } from "@/lib/content/articles-discovery";

describe("getFurtherReading", () => {
  it("returns the category's 5 links when there is no format tag", () => {
    const links = getFurtherReading("Business & Capital", "");
    expect(links).toHaveLength(5);
    expect(links[0]).toMatchObject({ title: "The Fifth Discipline", source: "Peter Senge" });
  });

  it("puts format links first, removes duplicate URLs and caps the list at 5", () => {
    const links = getFurtherReading("The Crusades", "The Crusade");
    expect(links).toHaveLength(5);
    expect(links.slice(0, 3).map((l) => l.title)).toEqual(["Dark Patterns Tip Line", "Consumer Financial Protection Bureau", "FTC Consumer Complaint"]);
    expect(new Set(links.map((l) => l.url)).size).toBe(5);
  });

  it("mixes the format's links with the category's", () => {
    const links = getFurtherReading("Living Well", "The Lesson");
    expect(links.map((l) => l.title)).toEqual([
      "Poor Charlie's Almanack", "The Almanack of Naval Ravikant", "Count Down", "The Body Keeps the Score", "Peter Attia's Outlive",
    ]);
  });

  it("falls back to Impact & Purpose for an unknown or empty category", () => {
    const fallback = getFurtherReading("Impact & Purpose", "");
    expect(getFurtherReading("Not A Category", "Not A Format")).toEqual(fallback);
    expect(getFurtherReading("", "")).toEqual(fallback);
    expect(fallback[0].title).toBe("ImpactSoul");
  });

  it("only returns complete https links for every real category", () => {
    for (const cat of [...CATEGORY_ORDER, "Unknown"]) {
      for (const l of getFurtherReading(cat, "The Systems Map")) {
        expect(l.url).toMatch(/^https:\/\//);
        expect(l.title.trim() && l.source.trim() && l.why.trim()).toBeTruthy();
      }
    }
  });
});
