"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Waves,
  Bone,
  Satellite,
  Brain,
  Zap,
  Target,
  FlaskConical,
  Gem,
  Link2,
  Building2,
  Lock,
  Heart,
  HandHeart,
  CircleDot,
  Globe,
  Scale,
  Landmark,
  Users,
  Recycle,
  ShieldCheck,
  Dna,
  Eye,
  ChevronDown,
  BarChart3,
  TrendingUp,
  Microscope,
  type LucideIcon,
} from "lucide-react";
import {
  TOKEN_ECOSYSTEMS,
  AGGREGATE,
  PORTFOLIO_CATEGORIES,
  DIMENSION_SUMMARY,
  CHARITY_SUMMARY,
  CHARITY_SCORE_DIMENSIONS,
  IRR_HIGHLIGHTS,
  CONSCIOUSNESS_ZONES,
  BENCHMARK_COMPARISON,
  REX_AUCTIONS,
  type TokenEcosystem,
} from "@/lib/content/impact-dashboard";

// Ported from legacy client/src/pages/ImpactDashboard.tsx; copy updated
// 2026-10 to match the live site's "target representation" rewrite (tabs
// renamed, every figure labelled as an illustrative model input, REX shown
// as a never-launched concept with its auction-record and Light Center
// study). Dropped: the canvas particle field and
// scroll-linked parallax hero image (same "not worth the runtime cost for
// pure decoration" reasoning used throughout this migration) and the
// legacy hero images themselves, which used the banned `/api/img/` Manus
// path (CONTRIBUTING.md's zero-Manus-dependency rule) — replaced with a
// plain gradient hero. The "Explore the SoulScore prototype" / "Explore
// the C-NPV prototype" links point to the real `/soulscore` page (Phase 9).
const ICONS: Record<string, LucideIcon> = {
  waves: Waves,
  bone: Bone,
  satellite: Satellite,
  brain: Brain,
  zap: Zap,
  target: Target,
  flask: FlaskConical,
  gem: Gem,
  link: Link2,
  building: Building2,
  lock: Lock,
  heart: Heart,
  "hand-heart": HandHeart,
  "circle-dot": CircleDot,
  globe: Globe,
  scale: Scale,
  landmark: Landmark,
  users: Users,
  recycle: Recycle,
  "shield-check": ShieldCheck,
  dna: Dna,
  eye: Eye,
};

