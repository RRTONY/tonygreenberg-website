"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemedBackground } from "@/components/assessments/themed-background";
import { WhatsNext } from "@/components/assessments/whats-next";
import { AssessmentRadarChart } from "@/components/assessments/radar-chart";
import { AssessmentResultActions } from "@/components/assessments/result-actions";
import { JourneyTracker } from "@/components/assessments/journey-tracker";
import { MIRROR_ARTICLES, MIRROR_DIMENSIONS } from "@/lib/content/mirror-data";
import {
  ACCENT,
  JOURNEY_CONTINUES,
  SATELLITE_SITES,
  SHARE_URL,
  getFlowLabel,
  scoreBarClass,
  scoreTextClass,
  theMirrorData,
} from "../data/the-mirror.data";
import type { StepProps } from "../the-mirror-quiz";
import { postHref } from "@/lib/content/post-redirects";

// Step 4: results. Scoring lives in the hook; the article and satellite-site
// picks (from the three weakest dimensions) and sharing are only used here.
export function StepResults({ quiz, articleTitles }: StepProps) {
  const [showShare, setShowShare] = useState(false);
  const { dimensionScores, overallScore, sortedDims } = quiz;
  const copy = theMirrorData.results;

  const weakest: string[] = sortedDims.slice(0, 3).map((d) => d.id);

  const recommendedArticles: { slug: string; title: string; reflection: string; dimension: string }[] = [];
  for (const [slug, article] of Object.entries(MIRROR_ARTICLES)) {
    if (recommendedArticles.length >= 9) break;
    const title = articleTitles[slug];
    if (weakest.includes(article.dimension) && title) {
      recommendedArticles.push({ slug, title, reflection: article.reflection, dimension: article.dimension });
    }
  }

  const satelliteSites = SATELLITE_SITES.filter((s) => weakest.includes(s.dimension)).slice(0, 4);

  const displayScores: Record<string, number> = {};
  MIRROR_DIMENSIONS.forEach((d) => {
    displayScores[d.name.split(" & ")[0]] = dimensionScores[d.id] ?? 0;
  });

  const handleShare = (platform: "twitter" | "linkedin" | "email" | "copy") => {
    const text = copy.shareText(overallScore);
    if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(SHARE_URL)}`, "_blank");
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`, "_blank");
    } else if (platform === "email") {
      window.open(
        `mailto:?subject=${encodeURIComponent(copy.shareEmailSubject)}&body=${encodeURIComponent(`${text}\n\n${SHARE_URL}`)}`,
        "_blank",
      );
    } else {
      void navigator.clipboard?.writeText(SHARE_URL);
    }
  };

  return (
    <div className="relative z-1 min-h-screen font-sans text-[#2C1810]">
      <ThemedBackground theme="mirror" />

      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <div className="mb-4 font-mono text-[0.6rem] tracking-[0.2em] text-brand-gold uppercase">{copy.eyebrow}</div>
        <h1 className="mb-6 font-heading text-[clamp(2rem,5vw,3rem)] font-normal">{copy.title}</h1>
        <div className="mb-3 flex items-center justify-center gap-3">
          <span className={`font-heading text-[clamp(3rem,8vw,4.5rem)] font-bold ${scoreTextClass(overallScore)}`}>{overallScore}</span>
          <span className="font-mono text-sm text-[#888]">/ 9</span>
        </div>
        <p className="font-mono text-sm tracking-[0.15em] text-brand-gold uppercase">{getFlowLabel(overallScore)}</p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <div className="mb-1 font-mono text-[0.6rem] tracking-[0.2em] text-brand-gold uppercase">{copy.mapEyebrow}</div>
            <h2 className="mb-8 font-heading text-2xl font-normal">{copy.mapTitle}</h2>
            <div className="space-y-4">
              {sortedDims.map((d) => {
                const score = dimensionScores[d.id] ?? 0;
                return (
                  <div key={d.id} className="flex items-center gap-4">
                    <div className="w-32 shrink-0 font-mono text-xs tracking-wider text-[#5A5A52]">{d.name.split(" & ")[0]}</div>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/8">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${scoreBarClass(score)}`}
                        style={{ width: `${(score / 9) * 100}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono text-sm font-semibold">{score}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <AssessmentRadarChart scores={displayScores} max={9} accentColor="#D4B96A" />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <div className="mb-1 font-mono text-[0.6rem] tracking-[0.2em] text-brand-gold uppercase">{copy.insightsEyebrow}</div>
        <h2 className="mb-8 font-heading text-2xl font-normal">{copy.insightsTitle}</h2>
        <div className="space-y-6">
          {sortedDims.map((d) => {
            const score = dimensionScores[d.id] ?? 0;
            const inFlow = score >= 6;
            return (
              <div key={d.id} className="rounded-lg border border-black/8 bg-white/40 p-6">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-heading text-xl font-normal">{d.name}</h3>
                  <span
                    className={`rounded-sm px-3 py-1 font-mono text-xs uppercase ${
                      inFlow ? "bg-emerald-600/10 text-emerald-700" : "bg-amber-600/10 text-amber-700"
                    }`}
                  >
                    {getFlowLabel(score)}
                  </span>
                </div>
                <p className="mb-2 text-sm text-[#5A5A52] italic">{d.description}</p>
                <p className="text-sm text-[#2C1810]">{inFlow ? d.flowState : d.frictionState}</p>
              </div>
            );
          })}
        </div>
      </section>

      {recommendedArticles.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 pb-16">
          <div className="mb-1 font-mono text-[0.6rem] tracking-[0.2em] text-brand-gold uppercase">{copy.readingEyebrow}</div>
          <h2 className="mb-4 font-heading text-2xl font-normal">{copy.readingTitle}</h2>
          <p className="mb-8 text-sm text-[#5A5A52]">{copy.readingBody}</p>
          <div className="space-y-3">
            {recommendedArticles.map((article, i) => {
              const dim = MIRROR_DIMENSIONS.find((d) => d.id === article.dimension);
              return (
                <Link key={article.slug} href={postHref(article.slug)} className="block rounded-lg border border-black/8 bg-white/40 p-5">
                  <div className="flex items-start gap-4">
                    <span className="font-heading text-2xl font-bold text-brand-gold-light/40">{String(i + 1).padStart(2, "0")}</span>
                    <div className="flex-1">
                      <p className="mb-1 font-mono text-xs tracking-wider text-brand-gold">{dim?.name}</p>
                      <h4 className="font-heading text-lg font-normal">{article.title}</h4>
                      <p className="mt-1 text-sm text-[#5A5A52] italic">
                        {copy.readingReflectionPrefix} {article.reflection}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {satelliteSites.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 pb-16">
          <div className="mb-1 font-mono text-[0.6rem] tracking-[0.2em] text-brand-gold uppercase">{copy.deeperEyebrow}</div>
          <h2 className="mb-4 font-heading text-2xl font-normal">{copy.deeperTitle}</h2>
          <p className="mb-8 text-sm text-[#5A5A52]">{copy.deeperBody}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {satelliteSites.map((site) => (
              <a
                key={site.name}
                href={site.url}
                target={site.url.startsWith("/") ? undefined : "_blank"}
                rel={site.url.startsWith("/") ? undefined : "noopener noreferrer"}
                className="rounded-lg border border-black/8 bg-white/40 p-5"
              >
                <p className="mb-2 font-mono text-xs tracking-wider text-brand-gold">
                  {MIRROR_DIMENSIONS.find((d) => d.id === site.dimension)?.name}
                </p>
                <h4 className="font-heading text-lg font-normal">{site.name}</h4>
                <p className="mt-1 text-sm text-[#5A5A52]">{site.desc}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-6 pb-16 text-center">
        <div className="mb-1 font-mono text-[0.6rem] tracking-[0.2em] text-brand-gold uppercase">{copy.shareEyebrow}</div>
        <h2 className="mb-4 font-heading text-2xl font-normal">{copy.shareTitle}</h2>
        <p className="mx-auto mb-8 max-w-xl text-sm text-[#5A5A52]">{copy.shareBody}</p>

        {!showShare ? (
          <button
            type="button"
            onClick={() => setShowShare(true)}
            className="rounded-none border-none bg-linear-to-br from-brand-gold to-brand-gold-light px-8 py-4 font-mono text-sm tracking-wider text-background uppercase"
          >
            {copy.shareButton}
          </button>
        ) : (
          <div className="mx-auto max-w-md space-y-4">
            <div className="rounded-lg bg-[#0A0A10] p-4 text-left">
              <p className="mb-2 font-mono text-xs text-brand-gold-light">{copy.shareLinkLabel}</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  aria-label={copy.shareLinkLabel}
                  value={SHARE_URL}
                  className="flex-1 border-none bg-transparent font-mono text-sm text-[#FAFAF7] outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button type="button" onClick={() => handleShare("copy")} className="bg-brand-gold px-3 py-1 font-mono text-xs text-[#FAFAF7]">
                  {copy.shareCopy}
                </button>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <button type="button" onClick={() => handleShare("twitter")} className="border border-brand-gold/30 px-4 py-2 font-mono text-xs tracking-wider text-brand-gold">
                𝕏 Twitter
              </button>
              <button type="button" onClick={() => handleShare("linkedin")} className="border border-brand-gold/30 px-4 py-2 font-mono text-xs tracking-wider text-brand-gold">
                LinkedIn
              </button>
              <button type="button" onClick={() => handleShare("email")} className="border border-brand-gold/30 px-4 py-2 font-mono text-xs tracking-wider text-brand-gold">
                Email
              </button>
            </div>
            <p className="font-mono text-xs text-[#5A5A52]">
              {copy.shareFooter1}
              <br />
              {copy.shareFooter2}
            </p>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <JourneyTracker variant="light" currentAssessmentId="find-your-mirror" />
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <p className="mb-2 text-center font-mono text-[0.65rem] tracking-[0.25em] text-brand-gold uppercase">{copy.continuesEyebrow}</p>
        <p className="mb-6 text-center text-[0.95rem] leading-relaxed text-[#666]">{copy.continuesBody}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {JOURNEY_CONTINUES.map((next) => (
            <Link key={next.name} href={next.url} className="block rounded-lg border border-black/8 bg-white/40 p-4">
              <div className="mb-1 flex items-start justify-between gap-2">
                <span className="font-heading text-[0.9rem]">{next.name}</span>
                <span className="border border-black/10 px-1.5 py-0.5 font-mono text-[0.5rem] tracking-wide text-brand-gold">{next.badge}</span>
              </div>
              <p className="m-0 text-[0.82rem] leading-relaxed text-[#666]">{next.hook}</p>
            </Link>
          ))}
        </div>
      </section>

      <WhatsNext />

      <section className="mx-auto max-w-3xl px-6 pt-8 pb-8 text-center">
        <AssessmentResultActions
          accentColor={ACCENT}
          resultSlug="the-mirror"
          resultSummary={getFlowLabel(overallScore)}
          resultScore={overallScore}
        />
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <div className="grid gap-6 sm:grid-cols-2">
          <Link href="/community" className="rounded-lg bg-[#0A0A10] p-8 text-center">
            <h3 className="mb-2 font-heading text-xl font-normal text-[#FAFAF7]">{copy.communityTitle}</h3>
            <p className="text-sm text-[#FAFAF7]/60">{copy.communityBody}</p>
          </Link>
          <button type="button" onClick={quiz.reset} className="rounded-lg border-2 border-brand-gold-light/30 p-8 text-center">
            <h3 className="mb-2 font-heading text-xl font-normal">{copy.retakeTitle}</h3>
            <p className="text-sm text-[#5A5A52]">{copy.retakeBody}</p>
          </button>
        </div>
      </section>
    </div>
  );
}
