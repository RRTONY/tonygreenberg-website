import "server-only";
import { sanityFetch } from "@/lib/sanity/client";
import { indexPostsQuery, indexPostTextQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { DEFAULT_ESSAY_HERO } from "@/lib/content/default-image";
import { essayToIndexItem, siteResourceItems, type IndexItem, type IndexPostRow } from "@/lib/content/the-index";

type PostRow = IndexPostRow & { heroImage?: Parameters<typeof urlFor>[0] | null };

/** Essays (newest first, from Sanity) followed by the site directory's pages. */
export async function loadIndexItems(): Promise<{ items: IndexItem[]; essayCount: number }> {
  const posts = await sanityFetch<PostRow[]>({ query: indexPostsQuery, tags: ["post"] });
  const essays = posts.map((p) =>
    essayToIndexItem(p, p.heroImage ? urlFor(p.heroImage).width(160).height(110).url() : DEFAULT_ESSAY_HERO.src),
  );
  return { items: [...essays, ...siteResourceItems()], essayCount: essays.length };
}

/** Lowercased body text per post slug (server only, see indexPostTextQuery). */
export async function loadIndexBodies(): Promise<Map<string, string>> {
  const rows = await sanityFetch<{ slug: string; text: string | null }[]>({ query: indexPostTextQuery, tags: ["post"] });
  return new Map(rows.map((r) => [r.slug, r.text ?? ""]));
}
