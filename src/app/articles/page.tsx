import type { Metadata } from "next";
import Link from "next/link";
import { sanityFetch } from "@/lib/sanity/client";
import { allPostsForArchiveQuery } from "@/lib/sanity/queries";
import { ArticlesExplorer, type ArchivePost } from "@/components/blog/articles-explorer";

// Ported from legacy client/src/pages/Articles.tsx ("Complete Archive").
// Real content ported in full — all 6 real discovery-mode curations
// (Start Here, Short Reads, Deep Dives, Contrarian, Changed His Mind,
// Surprise Me), all 8 real category descriptions, category-grouped default
// view. See lib/content/articles-discovery.ts for 3 stale/mistyped slugs
// caught and corrected while porting (same class of bug already fixed on
// /journeys, /recent-creations, /series). Posts now come live from Sanity
// instead of the static blogData.json import. The footer "SUBSCRIBE" CTA
// linked to /subscribe, which was deferred at the time and swapped for /blog;
// /subscribe exists now, so the footer matches live again (2026-10-01).
export const metadata: Metadata = {
  title: "All Articles",
  description:
    "Complete archive of Tony Greenberg's published essays on enterprise technology, psychedelic medicine, impact investing, systems thinking, and conscious capitalism.",
  alternates: { canonical: "/articles" },
};

export default async function ArticlesPage() {
  const posts = await sanityFetch<ArchivePost[]>({ query: allPostsForArchiveQuery, tags: ["post"] });

  return (
    <div>
      <div className="bg-[#0A0A10] px-6 pt-12 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 font-mono text-xs tracking-[0.25em] text-brand-gold-light uppercase">Complete Archive</p>
          <h1 className="mb-4 font-heading text-[clamp(2rem,5vw,3.2rem)]/[1.2] font-bold text-white/95">All Articles</h1>
          <p className="mb-8 max-w-xl leading-relaxed text-white/55">
            {posts.length} essays on enterprise technology, psychedelic medicine, impact investing,
            systems thinking, and the uncommon sense. Every piece is indexed and searchable.
          </p>
        </div>
      </div>

      <ArticlesExplorer posts={posts} />

      <div className="bg-[#0A0A10] px-6 py-10 text-center sm:px-10">
        <p className="mb-4 text-white/50">New essays every week. Subscribe to get them first.</p>
        <Link href="/subscribe" className="inline-flex items-center rounded-sm bg-brand-gold-light px-8 py-2.5 font-mono text-xs tracking-wide text-[#0A0A10] uppercase min-h-11 md:min-h-6">
          Subscribe
        </Link>
      </div>
    </div>
  );
}
