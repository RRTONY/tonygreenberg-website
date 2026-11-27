"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ExternalLink, Flame, Shield, ShoppingCart, Star, Wind, Zap } from "lucide-react";
import { AudioController } from "@/components/liquidsun/liquidsun-effects";
import { ActivityTicker } from "@/components/liquidsun/home/activity-ticker";
import { TrustSection } from "@/components/liquidsun/home/trust-section";
import { GatewayShowcase } from "@/components/liquidsun/home/gateway-showcase";
import { EmailCapture } from "@/components/liquidsun/home/email-capture";
import { FeaturedBadge, TierBadge } from "@/components/liquidsun/badges";
import { GatedContent, GatedValue } from "@/components/liquidsun/gated-content";
import { Reveal, usePrefersReducedMotion } from "@/components/liquidsun/motion";
import { Button } from "@/components/liquidsun/ui";
import { liquidsunImages } from "@/lib/content/liquidsun/images";
import { getCheapestBuyLink, getLegends, getUnicorns } from "@/lib/content/liquidsun/producers";
import { ls } from "@/lib/content/liquidsun/nav";
import { cn } from "@/lib/utils";

// Ported from the LiquidSun app's client/src/pages/Home.tsx (2026-11-21). Same sections, copy and
// classes. The app's framer-motion effects, recreated without it:
// - Hero scroll (useScroll + useTransform): while the hero scrolls away the background grows to
//   1.1x and the hero text fades out by half-way and slides down 100px. A passive scroll listener
//   writes those numbers straight onto the two elements (runtime values, no re-render).
// - Mouse parallax glow (spring, stiffness 30 / damping 20): the glow follows the pointer at -2x
//   with a slow 1.5s ease-out transition.
// - Entrances: "Est. 2026" letter-spacing 0.5em -> 0.2em (1.5s, .ls-tracking-in), the H1 blurs in
//   from 95% (1.2s, 0.2s delay), the quote rises 20px (1s, 0.6s), the button 30px (0.8s, 0.9s);
//   the scroll arrow fades in at 2s and bobs 10px every 2s (.ls-bob).
// - whileInView reveals (Reveal): the manifesto panel rises 50px, each bottle 100px (0.8s).
// Both scroll and pointer effects stay still for "reduce motion".
// The app's Home also rendered <Navigation /> a second time (two fixed bars); the layout renders it once.
// Buy links and panel scores stay behind a free sign-in (GatedContent / GatedValue), as on the app.

type TierFilter = "All" | "Unicorn" | "Legend";

function scrollToManifesto() {
  document.getElementById("manifesto")?.scrollIntoView({ behavior: "smooth" });
}

