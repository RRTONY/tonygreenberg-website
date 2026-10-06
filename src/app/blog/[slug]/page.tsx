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
  postsBySlugsQuery,
} from "@/lib/sanity/queries";
import { DEFAULT_ESSAY_HERO, DEFAULT_OG_IMAGE } from "@/lib/content/default-image";
import { urlFor } from "@/lib/sanity/image";
import { PortableText, portableTextComponents } from "@/lib/sanity/portable-text";
import { legacyBodyLayout } from "@/lib/sanity/legacy-body";
import { autoLinkBody } from "@/lib/sanity/auto-link-body";
import { AiSummaryLinks, SITE_URL } from "@/components/ai-summary-links";
import { ArticleFooter, type ArticleFooterData } from "@/components/blog/article-footer";
import { BlogShareBar } from "@/components/blog/blog-share-bar";
import { TrackLastBlogVisit } from "@/components/blog/track-last-blog-visit";
import { BeforeYouRead, PostLessonBlocks, SeriesReadingList, type EssayExtras } from "@/components/blog/post-extras";
import { ORIGINAL_URLS, POST_ORDER } from "@/lib/content/post-order";
import { essayBody } from "@/lib/sanity/essay-body";
import { essayFontVariables } from "@/lib/fonts/essay-fonts";
import { ArticleToc } from "@/components/blog/article-toc";
import { MirrorReflection } from "@/components/blog/mirror-reflection";
import { PostNotes } from "@/components/blog/post-notes";
import { ElixirCollection } from "@/components/blog/elixir-collection";
import { EssayVersionPanel, EssayVersionToc, EssayVersionToggle } from "@/components/blog/essay-version";
import { PostClosing, PostCtas, ThreadContinues, type ThreadPost } from "@/components/blog/post-closing";
import { QuickReaction, PostVerdict } from "@/components/blog/engagement/post-reactions";
import { PostComments } from "@/components/blog/engagement/post-comments";
import { RateThisThinking } from "@/components/blog/engagement/rate-this-thinking";
import { MicroCommitment } from "@/components/blog/engagement/micro-commitment";
import { AskTonyDialog } from "@/components/blog/engagement/ask-tony-dialog";
import { getSeriesForPost } from "@/lib/content/essay-series";
import { getArticleJsonLd, getPostBreadcrumbJsonLd } from "@/lib/structured-data";
import { formatPostDate } from "@/lib/format-post-date";
import { hasUnlocked, isGatedPost } from "@/lib/gated-posts";
import { PostPasswordGate } from "@/components/blog/post-password-gate";
import { HighlightSaveButton } from "@/components/blog/highlight-save-button";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
  readNext?: { reason?: string; post: ThreadPost }[];
  updatedBody?: Parameters<typeof PortableText>[0]["value"];
  byline?: string;
  editorsNote?: { label?: string; text?: string; provenance?: string };
  provenanceNote?: boolean;
  videoMoment?: { caption?: string; url?: string; mimeType?: string };
} & EssayExtras &
  ArticleFooterData;

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
  // A password-protected essay stays out of search results and its share
  // previews say nothing about its contents.
  if (isGatedPost(post.slug.current)) {
    return {
      title,
      description: "This essay is password-protected.",
      robots: { index: false, follow: false },
      alternates: { canonical: `/blog/${post.slug.current}` },
    };
  }
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

// Live's format-tag badge colors (legacy BlogPost.tsx formatColors), one full
// class string each; anything else gets live's fallback (#333).
const FORMAT_BADGE: Record<string, string> = {
  "the crusade": "bg-[#8B0000]",
  "the field report": "bg-[#2E8B57]",
  "the systems map": "bg-[#4682B4]",
  "the lesson": "bg-[#5C4033]",
  "the manifesto": "bg-[#6A5ACD]",
  "the review": "bg-[#836311]",
  "the reckoning": "bg-[#9B2335]",
  "the dispatch": "bg-[#1a1a1a]",
  "the framework": "bg-[#2F4F4F]",
};

