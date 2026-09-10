import { ForwardIcon } from "@/components/ui/inline-icons";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/lib/content/legacy-content-query-adapter";
import { allPostsForArchiveQuery } from "@/lib/content/legacy-content-query-tokens";
import { urlFor } from "@/lib/content/content-image";
import { ARCHETYPES, AUTHORITY_ITEMS, type ArchetypeKey } from "@/lib/content/archetypes";
import { PathSubscribeForm } from "@/components/marketing/path-subscribe-form";

// Ported from legacy client/src/pages/PathPage.tsx — a per-archetype
// landing page reached after `/assessment`'s Builder/Crusader/Investor
// quiz. Reuses `lib/content/archetypes.ts`'s `ARCHETYPES`/`AUTHORITY_ITEMS`
// directly (already ported for `/essays` and `/assessment`) rather than
// re-porting legacy's `data/archetypes.ts` a third time. Legacy's post
// list came from a static `blogData.json` import filtered client-side;
// this fetches the real Sanity corpus via `allPostsForArchiveQuery` (the
// same query `/essays` already uses) and applies the identical
// `arch.categories.includes(post.category.title)` filter + `slice(0, 5)`
// server-side instead, since there's no client interactivity needed for a
// fixed top-5 list. Legacy's `trpc.subscribe.add` email box is now
// `PathSubscribeForm`, a real POST to `/api/subscribe`.
//
// **Real bug fixed**: legacy rendered a hand-rolled "Path not found" div
// with inline styles for any unknown archetype key; replaced with a real
// `notFound()` — this route's `generateStaticParams` only ever produces
// the 3 real keys below, so anything else should actually 404, not render
// a styled dead-end.

type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  heroImage?: Parameters<typeof urlFor>[0];
  category?: { title: string; slug: string };
};

export function generateStaticParams() {
  return (Object.keys(ARCHETYPES) as ArchetypeKey[]).map((archetype) => ({ archetype }));
}

export async function generateMetadata({
  params,
}: PageProps<"/path/[archetype]">): Promise<Metadata> {
  const { archetype } = await params;
  const arch = ARCHETYPES[archetype as ArchetypeKey];
  if (!arch) return {};

  return {
    title: `${arch.name} — Your Reading Path`,
    description: arch.description,
    alternates: { canonical: `/path/${archetype}` },
  };
}

export default async function PathPage({ params }: PageProps<"/path/[archetype]">) {
  const { archetype } = await params;
  const key = archetype as ArchetypeKey;
  const arch = ARCHETYPES[key];
  if (!arch) notFound();

  const posts = await sanityFetch<Post[]>({ query: allPostsForArchiveQuery, tags: ["post"] });
  const essentialReading = posts
    .filter((p) => p.category && arch.categories.includes(p.category.title))
    .slice(0, 5);

  const Icon = arch.icon;

  return (
    <div>
      <div className="bg-foreground py-2.5 text-center">
        <p className="font-mono text-[0.68rem] tracking-[0.15em] text-brand-gold-light uppercase">
          {AUTHORITY_ITEMS.join("  ·  ")}
        </p>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <Icon className="mx-auto mb-4 size-10 text-brand-gold" strokeWidth={1.5} />
        <h1 className="mb-2 font-heading text-[clamp(2rem,5vw,3.25rem)] text-foreground">
          {arch.name}
        </h1>
        <div className="mb-6 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
          {arch.tagline}
        </div>
        <p className="mx-auto max-w-135 text-lg leading-relaxed text-foreground/80">
          {arch.description}
        </p>
      </div>

      <div className="mx-auto max-w-2xl px-6 pb-12">
        <div className="mb-8 text-center font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
          Essential Reading for the {arch.name.replace("The ", "")}s
        </div>

        {essentialReading.length > 0 ? (
          <div className="flex flex-col gap-4">
            {essentialReading.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="flex gap-4 rounded-md border border-border bg-card p-4 transition-colors hover:border-brand-gold/40"
              >
                {post.heroImage && (
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={urlFor(post.heroImage).width(160).height(160).url()}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  {post.category && (
                    <div className="mb-1 font-mono text-[0.65rem] tracking-wide text-brand-gold uppercase">
                      {post.category.title}
                    </div>
                  )}
                  <div className="mb-1.5 font-heading text-[1.05rem] leading-snug text-foreground">
                    {post.title}
                  </div>
                  {post.excerpt && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No essays are filed under this path yet — check back soon.
          </p>
        )}
      </div>

      <div className="pb-10 text-center">
        <Link
          href="/assessment"
          className="inline-block rounded-md bg-brand-gold px-8 py-3.5 font-mono text-xs tracking-[0.15em] text-white uppercase"
        >
          Take the Assessment <ForwardIcon aria-hidden="true" />
        </Link>
      </div>

      <div className="mx-auto max-w-md px-6 pb-10">
        <PathSubscribeForm archetypeKey={key} />
      </div>

      <div className="pb-16 text-center">
        <a
          href="https://impactsoul.is"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs tracking-wide text-brand-gold"
        >
          Explore ImpactSoul <ForwardIcon aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
