import { describe, expect, it } from "vitest";
import { aqueousJsonLd } from "@/lib/content/aqueous/structured-data";
import { aqueousOgImage } from "@/lib/content/aqueous/seo";
import { bottledWaters } from "@/lib/content/aqueous/water-data";

const graph = (path: string, title: string) => aqueousJsonLd({ path, title, description: "d" })["@graph"] as Record<string, unknown>[];

describe("aqueousJsonLd", () => {
  it("describes the home page as the Aqueous guide, with a two-step breadcrumb", () => {
    const ld = aqueousJsonLd({ path: "/", title: "Aqueous — Know What Flows Through Your Life", description: "Home d" });
    expect(ld["@context"]).toBe("https://schema.org");
    const [guide, page, crumbs, ...rest] = ld["@graph"] as Record<string, unknown>[];
    expect(guide).toMatchObject({
      "@type": "CreativeWork",
      "@id": "https://tonygreenberg.com/aqueous#guide",
      name: "Aqueous",
      url: "https://tonygreenberg.com/aqueous",
      author: { "@id": "https://tonygreenberg.com/#person" },
    });
    expect(page).toMatchObject({
      "@type": "WebPage",
      "@id": "https://tonygreenberg.com/aqueous#webpage",
      name: "Aqueous",
      description: "Home d",
      isPartOf: { "@id": "https://tonygreenberg.com/aqueous#guide" },
      image: aqueousOgImage("/").url,
    });
    expect(page).not.toHaveProperty("mainEntity");
    expect(crumbs.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Tony Greenberg", item: "https://tonygreenberg.com" },
      { "@type": "ListItem", position: 2, name: "Aqueous", item: "https://tonygreenberg.com/aqueous" },
    ]);
    expect(rest).toHaveLength(0);
  });

  it("names an inner page without the ' | Aqueous' suffix and uses its own share image", () => {
    const [, page, crumbs] = graph("/manifesto", "Manifesto | Aqueous");
    expect(page).toMatchObject({ "@type": "WebPage", name: "Manifesto", url: "https://tonygreenberg.com/aqueous/manifesto" });
    expect(page.image).toBe(aqueousOgImage("/manifesto").url);
    expect((crumbs.itemListElement as { name: string; item: string }[]).at(-1)).toMatchObject({
      name: "Manifesto",
      item: "https://tonygreenberg.com/aqueous/manifesto",
    });
  });

  it.each(["/explore", "/awi", "/compare"])("lists the waters by name only on %s", (path) => {
    const nodes = graph(path, "Water Explorer | Aqueous");
    expect(nodes[1]).toMatchObject({ "@type": "CollectionPage", mainEntity: { "@id": `https://tonygreenberg.com/aqueous${path}#waters` } });
    const list = nodes[3] as { name: string; numberOfItems: number; itemListElement: { position: number; name: string }[] };
    expect(list).toMatchObject({ "@type": "ItemList", name: "Water Explorer: waters", numberOfItems: bottledWaters.length });
    expect(list.itemListElement[0]).toEqual({ "@type": "ListItem", position: 1, name: bottledWaters[0].name });
    expect(JSON.stringify(list)).not.toMatch(/price|score|rating/i);
  });
});
