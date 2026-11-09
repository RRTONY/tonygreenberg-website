import type { Metadata } from "next";
import { defaultOpenGraph, defaultTwitter, seoMetadata } from "@/lib/seo-defaults";
import { gemsparkImages } from "@/lib/content/gemspark/images";

// Page metadata for /gem-spark/*. Titles and descriptions come from the GemSpark app's own
// index.html and each page's heading/intro (no new wording). Share image: David Fenton's art
// piece (Sanity, cropped to 1200x630), the image the long form opens with.

const art = gemsparkImages.art;

export const GEMSPARK_OG_IMAGE = {
  url: `${art.src}?w=1200&h=630&fit=crop&auto=format`,
  width: 1200,
  height: 630,
  alt: art.alt,
};

export function gemsparkMetadata({
  path,
  title,
  description,
  locale,
}: {
  /** The full path, e.g. "/gem-spark/short". */
  path: string;
  title: string;
  description: string;
  /** Open Graph locale for a translated page, e.g. "es_ES". */
  locale?: string;
}): Metadata {
  return seoMetadata({
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...defaultOpenGraph,
      type: "article",
      title,
      description,
      url: path,
      images: [GEMSPARK_OG_IMAGE],
      ...(locale ? { locale } : {}),
    },
    twitter: { ...defaultTwitter, title, description, images: [GEMSPARK_OG_IMAGE.url] },
  });
}
