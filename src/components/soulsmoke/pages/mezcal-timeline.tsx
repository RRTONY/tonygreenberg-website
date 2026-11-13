"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Crown, Flame, Sparkles, Star, TrendingUp, Wine } from "lucide-react";
import { soulsmokeImages as img } from "@/lib/content/soulsmoke/images";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/MezcalTimeline.tsx (/evolution), 2026-11-10.
// Same eras, copy and scroll progress bar. The original built dot/glow colors at runtime with
// era.color.replace("text-", "bg-"); here each era carries its full literal classes instead
// (Tailwind only generates classes it can see in source).

interface TimelineEra {
  id: number;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  keyMoments: string[];
  icon: ReactNode;
  color: string;
  /** era.color as a background (the dots and the glow). */
  dot: string;
  /** Section classes, including the era's gradient. */
  section: string;
}

const timelineEras: TimelineEra[] = [
  {
    id: 1,
    year: "Pre-1990s",
    title: "The Dark Ages",
    subtitle: "The Worm Era",
    description: "Mezcal was misunderstood, dismissed as cheap rotgut with a worm at the bottom. A punchline, not a spirit. While tequila gained mainstream acceptance, mezcal languished in the shadows—associated with hangovers and tourist traps, not craftsmanship.",
    keyMoments: [
      "Mezcal seen as 'poor man's tequila'",
      "The gusano (worm) becomes a marketing gimmick",
      "Industrial production dominates",
      "Traditional palenques struggle to survive"
    ],
    icon: <Flame aria-hidden="true" className="size-8" />,
    color: "text-red-400",
    dot: "bg-red-400",
    section: "relative flex min-h-screen items-center overflow-hidden bg-linear-to-b from-red-950/50 to-stone-950"
  },
  {
    id: 2,
    year: "1995",
    title: "The Awakening",
    subtitle: "Ron Cooper Discovers Single Village Mezcal",
    description: "Artist Ron Cooper stumbles into a palenque in Oaxaca and tastes something that changes everything. He realizes each village produces mezcal with distinct terroir—like wine. Del Maguey Single Village Mezcal is born, and the revolution begins.",
    keyMoments: [
      "Ron Cooper founds Del Maguey",
      "Single Village concept introduced",
      "First artisanal mezcal exports to US",
      "The 'architect of mezcal's resurrection' emerges"
    ],
    icon: <Star aria-hidden="true" className="size-8" />,
    color: "text-amber-400",
    dot: "bg-amber-400",
    section: "relative flex min-h-screen items-center overflow-hidden bg-linear-to-b from-amber-950/50 to-stone-950"
  },
  {
    id: 3,
    year: "2000-2010",
    title: "The Education",
    subtitle: "Bartenders & Pioneers Spread the Word",
    description: "A small but passionate community of bartenders, sommeliers, and spirits enthusiasts begin to understand what mezcal truly is. Steve Olson joins Del Maguey. Craft cocktail bars in NYC, LA, and San Francisco start featuring mezcal. The education begins.",
    keyMoments: [
      "Steve Olson becomes 'Dean of Mezcal'",
      "Craft cocktail renaissance embraces mezcal",
      "Mezcalistas founded (2012)",
      "First mezcal-focused bars open in US",
      "Susan Coss begins documenting the culture"
    ],
    icon: <BookOpen aria-hidden="true" className="size-8" />,
    color: "text-sage",
    dot: "bg-sage",
    section: "relative flex min-h-screen items-center overflow-hidden bg-linear-to-b from-green-950/50 to-stone-950"
  },
  {
    id: 4,
    year: "2010-2018",
    title: "The Recognition",
    subtitle: "Fine Dining & Collectors Take Notice",
    description: "Mezcal appears on Michelin-starred menus. Collectors begin seeking rare bottles. Real Minero, Lalocura, and other ancestral producers gain cult followings. The James Beard Foundation recognizes Ron Cooper. Mezcal is no longer a curiosity—it's a category.",
    keyMoments: [
      "Ron Cooper wins James Beard Award",
      "Graciela Ángeles Carreño named Drinks Innovator",
      "Ancestral mezcal commands premium prices",
      "Rare agave varieties become sought after",
      "Mezcal tourism explodes in Oaxaca"
    ],
    icon: <Wine aria-hidden="true" className="size-8" />,
    color: "text-terracotta",
    dot: "bg-terracotta",
    section: "relative flex min-h-screen items-center overflow-hidden bg-linear-to-b from-orange-950/50 to-stone-950"
  },
  {
    id: 5,
    year: "2018-2023",
    title: "The Ascension",
    subtitle: "Mezcal Claims Its Throne",
    description: "Mezcal takes its place alongside Cognac, single malt Scotch, and fine wine as one of the world's most respected spirits. It's not about volume—it's about depth, complexity, and soul. The spirit for those who seek meaning in what they drink.",
    keyMoments: [
      "Mezcal compared to Grand Cru wines",
      "Single-agave bottlings rival single malt complexity",
      "SACRED founded to protect producers",
      "Real Minero withdraws from CRM for authenticity",
      "Global spirits experts rank mezcal among finest"
    ],
    icon: <Crown aria-hidden="true" className="size-8" />,
    color: "text-yellow-400",
    dot: "bg-yellow-400",
    section: "relative flex min-h-screen items-center overflow-hidden bg-linear-to-b from-yellow-950/50 to-stone-950"
  },
  {
    id: 6,
    year: "Today",
    title: "The Higher Power",
    subtitle: "Where Mezcal Stands Now",
    description: "Tequila is respected—it's earned its place. But mezcal is something else entirely. It's the spirit for those who want more than a drink. It's terroir, tradition, and transformation in a glass. Where Cognac once stood alone at the pinnacle, mezcal now shares that rarified air.",
    keyMoments: [
      "Mezcal: the Cognac of agave spirits",
      "Tequila = accessible excellence",
      "Mezcal = transcendent experience",
      "27+ agave varieties vs. one (tequila)",
      "Each bottle tells a story of place and people"
    ],
    icon: <Sparkles aria-hidden="true" className="size-8" />,
    color: "text-lime-400",
    dot: "bg-lime-400",
    section: "relative flex min-h-screen items-center overflow-hidden bg-linear-to-b from-lime-950/50 to-stone-950"
  }
];

