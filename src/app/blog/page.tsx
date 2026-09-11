import type { Metadata } from "next";
import { getAllArchivePosts } from "@/lib/content/post-repository";
import { HomeArchive } from "@/components/blog/home-archive";
import { NewsletterPopup } from "@/components/marketing/newsletter-popup";

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

export default async function BlogPage({ searchParams }: AppPageProps<"/blog">) {
  const params = await searchParams;
  const theme = typeof params?.theme === "string" ? params.theme : undefined;

  const posts = await getAllArchivePosts();

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

      <HomeArchive posts={posts} initialTheme={theme} />
      <NewsletterPopup />
    </div>
  );
}
