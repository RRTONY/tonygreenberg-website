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
} from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { PortableText, portableTextComponents } from "@/lib/sanity/portable-text";
import { PostCard } from "@/components/blog/post-card";
import { getArticleJsonLd } from "@/lib/structured-data";

type PostDetail = {
  _id: string;
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
  author?: { name: string };
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
  const ogImage = ogImageSource ? urlFor(ogImageSource).width(1200).height(630).url() : undefined;

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

  const categorySlug = post.category?.slug.current;
  const related = categorySlug
    ? await sanityFetch<Awaited<ReturnType<typeof getPost>>[]>({
        query: relatedPostsQuery,
        params: { slug, categoryId: post.category ? `category-${categorySlug}` : "" },
        tags: ["post"],
      })
    : [];
  const fallbackRelated = related.length
    ? []
    : await sanityFetch<Awaited<ReturnType<typeof getPost>>[]>({
        query: recentPostsQuery,
        params: { slug },
        tags: ["post"],
      });
  const relatedPosts = (related.length ? related : fallbackRelated).filter(Boolean);

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

      {post.heroImage && (
        <div className="relative mb-8 aspect-video overflow-hidden rounded-lg">
          <Image
            src={urlFor(post.heroImage).width(1600).height(900).url()}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      {post.pullQuote && (
        <blockquote className="mb-8 border-y border-border py-6 text-center font-heading text-xl italic text-foreground">
          {post.pullQuote}
        </blockquote>
      )}

      {/* portable-text.tsx hand-styles every block/mark directly (no
          @tailwindcss/typography dependency) — .article-body only exists
          to scope the drop-cap selector in globals.css. */}
      <div className="article-body text-foreground">
        <PortableText value={post.body} components={portableTextComponents} />
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
            {relatedPosts.slice(0, 3).map(
              (p) =>
                p && (
                  <PostCard
                    key={p._id}
                    post={{
                      _id: p._id,
                      title: p.title,
                      slug: p.slug,
                      publishedAt: p.publishedAt,
                      excerpt: p.excerpt,
                      heroImage: p.heroImage,
                    }}
                  />
                ),
            )}
          </div>
        </section>
      )}
    </article>
  );
}
