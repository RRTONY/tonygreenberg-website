import Link from "next/link";

// Ported from legacy client/src/pages/Blog.tsx's hero section. Real copy,
// unchanged. Two intentional simplifications from legacy: (1) the kintsugi
// bowl background photo and canvas-based floating-particle animation are
// replaced with a CSS-only radial glow — the source image is gone (see
// home-doors.ts for why) and a JS particle canvas isn't worth the runtime
// cost for pure decoration; (2) the ABIT waitlist email-capture form is
// dropped — it posted to a tRPC subscribe mutation, a backend/CRM feature
// out of this migration's scope (see NEXTJS-MIGRATION-TODO.md's CMS/scope
// boundary note), not a content gap.
//
// The glow pulse, spinning light rays, shimmering headline, and pulsing CTA
// below WERE dropped in an earlier pass despite being pure CSS @keyframes
// (no framer-motion, no canvas) — restored using the animate-* utilities
// defined in globals.css, since nothing about the framer-motion-ban or the
// missing background photo actually applies to them.
//
// Uses the site's theme tokens (background/secondary/foreground), same as
// every other page, so switching the light/dark toggle actually changes
// this section — not a hardcoded dark band that ignores the toggle.
export function HomeHero({ essayCount }: { essayCount: number }) {
  return (
    <section className="relative flex min-h-[clamp(300px,42vh,420px)] items-center overflow-hidden bg-linear-to-b from-background to-secondary">
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
      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 py-10 sm:px-10">
        <div className="mb-4 font-mono text-base tracking-[0.25em] text-brand-gold uppercase">
          Tony Greenberg
        </div>

        <h1 className="mb-3 font-heading text-4xl leading-[1.1] font-normal text-foreground sm:text-6xl">
          I expose broken systems.
          <br />
          <em className="animate-gold-shimmer bg-[length:200%_auto] bg-linear-to-r from-[#8B6914] via-[#F5E6A3] to-[#8B6914] bg-clip-text not-italic text-transparent">
            Then I build what comes next.
          </em>
        </h1>

        <p className="mb-5 max-w-xl text-sm text-foreground/80 sm:text-base">
          $10B+ transactions · Microsoft, Disney, Goldman Sachs · 25 years
        </p>

        <Link
          href="/find-my"
          className="mb-5 inline-block animate-cta-glow rounded-sm bg-linear-to-br from-brand-gold to-brand-gold-light px-8 py-3 font-mono text-base font-bold tracking-wide text-white uppercase transition-shadow hover:animate-none hover:shadow-[0_4px_20px_rgba(139,105,20,0.3)]"
        >
          Find Your Fit
        </Link>

        <div className="font-mono text-xs tracking-wide text-muted-foreground">
          {essayCount} ESSAYS ·{" "}
          <a href="#essays-archive" className="border-b border-brand-gold/20 text-brand-gold">
            READ
          </a>
          {" · DIAGNOSE · ENGAGE"}
        </div>
      </div>
    </section>
  );
}
