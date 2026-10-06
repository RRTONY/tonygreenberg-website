import type { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import { allPostsForArchiveQuery } from "@/lib/sanity/queries";
import { EssaysList } from "@/components/blog/essays-list";
import { AUTHORITY_ITEMS } from "@/lib/content/archetypes";
import { POST_ORDER } from "@/lib/content/post-order";

export const metadata: Metadata = {
  title: "Essays",
  description:
    "Essays on enterprise technology, psychedelic medicine, regenerative capital, and the systems that need to change.",
  alternates: { canonical: "/essays" },
};

type Post = Parameters<typeof EssaysList>[0]["posts"][number];

// Live's order (checked 2026-10-07): posts newer than the legacy editorial
// list come first (newest first, as Sanity returns them), then the rest in
// legacy's editorial order (POST_ORDER), not strictly by date.
function liveOrder(posts: Post[]): Post[] {
  const rank = new Map(POST_ORDER.map((slug, i) => [slug, i]));
  const newer = posts.filter((p) => !rank.has(p.slug));
  const ordered = posts.filter((p) => rank.has(p.slug)).sort((a, b) => rank.get(a.slug)! - rank.get(b.slug)!);
  return [...newer, ...ordered];
}

export default async function EssaysPage() {
  const posts = liveOrder(await sanityFetch<Post[]>({ query: allPostsForArchiveQuery, tags: ["post"] }));

  return (
    <div>
      <div className="bg-foreground py-2.5 text-center">
        <p className="font-mono text-[0.68rem] tracking-[0.15em] text-brand-gold-light uppercase">
          {AUTHORITY_ITEMS.join("  ·  ")}
        </p>
      </div>

      <div className="mx-auto max-w-225 px-6 pt-12 pb-30">
        <h1 className="mb-2 text-center font-heading text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-foreground">
          Essays
        </h1>
        <p className="mb-8 text-center text-foreground/70">
          {posts.length} essays · 15 years · Zero algorithm
        </p>

        <EssaysList posts={posts} />
      </div>
    </div>
  );
}
