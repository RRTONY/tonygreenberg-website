import Link from "next/link";
import { ArrowRight, Compass, Droplets, Home, Search } from "lucide-react";
import { Button } from "@/components/aqueous/ui";
import { aq } from "@/lib/content/aqueous/nav";

// Ported from the Aqueous app's client/src/pages/NotFound.tsx (2026-11-24): "Lost in the Current",
// the Aqueous 404 with a water metaphor and links back to key pages. A Server Component: every
// animation is CSS.
// - Nav and footer come from the /aqueous layout, which already renders <main>, so the app's
//   <main> is a <div> here.
// - framer-motion: the three ripple rings (scale [1, 1.5, 2], opacity [0.4, 0.2, 0], 3s easeOut, repeat,
//   delays 0/1/2s) are aqueous.css's aq-ripple. Its `animation` shorthand is an unlayered rule, which
//   beats a plain delay-* utility, so the stagger uses the important form (delay-1000!).
//   Entrances (y:-20 / y:20, 0.6s, delays 0.15/0.3/0.45) are tw-animate classes.

export function AqueousNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="w-full max-w-2xl text-center">
          {/* Animated water drop (was initial y:-20 → 0, 0.6s) */}
          <div className="mb-8 animate-in duration-600 fill-mode-both fade-in slide-in-from-top-5">
            <div className="relative inline-flex items-center justify-center">
              {/* Ripple rings */}
              <div aria-hidden="true" className="aq-ripple absolute size-32 rounded-full border-2 border-[#4ECDC4]/20" />
              <div aria-hidden="true" className="aq-ripple absolute size-32 rounded-full border-2 border-[#4ECDC4]/20 delay-1000!" />
              <div aria-hidden="true" className="aq-ripple absolute size-32 rounded-full border-2 border-[#4ECDC4]/20 delay-2000!" />
              <div className="flex size-20 items-center justify-center rounded-full bg-linear-to-br from-[#4ECDC4]/20 to-[#0A8754]/20">
                <Droplets aria-hidden="true" className="size-10 text-[#4ECDC4]" />
              </div>
            </div>
          </div>

          {/* 404 text (was initial y:20 → 0, 0.6s, delay 0.15) */}
          <div className="animate-in delay-150 duration-600 fill-mode-both fade-in slide-in-from-bottom-5">
            <h1 className="font-aq-display mb-2 bg-linear-to-r from-[#4ECDC4] to-[#0A8754] bg-clip-text text-7xl font-bold text-transparent sm:text-8xl">
              404
            </h1>
            <h2 className="font-aq-display mb-4 text-2xl font-semibold text-foreground sm:text-3xl">Lost in the Current</h2>
            <p className="mx-auto mb-10 max-w-md leading-relaxed text-muted-foreground">
              This page has evaporated — but the water still flows. Every stream finds its way. Let us guide you back to where the current
              runs deep.
            </p>
          </div>

          {/* Navigation options (was initial y:20 → 0, 0.6s, delay 0.3) */}
          <div className="mb-10 grid animate-in grid-cols-1 gap-4 delay-300 duration-600 fill-mode-both fade-in slide-in-from-bottom-5 sm:grid-cols-3">
            <Link href={aq("/")}>
              <div className="group cursor-pointer rounded-xl border border-border/50 p-5 transition-all duration-300 hover:border-[#4ECDC4]/40 hover:bg-[#4ECDC4]/5">
                <Home aria-hidden="true" className="mx-auto mb-3 size-6 text-[#4ECDC4] transition-transform group-hover:scale-110" />
                <p className="text-sm font-semibold text-foreground">Home</p>
                <p className="mt-1 text-xs text-muted-foreground">Back to the source</p>
              </div>
            </Link>
            <Link href={aq("/explore")}>
              <div className="group cursor-pointer rounded-xl border border-border/50 p-5 transition-all duration-300 hover:border-[#0A8754]/40 hover:bg-[#0A8754]/5">
                <Search aria-hidden="true" className="mx-auto mb-3 size-6 text-[#0A8754] transition-transform group-hover:scale-110" />
                <p className="text-sm font-semibold text-foreground">Explore Waters</p>
                <p className="mt-1 text-xs text-muted-foreground">Browse all ratings</p>
              </div>
            </Link>
            <Link href={aq("/directory")}>
              <div className="group cursor-pointer rounded-xl border border-border/50 p-5 transition-all duration-300 hover:border-[#B87333]/40 hover:bg-[#B87333]/5">
                <Compass aria-hidden="true" className="mx-auto mb-3 size-6 text-[#B87333] transition-transform group-hover:scale-110" />
                <p className="text-sm font-semibold text-foreground">Site Directory</p>
                <p className="mt-1 text-xs text-muted-foreground">Every page, one place</p>
              </div>
            </Link>
          </div>

          {/* AWI CTA (was opacity 0 → 1, 0.6s, delay 0.45) */}
          <div className="animate-in delay-450 duration-600 fill-mode-both fade-in">
            <Button asChild size="lg" className="gap-2 bg-[#4ECDC4] font-semibold text-[#0A3D3D] hover:bg-[#3DBDB5]">
              <Link href={aq("/awi")}>
                See Your AWI Rankings
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
