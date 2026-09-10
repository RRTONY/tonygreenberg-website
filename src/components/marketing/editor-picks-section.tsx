import Link from "next/link";
import Image from "next/image";
import { getPostsBySlugs } from "@/lib/content/post-repository";
import { urlFor } from "@/lib/content/content-image";
import { EDITOR_PICK_SLUGS } from "@/lib/content/editor-picks";

type Post = {
  title: string;
  slug: string;
  excerpt?: string;
  heroImage?: Parameters<typeof urlFor>[0];
  readTime?: number;
};

function PickCard({ post, size }: { post: Post; size: "large" | "medium" }) {
  const isLarge = size === "large";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group relative block overflow-hidden rounded-md bg-[#111] ${
        isLarge ? "h-[clamp(280px,40vw,420px)]" : "h-[clamp(130px,15vw,195px)]"
      }`}
    >
      {post.heroImage ? (
        <Image
          src={urlFor(post.heroImage)
            .width(isLarge ? 900 : 600)
            .url()}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]" />
      )}
      <div className="absolute inset-0 bg-linear-to-b from-black/10 to-black/65" />
      <span className="absolute top-3 left-3 rounded-sm bg-white/90 px-2.5 py-1 font-mono text-xs tracking-wide text-[#222] uppercase">
        Editor&apos;s Pick
      </span>
      <div className={`absolute inset-x-0 bottom-0 ${isLarge ? "p-6" : "p-3"}`}>
        {post.readTime && (
          <div className="mb-1 font-mono text-xs text-white/70">{post.readTime} min read</div>
        )}
        <h3
          className={`font-heading leading-tight font-bold text-white ${
            isLarge ? "mb-1.5 text-2xl sm:text-3xl" : "text-base"
          }`}
        >
          {post.title}
        </h3>
        {isLarge && post.excerpt && <p className="line-clamp-2 text-white/80">{post.excerpt}</p>}
      </div>
    </Link>
  );
}

export async function EditorPicksSection() {
  const posts = await getPostsBySlugs(EDITOR_PICK_SLUGS);
  const bySlug = new Map(posts.map((post) => [post.slug.current, post]));
  const picks = EDITOR_PICK_SLUGS.flatMap((slug): Post[] => {
    const post = bySlug.get(slug);
    if (!post) return [];
    const pick: Post = {
      slug: post.slug.current,
      title: post.title,
    };
    if (post.excerpt) pick.excerpt = post.excerpt;
    if (post.heroImage) pick.heroImage = post.heroImage;
    if (post.readTime) pick.readTime = post.readTime;
    return [pick];
  });

  if (picks.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-5">
        <h2 className="font-heading text-3xl font-bold text-foreground">Editor&apos;s Picks</h2>
        <p className="text-muted-foreground">The essays that define the mission</p>
        <div className="mt-2 h-0.75 w-10 bg-brand-gold" />
      </div>
      <div className="grid gap-5 md:grid-cols-[1.5fr_1fr]">
        {picks[0] && <PickCard post={picks[0]} size="large" />}
        <div className="flex flex-col gap-5">
          {picks.slice(1, 3).map((post) => (
            <PickCard key={post.slug} post={post} size="medium" />
          ))}
        </div>
      </div>
    </section>
  );
}
