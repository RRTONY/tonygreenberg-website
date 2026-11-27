"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Crown, Loader2, Lock, Settings, Shield, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { AudioController } from "@/components/liquidsun/liquidsun-effects";
import { useMember } from "@/components/liquidsun/liquidsun-providers";
import { Button } from "@/components/liquidsun/ui";
import { openBillingPortal, startPremiumCheckout } from "@/app/liquid-sun/actions";
import { FREE_FEATURES, PREMIUM_FEATURES, type LiquidsunPlan } from "@/lib/content/liquidsun/premium";

// Ported from the LiquidSun app's client/src/pages/Premium.tsx (2026-11-21). Same plans ($9.99/mo,
// $79.99/yr), copy and layout. Checkout is real Stripe (owner, 2026-11-21): startPremiumCheckout
// creates a Checkout Session over Stripe's REST API and the browser goes there in the same tab (the
// app opened a new tab, which pop-up blockers stop after an await). "Manage Subscription" opens
// Stripe's customer portal. Premium status comes from the webhook (liquidsun_subscriptions).
// Signing in is this site's /login (Manus OAuth before). The test-card hint shows only while the
// site runs on a Stripe test key (`testMode`, read on the server). Plan choice is two buttons, not a
// form, so no Formik. Entrances are the app's framer-motion timings as tw-animate classes.

const LOGIN_HREF = "/login?next=/liquid-sun/premium";

const PLAN_SELECTED =
  "relative cursor-pointer rounded-2xl border border-amber-500/40 bg-amber-500/10 p-8 text-left shadow-xl ring-2 shadow-amber-500/10 ring-amber-500/50 transition-all duration-500 animate-in fade-in slide-in-from-bottom-[30px] fill-mode-both";
const PLAN_IDLE =
  "relative cursor-pointer rounded-2xl border border-white/10 bg-white/2 p-8 text-left transition-all duration-500 hover:border-white/20 animate-in fade-in slide-in-from-bottom-[30px] fill-mode-both";

