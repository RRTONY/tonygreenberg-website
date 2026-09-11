import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Award,
  BarChart3,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  Globe,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CHARITIES, SCORE_DIMENSIONS } from "@/lib/content/charity-data";
import {
  GradeBadge,
  CloakPanel,
  ScoreBar,
  RadarChart,
} from "@/components/marketing/charity-badges";

// Ported from legacy client/src/pages/CharityProfile.tsx. Real content,
// unchanged. No client-side state at all in the legacy source (purely
// derived from the route param + static data), so this is a full Server
// Component — no "use client" needed anywhere on this page.
export async function generateStaticParams() {
  return CHARITIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: AppPageProps<"/charity-scorecard/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const charity = CHARITIES.find((c) => c.slug === slug);
  if (!charity) return {};
  return {
    title: `${charity.name} — Charity Scorecard`,
    description: `${charity.tagline} Unified impact score: ${charity.totalScore}/100 (${charity.grade}).`,
    alternates: { canonical: `/charity-scorecard/${charity.slug}` },
  };
}

export default async function CharityProfilePage({
  params,
}: AppPageProps<"/charity-scorecard/[slug]">) {
  const { slug } = await params;
  const charity = CHARITIES.find((c) => c.slug === slug);
  if (!charity) notFound();

  const rank = CHARITIES.indexOf(charity) + 1;
  const similar = CHARITIES.filter(
    (c) => c.sector === charity.sector && c.slug !== charity.slug,
  ).slice(0, 5);

  const quickFacts = [
    { icon: TrendingUp, label: "Impact Metric", value: charity.impactMetric },
    { icon: Users, label: "Beneficiaries", value: charity.beneficiaries },
    { icon: DollarSign, label: "Annual Donations", value: `$${charity.donationsM}M` },
    { icon: Calendar, label: "Founded", value: String(charity.founded) },
    { icon: MapPin, label: "Headquarters", value: charity.hq },
    { icon: Globe, label: "Website", value: new URL(charity.website).hostname },
  ];

  return (
    <div>
      <div className="bg-linear-to-br from-[#0A0A10] via-[#14131A] to-[#0A0A10] py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4">
          <Link
            href="/charity-scorecard"
            className="mb-6 flex items-center gap-1.5 text-sm text-[#E8E4DC]/60 transition-colors hover:text-brand-gold"
          >
            <ArrowLeft className="size-4" /> Back to Index
          </Link>

          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex-1">
              <p className="mb-2 font-mono text-xs tracking-[0.3em] text-brand-gold uppercase">
                Rank #{rank} of {CHARITIES.length}
              </p>
              <h1 className="mb-3 font-heading text-3xl font-bold text-[#E8E4DC] md:text-5xl">
                {charity.name}
              </h1>
              <p className="mb-4 text-lg text-[#E8E4DC]/80">{charity.tagline}</p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#E8E4DC]/20 bg-[#E8E4DC]/10 px-2.5 py-1 text-xs text-[#E8E4DC]/70">
                  {charity.sector}
                </span>
                <CloakPanel status={charity.cloakStatus} />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <GradeBadge grade={charity.grade} size="lg" />
              <span className="font-mono text-3xl font-bold text-brand-gold">
                {charity.totalScore}
              </span>
              <span className="text-xs tracking-wide text-[#E8E4DC]/50 uppercase">
                Unified Score
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-bold">
              <BarChart3 className="size-5 text-brand-gold" /> Score Profile
            </h2>
            <div className="mb-6 rounded-lg border border-border bg-card p-6">
              <RadarChart scores={charity.scores} />
            </div>
            <div className="space-y-4">
              {SCORE_DIMENSIONS.map((d) => (
                <ScoreBar
                  key={d.key}
                  score={charity.scores[d.key]}
                  label={d.label}
                  weight={d.weight}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-bold">
                <Globe className="size-5 text-brand-gold" /> Quick Facts
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {quickFacts.map((f) => (
                  <div key={f.label} className="rounded-lg border border-border bg-card p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
                      <f.icon className="size-3.5" />
                      <span className="text-xs">{f.label}</span>
                    </div>
                    <p className="text-sm font-medium">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-bold">
                <Award className="size-5 text-brand-gold" /> External Ratings
              </h2>
              <div className="space-y-3 rounded-lg border border-border bg-card p-4">
                {charity.givewell && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">GiveWell</span>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-bold ${
                        charity.givewell === "top"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {charity.givewell === "top" ? "Top Charity" : "Standout Charity"}
                    </span>
                  </div>
                )}
                {charity.cnStars !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Charity Navigator</span>
                    <span className="text-sm font-bold">{charity.cnStars} / 4 Stars</span>
                  </div>
                )}
                {charity.charityWatch && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CharityWatch</span>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-bold ${
                        charity.charityWatch.startsWith("A")
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {charity.charityWatch}
                    </span>
                  </div>
                )}
                {charity.candidSeal && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Candid Seal</span>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-bold capitalize ${
                        charity.candidSeal === "platinum"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {charity.candidSeal}
                    </span>
                  </div>
                )}
                {!charity.givewell &&
                  charity.cnStars === null &&
                  !charity.charityWatch &&
                  !charity.candidSeal && (
                    <p className="text-sm text-muted-foreground italic">
                      Not rated by major evaluators
                    </p>
                  )}
              </div>
            </div>

            <a href={charity.website} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-brand-gold font-semibold text-white hover:bg-brand-gold-light">
                <ExternalLink className="mr-2 size-4" /> Visit {charity.name}
              </Button>
            </a>
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-12 border-t border-border pt-8">
            <h2 className="mb-4 font-heading text-xl font-bold">
              Other {charity.sector} Charities
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((c) => {
                const cRank = CHARITIES.indexOf(c) + 1;
                return (
                  <Link
                    key={c.slug}
                    href={`/charity-scorecard/${c.slug}`}
                    className="block rounded-lg border border-border bg-card p-4 transition-all hover:border-brand-gold/30 hover:shadow-md"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-mono text-xs text-muted-foreground">#{cRank}</span>
                      <span
                        className={`rounded border px-1.5 py-0.5 font-mono text-xs font-bold ${
                          c.grade.startsWith("A")
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : c.grade.startsWith("B")
                              ? "border-blue-200 bg-blue-50 text-blue-700"
                              : "border-amber-200 bg-amber-50 text-amber-700"
                        }`}
                      >
                        {c.grade}
                      </span>
                    </div>
                    <h3 className="mb-1 text-sm font-semibold">{c.name}</h3>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{c.tagline}</p>
                    <div className="mt-2 font-mono text-sm font-bold text-brand-gold">
                      {c.totalScore}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
