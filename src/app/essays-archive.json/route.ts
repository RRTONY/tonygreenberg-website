import { sanityFetch } from "@/lib/sanity/client";
import { allPostsForArchiveQuery } from "@/lib/sanity/queries";
import type { ArchivePost } from "@/lib/content/essay-archive";

// The full essay list behind the archive's search, category filters and
// "Show all" on "/" and "/blog" (see src/lib/content/essay-archive.ts).
// Built at deploy time and refreshed like the pages (sanityFetch's 60s
// revalidate and the Sanity webhook's "sanity" tag).
export const dynamic = "force-static";

export async function GET() {
  const posts = await sanityFetch<ArchivePost[]>({ query: allPostsForArchiveQuery, tags: ["post"] });
  return Response.json(posts, { headers: { "X-Robots-Tag": "noindex" } });
}
