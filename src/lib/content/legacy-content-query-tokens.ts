// Transitional query identifiers used by existing route components. They are
// resolved exclusively by the managed-database adapter in `client.ts`; no
// third-party CMS client or GROQ query is present at runtime.
export const postTeaserBySlugQuery = "postTeaserBySlug";
export const postsBySlugsQuery = "postsBySlugs";
export const allPostsForArchiveQuery = "allPostsForArchive";
export const gemSparkPostsQuery = "gemSparkPosts";
export const siteSettingsQuery = "siteSettings";
export const pageSeoQuery = "pageSeo";
export const pageBySlugQuery = "pageBySlug";
export const postsQuery = "posts";
export const postCountQuery = "postCount";
export const postBySlugQuery = "postBySlug";
export const relatedPostsQuery = "relatedPosts";
export const recentPostsQuery = "recentPosts";
export const postsForReadingPathQuery = "postsForReadingPath";
export const allPostSlugsQuery = "allPostSlugs";
export const searchPostsQuery = "searchPosts";
export const categoriesQuery = "categories";
export const postsByCategoryQuery = "postsByCategory";
export const postCountByCategoryQuery = "postCountByCategory";
export const categoryBySlugQuery = "categoryBySlug";
export const allCategorySlugsQuery = "allCategorySlugs";
export const allRedirectsQuery = "allRedirects";
