import type { Metadata } from "next";
import { defaultOpenGraph, defaultTwitter, seoMetadata } from "@/lib/seo-defaults";
import { liquidsunImages, type LiquidsunImage } from "@/lib/content/liquidsun/images";
import { ls } from "@/lib/content/liquidsun/nav";

// Page metadata for /liquid-sun/*, same pattern as SoulSmoke (src/lib/content/soulsmoke/seo.ts).
// The LiquidSun app had one title for every page (its index.html); here each page's title is its own
// heading plus "| LiquidSun", and its description is that page's own intro copy (no new wording).
// Share image: the page's own hero picture (PAGE_HEROES), else the app's og:image (the twilight
// agave field); all rescued to Sanity and cropped to 1200x630.

export const LIQUIDSUN_COPYRIGHT = "© 2026 LiquidSun. All Rights Reserved.";

const hero = liquidsunImages.agaveFieldMoon;

const ogImage = (img: LiquidsunImage) => ({
  url: `${img.src}?w=1200&h=630&fit=crop&auto=format`,
  width: 1200,
  height: 630,
  alt: img.alt,
});

export const LIQUIDSUN_OG_IMAGE = ogImage(hero);

/** Each page's hero/background picture, as the page shows it. Pages not listed use the home hero. */
const PAGE_HEROES: Record<string, LiquidsunImage> = {
  "/altar": liquidsunImages.altarShrine,
  "/speakeasy": liquidsunImages.tahonaWheel,
  "/agave-genetics": liquidsunImages.agaveMoonlit,
  "/science-of-spirit": liquidsunImages.alchemyDistillery,
  "/quadrant": liquidsunImages.tahonaMill,
  "/price-tracker": liquidsunImages.barrelCellar,
  "/bottle-scanner": liquidsunImages.tahonaMill,
  "/the-voices": liquidsunImages.candleCellar,
  "/sacred-kitchens": liquidsunImages.alchemyDistillery,
  "/pilgrimage-guide": liquidsunImages.jimadorSunset,
  "/jalisco-map": liquidsunImages.agaveMoonlit,
  "/trade-board": liquidsunImages.barrelCellar,
  "/the-gatekeepers": liquidsunImages.candleCellar,
  "/squad-riders": liquidsunImages.jimadorSunset,
  "/the-assholes": liquidsunImages.industrialDistillery,
};

/** The share image for a LiquidSun path ("/altar"). */
export function liquidsunOgImage(path: string) {
  const img = PAGE_HEROES[path];
  return img ? ogImage(img) : LIQUIDSUN_OG_IMAGE;
}

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
  const image = liquidsunOgImage(path);
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
      images: [image],
    },
    twitter: { ...defaultTwitter, title, description, images: [image.url] },
  });
}
