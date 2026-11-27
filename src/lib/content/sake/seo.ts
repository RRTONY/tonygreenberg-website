import type { Metadata } from "next";
import { defaultOpenGraph, defaultTwitter, seoMetadata } from "@/lib/seo-defaults";
import { sk } from "@/lib/content/sake/nav";

// Page metadata for /sake/*, same pattern as Aqueous (src/lib/content/aqueous/seo.ts). The Sake
// Manus app had one title and description for the whole site (client/index.html) and none per page,
// so each page here uses the app's own words: its menu name (Navigation.tsx) as the title and its
// own intro line as the description, written in the page's route file. The home page keeps the
// app's site title and description word for word, and every page keeps its robots rule
// (noarchive, noimageindex, 160-character snippets).

export const SAKE_NAME = "Sake for Sake's Sake™";
export const SAKE_COPYRIGHT = "© 2026 Sake for Sake's Sake™. All rights reserved.";

/** client/index.html <title> and description. */
export const SAKE_HOME_TITLE = "Sake for Sake's Sake™ — The Definitive Sake Experience";
export const SAKE_HOME_DESCRIPTION =
  "Sake for Sake's Sake™ — The world's deepest sake guide. Featuring the proprietary EXV™ Experience Value scoring system, 72 microseasons, namazake deep-dives, and the soul of Japanese brewing culture.";
/** client/index.html og:description, the shorter line the app shared. */
export const SAKE_SHARE_DESCRIPTION =
  "The world's deepest sake guide. EXV™ scoring, 72 microseasons, namazake, and the soul of Japanese brewing.";

export type SakeSeo = {
  /** The app's path, e.g. "/rice" ("/" for the Sake home). Detail pages pass sakeDetailPath(id) via `href`. */
  path: string;
  /** The page's name (its menu label); "Home" becomes the app's site title. */
  title: string;
  description: string;
  /** Full URL path when it isn't sk(path), e.g. a sake detail page. */
  href?: string;
  /** Pages a visitor shouldn't land on from search (account pages, checkout returns). */
  noindex?: boolean;
};

/** The <title>: "<page> | Sake for Sake's Sake™", or the app's own site title on the home page. */
export function sakeTitle(title: string) {
  return title === "Home" ? SAKE_HOME_TITLE : `${title} | ${SAKE_NAME}`;
}

/**
 * The share image is the Sake card (the gold 酒 mark and the guide's name; the app had none), served
 * from src/app/sake/opengraph-image.png and twitter-image.png. It's set here explicitly because each
 * page's own openGraph (with the site defaults spread in) replaces the folder's file-based image.
 */
export const SAKE_SHARE_IMAGE = {
  url: "/sake/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "Sake for Sake's Sake: the gold 酒 mark beside the guide's name and the line \"The world's deepest sake guide.\"",
};

export function sakeMetadata({ path, title, description, href, noindex }: SakeSeo): Metadata {
  const url = href ?? sk(path);
  const fullTitle = sakeTitle(title);
  return seoMetadata({
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    authors: [{ name: "Tony Greenberg", url: "https://tonygreenberg.com" }],
    other: { copyright: SAKE_COPYRIGHT },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true, noarchive: true, noimageindex: true, "max-snippet": 160 },
    openGraph: {
      ...defaultOpenGraph,
      siteName: SAKE_NAME,
      locale: "en_US",
      alternateLocale: ["ja_JP"],
      title: fullTitle,
      description,
      url,
      images: [SAKE_SHARE_IMAGE],
    },
    twitter: { ...defaultTwitter, title: fullTitle, description, images: ["/sake/twitter-image.png"] },
  });
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tonygreenberg.com";
const PERSON_ID = `${siteUrl}/#person`;
const GUIDE_ID = `${siteUrl}${sk("/")}#guide`;

/** Structured data: a WebPage in the Sake guide (a CreativeWork by Tony) with a breadcrumb. */
export function sakeJsonLd({ path, title, description, href }: Pick<SakeSeo, "path" | "title" | "description" | "href">) {
  const url = `${siteUrl}${href ?? sk(path)}`;
  const isHome = path === "/" && !href;
  const guide = {
    "@type": "CreativeWork",
    "@id": GUIDE_ID,
    name: SAKE_NAME,
    url: `${siteUrl}${sk("/")}`,
    about: { "@type": "Thing", name: "Sake" },
    inLanguage: ["en", "ja"],
    author: { "@id": PERSON_ID },
  };
  const crumbs = [
    { "@type": "ListItem", position: 1, name: "Tony Greenberg", item: siteUrl },
    { "@type": "ListItem", position: 2, name: SAKE_NAME, item: `${siteUrl}${sk("/")}` },
    ...(isHome ? [] : [{ "@type": "ListItem", position: 3, name: title, item: url }]),
  ];
  return {
    "@context": "https://schema.org",
    "@graph": [
      guide,
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: isHome ? SAKE_HOME_TITLE : title,
        description,
        isPartOf: { "@id": GUIDE_ID },
        breadcrumb: { "@type": "BreadcrumbList", itemListElement: crumbs },
      },
    ],
  };
}
