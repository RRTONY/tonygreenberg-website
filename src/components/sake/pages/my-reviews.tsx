"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  DollarSign,
  ExternalLink,
  Filter,
  Heart,
  MapPin,
  SortAsc,
  SortDesc,
  Star,
  Thermometer,
  ThumbsUp,
  Wine,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage, useMember } from "@/components/sake/sake-providers";
import { getMyReviews, type SakeReview } from "@/app/sake/actions";
import { sakeDetailPath, sk } from "@/lib/content/sake/nav";

// Ported from the Sake app's client/src/pages/MyReviews.tsx (2026-11-26): the member's tasting
// journal with stats, a rating filter and sorting. Reviews come from getMyReviews
// (src/app/sake/actions.ts). The app's colors per look (its inline `isAustere ? a : b` styles) are
// paired classes, the Kintsugi value plus a [.sake-austere_&]: one.
// Changed (rule 20): the flavor tags and the empty-state wine glass used colors the app wrote as
// `${accent}15` on an oklch() value, which isn't a valid color, so they showed no tint; they now get
// the intended 15%/30%/60% accent. Signed-out visitors go to this site's sign-in and come back here.
// The loading placeholders use the site's Skeleton.

const SIGN_IN_HREF = `/login?next=${encodeURIComponent(sk("/my-reviews"))}`;

const BG = "bg-[oklch(0.12_0.025_270)] [.sake-austere_&]:bg-[oklch(0.95_0.008_80)]";
const FG = "text-[oklch(0.96_0.01_85)] [.sake-austere_&]:text-[oklch(0.18_0.005_60)]";
const FG_SOFT = "text-[oklch(0.75_0.01_85)] [.sake-austere_&]:text-[oklch(0.35_0.01_60)]";
const FG_MUTED = "text-[oklch(0.55_0.01_85)] [.sake-austere_&]:text-[oklch(0.55_0.008_60)]";
const CARD =
  "bg-[oklch(0.16_0.03_270)] [.sake-austere_&]:bg-[oklch(0.92_0.006_80)] border-[oklch(0.28_0.04_270)] [.sake-austere_&]:border-[oklch(0.82_0.008_80)]";
const BORDER = "border-[oklch(0.28_0.04_270)] [.sake-austere_&]:border-[oklch(0.82_0.008_80)]";
const GRADIENT_BUTTON =
  "inline-flex items-center gap-2 px-8 py-4 text-sm font-bold tracking-[0.15em] uppercase rounded-md transition-all duration-300 hover:scale-105 bg-linear-135 from-(--sk-accent-gradient-from) to-(--sk-accent-gradient-to) text-(--sk-on-accent)";

type SortOption = "newest" | "oldest" | "highest" | "lowest";
type FilterOption = "all" | "5" | "4" | "3" | "2" | "1";

function StarDisplay({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} / 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          aria-hidden="true"
          size={size}
          className={
            rating >= star
              ? "fill-[oklch(0.78_0.12_85)] stroke-[oklch(0.78_0.12_85)]"
              : "fill-transparent stroke-[oklch(0.5_0.01_85)]"
          }
        />
      ))}
    </div>
  );
}

