"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Flame, Map, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmailSignup } from "@/components/soulsmoke/email-signup";
import { PageJourney } from "@/components/soulsmoke/page-journey";
import { useLanguage, useViewMode } from "@/components/soulsmoke/soulsmoke-providers";
import { soulsmokeImages as img } from "@/lib/content/soulsmoke/images";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/Home.tsx. Same sections, copy (EN/ES) and
// effects; background images are next/image from Sanity instead of CSS url(/images/...).

export function SoulsmokeHome() {
  const [scrollY, setScrollY] = useState(0);
  const { language, t } = useLanguage();
  const { isAficionado, isSoulSmoke } = useViewMode();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxOffset = scrollY * 0.5;
  const heroOpacity = Math.max(0, 1 - scrollY / 600);
  const title = isAficionado ? "MEZCAL GUIDE" : "SOULSMOKE";

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Full-Screen Immersive Hero */}
      <section
        className={
          isSoulSmoke
            ? "grain scanlines smoke-overlay mystical-mist smoky-hero relative flex h-screen items-center justify-center overflow-hidden"
            : "relative flex h-screen items-center justify-center overflow-hidden"
        }
        // Fades out as the visitor scrolls (runtime value).
        style={{ opacity: heroOpacity }}
      >
        {isSoulSmoke && <div className="smoke-wisps" />}
        {isSoulSmoke && <div className="smoke-layer" />}

        {/* Background Image with Parallax */}
        <div className="absolute inset-0" style={{ transform: `translateY(${parallaxOffset}px)` }}>
          <Image
            src={img.heroMystical.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.6]"
          />
        </div>

        {isSoulSmoke && <div className="ethereal-glow absolute inset-0" />}

        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/80" />

        {isSoulSmoke && (
          <div className="glitch-image absolute inset-0 bg-[url(https://cdn.sanity.io/images/a3q1cyqs/production/0ae85b80b555c42f59e4dd8fcddd2ac3df92ca62-1920x1072.webp?w=1920&auto=format)] bg-cover bg-center" />
        )}

        {isSoulSmoke && (
          <div
            className="absolute inset-0 bg-[url(https://cdn.sanity.io/images/a3q1cyqs/production/8f4556a90274b877b9a8108a7d6909f93735f395-1920x1072.webp?w=1920&auto=format)] bg-cover bg-center opacity-30 mix-blend-overlay"
            style={{ transform: `scale(${1 + scrollY * 0.0005})` }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 container space-y-8 px-4 text-center">
          <div className="space-y-4">
            <h1
              className={
                isSoulSmoke
                  ? "glitch rgb-split animate-fade-in font-display text-4xl font-black tracking-tight text-white drop-shadow-2xl [text-shadow:0_0_40px_rgba(0,0,0,0.8),0_0_80px_rgba(163,230,53,0.3)] sm:text-6xl md:text-8xl lg:text-9xl"
                  : "animate-fade-in font-display text-4xl font-black tracking-tight text-white drop-shadow-2xl [text-shadow:0_0_20px_rgba(0,0,0,0.5)] sm:text-6xl md:text-8xl lg:text-9xl"
              }
              data-text={title}
            >
              {title}
            </h1>

            <p className="animate-fade-in-delay-1 font-display text-xl text-lime-400 drop-shadow-lg sm:text-2xl md:text-3xl lg:text-4xl">
              {t("hero.subtitle")}
            </p>
          </div>

          <div className="animate-fade-in-delay-2 mx-auto max-w-3xl space-y-6 px-4 text-base leading-relaxed sm:text-lg md:text-xl lg:text-2xl">
            <p className="font-semibold text-white italic drop-shadow-lg">{t("hero.tagline")}</p>
          </div>

          <div className="animate-fade-in-delay-3 flex flex-col justify-center gap-4 pt-8 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="gap-2 bg-lime-500 text-lg font-bold text-black shadow-2xl hover:bg-lime-600"
            >
              <Link href={ss("/scent-finder")}>
                <Search aria-hidden="true" className="size-5" />
                {t("hero.cta.scent")}
                <ArrowRight aria-hidden="true" className="size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Manifesto Section with Image */}
      <section className="relative overflow-hidden bg-linear-to-b from-background to-card py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.55_0.15_35),transparent_70%)]" />
        </div>

        <div className="relative z-10 container px-4">
          <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-2 md:gap-16">
            <div className="space-y-6 md:space-y-8">
              <h2 className="font-display text-3xl leading-tight font-bold sm:text-4xl md:text-5xl lg:text-6xl">
                {language === "es" ? "Sé el " : "Be the "}
                <span className="text-lime-500">Glitch</span>
              </h2>

              <div className="space-y-4 text-base leading-relaxed text-muted-foreground md:space-y-6 md:text-lg">
                <p>
                  {language === "es"
                    ? "Esto no es una guía del 'Veuve Clicquot del Mezcal.' No nos interesa lo ordinario, lo predecible, ni lo que tu cuñado recomienda."
                    : "This is not a guide to the 'Veuve Clicquot of Mezcal.' We have zero interest in the ordinary, the predictable, or whatever your brother-in-law recommends."}
                </p>
                <p className="font-semibold text-foreground">
                  {language === "es"
                    ? "Estamos aquí por los glitches—los agaves silvestres, las destilaciones en olla de barro, los mezcaleros que prefieren morir antes que usar un difusor."
                    : "We're here for the glitches—the wild agaves, the clay pot distillations, the mezcaleros who'd rather die than use a diffuser."}
                </p>
                <p>
                  {language === "es"
                    ? "Estamos aquí por las botellas que hacen que tu paladar tenga una crisis existencial, cuentan historias que no creerías, y se sienten como una ruptura en la matrix de los destilados producidos en masa."
                    : "We're here for the bottles that give your palate an existential crisis, tell stories you wouldn't believe, and feel like a rupture in the matrix of mass-produced spirits."}
                </p>
              </div>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 border-lime-500 bg-transparent text-lg text-lime-500 hover:bg-lime-500 hover:text-black"
              >
                <Link href={ss("/us-hunt")}>
                  <Sparkles aria-hidden="true" className="size-5" />
                  {t("hero.cta.collection")}
                </Link>
              </Button>
            </div>

            <div className="group relative">
              <div className="absolute -inset-4 rounded-lg bg-lime-500/20 blur-xl transition-all duration-500 group-hover:bg-lime-500/30" />
              <Image
                src={img.clayPotRitual.src}
                alt={img.clayPotRitual.alt}
                width={img.clayPotRitual.width}
                height={img.clayPotRitual.height}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="relative h-auto w-full transform rounded-lg shadow-2xl saturate-[1.2] contrast-[1.1] transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dual Index Philosophy */}
      <section className="relative overflow-hidden bg-card py-32">
        <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-transparent via-lime-500 to-transparent" />

        <div className="container">
          <div className="mx-auto max-w-5xl space-y-16">
            <h2 className="px-4 text-center font-display text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
              {language === "es" ? "Dos Formas de " : "Two Ways to "}
              <span className="text-lime-500">{language === "es" ? "Medir la Magia" : "Measure Magic"}</span>
            </h2>

            <div className="grid gap-6 px-4 md:grid-cols-2 md:gap-12">
              <div className="group rounded-lg border-2 border-lime-500/20 bg-background/50 p-4 transition-all duration-300 hover:border-lime-500/60 hover:shadow-2xl hover:shadow-lime-500/20 sm:p-6 md:p-8">
                <div className="mb-4 flex flex-col items-start gap-3 sm:mb-6 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-lime-500/20 transition-transform group-hover:scale-110 sm:size-16">
                    <span className="text-xl font-bold text-lime-500 sm:text-3xl">EVI</span>
                  </div>
                  <h3 className="font-display text-xl font-bold sm:text-2xl md:text-3xl">
                    {language === "es" ? "Índice de Valor Extraordinario" : "Extraordinary Value Index"}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
                  {language === "es"
                    ? "Máximo rendimiento por tu inversión en rareza. Botellas esotéricas que no cuestan una fortuna pero golpean muy por encima de su peso en complejidad y alma. Las joyas ocultas que te hacen sentir que descubriste un secreto que nadie más conoce."
                    : "Maximum bang for your weirdness buck. Esoteric bottles that won't bankrupt you but punch way above their weight in complexity and soul. Hidden gems that make you feel like you've stumbled onto a secret nobody else knows."}
                </p>
              </div>

              <div className="group rounded-lg border-2 border-amber-500/20 bg-background/50 p-4 transition-all duration-300 hover:border-amber-500/60 hover:shadow-2xl hover:shadow-amber-500/20 sm:p-6 md:p-8">
                <div className="mb-4 flex flex-col items-start gap-3 sm:mb-6 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-amber-500/20 transition-transform group-hover:scale-110 sm:size-16">
                    <span className="text-xl font-bold text-amber-500 sm:text-3xl">EEI</span>
                  </div>
                  <h3 className="font-display text-xl font-bold sm:text-2xl md:text-3xl">
                    {language === "es" ? "Índice de Experiencia Extraordinaria" : "Extraordinary Experience Index"}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
                  {language === "es"
                    ? "Intensidad pura. Las botellas más alucinantes, conmovedoras e intelectualmente desafiantes, sin importar el precio. Experiencias únicas en la vida que exigen que te sientes en silencio, apagues tu teléfono, y escuches."
                    : "Pure intensity. The most mind-bending, heart-touching, intellectually challenging bottles, regardless of price. Once-in-a-lifetime experiences that demand you sit in silence, put your phone away, and actually listen."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Cards */}
      <section className="bg-linear-to-b from-card to-background py-16 md:py-32">
        <div className="container px-4">
          <h2 className="mb-10 text-center font-display text-3xl font-bold sm:text-4xl md:mb-20 md:text-5xl lg:text-6xl">
            {language === "es" ? "Elige Tu " : "Choose Your "}
            <span className="text-lime-500">{language === "es" ? "Aventura" : "Adventure"}</span>
          </h2>

          <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
            <Link
              href={ss("/us-hunt")}
              className="group relative h-[350px] cursor-pointer overflow-hidden rounded-lg border-2 border-gray-800 transition-all duration-300 hover:border-lime-500 sm:h-[400px] md:h-[500px]"
            >
              <Image
                src={img.agaveField1.src}
                alt=""
                fill
                sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover object-center brightness-[0.6] transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
              <div className="relative flex h-full flex-col justify-end p-4 sm:p-6 md:p-8">
                <Map aria-hidden="true" className="mb-2 size-8 text-lime-500 md:mb-4 md:size-12" />
                <h3 className="mb-2 font-display text-xl font-bold text-white transition-colors group-hover:text-lime-500 sm:text-2xl md:mb-4 md:text-3xl">
                  {language === "es" ? "La Cacería USA" : "The US Hunt"}
                </h3>
                <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-white/90 md:mb-6 md:line-clamp-none md:text-lg">
                  {language === "es"
                    ? "Las botellas más esotéricas y alucinantes que de alguna manera cruzaron la frontera. Disponibles en EE.UU., pero buena suerte encontrándolas."
                    : "The most esoteric, mind-bending bottles that somehow made it across the border. Available in the US, but good luck finding them."}
                </p>
                <div className="flex items-center gap-2 font-semibold text-lime-500">
                  <span>{language === "es" ? "Explorar 25 Botellas" : "Explore 25 Bottles"}</span>
                  <ArrowRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </Link>

            <Link
              href={ss("/mexico-source")}
              className="group relative h-[350px] cursor-pointer overflow-hidden rounded-lg border-2 border-gray-800 transition-all duration-300 hover:border-amber-500 sm:h-[400px] md:h-[500px]"
            >
              <Image
                src={img.earthOven.src}
                alt=""
                fill
                sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover object-center brightness-[0.6] transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
              <div className="relative flex h-full flex-col justify-end p-4 sm:p-6 md:p-8">
                <Flame aria-hidden="true" className="mb-2 size-8 text-amber-500 md:mb-4 md:size-12" />
                <h3 className="mb-2 font-display text-xl font-bold text-white transition-colors group-hover:text-amber-500 sm:text-2xl md:mb-4 md:text-3xl">
                  {language === "es" ? "La Fuente México" : "The Mexico Source"}
                </h3>
                <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-white/90 md:mb-6 md:line-clamp-none md:text-lg">
                  {language === "es"
                    ? "Lo más loco e interesante. Agave silvestre, métodos ancestrales, productores específicos. Aquí es donde vive la magia de verdad."
                    : "The craziest, most interesting stuff. Wild agave, ancestral methods, specific producers. This is where the real magic lives."}
                </p>
                <div className="flex items-center gap-2 font-semibold text-amber-500">
                  <span>{language === "es" ? "Descubrir 25 Leyendas" : "Discover 25 Legends"}</span>
                  <ArrowRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </Link>

            <Link
              href={ss("/scent-finder")}
              className="group relative h-[350px] cursor-pointer overflow-hidden rounded-lg border-2 border-gray-800 transition-all duration-300 hover:border-lime-500 sm:col-span-2 sm:h-[400px] md:col-span-1 md:h-[500px]"
            >
              <Image
                src={img.scentVisualization.src}
                alt=""
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover object-center brightness-[0.7] transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
              <div className="relative flex h-full flex-col justify-end p-4 sm:p-6 md:p-8">
                <Search aria-hidden="true" className="mb-2 size-8 text-lime-500 md:mb-4 md:size-12" />
                <h3 className="mb-2 font-display text-xl font-bold text-white transition-colors group-hover:text-lime-500 sm:text-2xl md:mb-4 md:text-3xl">
                  {language === "es" ? "Buscador Aroma-Agave" : "Scent-to-Agave Finder"}
                </h3>
                <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-white/90 md:mb-6 md:line-clamp-none md:text-lg">
                  {language === "es"
                    ? "¿Hueles manzana verde? ¿Arcilla húmeda? ¿Pino? Descubre qué agave está hablando con tu nariz en este decodificador interactivo."
                    : "Smell green apple? Wet clay? Pine? Discover which agave is speaking to your nose in this interactive flavor decoder."}
                </p>
                <div className="flex items-center gap-2 font-semibold text-lime-500">
                  <span>{language === "es" ? "Comenzar el Juego" : "Start the Game"}</span>
                  <ArrowRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </Link>
          </div>

          {/* Second Row */}
          <div className="mx-auto mt-4 grid max-w-5xl gap-4 sm:grid-cols-2 md:mt-8 md:gap-8">
            <Link
              href={ss("/agave-encyclopedia")}
              className="group relative h-[280px] cursor-pointer overflow-hidden rounded-lg border-2 border-gray-800 transition-all duration-300 hover:border-emerald-500 sm:h-[320px] md:h-[350px]"
            >
              <Image
                src={img.agaveEspadin.src}
                alt=""
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover object-center brightness-[0.6] transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
              <div className="relative flex h-full flex-col justify-end p-4 sm:p-6 md:p-8">
                <BookOpen aria-hidden="true" className="mb-2 size-8 text-emerald-500 md:mb-4 md:size-12" />
                <h3 className="mb-2 font-display text-xl font-bold text-white transition-colors group-hover:text-emerald-500 sm:text-2xl md:mb-4 md:text-3xl">
                  {language === "es" ? "Enciclopedia del Agave" : "Agave Encyclopedia"}
                </h3>
                <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-white/90 md:mb-6 md:line-clamp-none md:text-lg">
                  {language === "es"
                    ? "27 especies. Siglos de tradición. La biblioteca viviente de las variedades que cambiaron la historia."
                    : "27 species. Centuries of tradition. The living library of varieties that changed history."}
                </p>
                <div className="flex items-center gap-2 font-semibold text-emerald-500">
                  <span>{language === "es" ? "Explorar Todas" : "Explore All Varieties"}</span>
                  <ArrowRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </Link>

            <Link
              href={ss("/ancestral-process")}
              className="group relative h-[280px] cursor-pointer overflow-hidden rounded-lg border-2 border-gray-800 transition-all duration-300 hover:border-orange-500 sm:h-[320px] md:h-[350px]"
            >
              <Image
                src={img.processEarthOven.src}
                alt=""
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover object-center brightness-[0.6] transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
              <div className="relative flex h-full flex-col justify-end p-4 sm:p-6 md:p-8">
                <Compass aria-hidden="true" className="mb-2 size-8 text-orange-500 md:mb-4 md:size-12" />
                <h3 className="mb-2 font-display text-xl font-bold text-white transition-colors group-hover:text-orange-500 sm:text-2xl md:mb-4 md:text-3xl">
                  {language === "es" ? "El Proceso Ancestral" : "The Ancestral Process"}
                </h3>
                <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-white/90 md:mb-6 md:line-clamp-none md:text-lg">
                  {language === "es"
                    ? "Seis etapas. Siglos de sabiduría. Un viaje guiado por scroll a través de la alquimia sagrada."
                    : "Six stages. Centuries of wisdom. A scroll-driven journey through sacred alchemy."}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-orange-500 md:text-base">
                  <span>{language === "es" ? "Comenzar el Viaje" : "Begin the Journey"}</span>
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-2 md:size-5" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Mailing List Signup */}
      <section className="relative overflow-hidden bg-linear-to-b from-background to-stone-950 py-12 md:py-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,oklch(0.55_0.15_100),transparent_50%)]" />
        </div>
        <div className="relative z-10 container">
          <EmailSignup source="soulsmoke-homepage-hero" variant="hero" />
        </div>
      </section>

      <PageJourney currentPath="/" />
    </div>
  );
}
