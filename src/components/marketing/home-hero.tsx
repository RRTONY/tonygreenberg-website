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
// Uses the site's theme tokens (background/secondary/foreground), same as
// every other page, so switching the light/dark toggle actually changes
// this section — not a hardcoded dark band that ignores the toggle.
export function HomeHero({ essayCount }: { essayCount: number }) {
  return (
    <section className="relative flex min-h-[clamp(300px,42vh,420px)] items-center overflow-hidden bg-linear-to-b from-background to-secondary">
      <div
        className="absolute top-[20%] right-[15%] size-[420px] rounded-full blur-[40px]"
        style={{
          background:
            "radial-gradient(circle, rgba(123,63,160,0.25) 0%, rgba(123,63,160,0.1) 30%, rgba(180,140,50,0.06) 55%, transparent 75%)",
        }}
      />
      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 py-10 sm:px-10">
        <div className="mb-4 font-mono text-base tracking-[0.25em] text-brand-gold uppercase">
          Tony Greenberg
        </div>

        <h1 className="mb-3 font-heading text-4xl leading-[1.1] font-normal text-foreground sm:text-6xl">
          I expose broken systems.
          <br />
          <em className="text-brand-gold-light not-italic">Then I build what comes next.</em>
        </h1>

        <p className="mb-5 max-w-xl text-sm text-foreground/80 sm:text-base">
          $10B+ transactions · Microsoft, Disney, Goldman Sachs · 25 years
        </p>

        <Link
          href="/find-my"
          className="mb-5 inline-block rounded-sm bg-linear-to-br from-brand-gold to-brand-gold-light px-8 py-3 font-mono text-base font-bold tracking-wide text-white uppercase"
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
