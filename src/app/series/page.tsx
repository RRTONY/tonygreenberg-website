import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/lib/sanity/client";
import { postsBySlugsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

// Ported from legacy client/src/pages/Series.tsx ("The Collections") +
// client/src/data/seriesData.ts. Real content kept as-is (12 real curated
// essay series, all real post slugs). Episode titles/images now come live
// from Sanity instead of the legacy blogData.json import. The legacy
// "Search All Essays" next-page link pointed at "/the-index", a route that
// doesn't exist anywhere in this app or its nav — redirected to "/search"
// instead, which is this app's actual planned search page and matches the
// link's own label.

export const metadata: Metadata = {
  title: "Series",
  description:
    "Curated essay collections — multi-part investigations into blockchain, trust, communication, and the future of business.",
  alternates: { canonical: "/series" },
};

type SeriesDef = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  posts: string[];
  category: string;
};

const SERIES: SeriesDef[] = [
  { id: "blockchain-arc", title: "The Blockchain Papers", subtitle: "From history to enterprise to the DAO", description: "A five-part investigation into blockchain's real potential — from its historical roots through enterprise adoption to the philosophical implications of decentralized governance.", posts: ["a-historical-perspective-on-blockchain", "what-solutions-are-best-built-with-blockchain", "enterprise-blockchain-can-big-business-co-opt", "the-ball-and-blockchain-decentralization", "the-way-of-dao"], category: "Systems & Innovation" },
  { id: "trust-series", title: "The Trust Trilogy", subtitle: "Why trust is the only currency that compounds", description: "Three essays exploring trust as the foundation of business, relationships, and service — from vendor negotiation to customer loyalty to the arithmetic of human connection.", posts: ["only-time-buys-trust", "why-good-service-is-all-about-trust", "the-arithmetic-of-relationships"], category: "Culture & Communication" },
  { id: "buyer-seller", title: "The Buyer's Playbook", subtitle: "A three-part guide to smarter enterprise procurement", description: "From identifying the real challenges in IT buying to mastering vendor negotiation, this series maps the entire procurement landscape with 25 years of benchmarking data.", posts: ["it-challenges-buyers-are-ok-are-you-sure-part-1", "so-now-that-we-admit-we-have-a-problem-part-2", "fast-growth-companies-likely-to-fall-part-3"], category: "Business & Capital" },
  { id: "honesty-dance", title: "The Honesty Dance", subtitle: "When buyers and sellers stop pretending", description: "A two-part examination of the delicate choreography between buyers and sellers — the games, the tells, and what happens when both sides decide to be honest.", posts: ["the-buyers-and-sellers-honesty-dance-1", "the-buyers-sellers-honesty-dance-2"], category: "Business & Capital" },
  { id: "communication-decay", title: "The Decay of Communication", subtitle: "How we lost the ability to talk to each other", description: "From the death of professional phone calls to the erosion of clear speech, this series tracks the systematic breakdown of human communication in the digital age.", posts: ["the-decay-of-modern-day-communication", "the-decay-of-professional-phone-calls", "6-act-of-speech-speaking-as-a-tool", "clear-communication"], category: "Culture & Communication" },
  { id: "transhuman", title: "The Transhuman Question", subtitle: "What happens when technology outpaces humanity", description: "From Kurzweil at Harvard to the service markets of the transhuman era — a deep dive into what happens when the machines get smarter than us, and whether that's the right question.", posts: ["boiling-the-human-summit-harvard-kurzweil", "greenberg-kurzweil-scientist-foundation-of-trust", "building-services-market-transhuman-era", "human-operating-system"], category: "Systems & Innovation" },
  { id: "streaming-wars", title: "The Streaming Wars", subtitle: "Hollywood's battle with its own offspring", description: "The fight over Hulu, the death of the buggy whip, and the walled garden — three essays tracking how entertainment distribution ate itself.", posts: ["jumping-through-hoops-with-hulu-will-hollywood-kill-their-offspring-again", "amazon-trumps-all-other-suitors-quest-hulu", "break-buggy-whip-now-tipping-for-streaming-video"], category: "Systems & Innovation" },
  { id: "crusades", title: "The Crusades", subtitle: "When companies betray their customers", description: "Seven investigations into corporate betrayal — from fitness fraud to hidden fees to the death of customer loyalty. These are the stories companies don't want told.", posts: ["how-to-alienate-a-loyal-vegan", "luz-lounge-where-loyalty-goes-to-die-groupon", "trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud", "dmn8-the-most-beautiful-crooked-gym-in-the-world", "bread-stuck-with-no-customer-service", "forward-health-is-a-sideway-step-at-best", "hiding-fees-tips-in-the-transparent-age"], category: "The Crusades" },
  { id: "wine-journey", title: "The Wine Papers", subtitle: "Trust, taste, and the tongue", description: "Three essays on wine as a lens for understanding trust, expertise, and the courage to trust your own palate over the critics.", posts: ["trust-tongue-bottle-wine", "points-pointless-only-wine-expert-matters", "surfing-wwc-worldwide-wine-club"], category: "Living Well" },
  { id: "ethical-economics", title: "The Ethics of Economics", subtitle: "When doing good and doing well collide", description: "From the triple bottom line to the tug-of-war between ethics and economics — four essays on whether capitalism can serve consciousness.", posts: ["the-tug-of-war-ethical-vs-economic-decisions", "eco-vegan-realities-seriesethical-economic", "return-on-investment-going-green-going-green-2", "triple-bottom-line-of-soul-gregory-markel"], category: "Impact & Purpose" },
  { id: "molecule-mirror", title: "The Molecule as Mirror", subtitle: "From substance to service — an 11-part investigation", description: "What if every substance you ever reached for was a message from your future self? This series traces the arc from Freud and Jung through the new cartographers of consciousness — Maté, Lembke, van der Kolk, Carhart-Harris — to map what each molecule reveals about the life waiting on the other side.", posts: ["molecule-as-mirror-1-three-rooms-one-longing", "molecule-as-mirror-2-the-old-maps", "molecule-as-mirror-3-the-new-cartographers", "molecule-as-mirror-4-power-and-relief", "molecule-as-mirror-5-escape-and-meaning", "molecule-as-mirror-6-the-pause-protocol", "molecule-as-mirror-7-the-pathway-to-dharma", "molecule-as-mirror-8-resources-and-costs", "molecule-as-mirror-9-a-ceremony-story", "molecule-as-mirror-10-what-the-pioneers-know", "molecule-as-mirror-11-the-doorway"], category: "Living Well" },
];

