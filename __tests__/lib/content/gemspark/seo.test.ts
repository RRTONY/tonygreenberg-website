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
});
