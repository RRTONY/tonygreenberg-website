"use client";

import { createElement, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Leaf, Play, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/components/soulsmoke/soulsmoke-providers";
import { ss } from "@/lib/content/soulsmoke/nav";
import { cn } from "@/lib/utils";
import {
  COLLECTIVE_CONTENT,
  MAIN_MONTAGE_TRANSCRIPT,
  ORIGIN_STORY,
  faneKantsiniMedia as media,
  formatTimestamp,
  type TranscriptSegment,
} from "./fane-kantsini.data";

// Ported from the SoulSmoke app's client/src/pages/FaneKantsini.tsx. Same sections, copy and
// styling. Changes:
// - framer-motion is not used on this site: the same motions are CSS. Entrance animations use
//   tw-animate-css (`animate-in fade-in zoom-in-80 ...`), "whileInView" reveals use <Reveal>
//   (IntersectionObserver + a transition between two class strings), the hero's scroll fade/shrink
//   is a scroll listener, and the bobbing scroll line uses SoulSmoke's `ss-float` keyframes.
// - The logo, background textures, photos and videos were on the old app host's CDN and aren't
//   rescued yet (see fane-kantsini.data.ts): any that are missing are left out, not hot-linked.
// - The 🍃 emoji badge is a lucide Leaf icon; transcript lines are <button>s (keyboard reachable).

function useRevealOnce<T extends Element>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisible(true);
        observer.disconnect();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible] as const;
}

/** framer-motion's `whileInView` + `viewport={{ once: true }}` as a CSS transition. */
function Reveal({
  as = "div",
  className,
  hiddenClassName,
  shownClassName,
  delayMs,
  children,
}: {
  as?: "div" | "p";
  className?: string;
  /** Full literal class strings for the before/after states. */
  hiddenClassName: string;
  shownClassName: string;
  /** Stagger computed from an index (runtime value). */
  delayMs?: number;
  children: ReactNode;
}) {
  const [ref, visible] = useRevealOnce<HTMLElement>();
  return createElement(
    as,
    {
      ref,
      className: cn(className, visible ? shownClassName : hiddenClassName),
      style: delayMs ? { transitionDelay: `${delayMs}ms` } : undefined,
    },
    children,
  );
}

const FADE_UP_HIDDEN = "translate-y-5 opacity-0";
const FADE_UP_SHOWN = "translate-y-0 opacity-100";

