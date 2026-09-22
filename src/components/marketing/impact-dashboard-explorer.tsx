"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  Handshake,
  HeartHandshake,
  Landmark,
  Leaf,
  LineChart,
  Lightbulb,
  Network,
  ShieldCheck,
  Sparkles,
  Sprout,
  Ticket,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  CAPITAL_PATHWAYS,
  DASHBOARD_STATUS,
  MEASUREMENT_LENSES,
  MODEL_LAYERS,
  REX_LIGHT_CENTER,
  SAFEGUARD_MESSAGES,
  TARGET_SIGNALS,
  THIRTY_DAY_PLAN,
} from "@/lib/content/impact-dashboard";

const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  sprout: Sprout,
  "shield-check": ShieldCheck,
  network: Network,
  "heart-handshake": HeartHandshake,
  handshake: Handshake,
  ticket: Ticket,
  landmark: Landmark,
  leaf: Leaf,
  users: Users,
  "line-chart": LineChart,
};

const TAB_NAMES = [
  "Overview",
  "REX Light Center",
  "Capital Pathways",
  "Measurement",
  "30-Day Plan",
] as const;
type TabName = (typeof TAB_NAMES)[number];

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-2xl border border-brand-gold/25 bg-card p-5 shadow-sm sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 font-mono text-xs font-semibold tracking-[0.16em] text-foreground/75 uppercase">
      {children}
    </p>
  );
}

