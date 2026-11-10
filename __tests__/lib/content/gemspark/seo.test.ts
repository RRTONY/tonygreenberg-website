import { describe, expect, it } from "vitest";
import { GEMSPARK_OG_IMAGE, gemsparkMetadata } from "@/lib/content/gemspark/seo";
import { gemsparkImages } from "@/lib/content/gemspark/images";

describe("gemsparkMetadata", () => {
  it("sets the canonical, Open Graph and Twitter fields with the app's own share image", () => {
    const meta = gemsparkMetadata({ path: "/gem-spark/short", title: "The GemSpark (Short Version)", description: "A new word." });
    expect(meta.alternates?.canonical).toBe("/gem-spark/short");
    expect(meta.openGraph).toMatchObject({ url: "/gem-spark/short", title: "The GemSpark (Short Version)", images: [GEMSPARK_OG_IMAGE] });
    expect(meta.openGraph).not.toHaveProperty("locale");
    expect(meta.twitter).toMatchObject({ images: [GEMSPARK_OG_IMAGE.url] });
    expect(GEMSPARK_OG_IMAGE.url).toBe(gemsparkImages.shareImage.src);
  });

  it("adds the locale for a translated page", () => {
    const meta = gemsparkMetadata({ path: "/gem-spark/es/short", title: "El GemSpark", description: "Una nueva palabra.", locale: "es_ES" });
    expect(meta.openGraph).toMatchObject({ locale: "es_ES" });
  });

  it("names Tony as author and copyright holder, and pairs the English and Spanish short versions", () => {
    const meta = gemsparkMetadata({ path: "/gem-spark/short", title: "T", description: "D", languages: { en: "/gem-spark/short", es: "/gem-spark/es/short" } });
    expect(meta.authors).toEqual([{ name: "Tony Greenberg", url: "https://tonygreenberg.com" }]);
    expect(meta.other).toEqual({ copyright: "© 2026 Tony Greenberg. All Rights Reserved." });
    expect(meta.alternates).toEqual({ canonical: "/gem-spark/short", languages: { en: "/gem-spark/short", es: "/gem-spark/es/short" } });
    expect(gemsparkMetadata({ path: "/gem-spark", title: "T", description: "D" }).alternates).toEqual({ canonical: "/gem-spark" });
  });
});
