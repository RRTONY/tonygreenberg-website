import "server-only";

import { and, desc, eq, inArray, like, ne, or, sql } from "drizzle-orm";

import {
  contentAuthors,
  contentCategories,
  contentPosts,
  type PortableTextBlock,
} from "../../../drizzle/schema";
import { getDb } from "@/lib/db/client";
import type { ContentImage } from "./content-image";

export type ArchivePost = {
  _id: string;
  category?: { slug: string; title: string };
  excerpt?: string;
  heroImage?: ContentImage;
  publishedAt: string;
  readTime?: number;
  slug: string;
  subtitle?: string;
  tags?: string[];
  title: string;
};

export type PostDetail = Omit<ArchivePost, "category" | "slug"> & {
  _updatedAt: string;
  author?: { bio?: string; name: string; slug: string };
  body: PortableTextBlock[];
  category?: { slug: { current: string }; title: string };
  pullQuote?: string;
  seo?: {
    keywords?: string[];
    metaDescription?: string;
    metaTitle?: string;
    noIndex?: boolean;
    ogImage?: ContentImage;
  };
  slug: { current: string };
};

const postSelection = {
  authorBio: contentAuthors.bio,
  authorName: contentAuthors.name,
  authorSlug: contentAuthors.slug,
  body: contentPosts.body,
  categorySlug: contentCategories.slug,
  categoryTitle: contentCategories.title,
  excerpt: contentPosts.excerpt,
  heroImageAlt: contentPosts.heroImageAlt,
  heroImageHeight: contentPosts.heroImageHeight,
  heroImageUrl: contentPosts.heroImageUrl,
  heroImageWidth: contentPosts.heroImageWidth,
  id: contentPosts.id,
  metaDescription: contentPosts.metaDescription,
  metaTitle: contentPosts.metaTitle,
  noIndex: contentPosts.noIndex,
  ogImageUrl: contentPosts.ogImageUrl,
  publishedAt: contentPosts.publishedAt,
  pullQuote: contentPosts.pullQuote,
  readTime: contentPosts.readTime,
  slug: contentPosts.slug,
  subtitle: contentPosts.subtitle,
  tags: contentPosts.tags,
  title: contentPosts.title,
  updatedAt: contentPosts.updatedAt,
};

type JoinedPost = {
  authorBio: string | null;
  authorName: string;
  authorSlug: string;
  body: PortableTextBlock[];
  categorySlug: string;
  categoryTitle: string;
  excerpt: string | null;
  heroImageAlt: string | null;
  heroImageHeight: number | null;
  heroImageUrl: string | null;
  heroImageWidth: number | null;
  id: number;
  metaDescription: string | null;
  metaTitle: string | null;
  noIndex: "false" | "true";
  ogImageUrl: string | null;
  publishedAt: Date;
  pullQuote: string | null;
  readTime: number | null;
  slug: string;
  subtitle: string | null;
  tags: string[];
  title: string;
  updatedAt: Date;
};

function toIso(value: Date) {
  return value.toISOString();
}

function toImage(
  url: string | null,
  alt: string | null,
  width: number | null,
  height: number | null,
): ContentImage | undefined {
  if (!url) return undefined;
  return { alt: alt ?? undefined, height: height ?? undefined, url, width: width ?? undefined };
}

function toArchivePost(row: JoinedPost): ArchivePost {
  return {
    _id: `post-${row.id}`,
    category: { slug: row.categorySlug, title: row.categoryTitle },
    excerpt: row.excerpt ?? undefined,
    heroImage: toImage(row.heroImageUrl, row.heroImageAlt, row.heroImageWidth, row.heroImageHeight),
    publishedAt: toIso(row.publishedAt),
    readTime: row.readTime ?? undefined,
    slug: row.slug,
    subtitle: row.subtitle ?? undefined,
    tags: row.tags,
    title: row.title,
  };
}

function toPostDetail(row: JoinedPost): PostDetail {
  const archivePost = toArchivePost(row);
  return {
    ...archivePost,
    _updatedAt: toIso(row.updatedAt),
    author: { bio: row.authorBio ?? undefined, name: row.authorName, slug: row.authorSlug },
    body: row.body,
    category: { slug: { current: row.categorySlug }, title: row.categoryTitle },
    pullQuote: row.pullQuote ?? undefined,
    seo: {
      keywords: row.tags,
      metaDescription: row.metaDescription ?? undefined,
      metaTitle: row.metaTitle ?? undefined,
      noIndex: row.noIndex === "true",
      ogImage: toImage(row.ogImageUrl, row.heroImageAlt, row.heroImageWidth, row.heroImageHeight),
    },
    slug: { current: row.slug },
  };
}

