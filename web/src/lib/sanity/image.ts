import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { client } from "./client";

const builder = createImageUrlBuilder(client);

export function urlFor(source: Image | { asset?: { _ref: string } }) {
  // auto('format') lets Sanity's CDN serve WebP/AVIF to browsers that
  // support it. Callers chain .width()/.height() as needed; next/image
  // still handles responsive sizing/lazy-loading on top of this.
  return builder.image(source).auto("format");
}
