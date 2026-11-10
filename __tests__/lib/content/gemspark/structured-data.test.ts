import { describe, expect, it } from "vitest";
import { gemsparkJsonLd } from "@/lib/content/gemspark/structured-data";
import { GEMSPARK_OG_IMAGE } from "@/lib/content/gemspark/seo";

type Node = Record<string, unknown> & { "@type": string };
const graph = (version: "full" | "short" | "es-short") =>
  gemsparkJsonLd({ version, headline: "H", description: "D" })["@graph"] as Node[];
const node = (g: Node[], t: string) => g.find((n) => n["@type"] === t) as Node;
const crumbNames = (g: Node[]) => (node(g, "BreadcrumbList").itemListElement as { name: string }[]).map((c) => c.name);

describe("gemsparkJsonLd", () => {
  it("makes the full story an Article by Tony with the share image, and no invented date", () => {
    const g = graph("full");
    const a = node(g, "Article");
    expect(a).toMatchObject({
      "@id": "https://tonygreenberg.com/gem-spark#article",
      headline: "H",
      description: "D",
      inLanguage: "en",
      author: { "@id": "https://tonygreenberg.com/#person" },
      image: { url: GEMSPARK_OG_IMAGE.url, width: 1200, height: 630 },
    });
    expect(a).not.toHaveProperty("datePublished");
    expect(a).not.toHaveProperty("isBasedOn");
    expect(crumbNames(g)).toEqual(["Tony Greenberg", "The GemSpark"]);
  });

  it("links the short version to the full story", () => {
    const g = graph("short");
    expect(node(g, "Article")).toMatchObject({ url: "https://tonygreenberg.com/gem-spark/short", isBasedOn: { "@id": "https://tonygreenberg.com/gem-spark#article" } });
    expect(crumbNames(g)).toEqual(["Tony Greenberg", "The GemSpark", "Short Version"]);
  });

  it("marks the Spanish short version as a translation of the English one", () => {
    const g = graph("es-short");
    expect(node(g, "Article")).toMatchObject({
      inLanguage: "es",
      translationOfWork: { "@id": "https://tonygreenberg.com/gem-spark/short#article" },
      isBasedOn: { "@id": "https://tonygreenberg.com/gem-spark#article" },
    });
    expect(crumbNames(g)).toEqual(["Tony Greenberg", "The GemSpark", "Versión corta (español)"]);
  });
});
