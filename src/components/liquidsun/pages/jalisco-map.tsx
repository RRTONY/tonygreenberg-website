"use client";

import Image from "next/image";
import { useState, type KeyboardEvent } from "react";
import { Flame, Mountain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/liquidsun/ui";
import { liquidsunImages } from "@/lib/content/liquidsun/images";

// Ported from the LiquidSun app's client/src/pages/JaliscoMap.tsx ("The Terroir Map", 2026-11-21).
// Same SVG map, copy and cards. Motion, as in the app: a zone grows to 1.05 on hover and the other
// one dims to 30% (framer-motion whileHover / animate -> CSS transitions on the SVG groups), the
// town dots ping, and the info panel fades up 20px each time it changes (re-keyed tw-animate).
// Fixed from live (rule 20): the page was locked to one screen height, which cut off the info card
// on phones, so it grows with its content and clears the fixed menu; the zones also respond to the
// keyboard (Tab + Enter), not only the mouse.

type ZoneId = "highlands" | "valley";

function zoneKeys(zone: ZoneId, set: (z: ZoneId) => void) {
  return {
    role: "button",
    tabIndex: 0,
    onClick: () => set(zone),
    onMouseEnter: () => set(zone),
    onFocus: () => set(zone),
    onKeyDown: (e: KeyboardEvent<SVGGElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        set(zone);
      }
    },
  } as const;
}