function validityDotClass(value: number | string) {
  const score = Number(value);
  if (score >= 90) return "bg-[#2E8B57]";
  if (score >= 75) return "bg-[#4682B4]";
  if (score >= 60) return "bg-[#B8860B]";
  return "bg-[#8B0000]";
}

const ARTICLE_BODY_CLASS =
  "article-body relative text-foreground lg:before:absolute lg:before:inset-y-2 lg:before:-left-8 lg:before:w-px lg:before:bg-essay-red/35 lg:before:content-['']";

// Legacy's reading time: words / 230, at least 1.
function readingMinutes(body: unknown): number {
  if (!Array.isArray(body)) return 1;
  const words = (body as { children?: { text?: string }[] }[])
    .flatMap((b) => b.children ?? [])
    .map((c) => c.text ?? "")
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 230));
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  // Password-protected essays render only the lock screen until unlocked, so
  // the body never reaches the HTML without the password.
  if (isGatedPost(post.slug.current) && !(await hasUnlocked(post.slug.current))) {
    return <PostPasswordGate slug={post.slug.current} />;
  }

  // "The thread continues": the post's hand-picked "read next" essays in
  // Sanity, or else recent essays from the same category.
  let relatedPosts: ThreadPost[];
  let reasonBySlug: Record<string, string> = {};

  if (post.readNext?.length) {
    relatedPosts = post.readNext.map((r) => r.post);
    reasonBySlug = Object.fromEntries(post.readNext.map((r) => [r.post.slug.current, r.reason ?? ""]));
  } else {
    const categorySlug = post.category?.slug.current;
    const related = categorySlug
      ? await sanityFetch<ThreadPost[]>({
          query: relatedPostsQuery,
          params: { slug, categoryId: `category-${categorySlug}` },
          tags: ["post"],
        })
      : [];
    const fallbackRelated = related.length
      ? []
      : await sanityFetch<ThreadPost[]>({ query: recentPostsQuery, params: { slug }, tags: ["post"] });
    relatedPosts = related.length ? related : fallbackRelated;
    // Legacy's label for same-category picks.
    reasonBySlug = Object.fromEntries(relatedPosts.map((p) => [p.slug.current, "More from this collection"]));
  }

  // Previous / Next: within the series when the post is in one, otherwise
  // legacy's editorial order, skipping posts that aren't in Sanity.
  const seriesInfo = getSeriesForPost(post.slug.current);
  const order = seriesInfo ? seriesInfo.series.posts : POST_ORDER;
  const at = order.indexOf(post.slug.current);
  const before = at > 0 ? order.slice(Math.max(0, at - 3), at).reverse() : [];
  const after = at >= 0 ? order.slice(at + 1, at + 4) : [];
  const navAndSeries = await sanityFetch<{ title: string; slug: string }[]>({
    query: postsBySlugsQuery,
    params: { slugs: [...new Set([...before, ...after, ...(seriesInfo?.series.posts ?? [])])] },
    tags: ["post"],
  });
  const titleBySlug = Object.fromEntries(navAndSeries.map((p) => [p.slug, p.title]));
  const pick = (slugs: string[]) => {
    const s = slugs.find((x) => titleBySlug[x]);
    return s ? { slug: s, title: titleBySlug[s] } : null;
  };
  const prevPost = pick(before);
  const nextPost = pick(after);

  const date = formatPostDate(post.publishedAt);
  const extras: EssayExtras = post;
  const minutes = post.readTime || readingMinutes(post.body);
  const { body, toc } = essayBody(autoLinkBody(legacyBodyLayout(post.body, post._createdAt, post.title)));
  const updated = Array.isArray(post.updatedBody) && post.updatedBody.length > 0
    ? essayBody(autoLinkBody(legacyBodyLayout(post.updatedBody, post._createdAt, post.title)), "updated-")
    : null;
  const heroSrc = post.heroImage ? urlFor(post.heroImage).width(2000).height(900).url() : DEFAULT_ESSAY_HERO.src;

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
    <div className={essayFontVariables}>
      <TrackLastBlogVisit slug={post.slug.current} title={post.title} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getPostBreadcrumbJsonLd(post)) }} />

      {/* Live's hero: the post's picture full width (or live's default arch
          art), the title over it at the bottom. */}
      <header className="relative min-h-80 overflow-hidden bg-[#0a0a0a] sm:h-[50vh] sm:max-h-150">
        <Image
          src={heroSrc}
          alt={post.title}
          fill
          fetchPriority="high"
          loading="eager"
          sizes="100vw"
          className="object-cover object-[center_40%]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 via-50% to-transparent" />
        <div className="absolute inset-x-6 bottom-8 sm:inset-x-12">
          <h1 className="max-w-5xl font-fraunces text-[1.8rem] leading-[1.1] font-black text-white text-shadow-[0_2px_20px_rgba(0,0,0,0.5)] sm:text-[2.5rem] lg:text-5xl">
            {post.title}
          </h1>
          {post.subtitle && <p className="mt-3 max-w-3xl text-lg text-white/85">{post.subtitle}</p>}
        </div>
      </header>

      <div className="mx-auto flex max-w-320 items-start gap-10 xl:pr-8">
        <article className="w-full min-w-0 flex-1 px-4 pt-10 pb-12 sm:px-8">
          <Link
            href="/blog"
            className="mb-2 inline-flex min-h-11 items-center gap-1.5 font-mono text-xs tracking-widest text-muted-foreground uppercase no-underline hover:text-foreground md:min-h-6"
          >
            <ArrowLeft aria-hidden="true" className="size-3" />
            Back to the blog
          </Link>

          <div className="mb-1 flex flex-wrap items-center gap-2">
            {extras?.formatTag && (
              <span
                className={`rounded-xs px-2.5 py-1 font-mono text-xs tracking-[0.12em] text-white uppercase ${FORMAT_BADGE[extras.formatTag.toLowerCase()] ?? "bg-[#333]"}`}
              >
                {extras.formatTag}
              </span>
            )}
            <span className="font-mono text-xs leading-relaxed tracking-[0.06em] text-muted-foreground">
              <time dateTime={post.publishedAt} className="whitespace-nowrap">
                {date}
              </time>
              {post.category && (
                <>
                  <span aria-hidden="true" className="mx-1">
                    ·
                  </span>
                  <Link href={`/blog/category/${post.category.slug.current}`} className="whitespace-nowrap hover:text-brand-gold">
                    {post.category.title}
                  </Link>
                </>
              )}
              <span aria-hidden="true" className="mx-1">
                ·
              </span>
              <span className="whitespace-nowrap">{minutes} min read</span>
            </span>
          </div>
          {extras?.validityScore && (
            <p className="mb-1 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <span aria-hidden="true" className={`inline-block size-1.75 rounded-full ${validityDotClass(extras.validityScore)}`} />
              Validity: {extras.validityScore} — {extras.validityLabel}
            </p>
          )}
          {seriesInfo && (
            <p className="mb-1 inline-flex items-center gap-2 rounded-xs border border-foreground/10 bg-foreground/4 px-3 py-1.5 font-mono text-xs">
              <span className="font-semibold tracking-[0.08em] text-foreground uppercase">{seriesInfo.series.title}</span>
              <span className="text-muted-foreground">
                Part {seriesInfo.part} of {seriesInfo.total}
              </span>
            </p>
          )}
          <p className="mb-3 border-b border-foreground/6 pb-3 font-mono text-xs tracking-[0.06em] text-muted-foreground">
            By{" "}
            <a href="https://linkedin.com/in/tonygreenberg" target="_blank" rel="noopener noreferrer" className="text-foreground no-underline">
              {post.byline || 'Tony "WhyNot" Greenberg'}
            </a>
          </p>
          <PostNotes editorsNote={post.editorsNote} provenanceNote={post.provenanceNote} />
          {post.excerpt && (
            <p className="mb-4 max-w-170 border-l-2 border-essay-brown/35 pl-4 font-fell text-[1.05rem] leading-[1.8] text-essay-sepia italic sm:text-[1.12rem]">
              {post.excerpt}
            </p>
          )}

          {updated && <EssayVersionToggle slug={post.slug.current} />}

          <BlogShareBar path={`/blog/${post.slug.current}`} title={post.title} />

          <div className="max-w-195">
            <BeforeYouRead riddle={post.beforeYouRead} />

            {/* portable-text.tsx styles every block; .article-body scopes the
                drop cap (globals.css) and the Save Highlight selection. The
                thin red rule down the left edge is live's. */}
            {updated ? (
              <>
                <EssayVersionPanel slug={post.slug.current} version="original">
                  <div className={ARTICLE_BODY_CLASS}>
                    <PortableText value={body} components={portableTextComponents} />
                  </div>
                </EssayVersionPanel>
                <EssayVersionPanel slug={post.slug.current} version="updated">
                  <div className={ARTICLE_BODY_CLASS}>
                    <PortableText value={updated.body} components={portableTextComponents} />
                  </div>
                </EssayVersionPanel>
              </>
            ) : (
              <div className={ARTICLE_BODY_CLASS}>
                <PortableText value={body} components={portableTextComponents} />
              </div>
            )}
            <HighlightSaveButton postSlug={post.slug.current} />

            <div aria-hidden="true" className="my-10 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-linear-to-r from-transparent to-essay-brown/35" />
              <span className="text-xs tracking-[0.4em] text-essay-brown/50">· · ·</span>
              <span className="h-px w-12 bg-linear-to-l from-transparent to-essay-brown/35" />
            </div>

            <PostLessonBlocks
              extras={post}
              category={post.category?.title}
              afterNextSteps={post.slug.current === "elixir-of-life-device-and-journey" ? <ElixirCollection /> : null}
            />

            {post.tags && post.tags.length > 0 && (
              <ul aria-label="Tags" className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag} className="rounded-xs bg-muted px-2.5 py-1 font-mono text-xs text-muted-foreground">
                    #{tag}
                  </li>
                ))}
              </ul>
            )}

            {post.category && (
              <Link
                href={`/blog/category/${post.category.slug.current}`}
                className="mt-6 mb-6 inline-flex min-h-11 items-center gap-1.5 font-mono text-xs tracking-wide text-brand-gold uppercase hover:text-brand-gold-light"
              >
                More in {post.category.title}
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </Link>
            )}

            <QuickReaction slug={post.slug.current} />
            {post.videoMoment?.url && (
              <figure className="my-8">
                {/* Legacy ArticleVideo: plays inline, loads only its first frame up front. */}
                <video
                  controls
                  playsInline
                  preload="metadata"
                  className="max-h-[80vh] w-full rounded-md bg-black"
                  aria-label={post.videoMoment.caption || "Video"}
                >
                  <source src={post.videoMoment.url} type={post.videoMoment.mimeType === "video/quicktime" ? "video/mp4" : post.videoMoment.mimeType} />
                </video>
                {post.videoMoment.caption && (
                  <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">{post.videoMoment.caption}</figcaption>
                )}
              </figure>
            )}
            <AskTonyDialog slug={post.slug.current} title={post.title} />
            <PostComments slug={post.slug.current} title={post.title} />
            <PostVerdict slug={post.slug.current} />
            <RateThisThinking slug={post.slug.current} topic={(post.category?.title ?? "this").toLowerCase()} />
            <PostCtas />
            <MirrorReflection slug={post.slug.current} />

            <ArticleFooter data={post} />
            <SeriesReadingList slug={post.slug.current} titlesBySlug={titleBySlug} />

            <PostClosing originalUrl={ORIGINAL_URLS[post.slug.current]} prev={prevPost} next={nextPost} />

            <AiSummaryLinks
              className="mt-14 border-t border-border pt-10"
              heading="Request an AI summary of this essay"
              prompt={`Please read and summarize this essay by Tony Greenberg: ${SITE_URL}/blog/${post.slug.current}`}
            />
          </div>
        </article>
        {updated ? (
          <EssayVersionToc slug={post.slug.current} original={toc} updated={updated.toc} />
        ) : (
          <ArticleToc headings={toc} />
        )}
      </div>

      <ThreadContinues posts={relatedPosts.slice(0, 3)} reasons={reasonBySlug} />
      <div className="px-4">
        <MicroCommitment slug={post.slug.current} />
      </div>
    </div>
  );
}
