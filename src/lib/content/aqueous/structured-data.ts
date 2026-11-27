import { aq } from "@/lib/content/aqueous/nav";
import { aqueousOgImage } from "@/lib/content/aqueous/seo";
import { bottledWaters } from "@/lib/content/aqueous/water-data";

// Structured data (JSON-LD) for /aqueous/*, same shape as LiquidSun's
// (src/lib/content/liquidsun/structured-data.ts): a WebPage (CollectionPage for the water lists) that
// belongs to Aqueous, Tony's water guide on tonygreenberg.com, with a breadcrumb
// (Tony Greenberg > Aqueous > page). The pages that list waters name them (names only: no scores or
// prices, which Google would expect to verify).

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tonygreenberg.com";
const PERSON_ID = `${siteUrl}/#person`;
const GUIDE_ID = `${siteUrl}${aq("/")}#guide`;
const GUIDE_NAME = "Aqueous";

const waterNames = bottledWaters.map((w) => w.name);

/** Pages that list waters, and the names they list. */
const LISTS: Record<string, string[]> = {
  "/explore": waterNames,
  "/awi": waterNames,
  "/compare": waterNames,
};

/** The page's own name without the " | Aqueous" suffix its <title> carries. */
const pageName = (title: string) => title.replace(/\s*\|\s*Aqueous.*$/, "");

export function aqueousJsonLd({ path, title, description }: { path: string; title: string; description: string }) {
  const url = `${siteUrl}${aq(path)}`;
  const isHome = path === "/";
  const names = LISTS[path];
  const name = isHome ? GUIDE_NAME : pageName(title);

  const guide = {
    "@type": "CreativeWork",
    "@id": GUIDE_ID,
    name: GUIDE_NAME,
    alternateName: "Aqueous: Know What Flows Through Your Life",
    url: `${siteUrl}${aq("/")}`,
    about: { "@type": "Thing", name: "Drinking water quality" },
    author: { "@id": PERSON_ID },
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: "Tony Greenberg", url: siteUrl },
  };

  const page = {
    "@type": names ? "CollectionPage" : "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: "en",
    isPartOf: { "@id": GUIDE_ID },
    author: { "@id": PERSON_ID },
    image: aqueousOgImage(path).url,
    breadcrumb: { "@id": `${url}#breadcrumb` },
    ...(names ? { mainEntity: { "@id": `${url}#waters` } } : {}),
  };

  const crumbs = [
    { name: "Tony Greenberg", item: siteUrl },
    { name: GUIDE_NAME, item: `${siteUrl}${aq("/")}` },
    ...(isHome ? [] : [{ name, item: url }]),
  ];
  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.item })),
  };

  const list = names && {
    "@type": "ItemList",
    "@id": `${url}#waters`,
    name: `${name}: waters`,
    numberOfItems: names.length,
    itemListElement: names.map((n, i) => ({ "@type": "ListItem", position: i + 1, name: n })),
  };

  return { "@context": "https://schema.org", "@graph": [guide, page, breadcrumb, ...(list ? [list] : [])] };
}
