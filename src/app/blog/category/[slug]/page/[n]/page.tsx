import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/lib/sanity/client";
import { categoriesQuery } from "@/lib/sanity/queries";
import { CATEGORY_PAGE_SIZE, CategoryListing, categoryMetadata } from "@/components/blog/category-listing";

// Page 2 and up of a category (page 1 is /blog/category/[slug]; /page/1
// redirects there in next.config.ts). Every page is pre-built; a page number
// past the last page is a 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const categories = await client.fetch<{ slug: { current: string } | null; postCount: number }[]>(categoriesQuery);
  return categories.flatMap((c) => {
    if (!c.slug?.current) return [];
    const pages = Math.ceil(c.postCount / CATEGORY_PAGE_SIZE);
    return Array.from({ length: Math.max(0, pages - 1) }, (_, i) => ({ slug: c.slug!.current, n: String(i + 2) }));
  });
}

function pageNumber(n: string) {
  return /^[2-9]$|^[1-9]\d+$/.test(n) ? Number(n) : null;
}

export async function generateMetadata({ params }: PageProps<"/blog/category/[slug]/page/[n]">): Promise<Metadata> {
  const { slug, n } = await params;
  const page = pageNumber(n);
  return page ? categoryMetadata(slug, page) : {};
}

export default async function CategoryPageN({ params }: PageProps<"/blog/category/[slug]/page/[n]">) {
  const { slug, n } = await params;
  const page = pageNumber(n);
  if (!page) notFound();
  return <CategoryListing slug={slug} page={page} />;
}
