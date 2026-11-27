import type { Metadata } from "next";
import { defaultOpenGraph, defaultTwitter, seoMetadata } from "@/lib/seo-defaults";
import { aqueousImages, type AqueousImage } from "@/lib/content/aqueous/images";
import { aq } from "@/lib/content/aqueous/nav";

// Page metadata for /aqueous/*, same pattern as LiquidSun (src/lib/content/liquidsun/seo.ts). Unlike
// LiquidSun, the Aqueous app already had a title and description per page (its SEOHead `SEO` map,
// client/src/components/SEOHead.tsx); they're copied word for word below. Its title format was
// "<title> | Aqueous", and the home page "Aqueous — Know What Flows Through Your Life".
// Share image: the page's own hero picture (PAGE_HEROES), else the home hero (the app's default).

export const AQUEOUS_NAME = "Aqueous";
export const AQUEOUS_COPYRIGHT = "© 2026 Aqueous by Tony Greenberg.";

const ogImage = (img: AqueousImage) => ({
  url: `${img.src}?w=1200&h=630&fit=crop&auto=format`,
  width: 1200,
  height: 630,
  alt: img.alt,
});

export const AQUEOUS_OG_IMAGE = ogImage(aqueousImages.heroWaterSacred);

/** Each page's hero picture, as the page shows it. Pages not listed use the home hero. */
const PAGE_HEROES: Record<string, AqueousImage> = {
  "/philosophy": aqueousImages.natureSpringSource,
  "/manifesto": aqueousImages.natureSpringSource,
  "/methodology": aqueousImages.waterTestingLab,
};

/** The share image for an Aqueous path ("/manifesto"). */
export function aqueousOgImage(path: string) {
  const img = PAGE_HEROES[path];
  return img ? ogImage(img) : AQUEOUS_OG_IMAGE;
}

/** The app's per-page SEO copy (SEOHead.tsx `SEO`), unchanged. */
export const AQUEOUS_SEO = {
  home: {
    title: "Home",
    description:
      "The AWI — Aqueous Water Index — is the world's first personalized water rating. Scored on Quality, Purity, and Resonance, weighted to YOUR priorities.",
  },
  awi: {
    title: "AWI Index",
    description:
      "Your personalized Aqueous Water Index. Adjust Quality, Purity, and Resonance weights to see which waters truly match your values.",
  },
  explore: {
    title: "Water Explorer",
    description:
      "Browse and search 50+ bottled waters rated by the QPR methodology. Filter by source, type, price, and quality score.",
  },
  tapWater: {
    title: "Tap Water Report",
    description:
      "Check your local tap water quality. See contaminant levels, EWG violations, and how your tap compares to bottled alternatives.",
  },
  compare: {
    title: "Compare Waters",
    description:
      "Side-by-side water comparison tool. Compare QPR scores, mineral profiles, contaminant levels, and price-to-value ratios.",
  },
  wallOfShame: {
    title: "Wall of Shame",
    description:
      "The inverse correlation between marketing spend and water quality. See which billion-dollar brands sell the worst water.",
  },
  filterGuide: {
    title: "Filter Guide",
    description:
      "Tested and ranked water filtration systems. A $200 RO system scores 89 QPR at $0.06/gallon — 2,500% better value than Dasani.",
  },
  philosophy: {
    title: "Philosophy",
    description:
      "Built for the era of conscious consumption. Inspired by Nate Hagens, Kate Raworth, and the wisdom of those charting a more abundant future.",
  },
  methodology: {
    title: "QPR Methodology",
    description:
      "How the Quality, Purity, and Resonance scoring system works. Open-source data, transparent weighting, no corporate influence.",
  },
  manifesto: {
    title: "Manifesto",
    description:
      "The Aqueous manifesto. Why we built the world's first personalized water rating and what it means for conscious consumption.",
  },
  landscape: {
    title: "Water Landscape",
    description:
      "The global bottled water industry mapped. Market dynamics, corporate ownership, and the hidden geography of your drinking water.",
  },
  integrity: {
    title: "Integrity",
    description:
      "Our commitment to co-creation, transparency, and building something real. Aqueous is an invitation, not an institution.",
  },
  gemSpark: {
    title: "The Gem Spark",
    description:
      "Your journey from water awareness to self-discovery. The Gem Spark is the moment water becomes a mirror for your own values.",
  },
  pricing: {
    title: "Pricing",
    description:
      "Get your personalized AWI report for $20. Subscribe for $5/mo for ongoing insights. Refer friends and earn credits.",
  },
  directory: {
    title: "Site Directory",
    description:
      "Every Aqueous page in one place. Explore the full site, track your referrals, and discover related projects.",
  },
  about: {
    title: "About",
    description:
      "Meet Tony Greenberg — the builder behind Aqueous. Author, entrepreneur, and advocate for conscious consumption. Explore the full ecosystem of projects.",
  },
  dashboard: { title: "Dashboard", description: "Your personal Aqueous dashboard" },
  report: { title: "Your Personalized AWI Report", description: "Your personalized AWI report" },
  paymentSuccess: { title: "Payment Successful", description: "Your Aqueous purchase is complete." },
  notFound: {
    title: "404 — Lost in the Current",
    description: "This page doesn't exist, but the water still flows. Find your way back to Aqueous.",
  },
} as const;

export type AqueousSeo = {
  /** The app's path, e.g. "/explore" ("/" for the Aqueous home). */
  path: string;
  /** The app's SEO title ("Home" becomes the app's home title). */
  title: string;
  description: string;
  /** Pages a visitor shouldn't land on from search (dashboard, checkout return, private reports). */
  noindex?: boolean;
};

/** The <title> the app showed: "<title> | Aqueous", or its home title. */
export function aqueousTitle(title: string) {
  return title === "Home" ? "Aqueous — Know What Flows Through Your Life" : `${title} | ${AQUEOUS_NAME}`;
}

export function aqueousMetadata({ path, title, description, noindex }: AqueousSeo): Metadata {
  const url = aq(path);
  const image = aqueousOgImage(path);
  const fullTitle = aqueousTitle(title);
  return seoMetadata({
    title: fullTitle,
    description,
    alternates: { canonical: url },
    authors: [{ name: "Tony Greenberg", url: "https://tonygreenberg.com" }],
    other: { copyright: AQUEOUS_COPYRIGHT },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      ...defaultOpenGraph,
      siteName: "Aqueous by Tony Greenberg",
      title: fullTitle,
      description,
      url,
      images: [image],
    },
    twitter: { ...defaultTwitter, title: fullTitle, description, images: [image.url] },
  });
}
