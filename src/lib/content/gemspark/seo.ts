import type { Metadata } from "next";
import { defaultOpenGraph, defaultTwitter, seoMetadata } from "@/lib/seo-defaults";
import { gemsparkImages } from "@/lib/content/gemspark/images";

// Page metadata for /gem-spark/*. Titles and descriptions come from the GemSpark app's own
// index.html and each page's heading/intro (no new wording). Share image: the app's own 1200x630
// og-image (the bird from David Fenton's art piece), moved to Sanity.

const share = gemsparkImages.shareImage;

export const GEMSPARK_OG_IMAGE = {
  url: share.src,
  width: share.width,
  height: share.height,
  alt: share.alt,
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
