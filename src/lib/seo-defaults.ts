import type { Metadata } from "next";

// The site's shared share-card image (1200x630 PNG: "TonyG, Only Time Buys
// Trust" on the dark brand background). Next.js merges metadata shallowly:
// a page that sets its own `openGraph` or `twitter` replaces the layout's
// whole object, image included. So the layout uses these, and any page with
// its own openGraph/twitter but no image of its own spreads them in too.
// A page with a real image of its own (essays, the homepage) keeps it.
export const DEFAULT_OG_IMAGE = {
  url: "/images/default-og.png",
  width: 1200,
  height: 630,
  alt: "TonyG: Only Time Buys Trust",
};

export const defaultOpenGraph = {
  type: "website",
  siteName: "Tony Greenberg",
  images: [DEFAULT_OG_IMAGE],
} satisfies NonNullable<Metadata["openGraph"]>;

export const defaultTwitter = {
  card: "summary_large_image",
  site: "@ThinkTony",
  creator: "@ThinkTony",
  images: [DEFAULT_OG_IMAGE.url],
} satisfies NonNullable<Metadata["twitter"]>;