const spiritsHierarchy = [
  { name: "Mezcal", position: "The Soul", description: "Terroir, tradition, transformation", level: 1 },
  { name: "Cognac", position: "The Legacy", description: "Centuries of refinement", level: 1 },
  { name: "Single Malt Scotch", position: "The Craft", description: "Regional expression", level: 2 },
  { name: "Fine Wine", position: "The Art", description: "Vintage and vineyard", level: 2 },
  { name: "Tequila", position: "The Gateway", description: "Accessible excellence", level: 3 },
  { name: "Bourbon", position: "The American", description: "Bold and democratic", level: 3 },
];

export function MezcalTimeline() {
  // The original also tracked an "active era" from scroll position but never rendered it.
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 z-50 h-1 w-full bg-stone-200">
        <div
          className="h-full bg-linear-to-r from-terracotta via-sage to-lime-500 transition-all duration-300"
          // Scroll progress (runtime value).
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-b from-stone-900 to-stone-800">
        <div className="absolute inset-0 opacity-20">
          <Image src={img.heroMystical.src} alt="" fill priority sizes="100vw" className="object-cover object-center" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-terracotta/20 px-4 py-2">
            <TrendingUp aria-hidden="true" className="size-5 text-terracotta" />
            <span className="font-mono text-sm tracking-wider text-terracotta">THE EVOLUTION</span>
          </div>

          <h1 className="mb-6 font-display text-5xl text-white md:text-7xl lg:text-8xl">
            From Worm
            <br />
            <span className="text-terracotta">to Wonder</span>
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-stone-200 md:text-2xl">
            The journey of mezcal from misunderstood rotgut to one of the world&apos;s most revered spirits. A
            story of resurrection, recognition, and revolution.
          </p>

          <div className="animate-bounce">
            <span className="text-sm tracking-wider text-stone-300">SCROLL TO BEGIN THE JOURNEY</span>
          </div>
        </div>
      </section>

      {/* Timeline Eras */}
      {timelineEras.map((era, index) => (
        <section key={era.id} className={era.section}>
          {/* Era Number */}
          <div className="absolute top-24 left-4 sm:left-8 md:left-16">
            <span className={`font-display text-8xl opacity-10 md:text-9xl ${era.color}`}>
              {String(era.id).padStart(2, "0")}
            </span>
          </div>

          <div className="container mx-auto px-6 py-20">
            <div className="grid items-center gap-12 md:grid-cols-2">
              {/* Content */}
              <div className={index % 2 === 1 ? "md:order-2" : ""}>
                <div className={`mb-6 inline-flex items-center gap-3 ${era.color}`}>
                  {era.icon}
                  <span className="font-mono text-sm tracking-wider">{era.year}</span>
                </div>

                <h2 className="mb-2 font-display text-4xl break-words text-white md:text-5xl lg:text-6xl">{era.title}</h2>
                <h3 className={`mb-6 font-serif text-xl md:text-2xl ${era.color}`}>{era.subtitle}</h3>

                <p className="mb-8 text-lg leading-relaxed text-stone-200">{era.description}</p>

                <div className="space-y-3">
                  {era.keyMoments.map((moment) => (
                    <div key={moment} className="flex items-start gap-3">
                      <div className={`mt-2 size-2 shrink-0 rounded-full ${era.dot}`} />
                      <span className="text-stone-300">{moment}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual */}
              <div className={index % 2 === 1 ? "md:order-1" : ""}>
                <div className="relative">
                  <div className={`absolute inset-0 rounded-full opacity-20 blur-3xl ${era.dot}`} />
                  <div className="relative rounded-2xl border border-stone-700 bg-stone-800/50 p-8 backdrop-blur-sm">
                    <div className="text-center">
                      <div
                        className={`mb-6 inline-flex size-24 items-center justify-center rounded-full bg-stone-900 ${era.color}`}
                      >
                        {era.icon}
                      </div>
                      <div className="mb-2 font-display text-6xl text-white">{era.year}</div>
                      <div className={`font-mono text-sm ${era.color}`}>{era.subtitle}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Spirits Hierarchy Section */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-linear-to-b from-stone-900 to-stone-950">
        <div className="container mx-auto px-6 py-20">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-4xl text-white md:text-6xl">
              The New
              <br />
              <span className="text-terracotta">Hierarchy</span>
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-stone-300">
              Where the world&apos;s finest spirits stand today. Mezcal has earned its place at the pinnacle—not
              through marketing, but through soul.
            </p>
          </div>

          {/* Pyramid */}
          <div className="mx-auto max-w-4xl">
            {/* Top Tier */}
            <div className="mb-4 flex justify-center gap-4">
              {spiritsHierarchy
                .filter((s) => s.level === 1)
                .map((spirit) => (
                  <div
                    key={spirit.name}
                    className={
                      spirit.name === "Mezcal"
                        ? "rounded-xl bg-linear-to-br from-terracotta to-amber-600 px-8 py-6 text-center text-white"
                        : "rounded-xl bg-stone-800 px-8 py-6 text-center text-stone-200"
                    }
                  >
                    <div className="mb-1 font-display text-2xl">{spirit.name}</div>
                    <div className="text-sm opacity-75">{spirit.position}</div>
                  </div>
                ))}
            </div>

            {/* Middle Tier */}
            <div className="mb-4 flex justify-center gap-4">
              {spiritsHierarchy
                .filter((s) => s.level === 2)
                .map((spirit) => (
                  <div key={spirit.name} className="rounded-lg bg-stone-800/50 px-6 py-4 text-center">
                    <div className="mb-1 font-display text-xl text-stone-200">{spirit.name}</div>
                    <div className="text-xs text-stone-400">{spirit.position}</div>
                  </div>
                ))}
            </div>

            {/* Bottom Tier */}
            <div className="flex justify-center gap-4">
              {spiritsHierarchy
                .filter((s) => s.level === 3)
                .map((spirit) => (
                  <div key={spirit.name} className="rounded-lg bg-stone-900 px-5 py-3 text-center">
                    <div className="mb-1 font-serif text-lg text-stone-300">{spirit.name}</div>
                    <div className="text-xs text-stone-600">{spirit.position}</div>
                  </div>
                ))}
            </div>
          </div>

          {/* Quote */}
          <div className="mx-auto mt-16 max-w-3xl text-center">
            <blockquote className="mb-6 font-serif text-2xl text-stone-200 italic md:text-3xl">
              &quot;Tequila is respected—it&apos;s earned its place. But mezcal is something else entirely.
              It&apos;s the spirit for those who want more than a drink.&quot;
            </blockquote>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="mb-6 font-display text-3xl text-earth md:text-5xl">Begin Your Journey</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
            Now that you understand where mezcal stands, it&apos;s time to find your own path.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={ss("/scent-finder")}
              className="inline-flex items-center gap-2 rounded-lg bg-terracotta px-8 py-4 font-medium text-white transition-colors hover:bg-terracotta/90"
            >
              Find Your Agave
              <ArrowRight aria-hidden="true" className="size-5" />
            </Link>
            <Link
              href={ss("/us-hunt")}
              className="inline-flex items-center gap-2 rounded-lg bg-earth px-8 py-4 font-medium text-white transition-colors hover:bg-earth/90"
            >
              Explore the Hunt
              <ArrowRight aria-hidden="true" className="size-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