function postQuery() {
  return getDb()
    .select(postSelection)
    .from(contentPosts)
    .innerJoin(contentAuthors, eq(contentPosts.authorId, contentAuthors.id))
    .innerJoin(contentCategories, eq(contentPosts.categoryId, contentCategories.id));
}

export async function getAllArchivePosts(): Promise<ArchivePost[]> {
  const rows = await postQuery().orderBy(desc(contentPosts.publishedAt));
  return rows.map(toArchivePost);
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const rows = await postQuery().where(eq(contentPosts.slug, slug)).limit(1);
  return rows[0] ? toPostDetail(rows[0]) : null;
}

export async function getAllPostSlugs() {
  return getDb()
    .select({ slug: contentPosts.slug, updatedAt: contentPosts.updatedAt })
    .from(contentPosts);
}

export async function getPostsBySlugs(slugs: string[]): Promise<PostDetail[]> {
  if (!slugs.length) return [];
  const rows = await postQuery().where(inArray(contentPosts.slug, slugs));
  return rows.map(toPostDetail);
}

export async function getRelatedPosts(slug: string, categorySlug: string): Promise<PostDetail[]> {
  const rows = await postQuery()
    .where(and(eq(contentCategories.slug, categorySlug), ne(contentPosts.slug, slug)))
    .orderBy(desc(contentPosts.publishedAt))
    .limit(3);
  return rows.map(toPostDetail);
}

export async function getRecentPosts(slug: string): Promise<PostDetail[]> {
  const rows = await postQuery()
    .where(ne(contentPosts.slug, slug))
    .orderBy(desc(contentPosts.publishedAt))
    .limit(3);
  return rows.map(toPostDetail);
}

export async function getCategoryBySlug(slug: string) {
  const rows = await getDb()
    .select({
      id: contentCategories.id,
      slug: contentCategories.slug,
      title: contentCategories.title,
    })
    .from(contentCategories)
    .where(eq(contentCategories.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}

export async function getAllCategorySlugs() {
  return getDb().select({ slug: contentCategories.slug }).from(contentCategories);
}

export async function getCategoriesWithPostCount() {
  const rows = await getDb()
    .select({
      id: contentCategories.id,
      postCount: sql<number>`count(${contentPosts.id})`,
      slug: contentCategories.slug,
      title: contentCategories.title,
    })
    .from(contentCategories)
    .leftJoin(contentPosts, eq(contentPosts.categoryId, contentCategories.id))
    .groupBy(contentCategories.id, contentCategories.slug, contentCategories.title)
    .orderBy(desc(sql`count(${contentPosts.id})`), contentCategories.title);
  return rows.map((row) => ({
    _id: `category-${row.id}`,
    postCount: Number(row.postCount),
    slug: { current: row.slug },
    title: row.title,
  }));
}

export async function getCategoryPosts(slug: string, page: number, pageSize: number) {
  const offset = Math.max(0, page - 1) * pageSize;
  const rows = await postQuery()
    .where(eq(contentCategories.slug, slug))
    .orderBy(desc(contentPosts.publishedAt))
    .limit(pageSize)
    .offset(offset);
  const totals = await getDb()
    .select({ count: sql<number>`count(*)` })
    .from(contentPosts)
    .innerJoin(contentCategories, eq(contentPosts.categoryId, contentCategories.id))
    .where(eq(contentCategories.slug, slug));
  return { posts: rows.map(toArchivePost), total: Number(totals[0]?.count ?? 0) };
}

export async function searchContentPosts(query: string): Promise<ArchivePost[]> {
  const term = `%${query}%`;
  const rows = await postQuery()
    .where(
      or(
        like(contentPosts.title, term),
        like(contentPosts.excerpt, term),
        like(sql<string>`cast(${contentPosts.tags} as char)`, term),
        like(sql<string>`cast(${contentPosts.body} as char)`, term),
      ),
    )
    .orderBy(desc(contentPosts.publishedAt))
    .limit(31);
  return rows.map(toArchivePost);
}
