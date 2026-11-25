"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Formik, Form, Field, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { DollarSign, Heart, Loader2, MessageSquare, Send, Star, Thermometer, ThumbsUp, Wine, MapPin } from "lucide-react";
import { useLanguage, useMember } from "@/components/sake/sake-providers";
import { createReview, getReviewsBySake, upvoteReview, type ReviewStats, type SakeReview } from "@/app/sake/actions";
import { reviewSchema } from "@/lib/content/sake/forms";
import { sakeDetailPath } from "@/lib/content/sake/nav";

// Ported from the Sake app's client/src/components/SakeReviews.tsx (2026-11-26): community tasting
// notes on a sake's page, with the average rating, "would buy again" share and average price paid, a
// tasting-note form for signed-in members, and upvotes. Server: src/app/sake/actions.ts.
// Changed:
// - The form is Formik + Yup (rule 6) on the same reviewSchema the server checks; the price is typed
//   in dollars and sent as cents, as in the app. The server looks up the sake's name itself.
// - One upvote per member per review (the app allowed unlimited); an upvoted review shows it, and
//   signed-out visitors see the count with a disabled button.
// - "Loading reviews..." and "Submitting..." text became spinners; server errors show under the form.
// - The app's fixed gold read poorly on Austere's paper, so the accent follows the look (--sk-accent);
//   the stars' inline fill/stroke and the 44px inline sizes are classes.
// - The stored serving temperature ("chilled") shows its label ("Chilled (8-12°C)") instead of the key.
// - Sign-in goes to this site's /login and comes back to the sake.

const FLAVOR_TAG_OPTIONS = [
  "Fruity", "Floral", "Umami", "Dry", "Sweet", "Mineral",
  "Earthy", "Creamy", "Citrus", "Tropical", "Herbal", "Spicy",
  "Nutty", "Honey", "Rice", "Clean", "Complex", "Light",
];

const TEMP_OPTIONS = [
  { value: "ice-cold", label: "Ice Cold (5°C)", labelJa: "雪冷え（5°C）" },
  { value: "chilled", label: "Chilled (8-12°C)", labelJa: "冷酒（8-12°C）" },
  { value: "room", label: "Room Temp (15-20°C)", labelJa: "常温（15-20°C）" },
  { value: "warm", label: "Warm (40-45°C)", labelJa: "ぬる燗（40-45°C）" },
  { value: "hot", label: "Hot (50°C+)", labelJa: "熱燗（50°C+）" },
];

type FormValues = {
  rating: number;
  tastingNote: string;
  flavorTags: string[];
  servingTemp: string;
  purchaseLocation: string;
  pricePaid: string;
  wouldBuyAgain: boolean;
};

const EMPTY: FormValues = {
  rating: 0,
  tastingNote: "",
  flavorTags: [],
  servingTemp: "",
  purchaseLocation: "",
  pricePaid: "",
  wouldBuyAgain: true,
};

/** The server's reviewSchema, with the price as typed dollars instead of cents. */
const formSchema = reviewSchema.omit(["sakeId", "pricePaidCents"]).shape({
  pricePaid: Yup.string()
    .trim()
    .optional()
    .test("price", "Please enter a price between 0 and 1,000.", (v) => !v || (/^\d+(\.\d{1,2})?$/.test(v) && Number(v) <= 1000)),
});

const NO_STATS: ReviewStats = { avgRating: 0, totalReviews: 0, wouldBuyAgainPct: 0, avgPricePaid: 0 };

function StarRating({
  rating,
  onRate,
  size = 20,
  label,
}: {
  rating: number;
  onRate?: (r: number) => void;
  size?: number;
  label: string;
}) {
  const [hover, setHover] = useState(0);
  const interactive = Boolean(onRate);
  if (!interactive) {
    return (
      <span className="flex gap-1" role="img" aria-label={label}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            aria-hidden="true"
            size={size}
            className={rating >= star ? "fill-(--sk-accent) stroke-(--sk-accent)" : "fill-transparent stroke-[oklch(0.5_0.01_85)]"}
          />
        ))}
      </span>
    );
  }
  return (
    <div className="flex gap-1" role="radiogroup" aria-label={label}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={rating === star}
          aria-label={`${star} / 5`}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="flex items-center justify-center min-h-11 min-w-11 transition-colors cursor-pointer hover:scale-110"
        >
          <Star
            aria-hidden="true"
            size={size}
            className={(hover || rating) >= star ? "fill-(--sk-accent) stroke-(--sk-accent)" : "fill-transparent stroke-[oklch(0.5_0.01_85)]"}
          />
        </button>
      ))}
    </div>
  );
}

