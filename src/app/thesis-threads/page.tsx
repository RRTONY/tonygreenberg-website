import type { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import { allPostsForArchiveQuery } from "@/lib/sanity/queries";
import { ThesisThreadsExplorer } from "@/components/blog/thesis-threads-explorer";
import type { ArchivePost } from "@/components/blog/articles-explorer";

// Ported from legacy client/src/pages/ThesisThreads.tsx, backed by
// lib/content/thesis-threads.ts (itself ported from legacy's
// client/src/data/sitePrompt.ts). This is Tony's own newsletter-curation
// dashboard — the 6 thesis threads, the section-to-thesis map, the research
// library, and the content rules that connect every essay back to the
// extractive-vs-regenerative thesis. Posts come live from Sanity
// (allPostsForArchiveQuery) instead of the static blogData.json import, and
// `/read/[slug]` links are fixed to this site's real `/blog/[slug]` pattern.
// Two intentional simplifications, matching decisions already made
// elsewhere in this migration: the canvas-based floating-particle animation
// is dropped (not worth the runtime cost for pure decoration, same call as
// home-hero.tsx), and the legacy hero's generic Unsplash stock photo +
// scroll-parallax isn't a real editorial image worth rescuing into Sanity —
// dropped for a plain dark band, same judgment call already made for the
// peptide pages' dead CloudFront hero images.
export const metadata: Metadata = {
  title: "Thesis Threads",
  description:
    "The connective tissue between Tony Greenberg's essays — recurring themes, arguments, and intellectual threads mapping the extractive-vs-regenerative thesis.",
  alternates: { canonical: "/thesis-threads" },
};

export default async function ThesisThreadsPage() {
  const posts = await sanityFetch<ArchivePost[]>({ query: allPostsForArchiveQuery, tags: ["post"] });

  return <ThesisThreadsExplorer posts={posts} />;
}
