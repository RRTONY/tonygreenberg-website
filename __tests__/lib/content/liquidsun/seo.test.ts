import { describe, expect, it } from "vitest";
import { LIQUIDSUN_COPYRIGHT, LIQUIDSUN_OG_IMAGE, liquidsunMetadata, liquidsunOgImage } from "@/lib/content/liquidsun/seo";
import { liquidsunJsonLd } from "@/lib/content/liquidsun/structured-data";
import { producers } from "@/lib/content/liquidsun/producers";

describe("liquidsunMetadata", () => {
  it("gives each page its own title, canonical, share image and author", () => {
    const description = "Here lies the pinnacle of the spirit. Offerings to the gods of agave, from Fuenteseca to Rey Sol.";
    const m = liquidsunMetadata({ path: "/altar", title: "The Altar | LiquidSun", description });
    expect(m.title).toBe("The Altar | LiquidSun");
    expect(m.description).toBe(description);
    expect(m.alternates?.canonical).toBe("/liquid-sun/altar");
    expect(m.authors).toEqual([{ name: "Tony Greenberg", url: "https://tonygreenberg.com" }]);
    expect(m.other).toEqual({ copyright: LIQUIDSUN_COPYRIGHT });
    // The Altar shares its own hero (the altar shrine), not the home hero.
    expect(m.openGraph).toMatchObject({ siteName: "LiquidSun by Tony Greenberg", url: "/liquid-sun/altar", images: [liquidsunOgImage("/altar")] });
    expect(m.twitter).toMatchObject({ images: [liquidsunOgImage("/altar").url] });
    expect(liquidsunOgImage("/altar").url).toContain("ca1655e5763192e4a5e6693817fafd817515e737");
    expect(liquidsunOgImage("/evolution")).toEqual(LIQUIDSUN_OG_IMAGE);
    expect(m.robots).toBeUndefined();
    expect(LIQUIDSUN_OG_IMAGE.url).toMatch(/^https:\/\/cdn\.sanity\.io\/.+\?w=1200&h=630&fit=crop&auto=format$/);
  });

  it("keeps the home canonical at /liquid-sun and hides noindex pages from search", () => {
    expect(liquidsunMetadata({ path: "/", title: "LiquidSun", description: "x" }).alternates?.canonical).toBe("/liquid-sun");
    const hidden = liquidsunMetadata({ path: "/speakeasy", title: "Restricted Area | LiquidSun", description: "x", noindex: true });
    expect(hidden.robots).toEqual({ index: false, follow: true });
  });
});

describe("liquidsunJsonLd", () => {
  const graph = (path: string, title: string) => liquidsunJsonLd({ path, title, description: "d" })["@graph"] as Record<string, unknown>[];

  it("describes a page inside the LiquidSun guide with a breadcrumb", () => {
    const [page, crumbs, guide, ...rest] = graph("/altar", "The Altar | LiquidSun");
    expect(page).toMatchObject({ "@type": "WebPage", name: "The Altar", url: "https://tonygreenberg.com/liquid-sun/altar" });
    expect((crumbs.itemListElement as { name: string }[]).map((c) => c.name)).toEqual(["Tony Greenberg", "LiquidSun", "The Altar"]);
    expect(guide).toMatchObject({ "@type": "CreativeWork", name: "LiquidSun" });
    expect(rest).toHaveLength(0);
  });

  it("lists the bottles (names only) on the home page and The Tequilas", () => {
    const home = graph("/", "LiquidSun — The Soul of Tequila | Additive-Free Curation");
    expect(home[0]).toMatchObject({ "@type": "CollectionPage", name: "LiquidSun" });
    expect((home[1].itemListElement as unknown[]).length).toBe(2);
    expect(home[3]).toMatchObject({ "@type": "ItemList", name: "LiquidSun Curated Tequila Collection", numberOfItems: producers.length });
    const encyclopedia = graph("/tequila-encyclopedia", "The Tequilas | LiquidSun");
    expect(encyclopedia[3]).toMatchObject({ name: "The Tequilas" });
    expect(JSON.stringify(encyclopedia)).not.toMatch(/price|rating/i);
  });

  it("lists the Flavor Matrix bottles and the US Hunt / Jalisco Source places by name", () => {
    const list = (path: string) => graph(path, "x | LiquidSun").find((n) => n["@type"] === "ItemList") as { itemListElement: { name: string }[] };
    expect(list("/quadrant").itemListElement.map((i) => i.name)).toContain("Fortaleza Blanco");
    expect(list("/us-hunt").itemListElement.map((i) => i.name)).toContain("Old Town Tequila");
    expect(list("/jalisco-source").itemListElement.map((i) => i.name)).toContain("La Capilla");
    expect(graph("/process", "The Process | LiquidSun").some((n) => n["@type"] === "ItemList")).toBe(false);
  });
});
