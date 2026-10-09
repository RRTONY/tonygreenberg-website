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
import { summarizeArchive, type ArchivePost } from "@/lib/content/essay-archive";
import { RecentUpdates } from "@/components/marketing/recent-updates";
import { pickRecentUpdatePosts } from "@/lib/content/recent-updates";
import { HomeEntityStatement } from "@/components/marketing/home-entity-statement";
import { HomeNewsletterCapture } from "@/components/marketing/home-newsletter-capture";
import { NewsletterPopupLazy } from "@/components/marketing/newsletter-popup-lazy";
import { ReturningVisitorHero } from "@/components/marketing/returning-visitor-hero";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Title and description: the owner's yes (2026-10-10) to the "SEO and UX
// Implementation Pack" (2026-10-05) copy. The essay count is the real number
// of published posts (same query the page renders from, so Next dedupes the
// fetch), not a typed number that goes stale. No `keywords`: Google ignores
// the meta keywords tag, and the pack asked for it to be dropped.
const HOME_TITLE = "Tony Greenberg | Strategist, Author & CEO of RampRate";

export async function generateMetadata(): Promise<Metadata> {
  const posts = await sanityFetch<Post[]>({ query: allPostsForArchiveQuery, tags: ["post"] });
  const description = `Tony Greenberg, CEO of RampRate and founder of ImpactSoul. ${posts.length} essays on enterprise tech, AI, impact investing and trust, plus the BrewSoul coffee scores.`;
  return {
    title: HOME_TITLE,
    description,
    alternates: { canonical: "/" },
    // A page-level openGraph replaces the layout's whole openGraph object, so
    // type and siteName are repeated here.
    openGraph: {
      type: "website",
      siteName: "Tony Greenberg",
      title: HOME_TITLE,
      description,
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
}

type Post = ArchivePost;

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
      <HomeEntityStatement />

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

      <HomeNewsletterCapture />

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
          <ArrowRight aria-hidden="true" className="size-3.5 shrink-0 text-red-800" />
        </Link>
      </div>

      <GemSparkStrip />

      <RecentUpdates posts={pickRecentUpdatePosts(posts)} />

      <div className="border-y border-brand-gold/10 px-4 py-6 text-center sm:px-6">
        <p className="mx-auto max-w-lg text-sm text-muted-foreground italic">
          A platform for ideas and tools that help people make better decisions about identity,
          relationships, and assets.
        </p>
      </div>

      <CoreThemes categoryCounts={categoryCounts} />

      <BrewSoulHomeSection />

      <EcosystemCTA essayCount={posts.length} />

      <HomeArchive archive={summarizeArchive(posts)} />
      <NewsletterPopupLazy />
    </div>
  );
}
