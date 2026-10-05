import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";

// Built from the project id and dataset alone, not from `client`: client
// components import urlFor, and importing `client` here shipped the whole
// Sanity client (~27 KB unused) to the browser on / and /blog.
const builder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
});

export function urlFor(source: Image | { asset?: { _ref: string } }) {
  // auto('format') lets Sanity's CDN serve WebP/AVIF to browsers that
  // support it. Callers chain .width()/.height() as needed; next/image
  // still handles responsive sizing/lazy-loading on top of this.
  return builder.image(source).auto("format");
}