export function JaliscoMap() {
  const [activeZone, setActiveZone] = useState<ZoneId | null>(null);

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 font-sans text-amber-50 selection:bg-amber-500/30">
      <div className="fixed inset-0 z-0">
        <Image src={liquidsunImages.agaveMoonlit.src} alt="" fill priority sizes="100vw" className="object-cover opacity-20 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/95 via-slate-950/80 to-slate-950/95" />
        <div className="ls-stardust absolute inset-0 animate-pulse opacity-20" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="container mx-auto flex max-w-7xl grow flex-col items-center gap-12 px-4 pt-24 pb-12 lg:flex-row">
          {/* Left Column: Interactive Map */}
          <div className="relative flex aspect-square w-full items-center justify-center lg:w-1/2">
            <div className="absolute inset-0 rounded-full bg-slate-900/40 opacity-50 blur-3xl" />

            <svg viewBox="0 0 500 500" role="group" aria-label="Map of Jalisco's two tequila regions" className="size-full contrast-125 drop-shadow-2xl">
              <defs>
                <filter id="ls-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="ls-highlandsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7f1d1d" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="ls-valleyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#475569" stopOpacity="0.6" />
                </linearGradient>
              </defs>

              {/* Background Jalisco Outline (Abstract) */}
              <path
                d="M150,400 Q50,350 80,200 T250,50 T450,150 T400,400 Z"
                fill="none"
                stroke="#334155"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="opacity-30"
              />

              {/* Highlands Zone (Los Altos) */}
              <g
                {...zoneKeys("highlands", setActiveZone)}
                aria-label="Los Altos, the Highlands"
                aria-pressed={activeZone === "highlands"}
                className={
                  activeZone === "valley"
                    ? "group origin-center cursor-pointer opacity-30 transition-[opacity,transform] duration-300 [transform-box:fill-box] outline-none hover:scale-105 focus-visible:scale-105"
                    : "group origin-center cursor-pointer opacity-100 transition-[opacity,transform] duration-300 [transform-box:fill-box] outline-none hover:scale-105 focus-visible:scale-105"
                }
              >
                <path
                  d="M280,120 Q350,80 420,150 T380,280 T280,250 Z"
                  fill="url(#ls-highlandsGradient)"
                  stroke="#fca5a5"
                  strokeWidth="2"
                  filter={activeZone === "highlands" ? "url(#ls-glow)" : undefined}
                  className="transition-all duration-500"
                />
                <text x="350" y="180" fill="#fecaca" fontSize="14" fontFamily="serif" textAnchor="middle" className="pointer-events-none font-bold tracking-widest uppercase">
                  Los Altos
                </text>
                <circle cx="350" cy="200" r="4" fill="#fecaca" className="animate-ping [transform-box:fill-box] origin-center" />
              </g>

              {/* Valley Zone (El Valle) */}
              <g
                {...zoneKeys("valley", setActiveZone)}
                aria-label="El Valle, the Valley"
                aria-pressed={activeZone === "valley"}
                className={
                  activeZone === "highlands"
                    ? "group origin-center cursor-pointer opacity-30 transition-[opacity,transform] duration-300 [transform-box:fill-box] outline-none hover:scale-105 focus-visible:scale-105"
                    : "group origin-center cursor-pointer opacity-100 transition-[opacity,transform] duration-300 [transform-box:fill-box] outline-none hover:scale-105 focus-visible:scale-105"
                }
              >
                <path
                  d="M120,250 Q180,200 250,250 T200,380 T120,350 Z"
                  fill="url(#ls-valleyGradient)"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  filter={activeZone === "valley" ? "url(#ls-glow)" : undefined}
                  className="transition-all duration-500"
                />
                <text x="180" y="300" fill="#e2e8f0" fontSize="14" fontFamily="serif" textAnchor="middle" className="pointer-events-none font-bold tracking-widest uppercase">
                  El Valle
                </text>
                <circle cx="180" cy="320" r="4" fill="#e2e8f0" className="animate-ping [transform-box:fill-box] origin-center" />
              </g>

              {/* Connecting Line (The Soul) */}
              <path d="M220,280 L320,220" stroke="#d97706" strokeWidth="1" strokeDasharray="4,4" className="opacity-50" />
            </svg>

            {/* Floating Labels */}
            <div className="pointer-events-none absolute top-10 right-10 text-right">
              <div className="mb-1 font-mono text-xs tracking-widest text-amber-500 uppercase">Interactive Map</div>
              <div className="text-[10px] text-slate-500">Hover zones to explore terroir</div>
            </div>
          </div>

          {/* Right Column: Info Panel */}
          <div className="w-full space-y-8 lg:w-1/2">
            <div key={activeZone || "default"} data-testid="ls-terroir-panel" className="animate-in duration-[400ms] fade-in slide-in-from-bottom-5">
              {!activeZone ? (
                <div className="space-y-6 text-center lg:text-left">
                  <h1 className="bg-linear-to-b from-amber-100 to-amber-600/80 bg-clip-text font-serif text-5xl tracking-tighter text-transparent drop-shadow-lg md:text-7xl">
                    The Terroir Map
                  </h1>
                  <p className="max-w-md text-xl leading-relaxed font-light text-slate-400">
                    Tequila is not a monolith. It is a tale of two soils. <br />
                    <span className="text-amber-500">Hover over the map</span> to discover the soul of each region.
                  </p>
                  <div className="flex justify-center gap-4 pt-8 opacity-50 lg:justify-start">
                    <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-red-400 uppercase">
                      <div className="size-3 rounded-full bg-red-900" /> Highlands
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-slate-400 uppercase">
                      <div className="size-3 rounded-full bg-slate-800" /> Valley
                    </div>
                  </div>
                </div>
              ) : activeZone === "highlands" ? (
                <>
                  <h1 className="sr-only">The Terroir Map</h1>
                  <Card className="border-red-500/30 bg-red-950/20 shadow-2xl shadow-red-900/20 backdrop-blur-md">
                    <CardHeader>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="rounded border border-red-500/30 px-2 py-1 font-mono text-xs tracking-widest text-red-400 uppercase">Los Altos</span>
                        <Mountain aria-hidden="true" className="size-6 text-red-500" />
                      </div>
                      <CardTitle as="h2" className="font-serif text-4xl text-red-100">
                        The Highlands
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 border-b border-red-500/20 pb-4 font-mono text-sm tracking-widest text-red-200/60 uppercase">
                        <div>
                          <span className="block text-[10px] text-red-500">Soil</span>
                          Red Clay (Iron Rich)
                        </div>
                        <div>
                          <span className="block text-[10px] text-red-500">Altitude</span>
                          2,000m+
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-lg leading-relaxed font-light text-red-50">
                          The agaves here struggle against the cold nights and iron-rich soil. This stress forces the plant to produce more
                          sugar, resulting in spirits that are <span className="font-medium text-red-400">sweeter, fruitier, and more floral</span>.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {["Pear", "Citrus", "White Pepper", "Floral"].map((note) => (
                            <span key={note} className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs text-red-300">
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-red-500/20 pt-4">
                        <p className="mb-2 text-xs tracking-widest text-red-400 uppercase">Key Producers</p>
                        <div className="flex flex-wrap gap-2">
                          {["Ocho", "G4", "Siete Leguas", "El Tesoro"].map((brand) => (
                            <span key={brand} className="cursor-pointer font-serif text-sm text-red-100 italic transition-colors hover:text-red-400">
                              {brand}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  <h1 className="sr-only">The Terroir Map</h1>
                  <Card className="border-slate-500/30 bg-slate-900/40 shadow-2xl shadow-slate-900/20 backdrop-blur-md">
                    <CardHeader>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="rounded border border-slate-500/30 px-2 py-1 font-mono text-xs tracking-widest text-slate-400 uppercase">El Valle</span>
                        <Flame aria-hidden="true" className="size-6 text-slate-400" />
                      </div>
                      <CardTitle as="h2" className="font-serif text-4xl text-slate-100">
                        The Valley
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 border-b border-slate-500/20 pb-4 font-mono text-sm tracking-widest text-slate-400/60 uppercase">
                        <div>
                          <span className="block text-[10px] text-slate-500">Soil</span>
                          Black Volcanic
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-500">Altitude</span>
                          1,200m
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-lg leading-relaxed font-light text-slate-200">
                          Dominated by the Tequila Volcano. The soil is obsidian-black and fertile. The intense heat creates spirits that are{" "}
                          <span className="font-medium text-slate-400">earthier, spicier, and more herbal</span>.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {["Olive", "Black Pepper", "Wet Earth", "Mint"].map((note) => (
                            <span key={note} className="rounded-full border border-slate-500/20 bg-slate-500/10 px-3 py-1 text-xs text-slate-300">
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-slate-500/20 pt-4">
                        <p className="mb-2 text-xs tracking-widest text-slate-400 uppercase">Key Producers</p>
                        <div className="flex flex-wrap gap-2">
                          {["Fortaleza", "Cascahuín", "Herradura", "Arette"].map((brand) => (
                            <span key={brand} className="cursor-pointer font-serif text-sm text-slate-100 italic transition-colors hover:text-slate-400">
                              {brand}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
