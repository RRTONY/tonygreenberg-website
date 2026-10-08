import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { allCategorySlugsQuery } from "@/lib/sanity/queries";
import { CategoryListing, categoryMetadata } from "@/components/blog/category-listing";

// Page 1 of a category. Later pages: ./page/[n]/page.tsx.
export async function generateStaticParams() {
  const categories = await client.fetch<{ slug: string }[]>(allCategorySlugsQuery);
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return categoryMetadata(slug, 1);
}

export default async function CategoryPage({ params }: PageProps<"/blog/category/[slug]">) {
  const { slug } = await params;
  return <CategoryListing slug={slug} page={1} />;
}
