"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  CircleCheck,
  CircleX,
  Droplets,
  ExternalLink,
  Flame,
  Heart,
  Leaf,
  Loader2,
  MapPin,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
  Star,
  Thermometer,
  Truck,
  Wine,
} from "lucide-react";
import { useAesthetic, useFavorites, useLanguage, useMember } from "@/components/sake/sake-providers";
import { SakeImage } from "@/components/sake/sake-image";
import { SakeReviews } from "@/components/sake/sake-reviews";
import { useLocalStore } from "@/components/soulsmoke/hooks/use-local-store";
import { startOrderCheckout } from "@/app/sake/actions";
import { getBottleImage } from "@/lib/content/sake/images";
import { usRetailers, type QPRSake } from "@/lib/content/sake/qpr-data";
import { generateSupplyChainMap, sakeSupplyChains } from "@/lib/content/sake/supply-chain-engine";
import { sakeDetailPath, sk } from "@/lib/content/sake/nav";

// Ported from the Sake app's client/src/pages/SakeDetail.tsx (2026-11-26): one sake's page, with its
// bottle, QPR badge, names, brewery, description and label kanji, the flavor radar and four stats, the
// buy box (quantity, cart, Buy Now), aroma/flavor notes, serving and pairings, rice and brewing, the
// carbon footprint, where to buy, links onward, and community reviews (src/components/sake/sake-reviews.tsx).
// The route (src/app/sake/bottle/[id]/page.tsx) finds the sake and 404s unknown ids; the app showed a
// "Sake Not Found" page with a 200.
// Changed:
// - Buy Now runs the server checkout (actions.ts startOrderCheckout: prices from the server, sign-in
//   required) in the same tab; Stripe sends buyers back to ?order=success|cancelled, which shows a
//   notice. Until ordering is switched on (SAKE_CHECKOUT_ENABLED) the button is replaced by
//   "Ordering opens soon. Please check back." Signed-out visitors get a sign-in link back to this page.
// - The header's heart and share buttons did nothing in the app: the heart now saves the sake to
//   Favorites (the browser list), share opens the phone's share sheet or copies the link.
// - Back falls back to QPR Rankings when there's no page to go back to (a visitor from search).
// - The page sat under the fixed menu bar (no top padding); it now starts below it.
// - Colors the app set inline per look are --sk-* classes; the radar's grow-in and the sections'
//   fade-up are CSS animations at the app's timings (framer-motion).
// - The bottle picture (Manus, deleted) is SakeImage (ink-wash stand-in until the Sanity copy).

const CART_KEY = "sake-cart";
type CartLine = { productId: string; quantity: number };
const NO_CART: CartLine[] = [];
const MAX_QTY = 12;

const RADAR_DIMENSIONS = [
  { key: "sweetness", label: "Sweet", labelJa: "甘い" },
  { key: "umami", label: "Umami", labelJa: "旨味" },
  { key: "acidity", label: "Acid", labelJa: "酸味" },
  { key: "body", label: "Body", labelJa: "ボディ" },
  { key: "aroma", label: "Aroma", labelJa: "香り" },
  { key: "dryness", label: "Dry", labelJa: "辛口" },
] as const;

/** The app's deriveFlavorScores(), unchanged. */
export function deriveFlavorScores(sake: QPRSake): Record<string, number> {
  const smvNorm = Math.max(0, Math.min(100, 50 + sake.smv * 3));
  const acidNorm = Math.max(0, Math.min(100, sake.acidity * 55));
  const aminoNorm = sake.aminoAcid ? Math.max(0, Math.min(100, sake.aminoAcid * 60)) : 45;
  return {
    sweetness: Math.max(10, 100 - smvNorm),
    umami: aminoNorm,
    acidity: acidNorm,
    body: Math.round((acidNorm + aminoNorm) / 2),
    aroma: sake.type.includes("Daiginjo") ? 85 : sake.type.includes("Ginjo") ? 72 : 55,
    dryness: smvNorm,
  };
}

