import { describe, expect, it } from "vitest";
import {
  AQUEOUS_COPYRIGHT,
  AQUEOUS_OG_IMAGE,
  AQUEOUS_SEO,
  aqueousMetadata,
  aqueousOgImage,
  aqueousTitle,
} from "@/lib/content/aqueous/seo";
import { aqueousImages } from "@/lib/content/aqueous/images";

describe("aqueousTitle", () => {
  it("uses the app's title format", () => {
    expect(aqueousTitle("Home")).toBe("Aqueous — Know What Flows Through Your Life");
    expect(aqueousTitle("Water Explorer")).toBe("Water Explorer | Aqueous");
  });
});

describe("aqueousOgImage", () => {
  it("shares the page's own hero where it has one, else the home hero, at 1200x630", () => {
    expect(aqueousOgImage("/manifesto")).toEqual({
      url: `${aqueousImages.natureSpringSource.src}?w=1200&h=630&fit=crop&auto=format`,
      width: 1200,
      height: 630,
      alt: aqueousImages.natureSpringSource.alt,
    });
    expect(aqueousOgImage("/philosophy").url).toContain(aqueousImages.natureSpringSource.src);
    expect(aqueousOgImage("/methodology").url).toContain(aqueousImages.waterTestingLab.src);
    expect(aqueousOgImage("/explore")).toEqual(AQUEOUS_OG_IMAGE);
    expect(AQUEOUS_OG_IMAGE.url).toMatch(/^https:\/\/cdn\.sanity\.io\/.+\?w=1200&h=630&fit=crop&auto=format$/);
  });
});

describe("aqueousMetadata", () => {
  it("gives a page its title, description, canonical, share image and author", () => {
    const { title, description } = AQUEOUS_SEO.methodology;
    const m = aqueousMetadata({ path: "/methodology", title, description });
    expect(m.title).toBe("QPR Methodology | Aqueous");
    expect(m.description).toBe(description);
    expect(m.alternates?.canonical).toBe("/aqueous/methodology");
    expect(m.authors).toEqual([{ name: "Tony Greenberg", url: "https://tonygreenberg.com" }]);
    expect(m.other).toEqual({ copyright: AQUEOUS_COPYRIGHT });
    expect(m.robots).toBeUndefined();
    expect(m.openGraph).toMatchObject({
      siteName: "Aqueous by Tony Greenberg",
      title: "QPR Methodology | Aqueous",
      description,
      url: "/aqueous/methodology",
      images: [aqueousOgImage("/methodology")],
    });
    expect(m.twitter).toMatchObject({ title: "QPR Methodology | Aqueous", images: [aqueousOgImage("/methodology").url] });
  });

  it("keeps the home canonical at /aqueous and hides private pages from search", () => {
    const home = aqueousMetadata({ path: "/", ...AQUEOUS_SEO.home });
    expect(home.alternates?.canonical).toBe("/aqueous");
    expect(home.title).toBe("Aqueous — Know What Flows Through Your Life");
    const dash = aqueousMetadata({ path: "/dashboard", ...AQUEOUS_SEO.dashboard, noindex: true });
    expect(dash.robots).toEqual({ index: false, follow: true });
    // A thin description is filled out by the shared helper, never left under 50 characters.
    expect((dash.description as string).length).toBeGreaterThanOrEqual(50);
    expect(dash.description).toMatch(/^Your personal Aqueous dashboard/);
  });

  it("drops the site suffix only when a title is too long for it", () => {
    const m = aqueousMetadata({ path: "/x", title: "A very long Aqueous page title that goes on", description: "d" });
    expect(m.title).toEqual({ absolute: "A very long Aqueous page title that goes on | Aqueous" });
  });
});

describe("AQUEOUS_SEO", () => {
  it("has a title and a description for every page, with no Manus links", () => {
    for (const [key, seo] of Object.entries(AQUEOUS_SEO)) {
      expect(seo.title.trim(), key).not.toBe("");
      expect(seo.description.trim(), key).not.toBe("");
      expect(seo.description.length, key).toBeLessThanOrEqual(160);
    }
    expect(JSON.stringify(AQUEOUS_SEO)).not.toMatch(/manus|\/api\/img\//i);
  });
});