export function ImpactDashboardExplorer() {
  const [activeTab, setActiveTab] = useState<TabName>("Overview");

  return (
    <div>
      <nav
        aria-label="Impact Dashboard sections"
        className="sticky top-14 z-30 border-y border-brand-gold/25 bg-background/95 backdrop-blur-xl"
      >
        <div role="tablist" className="mx-auto flex max-w-6xl overflow-x-auto px-3 sm:px-6">
          {TAB_NAMES.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`impact-dashboard-${tab.toLowerCase().replaceAll(" ", "-")}`}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 border-b-2 px-4 py-4 font-mono text-xs font-semibold tracking-wide whitespace-nowrap uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-brand-gold sm:px-5 ${
                activeTab === tab
                  ? "border-brand-gold text-foreground"
                  : "border-transparent text-muted-foreground hover:border-brand-gold/40 hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
        <section
          id="impact-dashboard-overview"
          role="tabpanel"
          aria-label="Overview"
          hidden={activeTab !== "Overview"}
        >
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            {TARGET_SIGNALS.map((signal) => (
              <Panel key={signal.label}>
                <SectionEyebrow>{signal.label}</SectionEyebrow>
                <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">
                  {signal.value}
                </h2>
                <p className="leading-relaxed text-muted-foreground">{signal.detail}</p>
              </Panel>
            ))}
          </div>

          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="size-5 shrink-0 text-brand-gold" aria-hidden="true" />
            <SectionEyebrow>Four linked model layers</SectionEyebrow>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {MODEL_LAYERS.map((layer) => {
              const Icon = ICONS[layer.iconKey];
              return (
                <Panel key={layer.name}>
                  <div className="mb-4 flex items-start gap-3">
                    <div className="rounded-lg border border-brand-gold/30 bg-secondary p-2.5 text-foreground">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="font-heading text-xl font-bold text-foreground">
                        {layer.name}
                      </h2>
                      <p className="mt-1 leading-relaxed text-muted-foreground">
                        {layer.description}
                      </p>
                    </div>
                  </div>
                  <p className="border-t border-brand-gold/20 pt-4 text-sm leading-relaxed text-foreground/85">
                    <span className="font-semibold text-foreground">Working decision: </span>
                    {layer.decision}
                  </p>
                </Panel>
              );
            })}
          </div>
        </section>

        <section
          id="impact-dashboard-rex-light-center"
          role="tabpanel"
          aria-label="REX Light Center"
          hidden={activeTab !== "REX Light Center"}
        >
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Panel className="bg-secondary/65">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-full border border-brand-gold/35 bg-card p-3 text-foreground shadow-sm">
                  <Sparkles className="size-6" aria-hidden="true" />
                </div>
                <div>
                  <SectionEyebrow>{REX_LIGHT_CENTER.status}</SectionEyebrow>
                  <h2 className="font-heading text-3xl font-bold text-foreground">
                    {REX_LIGHT_CENTER.name}
                  </h2>
                </div>
              </div>
              <p className="mb-5 text-lg leading-relaxed text-foreground/90">
                {REX_LIGHT_CENTER.summary}
              </p>
              <p className="leading-relaxed text-muted-foreground">
                {REX_LIGHT_CENTER.businessRole}
              </p>
            </Panel>

            <Panel>
              <SectionEyebrow>Artistic reference</SectionEyebrow>
              <p className="mb-5 leading-relaxed text-foreground/85">
                {REX_LIGHT_CENTER.artReference}
              </p>
              <a
                href={REX_LIGHT_CENTER.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border-b border-brand-gold/50 pb-1 font-mono text-xs font-semibold tracking-wide text-foreground transition-colors hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"
              >
                {REX_LIGHT_CENTER.sourceLabel}
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </Panel>
          </div>

          <Panel className="mt-6">
            <SectionEyebrow>What the concept is testing</SectionEyebrow>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                "A public encounter with light, perception, and deep time.",
                "A repeatable model for culture-led regenerative finance.",
                "A transparent way to separate aspirational design from verified public outcomes.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl border border-brand-gold/15 bg-secondary/50 p-4"
                >
                  <CheckCircle2
                    className="mt-0.5 size-5 shrink-0 text-foreground"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-relaxed text-foreground/85">{item}</p>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section
          id="impact-dashboard-capital-pathways"
          role="tabpanel"
          aria-label="Capital Pathways"
          hidden={activeTab !== "Capital Pathways"}
        >
          <div className="mb-7 max-w-3xl">
            <SectionEyebrow>Money moving in a different direction</SectionEyebrow>
            <h2 className="mb-3 font-heading text-3xl font-bold text-foreground">
              Regenerative finance is the operating question.
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              The target model starts with durable relationships among public benefit, cultural
              work, and accountable capital. Digital assets may be evaluated later, but they are not
              the value proposition and are not assumed to be part of the final model.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {CAPITAL_PATHWAYS.map((pathway) => {
              const Icon = ICONS[pathway.iconKey];
              return (
                <Panel key={pathway.name}>
                  <div className="mb-4 flex items-center gap-3">
                    <Icon className="size-6 text-foreground" aria-hidden="true" />
                    <h2 className="font-heading text-xl font-bold text-foreground">
                      {pathway.name}
                    </h2>
                  </div>
                  <p className="mb-4 leading-relaxed text-muted-foreground">{pathway.role}</p>
                  <p className="rounded-lg border border-brand-gold/20 bg-secondary/60 p-3 text-sm leading-relaxed text-foreground/85">
                    <span className="font-semibold text-foreground">Guardrail: </span>
                    {pathway.guardrail}
                  </p>
                </Panel>
              );
            })}
          </div>
        </section>

        <section
          id="impact-dashboard-measurement"
          role="tabpanel"
          aria-label="Measurement"
          hidden={activeTab !== "Measurement"}
        >
          <div className="mb-7 max-w-3xl">
            <SectionEyebrow>Measurement before metrics</SectionEyebrow>
            <h2 className="mb-3 font-heading text-3xl font-bold text-foreground">
              A future dashboard must show its evidence, not simulate certainty.
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              These lenses are working questions for the model. They are not live scores,
              performance indicators, or claims about organizations, communities, or partners.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {MEASUREMENT_LENSES.map((lens) => {
              const Icon = ICONS[lens.iconKey];
              return (
                <Panel key={lens.name}>
                  <div className="mb-3 flex items-center gap-3">
                    <Icon className="size-5 text-foreground" aria-hidden="true" />
                    <h2 className="font-heading text-xl font-bold text-foreground">{lens.name}</h2>
                  </div>
                  <p className="mb-4 leading-relaxed text-foreground/90">{lens.question}</p>
                  <p className="border-t border-brand-gold/20 pt-4 text-sm leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">Evidence to establish: </span>
                    {lens.evidence}
                  </p>
                </Panel>
              );
            })}
          </div>
        </section>

        <section
          id="impact-dashboard-30-day-plan"
          role="tabpanel"
          aria-label="30-Day Plan"
          hidden={activeTab !== "30-Day Plan"}
        >
          <div className="mb-7 max-w-3xl">
            <SectionEyebrow>{DASHBOARD_STATUS.label}</SectionEyebrow>
            <h2 className="mb-3 font-heading text-3xl font-bold text-foreground">
              Refine the model in public, without pretending it has already arrived.
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              The next {DASHBOARD_STATUS.reviewHorizonDays} days are for challenge, design, and
              clear disclosure. The work shared here is intentionally incomplete so that assumptions
              can be improved before any operating claim is made.
            </p>
          </div>
          <ol className="grid gap-4 md:grid-cols-2">
            {THIRTY_DAY_PLAN.map((step, index) => (
              <li key={step.period}>
                <Panel className="h-full">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-sm font-bold text-background">
                      {index + 1}
                    </span>
                    <p className="font-mono text-xs font-semibold tracking-wide text-foreground/75 uppercase">
                      {step.period}
                    </p>
                  </div>
                  <h2 className="mb-2 font-heading text-xl font-bold text-foreground">
                    {step.title}
                  </h2>
                  <p className="leading-relaxed text-muted-foreground">{step.detail}</p>
                </Panel>
              </li>
            ))}
          </ol>

          <Panel className="mt-6 border-brand-gold/35 bg-secondary/60">
            <div className="flex items-start gap-3">
              <CircleAlert className="mt-1 size-5 shrink-0 text-foreground" aria-hidden="true" />
              <div>
                <h2 className="mb-2 font-heading text-xl font-bold text-foreground">
                  Contribution boundary
                </h2>
                <p className="leading-relaxed text-muted-foreground">
                  Feedback can help refine the concept, but participation in this page does not
                  create ownership, investment, membership, or an entitlement to future products.
                </p>
              </div>
            </div>
          </Panel>
        </section>
      </main>

      <section className="border-t border-brand-gold/25 bg-secondary/55 px-6 py-12 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionEyebrow>Clear boundary</SectionEyebrow>
          <h2 className="mb-4 max-w-3xl font-heading text-3xl font-bold text-foreground">
            This is a target representation, not evidence of an operating fund, token ecosystem, or
            impact portfolio.
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {SAFEGUARD_MESSAGES.map((message) => (
              <div
                key={message}
                className="rounded-xl border border-brand-gold/20 bg-card p-4 text-sm leading-relaxed text-foreground/85"
              >
                {message}
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs font-semibold tracking-wide">
            <Link
              href="/the-philosophy"
              className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"
            >
              Read the philosophy <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
            <Link
              href="/the-letter"
              className="inline-flex items-center gap-2 text-foreground transition-colors hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"
            >
              Start with The Letter <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
