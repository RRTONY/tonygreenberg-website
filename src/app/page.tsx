import type { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import { allPostsForArchiveQuery } from "@/lib/sanity/queries";
import { HomeHero } from "@/components/marketing/home-hero";
import { FourDoors } from "@/components/marketing/four-doors";
import { BrewSoulHomeSection } from "@/components/marketing/brewsoul-home-section";
import { HOME_DOORS } from "@/lib/content/home-doors";
import { EditorPicksSection } from "@/components/marketing/editor-picks-section";
import { GemSparkStrip } from "@/components/marketing/gem-spark-strip";
import { CoreThemes } from "@/components/marketing/core-themes";
import { EcosystemCTA } from "@/components/marketing/ecosystem-cta";
import { HomeArchive } from "@/components/blog/home-archive";
import { RecentUpdates } from "@/components/marketing/recent-updates";
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
  // A page-level openGraph replaces the layout's whole openGraph object, so
  // type and siteName are repeated here.
  openGraph: {
    type: "website",
    siteName: "Tony Greenberg",
    title: "Tony Greenberg | Strategist, Author & Systems Thinker",
    description:
      "Tony Greenberg — strategist, author, and systems thinker. 25 years exposing broken systems and building replacements. Essays on business, AI, trust, and culture.",
    url: "/",
    // Cropped to the standard 1200x630 social card size and served as JPEG
    // (the source is 1200x670 WebP, which some link previews crop or skip).
    images: [
      {
        url: "https://cdn.sanity.io/images/a3q1cyqs/production/4b0c5b229fd4f51c9134a30943d369cadbceab70-1200x670.webp?w=1200&h=630&fit=crop&fm=jpg",
        width: 1200,
        height: 630,
        alt: "Kintsugi bowl mended with gold, on a windowsill at sunset",
      },
    ],
  },
};

type Post = Parameters<typeof HomeArchive>[0]["posts"][number];

export default async function Home() {
  const posts = await sanityFetch<Post[]>({ query: allPostsForArchiveQuery, tags: ["post"] });
  const categoryCounts: Record<string, number> = {};
  for (const p of posts) {
    if (p.category) categoryCounts[p.category.slug] = (categoryCounts[p.category.slug] ?? 0) + 1;
  }

  return (
    <div>
      <ReturningVisitorHero />
      <HomeHero essayCount={posts.length} />

      <section className="bg-[#0E0C09] px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-250">
          <div className="mb-6 text-center">
            <div className="mb-2 font-mono text-xs tracking-[0.2em] text-brand-gold-light/70 uppercase">
              Four Doors
            </div>
            <h2 className="font-heading text-[1.6rem] font-normal text-white sm:text-[2.2rem]">
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

      <div className="mx-auto max-w-7xl px-4 sm:px-14">
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

      <RecentUpdates
        posts={posts.map(({ _id, title, slug, publishedAt, excerpt, category }) => ({
          _id,
          title,
          slug,
          publishedAt,
          excerpt,
          category,
        }))}
      />

      <div className="border-y border-brand-gold/10 px-4 py-6 text-center sm:px-6">
        <p className="mx-auto max-w-lg text-sm text-muted-foreground italic">
          A platform for ideas and tools that help people make better decisions about identity,
          relationships, and assets.
        </p>
      </div>

      <CoreThemes categoryCounts={categoryCounts} />

      <BrewSoulHomeSection />

      <EcosystemCTA essayCount={posts.length} />

      <HomeArchive posts={posts} />
      <NewsletterPopup />
    </div>
  );
}
