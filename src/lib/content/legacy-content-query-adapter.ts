import "server-only";

import {
  getAllArchivePosts,
  getAllCategorySlugs,
  getAllPostSlugs,
  getCategoriesWithPostCount,
  getCategoryBySlug,
  getCategoryPosts,
  getPostBySlug,
  getPostsBySlugs,
  getRecentPosts,
  getRelatedPosts,
  searchContentPosts,
} from "@/lib/content/post-repository";

import {
  allCategorySlugsQuery,
  allPostSlugsQuery,
  allPostsForArchiveQuery,
  categoriesQuery,
  categoryBySlugQuery,
  gemSparkPostsQuery,
  postBySlugQuery,
  postCountByCategoryQuery,
  postCountQuery,
  postTeaserBySlugQuery,
  postsByCategoryQuery,
  postsBySlugsQuery,
  postsForReadingPathQuery,
  recentPostsQuery,
  relatedPostsQuery,
  searchPostsQuery,
} from "./legacy-content-query-tokens";

export type QueryParams = Record<string, unknown>;

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asStringList(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function toLegacyDetail(post: Awaited<ReturnType<typeof getPostBySlug>>) {
  return post;
}

async function executeQuery(query: string, params: QueryParams): Promise<unknown> {
  if (query === allPostsForArchiveQuery) return getAllArchivePosts();
  if (query === postTeaserBySlugQuery || query === postBySlugQuery) {
    return toLegacyDetail(await getPostBySlug(asString(params.slug)));
  }
  if (query === postsBySlugsQuery || query === postsForReadingPathQuery) {
    return getPostsBySlugs(asStringList(params.slugs));
  }
  if (query === allPostSlugsQuery) {
    const posts = await getAllPostSlugs();
    return posts.map((post) => ({ _updatedAt: post.updatedAt.toISOString(), slug: post.slug }));
  }
  if (query === allCategorySlugsQuery) return getAllCategorySlugs();
  if (query === categoriesQuery) return getCategoriesWithPostCount();
  if (query === categoryBySlugQuery) return getCategoryBySlug(asString(params.slug));
  if (query === postsByCategoryQuery || query === postCountByCategoryQuery) {
    const start = typeof params.start === "number" ? params.start : 0;
    const end = typeof params.end === "number" ? params.end : start + 12;
    const pageSize = Math.max(1, end - start);
    const page = Math.floor(start / pageSize) + 1;
    const result = await getCategoryPosts(asString(params.categorySlug), page, pageSize);
    return query === postCountByCategoryQuery ? result.total : result.posts;
  }
  if (query === recentPostsQuery) return getRecentPosts(asString(params.slug));
  if (query === relatedPostsQuery) {
    return getRelatedPosts(asString(params.slug), asString(params.categorySlug));
  }
  if (query === searchPostsQuery) {
    const search = asString(params.q).replaceAll("*", "");
    return searchContentPosts(search);
  }
  if (query === postCountQuery) return (await getAllArchivePosts()).length;
  if (query === gemSparkPostsQuery) return [];

  return null;
}

export const client = {
  fetch: async <T>(query: string, params: QueryParams = {}) =>
    executeQuery(query, params) as Promise<T>,
};

export async function sanityFetch<T = unknown>({
  query,
  params = {},
}: {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}): Promise<T> {
  return executeQuery(query, params) as Promise<T>;
}
