import type { MetadataRoute } from "next";
import { client } from "@/lib/sanity/client";
import { allPostSlugsQuery } from "@/lib/sanity/queries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tonygreenberg.com";

// Extended per-section as each migration phase ships real pages
// (NEXTJS-MIGRATION-TODO.md, Phase 12) — for now, the homepage plus every
// migrated blog post, sourced live from Sanity rather than hand-maintained.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await client.fetch<{ slug: string; _updatedAt: string }[]>(allPostSlugsQuery);

  return [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post._updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
