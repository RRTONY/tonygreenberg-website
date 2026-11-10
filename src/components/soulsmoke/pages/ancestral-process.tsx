"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageJourney } from "@/components/soulsmoke/page-journey";
import { useLanguage } from "@/components/soulsmoke/soulsmoke-providers";
import { soulsmokeImages as img } from "@/lib/content/soulsmoke/images";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/AncestralProcess.tsx. Same stages, copy (EN/ES),
// scroll progress bar and stage dots. Each stage keeps live's fixed-attachment background
// (next/image can't do background-attachment: fixed), so it is a literal Sanity url() class.
// The gradient is one full class string per stage instead of `${stage.color}` fragments.

export const processStages = [
  {
    id: 1,
    title: "The Harvest",
    subtitle: "Jima",
    duration: "Day 1",
    background:
      "bg-[url(https://cdn.sanity.io/images/a3q1cyqs/production/0ae85b80b555c42f59e4dd8fcddd2ac3df92ca62-1920x1072.webp?w=1920&auto=format)]",
    description:
      "The jimador reads the plant like scripture. After years—sometimes decades—of patient growth, the agave signals its readiness. With a coa (a sharp, circular blade), the jimador strips away the pencas (leaves) to reveal the piña, the heart of the plant. Each cut is deliberate. Each plant is a life's work.",
    quote: "We don't harvest the agave. The agave tells us when it's ready to become mezcal.",
    gradient: "bg-linear-to-r from-emerald-900/80 to-stone-950/95",
  },
  {
    id: 2,
    title: "The Roasting",
    subtitle: "Horneado",
    duration: "3-5 Days",
    background:
      "bg-[url(https://cdn.sanity.io/images/a3q1cyqs/production/35ef54df35104a5463fc62d73bb1d6a7bc5af2ce-1920x1072.webp?w=1920&auto=format)]",
    description:
      "A conical pit is dug into the earth. Volcanic rocks are heated until they glow red. The piñas are placed inside, covered with agave fibers and earth, and left to roast for days. This is where mezcal gets its smoke—not from wood, but from the earth itself. The sugars caramelize. The transformation begins.",
    quote: "The earth oven is a womb. The agave enters raw and emerges reborn.",
    gradient: "bg-linear-to-r from-orange-900/80 to-stone-950/95",
  },
  {
    id: 3,
    title: "The Crushing",
    subtitle: "Molienda",
    duration: "1-2 Days",
    background:
      "bg-[url(https://cdn.sanity.io/images/a3q1cyqs/production/7468be4e09fb3fdc237d757afc8eb37384fc2940-1920x1072.webp?w=1920&auto=format)]",
    description:
      "The roasted piñas are placed in a circular stone pit. A massive volcanic wheel—the tahona—is pulled by horse or mule in endless circles, crushing the fibers and releasing the sweet, smoky juice. Some palenques still use wooden mallets, pounding by hand. The rhythm is ancient. The work is sacred.",
    quote: "The tahona doesn't just crush. It meditates. Each rotation is a prayer.",
    gradient: "bg-linear-to-r from-amber-900/80 to-stone-950/95",
  },
  {
    id: 4,
    title: "The Fermentation",
    subtitle: "Fermentación",
    duration: "8-30 Days",
    background:
      "bg-[url(https://cdn.sanity.io/images/a3q1cyqs/production/f931e33632eca5638bddc92c56004d7c95f46cf3-1920x1072.webp?w=1920&auto=format)]",
    description:
      "The crushed agave—fibers and juice together—is placed in open wooden vats or hollowed tree trunks. Wild yeasts from the air begin their work. No commercial cultures. No temperature control. Just patience and trust. The liquid bubbles and churns, transforming sugar into alcohol. Each palenque's fermentation is unique, shaped by its microclimate.",
    quote: "We don't control fermentation. We witness it. The yeasts know what to do.",
    gradient: "bg-linear-to-r from-yellow-900/80 to-stone-950/95",
  },
  {
    id: 5,
    title: "The Distillation",
    subtitle: "Destilación",
    duration: "2-3 Days",
    background:
      "bg-[url(https://cdn.sanity.io/images/a3q1cyqs/production/f058c330980f379093813134cee10499c7bef669-1920x1072.webp?w=1920&auto=format)]",
    description:
      "For ancestral mezcal, clay pot stills are used—the same technology employed for centuries. The fermented mash is heated over an open fire. Vapor rises, condenses, and drips into collection vessels. The mezcalero tastes constantly, separating the heads, hearts, and tails by intuition. The heart—the corazón—is the spirit.",
    quote: "Clay breathes. It gives the mezcal its final character. Copper is efficient. Clay is alive.",
    gradient: "bg-linear-to-r from-red-900/80 to-stone-950/95",
  },
  {
    id: 6,
    title: "The Resting",
    subtitle: "Reposo",
    duration: "Weeks to Months",
    background:
      "bg-[url(https://cdn.sanity.io/images/a3q1cyqs/production/f58179c4719d297723232fa8f4718bf84274caff-1920x1072.webp?w=1920&auto=format)]",
    description:
      "The fresh mezcal rests in glass demijohns, allowing the volatile compounds to mellow and integrate. Unlike tequila, most mezcal is not aged in wood—the goal is to preserve the pure expression of the agave and the mezcalero's hand. Time softens the edges. The spirit finds its balance.",
    quote: "Mezcal doesn't need oak to be complete. It needs only time and glass.",
    gradient: "bg-linear-to-r from-stone-800/80 to-stone-950/95",
  },
];

