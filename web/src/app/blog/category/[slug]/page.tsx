import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch, client } from "@/lib/sanity/client";
import {
  postsByCategoryQuery,
  postCountByCategoryQuery,
  categoryBySlugQuery,
  allCategorySlugsQuery,
} from "@/lib/sanity/queries";
import { PostCard } from "@/components/blog/post-card";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 12;
type Post = Parameters<typeof PostCard>[0]["post"];

export async function generateStaticParams() {
  const categories = await client.fetch<{ slug: string }[]>(allCategorySlugsQuery);
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = await client.fetch<{ title: string } | null>(categoryBySlugQuery, { slug });
  if (!category) return {};
  return { title: category.title, description: `Essays filed under ${category.title}.` };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps<"/blog/category/[slug]">) {
  const { slug } = await params;
  const search = await searchParams;
  const page = Number(search?.page) || 1;

  const category = await client.fetch<{ title: string } | null>(categoryBySlugQuery, { slug });
  if (!category) notFound();

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const [posts, total] = await Promise.all([
    sanityFetch<Post[]>({
      query: postsByCategoryQuery,
      params: { categorySlug: slug, start, end },
      tags: ["post", `category:${slug}`],
    }),
    sanityFetch<number>({
      query: postCountByCategoryQuery,
      params: { categorySlug: slug },
      tags: ["post", `category:${slug}`],
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <Link href="/blog" className="font-mono text-xs uppercase tracking-wide text-brand-gold">
          &larr; All essays
        </Link>
        <h1 className="mt-2 font-heading text-4xl font-bold text-foreground">{category.title}</h1>
      </header>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts in this category yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          {page > 1 && (
            <Button asChild variant="outline" size="sm">
              <Link href={page === 2 ? `/blog/category/${slug}` : `/blog/category/${slug}?page=${page - 1}`}>
                Previous
              </Link>
            </Button>
          )}
          <span className="font-mono text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/blog/category/${slug}?page=${page + 1}`}>Next</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
