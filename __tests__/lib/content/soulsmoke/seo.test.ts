import { describe, expect, it } from "vitest";
import { soulsmokeMetadata, SOULSMOKE_OG_IMAGE } from "@/lib/content/soulsmoke/seo";
import { soulsmokeRoutes, ss, soulsmokeMainNav, soulsmokeExploreNav, soulsmokeMoreNav } from "@/lib/content/soulsmoke/nav";
import { soulsmokeImages } from "@/lib/content/soulsmoke/images";
import { soulsmokeTranslations } from "@/lib/content/soulsmoke/translations";

describe("soulsmokeMetadata", () => {
  it("sets the canonical, share image and title for a SoulSmoke page", () => {
    const meta = soulsmokeMetadata({
      path: "/us-hunt",
      title: "The US Hunt | SoulSmoke",
      description: "The most esoteric, mind-bending bottles that somehow made it across the border.",
    });
    expect(meta.alternates?.canonical).toBe("/soul-smoke/us-hunt");
    expect(meta.title).toBe("The US Hunt | SoulSmoke");
    expect(meta.openGraph).toMatchObject({ url: "/soul-smoke/us-hunt", images: [SOULSMOKE_OG_IMAGE] });
    expect(meta.twitter).toMatchObject({ images: [SOULSMOKE_OG_IMAGE.url] });
    expect(SOULSMOKE_OG_IMAGE.url).toContain("cdn.sanity.io");
    expect(SOULSMOKE_OG_IMAGE.url).toContain("w=1200&h=630");
  });

  it("names Tony Greenberg as author and copyright holder (not the app's \"Tony Huang\")", () => {
    const meta = soulsmokeMetadata({ path: "/us-hunt", title: "The US Hunt | SoulSmoke", description: "x" });
    expect(meta.authors).toEqual([{ name: "Tony Greenberg", url: "https://tonygreenberg.com" }]);
    expect(meta.other).toEqual({ copyright: "© 2026 Tony Greenberg. All Rights Reserved." });
    expect(JSON.stringify(meta)).not.toMatch(/Huang/);
  });

  it("uses /soul-smoke as the home canonical", () => {
    expect(soulsmokeMetadata({ path: "/", title: "SoulSmoke", description: "x".repeat(60) }).alternates?.canonical).toBe(
      "/soul-smoke",
    );
  });
});

describe("SoulSmoke nav data", () => {
  it("prefixes paths with /soul-smoke", () => {
    expect(ss("/")).toBe("/soul-smoke");
    expect(ss("")).toBe("/soul-smoke");
    expect(ss("/us-hunt")).toBe("/soul-smoke/us-hunt");
    expect(ss("us-hunt")).toBe("/soul-smoke/us-hunt");
  });

  it("only links menu items to real SoulSmoke routes", () => {
    const routes = new Set<string>(soulsmokeRoutes);
    for (const item of [...soulsmokeMainNav, ...soulsmokeExploreNav, ...soulsmokeMoreNav]) {
      expect(routes.has(item.path)).toBe(true);
    }
  });

  it("serves every image from Sanity with alt text, never from Manus", () => {
    for (const image of Object.values(soulsmokeImages)) {
      expect(image.src).toMatch(/^https:\/\/cdn\.sanity\.io\//);
      expect(image.width).toBeGreaterThan(0);
    }
    expect(JSON.stringify(soulsmokeImages)).not.toMatch(/manus/i);
  });

  it("has an English and Spanish string set", () => {
    expect(soulsmokeTranslations.en["hero.subtitle"]).toBe("The Miracle of Mezcal");
    expect(soulsmokeTranslations.es["hero.subtitle"]).toBeTruthy();
  });
});
