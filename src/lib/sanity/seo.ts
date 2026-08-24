import type { Metadata } from "next";
import { sanityFetch } from "./client";
import { pageSeoQuery } from "./queries";
import { urlFor } from "./image";

export type SeoFields = {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: Parameters<typeof urlFor>[0];
  noIndex?: boolean;
};

export async function getPageSeo(route: string) {
  return sanityFetch<{ seo?: SeoFields } | null>({
    query: pageSeoQuery,
    params: { route },
    tags: ["pageSeo"],
    revalidate: 60,
  });
}

// Overlays Sanity-authored SEO fields onto a page's hardcoded fallback
// metadata. Only fields an editor actually filled in are overridden -
// everything else (icons, robots default, etc.) keeps flowing from the
// fallback defined in code.
export function withSeoOverrides(fallback: Metadata, seo?: SeoFields | null): Metadata {
  if (!seo) return fallback;

  const title = seo.metaTitle || fallback.title;
  const description = seo.metaDescription || fallback.description;
  const keywords = seo.keywords?.length ? seo.keywords : fallback.keywords;
  const ogImages = seo.ogImage ? [urlFor(seo.ogImage).width(1200).height(630).url()] : undefined;

  return {
    ...fallback,
    title,
    description,
    keywords,
    ...(seo.noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      ...fallback.openGraph,
      title: seo.metaTitle || fallback.openGraph?.title,
      description: seo.metaDescription || fallback.openGraph?.description,
      images: ogImages || fallback.openGraph?.images,
    },
  };
}
