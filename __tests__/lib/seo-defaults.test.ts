import { describe, expect, it } from "vitest";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  MAX_DESCRIPTION_LENGTH,
  defaultOpenGraph,
  defaultTwitter,
  seoDescription,
  seoMetadata,
  seoTitle,
} from "@/lib/seo-defaults";

describe("seo defaults", () => {
  it("the share image is the 1200x630 default with alt text", () => {
    expect(DEFAULT_OG_IMAGE).toEqual({ url: "/images/default-og.png", width: 1200, height: 630, alt: "TonyG: Only Time Buys Trust" });
  });

  it("openGraph carries the site name and the image", () => {
    expect(defaultOpenGraph).toEqual({ type: "website", siteName: "Tony Greenberg", images: [DEFAULT_OG_IMAGE] });
  });

  it("twitter uses a large card with the same image url", () => {
    expect(defaultTwitter).toMatchObject({ card: "summary_large_image", site: "@ThinkTony", creator: "@ThinkTony" });
    expect(defaultTwitter.images).toEqual([DEFAULT_OG_IMAGE.url]);
  });

  describe("seoTitle", () => {
    it("keeps a short title as is, so the layout adds | Tony Greenberg", () => {
      expect(seoTitle("Essays")).toBe("Essays");
    });

    it("drops the ending when the full title would pass 70 characters", () => {
      const title = "Restaurants Beware of Vegans and Vegans Beware of Lying Restaurants";
      expect(seoTitle(title)).toEqual({ absolute: title });
    });

    it("keeps the ending at exactly 70 characters", () => {
      const title = "x".repeat(70 - " | Tony Greenberg".length);
      expect(seoTitle(title)).toBe(title);
    });

    it("tidies spaces and leaves a missing title to the layout default", () => {
      expect(seoTitle("  Two   words ")).toBe("Two words");
      expect(seoTitle("")).toBeUndefined();
      expect(seoTitle(null)).toBeUndefined();
    });
  });

  describe("seoDescription", () => {
    it("keeps a description in range untouched", () => {
      const text = "Swiss Water, EA, CO2: the truth about decaf processing and what it means for your cup.";
      expect(seoDescription(text)).toBe(text);
    });

    it("uses the site default when there is none", () => {
      expect(seoDescription(undefined)).toBe(DEFAULT_DESCRIPTION);
      expect(seoDescription("   ")).toBe(DEFAULT_DESCRIPTION);
    });

    it("adds the fallback after a description too short to say anything", () => {
      expect(seoDescription("Essays on trust.", "More from Tony.")).toBe("Essays on trust. More from Tony.");
    });

    it("shortens a long one at a word break with an ellipsis", () => {
      const text = `${"word ".repeat(60)}end.`;
      const out = seoDescription(text);
      expect(out.length).toBeLessThanOrEqual(MAX_DESCRIPTION_LENGTH);
      expect(out).toMatch(/word…$/);
    });

    it("does not leave a dash or comma before the ellipsis", () => {
      const out = seoDescription(`${"a".repeat(150)} — ${"b".repeat(30)}`);
      expect(out).toBe(`${"a".repeat(150)}…`);
    });
  });

  describe("seoMetadata", () => {
    it("applies both and keeps every other field", () => {
      const meta = seoMetadata({
        title: "Convicted Embezzler Kristi Klawiter — $46,795 Stolen, Prior NJ Guilty Pleas",
        alternates: { canonical: "/protecting-your-business" },
      });
      expect(meta.title).toEqual({ absolute: "Convicted Embezzler Kristi Klawiter — $46,795 Stolen, Prior NJ Guilty Pleas" });
      expect(meta.description).toBe(DEFAULT_DESCRIPTION);
      expect(meta.alternates).toEqual({ canonical: "/protecting-your-business" });
    });

    it("leaves an absolute title alone", () => {
      expect(seoMetadata({ title: { absolute: "America, Unbundled" }, description: "x".repeat(60) }).title).toEqual({
        absolute: "America, Unbundled",
      });
    });
  });
});
