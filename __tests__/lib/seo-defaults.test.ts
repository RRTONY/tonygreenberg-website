import { describe, expect, it } from "vitest";
import { DEFAULT_OG_IMAGE, defaultOpenGraph, defaultTwitter } from "@/lib/seo-defaults";

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
});
