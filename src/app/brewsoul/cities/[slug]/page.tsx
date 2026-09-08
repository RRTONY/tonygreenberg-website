import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CITIES, getCityBySlug } from "@/lib/content/brewsoul-cities";
import { CityDetailTabs, GlassCard, GradeBadge } from "@/components/brewsoul/city-detail-tabs";

// Ported from legacy client/src/pages/brewsoul/BrewSoulCityDetail.tsx —
// real per-city hero, live stats, and verdict for all 25 cities, plus
// the full Best/Worst/Chains/Bridge/Non-Coffee tab breakdown for cities
// with real shop-level data (currently Portland only — see
// `lib/content/brewsoul-cities.ts`'s port note). Server-rendered with
// `generateStaticParams` for all 25 real slugs, this repo's convention
// for a bounded dynamic route. Scroll-linked hero parallax and the
// floating-particle background dropped, same decoration call made
// throughout this migration.
export async function generateStaticParams() {
  return CITIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/brewsoul/cities/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return {};
  return {
    title: `${city.name} Coffee — BrewSoul`,
    description: `${city.name}, ${city.state}: ${city.verdict}`,
    alternates: { canonical: `/brewsoul/cities/${city.slug}` },
  };
}

export default async function BrewSoulCityDetailPage({ params }: PageProps<"/brewsoul/cities/[slug]">) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const hasFullData = city.bestShops.length > 0;

  return (
    <div className="min-h-screen overflow-x-hidden bg-linear-to-b from-[#1a1208] via-[#0f0d08] to-[#0a0806] text-amber-50">
      <section className="relative flex h-[50vh] min-h-100 items-end overflow-hidden">
        <Image src={city.heroImage} alt="" fill sizes="100vw" className="scale-110 object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-[#0a0806] via-[#0a0806]/60 to-transparent" />

        <div className="relative z-1 mx-auto w-full max-w-6xl px-6 pb-8">
          <Link href="/brewsoul/cities" className="mb-4 inline-block text-sm text-amber-400/60 hover:text-amber-400">
            ← All Cities
          </Link>
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-mono text-xs text-amber-500/70">#{city.rank} in America</span>
              </div>
              <h1 className="mb-1 text-4xl font-bold text-amber-50 sm:text-5xl">
                {city.name}
                <span className="ml-2 text-2xl text-amber-200/30">{city.state}</span>
              </h1>
              <p className="text-lg text-amber-200/60 italic">&ldquo;{city.tagline}&rdquo;</p>
            </div>
            <GradeBadge grade={city.grade} size="lg" />
          </div>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
            <div className="text-xl font-bold text-amber-400">{city.stats.totalSpecialtyShops}</div>
            <div className="text-[10px] text-amber-200/40 uppercase">Specialty Shops</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
            <div className="text-xl font-bold text-emerald-400">{city.stats.bestScore}</div>
            <div className="text-[10px] text-amber-200/40 uppercase">Best Score</div>
            <div className="truncate text-[9px] text-amber-200/30">{city.stats.bestShop}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
            <div className="text-xl font-bold text-red-400">{city.stats.worstScore}</div>
            <div className="text-[10px] text-amber-200/40 uppercase">Worst Score</div>
            <div className="truncate text-[9px] text-amber-200/30">{city.stats.worstShop}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
            <div className="text-xl font-bold text-amber-400">${city.stats.avgLattePrice.toFixed(2)}</div>
            <div className="text-[10px] text-amber-200/40 uppercase">Avg Latte</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
            <div className="text-xl font-bold text-amber-400">{city.stats.roastersPer100k}</div>
            <div className="text-[10px] text-amber-200/40 uppercase">Roasters / 100k</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
            <div className="text-xl font-bold text-amber-400">{city.score}</div>
            <div className="text-[10px] text-amber-200/40 uppercase">City Score</div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-8">
        <div className="mx-auto max-w-6xl">
          <GlassCard className="p-6">
            <p className="text-center text-lg leading-relaxed text-amber-200/70 italic">&ldquo;{city.verdict}&rdquo;</p>
          </GlassCard>
        </div>
      </section>

      {hasFullData ? (
        <section className="px-6 pb-16">
          <div className="mx-auto max-w-6xl">
            <CityDetailTabs city={city} />
          </div>
        </section>
      ) : (
        <section className="px-6 pb-16">
          <div className="mx-auto max-w-6xl">
            <GlassCard className="p-12 text-center">
              <h2 className="mb-4 text-2xl font-bold text-amber-50">Full Data Coming Soon</h2>
              <p className="mx-auto mb-6 max-w-lg text-amber-200/60">
                {city.name} is on our scoring schedule. City stats and metadata are live. Best 25, Worst 25, chain report cards, and bridge drinks are being
                compiled.
              </p>
              <Link href="/brewsoul/cities" className="inline-block rounded-xl bg-linear-to-r from-amber-600 to-amber-500 px-6 py-3 font-semibold text-white">
                ← Back to All Cities
              </Link>
            </GlassCard>
          </div>
        </section>
      )}

      <section className="border-t border-white/5 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3">
          <Link href="/brewsoul/cities" className="rounded-lg border border-amber-500/30 px-4 py-2 text-sm text-amber-400">
            ← All Cities
          </Link>
          <Link href="/brewsoul/browse" className="rounded-lg border border-amber-500/30 px-4 py-2 text-sm text-amber-400">
            Browse Catalog
          </Link>
          <Link href="/brewsoul/home" className="rounded-lg border border-amber-500/30 px-4 py-2 text-sm text-amber-400">
            BrewSoul Home
          </Link>
        </div>
      </section>
    </div>
  );
}