export function LiquidsunHome() {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [filter, setFilter] = useState<TierFilter>("All");

  // useScroll({ target: hero, offset: ["start start", "end start"] }) -> opacity, y and scale.
  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = heroRef.current;
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const progress = rect.height > 0 ? Math.min(1, Math.max(0, -rect.top / rect.height)) : 0;
      const half = Math.min(1, progress / 0.5);
      if (bgRef.current) bgRef.current.style.transform = `scale(${1 + 0.1 * progress})`;
      if (heroTextRef.current) {
        heroTextRef.current.style.opacity = String(1 - half);
        heroTextRef.current.style.transform = `translateY(${half * 100}px)`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  // Mouse parallax: the glow drifts opposite the pointer (x and y * -2, the pointer mapped to ±7.5).
  useEffect(() => {
    if (reduced) return;
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 15;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      if (glowRef.current) glowRef.current.style.transform = `translate(${x * -2}px, ${y * -2}px)`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [reduced]);

  // Only Unicorn + Legend in the editorial collection (Gateway has its own section); featured
  // partners float to the top.
  const editorialProducers = useMemo(() => {
    const sorted = [...getUnicorns(), ...getLegends()].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
    if (filter === "All") return sorted;
    return sorted.filter((p) => p.tier === filter);
  }, [filter]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-black font-sans text-white selection:bg-amber-500/30">
      <AudioController />

      {/* GLOBAL CINEMATIC BACKGROUND - FIXED */}
      <div className="fixed inset-0 z-0">
        <div ref={bgRef} className="absolute inset-0 will-change-transform">
          <Image
            src={liquidsunImages.agaveFieldMoon.src}
            alt="Agave Field at Twilight"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-100"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/60 mix-blend-multiply" />
        </div>
        <div className="ls-stardust pointer-events-none absolute inset-0 animate-pulse opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* HERO SECTION */}
      <section ref={heroRef} className="relative z-10 flex h-screen items-center justify-center overflow-hidden">
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 flex items-center justify-center transition-transform duration-1500 ease-out"
        >
          <div className="h-[60vh] w-[60vw] rounded-full bg-amber-500/5 blur-[100px]" />
        </div>

        <div ref={heroTextRef} className="relative z-20 mx-auto flex max-w-6xl flex-col items-center px-4 text-center">
          <div className="ls-tracking-in mb-8 border-b border-amber-500/30 pb-2 font-mono text-xs tracking-[0.2em] text-amber-400/90 uppercase drop-shadow-lg md:text-sm">
            Est. 2026 • Jalisco, Mexico
          </div>

          <h1 className="mb-6 animate-in bg-linear-to-b from-amber-100 via-amber-200 to-amber-700 bg-clip-text font-serif text-7xl leading-[0.85] font-bold tracking-tight text-transparent drop-shadow-2xl duration-1200 blur-in-10 fade-in fill-mode-both zoom-in-95 delay-200 md:text-[10rem]">
            LiquidSun
          </h1>

          <p className="text-glow mx-auto mb-12 max-w-3xl animate-in font-serif text-xl leading-relaxed font-light text-white italic drop-shadow-xl duration-1000 fade-in fill-mode-both slide-in-from-bottom-5 delay-600 md:text-3xl">
            &quot;What enters the mouth must speak to the mind and stay with the heart.&quot;
          </p>

          <div className="animate-in duration-800 fade-in fill-mode-both slide-in-from-bottom-[30px] delay-900">
            <Button
              size="lg"
              type="button"
              onClick={scrollToManifesto}
              className="group relative overflow-hidden rounded-none border border-amber-500/30 bg-transparent px-10 py-8 font-mono text-lg tracking-widest text-amber-100 uppercase backdrop-blur-sm transition-all duration-500 hover:border-amber-500/60 hover:bg-amber-950/30"
            >
              <span className="relative z-10 transition-colors group-hover:text-amber-400">Enter the Void</span>
              <span className="absolute inset-0 translate-y-full bg-amber-500/10 transition-transform duration-500 ease-out group-hover:translate-y-0" />
            </Button>
          </div>
        </div>

        <button
          type="button"
          onClick={scrollToManifesto}
          aria-label="Scroll to the manifesto"
          className="ls-bob absolute bottom-12 left-1/2 z-20 cursor-pointer text-amber-500/40 transition-colors hover:text-amber-400 motion-reduce:-translate-x-1/2"
        >
          <ArrowDown aria-hidden="true" className="size-6" strokeWidth={1} />
        </button>
      </section>

      {/* ACTIVITY TICKER */}
      <ActivityTicker />

      {/* MANIFESTO SECTION - Floating Glass */}
      <section id="manifesto" className="relative z-10 px-4 py-40">
        <div className="container mx-auto max-w-6xl">
          <Reveal
            enter="animate-in fade-in slide-in-from-bottom-[50px] duration-800 fill-mode-both"
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-12 shadow-2xl backdrop-blur-xl md:p-20"
          >
            <div className="absolute -top-20 -right-20 size-96 rounded-full bg-purple-900/20 blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 size-96 rounded-full bg-amber-900/20 blur-[100px]" />

            <div className="relative z-10 grid items-center gap-20 lg:grid-cols-2">
              <div className="space-y-12">
                <div className="flex items-center gap-4">
                  <Zap aria-hidden="true" className="size-5 animate-pulse text-amber-500" />
                  <h2 className="font-mono text-xs tracking-[0.4em] text-amber-500 uppercase">The Glitch in the Matrix</h2>
                </div>

                <h3 className="font-serif text-4xl leading-[1.1] text-amber-50 md:text-6xl">
                  We are the{" "}
                  <span className="bg-linear-to-r from-amber-400 to-amber-600 bg-clip-text pr-2 text-transparent italic">resistance</span>{" "}
                  against the machine.
                </h3>

                <div className="space-y-8 font-serif text-lg leading-relaxed font-light text-slate-300">
                  <p>
                    99% of tequila is now made by chemical engineers, not jimadors. They use diffusers to strip the soul from the plant
                    and additives to fake the flavor.
                  </p>
                  <p className="border-l-2 border-amber-500/50 pl-6 text-amber-100/90 italic">
                    We exist to find the 1%—the glitches. The producers who refuse to compromise. The liquids that still carry the
                    vibration of the earth.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="group">
                    <Flame aria-hidden="true" className="mb-3 size-6 text-amber-600 transition-colors group-hover:text-amber-400" />
                    <h4 className="mb-1 font-serif text-xl text-amber-100">Stone Ovens</h4>
                    <p className="font-mono text-xs tracking-wider text-slate-500 uppercase">72 Hours Slow Roast</p>
                  </div>
                  <div className="group">
                    <Wind aria-hidden="true" className="mb-3 size-6 text-purple-400 transition-colors group-hover:text-purple-300" />
                    <h4 className="mb-1 font-serif text-xl text-amber-100">Wild Yeast</h4>
                    <p className="font-mono text-xs tracking-wider text-slate-500 uppercase">Natural Fermentation</p>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-2xl bg-linear-to-tr from-amber-500/10 to-purple-500/10 transition-transform duration-700 group-hover:translate-x-2 group-hover:translate-y-2" />
                <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                  <Image
                    src={liquidsunImages.tahonaWheel.src}
                    width={liquidsunImages.tahonaWheel.width}
                    height={liquidsunImages.tahonaWheel.height}
                    sizes="(min-width: 1024px) 560px, 100vw"
                    alt="Tahona Wheel"
                    className="h-auto w-full brightness-75 contrast-125 grayscale transition-all duration-1000 group-hover:brightness-100 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-80" />
                  <div className="absolute right-6 bottom-6 left-6">
                    <p className="mb-2 font-mono text-xs tracking-widest text-amber-500 uppercase">The Old Way</p>
                    <p className="font-serif text-2xl text-white">Volcanic Stone Tahona</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHY TRUST US SECTION */}
      <TrustSection />

      {/* COLLECTION SECTION - EDITORIAL FLOW */}
      <section className="relative z-10 py-32">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-32 flex flex-col items-end justify-between gap-10 border-b border-white/10 pb-8 md:flex-row">
            <div>
              <h2 className="mb-6 font-serif text-5xl text-amber-50 md:text-8xl">The Collection</h2>
              <p className="max-w-xl font-serif text-lg font-light text-slate-400 italic">
                Curated for those who seek the truth in the bottle. Every bottle verified additive-free.
              </p>
            </div>

            <div className="flex gap-2 rounded-full border border-white/10 bg-black/50 p-1 backdrop-blur-sm">
              {(["All", "Unicorn", "Legend"] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  aria-pressed={filter === tier}
                  onClick={() => setFilter(tier)}
                  className={
                    filter === tier
                      ? "rounded-full bg-amber-600 px-6 py-2 font-mono text-[10px] font-bold tracking-widest text-black uppercase shadow-lg shadow-amber-900/20 transition-all duration-300"
                      : "rounded-full px-6 py-2 font-mono text-[10px] tracking-widest text-slate-500 uppercase transition-all duration-300 hover:bg-white/5 hover:text-amber-400"
                  }
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-40">
            {editorialProducers.map((producer, index) => {
              const cheapest = getCheapestBuyLink(producer);
              return (
                <Reveal
                  key={producer.id}
                  enter="animate-in fade-in slide-in-from-bottom-[100px] duration-800 fill-mode-both"
                  className={cn(
                    "flex flex-col items-center gap-12 lg:gap-24",
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse",
                    producer.featured && "rounded-xl bg-amber-500/2 p-6 ring-1 ring-amber-500/20 lg:p-8",
                  )}
                >
                  {/* Image Side */}
                  <div className="group relative w-full lg:w-3/5">
                    <div
                      className={
                        producer.featured
                          ? "absolute inset-0 translate-x-4 translate-y-4 rounded-sm bg-amber-500/15 transition-transform duration-700 group-hover:translate-x-2 group-hover:translate-y-2"
                          : "absolute inset-0 translate-x-4 translate-y-4 rounded-sm bg-amber-500/10 transition-transform duration-700 group-hover:translate-x-2 group-hover:translate-y-2"
                      }
                    />
                    <div className="relative aspect-video overflow-hidden rounded-sm lg:aspect-4/3">
                      <Image
                        src={producer.image.src}
                        alt={producer.brand}
                        fill
                        sizes="(min-width: 1024px) 60vw, 100vw"
                        className="scale-105 object-cover brightness-90 contrast-125 grayscale transition-all duration-1000 group-hover:scale-100 group-hover:brightness-100 group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />

                      <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                        <TierBadge tier={producer.tier} />
                        <FeaturedBadge partnerTier={producer.partnerTier} />
                      </div>

                      {producer.panelScore > 0 && (
                        <div className="absolute top-4 right-4">
                          <GatedValue type="score">
                            <span className="flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-sm">
                              <Star aria-hidden="true" className="size-3 text-amber-400" />
                              <span className="font-mono text-xs font-bold text-amber-400">{producer.panelScore}</span>
                            </span>
                          </GatedValue>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Text Side */}
                  <div className="w-full space-y-6 lg:w-2/5">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="border-b border-amber-500/30 pb-1 font-mono text-xs tracking-[0.2em] text-amber-500 uppercase">
                        NOM {producer.nom}
                      </span>
                      <span className="font-mono text-xs tracking-[0.2em] text-slate-500 uppercase">{producer.regionDetail}</span>
                      {producer.additiveFree && (
                        <span className="flex items-center gap-1 font-mono text-[10px] tracking-wider text-emerald-400 uppercase">
                          <Shield aria-hidden="true" className="size-3" />
                          Additive-Free
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-4xl leading-[0.9] text-white md:text-6xl">{producer.brand}</h3>

                    <p className="font-mono text-sm text-slate-500">
                      by {producer.name} • {producer.distillery}
                    </p>

                    <p className="border-l-2 border-white/10 pl-6 font-serif text-lg leading-relaxed font-light text-slate-400">
                      {producer.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {producer.flavorNotes.slice(0, 6).map((note) => (
                        <span key={note} className="rounded-full border border-white/5 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-slate-500">
                          {note}
                        </span>
                      ))}
                    </div>

                    {/* Buy Links: behind a free sign-in */}
                    <GatedContent
                      type="buy"
                      placeholder={
                        <span className="flex items-center gap-3 pt-2">
                          <span className="inline-flex items-center gap-2 rounded-sm bg-amber-600/90 px-5 py-2.5 font-mono text-xs tracking-widest text-black uppercase">
                            <ShoppingCart aria-hidden="true" className="size-3.5" />
                            Buy — $XX
                          </span>
                        </span>
                      }
                    >
                      <div className="flex items-center gap-3 pt-2">
                        {cheapest ? (
                          <a
                            href={cheapest.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-sm bg-amber-600/90 px-5 py-2.5 font-mono text-xs tracking-widest text-black uppercase transition-all duration-300 hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/20"
                          >
                            <ShoppingCart aria-hidden="true" className="size-3.5" />
                            Buy — ${cheapest.price.toFixed(0)}
                            <ExternalLink aria-hidden="true" className="size-3 opacity-60" />
                          </a>
                        ) : (
                          <span className="font-mono text-xs text-slate-600">Limited availability</span>
                        )}

                        {producer.buyLinks.length > 1 && (
                          <span className="font-mono text-[10px] text-slate-600">
                            +{producer.buyLinks.length - 1} retailer{producer.buyLinks.length > 2 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </GatedContent>

                    <Button
                      asChild
                      variant="link"
                      className="group/btn p-0 font-mono text-sm tracking-widest text-amber-400 uppercase hover:text-amber-300"
                    >
                      <Link href={ls("/tequila-encyclopedia")}>
                        Full Profile
                        <ArrowRight aria-hidden="true" className="ml-2 size-4 transition-transform group-hover/btn:translate-x-2" />
                      </Link>
                    </Button>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* GATEWAY SHOWCASE */}
      <GatewayShowcase />

      {/* EMAIL CAPTURE */}
      <EmailCapture />
    </div>
  );
}
