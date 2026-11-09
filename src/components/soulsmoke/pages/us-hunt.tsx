"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Home, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/soulsmoke/soulsmoke-providers";
import { soulsmokeImages as img, type SoulsmokeImage } from "@/lib/content/soulsmoke/images";
import { getEnrichedMezcalByBrandExpression } from "@/lib/content/soulsmoke/mezcal-enriched";
import { ss } from "@/lib/content/soulsmoke/nav";
import { getQPRLabel } from "@/lib/content/soulsmoke/qpr-engine";

// Ported from the SoulSmoke app's client/src/pages/USHunt.tsx. Same bottles, copy (EN/ES), sorting
// and cards. Images are next/image from Sanity. Live's hero pointed at /images/agave-field-1.jpg,
// a file the app never had (only .webp), so the hero showed no photo; it uses agave-field-1.webp.
// The QPR ring color is one full class string per getQPRLabel color instead of an inline style.

type SortField = "evi" | "eei";

type HuntMezcal = {
  brand: string;
  expression: string;
  price: number;
  evi: number;
  eei: number;
  glitch: string;
  emotional: string;
  image: SoulsmokeImage;
};

export const usHuntMezcals: HuntMezcal[] = [
  {
    brand: "5 Sentidos",
    expression: "Sierra Negra",
    price: 124,
    evi: 8.5,
    eei: 10,
    glitch: "Fermented in bovine hide. Unfiltered, raw, chaotic.",
    emotional: "A direct line to the chaos of nature. It tastes like the earth breathing.",
    image: img.bottleWild,
  },
  {
    brand: "Lalocura",
    expression: "Tobasiche",
    price: 110,
    evi: 8.0,
    eei: 10,
    glitch: "Clay pot distilled by Lalo Ángeles, the 'philosopher of Minas.'",
    emotional: "Intellectual complexity. It demands you sit in silence and listen.",
    image: img.clayPotRitual,
  },
  {
    brand: "Real Minero",
    expression: "Largo",
    price: 130,
    evi: 7.5,
    eei: 10,
    glitch: "Ancestral clay pot. The 'aristocracy' of mezcal. Precise, elegant, ancient.",
    emotional: "A connection to generations of wisdom. It feels like drinking history.",
    image: img.bottleMystical,
  },
  {
    brand: "Mezonte",
    expression: "Michoacán (Jorge Pérez)",
    price: 145,
    evi: 7.0,
    eei: 10,
    glitch: "'Vino de Mezcal.' Wild yeasts, underground ovens, pure spirit.",
    emotional: "The soul of the plant, unmediated by commerce. Spiritual purity.",
    image: img.wildAgave,
  },
  {
    brand: "Gusto Histórico",
    expression: "Cuishe",
    price: 118,
    evi: 8.0,
    eei: 9.5,
    glitch: "High proof (often 50%+). Intense minerality and bright acids.",
    emotional: "An electric shock to the system. Wakes up every synapse.",
    image: img.bottleWild,
  },
  {
    brand: "Neta",
    expression: "Bicuixe",
    price: 149,
    evi: 6.5,
    eei: 9.5,
    glitch: "'Neta' means 'The Truth.' Small batches from Miahuatlán.",
    emotional: "Unvarnished reality. It tastes like the specific hillside it grew on.",
    image: img.agavePlant,
  },
  {
    brand: "La Venenosa",
    expression: "Sierra del Tigre",
    price: 95,
    evi: 9.5,
    eei: 9.5,
    glitch: "Raicilla. Fermented in pine boxes. Tastes like blue cheese and forest floor.",
    emotional: "A walk in a damp forest at twilight. Haunting and strange.",
    image: img.bottleMystical,
  },
  {
    brand: "Mal Bien",
    expression: "Green Tape (Papalote)",
    price: 85,
    evi: 9.0,
    eei: 9.0,
    glitch: "Curated batches from specific legends (like the Isidro family).",
    emotional: "The feeling of discovering a secret. Intimate and personal.",
    image: img.mezcaleroHands,
  },
  {
    brand: "Caballito Cerrero",
    expression: "Chato",
    price: 75,
    evi: 9.5,
    eei: 8.5,
    glitch: "The Rebel. Refuses to call itself Tequila or Mezcal. 'Agave Spirit.'",
    emotional: "Defiance. Tastes like freedom and roasted agave sugar.",
    image: img.bottleWild,
  },
  {
    brand: "Lamata",
    expression: "Lechuguilla",
    price: 135,
    evi: 7.0,
    eei: 9.0,
    glitch: "Tiny wild agaves from Sonora. Intense, green, vibrant.",
    emotional: "The resilience of life in the harshest deserts.",
    image: img.wildAgave,
  },
  {
    brand: "Dixeebe",
    expression: "Pulquero",
    price: 110,
    evi: 8.0,
    eei: 9.5,
    glitch: "Distilled from Pulque (fermented sap), not the heart. Creamy, sour, wild.",
    emotional: "A shapeshifter. It defies your definition of what agave spirits are.",
    image: img.bottleMystical,
  },
  {
    brand: "Rey Campero",
    expression: "Jabalí",
    price: 90,
    evi: 9.0,
    eei: 9.0,
    glitch: "The 'Wild Boar' agave. Foams and explodes during distillation.",
    emotional: "Taming the beast. You can taste the struggle and the victory.",
    image: img.agavePlant,
  },
];

