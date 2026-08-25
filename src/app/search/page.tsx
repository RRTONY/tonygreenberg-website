import type { Metadata } from "next";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { sanityFetch } from "@/lib/sanity/client";
import { searchPostsQuery } from "@/lib/sanity/queries";
import { PostCard } from "@/components/blog/post-card";

// New page — no legacy Search.tsx exists (Phase 5's TODO listed the GROQ
// query as already written but the page as not yet built). Several
// already-ported pages link here (e.g. /series' "View All Essays", a
// legacy /the-index typo corrected to /search) — a real destination, not a
// stub. A plain GET <form> to this same route (?q=...) needs no client
// JS at all; Server Components fetch Sanity directly per this repo's rule.
export const metadata: Metadata = {
  title: "Search",
  description: "Search essays on business, AI, trust, and culture.",
  alternates: { canonical: "/search" },
};

type SearchResult = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  heroImage?: Parameters<typeof PostCard>[0]["post"]["heroImage"];
  category?: { title: string; slug: { current: string } };
};

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const params = await searchParams;
  const q = typeof params?.q === "string" ? params.q.trim() : "";

  const results = q
    ? await sanityFetch<SearchResult[]>({
        query: searchPostsQuery,
        params: { q: `*${q}*` },
        tags: ["post"],
      })
    : [];

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
      <p className="mb-3 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Search</p>
      <h1 className="mb-8 font-heading text-4xl font-bold text-foreground">Search the Essays</h1>

      <form action="/search" method="get" className="relative mb-10 max-w-xl">
        <SearchIcon className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search titles, excerpts, tags, and body text..."
          autoFocus
          className="w-full rounded-full border border-border bg-card py-3 pr-4 pl-11 text-sm text-foreground outline-none focus:border-brand-gold/50"
        />
      </form>

      {!q && (
        <p className="text-muted-foreground">
          Enter a search term above to find essays by title, excerpt, tags, or body text.
        </p>
      )}

      {q && (
        <>
          <p className="mb-6 text-sm text-muted-foreground">
            {results.length === 0
              ? `No results for "${q}"`
              : `${results.length} result${results.length === 1 ? "" : "s"} for "${q}"`}
          </p>

          {results.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border py-16 text-center">
              <p className="text-muted-foreground">
                Try a different term, or{" "}
                <Link href="/blog" className="text-brand-gold underline">
                  browse all essays
                </Link>
                .
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
