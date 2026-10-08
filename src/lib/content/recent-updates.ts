// Shared by the homepage (server) and RecentUpdates (client): the topic pills
// and how many essays each one shows. Kept out of the "use client" file so the
// page can call pickRecentUpdatePosts() on the server.

export type RecentUpdatePost = {
  _id: string;
  title: string;
  slug: string;
  publishedAt?: string;
  excerpt?: string;
  category?: { title: string; slug: string };
};

export const RECENT_UPDATE_FILTERS = [
  { label: "All Categories", slug: null },
  { label: "Business & Capital", slug: "business-capital" },
  { label: "Enterprise Technology & AI", slug: "enterprise-technology-ai" },
  { label: "Psychedelic Medicine", slug: "psychedelic-medicine" },
  { label: "Conscious Capital", slug: "conscious-capital" },
  { label: "Systems & Innovation", slug: "systems-innovation" },
] as const;

export const RECENT_UPDATES_MAX_POSTS = 3;

// Only the posts some pill can actually show (at most 3 per pill, newest
// first, in the order given), so the page doesn't send every essay to the
// browser just for this band. The client filters this list exactly as it
// would the full one, with the same result.
export function pickRecentUpdatePosts(posts: RecentUpdatePost[]): RecentUpdatePost[] {
  const keep = new Set<string>();
  for (const f of RECENT_UPDATE_FILTERS) {
    posts
      .filter((p) => f.slug === null || p.category?.slug === f.slug)
      .slice(0, RECENT_UPDATES_MAX_POSTS)
      .forEach((p) => keep.add(p._id));
  }
  return posts
    .filter((p) => keep.has(p._id))
    .map(({ _id, title, slug, publishedAt, excerpt, category }) => ({ _id, title, slug, publishedAt, excerpt, category }));
}
