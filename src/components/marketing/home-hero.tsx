import Image from "next/image";
import Link from "next/link";
import { AbitWaitlistForm } from "@/components/marketing/abit-waitlist-form";

// Ported from legacy client/src/pages/Blog.tsx's hero section. Real copy,
// unchanged. The kintsugi bowl hero photo is served through the existing
// allow-listed Tony Greenberg image endpoint. Legacy's Blog.tsx (this route)
// and Home.tsx (/the-letter) both used the identical source file. One
// intentional simplification remains: the canvas-based floating-particle
// animation is dropped — a JS particle canvas isn't worth the runtime cost
// for pure decoration.
//
// The glow pulse, spinning light rays, shimmering headline, and pulsing CTA
// below WERE dropped in an earlier pass despite being pure CSS @keyframes
// (no framer-motion, no canvas) — restored using the animate-* utilities
// defined in globals.css. The ABIT waitlist email capture (also dropped in
// that same pass, its `trpc` subscribe backend never built) is restored too
// — a real content section on the live homepage, not decoration — using a
// `mailto:` fallback (see `abit-waitlist-form.tsx`) instead of a fake
// subscribe success. Subhead copy corrected to match the live homepage's
// current text — the `_legacy-manus-app` snapshot in this repo pre-dates a
// live copy edit ("$10B+ transactions · Microsoft, Disney, Goldman Sachs ·
// 25 years" → "$10B+ in enterprise contracts priced, audited, and
// renegotiated"), confirmed against a screenshot of the live site.
//
// Text is fixed white/gold over a dark photo overlay, not the site's
// light/dark theme tokens — same call already made for /the-letter's photo
// hero, since a photographic background doesn't get lighter in light mode.
const HERO_IMAGE = "https://tonygreenberg.com/api/img/homepage-hero-original_d3e7447d.jpg";

export function HomeHero({ essayCount }: { essayCount: number }) {
  return (
    <section className="relative flex min-h-[clamp(300px,42vh,420px)] items-center overflow-hidden">
      <Image src={HERO_IMAGE} alt="" fill priority className="object-cover object-[center_40%]" />
      <div
        className="absolute top-[20%] right-[15%] size-[420px] animate-bowl-pulse rounded-full blur-[40px]"
        style={{
          background:
            "radial-gradient(circle, rgba(123,63,160,0.35) 0%, rgba(123,63,160,0.15) 30%, rgba(180,140,50,0.08) 55%, transparent 75%)",
        }}
      />
      <div
        className="absolute top-[32%] right-[22%] size-[200px] animate-bowl-pulse-inner rounded-full blur-[25px] [animation-delay:0.5s]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,220,130,0.4) 0%, rgba(123,63,160,0.2) 40%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-[20%] right-[14%] size-[500px] animate-rays-spin rounded-full blur-[20px]"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(123,63,160,0.06) 15deg, transparent 30deg, transparent 60deg, rgba(123,63,160,0.04) 75deg, transparent 90deg, transparent 120deg, rgba(123,63,160,0.05) 135deg, transparent 150deg, transparent 180deg, rgba(123,63,160,0.06) 195deg, transparent 210deg, transparent 240deg, rgba(123,63,160,0.04) 255deg, transparent 270deg, transparent 300deg, rgba(123,63,160,0.05) 315deg, transparent 330deg, transparent 360deg)",
        }}
      />
      <div className="absolute inset-0 bg-linear-to-br from-black/45 via-black/20 to-black/35 backdrop-blur-[1px]" />
      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 py-10 sm:px-10">
        <div className="mb-4 font-mono text-base tracking-[0.25em] text-brand-gold-light uppercase">
          Tony Greenberg
        </div>

        <h1 className="mb-3 font-heading text-4xl leading-[1.1] font-normal text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.4)] sm:text-6xl">
          I expose broken systems.
          <br />
          <em className="animate-gold-shimmer bg-[length:200%_auto] bg-linear-to-r from-[#8B6914] via-[#F5E6A3] to-[#8B6914] bg-clip-text not-italic text-transparent">
            Then I build what comes next.
          </em>
        </h1>

        <p className="mb-5 max-w-xl text-sm text-white/92 sm:text-base">
          $10B+ in enterprise contracts priced, audited, and renegotiated
        </p>

        <Link
          href="/find-my"
          className="mb-5 inline-block animate-cta-glow rounded-sm bg-linear-to-br from-brand-gold to-brand-gold-light px-8 py-3 font-mono text-base font-bold tracking-wide text-white uppercase transition-shadow hover:animate-none hover:shadow-[0_4px_20px_rgba(139,105,20,0.3)]"
        >
          Find Your Fit
        </Link>

        <div className="mb-4 max-w-120">
          <AbitWaitlistForm />
        </div>

        <div className="font-mono text-xs tracking-wide text-white/70">
          {essayCount} ESSAYS ·{" "}
          <a
            href="#essays-archive"
            className="border-b border-brand-gold-light/30 text-brand-gold-light"
          >
            READ
          </a>
          {" · DIAGNOSE · ENGAGE"}
        </div>
      </div>
    </section>
  );
}