export function SakeReviews({ sakeId }: { sakeId: string }) {
  const { t, lang } = useLanguage();
  const { signedIn } = useMember();
  const [showForm, setShowForm] = useState(false);
  const [reviews, setReviews] = useState<SakeReview[]>([]);
  const [stats, setStats] = useState<ReviewStats>(NO_STATS);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const [voting, setVoting] = useState<number | null>(null);
  const signInHref = `/login?next=${encodeURIComponent(sakeDetailPath(sakeId))}`;

  useEffect(() => {
    let live = true;
    getReviewsBySake(sakeId)
      .then((data) => {
        if (!live) return;
        setReviews(data.reviews);
        setStats(data.stats);
      })
      .catch(() => {})
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [sakeId, version]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  const tempLabel = (value: string) => {
    const opt = TEMP_OPTIONS.find((o) => o.value === value);
    return opt ? t(opt.label, opt.labelJa) : value;
  };

  const submit = async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
    helpers.setStatus(null);
    const result = await createReview({
      sakeId,
      rating: values.rating,
      tastingNote: values.tastingNote.trim() || undefined,
      flavorTags: values.flavorTags.length > 0 ? values.flavorTags : undefined,
      servingTemp: values.servingTemp || undefined,
      purchaseLocation: values.purchaseLocation.trim() || undefined,
      pricePaidCents: values.pricePaid.trim() ? Math.round(parseFloat(values.pricePaid) * 100) : undefined,
      wouldBuyAgain: values.wouldBuyAgain,
    });
    if (!result.ok) {
      helpers.setStatus(result.error);
      return;
    }
    helpers.resetForm();
    setShowForm(false);
    refetch();
  };

  const vote = async (review: SakeReview) => {
    if (!signedIn || review.upvotedByMe || voting !== null) return;
    setVoting(review.id);
    const result = await upvoteReview(review.id);
    setVoting(null);
    if (result.ok) {
      setReviews((list) => list.map((r) => (r.id === review.id ? { ...r, upvotes: result.data.upvotes, upvotedByMe: true } : r)));
    }
  };

  const toggleButton =
    "inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all min-h-12 bg-(--sk-accent)/15 border border-(--sk-accent)/40 text-(--sk-accent)";

  return (
    <div className="space-y-6">
      {/* Stats header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <MessageSquare aria-hidden="true" size={20} className="text-(--sk-accent)" />
            {t("Community Tasting Notes", "コミュニティテイスティングノート")}
          </h2>
          {stats.totalReviews > 0 && (
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star aria-hidden="true" size={14} className="fill-(--sk-accent) stroke-(--sk-accent)" />
                {stats.avgRating.toFixed(1)} ({stats.totalReviews} {t("reviews", "レビュー")})
              </span>
              <span className="flex items-center gap-1">
                <Heart aria-hidden="true" size={14} />
                {stats.wouldBuyAgainPct}% {t("would buy again", "リピート希望")}
              </span>
              {stats.avgPricePaid > 0 && (
                <span className="flex items-center gap-1">
                  <DollarSign aria-hidden="true" size={14} />
                  {t("Avg paid", "平均支払")}: ${(stats.avgPricePaid / 100).toFixed(0)}
                </span>
              )}
            </div>
          )}
        </div>

        {signedIn ? (
          <button type="button" aria-expanded={showForm} onClick={() => setShowForm((s) => !s)} className={toggleButton}>
            <Wine aria-hidden="true" size={16} />
            {showForm ? t("Cancel", "キャンセル") : t("Write a Tasting Note", "テイスティングノートを書く")}
          </button>
        ) : (
          <Link href={signInHref} className={toggleButton}>
            {t("Sign in to Review", "ログインしてレビュー")}
          </Link>
        )}
      </div>

      {/* Review form */}
      {showForm && signedIn && (
        <Formik<FormValues> initialValues={EMPTY} validationSchema={formSchema} onSubmit={submit}>
          {({ values, setFieldValue, isSubmitting, errors, touched, status }) => (
            <Form noValidate className="p-5 rounded-xl border border-border bg-card space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Rating */}
              <fieldset>
                <legend className="block text-sm font-medium text-foreground mb-2">
                  {t("Your Rating", "あなたの評価")} *
                </legend>
                <StarRating
                  rating={values.rating}
                  onRate={(r) => setFieldValue("rating", r)}
                  size={28}
                  label={t("Your Rating", "あなたの評価")}
                />
                {touched.rating && errors.rating && (
                  <p role="alert" className="mt-1 text-sm text-destructive">
                    {errors.rating}
                  </p>
                )}
              </fieldset>

              {/* Tasting note */}
              <div>
                <label htmlFor="sk-review-note" className="block text-sm font-medium text-foreground mb-2">
                  {t("Tasting Note", "テイスティングノート")}
                </label>
                <Field
                  as="textarea"
                  id="sk-review-note"
                  name="tastingNote"
                  maxLength={2000}
                  placeholder={t(
                    "What did you taste? How did it make you feel? Be specific...",
                    "何を感じましたか？どんな気持ちになりましたか？具体的に...",
                  )}
                  className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-base resize-none min-h-30"
                />
                <div className="text-xs text-muted-foreground mt-1 text-right">{values.tastingNote.length}/2000</div>
              </div>

              {/* Flavor tags */}
              <fieldset>
                <legend className="block text-sm font-medium text-foreground mb-2">
                  {t("Flavor Tags", "フレーバータグ")} ({values.flavorTags.length}/8)
                </legend>
                <div className="flex flex-wrap gap-2">
                  {FLAVOR_TAG_OPTIONS.map((tag) => {
                    const on = values.flavorTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        aria-pressed={on}
                        onClick={() =>
                          setFieldValue(
                            "flavorTags",
                            on
                              ? values.flavorTags.filter((x) => x !== tag)
                              : values.flavorTags.length < 8
                                ? [...values.flavorTags, tag]
                                : values.flavorTags,
                          )
                        }
                        className={
                          on
                            ? "px-3 py-2 rounded-full text-sm transition-all min-h-11 border bg-(--sk-accent)/20 border-(--sk-accent)/60 text-(--sk-accent)"
                            : "px-3 py-2 rounded-full text-sm transition-all min-h-11 border bg-transparent border-[oklch(0.5_0.01_85/0.3)] text-(--sk-fg-muted)"
                        }
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Serving temp, place, price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="sk-review-temp" className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                    <Thermometer aria-hidden="true" size={14} /> {t("Serving Temp", "温度")}
                  </label>
                  <Field
                    as="select"
                    id="sk-review-temp"
                    name="servingTemp"
                    className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-base min-h-12"
                  >
                    <option value="">{t("Select...", "選択...")}</option>
                    {TEMP_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(opt.label, opt.labelJa)}
                      </option>
                    ))}
                  </Field>
                </div>
                <div>
                  <label htmlFor="sk-review-place" className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                    <MapPin aria-hidden="true" size={14} /> {t("Where Purchased", "購入場所")}
                  </label>
                  <Field
                    id="sk-review-place"
                    name="purchaseLocation"
                    type="text"
                    maxLength={256}
                    placeholder={t("e.g., Tippsy, True Sake", "例: Tippsy, True Sake")}
                    className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-base min-h-12"
                  />
                </div>
                <div>
                  <label htmlFor="sk-review-price" className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                    <DollarSign aria-hidden="true" size={14} /> {t("Price Paid", "支払い価格")}
                  </label>
                  <Field
                    id="sk-review-price"
                    name="pricePaid"
                    type="text"
                    inputMode="decimal"
                    placeholder="$"
                    className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-base min-h-12"
                  />
                  {touched.pricePaid && errors.pricePaid && (
                    <p role="alert" className="mt-1 text-sm text-destructive">
                      {errors.pricePaid}
                    </p>
                  )}
                </div>
              </div>

              {/* Would buy again */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-pressed={values.wouldBuyAgain}
                  onClick={() => setFieldValue("wouldBuyAgain", !values.wouldBuyAgain)}
                  className={
                    values.wouldBuyAgain
                      ? "flex items-center gap-2 px-4 py-3 rounded-lg text-sm transition-all min-h-12 border bg-[oklch(0.45_0.15_145/0.15)] border-[oklch(0.45_0.15_145/0.4)] text-[oklch(0.55_0.15_145)]"
                      : "flex items-center gap-2 px-4 py-3 rounded-lg text-sm transition-all min-h-12 border bg-transparent border-[oklch(0.5_0.01_85/0.3)] text-(--sk-fg-muted)"
                  }
                >
                  <Heart
                    aria-hidden="true"
                    size={16}
                    className={values.wouldBuyAgain ? "fill-[oklch(0.55_0.15_145)]" : "fill-transparent"}
                  />
                  {t("Would buy again", "また買いたい")}
                </button>
              </div>

              {status && (
                <p role="alert" className="text-sm text-destructive">
                  {status}
                </p>
              )}

              <button
                type="submit"
                disabled={values.rating === 0 || isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all min-h-12 disabled:opacity-50 bg-(--sk-accent) text-(--sk-on-accent)"
              >
                {isSubmitting ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <Send aria-hidden="true" size={16} />}
                {t("Submit Tasting Note", "テイスティングノートを送信")}
              </button>
            </Form>
          )}
        </Formik>
      )}

      {/* Reviews */}
      {loading ? (
        <div className="flex justify-center py-8 text-muted-foreground" role="status">
          <Loader2 aria-hidden="true" className="size-5 animate-spin" />
          <span className="sr-only">{t("Loading reviews", "レビューを読み込み中")}</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <MessageSquare aria-hidden="true" size={32} className="mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground text-base">
            {t(
              "No tasting notes yet. Be the first to share your experience!",
              "まだテイスティングノートがありません。最初の体験を共有しましょう！",
            )}
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="p-4 rounded-xl border border-border bg-card animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-medium text-foreground text-base">{review.userName || "Anonymous"}</span>
                    <StarRating rating={review.rating} size={14} label={`${review.rating} / 5`} />
                    {review.wouldBuyAgain && (
                      <span className="text-xs px-2 py-1 rounded-full bg-[oklch(0.45_0.15_145/0.15)] text-[oklch(0.55_0.15_145)]">
                        {t("Would buy again", "リピート希望")}
                      </span>
                    )}
                  </div>
                  {review.tastingNote && (
                    <p className="mt-2 text-base text-foreground/80 leading-relaxed">{review.tastingNote}</p>
                  )}
                  {review.flavorTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {review.flavorTags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 rounded-full border border-border text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                    {review.servingTemp && (
                      <span className="flex items-center gap-1">
                        <Thermometer aria-hidden="true" size={12} /> {tempLabel(review.servingTemp)}
                      </span>
                    )}
                    {review.purchaseLocation && (
                      <span className="flex items-center gap-1">
                        <MapPin aria-hidden="true" size={12} /> {review.purchaseLocation}
                      </span>
                    )}
                    {review.pricePaidCents ? (
                      <span className="flex items-center gap-1">
                        <DollarSign aria-hidden="true" size={12} /> ${(review.pricePaidCents / 100).toFixed(0)}
                      </span>
                    ) : null}
                    <span>{new Date(review.createdAt).toLocaleDateString(lang === "ja" ? "ja-JP" : "en-US")}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void vote(review)}
                  disabled={!signedIn || review.upvotedByMe || voting !== null}
                  aria-pressed={review.upvotedByMe}
                  aria-label={
                    signedIn
                      ? `${t("Helpful", "参考になった")} (${review.upvotes})`
                      : `${t("Sign in to upvote", "ログインして投票")} (${review.upvotes})`
                  }
                  className={
                    review.upvotedByMe
                      ? "flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors min-h-11 min-w-11 text-(--sk-accent)"
                      : "flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors min-h-11 min-w-11 text-[oklch(0.6_0.01_85)] enabled:hover:text-(--sk-accent)"
                  }
                >
                  {voting === review.id ? (
                    <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                  ) : (
                    <ThumbsUp aria-hidden="true" size={16} className={review.upvotedByMe ? "fill-current" : undefined} />
                  )}
                  <span className="text-xs">{review.upvotes || 0}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
