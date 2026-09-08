import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { DEFAULT_OG_IMAGE } from "@/lib/content/default-image";

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

export function PostCard({ post }: { post: PostCardData }) {
  const parsedDate = new Date(post.publishedAt);
  const date = Number.isNaN(parsedDate.getTime())
    ? null
    : parsedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg">
      <Link href={`/blog/${post.slug.current}`} className="relative block aspect-video bg-muted">
        {post.heroImage ? (
          <Image
            src={urlFor(post.heroImage).width(800).height(450).url()}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Image
            src={DEFAULT_OG_IMAGE}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {post.category && (
          <Link
            href={`/blog/category/${post.category.slug.current}`}
            className="mb-2 font-mono text-[0.68rem] uppercase tracking-wide text-brand-gold hover:text-brand-gold-light"
          >
            {post.category.title}
          </Link>
        )}
        <h2 className="font-heading text-lg font-bold leading-snug text-foreground">
          <Link href={`/blog/${post.slug.current}`} className="hover:text-brand-gold">
            {post.title}
          </Link>
        </h2>
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