function FlavorRadar({ scores }: { scores: Record<string, number> }) {
  const { t } = useLanguage();
  const { isAustere } = useAesthetic();
  const size = 280;
  const center = size / 2;
  const maxRadius = 110;
  const levels = 5;
  const n = RADAR_DIMENSIONS.length;
  const angleOf = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const points = RADAR_DIMENSIONS.map((dim, i) => {
    const angle = angleOf(i);
    const value = (scores[dim.key] || 50) / 100;
    return {
      x: center + Math.cos(angle) * maxRadius * value,
      y: center + Math.sin(angle) * maxRadius * value,
      labelX: center + Math.cos(angle) * (maxRadius + 24),
      labelY: center + Math.sin(angle) * (maxRadius + 24),
      label: t(dim.label, dim.labelJa),
    };
  });
  const pathData = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  const area = isAustere
    ? "fill-[rgba(180,80,60,0.2)] stroke-[rgba(180,80,60,0.8)]"
    : "fill-[rgba(210,170,100,0.25)] stroke-[rgba(210,170,100,0.9)]";
  const dot = isAustere ? "fill-[rgba(180,80,60,0.8)]" : "fill-[rgba(210,170,100,0.9)]";
  const grid = isAustere ? "stroke-[rgba(0,0,0,0.08)]" : "stroke-[rgba(255,255,255,0.1)]";
  const text = isAustere ? "fill-[rgba(0,0,0,0.6)]" : "fill-[rgba(255,255,255,0.7)]";

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full max-w-70 mx-auto"
      role="img"
      aria-label={RADAR_DIMENSIONS.map((d) => `${t(d.label, d.labelJa)} ${Math.round(scores[d.key] ?? 50)}`).join(", ")}
    >
      {Array.from({ length: levels }).map((_, level) => {
        const r = maxRadius * ((level + 1) / levels);
        const gridPoints = RADAR_DIMENSIONS.map((_, i) => `${center + Math.cos(angleOf(i)) * r},${center + Math.sin(angleOf(i)) * r}`).join(" ");
        return <polygon key={level} points={gridPoints} fill="none" strokeWidth="0.5" className={grid} />;
      })}
      {RADAR_DIMENSIONS.map((_, i) => (
        <line
          key={i}
          x1={center}
          y1={center}
          x2={center + Math.cos(angleOf(i)) * maxRadius}
          y2={center + Math.sin(angleOf(i)) * maxRadius}
          strokeWidth="0.5"
          className={grid}
        />
      ))}
      <path
        d={pathData}
        strokeWidth="2"
        className={`${area} origin-[140px_140px] animate-in fade-in zoom-in-50 duration-800 ease-out fill-mode-both`}
      />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          className={`${dot} animate-in fade-in duration-300 fill-mode-both`}
          style={{ animationDelay: `${0.3 + i * 0.1}s` }}
        />
      ))}
      {points.map((p, i) => (
        <text key={`label-${i}`} x={p.labelX} y={p.labelY} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="500" className={text}>
          {p.label}
        </text>
      ))}
    </svg>
  );
}

const TIER_BADGE: Record<string, string> = {
  legendary: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  exceptional: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  excellent: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  good: "bg-violet-500/20 text-violet-300 border-violet-500/40",
  fair: "bg-zinc-500/20 text-zinc-300 border-zinc-500/40",
  overpriced: "bg-red-500/20 text-red-300 border-red-500/40",
};

