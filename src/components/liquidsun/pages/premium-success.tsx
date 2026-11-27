"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, CheckCircle, Crown } from "lucide-react";
import { AudioController } from "@/components/liquidsun/liquidsun-effects";
import { useMember } from "@/components/liquidsun/liquidsun-providers";
import { Button } from "@/components/liquidsun/ui";
import { ls } from "@/lib/content/liquidsun/nav";

// Ported from the LiquidSun app's client/src/pages/PremiumSuccess.tsx (2026-11-21): Stripe Checkout
// sends the member back here. Same copy and layout; the buttons are links now. It asks for the
// member's status again so the menu and gated content see Premium as soon as the webhook has run.
// Entrance: the app's scale 0.9 -> 1, 0.6s, as tw-animate classes.

export function PremiumSuccess() {
  const { refresh } = useMember();
  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-black font-sans text-white selection:bg-amber-500/30">
      <AudioController />

      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-b from-black via-amber-950/10 to-black" />
        <div className="absolute top-1/3 left-1/2 h-[30vh] w-[50vw] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
      </div>

      <section className="relative z-10 px-4 pt-40 pb-20">
        <div className="container mx-auto max-w-lg text-center">
          <div className="animate-in duration-600 fade-in zoom-in-90">
            <div className="relative mb-8 inline-block">
              <Crown aria-hidden="true" className="mx-auto size-20 text-amber-400" />
              <CheckCircle aria-hidden="true" className="absolute -right-1 -bottom-1 size-8 text-emerald-400" />
            </div>

            <h1 className="mb-6 font-serif text-4xl text-amber-50 md:text-5xl">Welcome to the Inner Circle</h1>
            <p className="mb-10 font-serif text-lg leading-relaxed font-light text-slate-400">
              Your premium membership is now active. Every buy link, panel score, and Flavor Matrix insight is unlocked. The real hunt
              begins now.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild className="bg-amber-600 px-8 py-5 font-mono text-sm tracking-widest text-black uppercase hover:bg-amber-500">
                <Link href={ls("/quadrant")}>
                  Explore the Flavor Matrix
                  <ArrowRight aria-hidden="true" className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/20 px-8 py-5 font-mono text-sm tracking-widest text-white uppercase hover:bg-white/5"
              >
                <Link href={ls("/")}>Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
