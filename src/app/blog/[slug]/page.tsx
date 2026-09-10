import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getAllPostSlugs,
  getPostBySlug,
  getPostsBySlugs,
  getRecentPosts,
  getRelatedPosts,
} from "@/lib/content/post-repository";
import { READING_PATHS } from "@/lib/content/reading-paths";
import { DEFAULT_OG_IMAGE } from "@/lib/content/default-image";
import { urlFor } from "@/lib/content/content-image";
import { PortableText, portableTextComponents } from "@/lib/content/portable-text";
import { autoLinkBody } from "@/lib/content/auto-link-body";
import { PostCard } from "@/components/blog/post-card";
import { ArticleFooter } from "@/components/blog/article-footer";
import { BlogShareBar } from "@/components/blog/blog-share-bar";
import { TrackLastBlogVisit } from "@/components/blog/track-last-blog-visit";
import { getArticleJsonLd } from "@/lib/structured-data";

async function getPost(slug: string) {
  return getPostBySlug(slug);
}

export async function generateStaticParams() {
  const posts = await getAllPostSlugs();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
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
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      images: ogImage ? [ogImage] : undefined,
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
    const curatedPosts = await getPostsBySlugs(curatedPath.map((item) => item.slug));
    const bySlug = new Map(curatedPosts.map((p) => [p.slug.current, p]));
    relatedPosts = curatedPath
      .map((c) => bySlug.get(c.slug))
      .filter((p): p is RelatedPost => Boolean(p));
    reasonBySlug = Object.fromEntries(curatedPath.map((c) => [c.slug, c.reason]));
  } else {
    const categorySlug = post.category?.slug.current;
    const related = categorySlug ? await getRelatedPosts(slug, categorySlug) : [];
    const fallbackRelated = related.length ? [] : await getRecentPosts(slug);
    relatedPosts = related.length ? related : fallbackRelated;
  }

  const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const articleJsonLd = getArticleJsonLd({
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    publishedAt: post.publishedAt,
    updatedAt: post._updatedAt,
    heroImage: post.heroImage,
    authorName: post.author?.name,
  });

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <TrackLastBlogVisit slug={post.slug.current} title={post.title} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <header className="mb-6">
        {post.category && (
          <Link
            href={`/blog/category/${post.category.slug.current}`}
            className="font-mono text-xs uppercase tracking-wide text-brand-gold hover:text-brand-gold-light"
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
      </header>

      <BlogShareBar path={`/blog/${post.slug.current}`} title={post.title} />

      <div className="relative mb-8 aspect-video overflow-hidden rounded-lg">
        <Image
          src={
            post.heroImage ? urlFor(post.heroImage).width(1600).height(900).url() : DEFAULT_OG_IMAGE
          }
          alt={post.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>

      {post.pullQuote && (
        <blockquote className="mb-8 border-y border-border py-6 text-center font-heading text-xl italic text-foreground">
          {post.pullQuote}
        </blockquote>
      )}

      {/* portable-text.tsx hand-styles every block/mark directly (no
          @tailwindcss/typography dependency) — .article-body only exists
          to scope the drop-cap selector in globals.css. */}
      <div className="article-body text-foreground">
        <PortableText value={autoLinkBody(post.body)} components={portableTextComponents} />
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
                  <p className="mt-2 text-sm text-muted-foreground italic">
                    {reasonBySlug[p.slug.current]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <ArticleFooter slug={post.slug.current} />
    </article>
  );
}
