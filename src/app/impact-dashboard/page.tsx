import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ImpactDashboardExplorer } from "@/components/marketing/impact-dashboard-explorer";

// Ported from legacy client/src/pages/ImpactDashboard.tsx, then updated
// 2026-10 to the live site's rewrite: "The Model We're Building", a pro
// forma target representation (token layer optional, every figure an
// illustrative model input, not a performance claim). See
// impact-dashboard-explorer.tsx for what changed (dropped canvas/parallax
// decoration, "coming soon" for the not-yet-built SoulScore engine link).
// The hero's earth photo was on the Manus /api/img/ host and was rescued
// into Sanity on 2026-09-28 (docs/ai/manus-media-rescue.md); it's back
// behind the hero, static (legacy's JS scroll parallax dropped), with
// legacy's cream fade at the bottom. Legacy also defined a second
// "impact-sacred" image it never rendered, so that one stays unused.
export const metadata: Metadata = {
  title: "ImpactSoul Target Representation — Impact Dashboard",
  description:
    "A target representation of the ImpactSoul operating model: regenerative capital, accountable projects, distributed philanthropy, and a 30-day refinement process.",
  alternates: { canonical: "/impact-dashboard" },
};

const HERO_CHIPS = [
  { value: "Pro forma", label: "Representation" },
  { value: "30 days", label: "Refinement" },
  { value: "Regenerative", label: "Capital thesis" },
  { value: "Optional rails", label: "Token role" },
];

const HERO_EARTH =
  "https://cdn.sanity.io/images/a3q1cyqs/production/f4486dd40fde9f43e018499f1802fe37b5332fff-1024x1024.webp";

export default function ImpactDashboardPage() {
  return (
    <div>
      <section className="relative isolate flex flex-col items-center justify-start overflow-hidden pb-10 text-center sm:min-h-[70vh] sm:justify-center sm:px-10 sm:py-20">
        <Image
          src={HERO_EARTH}
          alt=""
          fill
          fetchPriority="high"
          loading="eager"
          sizes="100vw"
          className="-z-20 object-cover object-[center_30%] brightness-85 saturate-120"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-[65%] bg-linear-to-t from-background via-background/80 via-40% to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_40%,color-mix(in_oklab,var(--background)_35%,transparent)_100%)]"
        />
        <div className="mx-auto w-full max-w-3xl rounded-b-2xl border border-t-0 border-brand-gold/20 bg-card/90 px-7 pt-10 pb-8 shadow-xl backdrop-blur-md sm:rounded-2xl sm:border-t sm:px-10 sm:py-10">
          <p className="mb-4 font-mono text-[0.7rem] tracking-[0.35em] text-brand-gold uppercase">
            ImpactSoul Target Representation · 30-Day Refinement
          </p>
          <h1 className="mx-auto mb-5 max-w-2xl font-heading text-4xl leading-tight font-bold text-essay-ink sm:text-[4rem] dark:text-foreground">
            The Model <span className="text-brand-gold italic">We&rsquo;re Building</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-foreground/70">
            This is a pro forma representation of the operating model behind ImpactSoul. It is not
            a current performance report, a token-sale page, or a claim that these outcomes have
            already happened.
          </p>
          <dl className="flex flex-wrap justify-center gap-3">
            {HERO_CHIPS.map((chip) => (
              <div key={chip.label} className="flex flex-col-reverse rounded-xl border border-brand-gold/20 bg-background/70 px-5 py-3">
                <dt className="mt-1 font-mono text-[0.6rem] tracking-[0.15em] text-muted-foreground uppercase">
                  {chip.label}
                </dt>
                <dd className="font-heading text-xl font-bold text-brand-gold">{chip.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-8 max-w-3xl px-6 sm:px-10">
        <div className="rounded-2xl border border-brand-gold/15 bg-card p-7">
          <p className="mb-3 leading-relaxed text-foreground/80">
            <strong className="text-brand-gold">What you&rsquo;re looking at:</strong> A target
            representation of the ImpactSoul operating model. It connects four proposed pathways,
            an accountability framework, a 12-axis scoring design, and a way to follow capital
            toward a real-world result.
          </p>
          <p className="mb-3 leading-relaxed text-foreground/80">
            <strong className="text-brand-gold">What is changing:</strong> The token layer is now
            optional plumbing, not the point. The real work is designing a business where
            regenerative allocation is intrinsic to operations, not a charity line added after the
            money has already been made.
          </p>
          <p className="leading-relaxed text-foreground/80">
            <strong className="text-brand-gold">What happens next:</strong> We will refine the
            assumptions, governance, evidence standards, and project detail over the next 30 days,
            then share the cleaner version. Until then, the figures are illustrative model inputs,
            not audited impact, live token activity, or a promise of future returns.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-brand-gold/15 border-l-4 border-l-brand-gold bg-card p-7">
          <p className="mb-2 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
            The Capital Shift
          </p>
          <h2 className="mb-3 font-heading text-2xl leading-snug text-foreground">
            Charity is not the afterthought. It is part of the operating system.
          </h2>
          <p className="mb-3 leading-relaxed text-foreground/80">
            ImpactSoul is moving away from a token-first story. A token may still have a job as
            optional infrastructure when it creates real transparency, ownership, or distribution.
            It is not the business. The business is a better design for moving capital through
            projects that can sustain themselves, return value, and keep regeneration from becoming
            a sidecar to extraction.
          </p>
          <p className="leading-relaxed text-foreground/80">
            We are exploring a small number of large-scale pathways, including work with Ting Ting,
            that could reshape how philanthropy is distributed inside operating businesses. These
            are early deal concepts, not announced transactions, and this page does not represent a
            commitment, financing, partnership, or projected result.
          </p>
        </div>
      </section>

      <div className="pt-10">
        <ImpactDashboardExplorer />
      </div>

      <footer className="bg-linear-to-br from-[#3D2E14] to-[#5A4020] px-6 py-10 text-center sm:px-10">
        <p className="mb-2 font-mono text-sm text-brand-gold">ImpactSoul target representation</p>
        <p className="font-mono text-xs tracking-wide text-white/70">
          Proposed pathways · draft accountability model · SoulScore prototype · regenerative
          capital thesis
        </p>
        <p className="mx-auto mt-2 max-w-2xl font-mono text-[0.65rem] text-white/60">
          Pro forma only. Assumptions, governance, evidence standards, and project detail are being
          refined over the next 30 days.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-6 font-mono text-xs tracking-wide">
          <Link href="/soulscore" className="text-brand-gold">
            SoulScore Prototype
          </Link>
          <Link href="/charity-scorecard" className="text-brand-gold">
            Accountability Research
          </Link>
          <Link href="/intel" className="text-brand-gold">
            Portfolio Research
          </Link>
          <Link href="/invest" className="text-brand-gold">
            The Thesis
          </Link>
        </div>
      </footer>
    </div>
  );
}
