import type { Metadata } from "next";
import { CircleAlert, Clock3 } from "lucide-react";
import { ImpactDashboardExplorer } from "@/components/marketing/impact-dashboard-explorer";
import { DASHBOARD_STATUS } from "@/lib/content/impact-dashboard";

export const metadata: Metadata = {
  title: "ImpactSoul Target Model — 30-Day Refinement",
  description:
    "A clearly labeled target representation and pro-forma for the ImpactSoul model: regenerative finance, cultural programming, accountable measurement, and the proposed REX Light Center.",
  alternates: { canonical: "/impact-dashboard" },
};

export default function ImpactDashboardPage() {
  return (
    <div>
      <section className="border-b border-brand-gold/25 bg-linear-to-b from-secondary via-background to-background px-6 pb-16 pt-18 sm:px-10 sm:pb-20 sm:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-gold/35 bg-card px-4 py-2 font-mono text-xs font-semibold tracking-[0.16em] text-foreground uppercase shadow-sm">
            <Clock3 className="size-3.5" aria-hidden="true" />
            {DASHBOARD_STATUS.label}
          </p>
          <h1 className="mx-auto mb-5 max-w-3xl font-heading text-4xl leading-[1.02] font-bold text-foreground sm:text-6xl">
            A target model for <span className="text-brand-gold italic">regenerative finance</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-foreground/80 sm:text-xl">
            A shared pro-forma for what ImpactSoul is building—not a live performance dashboard. It
            will be tested, clarified, and refined over the next 30 days before any operating claims
            are made.
          </p>
        </div>
      </section>

      <section className="mx-auto -mt-7 max-w-4xl px-6 sm:px-10">
        <div className="rounded-2xl border border-brand-gold/35 bg-card p-5 shadow-lg shadow-brand-gold/5 sm:p-7">
          <div className="flex items-start gap-3">
            <CircleAlert className="mt-0.5 size-5 shrink-0 text-foreground" aria-hidden="true" />
            <div>
              <h2 className="mb-2 font-heading text-xl font-bold text-foreground">
                Read this as a working model
              </h2>
              <p className="leading-relaxed text-foreground/85">{DASHBOARD_STATUS.summary}</p>
              <p className="mt-3 border-t border-brand-gold/20 pt-3 text-sm leading-relaxed text-muted-foreground">
                {DASHBOARD_STATUS.disclosure}
              </p>
            </div>
          </div>
        </div>
      </section>

      <ImpactDashboardExplorer />
    </div>
  );
}
