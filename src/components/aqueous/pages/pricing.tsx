"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Droplets,
  Heart,
  Globe,
  ArrowRight,
  Check,
  Sparkles,
  TreePine,
  Shield,
  Gift,
  Star,
  Share2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { ShareButton, FloatingShare } from "@/components/aqueous/share-button";
import { useMember, useReferral } from "@/components/aqueous/aqueous-providers";
import { Reveal } from "@/components/aqueous/motion";
import { Button } from "@/components/aqueous/ui";
import { getMyCredit, startCheckout } from "@/app/aqueous/actions";
import { aq } from "@/lib/content/aqueous/nav";

// Ported from the Aqueous app's client/src/pages/Pricing.tsx (2026-11-24): the conscious commerce
// model ($20 first report, $5/mo, profits to the indigenous water stewards foundation, referral
// rewards). Navigation/Footer/SEOHead come from the /aqueous layout and page metadata. trpc
// stripe.getCredit / stripe.createCheckout → getMyCredit / startCheckout server actions; useAuth →
// useMember; getLoginUrl() → /login?next=/aqueous/pricing. The app opened Stripe in a new tab
// (window.open); here the same tab goes to checkout (window.location.assign), as the brief asks.

type Product = "report" | "subscription";

const SIGN_IN_HREF = `/login?next=${encodeURIComponent(aq("/pricing"))}`;

/** The app's motion.div initial={{ width: 0 }} animate={{ width }} bar: a CSS width transition. */
function ProgressFill({ percent, className }: { percent: number; className: string }) {
  return <div className={className} style={{ width: `${percent}%` }} />;
}