function GlassCard({
  children,
  className = "",
  onClick,
  interactive = false,
  accent,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  accent?: string;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-brand-gold/15 bg-card/60 backdrop-blur-xl transition-all duration-300 ${
        onClick || interactive ? "cursor-pointer hover:-translate-y-1 hover:border-brand-gold/50 hover:shadow-lg" : ""
      } ${className}`}
      style={accent ? { borderLeftColor: accent, borderLeftWidth: 4 } : undefined}
    >
      {children}
    </div>
  );
}

function HBar({ value, max, color, label, sublabel }: { value: number; max: number; color: string; label: string; sublabel?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="font-mono text-xs font-bold" style={{ color }}>
          {value}
          {sublabel ? ` ${sublabel}` : ""}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-sm bg-brand-gold/8">
        <div className="h-full rounded-sm transition-[width] duration-1000" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
      </div>
    </div>
  );
}

function SoulScoreLink({ label }: { label: string }) {
  return (
    <Link
      href="/soulscore"
      className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wide text-brand-gold uppercase transition-colors hover:text-brand-gold-light"
    >
      {label} →
    </Link>
  );
}

// REX never launched, so its cards show status chips instead of model
// metrics. One full literal class string per tone (Tailwind needs them whole).
const REX_STATUS = [
  { label: "Launch status", value: "Never launched", chip: "border-[#CF4525]/30 bg-[#CF4525]/5", text: "text-[#B03A1F]" },
  { label: "Current state", value: "Concept only", chip: "border-brand-gold/30 bg-brand-gold/5", text: "text-brand-gold" },
  { label: "Operating results", value: "None claimed", chip: "border-[#1E8449]/30 bg-[#1E8449]/5", text: "text-[#1E8449]" },
];

function RexStory() {
  return (
    <>
      <div className="mb-4 rounded-xl border border-brand-gold/20 bg-brand-gold/5 p-5">
        <p className="mb-2 font-mono text-[0.6rem] tracking-[0.2em] text-brand-gold uppercase">
          REX · What happened and what the market proved
        </p>
        <h3 className="mb-2 font-heading text-lg text-foreground">
          REX was never launched. The idea behind it did not disappear.
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-foreground/80">
          REX never became a public project or token ecosystem. The figures elsewhere on this page
          are model inputs, not REX operating results. What survived was the harder question: can
          the extraordinary private value attached to deep-time assets help fund public science,
          education, conservation, and access?
        </p>
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {REX_AUCTIONS.map((a) => (
            <a
              key={a.name}
              href={a.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-brand-gold/20 bg-card/70 p-3 transition-colors hover:border-brand-gold/50"
            >
              <div className="mb-1.5 font-mono text-[0.6rem] tracking-wide text-muted-foreground">
                {a.year} · {a.source}
              </div>
              <div className="mb-1 text-sm font-semibold text-foreground">{a.name}</div>
              <div className="font-heading text-lg font-bold text-brand-gold">{a.price}</div>
            </a>
          ))}
        </div>
        <p className="mb-3 text-sm leading-relaxed text-foreground/80">
          The top reported dinosaur auction result rose from Sue&rsquo;s $8.36 million sale in 1997
          to Gus&rsquo;s $50 million sale in 2026, a 5.98× increase. These were different specimens
          with different completeness, provenance, preparation, and scientific value. This is a
          record-price comparison, not an investment-return series or a promise that fossils
          appreciate uniformly.
        </p>
        <p className="text-sm leading-relaxed text-foreground/80">
          That is why regenerative finance has come of age. The real shift is not whether a token
          survives. It is whether capital is designed from the beginning to restore something.
          Tokens may become useful distribution rails. Philanthropy, museums, operating revenue, or
          direct project finance may prove more credible. The human shift is the same: money stops
          treating regeneration as the charitable cleanup after value is created and starts making
          it part of how value moves.
        </p>
      </div>

      <div className="relative isolate mb-4 overflow-hidden rounded-xl bg-[#221A2C] p-5 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_35%,rgba(245,200,120,0.55),rgba(180,80,95,0.35)_30%,transparent_65%)]"
        />
        <p className="mb-2 font-mono text-[0.6rem] tracking-[0.2em] text-white/80 uppercase">
          REX Light Center · Concept study
        </p>
        <h3 className="mb-2 font-heading text-lg">
          A long-view room for fossils, sky, and the questions capital usually skips
        </h3>
        <p className="mb-3 text-sm leading-relaxed text-white/90">
          The design reference is James Turrell&rsquo;s work with light, aperture, time, and
          attention. A REX Light Center would be a public-learning space where deep time,
          paleontology, and the sky are experienced together rather than merely explained on a
          plaque.
        </p>
        <p className="mb-4 text-sm leading-relaxed text-white/90">
          This is not a James Turrell commission, partnership, approved design, or use of his
          artwork. It is a proposed ImpactSoul concept informed by public examples of
          Turrell&rsquo;s light-and-space practice, including the Skyspace at the University of
          Texas and Roden Crater.
        </p>
        <a
          href="https://turrell.utexas.edu/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center font-mono text-xs tracking-wide text-white underline-offset-4 hover:underline md:min-h-6"
        >
          Read about The Color Inside Skyspace
        </a>
      </div>
    </>
  );
}

function PathwayMetrics({ token }: { token: TokenEcosystem }) {
  if (token.neverLaunched) {
    return (
      <div className="flex flex-wrap gap-2">
        {REX_STATUS.map((m) => (
          <div key={m.label} className={`rounded-md border px-3 py-1 font-mono text-xs ${m.chip}`}>
            <span className="text-muted-foreground">{m.label}: </span>
            <span className={`font-bold ${m.text}`}>{m.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {[
        { label: "Model participants", value: token.metrics.tokenHolders.toLocaleString() },
        { label: "Model capital", value: token.metrics.impactDeployed },
        { label: "Project nodes", value: token.metrics.projectsFunded.toString() },
        { label: "Model community", value: token.metrics.communityMembers.toLocaleString() },
        { label: "Target multiplier", value: token.metrics.impactMultiplier },
      ].map((m) => (
        <div key={m.label} className="rounded-md border px-3 py-1 font-mono text-xs" style={{ background: `${token.color}10`, borderColor: `${token.color}30` }}>
          <span className="text-muted-foreground">{m.label}: </span>
          <span style={{ color: token.color }} className="font-bold">
            {m.value}
          </span>
        </div>
      ))}
    </div>
  );
}

const TAB_NAMES = ["Overview", "Project Pathways", "Portfolio Model", "SoulScore", "Accountability Model", "iRR Framework"] as const;
type TabName = (typeof TAB_NAMES)[number];

export function ImpactDashboardExplorer() {
  const [activeTab, setActiveTab] = useState<TabName>("Overview");
  const [expandedToken, setExpandedToken] = useState<string | null>(null);

  return (
    <div>
      <nav className="sticky top-14 z-30 flex overflow-x-auto border-b-2 border-brand-gold/15 bg-background/90 backdrop-blur-xl">
        {TAB_NAMES.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`shrink-0 border-b-2 px-5 py-3.5 font-mono text-xs tracking-wide whitespace-nowrap uppercase transition-colors ${
              activeTab === t ? "border-brand-gold font-bold text-brand-gold" : "border-transparent text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
        {/* All 6 tabs render always — real, substantial content — toggled
            via `hidden` rather than conditional unmounting, matching the
            site's tab/accordion-crawlability rule. */}
        <div className={activeTab === "Overview" ? "" : "hidden"}>
          <p className="mb-4 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Illustrative Operating Model</p>
          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Modeled Participant Reach", value: AGGREGATE.totalTokenHolders.toLocaleString(), sub: "Illustrative input, not current holders", color: "#836311" },
              { label: "Modeled Capital Path", value: AGGREGATE.totalImpactDeployed, sub: "Illustrative allocation, not deployed capital", color: "#1E8449" },
              { label: "Potential Project Nodes", value: AGGREGATE.totalProjectsFunded.toString(), sub: "Proposed water, culture, access, and care work", color: "#0077B6" },
              { label: "Modeled Community Reach", value: AGGREGATE.totalCommunityMembers.toLocaleString(), sub: "Scenario input, not active membership", color: "#6C5CE7" },
              { label: "Sample Integrity Input", value: AGGREGATE.avgHawkins.toString(), sub: "Draft scoring input only", color: "#9E822E" },
              { label: "Potential Portfolio Lenses", value: AGGREGATE.portfolioCompanies.toString(), sub: "Model categories, not a tracked portfolio", color: "#9B59B6" },
            ].map((kpi) => (
              <GlassCard key={kpi.label} className="p-6">
                <div className="mb-2 font-mono text-[0.6rem] tracking-wide text-muted-foreground uppercase">{kpi.label}</div>
                <div className="mb-1 font-heading text-3xl font-bold" style={{ color: kpi.color }}>
                  {kpi.value}
                </div>
                <div className="text-sm text-muted-foreground">{kpi.sub}</div>
              </GlassCard>
            ))}
          </div>

          <p className="mb-4 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Proposed Impact Pathways</p>
          <div className="mb-10 grid gap-4 sm:grid-cols-2">
            {TOKEN_ECOSYSTEMS.map((token) => {
              const Icon = ICONS[token.iconKey];
              return (
                <GlassCard key={token.id} className="p-6" accent={token.color} onClick={() => setActiveTab("Project Pathways")}>
                  <div className="mb-3 flex items-center gap-3">
                    <Icon className="size-6" style={{ color: token.color }} />
                    <div>
                      <div className="font-heading text-lg font-bold text-foreground">{token.name}</div>
                      {token.neverLaunched ? (
                        <div className="font-mono text-xs text-muted-foreground">Never launched · concept archive</div>
                      ) : (
                        <div className="font-mono text-xs" style={{ color: token.color }}>
                          {token.metrics.tokenHolders.toLocaleString()} modeled participants
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{token.mission.slice(0, 100)}...</p>
                  {token.neverLaunched ? (
                    <div className="font-mono text-xs text-muted-foreground">Historical thesis only · no operating results</div>
                  ) : (
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-[#1E8449]">{token.metrics.impactDeployed} model capital</span>
                      <span style={{ color: token.color }}>{token.metrics.impactMultiplier} target multiplier</span>
                    </div>
                  )}
                </GlassCard>
              );
            })}
          </div>

          <p className="mb-4 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Connected Systems</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/soulscore">
              <GlassCard className="p-5" interactive>
                <CircleDot className="mb-2 size-6 text-brand-gold" />
                <div className="mb-1 font-heading text-base font-bold text-foreground">SoulScore Engine</div>
                <div className="text-sm text-muted-foreground">12-dimension measurement</div>
              </GlassCard>
            </Link>
            <Link href="/charity-scorecard">
              <GlassCard className="p-5" interactive>
                <BarChart3 className="mb-2 size-6 text-brand-gold" />
                <div className="mb-1 font-heading text-base font-bold text-foreground">Charity Scorecard</div>
                <div className="text-sm text-muted-foreground">100 charities, 8 evaluators unified</div>
              </GlassCard>
            </Link>
            <Link href="/intel">
              <GlassCard className="p-5" interactive>
                <Microscope className="mb-2 size-6 text-brand-gold" />
                <div className="mb-1 font-heading text-base font-bold text-foreground">Portfolio Intel</div>
                <div className="text-sm text-muted-foreground">35+ companies, Hawkins-calibrated</div>
              </GlassCard>
            </Link>
            <Link href="/invest">
              <GlassCard className="p-5" interactive>
                <Gem className="mb-2 size-6 text-brand-gold" />
                <div className="mb-1 font-heading text-base font-bold text-foreground">Invest in the Thesis</div>
                <div className="text-sm text-muted-foreground">ABIT waitlist & portfolio</div>
              </GlassCard>
            </Link>
          </div>
        </div>

        <div className={activeTab === "Project Pathways" ? "" : "hidden"}>
          <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">Four Proposed Impact Pathways</h2>
          <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
            These are project pathways inside a working business model, not live token ecosystems
            or completed programs. The next 30 days are for turning the better ideas into
            defensible structures, documenting the assumptions, and removing anything that cannot
            survive scrutiny.
          </p>
          <div className="flex flex-col gap-4">
            {TOKEN_ECOSYSTEMS.map((token) => {
              const Icon = ICONS[token.iconKey];
              const isExpanded = expandedToken === token.id;
              return (
                <GlassCard key={token.id} className="p-7" accent={token.color} onClick={() => setExpandedToken(isExpanded ? null : token.id)}>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Icon className="size-8" style={{ color: token.color }} />
                      <div>
                        <div className="font-heading text-xl font-bold text-foreground">{token.name}</div>
                        <div className="font-mono text-xs" style={{ color: token.color }}>
                          {token.fullName}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="font-heading text-xl font-bold" style={{ color: token.color }}>
                          {token.soulScore}
                        </div>
                        <div className="font-mono text-[0.55rem] text-muted-foreground">SOULSCORE</div>
                      </div>
                      <ChevronDown className={`size-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </div>

                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{token.mission}</p>

                  <PathwayMetrics token={token} />

                  {/* Always in the DOM (toggled with `hidden`) so the copy and
                      links are in the server HTML; clicks inside don't collapse. */}
                  <div className={isExpanded ? "mt-4 border-t border-brand-gold/10 pt-4" : "hidden"} onClick={(e) => e.stopPropagation()}>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                      <div>
                        <div className="mb-1 font-mono text-[0.6rem] tracking-wide text-muted-foreground uppercase">Potential Collaborator</div>
                        <div className="text-sm font-semibold text-foreground">{token.partnerNGO}</div>
                      </div>
                      <div>
                        <div className="mb-1 font-mono text-[0.6rem] tracking-wide text-muted-foreground uppercase">Concept Anchor</div>
                        <div className="text-sm font-semibold text-foreground">{token.iconicAsset}</div>
                      </div>
                    </div>
                    {token.neverLaunched && <RexStory />}
                    <div className="mb-2 font-mono text-[0.6rem] tracking-wide text-muted-foreground uppercase">30-Day Build Questions</div>
                    <ul className="flex flex-col gap-1.5">
                      {token.milestones.map((m) => (
                        <li key={m} className="flex items-baseline gap-2 text-sm text-foreground/80">
                          <span aria-hidden="true" style={{ color: token.color }}>
                            •
                          </span>
                          {m}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex gap-6">
                      <div className="text-center">
                        <div className="font-heading text-lg font-bold text-brand-gold">{token.hawkinsScore}</div>
                        <div className="font-mono text-[0.55rem] text-muted-foreground">SAMPLE INPUT</div>
                      </div>
                      <div className="text-center">
                        <div className="font-heading text-lg font-bold" style={{ color: token.color }}>
                          {token.soulScore}
                        </div>
                        <div className="font-mono text-[0.55rem] text-muted-foreground">SAMPLE SCORE</div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        <div className={activeTab === "Portfolio Model" ? "" : "hidden"}>
          <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">Portfolio Model by Category</h2>
          <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
            These are proposed portfolio lenses and sample inputs, not a performance record or a
            list of approved investments. The model asks which gates, disclosures, and measurement
            standards should exist before capital is presented as regenerative.
          </p>
          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PORTFOLIO_CATEGORIES.map((cat) => {
              const Icon = ICONS[cat.iconKey];
              return (
                <GlassCard key={cat.name} className="p-6" accent={cat.color}>
                  <div className="mb-4 flex items-center gap-3">
                    <Icon className="size-6" style={{ color: cat.color }} />
                    <div>
                      <div className="font-heading text-base font-bold text-foreground">{cat.name}</div>
                      <div className="font-mono text-xs text-muted-foreground">
                        {cat.companies} {cat.companies === 1 ? "modeled company lens" : "modeled company lenses"}
                      </div>
                    </div>
                  </div>
                  <HBar value={cat.avgHawkins} max={700} color={cat.color} label="Sample input" sublabel="/ 700" />
                  <HBar value={cat.avgComposite} max={10} color={cat.color} label="Draft composite" sublabel="/ 10" />
                  <div className="mt-3 rounded-md p-2.5 font-mono text-xs" style={{ background: `${cat.color}10`, color: cat.color }}>
                    {cat.keyMetric}
                  </div>
                </GlassCard>
              );
            })}
          </div>

          <GlassCard className="p-6">
            <p className="mb-4 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Deep Dive</p>
            <p className="mb-4 leading-relaxed text-foreground/80">
              The full company-by-company evidence, scoring method, source definitions, and
              conflict controls are still being refined. The linked Intel page is a separate
              research surface and should not be read as proof of current ImpactSoul performance.
            </p>
            <Link href="/intel" className="border-b border-brand-gold/30 font-mono text-xs tracking-wide text-brand-gold uppercase">
              View Portfolio Research →
            </Link>
          </GlassCard>
        </div>

        <div className={activeTab === "SoulScore" ? "" : "hidden"}>
          <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">SoulScore — 12-Dimension Design</h2>
          <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
            This is a proposed 12-dimension scoring design. The values below are sample inputs used
            to test legibility and discussion, not validated scores, a scientific assessment, or a
            claim that any organization has been measured in real time.
          </p>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DIMENSION_SUMMARY.map((dim) => {
              const Icon = ICONS[dim.iconKey];
              return (
                <GlassCard key={dim.label} className="p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Icon className="size-4" style={{ color: dim.color }} />
                    <span className="text-sm font-bold text-foreground">{dim.label}</span>
                    <span className="ml-auto font-mono text-[0.55rem] text-muted-foreground">{dim.weight}% weight</span>
                  </div>
                  <HBar
                    value={dim.label === "Consciousness" ? dim.avgScore / 10 : dim.avgScore}
                    max={100}
                    color={dim.color}
                    label={dim.shortLabel}
                    sublabel={dim.label === "Consciousness" ? `(${dim.avgScore} Hawkins)` : "/ 100"}
                  />
                </GlassCard>
              );
            })}
          </div>

          <GlassCard className="mb-6 p-6">
            <p className="mb-4 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Illustrative Comparison Pattern</p>
            <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Table (scrolls sideways)">
              <table className="w-full border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b-2 border-brand-gold/20">
                    <th className="p-2 text-left text-muted-foreground">Entity</th>
                    <th className="p-2 text-center text-muted-foreground">Hawkins</th>
                    <th className="p-2 text-center text-muted-foreground">SoulScore</th>
                    <th className="p-2 text-center text-muted-foreground">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {BENCHMARK_COMPARISON.map((row) => (
                    <tr key={row.name} className={`border-b border-brand-gold/8 ${row.name.includes("ImpactSoul") ? "bg-brand-gold/8" : ""}`}>
                      <td className={`p-2.5 text-foreground ${row.name.includes("ImpactSoul") ? "font-bold" : ""}`}>{row.name}</td>
                      <td className="p-2.5 text-center" style={{ color: row.color }}>
                        {row.hawkins}
                      </td>
                      <td className="p-2.5 text-center font-bold" style={{ color: row.color }}>
                        {row.score}
                      </td>
                      <td className="p-2.5 text-center">
                        <span className="rounded px-2 py-0.5 font-bold" style={{ background: `${row.color}15`, color: row.color }}>
                          {row.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <p className="mb-3 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Interactive Engine</p>
            <p className="mb-4 leading-relaxed text-foreground/80">
              Explore the proposed dimensions, adjust the test inputs, and use the model to ask
              better questions. A final scoring tool requires published methodology, sourced
              evidence, reviewer controls, and an appeals process before it can be treated as more
              than a prototype.
            </p>
            <SoulScoreLink label="Explore the SoulScore prototype" />
          </GlassCard>
        </div>

        <div className={activeTab === "Accountability Model" ? "" : "hidden"}>
          <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">Accountability Model</h2>
          <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
            This is a draft accountability framework. The counts, scores, transparency
            distribution, and sector coverage below are model inputs used to shape the eventual
            product. They are not a live charity database, current scorecard, or completed
            evaluation.
          </p>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "Model Entities", value: CHARITY_SUMMARY.totalCharities.toString(), color: "#836311", Icon: BarChart3 },
              { label: "Sample Composite", value: CHARITY_SUMMARY.avgScore.toString(), color: "#1E8449", Icon: TrendingUp },
              { label: "Potential Source Inputs", value: CHARITY_SUMMARY.evaluatorsUnified.toString(), color: "#3498DB", Icon: Link2 },
              { label: "Proposed Dimensions", value: CHARITY_SUMMARY.dimensions.toString(), color: "#9B59B6", Icon: Target },
              { label: "Model Sectors", value: CHARITY_SUMMARY.sectors.toString(), color: "#E67E22", Icon: Globe },
            ].map((stat) => (
              <GlassCard key={stat.label} className="p-5 text-center">
                <stat.Icon className="mx-auto mb-2 size-5" style={{ color: stat.color }} />
                <div className="font-heading text-2xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="font-mono text-[0.6rem] tracking-wide text-muted-foreground uppercase">{stat.label}</div>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="mb-6 p-6">
            <p className="mb-3 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Illustrative Transparency Pattern</p>
            <p className="mb-4 text-sm leading-relaxed text-foreground/80">
              This distribution tests how the reporting view could make a difference in disclosure
              easier to see. It is not a current classification of any charity or organization.
            </p>
            <div className="mb-2 flex h-10 gap-1.5 overflow-hidden rounded-lg">
              <div className="flex items-center justify-center font-mono text-xs font-bold text-white" style={{ flex: CHARITY_SUMMARY.clearTransparency, background: "#1E8449" }}>
                {CHARITY_SUMMARY.clearTransparency}%
              </div>
              <div className="flex items-center justify-center font-mono text-xs font-bold text-white" style={{ flex: CHARITY_SUMMARY.hazyTransparency, background: "#E67E22" }}>
                {CHARITY_SUMMARY.hazyTransparency}%
              </div>
              <div className="flex items-center justify-center font-mono text-xs font-bold text-white" style={{ flex: CHARITY_SUMMARY.opaqueTransparency, background: "#E74C3C" }}>
                {CHARITY_SUMMARY.opaqueTransparency}%
              </div>
            </div>
            <div className="flex justify-between font-mono text-[0.6rem] text-muted-foreground">
              <span>Clear / Mostly Clear</span>
              <span>Hazy</span>
              <span>Opaque</span>
            </div>
          </GlassCard>

          <GlassCard className="mb-6 p-6">
            <p className="mb-4 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Proposed Scoring Dimensions</p>
            {CHARITY_SCORE_DIMENSIONS.map((dim) => (
              <HBar key={dim.label} value={dim.weight} max={25} color={dim.color} label={dim.label} sublabel={`${dim.weight}% weight`} />
            ))}
          </GlassCard>

          <GlassCard className="p-6">
            <p className="mb-3 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Research Surface</p>
            <p className="mb-4 leading-relaxed text-foreground/80">
              The eventual research surface will need primary-source criteria, dated evidence,
              reviewer controls, correction rights, and a documented appeals process before any
              score is published as a decision-useful finding.
            </p>
            <Link href="/charity-scorecard" className="border-b border-brand-gold/30 font-mono text-xs tracking-wide text-brand-gold uppercase">
              View Research Prototype →
            </Link>
          </GlassCard>
        </div>

        <div className={activeTab === "iRR Framework" ? "" : "hidden"}>
          <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">Impact Rate of Return Model</h2>
          <p className="mb-3 max-w-2xl leading-relaxed text-muted-foreground">
            This section is a working model for discussing how capital could be evaluated against a
            real-world result. The formula, terms, and source definitions are draft and are not a
            financial return calculation, valuation, or performance claim.
          </p>
          <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
            Any values shown here are sample inputs for a discussion about integrity, transparency,
            and regenerative allocation. They are not a validated measurement of an organization,
            person, or investment.
          </p>

          <GlassCard className="mb-8 p-6">
            <p className="mb-3 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Draft Formula</p>
            <code className="block rounded-md bg-brand-gold/5 p-4 font-mono text-sm leading-loose text-foreground">
              iRR = (Key Impact Indicator × Future Impact) ÷ (Efficiency × Multiplier) / Time
              <br />
              C-NPV = Σ [FCF_t × Consciousness_Multiplier / (1 + r_adjusted)^t]
              <br />
              Consciousness Multiplier = 1.0 + (Hawkins - 100) / 1000
            </code>
          </GlassCard>

          <p className="mb-4 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Illustrative Model Outputs</p>
          <div className="mb-8 flex flex-col gap-4">
            {IRR_HIGHLIGHTS.map((item) => (
              <GlassCard key={item.entity} className="p-6" accent={item.color}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="font-heading text-lg font-bold text-foreground">{item.entity}</div>
                  <div className="font-heading text-2xl font-bold" style={{ color: item.color }}>
                    {item.irr}
                  </div>
                </div>
                <div className="rounded-md px-3 py-2 font-mono text-xs" style={{ background: `${item.color}10`, color: "var(--muted-foreground)" }}>
                  {item.metric}
                </div>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="mb-6 p-6">
            <p className="mb-4 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Draft Integrity Zones</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {CONSCIOUSNESS_ZONES.map((z) => (
                <div key={z.zone} className="rounded-lg border p-4" style={{ background: `${z.color}0F`, borderColor: `${z.color}30` }}>
                  <div className="mb-1 font-mono text-xs font-bold tracking-wide" style={{ color: z.color }}>
                    {z.zone}
                  </div>
                  <div className="mb-2 font-mono text-[0.6rem] text-muted-foreground">{z.range}</div>
                  <div className="text-sm leading-snug text-foreground/80">{z.desc}</div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <p className="mb-3 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Explore the Model</p>
            <p className="mb-4 leading-relaxed text-foreground/80">
              Use the prototype to see how the proposed variables interact. A real tool must
              publish its evidence standard, scoring rules, data provenance, and decision limits
              before its outputs can be treated as meaningful.
            </p>
            <SoulScoreLink label="Explore the C-NPV prototype" />
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
