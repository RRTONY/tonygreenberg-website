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

// Search-result titles and descriptions (2026-11-03). Google cuts a title
// off around 60 characters (limit lowered from 70 on 2026-11-14: 35 titles
// were cut in results only because of the suffix) and a description around 160, and flags
// descriptions too short to say anything. These keep every page inside
// those limits without rewriting anyone's wording: a title that would run
// long loses the " | Tony Greenberg" ending, a missing or thin description
// gets the site's default, and a long one is shortened at a word break.
export const SITE_NAME = "Tony Greenberg";
export const DEFAULT_DESCRIPTION =
  "Essays, frameworks, and tools from Tony Greenberg — CEO of RampRate, Founder of ImpactSoul.";
export const MAX_TITLE_LENGTH = 60;
export const MIN_DESCRIPTION_LENGTH = 50;
export const MAX_DESCRIPTION_LENGTH = 160;

const TITLE_SUFFIX = ` | ${SITE_NAME}`;

function squash(text: string | null | undefined) {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

// The page's own title, with the layout's " | Tony Greenberg" ending only
// when the whole thing still fits. No title: undefined, so the layout's
// default title applies.
export function seoTitle(title: string | null | undefined): Metadata["title"] {
  const text = squash(title);
  if (!text) return undefined;
  return text.length + TITLE_SUFFIX.length <= MAX_TITLE_LENGTH ? text : { absolute: text };
}

export function seoDescription(
  description: string | null | undefined,
  fallback: string = DEFAULT_DESCRIPTION,
): string {
  let text = squash(description);
  if (text.length < MIN_DESCRIPTION_LENGTH) text = squash(`${text} ${fallback}`);
  if (text.length <= MAX_DESCRIPTION_LENGTH) return text;
  const cut = text.slice(0, MAX_DESCRIPTION_LENGTH - 1);
  const atWord = cut.slice(0, cut.lastIndexOf(" ")) || cut;
  return `${atWord.replace(/[\s,;:.—–-]+$/, "")}…`;
}

// A page's static metadata with seoTitle/seoDescription applied:
// export const metadata = seoMetadata({ title: "...", description: "..." }).
export function seoMetadata(metadata: Metadata): Metadata {
  const { title, description } = metadata;
  return {
    ...metadata,
    title: typeof title === "string" ? seoTitle(title) : title,
    description: seoDescription(description),
  };
}