export function AncestralProcess() {
  const [activeStage, setActiveStage] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);

      // Calculate active stage based on scroll position
      const stageHeight = docHeight / processStages.length;
      const newStage = Math.min(Math.floor(scrollTop / stageHeight), processStages.length - 1);
      setActiveStage(newStage);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="bg-stone-950 text-stone-100">
      {/* Progress Bar */}
      <div className="fixed top-0 right-0 left-0 z-50 h-1 bg-stone-900">
        <div
          className="h-full bg-linear-to-r from-lime-500 via-amber-500 to-red-500 transition-all duration-150"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Stage Indicators */}
      <div className="fixed top-1/2 right-6 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        {processStages.map((stage, index) => (
          <button
            key={stage.id}
            type="button"
            onClick={() => {
              const element = document.getElementById(`stage-${stage.id}`);
              element?.scrollIntoView({ behavior: "smooth" });
            }}
            className={
              index === activeStage
                ? "size-3 scale-150 rounded-full bg-lime-500 transition-all duration-300"
                : index < activeStage
                  ? "size-3 rounded-full bg-lime-500/50 transition-all duration-300"
                  : "size-3 rounded-full bg-stone-700 transition-all duration-300 hover:bg-stone-600"
            }
            title={stage.title}
            aria-label={stage.title}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="smoke-overlay mystical-mist smoky-hero relative flex h-screen items-center justify-center overflow-hidden">
        {/* Smoke Wisps Layer */}
        <div className="smoke-wisps" />
        <div className="smoke-layer" />
        <div className="absolute inset-0" style={{ transform: `scale(${1 + scrollProgress * 0.2})` }}>
          <Image src={img.heroMystical.src} alt="" fill priority sizes="100vw" className="object-cover object-center" />
        </div>
        {/* Ethereal Glow */}
        <div className="ethereal-glow absolute inset-0" />
        <div className="absolute inset-0 bg-linear-to-b from-stone-950/70 via-stone-950/50 to-stone-950" />

        <Button
          asChild
          variant="ghost"
          className="absolute top-6 left-6 z-20 text-stone-200 hover:bg-transparent hover:text-lime-400"
        >
          <Link href={ss("/")}>
            <ArrowLeft aria-hidden="true" className="mr-2 size-5" />
            {language === "es" ? "Volver" : "Back"}
          </Link>
        </Button>

        <div className="relative z-10 max-w-4xl px-6 text-center">
          <p className="animate-fade-in mb-6 font-mono text-sm tracking-[0.3em] text-lime-400">
            {language === "es" ? "DE LA TIERRA AL ESPÍRITU" : "FROM EARTH TO SPIRIT"}
          </p>
          <h1 className="animate-fade-in mb-6 font-serif text-5xl font-bold md:text-8xl">
            {language === "es" ? "El Proceso\nAncestral" : "The Ancestral\nProcess"}
          </h1>
          <p className="animate-fade-in mb-12 text-xl text-stone-300 md:text-2xl">
            {language === "es"
              ? "Seis etapas. Siglos de sabiduría. Una transformación sagrada."
              : "Six stages. Centuries of wisdom. One sacred transformation."}
          </p>
          <div className="animate-bounce">
            <ArrowDown aria-hidden="true" className="mx-auto size-8 text-lime-500" />
          </div>
        </div>
      </section>

      {/* Process Stages */}
      {processStages.map((stage, index) => (
        <section key={stage.id} id={`stage-${stage.id}`} className="relative flex min-h-screen items-center">
          {/* Background Image with Parallax */}
          <div
            className={`absolute inset-0 ${stage.background} bg-cover bg-fixed bg-center transition-transform duration-1000`}
          />
          <div className={`absolute inset-0 ${stage.gradient}`} />

          {/* Content */}
          <div className="relative z-10 container py-20">
            <div className={index % 2 === 0 ? "ml-0 max-w-4xl" : "ml-auto max-w-4xl"}>
              {/* Stage Number */}
              <div className="mb-6 flex items-center gap-4">
                <span className="font-serif text-8xl font-bold text-white/10 md:text-9xl">
                  {String(stage.id).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-mono text-sm tracking-wider text-lime-400">{stage.subtitle.toUpperCase()}</p>
                  <p className="text-sm text-stone-400">{stage.duration}</p>
                </div>
              </div>

              {/* Title */}
              <h2 className="mb-8 font-serif text-4xl font-bold md:text-6xl">{stage.title}</h2>

              {/* Description */}
              <p className="mb-8 max-w-2xl text-lg leading-relaxed text-stone-200 md:text-xl">{stage.description}</p>

              {/* Quote */}
              <blockquote className="border-l-4 border-lime-500 py-2 pl-6">
                <p className="text-lg text-stone-300 italic">&quot;{stage.quote}&quot;</p>
                <cite className="mt-2 block text-sm text-stone-600">— Traditional Mezcalero Wisdom</cite>
              </blockquote>
            </div>
          </div>

          {/* Scroll Indicator */}
          {index < processStages.length - 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <ArrowDown aria-hidden="true" className="size-6 text-lime-500/50" />
            </div>
          )}
        </section>
      ))}

      {/* Final CTA */}
      <section className="relative bg-stone-900 px-6 py-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-6 font-mono text-sm tracking-[0.3em] text-lime-400">
            {language === "es" ? "EL VIAJE CONTINÚA" : "THE JOURNEY CONTINUES"}
          </p>
          <h2 className="mb-6 font-serif text-4xl font-bold md:text-5xl">
            {language === "es" ? "Ahora Entiendes" : "Now You Understand"}
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-xl text-stone-300">
            {language === "es"
              ? "Cada botella de mezcal ancestral lleva esta historia. La tierra, el fuego, la paciencia, las manos. Cuando lo pruebas, pruebas siglos."
              : "Every bottle of ancestral mezcal carries this story. The earth, the fire, the patience, the hands. When you taste it, you taste centuries."}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild className="bg-lime-500 px-8 py-6 text-lg text-stone-950 hover:bg-lime-400">
              <Link href={ss("/agave-encyclopedia")}>
                {language === "es" ? "Explora los Agaves" : "Explore the Agaves"}
                <ArrowRight aria-hidden="true" className="size-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-stone-600 px-8 py-6 text-lg text-stone-200 hover:bg-stone-800"
            >
              <Link href={ss("/scent-finder")}>
                {language === "es" ? "Encuentra Tu Sabor" : "Find Your Flavor"}
                <ArrowRight aria-hidden="true" className="size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Page Journey Navigation */}
      <PageJourney currentPath="/ancestral-process" />
    </div>
  );
}
