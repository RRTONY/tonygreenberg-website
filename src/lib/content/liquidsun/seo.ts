import type { Metadata } from "next";
import { defaultOpenGraph, defaultTwitter, seoMetadata } from "@/lib/seo-defaults";
import { liquidsunImages } from "@/lib/content/liquidsun/images";
import { ls } from "@/lib/content/liquidsun/nav";

// Page metadata for /liquid-sun/*, same pattern as SoulSmoke (src/lib/content/soulsmoke/seo.ts).
// The LiquidSun app had one title for every page (its index.html); here each page's title is its own
// heading plus "| LiquidSun", and its description is that page's own intro copy (no new wording).
// Share image: the app's og:image (the twilight agave field), rescued to Sanity, cropped to 1200x630.

export const LIQUIDSUN_COPYRIGHT = "© 2026 LiquidSun. All Rights Reserved.";

const hero = liquidsunImages.agaveFieldMoon;

export const LIQUIDSUN_OG_IMAGE = {
  url: `${hero.src}?w=1200&h=630&fit=crop&auto=format`,
  width: 1200,
  height: 630,
  alt: hero.alt,
};

export type LiquidsunSeo = {
  /** The app's path, e.g. "/altar" ("/" for the LiquidSun home). */
  path: string;
  title: string;
  description: string;
  /** Pages a visitor shouldn't land on from search (checkout return, the hidden Speakeasy). */
  noindex?: boolean;
};

export function liquidsunMetadata({ path, title, description, noindex }: LiquidsunSeo): Metadata {
  const url = ls(path);
  return seoMetadata({
    title,
    description,
    alternates: { canonical: url },
    authors: [{ name: "Tony Greenberg", url: "https://tonygreenberg.com" }],
    other: { copyright: LIQUIDSUN_COPYRIGHT },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      ...defaultOpenGraph,
      siteName: "LiquidSun by Tony Greenberg",
      title,
      description,
      url,
      images: [LIQUIDSUN_OG_IMAGE],
    },
    twitter: { ...defaultTwitter, title, description, images: [LIQUIDSUN_OG_IMAGE.url] },
  });
}
