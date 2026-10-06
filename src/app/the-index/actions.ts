"use server";

import {
  expandIndexQuery,
  indexItemText,
  pickNextReads,
  type IndexItem,
} from "@/lib/content/the-index";
import { loadIndexBodies, loadIndexItems } from "./index-data";

// The Index's two server-side helpers. Essay bodies (~1.3 MB of text) stay on
// the server; the browser sends the query or the opened item's id and gets
// back slugs or three links.

const MAX_QUERY = 120;

/** Slugs of essays whose body text contains the query or one of its related terms. */
export async function searchIndexBodies(query: string): Promise<string[]> {
  if (typeof query !== "string") return [];
  const terms = expandIndexQuery(query.slice(0, MAX_QUERY));
  if (terms.length === 0) return [];
  try {
    const bodies = await loadIndexBodies();
    const hits: string[] = [];
    for (const [slug, text] of bodies) if (terms.some((t) => text.includes(t))) hits.push(slug);
    return hits;
  } catch (err) {
    console.error("[the-index] body search failed:", err);
    return [];
  }
}

export type IndexNextRead = Pick<IndexItem, "id" | "title" | "href" | "external">;

/** Live's "three related places to go next" for one result, scored over full text. */
export async function getIndexNextReads(itemId: string): Promise<IndexNextRead[]> {
  if (typeof itemId !== "string" || itemId.length > 300) return [];
  try {
    const [{ items }, bodies] = await Promise.all([loadIndexItems(), loadIndexBodies()]);
    const item = items.find((i) => i.id === itemId);
    if (!item) return [];
    const textOf = (i: IndexItem) => (i.kind === "essay" ? `${indexItemText(i)} ${bodies.get(i.id) ?? ""}` : indexItemText(i));
    return pickNextReads(item, items, textOf).map(({ id, title, href, external }) => ({ id, title, href, external }));
  } catch (err) {
    console.error("[the-index] next reads failed:", err);
    return [];
  }
}
