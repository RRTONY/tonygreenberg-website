import { mexicoMezcals, usMezcals, type Mezcal } from "@/lib/content/soulsmoke/mezcal-data";
import { ss } from "@/lib/content/soulsmoke/nav";
import { SOULSMOKE_OG_IMAGE } from "@/lib/content/soulsmoke/seo";

// Structured data (JSON-LD) for /soul-smoke/* (2026-11-10, SEO pass). Each page says what it is
// (a WebPage, or a CollectionPage for the two bottle lists), that it belongs to SoulSmoke, Tony's
// mezcal guide on tonygreenberg.com, who wrote it, and where it sits (breadcrumb: Tony Greenberg >
// SoulSmoke > page). The US Hunt and Mexico Source pages also list their bottles (ItemList). Only
// facts already on the pages: no ratings, prices or reviews, which Google would expect to verify.

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tonygreenberg.com";
const PERSON_ID = `${siteUrl}/#person`;
const GUIDE_ID = `${siteUrl}${ss("/")}#guide`;
const GUIDE_NAME = "SoulSmoke";

/** Bottle lists shown as an ItemList, by SoulSmoke path. */
const BOTTLE_LISTS: Record<string, Mezcal[]> = { "/us-hunt": usMezcals, "/mexico-source": mexicoMezcals };

/** The page's own name without the " | SoulSmoke" suffix its <title> carries. */
const pageName = (title: string) => title.replace(/\s*\|\s*SoulSmoke$/, "");

export function soulsmokeJsonLd({ path, title, description }: { path: string; title: string; description: string }) {
  const url = `${siteUrl}${ss(path)}`;
  const isHome = path === "/";
  const bottles = BOTTLE_LISTS[path];
  const name = pageName(title);

  const guide = {
    "@type": "CreativeWork",
    "@id": GUIDE_ID,
    name: GUIDE_NAME,
    alternateName: "SoulSmoke: The Miracle of Mezcal",
    url: `${siteUrl}${ss("/")}`,
    about: { "@type": "Thing", name: "Mezcal" },
    author: { "@id": PERSON_ID },
    inLanguage: ["en", "es"],
    isPartOf: { "@type": "WebSite", name: "Tony Greenberg", url: siteUrl },
  };

  const page = {
    "@type": bottles ? "CollectionPage" : "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: "en",
    isPartOf: { "@id": GUIDE_ID },
    author: { "@id": PERSON_ID },
    image: SOULSMOKE_OG_IMAGE.url,
    breadcrumb: { "@id": `${url}#breadcrumb` },
    ...(bottles ? { mainEntity: { "@id": `${url}#bottles` } } : {}),
  };

  const crumbs = [
    { name: "Tony Greenberg", item: siteUrl },
    { name: GUIDE_NAME, item: `${siteUrl}${ss("/")}` },
    ...(isHome ? [] : [{ name, item: url }]),
  ];
  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.item })),
  };

  const list = bottles && {
    "@type": "ItemList",
    "@id": `${url}#bottles`,
    name,
    numberOfItems: bottles.length,
    itemListElement: bottles.map((m, i) => ({ "@type": "ListItem", position: i + 1, name: `${m.brand} ${m.name}` })),
  };

  return { "@context": "https://schema.org", "@graph": [page, breadcrumb, guide, ...(list ? [list] : [])] };
}
