import type { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import { allPostsForArchiveQuery } from "@/lib/sanity/queries";
import { EssaysList } from "@/components/blog/essays-list";
import { AUTHORITY_ITEMS } from "@/lib/content/archetypes";

export const metadata: Metadata = {
  title: "Essays",
  description:
    "Essays on enterprise technology, psychedelic medicine, regenerative capital, and the systems that need to change.",
  alternates: { canonical: "/essays" },
};

type Post = Parameters<typeof EssaysList>[0]["posts"][number];

export default async function EssaysPage() {
  const posts = await sanityFetch<Post[]>({ query: allPostsForArchiveQuery, tags: ["post"] });

  return (
    <div>
      <div className="bg-foreground py-2.5 text-center">
        <p className="font-mono text-[0.68rem] tracking-[0.15em] text-brand-gold-light uppercase">
          {AUTHORITY_ITEMS.join("  ·  ")}
        </p>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-10">
        <h1 className="mb-2 text-center font-heading text-4xl font-bold text-foreground">
          Essays
        </h1>
        <p className="mb-8 text-center text-foreground/70">
          {posts.length} essays · 25 years · Zero algorithm
        </p>

        <EssaysList posts={posts} />
      </div>
    </div>
  );
}
