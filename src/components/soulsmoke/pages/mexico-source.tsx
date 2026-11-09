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

// Ported from the SoulSmoke app's client/src/pages/MexicoSource.tsx. Same bottles, copy (EN/ES), sorting
// and cards. Images are next/image from Sanity. At 375px the two sort buttons stack (live put them
// side by side and they ran off the screen), same as the app's own US Hunt page does.
// The QPR ring color is one full class string per getQPRLabel color instead of an inline style.

type SortField = "evi" | "eei";

type SourceMezcal = {
  producer: string;
  agave: string;
  location: string;
  price: number;
  evi: number;
  eei: number;
  glitch: string;
  emotional: string;
  image: SoulsmokeImage;
};

export const mexicoSourceMezcals: SourceMezcal[] = [
  {
    producer: "Mezcalero Lalo Ángeles",
    agave: "Tobasiche",
    location: "Santa Catarina Minas",
    price: 60,
    evi: 10,
    eei: 10,
    glitch: "Clay pot distillation. The philosopher of Minas. Every batch is a meditation.",
    emotional: "Drinking this feels like listening to someone who has spent a lifetime thinking deeply about one thing.",
    image: img.clayPotRitual,
  },
  {
    producer: "Don Lorenzo Ángeles",
    agave: "Mexicano",
    location: "Santa Catarina Minas",
    price: 55,
    evi: 10,
    eei: 9.5,
    glitch: "The patriarch. Ancestral methods passed down through generations.",
    emotional: "A direct line to the past. It tastes like memory.",
    image: img.mezcaleroHands,
  },
  {
    producer: "Mezcalero Jorge Pérez",
    agave: "Cupreata",
    location: "Michoacán",
    price: 70,
    evi: 9.5,
    eei: 10,
    glitch: "'Vino de Mezcal.' Wild fermentation in underground pits. Untamed.",
    emotional: "The soul of the plant, unfiltered. Spiritual purity.",
    image: img.wildAgave,
  },
  {
    producer: "Mezcalero Isidro Rodríguez",
    agave: "Papalote",
    location: "Guerrero",
    price: 50,
    evi: 10,
    eei: 9.0,
    glitch: "Fermented in bovine hide. Earthy, funky, alive.",
    emotional: "It tastes like the earth breathing. Primal and honest.",
    image: img.bottleWild,
  },
  {
    producer: "Real Minero (Graciela Ángeles)",
    agave: "Largo",
    location: "Santa Catarina Minas",
    price: 80,
    evi: 9.0,
    eei: 10,
    glitch: "The aristocracy of mezcal. Precise, elegant, ancient.",
    emotional: "A connection to generations of wisdom. Drinking history.",
    image: img.bottleMystical,
  },
  {
    producer: "Mezcalero Aquilino García",
    agave: "Jabalí",
    location: "San Luis del Río",
    price: 65,
    evi: 9.5,
    eei: 9.5,
    glitch: "The 'Wild Boar.' Foams and explodes during distillation. Dangerous and beautiful.",
    emotional: "Taming the beast. You can taste the struggle.",
    image: img.agavePlant,
  },
  {
    producer: "Mezcalero Valentín Cortés",
    agave: "Tepeztate",
    location: "Miahuatlán",
    price: 90,
    evi: 8.5,
    eei: 10,
    glitch: "Takes 25+ years to mature. Grows on cliff faces. Rare and precious.",
    emotional: "The patience of the plant becomes the patience of the spirit. Transcendent.",
    image: img.wildTepeztate,
  },
  {
    producer: "Mezcalero Beto Morales",
    agave: "Bicuixe",
    location: "San Baltazar Guelavila",
    price: 75,
    evi: 9.0,
    eei: 9.5,
    glitch: "High minerality. Bright acids. Electric.",
    emotional: "A shock to the system. Wakes up every synapse.",
    image: img.bottleWild,
  },
  {
    producer: "Mezcalero Tío Pedro Hernández",
    agave: "Arroqueño",
    location: "Sola de Vega",
    price: 85,
    evi: 8.5,
    eei: 9.5,
    glitch: "Massive agaves (200+ kg). Takes 18-20 years. Floral, complex, layered.",
    emotional: "The weight of time. It feels like opening a time capsule.",
    image: img.bottleMystical,
  },
  {
    producer: "Mezcalero Don Aurelio",
    agave: "Cuishe",
    location: "Santiago Matatlán",
    price: 60,
    evi: 9.5,
    eei: 9.0,
    glitch: "Fermented in oak. Bright, citrusy, elegant.",
    emotional: "A sunrise in liquid form. Optimistic and alive.",
    image: img.agaveField1,
  },
  {
    producer: "Mezcalero Macario Partida",
    agave: "Raicilla (Maximiliana)",
    location: "Sierra del Tigre",
    price: 55,
    evi: 10,
    eei: 9.0,
    glitch: "Fermented in pine boxes. Tastes like blue cheese and forest floor.",
    emotional: "A walk in a damp forest at twilight. Haunting.",
    image: img.earthOven,
  },
  {
    producer: "Mezcalero Don Mateo",
    agave: "Sierra Negra",
    location: "San Luis del Río",
    price: 70,
    evi: 9.0,
    eei: 9.5,
    glitch: "Fermented in bovine hide. Unfiltered, raw, chaotic.",
    emotional: "Chaos and beauty intertwined. It tastes like the earth breathing.",
    image: img.bottleWild,
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

export function MexicoSource() {
  const [sortField, setSortField] = useState<SortField>("eei");
  const { language } = useLanguage();

  const sortedMezcals = useMemo(() => {
    return [...mexicoSourceMezcals].sort((a, b) => b[sortField] - a[sortField]);
  }, [sortField]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative flex h-[60vh] items-center justify-center overflow-hidden">
        <Image
          src={img.earthOven.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-background"></div>

        <div className="relative z-10 container space-y-6 text-center">
          <h1 className="font-display text-6xl font-black text-white drop-shadow-2xl md:text-8xl">
            {language === "es" ? "La Fuente México" : "The Mexico Source"}
          </h1>
          <p className="mx-auto max-w-4xl text-2xl leading-relaxed text-amber-400 md:text-3xl">
            {language === "es"
              ? "Lo más loco e interesante. Donde la magia sucede de verdad."
              : "The craziest, most interesting stuff. Where the magic happens."}
          </p>
        </div>

        <Button
          asChild
          variant="ghost"
          className="absolute top-24 left-4 sm:left-8 gap-2 text-white hover:bg-white/10 hover:text-amber-500"
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
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <SlidersHorizontal aria-hidden="true" className="size-6 text-amber-500" />
              <span className="text-lg font-semibold">{language === "es" ? "Ordenar por:" : "Sort by:"}</span>
            </div>

            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
              <Button
                variant={sortField === "evi" ? "default" : "outline"}
                aria-pressed={sortField === "evi"}
                onClick={() => setSortField("evi")}
                className={
                  sortField === "evi"
                    ? "w-full bg-lime-500 text-black hover:bg-lime-600 sm:w-auto"
                    : "w-full border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-black sm:w-auto"
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
                    ? "w-full bg-amber-500 text-black hover:bg-amber-600 sm:w-auto"
                    : "w-full border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black sm:w-auto"
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
                key={`${mezcal.producer}-${mezcal.agave}`}
                className="group relative overflow-hidden rounded-lg border-2 border-gray-800 bg-card transition-all duration-300 hover:border-amber-500"
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
                    <div className="text-2xl font-bold text-amber-500">${mezcal.price}</div>
                  </div>

                  {/* QPR Badge */}
                  <QprBadge brand={mezcal.producer} expression={mezcal.agave} />
                </div>

                {/* Content */}
                <div className="space-y-4 p-6">
                  <div>
                    <h3 className="font-display text-2xl font-bold transition-colors group-hover:text-amber-500">
                      {mezcal.producer}
                    </h3>
                    <p className="text-lg text-muted-foreground">{mezcal.agave}</p>
                    <p className="text-sm text-muted-foreground">{mezcal.location}</p>
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