export function FaneKantsini() {
  const { language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSegment, setActiveSegment] = useState<TranscriptSegment | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Get current language content for origin story
  const originContent = ORIGIN_STORY[language];

  // framer-motion's useScroll + useTransform(scrollYProgress, [0, 0.2], ...) for the hero.
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const heroT = Math.min(scrollProgress / 0.2, 1);

  useEffect(() => {
    const interval = setInterval(() => {
      const video = videoRef.current;
      if (video) {
        setCurrentTime(video.currentTime);
        const current = MAIN_MONTAGE_TRANSCRIPT.find(
          (s) => video.currentTime >= s.start && video.currentTime <= s.end,
        );
        setActiveSegment(current || null);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      void videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        void videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const sosima = media.photos[5];
  const womenPhotos = media.photos.slice(6, 8).filter((photo) => photo.image);
  const vaultPhotos = media.photos.slice(0, 5).filter((photo) => photo.image);
  const hasVault = Boolean(media.videos.business) || vaultPhotos.length > 0;

  // Under the player; above the transcript while there's no video.
  const captionText = (
    <>
      <span>THE TASMANIAN TIGER OF AGAVES</span>
      <span>EST. 2026</span>
    </>
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0a0a0f] font-sans text-[#e0e0e0] selection:bg-[#d4af37] selection:text-black">
      {/* Sacred Geometry Background Elements */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-20">
        {media.heroBg && (
          <div className="absolute top-0 left-0 size-full opacity-30 mix-blend-overlay">
            <Image src={media.heroBg.src} alt="" fill sizes="100vw" className="object-cover object-center" />
          </div>
        )}
        <div className="absolute top-1/2 left-1/2 size-200 -translate-x-1/2 -translate-y-1/2 animate-[spin_60s_linear_infinite] rounded-full border border-[#d4af37]/10"></div>
        <div className="absolute top-1/2 left-1/2 size-150 -translate-x-1/2 -translate-y-1/2 animate-[spin_45s_linear_infinite_reverse] rounded-full border border-[#d4af37]/20"></div>
        <div className="absolute top-1/2 left-1/2 size-100 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-[#d4af37]/30"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex h-screen flex-col items-center justify-center">
        <div
          className="flex flex-col items-center space-y-8 text-center"
          // Fades and shrinks over the first 20% of the page scroll (runtime values).
          style={{ opacity: 1 - heroT, transform: `scale(${1 - 0.1 * heroT})` }}
        >
          {media.logo && (
            <div className="mb-8 animate-in duration-1500 ease-out fade-in zoom-in-80">
              <Image
                src={media.logo.src}
                width={media.logo.width}
                height={media.logo.height}
                alt="Fane Kantsini Logo"
                priority
                className="h-auto w-48 opacity-90 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)] md:w-64"
              />
            </div>
          )}

          <div className="relative inline-block animate-in delay-500 duration-1000 fill-mode-both fade-in slide-in-from-bottom-5">
            <h1 className="bg-linear-to-b from-[#d4af37] to-[#8a7020] bg-clip-text font-display text-6xl tracking-widest text-transparent uppercase md:text-8xl lg:text-9xl">
              Fane Kantsini
            </h1>
            <div className="absolute -bottom-4 left-1/2 h-px w-24 -translate-x-1/2 bg-[#d4af37]"></div>
          </div>

          <p className="mx-auto max-w-2xl animate-in font-serif text-xl tracking-wide text-[#a0a0a0] italic delay-1000 duration-1000 fill-mode-both fade-in md:text-2xl">
            &quot;Liquids that touch my mouth must touch my mind and touch my heart.&quot;
          </p>

          <div className="animate-in delay-1500 duration-1000 fill-mode-both fade-in">
            <Button
              onClick={() => document.getElementById("montage")?.scrollIntoView({ behavior: "smooth" })}
              variant="outline"
              className="rounded-none border-[#d4af37] bg-transparent px-8 py-6 text-lg tracking-widest text-[#d4af37] uppercase transition-all duration-500 hover:bg-[#d4af37] hover:text-black"
            >
              Begin The Journey
            </Button>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[#d4af37]/50">
          <div className="h-16 w-px animate-[ss-float_2s_ease-in-out_infinite] bg-linear-to-b from-transparent via-[#d4af37] to-transparent"></div>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="relative z-10 bg-linear-to-b from-[#0a0a0f] to-[#11111a] px-4 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-3xl">
          <Reveal
            className="mb-16 text-center transition-all duration-1000 ease-out"
            hiddenClassName="translate-y-7.5 opacity-0"
            shownClassName={FADE_UP_SHOWN}
          >
            <span className="mb-4 block font-mono text-sm tracking-[0.3em] text-[#d4af37]">
              {originContent.sectionLabel}
            </span>
            <h2 className="font-display text-3xl tracking-wide text-[#e0e0e0] md:text-5xl">{originContent.title}</h2>
            <div className="mx-auto mt-8 h-px w-16 bg-[#d4af37]/50"></div>
          </Reveal>

          {/* Decorative agave image */}
          <Reveal
            className="mb-12 flex justify-center transition-all duration-800 ease-out"
            hiddenClassName="scale-90 opacity-0"
            shownClassName="scale-100 opacity-100"
          >
            <div className="flex size-24 items-center justify-center rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5">
              <Leaf aria-hidden="true" className="size-10 text-green-500" />
            </div>
          </Reveal>

          <div className="space-y-8">
            {originContent.paragraphs.map((paragraph, index) => {
              const isString = typeof paragraph === "string";
              const text = isString ? paragraph : paragraph.text;
              const isQuote = text.startsWith('"') || text.startsWith("“");

              return (
                <Reveal
                  as="p"
                  key={index}
                  delayMs={index * 50}
                  className={
                    isQuote
                      ? "border-l-2 border-[#d4af37]/30 pl-4 font-serif text-lg leading-relaxed text-[#d4af37] italic transition-all duration-600 ease-out md:text-xl"
                      : "font-serif text-lg leading-relaxed text-[#a0a0a0] transition-all duration-600 ease-out md:text-xl"
                  }
                  hiddenClassName={FADE_UP_HIDDEN}
                  shownClassName={FADE_UP_SHOWN}
                >
                  {isString ? (
                    paragraph
                  ) : (
                    <>
                      {paragraph.text.split(paragraph.linkText)[0]}
                      <Link
                        href={ss("/us-hunt")}
                        className="text-[#d4af37] underline underline-offset-4 transition-colors hover:text-[#e5c547]"
                      >
                        {paragraph.linkText}
                      </Link>
                      {paragraph.afterLink}
                    </>
                  )}
                </Reveal>
              );
            })}
          </div>

          <Reveal
            className="mt-16 border-t border-[#d4af37]/20 pt-12 transition-opacity delay-500 duration-1000"
            hiddenClassName="opacity-0"
            shownClassName="opacity-100"
          >
            {originContent.closing.map((line, index) => (
              <Reveal
                as="p"
                key={index}
                delayMs={300 + index * 200}
                className={
                  index === originContent.closing.length - 1
                    ? "mt-8 mb-6 text-center font-serif text-2xl leading-relaxed text-[#d4af37] italic transition-opacity duration-800"
                    : "mb-6 font-serif text-lg leading-relaxed text-[#888] transition-opacity duration-800 md:text-xl"
                }
                hiddenClassName="opacity-0"
                shownClassName="opacity-100"
              >
                {line}
              </Reveal>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Main Montage Section */}
      <section
        id="montage"
        className="relative z-10 min-h-screen bg-linear-to-b from-[#0a0a0f] via-[#11111a] to-[#0a0a0f] px-4 py-24 md:px-12"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Video Player */}
          {media.videos.main && (
            <div className="group relative lg:col-span-8">
              <div className="relative mx-auto aspect-9/16 max-h-[70vh] overflow-hidden border border-[#d4af37]/20 bg-black shadow-[0_0_50px_-10px_rgba(212,175,55,0.1)]">
                <video
                  ref={videoRef}
                  className="size-full object-cover"
                  src={media.videos.main}
                  onClick={togglePlay}
                  playsInline
                />

                {/* Custom Controls Overlay */}
                {!isPlaying && (
                  <button
                    type="button"
                    aria-label="Play"
                    className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 transition-opacity hover:bg-black/30"
                    onClick={togglePlay}
                  >
                    <span className="flex size-20 items-center justify-center rounded-full border border-[#d4af37] backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
                      <Play aria-hidden="true" className="ml-1 size-8 text-[#d4af37]" fill="currentColor" />
                    </span>
                  </button>
                )}

                {/* Floating Key Phrases Overlay */}
                {activeSegment?.isHighlight && isPlaying && (
                  <div
                    key={activeSegment.text}
                    className="pointer-events-none absolute right-0 bottom-24 left-0 animate-in px-8 text-center duration-500 fade-in blur-in-10 slide-in-from-bottom-5"
                  >
                    <h3 className="font-display text-2xl leading-relaxed text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] md:text-4xl">
                      {activeSegment.text}
                    </h3>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between font-serif text-sm tracking-widest text-[#d4af37]/60">
                {captionText}
              </div>
            </div>
          )}

          {/* Interactive Transcript */}
          <div
            className={
              media.videos.main
                ? "relative h-150 lg:col-span-4"
                : "relative mx-auto h-150 w-full max-w-3xl lg:col-span-12"
            }
          >
            <div className="absolute top-0 bottom-0 -left-6 hidden w-px bg-linear-to-b from-transparent via-[#d4af37]/30 to-transparent lg:block"></div>
            {!media.videos.main && (
              <div className="mb-6 flex items-center justify-between gap-4 font-serif text-sm tracking-widest text-[#d4af37]/60">
                {captionText}
              </div>
            )}
            <h3 className="mb-6 font-display text-2xl tracking-widest text-[#d4af37]">TRANSCRIPT</h3>
            <ScrollArea className="h-full pr-4">
              <div className="space-y-6 pb-20">
                {MAIN_MONTAGE_TRANSCRIPT.map((segment, index) => {
                  const isCurrent = currentTime >= segment.start && currentTime <= segment.end;
                  return (
                    <Reveal
                      key={index}
                      className="transition-opacity duration-500"
                      hiddenClassName="opacity-0"
                      shownClassName="opacity-100"
                    >
                      <button
                        type="button"
                        onClick={() => handleSeek(segment.start)}
                        className={
                          isCurrent
                            ? "w-full cursor-pointer border-l-2 border-[#d4af37] bg-[#d4af37]/5 p-4 pl-6 text-left text-white transition-all duration-300 hover:bg-[#d4af37]/5"
                            : "w-full cursor-pointer border-l-2 border-transparent p-4 text-left text-[#666] transition-all duration-300 hover:border-[#d4af37]/30 hover:bg-[#d4af37]/5 hover:text-[#a0a0a0]"
                        }
                      >
                        <span className="mb-2 flex items-center gap-2 font-mono text-xs text-[#d4af37]/50">
                          {isCurrent && media.videos.main && (
                            <Volume2 aria-hidden="true" className="size-3 animate-pulse" />
                          )}
                          <span>{formatTimestamp(segment.start)}</span>
                        </span>
                        <span className="block font-serif text-lg leading-relaxed">{segment.text}</span>
                      </button>
                    </Reveal>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </section>

      {/* The Collective History Section */}
      <section className="relative z-10 overflow-hidden bg-[#0a0a0f] px-4 py-32 md:px-12">
        {media.agaveTexture && (
          <div className="absolute top-0 right-0 h-full w-1/2 opacity-10 mix-blend-overlay">
            <Image src={media.agaveTexture.src} alt="" fill sizes="50vw" className="object-cover object-center" />
          </div>
        )}
        <div
          className={
            sosima.image
              ? "mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2"
              : "mx-auto grid max-w-3xl grid-cols-1 items-center gap-16"
          }
        >
          <Reveal
            className="transition-all duration-1000 ease-out"
            hiddenClassName="-translate-x-12.5 opacity-0"
            shownClassName="translate-x-0 opacity-100"
          >
            <span className="mb-4 block font-mono text-sm tracking-widest text-[#d4af37]">EST. 2014</span>
            <h2 className="mb-8 font-display text-4xl leading-tight text-[#e0e0e0] md:text-6xl">
              {COLLECTIVE_CONTENT.history.title}
            </h2>
            <h3 className="mb-8 font-serif text-2xl text-[#d4af37] italic">{COLLECTIVE_CONTENT.history.subtitle}</h3>
            <p className="font-sans text-lg leading-relaxed whitespace-pre-line text-[#a0a0a0]">
              {COLLECTIVE_CONTENT.history.body}
            </p>
          </Reveal>
          {sosima.image && (
            <div className="relative">
              <div className="relative aspect-3/4 border border-[#d4af37]/20 p-4">
                <div className="relative size-full">
                  <Image
                    src={sosima.image.src}
                    alt="Sosima Olivera"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover grayscale transition-all duration-700 hover:grayscale-0"
                  />
                </div>
              </div>
              <div className="absolute -bottom-8 -left-8 size-64 animate-[spin_30s_linear_infinite] rounded-full border border-[#d4af37]/10"></div>
            </div>
          )}
        </div>
      </section>

      {/* Women's Collective Section */}
      <section className="relative z-10 bg-[#11111a] px-4 py-32 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className="mb-6 font-display text-4xl text-[#e0e0e0] md:text-6xl">{COLLECTIVE_CONTENT.women.title}</h2>
            <div className="mx-auto h-px w-24 bg-[#d4af37]"></div>
          </div>

          <div
            className={
              womenPhotos.length > 0
                ? "grid grid-cols-1 items-center gap-16 lg:grid-cols-2"
                : "mx-auto grid max-w-3xl grid-cols-1 items-center gap-16"
            }
          >
            {womenPhotos.length > 0 && (
              <div className="relative order-2 lg:order-1">
                <div className="grid grid-cols-2 gap-4">
                  {womenPhotos.map((photo, i) => (
                    <div
                      key={photo.title}
                      className={i === 1 ? "relative mt-12 aspect-square" : "relative aspect-square"}
                    >
                      <Image
                        src={photo.image!.src}
                        alt={photo.title}
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="object-cover grayscale transition-all duration-500 hover:grayscale-0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Reveal
              className="order-1 transition-all duration-1000 ease-out lg:order-2"
              hiddenClassName="translate-x-12.5 opacity-0"
              shownClassName="translate-x-0 opacity-100"
            >
              <h3 className="mb-8 font-serif text-2xl text-[#d4af37] italic">{COLLECTIVE_CONTENT.women.subtitle}</h3>
              <p className="font-sans text-lg leading-relaxed whitespace-pre-line text-[#a0a0a0]">
                {COLLECTIVE_CONTENT.women.body}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="relative z-10 bg-[#0a0a0f] px-4 py-32 md:px-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-20 text-center font-display text-4xl text-[#e0e0e0] md:text-5xl">
            {COLLECTIVE_CONTENT.philosophy.title}
          </h2>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {COLLECTIVE_CONTENT.philosophy.points.map((point, i) => (
              <Reveal
                key={i}
                delayMs={i * 200}
                className="transition-all duration-500 ease-out"
                hiddenClassName="translate-y-7.5 opacity-0"
                shownClassName={FADE_UP_SHOWN}
              >
                <div className="h-full border border-[#d4af37]/10 p-8 text-center transition-colors duration-300 hover:border-[#d4af37]/30">
                  <div className="mx-auto mb-6 flex size-12 items-center justify-center rounded-full border border-[#d4af37] font-display text-xl text-[#d4af37]">
                    {i + 1}
                  </div>
                  <h3 className="mb-4 font-display text-xl text-white">{point.title}</h3>
                  <p className="font-serif text-[#888]">{point.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The Vault (Gallery) */}
      {hasVault && (
        <section className="relative z-10 border-t border-[#d4af37]/10 bg-[#0a0a0f] px-4 py-24 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 flex items-center justify-between">
              <h2 className="font-display text-4xl text-[#e0e0e0] md:text-5xl">THE VAULT</h2>
              <div className="mx-8 h-px flex-1 bg-[#d4af37]/20"></div>
              <span className="font-mono text-[#d4af37]/50">SUPPLEMENTARY MATERIALS</span>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Supplementary Video Card */}
              {media.videos.business && (
                <div className="group relative aspect-4/5 cursor-pointer overflow-hidden border border-[#333] bg-[#111] transition-colors duration-500 hover:border-[#d4af37]/50">
                  <video
                    className="size-full object-cover opacity-60 grayscale transition-opacity duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                    src={media.videos.business}
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => void e.currentTarget.play().catch(() => {})}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  />
                  <div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black to-transparent p-6">
                    <span className="mb-2 block font-mono text-xs tracking-widest text-[#d4af37]">VIDEO ARCHIVE</span>
                    <h3 className="font-display text-xl text-white">Business Discussion</h3>
                    <p className="mt-2 font-serif text-sm text-[#888]">Logistics of the 100 bottle shipment.</p>
                  </div>
                </div>
              )}

              {/* Photo Cards */}
              {vaultPhotos.map((photo) => (
                <div
                  key={photo.title}
                  className="group relative aspect-4/5 cursor-pointer overflow-hidden border border-[#333] bg-[#111] transition-colors duration-500 hover:border-[#d4af37]/50"
                >
                  <Image
                    src={photo.image!.src}
                    alt={photo.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="scale-100 transform object-cover opacity-60 grayscale transition-opacity duration-500 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                  />
                  <div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black to-transparent p-6">
                    <span className="mb-2 block font-mono text-xs tracking-widest text-[#d4af37]">PHOTOGRAPHY</span>
                    <h3 className="font-display text-xl text-white">{photo.title}</h3>
                    <p className="mt-2 font-serif text-sm text-[#888]">{photo.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-[#d4af37]/10 py-12 text-center">
        <p className="font-serif text-[#666] italic">&quot;Before we drink, we think. From our heart.&quot;</p>
      </footer>
    </div>
  );
}
