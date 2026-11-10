import type { Metadata } from "next";
import { defaultOpenGraph, defaultTwitter, seoMetadata } from "@/lib/seo-defaults";
import { soulsmokeImages } from "@/lib/content/soulsmoke/images";
import { ss } from "@/lib/content/soulsmoke/nav";

// Page metadata for /soul-smoke/*. The SoulSmoke app had one title for every page
// ("SoulSmoke - The Miracle of Mezcal"); here each page's title is its own heading plus
// "| SoulSmoke", and its description is taken from that page's intro copy (no new wording).
// Share image: the app's hero (Sanity, cropped to 1200x630).
// Author/copyright tags: the app's index.html named "Tony Huang", almost certainly a slip of the
// tool that built it; Tony chose "© 2026 Tony Greenberg. All Rights Reserved." (2026-11-10).

export const SOULSMOKE_COPYRIGHT = "© 2026 Tony Greenberg. All Rights Reserved.";

const hero = soulsmokeImages.heroMystical;

export const SOULSMOKE_OG_IMAGE = {
  url: `${hero.src}?w=1200&h=630&fit=crop&auto=format`,
  width: 1200,
  height: 630,
  alt: hero.alt,
};

export function soulsmokeMetadata({
  path,
  title,
  description,
}: {
  /** The app's path, e.g. "/us-hunt" ("/" for the SoulSmoke home). */
  path: string;
  title: string;
  description: string;
}): Metadata {
  const url = ss(path);
  return seoMetadata({
    title,
    description,
    alternates: { canonical: url },
    authors: [{ name: "Tony Greenberg", url: "https://tonygreenberg.com" }],
    other: { copyright: SOULSMOKE_COPYRIGHT },
    openGraph: {
      ...defaultOpenGraph,
      siteName: "SoulSmoke by Tony Greenberg",
      title,
      description,
      url,
      images: [SOULSMOKE_OG_IMAGE],
    },
    twitter: { ...defaultTwitter, title, description, images: [SOULSMOKE_OG_IMAGE.url] },
  });
}
