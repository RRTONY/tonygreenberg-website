import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { sanityFetch, client } from "@/lib/sanity/client";
import {
  postBySlugQuery,
  allPostSlugsQuery,
  relatedPostsQuery,
  recentPostsQuery,
  postsForReadingPathQuery,
  postsBySlugsQuery,
} from "@/lib/sanity/queries";
import { READING_PATHS } from "@/lib/content/reading-paths";
import { DEFAULT_OG_IMAGE } from "@/lib/content/default-image";
import { urlFor } from "@/lib/sanity/image";
import { PortableText, portableTextComponents } from "@/lib/sanity/portable-text";
import { legacyBodyLayout } from "@/lib/sanity/legacy-body";
import { autoLinkBody } from "@/lib/sanity/auto-link-body";
import { PostCard } from "@/components/blog/post-card";
import { AiSummaryLinks, SITE_URL } from "@/components/ai-summary-links";
import { ArticleFooter } from "@/components/blog/article-footer";
import { BlogShareBar } from "@/components/blog/blog-share-bar";
import { TrackLastBlogVisit } from "@/components/blog/track-last-blog-visit";
import { PostHeaderExtras, BeforeYouRead, PostLessonBlocks, SeriesReadingList } from "@/components/blog/post-extras";
import { getSeriesForPost } from "@/lib/content/essay-series";
import { getArticleJsonLd, getPostBreadcrumbJsonLd } from "@/lib/structured-data";
import { formatPostDate } from "@/lib/format-post-date";
import { ArrowRight } from "lucide-react";

type PostDetail = {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  subtitle?: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  pullQuote?: string;
  heroImage?: Parameters<typeof urlFor>[0];
  readTime?: number;
  body: Parameters<typeof PortableText>[0]["value"];
  author?: { name: string; avatar?: Parameters<typeof urlFor>[0] };
  category?: { title: string; slug: { current: string } };
  tags?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: Parameters<typeof urlFor>[0];
  };
};

async function getPost(slug: string) {
  return sanityFetch<PostDetail | null>({
    query: postBySlugQuery,
    params: { slug },
    tags: ["post", `post:${slug}`],
  });
}

