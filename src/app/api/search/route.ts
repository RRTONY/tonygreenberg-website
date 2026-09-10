import { NextResponse, type NextRequest } from "next/server";
import { sanityFetch } from "@/lib/content/legacy-content-query-adapter";
import { searchPostsQuery } from "@/lib/content/legacy-content-query-tokens";
import { scoreItem } from "@/lib/search-engine";

// Server-side half of the search modal's dual-path search (see
// search-modal.tsx): the static page directory is scored instantly on the
// client (src/lib/content/search-directory.ts), but blog posts live in
// Sanity, so they need a real round-trip. Reuses the exact same
// `searchPostsQuery` GROQ query (title/excerpt/tags/body `match`) that
// `/search`'s own Server Component already uses — same query, same
// sanityFetch tagging convention, no new query added to
// lib/sanity/queries.ts.
//
// Legacy's `scoreBlog` (searchEngine.ts) additionally did TF-IDF-style
// density scoring over each post's full body text, bundled entirely
// client-side via a static blogData.json import. That's not available here
// (Sanity content isn't bundled client-side, and `searchPostsQuery` doesn't
// select full body text — only title/excerpt/category) — so ranking below
// reuses this app's own `scoreItem` (the same title/tag/description-tier
// formula used for static pages) over each match's title/excerpt/category,
// then falls back to `searchPostsQuery`'s own recency order for ties. The
// GROQ `match` clause itself still filters on the real full body text
// (`pt::text(body) match $q`), so a post that only matches deep in its body
// is still found — just ranked by title/excerpt relevance rather than body
// term density.
type SearchPostResult = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  category?: { title: string; slug: { current: string } };
};

export type SearchPostHit = {
  title: string;
  href: string;
  description: string;
  category?: string;
};

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ posts: [] });
  }

  try {
    const results = await sanityFetch<SearchPostResult[]>({
      query: searchPostsQuery,
      params: { q: `*${q}*` },
      tags: ["post"],
    });

    const posts: SearchPostHit[] = results
      .map((post) => ({
        title: post.title,
        href: `/blog/${post.slug.current}`,
        description: post.excerpt || "",
        category: post.category?.title,
        score: scoreItem(q, {
          title: post.title,
          description: post.excerpt || "",
          tags: post.category?.title ? [post.category.title] : [],
        }),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(({ title, href, description, category }) => ({ title, href, description, category }));

    return NextResponse.json({ posts });
  } catch (err) {
    console.error("[api/search] Sanity query failed:", err);
    return NextResponse.json({ posts: [] }, { status: 502 });
  }
}