// One full class string per getQPRLabel color, so Tailwind sees them.
const QPR_RING: Record<string, string> = {
  "#22c55e": "border-[#22c55e] text-[#22c55e]",
  "#84cc16": "border-[#84cc16] text-[#84cc16]",
  "#eab308": "border-[#eab308] text-[#eab308]",
  "#f97316": "border-[#f97316] text-[#f97316]",
  "#ef4444": "border-[#ef4444] text-[#ef4444]",
};

function QprBadge({ brand, expression }: { brand: string; expression: string }) {
  const enriched = getEnrichedMezcalByBrandExpression(brand, expression);
  if (!enriched) return null;
  const qprInfo = getQPRLabel(enriched.qpr);
  return (
    <div className="absolute right-4 bottom-4">
      <div
        className={`flex size-12 items-center justify-center rounded-full border-2 bg-black/60 text-sm font-bold backdrop-blur-sm ${QPR_RING[qprInfo.color] ?? QPR_RING["#ef4444"]}`}
        title={`QPR: ${enriched.qpr.toFixed(1)} — ${qprInfo.label}`}
      >
        {enriched.qpr.toFixed(1)}
      </div>
    </div>
  );
}

export function UsHunt() {
  const [sortField, setSortField] = useState<SortField>("eei");
  const { language } = useLanguage();

  const sortedMezcals = useMemo(() => {
    return [...usHuntMezcals].sort((a, b) => b[sortField] - a[sortField]);
  }, [sortField]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative flex h-[60vh] items-center justify-center overflow-hidden">
        <Image
          src={img.agaveField1.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-background"></div>

        <div className="relative z-10 container space-y-6 text-center">
          <h1 className="font-display text-6xl font-black text-white drop-shadow-2xl md:text-8xl">
            {language === "es" ? "La Cacería USA" : "The US Hunt"}
          </h1>
          <p className="mx-auto max-w-4xl text-2xl leading-relaxed text-lime-400 md:text-3xl">
            {language === "es"
              ? "Las botellas más esotéricas y alucinantes que de alguna manera cruzaron la frontera"
              : "The most esoteric, mind-bending bottles that somehow made it across the border"}
          </p>
        </div>

        <Button
          asChild
          variant="ghost"
          className="absolute top-24 left-4 sm:left-8 gap-2 text-white hover:bg-white/10 hover:text-lime-500"
        >
          <Link href={ss("/")}>
            <Home aria-hidden="true" className="size-5" />
            {language === "es" ? "Volver" : "Back to Home"}
          </Link>
        </Button>
      </section>

      {/* Sort Controls */}
      <section className="border-y border-gray-800 bg-card/50 py-12">
        <div className="container">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4">
            <div className="flex items-center gap-3">
              <SlidersHorizontal aria-hidden="true" className="size-6 text-lime-500" />
              <span className="text-lg font-semibold">{language === "es" ? "Ordenar por:" : "Sort by:"}</span>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button
                variant={sortField === "evi" ? "default" : "outline"}
                aria-pressed={sortField === "evi"}
                onClick={() => setSortField("evi")}
                className={
                  sortField === "evi"
                    ? "w-full bg-lime-500 text-sm text-black hover:bg-lime-600 sm:w-auto sm:text-base"
                    : "w-full border-lime-500 text-sm text-lime-500 hover:bg-lime-500 hover:text-black sm:w-auto sm:text-base"
                }
              >
                {language === "es" ? "Valor Extraordinario (EVI)" : "Extraordinary Value (EVI)"}
              </Button>
              <Button
                variant={sortField === "eei" ? "default" : "outline"}
                aria-pressed={sortField === "eei"}
                onClick={() => setSortField("eei")}
                className={
                  sortField === "eei"
                    ? "w-full bg-amber-500 text-sm text-black hover:bg-amber-600 sm:w-auto sm:text-base"
                    : "w-full border-amber-500 text-sm text-amber-500 hover:bg-amber-500 hover:text-black sm:w-auto sm:text-base"
                }
              >
                {language === "es" ? "Experiencia Extraordinaria (EEI)" : "Extraordinary Experience (EEI)"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mezcal Cards Grid */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sortedMezcals.map((mezcal) => (
              <div
                key={`${mezcal.brand}-${mezcal.expression}`}
                className="group relative overflow-hidden rounded-lg border-2 border-gray-800 bg-card transition-all duration-300 hover:border-lime-500"
              >
                {/* Image */}
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={mezcal.image.src}
                    alt={mezcal.image.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover object-center brightness-[0.7] transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-card via-card/50 to-transparent"></div>

                  {/* Scores Overlay */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <div className="rounded-lg bg-lime-500/90 px-3 py-2 backdrop-blur-sm">
                      <div className="text-xs font-semibold text-black">EVI</div>
                      <div className="text-2xl font-bold text-black">{mezcal.evi}</div>
                    </div>
                    <div className="rounded-lg bg-amber-500/90 px-3 py-2 backdrop-blur-sm">
                      <div className="text-xs font-semibold text-black">EEI</div>
                      <div className="text-2xl font-bold text-black">{mezcal.eei}</div>
                    </div>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute top-4 left-4 rounded-lg bg-black/80 px-4 py-2 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-lime-500">${mezcal.price}</div>
                  </div>

                  {/* QPR Badge */}
                  <QprBadge brand={mezcal.brand} expression={mezcal.expression} />
                </div>

                {/* Content */}
                <div className="space-y-4 p-6">
                  <div>
                    <h3 className="font-display text-2xl font-bold transition-colors group-hover:text-lime-500">
                      {mezcal.brand}
                    </h3>
                    <p className="text-lg text-muted-foreground">{mezcal.expression}</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="mb-1 text-xs font-semibold tracking-wider text-lime-500 uppercase">
                        {language === "es" ? "El Glitch" : "The Glitch"}
                      </div>
                      <p className="text-sm leading-relaxed text-foreground">{mezcal.glitch}</p>
                    </div>

                    <div>
                      <div className="mb-1 text-xs font-semibold tracking-wider text-amber-500 uppercase">
                        {language === "es" ? "La Sensación" : "The Feeling"}
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground italic">{mezcal.emotional}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
