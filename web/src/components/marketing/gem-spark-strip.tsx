import Link from "next/link";
import { Sparkles } from "lucide-react";
import { sanityFetch } from "@/lib/sanity/client";
import { gemSparkPostsQuery } from "@/lib/sanity/queries";
import { GEM_SPARK_SUBTITLES } from "@/lib/content/gem-sparks";

type Post = { title: string; slug: string };

// Ported from legacy client/src/pages/Blog.tsx's "GemSpark Strip" — a real,
// small editorial motif (see gem-sparks.ts). Legacy hid this section
// entirely when zero posts matched; same here.
export async function GemSparkStrip() {
  const posts = await sanityFetch<Post[]>({ query: gemSparkPostsQuery, tags: ["post"] });
  if (posts.length === 0) return null;

  return (
    <section className="border-y border-brand-gold/20 bg-linear-to-br from-[#FFFBF0] to-[#FFF8E7] px-4 py-10 sm:px-6 dark:from-[#1a1608] dark:to-[#181206]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-start gap-8">
        <div className="min-w-[220px] flex-1 basis-[280px]">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="size-5 text-[#C8860A]" />
            <span className="font-mono text-xs tracking-[0.2em] text-[#C8860A] uppercase">
              GemSpark
            </span>
          </div>
          <p className="max-w-[340px] text-sm text-[#5C3A1E] dark:text-[#D9C79E]">
            A GemSpark is a real moment — a conversation, an encounter, a collision of people and
            ideas — that illuminates something larger. Not a theory. Not a framework. A spark.
            Every essay Tony publishes includes one.
          </p>
        </div>
        <div className="flex flex-2 basis-[400px] flex-col gap-3">
          <div className="mb-1 font-mono text-xs tracking-wide text-brand-gold uppercase">
            Recent GemSparks
          </div>
          {posts.map((post) => {
            const subtitle = GEM_SPARK_SUBTITLES[post.slug];
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="flex items-center gap-3 rounded-md border border-[#C8860A]/20 bg-white/70 px-4 py-3 transition-colors hover:border-[#C8860A]/50 dark:bg-white/5"
              >
                <Sparkles className="size-4 shrink-0 text-[#C8860A]" />
                <div className="min-w-0">
                  <div className="truncate font-heading text-sm text-[#3D2B1F] italic dark:text-[#EDE0C8]">
                    {post.title}
                  </div>
                  {subtitle && (
                    <div className="font-mono text-xs tracking-wide text-[#8B6914] uppercase">
                      {subtitle}
                    </div>
                  )}
                </div>
                <span className="ml-auto shrink-0 font-mono text-xs text-[#C8860A]">→</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
