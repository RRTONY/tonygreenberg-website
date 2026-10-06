import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/lib/sanity/client";
import { postsBySlugsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { SERIES } from "@/lib/content/essay-series";

// Ported from legacy client/src/pages/Series.tsx ("The Collections") +
// client/src/data/seriesData.ts. Real content kept as-is (12 real curated
// essay series, all real post slugs). Episode titles/images now come live
// from Sanity instead of the legacy blogData.json import. The legacy
// "Search All Essays" next-page link pointed at "/the-index", rebuilt from
// live on 2026-10-07 and linked again (it briefly pointed at "/search"
// instead, which is this app's actual planned search page and matches the
// link's own label.

export const metadata: Metadata = {
  title: "Series",
  description:
    "Curated essay collections — multi-part investigations into blockchain, trust, communication, and the future of business.",
  alternates: { canonical: "/series" },
};

const CATEGORY_CLASSES: Record<string, { text: string; bg: string }> = {
  "Business & Capital": { text: "text-[#1565C0]", bg: "bg-[#1565C0]/10" },
  "Systems & Innovation": { text: "text-[#7B2D8E]", bg: "bg-[#7B2D8E]/10" },
  "Culture & Communication": { text: "text-[#AB4E0F]", bg: "bg-[#C75B12]/10" },
  "Living Well": { text: "text-[#2B762F]", bg: "bg-[#2E7D32]/10" },
  "Impact & Purpose": { text: "text-[#00695C]", bg: "bg-[#00695C]/10" },
  "The Crusades": { text: "text-[#B71C1C]", bg: "bg-[#B71C1C]/10" },
};

type PostLookup = { title: string; slug: string; heroImage?: Parameters<typeof urlFor>[0] };

export default async function SeriesPage() {
  const allSlugs = Array.from(new Set(SERIES.flatMap((s) => s.posts)));
  const postList = await sanityFetch<PostLookup[]>({
    query: postsBySlugsQuery,
    params: { slugs: allSlugs },
    tags: ["post"],
  });
  const postsBySlug = new Map(postList.map((p) => [p.slug, p]));

  return (
    <div>
      {/* Centered in live's ~546px story column (measured 2026-10-02). */}
      <div className="bg-linear-to-b from-background to-secondary px-5 pt-23 pb-20 sm:px-10">
        <div className="mx-auto max-w-[34.125rem]">
          <Link href="/" className="inline-flex items-center mb-8 font-mono text-xs tracking-wide text-brand-gold uppercase min-h-11 md:min-h-6">
            ← Back to The Blog
          </Link>
          <p className="mb-6 font-mono text-xs/[1.8] tracking-[0.3em] text-brand-gold uppercase">
            The Collections
          </p>
          <h1 className="mb-4 font-heading text-[1.9rem]/[1.25] font-bold text-foreground sm:text-[2.56rem]/[1.25]">
            Essay Series
          </h1>
          <p className="text-[1.15rem]/[1.7] text-foreground/70">
            Some ideas need more than one essay. These are the multi-part investigations — threads
            that weave through blockchain, trust, communication, and the future of business.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[39rem] px-5 py-12 sm:px-10">
        <div className="grid gap-8">
          {SERIES.map((series) => {
            const c = CATEGORY_CLASSES[series.category] ?? { text: "text-brand-gold", bg: "bg-brand-gold/10" };
            const seriesPosts = series.posts
              .map((slug) => postsBySlug.get(slug))
              .filter((p): p is PostLookup => Boolean(p));
            const firstPost = seriesPosts[0];

            return (
              <div
                key={series.id}
                className="flex flex-col gap-6 rounded-md border border-border bg-card p-6 transition-shadow hover:shadow-lg sm:p-8"
              >
                {firstPost?.heroImage && (
                  <div className="relative h-50 overflow-hidden rounded-md">
                    <Image
                      src={urlFor(firstPost.heroImage).width(960).url()}
                      alt={series.title}
                      fill
                      sizes="(min-width: 640px) 480px, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <span className={`mb-3 inline-block rounded-sm px-2.5 py-1 font-mono text-xs tracking-wide uppercase ${c.text} ${c.bg}`}>
                    {series.category} · {series.posts.length} Parts
                  </span>
                  <h2 className="mb-1 font-heading text-2xl font-bold text-foreground">
                    {series.title}
                  </h2>
                  <p className="mb-3 text-brand-gold">{series.subtitle}</p>
                  <p className="mb-5 leading-relaxed text-foreground/70">{series.description}</p>

                  <div className="flex flex-col gap-1">
                    {seriesPosts.map((post, i) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="flex items-center gap-2 rounded-sm px-2 py-1.5 transition-colors hover:bg-brand-gold/5 min-h-11 md:min-h-6"
                      >
                        <span className="min-w-6 font-mono text-xs font-semibold text-muted-foreground">
                          {i + 1}.
                        </span>
                        <span className="text-brand-gold">{post.title}</span>
                      </Link>
                    ))}
                  </div>

                  {seriesPosts[0] && (
                    <Link
                      href={`/blog/${seriesPosts[0].slug}`}
                      className="mt-4 inline-block border-b border-brand-gold-light font-mono text-xs tracking-wide text-brand-gold uppercase"
                    >
                      Start Reading →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border py-6 text-center">
        <Link href="/the-index" className="inline-flex items-center font-mono text-sm tracking-wide text-brand-gold min-h-11 md:min-h-6">
          Search All Essays →
        </Link>
      </div>
    </div>
  );
}
