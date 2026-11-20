import { producers } from "@/lib/content/liquidsun/producers";
import { ls } from "@/lib/content/liquidsun/nav";
import { liquidsunOgImage } from "@/lib/content/liquidsun/seo";
import { bottles as matrixBottles } from "@/components/liquidsun/flavor-matrix/flavor-matrix.data";
import { usSources } from "@/components/liquidsun/pages/us-hunt";
import { jaliscoSources } from "@/components/liquidsun/pages/jalisco-source";

// Structured data (JSON-LD) for /liquid-sun/*, same shape as SoulSmoke's
// (src/lib/content/soulsmoke/structured-data.ts): a WebPage (CollectionPage for the bottle lists)
// that belongs to LiquidSun, Tony's tequila guide on tonygreenberg.com, with a breadcrumb
// (Tony Greenberg > LiquidSun > page). The home page, The Tequilas and the Flavor Matrix also list
// their bottles, and US Hunt / Jalisco Source their places (names only: no prices, scores or
// ratings, which Google would expect to verify).

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tonygreenberg.com";
const PERSON_ID = `${siteUrl}/#person`;
const GUIDE_ID = `${siteUrl}${ls("/")}#guide`;
const GUIDE_NAME = "LiquidSun";

const unique = (names: string[]) => [...new Set(names)];
const placeNames = (regions: { spots: { name: string }[] }[]) => unique(regions.flatMap((r) => r.spots.map((s) => s.name)));

/** Pages that list things, and the names they list. */
const LISTS: Record<string, string[]> = {
  "/": producers.map((p) => p.brand),
  "/tequila-encyclopedia": producers.map((p) => p.brand),
  "/quadrant": unique(matrixBottles.map((b) => `${b.brand} ${b.expression}`)),
  "/us-hunt": placeNames(usSources),
  "/jalisco-source": placeNames(jaliscoSources),
};

/** The page's own name without the " | LiquidSun" suffix its <title> carries. */
const pageName = (title: string) => title.replace(/\s*\|\s*LiquidSun.*$/, "");

export function liquidsunJsonLd({ path, title, description }: { path: string; title: string; description: string }) {
  const url = `${siteUrl}${ls(path)}`;
  const isHome = path === "/";
  const names = LISTS[path];
  const listsBottles = Boolean(names);
  const name = isHome ? GUIDE_NAME : pageName(title);

  const guide = {
    "@type": "CreativeWork",
    "@id": GUIDE_ID,
    name: GUIDE_NAME,
    alternateName: "LiquidSun: The Soul of Tequila",
    url: `${siteUrl}${ls("/")}`,
    about: { "@type": "Thing", name: "Tequila" },
    author: { "@id": PERSON_ID },
    inLanguage: ["en", "es"],
    isPartOf: { "@type": "WebSite", name: "Tony Greenberg", url: siteUrl },
  };

  const page = {
    "@type": listsBottles ? "CollectionPage" : "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: "en",
    isPartOf: { "@id": GUIDE_ID },
    author: { "@id": PERSON_ID },
    image: liquidsunOgImage(path).url,
    breadcrumb: { "@id": `${url}#breadcrumb` },
    ...(listsBottles ? { mainEntity: { "@id": `${url}#bottles` } } : {}),
  };

  const crumbs = [
    { name: "Tony Greenberg", item: siteUrl },
    { name: GUIDE_NAME, item: `${siteUrl}${ls("/")}` },
    ...(isHome ? [] : [{ name, item: url }]),
  ];
  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.item })),
  };

  const list = listsBottles && {
    "@type": "ItemList",
    "@id": `${url}#bottles`,
    name: isHome ? "LiquidSun Curated Tequila Collection" : name,
    numberOfItems: names.length,
    itemListElement: names.map((n, i) => ({ "@type": "ListItem", position: i + 1, name: n })),
  };

  return { "@context": "https://schema.org", "@graph": [page, breadcrumb, guide, ...(list ? [list] : [])] };
}
