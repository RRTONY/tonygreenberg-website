import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { sanityFetch } from "@/lib/sanity/client";
import {
  postsByCategoryQuery,
  postCountByCategoryQuery,
  categoryBySlugQuery,
  MIN_INDEXABLE_CATEGORY_POSTS,
} from "@/lib/sanity/queries";
import { PostCard } from "@/components/blog/post-card";
import { Button } from "@/components/ui/button";

// One category's essays, shared by /blog/category/[slug] (page 1) and
// /blog/category/[slug]/page/[n] (page 2 and up). Page numbers are part of
// the path, not ?page=N, so every page is pre-built (2026-10-09; the
// searchParams version rendered on every request). next.config.ts sends old
// ?page=N links to the path form.
export const CATEGORY_PAGE_SIZE = 12;

type Post = Parameters<typeof PostCard>[0]["post"];

export function categoryPageHref(slug: string, page: number) {
  return page <= 1 ? `/blog/category/${slug}` : `/blog/category/${slug}/page/${page}`;
}

export async function getCategoryPostCount(slug: string) {
  return sanityFetch<number>({
    query: postCountByCategoryQuery,
    params: { categorySlug: slug },
    tags: ["post", `category:${slug}`],
  });
}

export async function categoryMetadata(slug: string, page: number): Promise<Metadata> {
  const [category, total] = await Promise.all([
    sanityFetch<{ title: string } | null>({ query: categoryBySlugQuery, params: { slug }, tags: ["category"] }),
    getCategoryPostCount(slug),
  ]);
  if (!category) return {};

  return {
    title: page > 1 ? `${category.title} — Page ${page}` : category.title,
    description: `Essays filed under ${category.title}.`,
    // Each page has genuinely different posts, so it self-canonicals rather
    // than consolidating to page 1 (Google's current pagination guidance).
    alternates: { canonical: categoryPageHref(slug, page) },
    ...(total < MIN_INDEXABLE_CATEGORY_POSTS ? { robots: { index: false, follow: true } } : {}),
  };
}

export async function CategoryListing({ slug, page }: { slug: string; page: number }) {
  const category = await sanityFetch<{ title: string } | null>({
    query: categoryBySlugQuery,
    params: { slug },
    tags: ["category"],
  });
  if (!category) notFound();

  const start = (page - 1) * CATEGORY_PAGE_SIZE;
  const [posts, total] = await Promise.all([
    sanityFetch<Post[]>({
      query: postsByCategoryQuery,
      params: { categorySlug: slug, start, end: start + CATEGORY_PAGE_SIZE },
      tags: ["post", `category:${slug}`],
    }),
    getCategoryPostCount(slug),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / CATEGORY_PAGE_SIZE));
  if (page > totalPages) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <Link
          href="/blog"
          className="inline-flex min-h-11 items-center gap-1.5 font-mono text-xs tracking-wide text-brand-gold uppercase md:min-h-6"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          All essays
        </Link>
        <h1 className="mt-2 font-heading text-4xl font-bold text-foreground">{category.title}</h1>
      </header>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts in this category yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <PostCard key={post._id} post={post} headingLevel="h2" eager={i === 0} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          {page > 1 && (
            <Button asChild variant="outline" size="sm">
              <Link href={categoryPageHref(slug, page - 1)}>Previous</Link>
            </Button>
          )}
          <span className="font-mono text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Button asChild variant="outline" size="sm">
              <Link href={categoryPageHref(slug, page + 1)}>Next</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
