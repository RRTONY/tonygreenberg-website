import type { Metadata } from "next";
import Link from "next/link";
import { ImpactDashboardExplorer } from "@/components/marketing/impact-dashboard-explorer";
import { AGGREGATE } from "@/lib/content/impact-dashboard";

// Ported from legacy client/src/pages/ImpactDashboard.tsx ("The Scoreboard
// Nobody Built"). Real content, unchanged, across all 6 tabs — see
// impact-dashboard-explorer.tsx for what changed (dropped canvas/parallax
// decoration, dropped the banned /api/img/ hero images, "coming soon" for
// the not-yet-built SoulScore engine link).
export const metadata: Metadata = {
  title: "Impact Measurement Dashboard — ImpactSoul",
  description:
    "The scoreboard nobody built. Four token ecosystems, 100 charities scored, 12 dimensions measured, 35+ portfolio companies tracked. Consciousness-adjusted impact at scale.",
  alternates: { canonical: "/impact-dashboard" },
};

export default function ImpactDashboardPage() {
  return (
    <div>
      <section className="bg-linear-to-b from-background to-secondary px-6 py-20 text-center sm:px-10">
        <p className="mb-4 font-mono text-xs tracking-[0.35em] text-brand-gold uppercase">
          ImpactSoul — Certified B Corp
        </p>
        <h1 className="mx-auto mb-5 max-w-2xl font-heading text-4xl leading-tight font-bold text-foreground sm:text-6xl">
          The Scoreboard <span className="text-brand-gold italic">Nobody Built</span>
        </h1>
        <p className="mx-auto max-w-xl text-lg leading-relaxed text-foreground/70">
          Four token ecosystems. One hundred charities scored. Twelve dimensions measured.
          Thirty-five portfolio companies tracked. Consciousness-adjusted impact at scale — not a
          whitepaper, a working system.
        </p>
      </section>

      <section className="mx-auto -mt-8 max-w-3xl px-6 sm:px-10">
        <div className="rounded-2xl border border-brand-gold/15 bg-card p-7">
          <p className="mb-3 leading-relaxed text-foreground/80">
            <strong className="text-brand-gold">What you&apos;re looking at:</strong> A unified
            impact measurement dashboard that aggregates four live token ecosystems (BEYOND, REX,
            SPACE, BEING), a 100-charity accountability index, a 12-dimension SoulScore engine, and
            Howard W. Buffett&apos;s Impact Rate of Return framework into one real-time view.
          </p>
          <p className="mb-3 leading-relaxed text-foreground/80">
            <strong className="text-brand-gold">Why it matters:</strong> Every impact platform
            before this died because they built dashboards on broken data. This one measures
            consciousness, not just carbon. It scores entities across twelve axes so no single
            dimension can be gamed. And it connects the money to the outcome with on-chain
            verification.
          </p>
          <p className="leading-relaxed text-foreground/80">
            <strong className="text-brand-gold">What to do with it:</strong> Use the tabs below to
            explore each layer. Start with <em>Overview</em> for the aggregate picture, then drill
            into <em>Token Ecosystems</em> for live community data, <em>Portfolio Impact</em> for
            company-level metrics, or <em>SoulScore</em> to see how the 12-dimension engine works.
          </p>
        </div>
      </section>

      <div className="pt-10">
        <ImpactDashboardExplorer />
      </div>

      <footer className="bg-linear-to-br from-[#3D2E14] to-[#5A4020] px-6 py-10 text-center sm:px-10">
        <p className="mb-2 font-mono text-sm text-brand-gold">
          Impact Measurement Dashboard — ImpactSoul
        </p>
        <p className="font-mono text-xs tracking-wide text-white/70">
          4 Token Ecosystems · 100 Charities Scored · 12 SoulScore Dimensions ·{" "}
          {AGGREGATE.portfolioCompanies}+ Portfolio Companies · iRR Framework
        </p>
        <p className="mt-2 font-mono text-[0.65rem] text-white/50">
          Architecture: 50+ meeting transcripts, 100+ research conversations, 25 years of Fortune
          500 impact advisory
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-6 font-mono text-xs tracking-wide">
          <Link href="/charity-scorecard" className="text-brand-gold">
            Charity Scorecard
          </Link>
          <Link href="/intel" className="text-brand-gold">
            Portfolio Intel
          </Link>
          <Link href="/invest" className="text-brand-gold">
            Invest
          </Link>
        </div>
      </footer>
    </div>
  );
}
