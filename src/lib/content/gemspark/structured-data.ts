import { GEMSPARK_OG_IMAGE } from "@/lib/content/gemspark/seo";

// Structured data (JSON-LD) for /gem-spark/* (2026-11-10, SEO pass): each version is an Article by
// Tony, the short version is based on the full story, and the Spanish short version is a
// translation of the English one. Breadcrumb: Tony Greenberg > The GemSpark > version. No
// publish date is given: the app never stated one, and an invented date would be wrong.

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tonygreenberg.com";
const PERSON_ID = `${siteUrl}/#person`;
const FULL = `${siteUrl}/gem-spark`;
const SHORT = `${siteUrl}/gem-spark/short`;
const articleId = (url: string) => `${url}#article`;

export type GemSparkVersion = "full" | "short" | "es-short";

const VERSIONS: Record<GemSparkVersion, { url: string; lang: string; crumb: string | null }> = {
  full: { url: FULL, lang: "en", crumb: null },
  short: { url: SHORT, lang: "en", crumb: "Short Version" },
  "es-short": { url: `${siteUrl}/gem-spark/es/short`, lang: "es", crumb: "Versión corta (español)" },
};

export function gemsparkJsonLd({ version, headline, description }: { version: GemSparkVersion; headline: string; description: string }) {
  const v = VERSIONS[version];
  const article = {
    "@type": "Article",
    "@id": articleId(v.url),
    headline,
    description,
    url: v.url,
    mainEntityOfPage: v.url,
    inLanguage: v.lang,
    image: { "@type": "ImageObject", url: GEMSPARK_OG_IMAGE.url, width: GEMSPARK_OG_IMAGE.width, height: GEMSPARK_OG_IMAGE.height },
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    isPartOf: { "@type": "WebSite", name: "Tony Greenberg", url: siteUrl },
    about: ["Serendipity", "Synchronicity"].map((name) => ({ "@type": "Thing", name })),
    ...(version === "short" ? { isBasedOn: { "@id": articleId(FULL) } } : {}),
    ...(version === "es-short" ? { translationOfWork: { "@id": articleId(SHORT) }, isBasedOn: { "@id": articleId(FULL) } } : {}),
  };
  const crumbs = [
    { name: "Tony Greenberg", item: siteUrl },
    { name: "The GemSpark", item: FULL },
    ...(v.crumb ? [{ name: v.crumb, item: v.url }] : []),
  ];
  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${v.url}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.item })),
  };
  return { "@context": "https://schema.org", "@graph": [article, breadcrumb] };
}
