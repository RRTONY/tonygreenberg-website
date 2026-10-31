import type { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import { allPostsForArchiveQuery } from "@/lib/sanity/queries";
import { HomeArchive } from "@/components/blog/home-archive";
import { summarizeArchive, type ArchivePost } from "@/lib/content/essay-archive";
import { getMostRead } from "@/lib/content/most-read";
import { NewsletterPopupLazy } from "@/components/marketing/newsletter-popup-lazy";

// A real, standalone blog index — distinct from the homepage. Legacy
// rendered the exact same Blog.tsx component at both "/" and "/blog"; this
// app instead reuses the same underlying archive (search, category, theme
// filtering, sidebar) as its own page here, under its own heading/metadata,
// without the homepage's hero/doors/editor's-picks sections in front of it.
export const metadata: Metadata = {
  title: "Essays",
  description:
    "Essays on business, AI, trust, and culture — twenty-five years of pattern recognition, searchable and filterable.",
  alternates: { canonical: "/blog" },
};

type Post = ArchivePost;

export default async function BlogPage() {
  const posts = await sanityFetch<Post[]>({ query: allPostsForArchiveQuery, tags: ["post"] });
  const mostRead = await getMostRead(posts);

  return (
    <div>
      <div className="bg-linear-to-b from-background to-secondary px-6 py-16 text-center sm:px-10">
        <p className="mb-3 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
          {posts.length} Essays
        </p>
        <h1 className="mx-auto mb-4 max-w-xl font-heading text-4xl font-bold text-foreground sm:text-5xl">
          Essays
        </h1>
        <p className="mx-auto max-w-lg text-foreground/70">
          Frameworks, field notes, and unpopular opinions — on business, consciousness, and
          everything in between.
        </p>
      </div>

      <section aria-label="America, Unbundled series" className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <h2 className="font-heading text-2xl font-semibold text-foreground">America, Unbundled: Two-Part Series</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <a href="/america-unbundled" className="block border border-border bg-card p-5 text-foreground hover:border-brand-gold">
            <p className="text-sm font-semibold uppercase text-brand-gold">Politics and AI · Part One</p>
            <h3 className="mt-2 font-serif text-2xl">AI Does Not Have a Candidate: Politics for the AI Age</h3>
            <p className="mt-3 text-lg leading-relaxed">An independent civic grid for accountability over AI, energy and political power.</p>
          </a>
          <a href="/america-unbundled-field-guide" className="block border border-border bg-card p-5 text-foreground hover:border-brand-gold">
            <p className="text-sm font-semibold uppercase text-brand-gold">Civic Governance · Part Two</p>
            <h3 className="mt-2 font-serif text-2xl">America, Unbundled: The Field Guide</h3>
            <p className="mt-3 text-lg leading-relaxed">A practical guide to independent political infrastructure, accountability and civic action.</p>
          </a>
        </div>
      </section>
      <HomeArchive archive={summarizeArchive(posts)} mostRead={mostRead} eagerFirstCard />
      <NewsletterPopupLazy />
    </div>
  );
}