function QPRBadge({ tier, score }: { tier: string; score: number }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${TIER_BADGE[tier] ?? TIER_BADGE.good}`}>
      <Star aria-hidden="true" size={14} />
      QPR {score} — {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  );
}

/** Stripe's return: ?order=success|cancelled. In its own Suspense so the page stays static. */
function OrderNotice() {
  const { t } = useLanguage();
  const order = useSearchParams().get("order");
  if (order === "success") {
    return (
      <div role="status" className="mb-8 flex items-start gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-foreground">
        <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-emerald-400" />
        <p>{t("Thank you! Your order is confirmed. A receipt is on its way to your email.", "ありがとうございます。ご注文を承りました。領収書をメールでお送りします。")}</p>
      </div>
    );
  }
  if (order === "cancelled") {
    return (
      <div role="status" className="mb-8 flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-foreground">
        <CircleX aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
        <p>{t("Checkout was cancelled. Nothing was charged.", "購入手続きはキャンセルされました。請求はありません。")}</p>
      </div>
    );
  }
  return null;
}

const FADE_UP = "animate-in fade-in slide-in-from-bottom-5 duration-600 fill-mode-both";

export function SakeDetail({ sake, checkoutOpen }: { sake: QPRSake; checkoutOpen: boolean }) {
  const { t } = useLanguage();
  const { signedIn } = useMember();
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [buying, setBuying] = useState(false);
  const [, setCart] = useLocalStore<CartLine[]>(CART_KEY, NO_CART);

  const path = sakeDetailPath(sake.id);
  const signInHref = `/login?next=${encodeURIComponent(path)}`;
  const flavorScores = useMemo(() => deriveFlavorScores(sake), [sake]);
  const supplyChain = useMemo(() => {
    const profile = sakeSupplyChains.find((s) => s.sakeId === sake.id);
    return profile ? generateSupplyChainMap(profile) : null;
  }, [sake.id]);
  const saved = isFavorite(sake.id);

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push(sk("/qpr"));
  };

  const share = async () => {
    const url = `${window.location.origin}${path}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: sake.name, url });
      } catch {
        /* closed the share sheet */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast(t("Link copied", "リンクをコピーしました"));
    } catch {
      /* clipboard blocked */
    }
  };

  const addToCart = () => {
    setCart((prev) => {
      const list = Array.isArray(prev) ? prev : NO_CART;
      const existing = list.find((item) => item.productId === sake.id);
      return existing
        ? list.map((item) => (item.productId === sake.id ? { ...item, quantity: Math.min(MAX_QTY, item.quantity + quantity) } : item))
        : [...list, { productId: sake.id, quantity }];
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const buyNow = async () => {
    setBuying(true);
    const result = await startOrderCheckout([{ productId: sake.id, quantity }]);
    if (result.ok) {
      window.location.assign(result.data.url);
      return;
    }
    setBuying(false);
    if (result.signedOut) router.push(signInHref);
    else toast(result.error);
  };

  const markup = ((sake.priceUS / sake.priceJapan - 1) * 100).toFixed(0);
  const carbon = supplyChain?.totalCarbonKg ?? 0;

  return (
    <div className="min-h-screen bg-background pt-16 pb-24 md:pb-8">
      {/* Back bar */}
      <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors min-h-11"
          >
            <ArrowLeft aria-hidden="true" size={20} />
            <span className="text-base">{t("Back", "戻る")}</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-pressed={saved}
              aria-label={saved ? t("Remove from favorites", "お気に入りから削除") : t("Save to favorites", "お気に入りに保存")}
              onClick={() => toggleFavorite({ id: sake.id, type: "sake", name: sake.name, nameJa: sake.nameJa, path })}
              className="p-2.5 rounded-lg hover:bg-card transition-colors min-h-11 min-w-11 flex items-center justify-center"
            >
              <Heart aria-hidden="true" size={20} className={saved ? "fill-(--sk-accent) text-(--sk-accent)" : "text-muted-foreground"} />
            </button>
            <button
              type="button"
              aria-label={t("Share", "シェア")}
              onClick={() => void share()}
              className="p-2.5 rounded-lg hover:bg-card transition-colors min-h-11 min-w-11 flex items-center justify-center"
            >
              <Share2 aria-hidden="true" size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Suspense fallback={null}>
          <OrderNotice />
        </Suspense>

        {/* Hero */}
        <div className={`grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12 ${FADE_UP}`}>
          <div className="space-y-6">
            <div className="flex justify-center lg:justify-start mb-4">
              <div className="relative w-48 h-72 sm:w-56 sm:h-80 rounded-xl overflow-hidden bg-card border border-border shadow-lg">
                <SakeImage image={getBottleImage(sake.type)} className="size-full object-cover" sizes="224px" priority />
                <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1.5 text-sm font-medium rounded-full bg-card border border-border text-foreground">{sake.type}</span>
              <QPRBadge tier={sake.qprTier} score={sake.qprUS} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">{t(sake.name, sake.nameJa)}</h1>
              <p className="mt-2 text-xl text-muted-foreground font-light">{t(sake.nameJa, sake.name)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-base text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Wine aria-hidden="true" size={16} className="text-(--sk-accent)" />
                {t(sake.brewery, sake.breweryJa)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin aria-hidden="true" size={16} className="text-(--sk-accent)" />
                {t(sake.prefecture, sake.prefectureJa)}
              </span>
            </div>
            <p className="text-lg leading-relaxed text-muted-foreground">{t(sake.description, sake.descriptionJa)}</p>
            <div className="inline-flex items-center gap-3 px-4 py-3 bg-card rounded-lg border border-border">
              <span className="font-sk-jp text-3xl" lang="ja">
                {sake.labelKanji}
              </span>
              <span className="text-sm text-muted-foreground">{t("Look for this on the label", "ラベルでこれを探してください")}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 text-center">{t("Flavor Profile", "味わいプロフィール")}</h2>
              <FlavorRadar scores={flavorScores} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: t("Polish Ratio", "精米歩合"), value: `${sake.ricePolishRatio}%`, icon: Droplets },
                { label: t("SMV", "日本酒度"), value: sake.smv > 0 ? `+${sake.smv}` : `${sake.smv}`, icon: Flame },
                { label: t("Acidity", "酸度"), value: sake.acidity.toFixed(1), icon: Droplets },
                { label: t("ABV", "アルコール度"), value: `${sake.abv}%`, icon: Wine },
              ].map((stat) => (
                <div key={stat.label} className="bg-card rounded-lg border border-border p-4 text-center">
                  <stat.icon aria-hidden="true" size={18} className="mx-auto mb-2 text-(--sk-accent)" />
                  <div className="text-xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Purchase */}
        <section aria-label={t("Buy", "購入")} className={`bg-card rounded-xl border border-border p-6 sm:p-8 mb-12 ${FADE_UP} delay-200`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-foreground">${sake.priceUS.toFixed(0)}</span>
                <span className="text-lg text-muted-foreground line-through">${(sake.priceUS * 1.3).toFixed(0)}</span>
                <span className="text-sm text-emerald-400 font-medium">{t("QPR Value", "QPR価値")}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t(
                  `Japan retail: $${sake.priceJapan} — US markup: ${markup}%`,
                  `日本小売: $${sake.priceJapan} — 米国マークアップ: ${markup}%`,
                )}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Truck aria-hidden="true" size={14} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t("Free shipping over $75", "$75以上で送料無料")}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  type="button"
                  aria-label={t("Fewer", "減らす")}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 hover:bg-background transition-colors min-h-11 min-w-11 flex items-center justify-center"
                >
                  <Minus aria-hidden="true" size={16} />
                </button>
                <span aria-live="polite" className="px-4 py-3 text-lg font-medium text-foreground min-w-12 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label={t("More", "増やす")}
                  onClick={() => setQuantity((q) => Math.min(MAX_QTY, q + 1))}
                  className="p-3 hover:bg-background transition-colors min-h-11 min-w-11 flex items-center justify-center"
                >
                  <Plus aria-hidden="true" size={16} />
                </button>
              </div>

              <div className="flex flex-wrap gap-3 flex-1 sm:flex-none">
                <button
                  type="button"
                  onClick={addToCart}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-border hover:bg-background transition-colors text-foreground font-medium min-h-12"
                >
                  {addedToCart ? <Check aria-hidden="true" size={18} className="text-emerald-400" /> : <ShoppingCart aria-hidden="true" size={18} />}
                  {addedToCart ? t("Added", "追加済") : t("Cart", "カート")}
                </button>
                {!checkoutOpen ? (
                  <p className="flex-1 sm:flex-none self-center text-sm text-muted-foreground">
                    {t("Ordering opens soon. Please check back.", "ご注文の受付はまもなく開始します。またお越しください。")}
                  </p>
                ) : signedIn ? (
                  <button
                    type="button"
                    onClick={() => void buyNow()}
                    disabled={buying}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium min-h-12 transition-all bg-(--sk-accent) text-(--sk-on-accent) disabled:opacity-70"
                  >
                    {buying ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <ShoppingCart aria-hidden="true" size={18} />}
                    {t("Buy Now", "今すぐ購入")}
                  </button>
                ) : (
                  <Link
                    href={signInHref}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium min-h-12 transition-all bg-(--sk-accent) text-(--sk-on-accent)"
                  >
                    <ShoppingCart aria-hidden="true" size={18} />
                    {t("Buy Now", "今すぐ購入")}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className={`bg-card rounded-xl border border-border p-6 ${FADE_UP} delay-300`}>
            <h2 className="text-xl font-semibold text-foreground mb-4">{t("Aroma & Flavor Notes", "香りと味わい")}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">{t("Aroma", "香り")}</h3>
                <div className="flex flex-wrap gap-2">
                  {sake.aromaProfile.map((aroma, i) => (
                    <span key={aroma} className="px-3 py-1.5 text-sm rounded-full bg-background border border-border text-foreground">
                      {t(aroma, sake.aromaProfileJa[i] || aroma)}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">{t("Flavor", "味わい")}</h3>
                <div className="flex flex-wrap gap-2">
                  {sake.flavorProfile.map((flavor, i) => (
                    <span key={flavor} className="px-3 py-1.5 text-sm rounded-full bg-background border border-border text-foreground">
                      {t(flavor, sake.flavorProfileJa[i] || flavor)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={`bg-card rounded-xl border border-border p-6 ${FADE_UP} delay-400`}>
            <h2 className="text-xl font-semibold text-foreground mb-4">{t("Serving & Pairing", "提供方法とペアリング")}</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Thermometer aria-hidden="true" size={20} className="mt-0.5 shrink-0 text-(--sk-accent)" />
                <div>
                  <h3 className="font-medium text-foreground">{t("Temperature", "温度")}</h3>
                  <p className="text-muted-foreground">{t(sake.servingTemp, sake.servingTempJa)}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">{t("Food Pairings", "フードペアリング")}</h3>
                <div className="flex flex-wrap gap-2">
                  {sake.pairingEn.map((pairing, i) => (
                    <span key={pairing} className="px-3 py-1.5 text-sm rounded-full bg-background border border-border text-foreground">
                      {t(pairing, sake.pairingJa[i] || pairing)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={`bg-card rounded-xl border border-border p-6 ${FADE_UP} delay-500`}>
            <h2 className="text-xl font-semibold text-foreground mb-4">{t("Rice & Brewing", "米と醸造")}</h2>
            <dl className="space-y-3">
              {[
                [t("Rice Variety", "米品種"), t(sake.riceVariety, sake.riceVarietyJa)],
                [t("Polish Ratio", "精米歩合"), `${sake.ricePolishRatio}%`],
                [t("Classification", "分類"), t(sake.type, sake.typeJa)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center gap-4 py-2 border-b border-border/50">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-medium text-foreground text-right">{value}</dd>
                </div>
              ))}
              <div className="flex justify-between items-center gap-4 py-2">
                <dt className="text-muted-foreground">{t("US Availability", "米国入手性")}</dt>
                <dd className="font-medium text-foreground capitalize">{sake.usAvailability}</dd>
              </div>
            </dl>
          </div>

          {supplyChain && (
            <div className={`bg-card rounded-xl border border-border p-6 ${FADE_UP} delay-600`}>
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Leaf aria-hidden="true" size={20} className="text-(--sk-accent)" />
                {t("Carbon Footprint", "カーボンフットプリント")}
              </h2>
              <dl className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <dt className="text-muted-foreground">{t("CO₂ per Bottle", "ボトルあたりCO₂")}</dt>
                  <dd className="font-medium text-foreground">{carbon.toFixed(1)} kg</dd>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <dt className="text-muted-foreground">{t("Carbon Tier", "カーボンティア")}</dt>
                  <dd
                    className={
                      carbon < 1.5
                        ? "font-medium text-emerald-400"
                        : carbon < 3.0
                          ? "font-medium text-green-400"
                          : carbon < 5.0
                            ? "font-medium text-amber-400"
                            : "font-medium text-red-400"
                    }
                  >
                    {carbon < 1.5 ? "Ultra-Low" : carbon < 3.0 ? "Low" : carbon < 5.0 ? "Medium" : "High"}
                  </dd>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <dt className="text-muted-foreground">{t("Days from Origin", "原産地からの日数")}</dt>
                  <dd className="font-medium text-foreground text-right text-sm">{supplyChain.totalDaysFromOrigin} days</dd>
                </div>
              </dl>
              <Link
                href={sk(`/supply-chain?sake=${encodeURIComponent(sake.id)}`)}
                className="inline-flex items-center gap-2 text-sm mt-2 hover:underline text-(--sk-accent)"
              >
                {t("View Full Supply Chain", "完全なサプライチェーンを見る")}
                <ExternalLink aria-hidden="true" size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* Where to buy */}
        <section className={`bg-card rounded-xl border border-border p-6 sm:p-8 mb-12 ${FADE_UP} delay-700`}>
          <h2 className="text-xl font-semibold text-foreground mb-6">{t("Where to Buy", "購入先")}</h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sake.onlineRetailers.map((retailerName) => {
              const retailer = usRetailers.find(
                (r) =>
                  r.name.toLowerCase().includes(retailerName.toLowerCase()) || retailerName.toLowerCase().includes(r.name.toLowerCase()),
              );
              return (
                <li key={retailerName} className="flex items-center justify-between gap-2 p-4 bg-background rounded-lg border border-border">
                  <div>
                    <div className="font-medium text-foreground">{retailerName}</div>
                    {retailer && <div className="text-sm text-muted-foreground capitalize">{retailer.type}</div>}
                  </div>
                  {retailer?.url ? (
                    <a
                      href={retailer.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${retailerName} ${t("(opens in a new tab)", "（新しいタブで開く）")}`}
                      className="p-2 rounded-lg hover:bg-card transition-colors min-h-11 min-w-11 flex items-center justify-center"
                    >
                      <ExternalLink aria-hidden="true" size={18} className="text-(--sk-accent)" />
                    </a>
                  ) : (
                    <Link
                      href={sk(`/retailer-finder?sake=${encodeURIComponent(sake.name)}`)}
                      aria-label={`${t("Find", "探す")} ${retailerName}`}
                      className="p-2 rounded-lg hover:bg-card transition-colors min-h-11 min-w-11 flex items-center justify-center"
                    >
                      <MapPin aria-hidden="true" size={18} className="text-(--sk-accent)" />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="mt-4 text-center">
            <Link
              href={sk(`/retailer-finder?sake=${encodeURIComponent(sake.name)}`)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-border hover:bg-background transition-colors text-foreground font-medium min-h-12"
            >
              <MapPin aria-hidden="true" size={18} className="text-(--sk-accent)" />
              {t("Find Nearby Retailers by ZIP Code", "ZIP コードで近くの小売店を検索")}
            </Link>
          </div>
        </section>

        {/* Explore more */}
        <div className={`text-center space-y-4 ${FADE_UP} delay-800`}>
          <h2 className="text-xl font-semibold text-foreground">{t("Continue Exploring", "探索を続ける")}</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { href: "/qpr", en: "QPR Rankings", ja: "QPRランキング" },
              { href: "/ordering-guide", en: "Ordering Guide", ja: "注文ガイド" },
              { href: "/supply-chain", en: "Supply Chain", ja: "サプライチェーン" },
            ].map((l) => (
              <Link
                key={l.href}
                href={sk(l.href)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-border hover:bg-card transition-colors text-foreground min-h-12"
              >
                {t(l.en, l.ja)}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="kintsugi-line" />
      <section className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SakeReviews sakeId={sake.id} />
      </section>
    </div>
  );
}
