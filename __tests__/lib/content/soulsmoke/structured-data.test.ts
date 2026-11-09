import { describe, expect, it } from "vitest";
import { soulsmokeJsonLd } from "@/lib/content/soulsmoke/structured-data";
import { mexicoMezcals, usMezcals } from "@/lib/content/soulsmoke/mezcal-data";

type Node = Record<string, unknown> & { "@type": string };
const graph = (path: string, title = "The US Hunt | SoulSmoke") =>
  soulsmokeJsonLd({ path, title, description: "d" })["@graph"] as Node[];
const byType = (g: Node[], t: string) => g.find((n) => n["@type"] === t) as Node;

describe("soulsmokeJsonLd", () => {
  it("describes a page as part of SoulSmoke, by Tony, with a breadcrumb", () => {
    const g = graph("/cocktails", "The Cocktail Codex | SoulSmoke");
    const page = byType(g, "WebPage");
    expect(page).toMatchObject({
      url: "https://tonygreenberg.com/soul-smoke/cocktails",
      name: "The Cocktail Codex",
      description: "d",
      isPartOf: { "@id": "https://tonygreenberg.com/soul-smoke#guide" },
      author: { "@id": "https://tonygreenberg.com/#person" },
    });
    expect(byType(g, "CreativeWork")).toMatchObject({ name: "SoulSmoke", author: { "@id": "https://tonygreenberg.com/#person" } });
    const crumbs = byType(g, "BreadcrumbList").itemListElement as { name: string; item: string; position: number }[];
    expect(crumbs.map((c) => c.name)).toEqual(["Tony Greenberg", "SoulSmoke", "The Cocktail Codex"]);
    expect(crumbs.map((c) => c.position)).toEqual([1, 2, 3]);
    expect(g.some((n) => n["@type"] === "ItemList")).toBe(false);
  });

  it("stops the breadcrumb at SoulSmoke on its home page", () => {
    const g = graph("/", "SoulSmoke - The Miracle of Mezcal");
    const crumbs = byType(g, "BreadcrumbList").itemListElement as { name: string }[];
    expect(crumbs.map((c) => c.name)).toEqual(["Tony Greenberg", "SoulSmoke"]);
    expect(byType(g, "WebPage").url).toBe("https://tonygreenberg.com/soul-smoke");
  });

  it("lists every bottle on the US Hunt and Mexico Source pages, without prices or ratings", () => {
    for (const [path, bottles] of [["/us-hunt", usMezcals], ["/mexico-source", mexicoMezcals]] as const) {
      const g = graph(path);
      const list = byType(g, "ItemList");
      expect(list.numberOfItems).toBe(bottles.length);
      const items = list.itemListElement as { name: string; position: number }[];
      expect(items[0]).toEqual({ "@type": "ListItem", position: 1, name: `${bottles[0].brand} ${bottles[0].name}` });
      expect(byType(g, "CollectionPage").mainEntity).toEqual({ "@id": list["@id"] });
      expect(JSON.stringify(list)).not.toMatch(/price|rating|review/i);
    }
  });
});