export function Pricing() {
  const { stats, isReferred } = useReferral();
  const { signedIn, loaded } = useMember();
  const router = useRouter();
  const [credit, setCredit] = useState(0);
  const [busy, setBusy] = useState<Product | null>(null);

  // trpc.stripe.getCredit.useQuery(undefined, { enabled: isAuthenticated })
  useEffect(() => {
    if (!signedIn) return;
    let live = true;
    getMyCredit()
      .then((c) => live && setCredit(c))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [signedIn]);

  const goSignIn = () => {
    toast("Please sign in first to purchase.");
    router.push(SIGN_IN_HREF);
  };

  const handleCheckout = async (productType: Product) => {
    if (loaded && !signedIn) {
      goSignIn();
      return;
    }
    setBusy(productType);
    try {
      const result = await startCheckout(productType, true);
      if (result.ok) {
        toast("Redirecting to checkout...");
        window.location.assign(result.data.url);
        return;
      }
      if (result.signedOut) {
        setBusy(null);
        goSignIn();
        return;
      }
      toast.error(result.error || "Failed to start checkout");
    } catch {
      toast.error("Failed to start checkout");
    }
    setBusy(null);
  };

  const signups = stats?.signups ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="sacred-geo-bg absolute inset-0 opacity-3" />
        <div className="container relative">
          {/* was motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} */}
          <div className="max-w-3xl mx-auto text-center animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Conscious Commerce
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 font-aq-display">
              Cross-Reference Scores Are <span className="text-primary">Free. Forever.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
              Your personalized AWI report — tuned to your body, your budget, your values, your location — that&apos;s
              where the magic lives. And every dollar flows toward a world that flows better.
            </p>
            {isReferred && (
              // was motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 text-green-700 text-sm font-medium mb-4 animate-in zoom-in-90 duration-500 fill-mode-both">
                <Gift className="w-4 h-4" />
                You have a $5 referral discount applied!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free Tier */}
            <Reveal
              enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
              className="glass-card border border-border/40 rounded-2xl p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-1 font-aq-display">Open Source</h3>
              <p className="text-3xl font-bold mb-1">Free</p>
              <p className="text-sm text-muted-foreground mb-6">Forever. No tricks.</p>
              <ul className="space-y-3 mb-8">
                {[
                  "Cross-reference scores from all public sources",
                  "Browse all water products & tap water data",
                  "QPR methodology — fully transparent",
                  "Wall of Shame & plastic truth articles",
                  "Consumer guides & co-creator ecosystem",
                  "The Gem Spark journey & philosophy",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href={aq("/explore")}>Start Exploring</Link>
              </Button>
            </Reveal>

            {/* First Report */}
            <Reveal
              enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
              delay={0.1}
              className="glass-card border-2 border-primary/30 rounded-2xl p-8 relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                MOST POPULAR
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-1 font-aq-display">Your First Report</h3>
              <div className="flex items-baseline gap-1 mb-1">
                {isReferred ? (
                  <>
                    <p className="text-3xl font-bold text-primary">$15</p>
                    <p className="text-lg text-muted-foreground line-through">$20</p>
                  </>
                ) : (
                  <p className="text-3xl font-bold">$20</p>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-6">One-time. Your water, decoded.</p>
              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Free, plus:",
                  "Personalized AWI score (1 = your perfection)",
                  "Location-specific water quality deep dive",
                  "Custom filter & water recommendations",
                  "Price-to-value optimization for your budget",
                  "Carbon footprint analysis of your water habits",
                  "Grant Study wellness alignment score",
                  "Downloadable PDF report",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className={i === 0 ? "font-semibold" : ""}>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" onClick={() => handleCheckout("report")} disabled={busy !== null}>
                {busy === "report" && <Loader2 className="size-4 animate-spin" />}
                Get Your Report
              </Button>
              {credit > 0 && (
                <p className="text-xs text-center text-green-600 mt-2">
                  You have ${credit.toFixed(2)} in referral credits — applied at checkout!
                </p>
              )}
            </Reveal>

            {/* Monthly */}
            <Reveal
              enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
              delay={0.2}
              className="glass-card border border-border/40 rounded-2xl p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-1 font-aq-display">Flow State</h3>
              <p className="text-3xl font-bold mb-1">
                $5<span className="text-base font-normal text-muted-foreground">/mo</span>
              </p>
              <p className="text-sm text-muted-foreground mb-6">Continuous evolution.</p>
              <ul className="space-y-3 mb-8">
                {[
                  "Everything in First Report, plus:",
                  "Unlimited personalized reports — any water, anytime",
                  "Real-time AWI recalculation as data updates",
                  "New water product alerts matching your profile",
                  "Seasonal water quality change notifications",
                  "Community insights & crowd-sourced data",
                  "Present → Healed State progress tracking",
                  "Priority access to new features",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className={i === 0 ? "font-semibold" : ""}>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleCheckout("subscription")}
                disabled={busy !== null}
              >
                {busy === "subscription" && <Loader2 className="size-4 animate-spin" />}
                Join Flow State
              </Button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Where Your Money Goes */}
      <section className="py-20 bg-primary/3">
        <div className="container">
          <Reveal
            enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-aq-display">Where Every Dollar Flows</h2>
            <p className="text-muted-foreground">
              This isn&apos;t a business extracting value. It&apos;s a vessel channeling resources toward the people
              who&apos;ve protected water for millennia and the future that needs them.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: <TreePine className="w-6 h-6" />,
                title: "Indigenous Water Stewards",
                pct: "40%",
                desc: "Supporting tribal communities who created and managed sacred water sources for generations. Land profits flow directly to their sovereignty.",
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: "Regenerative Foundation",
                pct: "25%",
                desc: "Funding efforts for sustainable, regenerative living — from clean water access to community resilience programs worldwide.",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Open Data & Research",
                pct: "20%",
                desc: "Maintaining open-source water quality databases, independent testing, and research that belongs to everyone.",
              },
              {
                icon: <Droplets className="w-6 h-6" />,
                title: "Platform Operations",
                pct: "15%",
                desc: "Keeping the lights on, the data fresh, and the platform free for everyone. Lean operations, maximum impact.",
              },
            ].map((item, i) => (
              <Reveal
                key={i}
                enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
                delay={i * 0.1}
                className="glass-card border border-border/40 rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 text-primary">
                  {item.icon}
                </div>
                <p className="text-2xl font-bold text-primary mb-1 font-aq-display">{item.pct}</p>
                <h4 className="font-semibold text-sm mb-2">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </Reveal>
            ))}
          </div>

          {/* was motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} */}
          <Reveal enter="animate-in fade-in duration-500 fill-mode-both">
            <p className="text-center text-sm text-muted-foreground mt-8 max-w-xl mx-auto italic">
              &quot;We love you. We love the Earth. We want you to love yourself by preparing and being the best global
              citizen — reducing your carbon footprint and moving towards the great simplification, enabling all of us to
              feed each other and create abundance.&quot;
            </p>
          </Reveal>
        </div>
      </section>

      {/* Referral Program */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Reveal
              enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-aq-display">The Ripple Effect</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Consciousness spreads like water. Share the flow and everyone rises.
              </p>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  step: "01",
                  title: "Share Your Code",
                  desc: "Every page, every score, every insight has a share button. Your unique referral code travels with every link.",
                  icon: <Share2 className="w-5 h-5" />,
                },
                {
                  step: "02",
                  title: "Friends Get $5 Off",
                  desc: "Each person who clicks your link gets $5 off their first personalized AWI report. Instant value, no strings.",
                  icon: <Gift className="w-5 h-5" />,
                },
                {
                  step: "03",
                  title: "You Earn Rewards",
                  desc: "You get $5 credit for every sign-up. Refer 10 people who sign up and unlock a completely free personalized report.",
                  icon: <Sparkles className="w-5 h-5" />,
                },
              ].map((item, i) => (
                <Reveal
                  key={i}
                  enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
                  delay={i * 0.1}
                  className="text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                    {item.icon}
                  </div>
                  <div className="text-xs font-mono text-primary/60 mb-2">{item.step}</div>
                  <h4 className="font-bold mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </Reveal>
              ))}
            </div>

            {/* Your referral card */}
            <ShareButton variant="card" className="max-w-md mx-auto" />

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Your progress: <span className="font-bold text-foreground">{signups}/10</span> sign-ups toward your free
                report
              </p>
              <div className="w-full max-w-xs mx-auto mt-2 h-2 bg-muted/30 rounded-full overflow-hidden">
                {/* was motion.div width 0 → % (duration 1, delay 0.5) */}
                <ProgressFill
                  percent={Math.min((signups / 10) * 100, 100)}
                  className="h-full bg-primary rounded-full transition-[width] duration-1000 delay-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation CTA */}
      <section className="py-16 bg-primary/3">
        <div className="container">
          <Reveal
            enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
            className="max-w-2xl mx-auto text-center"
          >
            <Heart className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3 font-aq-display">Or Simply Give</h3>
            <p className="text-muted-foreground mb-6">
              Not ready for a report? That&apos;s beautiful too. If the mission resonates, a donation of any size goes
              directly to the foundation — enabling indigenous water stewardship, regenerative living programs, and
              open-source water research for everyone.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[5, 10, 25, 50].map((amt) => (
                <Button
                  key={amt}
                  variant="outline"
                  onClick={() => {
                    toast("Donation portal coming soon — thank you for your generosity!");
                  }}
                  className="min-w-20"
                >
                  ${amt}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  toast("Custom donation portal coming soon!");
                }}
              >
                Custom
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              100% of donations flow to the Aqueous Foundation for indigenous water stewardship and regenerative futures.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16">
        <div className="container text-center">
          <p className="text-muted-foreground mb-4">Ready to know your water?</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild>
              <Link href={aq("/tap-water")}>
                Find Your Water <ArrowRight aria-hidden="true" className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={aq("/manifesto")}>Read the Manifesto</Link>
            </Button>
          </div>
        </div>
      </section>

      <FloatingShare />
    </div>
  );
}