export async function generateStaticParams() {
  const posts = await client.fetch<{ slug: string }[]>(allPostSlugsQuery);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const title = post.seo?.metaTitle || post.title;
  const description = post.seo?.metaDescription || post.excerpt;
  const ogImageSource = post.seo?.ogImage || post.heroImage;
  const ogImage = ogImageSource
    ? urlFor(ogImageSource).width(1200).height(630).url()
    : DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    keywords: post.seo?.keywords,
    alternates: { canonical: `/blog/${post.slug.current}` },
    // Page-level openGraph/twitter replace the layout's objects, so siteName
    // and the @ThinkTony handles are repeated here.
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "Tony Greenberg",
      url: `/blog/${post.slug.current}`,
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      authors: [post.author?.name || "Tony Greenberg"],
      section: post.category?.title,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@ThinkTony",
      creator: "@ThinkTony",
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  type RelatedPost = NonNullable<Awaited<ReturnType<typeof getPost>>>;
  const curatedPath = READING_PATHS[post.slug.current];
  let relatedPosts: RelatedPost[];
  let reasonBySlug: Record<string, string> = {};

  if (curatedPath?.length) {
    const curatedPosts = await sanityFetch<RelatedPost[]>({
      query: postsForReadingPathQuery,
      params: { slugs: curatedPath.map((c) => c.slug) },
      tags: ["post"],
    });
    const bySlug = new Map(curatedPosts.map((p) => [p.slug.current, p]));
    relatedPosts = curatedPath.map((c) => bySlug.get(c.slug)).filter((p): p is RelatedPost => Boolean(p));
    reasonBySlug = Object.fromEntries(curatedPath.map((c) => [c.slug, c.reason]));
  } else {
    const categorySlug = post.category?.slug.current;
    const related = categorySlug
      ? await sanityFetch<RelatedPost[]>({
          query: relatedPostsQuery,
          params: { slug, categoryId: `category-${categorySlug}` },
          tags: ["post"],
        })
      : [];
    const fallbackRelated = related.length
      ? []
      : await sanityFetch<RelatedPost[]>({ query: recentPostsQuery, params: { slug }, tags: ["post"] });
    relatedPosts = related.length ? related : fallbackRelated;
  }

  const seriesInfo = getSeriesForPost(post.slug.current);
  const seriesTitles = seriesInfo
    ? await sanityFetch<{ title: string; slug: string }[]>({
        query: postsBySlugsQuery,
        params: { slugs: seriesInfo.series.posts },
        tags: ["post"],
      })
    : [];
  const seriesTitlesBySlug = Object.fromEntries(seriesTitles.map((p) => [p.slug, p.title]));

  const date = formatPostDate(post.publishedAt);

  const articleJsonLd = getArticleJsonLd({
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    publishedAt: post.publishedAt,
    updatedAt: post._updatedAt,
    heroImage: post.heroImage,
    authorName: post.author?.name,
    authorAvatar: post.author?.avatar,
    section: post.category?.title,
  });

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <TrackLastBlogVisit slug={post.slug.current} title={post.title} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getPostBreadcrumbJsonLd(post)) }}
      />
      <header className="mb-6">
        {post.category && (
          <Link
            href={`/blog/category/${post.category.slug.current}`}
            className="inline-flex items-center font-mono text-xs uppercase tracking-wide text-brand-gold hover:text-brand-gold-light min-h-11 md:min-h-6"
          >
            {post.category.title}
          </Link>
        )}
        <h1 className="mt-2 font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          {post.title}
        </h1>
        {post.subtitle && <p className="mt-3 text-lg text-muted-foreground">{post.subtitle}</p>}
        <div className="mt-4 flex items-center gap-2 font-mono text-xs text-muted-foreground">
          {post.author && <span>{post.author.name}</span>}
          <span aria-hidden="true">&bull;</span>
          <time dateTime={post.publishedAt}>{date}</time>
          {post.readTime && (
            <>
              <span aria-hidden="true">&bull;</span>
              <span>{post.readTime} min read</span>
            </>
          )}
        </div>
        <PostHeaderExtras slug={post.slug.current} />
        {post.excerpt && <p className="mt-5 text-base leading-relaxed text-foreground/80 italic">{post.excerpt}</p>}
      </header>

      <BlogShareBar path={`/blog/${post.slug.current}`} title={post.title} />

      <div className="relative mb-8 aspect-video overflow-hidden rounded-lg">
        <Image
          src={post.heroImage ? urlFor(post.heroImage).width(1600).height(900).url() : DEFAULT_OG_IMAGE}
          alt={post.title}
          fill
          fetchPriority="high"
          loading="eager"
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>

      {post.pullQuote && (
        <blockquote className="mb-8 border-y border-border py-6 text-center font-heading text-xl italic text-foreground">
          {post.pullQuote}
        </blockquote>
      )}

      <BeforeYouRead slug={post.slug.current} />

      {/* portable-text.tsx hand-styles every block/mark directly (no
          @tailwindcss/typography dependency) — .article-body only exists
          to scope the drop-cap selector in globals.css. */}
      <div className="article-body text-foreground">
        <PortableText value={autoLinkBody(legacyBodyLayout(post.body, post._createdAt, post.title))} components={portableTextComponents} />
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-3 py-1 font-mono text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {post.category && (
        <Link
          href={`/blog/category/${post.category.slug.current}`}
          className="mt-8 inline-flex min-h-11 items-center gap-1.5 font-mono text-xs tracking-wide text-brand-gold uppercase hover:text-brand-gold-light"
        >
          More in {post.category.title}
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      )}

      <PostLessonBlocks slug={post.slug.current} category={post.category?.title} />

      {relatedPosts.length > 0 && (
        <section className="mt-14 border-t border-border pt-10">
          <h2 className="mb-5 font-heading text-xl font-bold text-foreground">Read next</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {relatedPosts.slice(0, 3).map((p) => (
              <div key={p._id}>
                <PostCard
                  post={{
                    _id: p._id,
                    title: p.title,
                    slug: p.slug,
                    publishedAt: p.publishedAt,
                    excerpt: p.excerpt,
                    heroImage: p.heroImage,
                  }}
                />
                {reasonBySlug[p.slug.current] && (
                  <p className="mt-2 text-sm text-muted-foreground italic">{reasonBySlug[p.slug.current]}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <ArticleFooter slug={post.slug.current} />

      <SeriesReadingList slug={post.slug.current} titlesBySlug={seriesTitlesBySlug} />

      <AiSummaryLinks
        className="mt-14 border-t border-border pt-10"
        heading="Request an AI summary of this essay"
        prompt={`Please read and summarize this essay by Tony Greenberg: ${SITE_URL}/blog/${post.slug.current}`}
      />
    </article>
  );
}
