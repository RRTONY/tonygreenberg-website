import { describe, expect, it } from "vitest";
import { bottleKindFor, getBottleImage, sakeImages } from "@/lib/content/sake/images";
import { sakeDetailPath, sakeDropdowns, sakePageIndex, sakeRoutes, sakeUnlistedRoutes, sk } from "@/lib/content/sake/nav";
import { SAKE_HOME_DESCRIPTION, SAKE_HOME_TITLE, sakeJsonLd, sakeMetadata, sakeTitle } from "@/lib/content/sake/seo";

describe("sake nav", () => {
  it("prefixes app paths with /sake", () => {
    expect(sk("/")).toBe("/sake");
    expect(sk("")).toBe("/sake");
    expect(sk("/rice")).toBe("/sake/rice");
    expect(sk("rice")).toBe("/sake/rice");
    expect(sk("?tab=1")).toBe("/sake?tab=1");
    expect(sk("#top")).toBe("/sake#top");
    expect(sakeDetailPath("born gold")).toBe("/sake/bottle/born%20gold");
  });

  it("lists every menu link as a real route, and keeps search entries on real routes", () => {
    const routes = new Set<string>(sakeRoutes);
    for (const dd of sakeDropdowns) for (const link of dd.links) expect(routes.has(link.href)).toBe(true);
    for (const entry of sakePageIndex) expect(routes.has(entry.href)).toBe(true);
    for (const path of sakeUnlistedRoutes) expect(routes.has(path)).toBe(true);
    expect(sakePageIndex.find((p) => p.id === "qpr")?.href).toBe("/qpr");
  });
});

describe("sake images", () => {
  it("picks the app's bottle per sake type, in the app's order", () => {
    expect(bottleKindFor("Nigori Junmai")).toBe("nigori");
    expect(bottleKindFor("Sparkling")).toBe("sparkling");
    expect(bottleKindFor("Koshu")).toBe("aged");
    expect(bottleKindFor("Kimoto Junmai")).toBe("yamahai");
    expect(bottleKindFor("Futsu-shu")).toBe("can");
    expect(bottleKindFor("Junmai (can)")).toBe("can");
    expect(bottleKindFor("American Craft")).toBe("craft");
    expect(bottleKindFor("Junmai Daiginjo")).toBe("daiginjo");
    expect(bottleKindFor("Junmai Ginjo")).toBe("ginjo");
    expect(bottleKindFor("Honjozo")).toBe("honjozo");
    expect(bottleKindFor("Tokubetsu Junmai")).toBe("ginjo");
    expect(bottleKindFor("Junmai")).toBe("junmai");
  });

  it("has no picture yet for any entry (stand-ins still to be chosen)", () => {
    expect(getBottleImage("Junmai")).toBeNull();
    expect(Object.values(sakeImages).every((v) => v === null)).toBe(true);
  });
});

describe("sake seo", () => {
  it("titles pages after the guide and keeps the app's home title", () => {
    expect(sakeTitle("Home")).toBe(SAKE_HOME_TITLE);
    expect(sakeTitle("Rice Encyclopedia")).toBe("Rice Encyclopedia | Sake for Sake's Sake™");
  });

  it("builds canonical, robots and share data", () => {
    const meta = sakeMetadata({ path: "/rice", title: "Rice Encyclopedia", description: "Every great sake begins with a grain of rice." });
    expect(meta.alternates?.canonical).toBe("/sake/rice");
    expect(meta.robots).toMatchObject({ index: true, follow: true, noarchive: true, noimageindex: true });
    expect(meta.openGraph).toMatchObject({ title: "Rice Encyclopedia | Sake for Sake's Sake™", url: "/sake/rice" });
    expect(meta.twitter).toMatchObject({ title: "Rice Encyclopedia | Sake for Sake's Sake™", images: ["/sake/twitter-image.png"] });
    expect(meta.openGraph).toMatchObject({ images: [{ url: "/sake/opengraph-image.png", width: 1200, height: 630 }] });

    const hidden = sakeMetadata({ path: "/favorites", title: "Favorites", description: "x", noindex: true });
    expect(hidden.robots).toEqual({ index: false, follow: true });

    const detail = sakeMetadata({ path: "/sake/born-gold", href: "/sake/bottle/born-gold", title: "Born Gold", description: "x" });
    expect(detail.alternates?.canonical).toBe("/sake/bottle/born-gold");
  });

  it("describes the page in the guide with a breadcrumb", () => {
    const home = sakeJsonLd({ path: "/", title: "Home", description: SAKE_HOME_DESCRIPTION });
    const homePage = home["@graph"][1] as { name: string; breadcrumb: { itemListElement: unknown[] } };
    expect(homePage.name).toBe(SAKE_HOME_TITLE);
    expect(homePage.breadcrumb.itemListElement).toHaveLength(2);

    const rice = sakeJsonLd({ path: "/rice", title: "Rice Encyclopedia", description: "x" });
    const ricePage = rice["@graph"][1] as { url: string; breadcrumb: { itemListElement: { name: string }[] } };
    expect(ricePage.url).toMatch(/\/sake\/rice$/);
    expect(ricePage.breadcrumb.itemListElement[2].name).toBe("Rice Encyclopedia");
  });
});