const CATEGORY_CLASSES: Record<string, { text: string; bg: string }> = {
  "Business & Capital": { text: "text-[#1565C0]", bg: "bg-[#1565C0]/10" },
  "Systems & Innovation": { text: "text-[#7B2D8E]", bg: "bg-[#7B2D8E]/10" },
  "Culture & Communication": { text: "text-[#C75B12]", bg: "bg-[#C75B12]/10" },
  "Living Well": { text: "text-[#2E7D32]", bg: "bg-[#2E7D32]/10" },
  "Impact & Purpose": { text: "text-[#00695C]", bg: "bg-[#00695C]/10" },
  "The Crusades": { text: "text-[#B71C1C]", bg: "bg-[#B71C1C]/10" },
};

type PostLookup = { title: string; slug: string; heroImage?: Parameters<typeof urlFor>[0] };

export default async function SeriesPage() {
  const allSlugs = Array.from(new Set(SERIES.flatMap((s) => s.posts)));
  const postList = await sanityFetch<PostLookup[]>({
    query: postsBySlugsQuery,
    params: { slugs: allSlugs },
    tags: ["post"],
  });
  const postsBySlug = new Map(postList.map((p) => [p.slug, p]));

  return (
    <div>
      <div className="bg-linear-to-b from-background to-secondary px-6 pt-16 pb-10 sm:px-10">
        <Link href="/" className="mb-6 inline-block font-mono text-xs tracking-wide text-brand-gold uppercase">
          ← Back to The Blog
        </Link>
        <p className="mb-2 font-mono text-xs tracking-[0.15em] text-brand-gold uppercase">
          The Collections
        </p>
        <h1 className="mb-4 font-heading text-4xl font-bold text-foreground sm:text-5xl">
          Essay Series
        </h1>
        <p className="max-w-xl text-lg text-foreground/70">
          Some ideas need more than one essay. These are the multi-part investigations — threads
          that weave through blockchain, trust, communication, and the future of business.
        </p>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12 sm:px-10">
        <div className="grid gap-8">
          {SERIES.map((series) => {
            const c = CATEGORY_CLASSES[series.category] ?? { text: "text-brand-gold", bg: "bg-brand-gold/10" };
            const seriesPosts = series.posts
              .map((slug) => postsBySlug.get(slug))
              .filter((p): p is PostLookup => Boolean(p));
            const firstPost = seriesPosts[0];

            return (
              <div
                key={series.id}
                className="grid gap-8 rounded-md border border-border bg-card p-8 transition-shadow hover:shadow-lg sm:grid-cols-[minmax(0,1fr)_240px]"
              >
                <div>
                  <span className={`mb-3 inline-block rounded-sm px-2.5 py-1 font-mono text-xs tracking-wide uppercase ${c.text} ${c.bg}`}>
                    {series.category} · {series.posts.length} Parts
                  </span>
                  <h2 className="mb-1 font-heading text-2xl font-bold text-foreground">
                    {series.title}
                  </h2>
                  <p className="mb-3 text-brand-gold">{series.subtitle}</p>
                  <p className="mb-5 leading-relaxed text-foreground/70">{series.description}</p>

                  <div className="flex flex-col gap-1">
                    {seriesPosts.map((post, i) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="flex items-center gap-2 rounded-sm px-2 py-1.5 transition-colors hover:bg-brand-gold/5"
                      >
                        <span className="min-w-6 font-mono text-xs font-semibold text-muted-foreground">
                          {i + 1}.
                        </span>
                        <span className="text-brand-gold">{post.title}</span>
                      </Link>
                    ))}
                  </div>

                  {seriesPosts[0] && (
                    <Link
                      href={`/blog/${seriesPosts[0].slug}`}
                      className="mt-4 inline-block border-b border-brand-gold-light font-mono text-xs tracking-wide text-brand-gold uppercase"
                    >
                      Start Reading →
                    </Link>
                  )}
                </div>

                {firstPost?.heroImage && (
                  <div className="relative h-50 self-start overflow-hidden rounded-md sm:h-full">
                    <Image
                      src={urlFor(firstPost.heroImage).width(480).url()}
                      alt={series.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border py-6 text-center">
        <Link href="/search" className="font-mono text-sm tracking-wide text-brand-gold">
          Search All Essays →
        </Link>
      </div>
    </div>
  );
}