export function Premium({ testMode = false }: { testMode?: boolean }) {
  const { signedIn, isPremium, subscriptionStatus } = useMember();
  const [selectedPlan, setSelectedPlan] = useState<LiquidsunPlan>("annual");
  const [pending, setPending] = useState<"checkout" | "portal" | null>(null);

  async function handleSubscribe() {
    setPending("checkout");
    try {
      const result = await startPremiumCheckout(selectedPlan);
      if (result.ok) {
        toast.info("Redirecting to secure checkout...");
        window.location.assign(result.data.url);
        return;
      }
      toast.error(result.error || "Failed to create checkout session");
    } catch {
      toast.error("Failed to create checkout session");
    }
    setPending(null);
  }

  async function handleManage() {
    setPending("portal");
    try {
      const result = await openBillingPortal();
      if (result.ok) {
        window.location.assign(result.data.url);
        return;
      }
      toast.error(result.error || "Failed to open billing portal");
    } catch {
      toast.error("Failed to open billing portal");
    }
    setPending(null);
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-black font-sans text-white selection:bg-amber-500/30">
      <AudioController />

      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-b from-black via-amber-950/10 to-black" />
        <div className="ls-stardust pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay" />
        <div className="absolute top-1/4 left-1/2 h-[40vh] w-[60vw] -translate-x-1/2 rounded-full bg-amber-500/5 blur-[120px]" />
      </div>

      {/* HERO */}
      <section className="relative z-10 px-4 pt-32 pb-16">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="animate-in duration-800 fade-in fill-mode-both slide-in-from-bottom-[30px]">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5">
              <Crown aria-hidden="true" className="size-4 text-amber-400" />
              <span className="font-mono text-xs tracking-widest text-amber-400 uppercase">Premium Membership</span>
            </div>
            <h1 className="mb-8 font-serif text-5xl leading-[1.05] text-amber-50 md:text-7xl">
              Unlock the{" "}
              <span className="bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent italic">Full Experience</span>
            </h1>
            <p className="mx-auto max-w-2xl font-serif text-xl leading-relaxed font-light text-slate-400">
              Buy links, panel scores, the complete Flavor Matrix, price alerts, and community ratings. Support the mission to keep
              tequila honest.
            </p>
          </div>
        </div>
      </section>

      {/* ALREADY PREMIUM */}
      {isPremium && (
        <section className="relative z-10 px-4 py-8">
          <div className="container mx-auto max-w-lg">
            <div className="animate-in rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center fade-in zoom-in-95">
              <Crown aria-hidden="true" className="mx-auto mb-4 size-12 text-amber-400" />
              <h2 className="mb-2 font-serif text-2xl text-amber-50">You&apos;re Premium</h2>
              <p className="mb-6 font-light text-slate-400">Thank you for supporting independent tequila journalism.</p>
              {subscriptionStatus === "trialing" && <p className="mb-6 font-mono text-xs text-slate-500">Trial active</p>}
              <Button
                onClick={handleManage}
                disabled={pending !== null}
                aria-busy={pending === "portal"}
                className="bg-white/10 font-mono text-xs tracking-widest text-white uppercase hover:bg-white/20"
              >
                {pending === "portal" ? (
                  <Loader2 aria-hidden="true" className="mr-2 size-4 animate-spin" />
                ) : (
                  <Settings aria-hidden="true" className="mr-2 size-4" />
                )}
                Manage Subscription
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* PRICING CARDS */}
      {!isPremium && (
        <section className="relative z-10 px-4 py-16">
          <div className="container mx-auto max-w-4xl">
            <div className="mx-auto grid max-w-2xl gap-6 md:grid-cols-2" role="radiogroup" aria-label="Plan">
              <button
                type="button"
                role="radio"
                aria-checked={selectedPlan === "monthly"}
                onClick={() => setSelectedPlan("monthly")}
                className={`${selectedPlan === "monthly" ? PLAN_SELECTED : PLAN_IDLE} delay-100`}
              >
                <Zap aria-hidden="true" className={selectedPlan === "monthly" ? "mb-4 size-6 text-amber-400" : "mb-4 size-6 text-slate-600"} />
                <h2 className="mb-1 font-serif text-xl text-amber-50">Monthly</h2>
                <span className="mb-6 flex items-baseline gap-1">
                  <span className="font-serif text-4xl font-bold text-white">$9.99</span>
                  <span className="font-mono text-sm text-slate-500">/mo</span>
                </span>
                <span className="block font-mono text-sm text-slate-500">Cancel anytime. No commitment.</span>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={selectedPlan === "annual"}
                onClick={() => setSelectedPlan("annual")}
                className={`${selectedPlan === "annual" ? PLAN_SELECTED : PLAN_IDLE} delay-200`}
              >
                <span className="absolute -top-3 right-4">
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] tracking-widest text-emerald-400 uppercase">
                    Save 33%
                  </span>
                </span>
                <Sparkles aria-hidden="true" className={selectedPlan === "annual" ? "mb-4 size-6 text-amber-400" : "mb-4 size-6 text-slate-600"} />
                <h2 className="mb-1 font-serif text-xl text-amber-50">Annual</h2>
                <span className="mb-2 flex items-baseline gap-1">
                  <span className="font-serif text-4xl font-bold text-white">$79.99</span>
                  <span className="font-mono text-sm text-slate-500">/yr</span>
                </span>
                <span className="block font-mono text-sm text-slate-500">
                  <span className="text-slate-600 line-through">$119.88</span> <span className="text-amber-400">$6.67/mo</span>
                </span>
              </button>
            </div>

            <div className="mt-10 animate-in text-center delay-400 fade-in fill-mode-both slide-in-from-bottom-5">
              {signedIn ? (
                <Button
                  onClick={handleSubscribe}
                  disabled={pending !== null}
                  aria-busy={pending === "checkout"}
                  className="rounded-lg bg-amber-600 px-12 py-6 font-mono text-sm tracking-widest text-black uppercase transition-all duration-300 hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/20 disabled:opacity-50"
                >
                  {pending === "checkout" ? (
                    <Loader2 aria-hidden="true" className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Crown aria-hidden="true" className="mr-2 size-4" />
                  )}
                  Subscribe — {selectedPlan === "monthly" ? "$9.99/mo" : "$79.99/yr"}
                </Button>
              ) : (
                <Button
                  asChild
                  className="rounded-lg bg-amber-600 px-12 py-6 font-mono text-sm tracking-widest text-black uppercase transition-all duration-300 hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/20"
                >
                  <Link href={LOGIN_HREF}>
                    <Lock aria-hidden="true" className="mr-2 size-4" />
                    Sign In to Subscribe
                  </Link>
                </Button>
              )}
              <p className="mt-4 font-mono text-[11px] text-slate-600">
                Secure checkout powered by Stripe.{testMode ? " Test with card 4242 4242 4242 4242." : ""}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* FEATURES COMPARISON */}
      <section className="relative z-10 px-4 py-20">
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-16 text-center font-serif text-3xl text-amber-50 md:text-4xl">What You Get</h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/2 p-8">
              <div className="mb-6 flex items-center gap-2">
                <Shield aria-hidden="true" className="size-5 text-slate-500" />
                <h3 className="font-mono text-sm tracking-widest text-slate-400 uppercase">Free</h3>
              </div>
              <ul className="space-y-4">
                {FREE_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-slate-400">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-slate-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8">
              <div className="absolute -top-3 left-6">
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[10px] tracking-widest text-amber-400 uppercase">
                  Recommended
                </span>
              </div>
              <div className="mb-6 flex items-center gap-2">
                <Crown aria-hidden="true" className="size-5 text-amber-400" />
                <h3 className="font-mono text-sm tracking-widest text-amber-400 uppercase">Premium</h3>
              </div>
              <ul className="space-y-4">
                {PREMIUM_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-amber-100">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
