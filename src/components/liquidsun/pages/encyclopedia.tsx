"use client";

import Image from "next/image";
import { useState } from "react";
import { Droplets, Mountain, Search } from "lucide-react";
import { producers } from "@/lib/content/liquidsun/producers";
import { useLanguage } from "@/components/liquidsun/liquidsun-providers";

// Ported from the LiquidSun app's client/src/pages/Encyclopedia.tsx (route /tequila-encyclopedia,
// 2026-11-21). Same search, region filter, cards and copy. Cards enter like the app's
// framer-motion (opacity 0 / y 20 -> in, delay index * 0.05s): tw-animate classes with the
// stagger as a runtime animation delay. Images are the rescued Sanity copies (next/image).

type Region = "All" | "Highlands" | "Valley";
const REGIONS: Region[] = ["All", "Highlands", "Valley"];

export function Encyclopedia() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState<Region>("All");

  const filteredProducers = producers.filter((producer) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = producer.brand.toLowerCase().includes(term) || producer.name.toLowerCase().includes(term);
    const matchesRegion = regionFilter === "All" || producer.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-background px-4 pt-24 pb-12">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-display text-4xl text-primary md:text-6xl">{t("nav.agaves")}</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            A curated index of the spirits that matter. No diffusers. No additives. Just soul.
          </p>
        </div>

        <div className="mb-12 flex flex-col items-center justify-between gap-4 border border-border bg-card/50 p-4 md:flex-row">
          <div className="relative w-full md:w-96">
            <Search aria-hidden="true" className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              aria-label="Search by brand or master distiller"
              placeholder="Search by brand or master distiller..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-border bg-background py-2 pr-4 pl-10 font-mono text-sm transition-colors outline-none focus:border-primary/50"
            />
          </div>

          <div className="flex gap-2">
            {REGIONS.map((region) => (
              <button
                key={region}
                type="button"
                aria-pressed={regionFilter === region}
                onClick={() => setRegionFilter(region)}
                className={
                  regionFilter === region
                    ? "border border-primary bg-primary px-4 py-2 font-mono text-xs tracking-wider text-primary-foreground uppercase transition-all"
                    : "border border-border bg-transparent px-4 py-2 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-all hover:border-primary/30"
                }
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducers.map((producer, index) => (
            <div
              key={producer.id}
              // Runtime stagger (index * 0.05s), the one inline style allowed.
              style={{ animationDelay: `${index * 0.05}s` }}
              className="group animate-in overflow-hidden border border-border bg-card transition-all duration-300 fade-in fill-mode-both slide-in-from-bottom-5 hover:border-primary/50"
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <Image
                  src={producer.image.src}
                  alt={producer.brand}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-linear-to-t from-card via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 w-full p-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="font-display text-xl text-foreground">{producer.brand}</h2>
                      <p className="font-mono text-xs text-primary">
                        {producer.nom} • {producer.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-xs text-muted-foreground">EVI: {producer.evi}</div>
                      <div className="font-mono text-xs text-muted-foreground">EEI: {producer.eei}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-4">
                <div className="flex items-center gap-2 border-b border-border/50 pb-2 text-xs text-muted-foreground">
                  {producer.region === "Highlands" ? (
                    <Mountain aria-hidden="true" className="size-3 text-accent" />
                  ) : (
                    <Droplets aria-hidden="true" className="size-3 text-accent" />
                  )}
                  <span className="tracking-wider uppercase">{producer.region}</span>
                </div>

                <p className="line-clamp-3 text-sm leading-relaxed text-foreground/80">{producer.description}</p>

                <div className="pt-2">
                  <span className="text-xs font-bold tracking-widest text-primary uppercase">The Glitch:</span>
                  <p className="mt-1 text-xs text-muted-foreground">{producer.glitch}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
