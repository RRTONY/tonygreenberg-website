import { groq } from "next-sanity";

// Lightweight teaser for a single known post, used where a marketing page
// features/links to one specific post (e.g. the homepage) without needing
// its full body.
export const postTeaserBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    title, slug, excerpt, heroImage, publishedAt, readTime
  }
`;

// Multiple posts by an exact slug list — used by pages that reference a
// known, curated set of posts (e.g. /series, the homepage's Editor's Picks)
// rather than a query filter.
export const postsBySlugsQuery = groq`
  *[_type == "post" && slug.current in $slugs]{
    title, "slug": slug.current, excerpt, heroImage, readTime
  }
`;

// All posts, full fields — used by the homepage archive, which (like its
// legacy source) does its own client-side search/category/theme filtering
// over the whole corpus rather than paging server-side. Fine at this corpus
// size (~120 posts); revisit if it grows an order of magnitude.
export const allPostsForArchiveQuery = groq`
  *[_type == "post"] | order(publishedAt desc){
    _id, title, subtitle, "slug": slug.current, publishedAt, excerpt, heroImage,
    readTime, tags, category->{title, "slug": slug.current}
  }
`;

// Posts whose body mentions "GemSpark" — a small recurring editorial motif
// (see src/lib/content/gem-sparks.ts for the real, hand-ported subtitles;
// Portable Text has no raw-heading string left to regex the way legacy did).
export const gemSparkPostsQuery = groq`
  *[_type == "post" && pt::text(body) match "*GemSpark*"] | order(publishedAt desc) [0...5]{
    title, "slug": slug.current
  }
`;

// Site Settings (singleton)
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    siteTitle,
    tagline,
    logo,
    defaultSeo,
    navigation,
    footerColumns,
    footerText,
    socialLinks
  }
`;

// Route-keyed SEO overrides for code-driven pages (Phases 4-9)
export const pageSeoQuery = groq`
  *[_type == "pageSeo" && route == $route][0]{ seo }
`;

// Full editorial `page` documents (marketing pages whose copy is CMS-owned)
export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0]{
    title,
    slug,
    body,
    seo
  }
`;

// Blog posts
export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) [$start...$end]{
    _id,
    title,
    subtitle,
    slug,
    publishedAt,
    excerpt,
    heroImage,
    readTime,
    category->{title, slug},
    author->{name, slug}
  }
`;

export const postCountQuery = groq`count(*[_type == "post"])`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    _updatedAt,
    title,
    subtitle,
    slug,
    publishedAt,
    excerpt,
    pullQuote,
    heroImage,
    readTime,
    body,
    author->{name, slug, avatar, bio},
    category->{title, slug},
    tags,
    seo
  }
`;

// Related posts: same category, excluding the current post, most recent first
export const relatedPostsQuery = groq`
  *[_type == "post" && slug.current != $slug && category._ref == $categoryId]
    | order(publishedAt desc) [0...3]{
    _id, title, slug, publishedAt, excerpt, heroImage
  }
`;

export const recentPostsQuery = groq`
  *[_type == "post" && slug.current != $slug] | order(publishedAt desc) [0...3]{
    _id, title, slug, publishedAt, excerpt, heroImage
  }
`;

// Same slug-list lookup as postsBySlugsQuery above, but shaped to match
// postBySlugQuery's PostDetail (object-form `slug.current`, `_id`,
// `publishedAt`) for lib/content/reading-paths.ts's curated "read next"
// picks on /blog/[slug] — GROQ's `in` doesn't preserve $slugs' order, so
// callers re-sort by the original curated order after fetching.
export const postsForReadingPathQuery = groq`
  *[_type == "post" && slug.current in $slugs]{
    _id, title, slug, publishedAt, excerpt, heroImage
  }
`;

export const allPostSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current, _updatedAt }
`;

// Full-text search across posts — matches title, excerpt, tags, and body
export const searchPostsQuery = groq`
  *[_type == "post" && defined(slug.current) && (
    title match $q ||
    excerpt match $q ||
    count(tags[@ match $q]) > 0 ||
    pt::text(body) match $q
  )] | order(publishedAt desc) [0...30]{
    _id, title, slug, publishedAt, excerpt, heroImage,
    category->{title, slug}
  }
`;

// Categories, ordered by post count desc so populated ones surface first
export const categoriesQuery = groq`
  *[_type == "category"]{
    _id,
    title,
    slug,
    "postCount": count(*[_type == "post" && references(^._id)])
  } | order(postCount desc, title asc)
`;

export const postsByCategoryQuery = groq`
  *[_type == "post" && category->slug.current == $categorySlug]
    | order(publishedAt desc) [$start...$end]{
    _id, title, slug, publishedAt, excerpt, heroImage,
    category->{title, slug}
  }
`;

export const postCountByCategoryQuery = groq`
  count(*[_type == "post" && category->slug.current == $categorySlug])
`;

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0]{_id, title}
`;

export const allCategorySlugsQuery = groq`
  *[_type == "category" && defined(slug.current)]{ "slug": slug.current }
`;

// Redirect map (Phase 12 — Manus/legacy URL -> Next.js URL)
export const allRedirectsQuery = groq`
  *[_type == "redirect"]{ source, destination, permanent }
`;
