import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { DEFAULT_OG_IMAGE } from "@/lib/content/default-image";
import { formatPostDate } from "@/lib/format-post-date";

type PostCardData = {
  _id: string;
  title: string;
  subtitle?: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  heroImage?: Parameters<typeof urlFor>[0];
  readTime?: number;
  category?: { title: string; slug: { current: string } };
};

// `headingLevel`: h3 under a section heading (the archive, "Read next"); h2
// only where the cards sit directly under the page's H1 (category, search).
// `eager`: set on the first card of a list, which is often the page's
// largest image (LCP), so it isn't lazy-loaded.
export function PostCard({
  post,
  headingLevel = "h3",
  eager = false,
}: {
  post: PostCardData;
  headingLevel?: "h2" | "h3";
  eager?: boolean;
}) {
  const Heading = headingLevel;
  const date = formatPostDate(post.publishedAt);

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg">
      {/* Same destination as the title link below, so it's skipped by keyboard
          and screen readers instead of being a second, unnamed link (axe
          link-name, on posts with no hero image). */}
      <Link
        href={`/blog/${post.slug.current}`}
        aria-hidden="true"
        tabIndex={-1}
        className="relative block aspect-video bg-muted"
      >
        {post.heroImage ? (
          <Image
            src={urlFor(post.heroImage).width(800).height(450).url()}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            {...(eager ? { fetchPriority: "high", loading: "eager" } as const : {})}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Image
            src={DEFAULT_OG_IMAGE}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            {...(eager ? { fetchPriority: "high", loading: "eager" } as const : {})}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {post.category && (
          <Link
            href={`/blog/category/${post.category.slug.current}`}
            className="inline-flex items-center mb-2 font-mono text-[0.68rem] uppercase tracking-wide text-brand-gold hover:text-brand-gold-light min-h-11 md:min-h-6"
          >
            {post.category.title}
          </Link>
        )}
        <Heading className="font-heading text-lg font-bold leading-snug text-foreground">
          <Link href={`/blog/${post.slug.current}`} className="hover:text-brand-gold">
            {post.title}
          </Link>
        </Heading>
        {post.subtitle && (
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{post.subtitle}</p>
        )}
        <div className="mt-auto flex items-center gap-2 pt-4 font-mono text-xs text-muted-foreground">
          {date && <time dateTime={post.publishedAt}>{date}</time>}
          {post.readTime && (
            <>
              <span aria-hidden="true">&bull;</span>
              <span>{post.readTime} min read</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
