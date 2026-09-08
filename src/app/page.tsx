import type { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import { allPostsForArchiveQuery } from "@/lib/sanity/queries";
import { HomeHero } from "@/components/marketing/home-hero";
import { FourDoors } from "@/components/marketing/four-doors";
import { HOME_DOORS } from "@/lib/content/home-doors";
import { EditorPicksSection } from "@/components/marketing/editor-picks-section";
import { GemSparkStrip } from "@/components/marketing/gem-spark-strip";
import { CoreThemes } from "@/components/marketing/core-themes";
import { EcosystemCTA } from "@/components/marketing/ecosystem-cta";
import { HomeArchive } from "@/components/blog/home-archive";
import { PostCard } from "@/components/blog/post-card";
import { NewsletterPopup } from "@/components/marketing/newsletter-popup";
import { ReturningVisitorHero } from "@/components/marketing/returning-visitor-hero";
import Link from "next/link";

// Matches legacy client/src/pages/Blog.tsx's <SEO> block for path="/" — the
// legacy router renders that Blog component at "/" (and, identically, at
// "/blog" — app/blog/page.tsx is its own real page here, reusing the same
// HomeArchive component rather than duplicating this whole file). Home.tsx,
// despite the name, is actually routed at /the-letter, already ported
// separately.
export const metadata: Metadata = {
  title: "Tony Greenberg | Strategist, Author & Systems Thinker",
  description:
    "Tony Greenberg — strategist, author, and systems thinker. 25 years exposing broken systems and building replacements. Essays on business, AI, trust, and culture.",
  keywords: [
    "Tony Greenberg",
    "systems thinking",
    "enterprise strategy",
    "impact investing",
    "AI ethics",
    "trust economy",
    "essays",
    "regenerative capital",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Tony Greenberg | Strategist, Author & Systems Thinker",
    description:
      "Tony Greenberg — strategist, author, and systems thinker. 25 years exposing broken systems and building replacements. Essays on business, AI, trust, and culture.",
    url: "/",
    images: [
      "https://cdn.sanity.io/images/a3q1cyqs/production/4b0c5b229fd4f51c9134a30943d369cadbceab70-1200x670.webp",
    ],
  },
};

type Post = Parameters<typeof HomeArchive>[0]["posts"][number];

export default async function Home({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const theme = typeof params?.theme === "string" ? params.theme : undefined;

  const posts = await sanityFetch<Post[]>({ query: allPostsForArchiveQuery, tags: ["post"] });
  const latest = posts.slice(0, 2);

  return (
    <div>
      <ReturningVisitorHero />
      <HomeHero essayCount={posts.length} />

      <section className="bg-[#0E0C09] px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 text-center">
            <div className="mb-2 font-mono text-xs tracking-[0.2em] text-brand-gold-light/70 uppercase">
              Four Doors
            </div>
            <h2 className="font-heading text-2xl font-normal text-white sm:text-3xl">
              Choose how you want to <em className="text-brand-gold-light not-italic">begin</em>
            </h2>
          </div>
          <FourDoors
            doors={HOME_DOORS.map((d) => ({
              ...d,
              icon: d.icon && <d.icon className="size-10 text-brand-gold" strokeWidth={1.5} />,
            }))}
          />
        </div>
      </section>

      <EditorPicksSection />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Link
          href="/protecting-your-business"
          className="mb-6 inline-flex items-center gap-2 rounded-md border border-red-800/20 bg-red-800/5 px-3.5 py-2"
        >
          <span className="font-mono text-xs font-bold tracking-wide text-red-800 uppercase">
            Case File
          </span>
          <span className="text-sm text-foreground/70">
            She Had Two Theft Convictions. I Hired Her Anyway. She Stole $46,795. — Kristi
            Klawiter, documented.
          </span>
          <span className="font-mono text-xs text-red-800">→</span>
        </Link>
      </div>

      <GemSparkStrip />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-5">
          <h2 className="font-heading text-3xl font-bold text-foreground">Latest Thinking</h2>
          <p className="text-muted-foreground">The most recent dispatches</p>
          <div className="mt-2 h-0.75 w-10 bg-brand-gold" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {latest.map((post) => (
            <PostCard
              key={post._id}
              post={{
                ...post,
                slug: { current: post.slug },
                category: post.category
                  ? { title: post.category.title, slug: { current: post.category.slug } }
                  : undefined,
              }}
            />
          ))}
        </div>
        <div className="py-6 text-center">
          <a
            href="#essays-archive"
            className="border-b border-brand-gold/30 pb-0.5 font-mono text-sm tracking-wide text-brand-gold uppercase"
          >
            View All {posts.length} Essays →
          </a>
        </div>
      </section>

      <div className="border-y border-brand-gold/10 px-4 py-6 text-center sm:px-6">
        <p className="mx-auto max-w-lg text-sm text-muted-foreground italic">
          A platform for ideas and tools that help people make better decisions about identity,
          relationships, and assets.
        </p>
      </div>

      <CoreThemes />

      <EcosystemCTA essayCount={posts.length} />

      <HomeArchive posts={posts} initialTheme={theme} />
      <NewsletterPopup />
    </div>
  );
}
