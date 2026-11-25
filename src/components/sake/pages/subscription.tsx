"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowRight,
  Calendar,
  Check,
  Crown,
  FlaskConical,
  Gift,
  Heart,
  Loader2,
  Package,
  Shield,
  Sparkles,
  Star,
  Truck,
  Wine,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/sake/motion";
import { useLanguage, useMember } from "@/components/sake/sake-providers";
import { getMySubscription, startSubscriptionCheckout, type MySubscription } from "@/app/sake/actions";
import { SUBSCRIPTION_PLANS, type SubscriptionPlan } from "@/lib/content/sake/products";
import { sk } from "@/lib/content/sake/nav";

// Ported from the Sake app's client/src/pages/Subscription.tsx (2026-11-26): the monthly box page
// with its three tiers (Explorer, Connoisseur, Omakase), copy and colors unchanged. Plans come from
// src/lib/content/sake/products.ts (the app fetched the same static list from its server); the
// member's plan and checkout come from src/app/sake/actions.ts.
// Changed (rule 20): checkout opens in the same tab (the app's window.open after a server call was
// blocked as a pop-up by most browsers); signed-out visitors go to this site's sign-in and come back
// here; while ordering is closed (SAKE_CHECKOUT_ENABLED, see sake-stripe.ts) each plan says
// "Coming Soon" instead of a button that can't work; the test-card notice only shows with Stripe test
// keys; its 🧪 emoji is a flask icon; "Processing..." is a spinner.

const SIGN_IN_HREF = `/login?next=${encodeURIComponent(sk("/subscription"))}`;

const TIER_ICONS: Record<SubscriptionPlan["tier"], LucideIcon> = {
  explorer: Package,
  connoisseur: Star,
  omakase: Crown,
};

/** The app's TIER_COLORS (accent, 8% background, 30% border), as whole class strings. */
const TIER_STYLES: Record<
  SubscriptionPlan["tier"],
  { card: string; badge: string; iconBox: string; accent: string; solidButton: string; outlineButton: string }
> = {
  explorer: {
    card: "bg-[oklch(0.78_0.12_85/0.08)] border border-[oklch(0.78_0.12_85/0.3)]",
    badge: "bg-[oklch(0.78_0.12_85)] text-[oklch(0.15_0.02_270)]",
    iconBox: "bg-[oklch(0.78_0.12_85/0.12)] border border-[oklch(0.78_0.12_85/0.3)]",
    accent: "text-[oklch(0.78_0.12_85)]",
    solidButton: "bg-[oklch(0.78_0.12_85)] text-[oklch(0.15_0.02_270)]",
    outlineButton: "bg-transparent text-[oklch(0.78_0.12_85)] border border-[oklch(0.78_0.12_85/0.3)]",
  },
  connoisseur: {
    card: "bg-[oklch(0.70_0.15_30/0.08)] border border-[oklch(0.70_0.15_30/0.3)] ring-2 ring-[oklch(0.70_0.15_30)]",
    badge: "bg-[oklch(0.70_0.15_30)] text-[oklch(0.15_0.02_270)]",
    iconBox: "bg-[oklch(0.70_0.15_30/0.12)] border border-[oklch(0.70_0.15_30/0.3)]",
    accent: "text-[oklch(0.70_0.15_30)]",
    solidButton: "bg-[oklch(0.70_0.15_30)] text-[oklch(0.15_0.02_270)]",
    outlineButton: "bg-transparent text-[oklch(0.70_0.15_30)] border border-[oklch(0.70_0.15_30/0.3)]",
  },
  omakase: {
    card: "bg-[oklch(0.75_0.10_310/0.08)] border border-[oklch(0.75_0.10_310/0.3)]",
    badge: "bg-[oklch(0.75_0.10_310)] text-[oklch(0.15_0.02_270)]",
    iconBox: "bg-[oklch(0.75_0.10_310/0.12)] border border-[oklch(0.75_0.10_310/0.3)]",
    accent: "text-[oklch(0.75_0.10_310)]",
    solidButton: "bg-[oklch(0.75_0.10_310)] text-[oklch(0.15_0.02_270)]",
    outlineButton: "bg-transparent text-[oklch(0.75_0.10_310)] border border-[oklch(0.75_0.10_310/0.3)]",
  },
};