export function SakeMyReviews() {
  const { t } = useLanguage();
  const { signedIn, loaded, name } = useMember();
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterRating, setFilterRating] = useState<FilterOption>("all");
  const [reviews, setReviews] = useState<SakeReview[] | null>(null);

  useEffect(() => {
    if (!loaded || !signedIn) return;
    let live = true;
    getMyReviews()
      .then((r) => live && setReviews(r.ok ? r.data : []))
      .catch(() => live && setReviews([]));
    return () => {
      live = false;
    };
  }, [loaded, signedIn]);

  const processedReviews = useMemo(() => {
    if (!reviews) return [];
    let filtered = [...reviews];
    if (filterRating !== "all") filtered = filtered.filter((r) => r.rating === Number(filterRating));
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "highest":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
    }
    return filtered;
  }, [reviews, sortBy, filterRating]);

  const stats = useMemo(() => {
    if (!reviews || reviews.length === 0) return { total: 0, avgRating: 0, wouldBuyAgain: 0, topRated: 0 };
    const total = reviews.length;
    return {
      total,
      avgRating: reviews.reduce((sum, r) => sum + r.rating, 0) / total,
      wouldBuyAgain: reviews.filter((r) => r.wouldBuyAgain).length,
      topRated: reviews.filter((r) => r.rating >= 4).length,
    };
  }, [reviews]);

  if (loaded && !signedIn) {
    return (
      <div className={`min-h-screen pt-20 transition-colors duration-500 ${BG}`}>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <BookOpen aria-hidden="true" size={48} className="mx-auto mb-6 text-(--sk-accent)" />
          <h1 className={`font-sk-display text-3xl sm:text-4xl mb-4 ${FG}`}>{t("Your Tasting Journal", "あなたの味覚日記")}</h1>
          <p className={`text-lg mb-8 ${FG_SOFT}`}>
            {t(
              "Sign in to view and manage all your sake tasting notes in one place.",
              "ログインして、すべての日本酒テイスティングノートを一箇所で管理しましょう。",
            )}
          </p>
          <Link href={SIGN_IN_HREF} className={GRADIENT_BUTTON}>
            {t("Sign In", "ログイン")}
          </Link>
        </div>
      </div>
    );
  }

  const busy = !loaded || reviews === null;
  const hasReviews = !busy && reviews !== null && reviews.length > 0;
  const statCards = [
    { label: t("Total Reviews", "総レビュー数"), value: stats.total, icon: BookOpen },
    { label: t("Avg Rating", "平均評価"), value: stats.avgRating.toFixed(1), icon: Star },
    { label: t("Would Buy Again", "また買いたい"), value: stats.wouldBuyAgain, icon: Heart },
    { label: t("Top Rated (4+)", "高評価 (4+)"), value: stats.topRated, icon: ThumbsUp },
  ];

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-500 ${BG}`}>
      <section className="py-12 lg:py-16">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={sk("/")} className={`inline-flex items-center gap-2 mb-8 text-sm tracking-widest uppercase transition-colors ${FG_MUTED}`}>
            <ArrowLeft aria-hidden="true" size={14} />
            {t("Back to Home", "ホームに戻る")}
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-3 text-(--sk-accent)">{t("Your Tasting Journal", "あなたの味覚日記")}</p>
              <h1 className={`font-sk-display text-4xl sm:text-5xl lg:text-6xl leading-tight font-bold [.sake-austere_&]:font-extralight ${FG}`}>
                {t("My Reviews", "マイレビュー")}
              </h1>
              {name && <p className={`mt-2 text-base ${FG_SOFT}`}>{t(`${name}'s sake journey`, `${name}の酒の旅`)}</p>}
            </div>
          </div>

          {hasReviews && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {statCards.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`rounded-lg p-5 border transition-colors animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both ${CARD}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <stat.icon aria-hidden="true" size={18} className="mb-2 text-(--sk-accent)" />
                  <div className={`text-2xl font-bold ${FG}`}>{stat.value}</div>
                  <div className={`text-xs tracking-[0.08em] uppercase mt-1 ${FG_MUTED}`}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {hasReviews && (
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <div className="flex items-center gap-2">
                <Filter aria-hidden="true" size={14} className={FG_MUTED} />
                <select
                  aria-label={t("Filter by rating", "評価で絞り込み")}
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value as FilterOption)}
                  className={`px-3 py-2 rounded-md border text-sm transition-colors bg-transparent ${BORDER} ${FG}`}
                >
                  <option value="all">{t("All Ratings", "全評価")}</option>
                  <option value="5">{t("5 Stars", "5つ星")}</option>
                  <option value="4">{t("4 Stars", "4つ星")}</option>
                  <option value="3">{t("3 Stars", "3つ星")}</option>
                  <option value="2">{t("2 Stars", "2つ星")}</option>
                  <option value="1">{t("1 Star", "1つ星")}</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                {sortBy === "newest" || sortBy === "highest" ? (
                  <SortDesc aria-hidden="true" size={14} className={FG_MUTED} />
                ) : (
                  <SortAsc aria-hidden="true" size={14} className={FG_MUTED} />
                )}
                <select
                  aria-label={t("Sort reviews", "並べ替え")}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className={`px-3 py-2 rounded-md border text-sm transition-colors bg-transparent ${BORDER} ${FG}`}
                >
                  <option value="newest">{t("Newest First", "新しい順")}</option>
                  <option value="oldest">{t("Oldest First", "古い順")}</option>
                  <option value="highest">{t("Highest Rated", "高評価順")}</option>
                  <option value="lowest">{t("Lowest Rated", "低評価順")}</option>
                </select>
              </div>
              <span className={`text-xs ml-auto ${FG_MUTED}`}>
                {t(
                  `${processedReviews.length} review${processedReviews.length !== 1 ? "s" : ""}`,
                  `${processedReviews.length}件のレビュー`,
                )}
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
          {busy ? (
            <div className="space-y-4" aria-label={t("Loading reviews", "レビューを読み込み中")}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={`rounded-lg p-6 border ${CARD}`}>
                  <Skeleton className="h-6 w-48 mb-3" />
                  <Skeleton className="h-4 w-32 mb-4" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : !reviews || reviews.length === 0 ? (
            <div className="text-center py-20 animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
              <Wine aria-hidden="true" size={48} className="mx-auto mb-6 text-(--sk-accent)/60" />
              <h2 className={`font-sk-display text-2xl mb-3 ${FG}`}>{t("No Tasting Notes Yet", "まだテイスティングノートがありません")}</h2>
              <p className={`text-base mb-8 max-w-md mx-auto ${FG_SOFT}`}>
                {t(
                  "Start exploring our collection and share your thoughts on the sakes you taste. Your journey begins with a single sip.",
                  "コレクションを探索し、味わった日本酒の感想を共有しましょう。旅は一口から始まります。",
                )}
              </p>
              <Link href={sk("/collection")} className={GRADIENT_BUTTON}>
                {t("Explore the Collection", "コレクションを探索")}
              </Link>
            </div>
          ) : processedReviews.length === 0 ? (
            <div className="text-center py-16">
              <p className={`text-base ${FG_SOFT}`}>{t("No reviews match this filter.", "このフィルターに一致するレビューはありません。")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {processedReviews.map((review, i) => (
                <article
                  key={review.id}
                  className={`rounded-lg border p-6 transition-colors group animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both ${CARD}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div className="flex-1">
                      <Link
                        href={sakeDetailPath(review.sakeId)}
                        className={`font-sk-display inline-flex items-center gap-2 text-lg font-semibold transition-colors group-hover:underline ${FG}`}
                      >
                        {review.sakeName}
                        <ExternalLink aria-hidden="true" size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${FG_MUTED}`} />
                      </Link>
                      <div className="flex items-center gap-3 mt-1.5">
                        <StarDisplay rating={review.rating} />
                        {review.wouldBuyAgain && (
                          <span className="flex items-center gap-1 text-xs text-(--sk-accent)">
                            <Heart aria-hidden="true" size={12} className="fill-(--sk-accent)" /> {t("Would buy again", "また買いたい")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 text-xs shrink-0 ${FG_MUTED}`}>
                      <Calendar aria-hidden="true" size={12} />
                      {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </div>
                  </div>

                  {review.tastingNote ? <p className={`text-base leading-relaxed mb-4 ${FG_SOFT}`}>{review.tastingNote}</p> : null}

                  {review.flavorTags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {review.flavorTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full text-xs tracking-[0.06em] bg-(--sk-accent)/15 text-(--sk-accent) border border-(--sk-accent)/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className={`flex flex-wrap items-center gap-4 text-xs ${FG_MUTED}`}>
                    {review.servingTemp && (
                      <span className="flex items-center gap-1.5">
                        <Thermometer aria-hidden="true" size={12} />
                        {review.servingTemp}
                      </span>
                    )}
                    {review.purchaseLocation && (
                      <span className="flex items-center gap-1.5">
                        <MapPin aria-hidden="true" size={12} />
                        {review.purchaseLocation}
                      </span>
                    )}
                    {review.pricePaidCents !== null && review.pricePaidCents > 0 && (
                      <span className="flex items-center gap-1.5">
                        <DollarSign aria-hidden="true" size={12} />${(review.pricePaidCents / 100).toFixed(2)}
                      </span>
                    )}
                    {review.upvotes > 0 && (
                      <span className="flex items-center gap-1.5">
                        <ThumbsUp aria-hidden="true" size={12} />
                        {review.upvotes} {t("upvotes", "いいね")}
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