export function SakeSubscription({ checkoutOpen, testMode }: { checkoutOpen: boolean; testMode: boolean }) {
  const { t } = useLanguage();
  const { signedIn, loaded } = useMember();
  const router = useRouter();

  const [mySubscription, setMySubscription] = useState<MySubscription>(null);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);

  useEffect(() => {
    if (!signedIn) return;
    let live = true;
    getMySubscription()
      .then((s) => live && setMySubscription(s))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [signedIn]);

  useEffect(() => {
    // Stripe's return (?success=true / ?cancelled=true), read once in the browser so the page itself
    // stays static and fully server-rendered.
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") toast.success(t("Subscription activated! Welcome to the family.", "サブスクリプションが有効化されました！ファミリーへようこそ。"));
    if (params.get("cancelled") === "true") toast.info(t("Subscription checkout cancelled.", "サブスクリプションのチェックアウトがキャンセルされました。"));
    // Once per visit, in the language the page opened in.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubscribe = async (planId: string) => {
    if (!signedIn) {
      router.push(SIGN_IN_HREF);
      return;
    }
    setPendingPlan(planId);
    try {
      const result = await startSubscriptionCheckout(planId);
      if (!result.ok) {
        if (result.signedOut) router.push(SIGN_IN_HREF);
        else toast.error(result.error || t("Failed to create checkout", "チェックアウトの作成に失敗"));
        setPendingPlan(null);
        return;
      }
      toast.info(t("Redirecting to checkout...", "チェックアウトにリダイレクト中..."));
      window.location.assign(result.data.url);
    } catch {
      toast.error(t("Failed to create checkout", "チェックアウトの作成に失敗"));
      setPendingPlan(null);
    }
  };

  const steps = [
    { icon: Wine, title: t("Choose Your Tier", "ティアを選ぶ"), desc: t("Explorer, Connoisseur, or Omakase", "探検家、鑑定家、またはおまかせ") },
    { icon: Heart, title: t("Share Your Taste", "好みを共有"), desc: t("We learn what you love", "あなたの好みを学びます") },
    { icon: Package, title: t("Monthly Delivery", "毎月配送"), desc: t("3 bottles at your door", "3本をお届け") },
    { icon: Sparkles, title: t("Discover & Rate", "発見＆評価"), desc: t("Rate, review, explore", "評価、レビュー、探索") },
  ];
  const trust = [
    { icon: Truck, title: t("Free Shipping", "送料無料"), desc: t("Every box, every month", "毎月、毎箱") },
    { icon: Calendar, title: t("Cancel Anytime", "いつでも解約"), desc: t("No commitment, no penalties", "縛りなし、ペナルティなし") },
    { icon: Shield, title: t("Satisfaction Guaranteed", "満足保証"), desc: t("Don't love it? We'll make it right", "気に入らなければ対応します") },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-[oklch(0.12_0.03_270)] to-background" />
        <div className="relative z-10 max-w-350 mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-800 fill-mode-both">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6 bg-[oklch(0.78_0.12_85/0.1)] border border-[oklch(0.78_0.12_85/0.3)] text-[oklch(0.78_0.12_85)]">
              <Gift aria-hidden="true" size={16} />
              {t("Monthly Curated Sake", "月刊キュレーション酒")}
            </div>
            <h1 className="font-sk-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              {t("The Sake", "酒の")} <span className="gold-shimmer">{t("Subscription", "サブスクリプション")}</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t(
                "Three bottles. Every month. Curated by obsessives who taste 500+ sakes a year. No supermarket sake. No compromises.",
                "毎月3本。年間500本以上を試飲する専門家が厳選。スーパーの酒はなし。妥協もなし。",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 border-t border-border">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-sk-display text-2xl font-semibold text-foreground text-center mb-12">{t("How It Works", "仕組み")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <Reveal key={step.title} enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both" delay={i * 0.1} className="text-center">
                <div className="size-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-[oklch(0.78_0.12_85/0.1)] border border-[oklch(0.78_0.12_85/0.3)]">
                  <step.icon aria-hidden="true" size={24} className="text-[oklch(0.78_0.12_85)]" />
                </div>
                <h3 className="font-semibold text-foreground text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Active subscription */}
      {mySubscription && mySubscription.status === "active" && (
        <section className="py-6 border-t border-border">
          <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-6 rounded-xl border border-border bg-card flex flex-col sm:flex-row items-center gap-4">
              <Shield aria-hidden="true" size={24} className="text-[oklch(0.55_0.15_145)]" />
              <div className="flex-1">
                <p className="font-semibold text-foreground">
                  {t("You have an active subscription", "アクティブなサブスクリプションがあります")}:{" "}
                  {mySubscription.planTier.charAt(0).toUpperCase() + mySubscription.planTier.slice(1)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("Manage your subscription in your Stripe dashboard", "Stripeダッシュボードでサブスクリプションを管理")}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Plans */}
      <section className="py-16 border-t border-border">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-sk-display text-2xl font-semibold text-foreground text-center mb-4">{t("Choose Your Journey", "旅を選ぶ")}</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            {t(
              "All plans include free shipping, tasting guides, and access to our community.",
              "全プランに送料無料、テイスティングガイド、コミュニティへのアクセスが含まれます。",
            )}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {SUBSCRIPTION_PLANS.map((plan, i) => {
              const style = TIER_STYLES[plan.tier];
              const Icon = TIER_ICONS[plan.tier];
              const isPopular = plan.tier === "connoisseur";
              const features = t(plan.features.join("|||"), plan.featuresJa.join("|||")).split("|||");
              const pending = pendingPlan === plan.id;
              return (
                <Reveal
                  key={plan.id}
                  enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
                  delay={i * 0.15}
                  className={`relative rounded-2xl p-6 lg:p-8 flex flex-col ${style.card}`}
                >
                  {isPopular && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold ${style.badge}`}>
                      {t("Most Popular", "一番人気")}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`size-10 rounded-lg flex items-center justify-center ${style.iconBox}`}>
                      <Icon aria-hidden="true" size={20} className={style.accent} />
                    </div>
                    <h3 className="font-semibold text-foreground text-lg">{t(plan.name, plan.nameJa)}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{t(plan.description, plan.descriptionJa)}</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-foreground">${(plan.priceCentsMonthly / 100).toFixed(0)}</span>
                    <span className="text-muted-foreground text-sm">/{t("month", "月")}</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-foreground/80">
                        <Check aria-hidden="true" size={16} className={`mt-0.5 shrink-0 ${style.accent}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {checkoutOpen ? (
                    <button
                      type="button"
                      onClick={() => void handleSubscribe(plan.id)}
                      disabled={pendingPlan !== null || !loaded}
                      className={`w-full py-3 rounded-lg text-sm font-semibold transition-all min-h-12 flex items-center justify-center gap-2 disabled:opacity-70 ${isPopular ? style.solidButton : style.outlineButton}`}
                    >
                      {pending && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
                      {t("Subscribe Now", "今すぐ登録")}
                      {!pending && <ArrowRight aria-hidden="true" size={16} />}
                    </button>
                  ) : (
                    <div className={`w-full py-3 rounded-lg text-sm font-semibold min-h-12 flex items-center justify-center gap-2 ${style.outlineButton}`}>
                      {t("Coming Soon", "近日公開")}
                    </div>
                  )}
                </Reveal>
              );
            })}
          </div>
          {!checkoutOpen && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              {t("Ordering opens soon. Please check back.", "ご注文の受付はまもなく開始します。また後でご確認ください。")}
            </p>
          )}
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 border-t border-border">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {trust.map((item) => (
              <div key={item.title} className="flex flex-col items-center">
                <item.icon aria-hidden="true" size={28} className="mb-3 text-muted-foreground" />
                <h3 className="font-semibold text-foreground text-base">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Test card notice (Stripe test keys only) */}
      {checkoutOpen && testMode && (
        <section className="py-8 border-t border-border">
          <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-4 rounded-xl border border-dashed border-border text-center">
              <p className="text-sm text-muted-foreground inline-flex items-center justify-center gap-2">
                <FlaskConical aria-hidden="true" className="size-4 shrink-0" />
                {t(
                  "Test Mode: Use card number 4242 4242 4242 4242 with any future expiry and CVC.",
                  "テストモード: カード番号 4242 4242 4242 4242 を使用（有効期限は未来の日付、CVCは任意）",
                )}
              </p>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
