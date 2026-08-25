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
  Check,
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
} from "@/lib/content/impact-dashboard";

// Ported from legacy client/src/pages/ImpactDashboard.tsx. Real content,
// unchanged, across all 6 tabs. Dropped: the canvas particle field and
// scroll-linked parallax hero image (same "not worth the runtime cost for
// pure decoration" reasoning used throughout this migration) and the
// legacy hero images themselves, which used the banned `/api/img/` Manus
// path (CONTRIBUTING.md's zero-Manus-dependency rule) — replaced with a
// plain gradient hero. The "LAUNCH SOULSCORE ENGINE" / "LAUNCH C-NPV
// CALCULATOR" links pointed to `/soulscore`, which doesn't exist yet in
// this migration — rendered as a disabled "Coming Soon" note instead of a
// broken link, not silently dropped, so the SoulScore engine promise
// isn't misrepresented as unlinked-but-real, or invented as a live link.
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

function ComingSoonLink({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wide text-muted-foreground">
      {label}
      <span className="rounded-full bg-muted px-2 py-0.5 text-[0.6rem] uppercase">Coming Soon</span>
    </span>
  );
}

const TAB_NAMES = ["Overview", "Token Ecosystems", "Portfolio Impact", "SoulScore", "Charity Index", "iRR Framework"] as const;
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
          <p className="mb-4 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Aggregate Impact Metrics</p>
          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Total Token Holders", value: `${AGGREGATE.totalTokenHolders.toLocaleString()}+`, sub: "Across 4 ecosystems", color: "#8B6914" },
              { label: "Impact Capital Deployed", value: AGGREGATE.totalImpactDeployed, sub: "Direct regenerative funding", color: "#27AE60" },
              { label: "Projects Funded", value: AGGREGATE.totalProjectsFunded.toString(), sub: "Ocean, education, digital, mental health", color: "#0077B6" },
              { label: "Community Members", value: `${AGGREGATE.totalCommunityMembers.toLocaleString()}+`, sub: "Active participants worldwide", color: "#6C5CE7" },
              { label: "Avg Hawkins Score", value: AGGREGATE.avgHawkins.toString(), sub: "Above integrity threshold (200+)", color: "#D4B96A" },
              { label: "Portfolio Companies", value: `${AGGREGATE.portfolioCompanies}+`, sub: "Psychedelic, impact, Web3, health", color: "#9B59B6" },
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

          <p className="mb-4 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Live Token Ecosystems</p>
          <div className="mb-10 grid gap-4 sm:grid-cols-2">
            {TOKEN_ECOSYSTEMS.map((token) => {
              const Icon = ICONS[token.iconKey];
              return (
                <GlassCard key={token.id} className="p-6" accent={token.color} onClick={() => setActiveTab("Token Ecosystems")}>
                  <div className="mb-3 flex items-center gap-3">
                    <Icon className="size-6" style={{ color: token.color }} />
                    <div>
                      <div className="font-heading text-lg font-bold text-foreground">{token.name}</div>
                      <div className="font-mono text-xs" style={{ color: token.color }}>
                        {token.metrics.tokenHolders.toLocaleString()} holders
                      </div>
                    </div>
                  </div>
                  <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{token.mission.slice(0, 100)}...</p>
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-[#27AE60]">{token.metrics.impactDeployed} deployed</span>
                    <span style={{ color: token.color }}>{token.metrics.impactMultiplier} multiplier</span>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          <p className="mb-4 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Connected Systems</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <GlassCard className="p-5">
              <CircleDot className="mb-2 size-6 text-brand-gold" />
              <div className="mb-1 font-heading text-base font-bold text-foreground">SoulScore Engine</div>
              <div className="text-sm text-muted-foreground">12-dimension measurement</div>
              <div className="mt-2">
                <ComingSoonLink label="Launch Engine" />
              </div>
            </GlassCard>
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

        <div className={activeTab === "Token Ecosystems" ? "" : "hidden"}>
          <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">Four Live Token Ecosystems</h2>
          <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
            Each ecosystem has a partner NGO, a pledged iconic asset, and a community of token
            holders who create impact directly or grow the asset to unlock the next donation.
            Every ABIT is backed by a real asset, structured for impact, and designed to compound
            regeneratively.
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
                          {token.fullName.split(" — ")[1]}
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

                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "Holders", value: token.metrics.tokenHolders.toLocaleString() },
                      { label: "Deployed", value: token.metrics.impactDeployed },
                      { label: "Projects", value: token.metrics.projectsFunded.toString() },
                      { label: "Community", value: token.metrics.communityMembers.toLocaleString() },
                      { label: "Multiplier", value: token.metrics.impactMultiplier },
                    ].map((m) => (
                      <div key={m.label} className="rounded-md border px-3 py-1 font-mono text-xs" style={{ background: `${token.color}10`, borderColor: `${token.color}30` }}>
                        <span className="text-muted-foreground">{m.label}: </span>
                        <span style={{ color: token.color }} className="font-bold">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {isExpanded && (
                    <div className="mt-4 border-t border-brand-gold/10 pt-4">
                      <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                          <div className="mb-1 font-mono text-[0.6rem] tracking-wide text-muted-foreground uppercase">Partner NGO</div>
                          <div className="text-sm font-semibold text-foreground">{token.partnerNGO}</div>
                        </div>
                        <div>
                          <div className="mb-1 font-mono text-[0.6rem] tracking-wide text-muted-foreground uppercase">Iconic Asset</div>
                          <div className="text-sm font-semibold text-foreground">{token.iconicAsset}</div>
                        </div>
                      </div>
                      <div className="mb-2 font-mono text-[0.6rem] tracking-wide text-muted-foreground uppercase">Milestones</div>
                      <div className="flex flex-col gap-1.5">
                        {token.milestones.map((m) => (
                          <div key={m} className="flex items-center gap-2 text-sm text-foreground/80">
                            <Check className="size-3.5 shrink-0" style={{ color: token.color }} />
                            {m}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-6">
                        <div className="text-center">
                          <div className="font-heading text-lg font-bold text-brand-gold">{token.hawkinsScore}</div>
                          <div className="font-mono text-[0.55rem] text-muted-foreground">HAWKINS</div>
                        </div>
                        <div className="text-center">
                          <div className="font-heading text-lg font-bold" style={{ color: token.color }}>
                            {token.soulScore}
                          </div>
                          <div className="font-mono text-[0.55rem] text-muted-foreground">SOULSCORE</div>
                        </div>
                      </div>
                    </div>
                  )}
                </GlassCard>
              );
            })}
          </div>
        </div>

        <div className={activeTab === "Portfolio Impact" ? "" : "hidden"}>
          <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">Portfolio Impact by Category</h2>
          <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
            Every company and cause passes through three gates before it gets time. Then it gets
            scored on seven dimensions of impact, measured against Howard W. Buffett&apos;s Impact
            Rate of Return framework, and calibrated on David Hawkins&apos; Map of Consciousness.
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
                        {cat.companies} {cat.companies === 1 ? "company" : "companies"}
                      </div>
                    </div>
                  </div>
                  <HBar value={cat.avgHawkins} max={700} color={cat.color} label="Avg Hawkins" sublabel="/ 700" />
                  <HBar value={cat.avgComposite} max={10} color={cat.color} label="Avg Composite" sublabel="/ 10" />
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
              For the full company-by-company breakdown with Hawkins scores, compass dimensions,
              competitive landscape, and iRR calculations, visit the Intel page.
            </p>
            <Link href="/intel" className="border-b border-brand-gold/30 font-mono text-xs tracking-wide text-brand-gold">
              View Full Portfolio Intel →
            </Link>
          </GlassCard>
        </div>

        <div className={activeTab === "SoulScore" ? "" : "hidden"}>
          <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">SoulScore — 12-Dimension Engine</h2>
          <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
            The first impact measurement engine that scores consciousness, not just carbon. Twelve
            dimensions. Any entity. Real-time. ESG scores positively correlate with greenwashing —
            SoulScore&apos;s 12-axis measurement eliminates single-dimension gaming.
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
            <p className="mb-4 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Benchmark Comparison</p>
            <div className="overflow-x-auto">
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
              Score any entity in real-time across all 12 dimensions. Adjust sliders, compare
              against benchmarks, explore the 6-tier supply chain deep dive, and calculate
              Consciousness-Adjusted NPV.
            </p>
            <ComingSoonLink label="Launch SoulScore Engine" />
          </GlassCard>
        </div>

        <div className={activeTab === "Charity Index" ? "" : "hidden"}>
          <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">The Grand Impact Accountability Index</h2>
          <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
            One hundred charities. Eight existing scorecards unified. Seven new dimensions
            measured. The first accountability framework that asks the question every donor
            deserves answered: what actually happened with my money?
          </p>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "Charities Scored", value: CHARITY_SUMMARY.totalCharities.toString(), color: "#8B6914", Icon: BarChart3 },
              { label: "Avg Composite Score", value: CHARITY_SUMMARY.avgScore.toString(), color: "#27AE60", Icon: TrendingUp },
              { label: "Evaluators Unified", value: CHARITY_SUMMARY.evaluatorsUnified.toString(), color: "#3498DB", Icon: Link2 },
              { label: "Scoring Dimensions", value: CHARITY_SUMMARY.dimensions.toString(), color: "#9B59B6", Icon: Target },
              { label: "Sectors Covered", value: CHARITY_SUMMARY.sectors.toString(), color: "#E67E22", Icon: Globe },
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
            <p className="mb-3 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Cloak-vs-Clear Distribution</p>
            <p className="mb-4 text-sm leading-relaxed text-foreground/80">
              The Cloak Score measures how transparent a charity is about where your money actually
              goes. Clear means full disclosure. Opaque means you&apos;re funding a black box.
            </p>
            <div className="mb-2 flex h-10 gap-1.5 overflow-hidden rounded-lg">
              <div className="flex items-center justify-center font-mono text-xs font-bold text-white" style={{ flex: CHARITY_SUMMARY.clearTransparency, background: "#27AE60" }}>
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
            <p className="mb-4 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">7 Scoring Dimensions</p>
            {CHARITY_SCORE_DIMENSIONS.map((dim) => (
              <HBar key={dim.label} value={dim.weight} max={25} color={dim.color} label={dim.label} sublabel={`${dim.weight}% weight`} />
            ))}
          </GlassCard>

          <GlassCard className="p-6">
            <p className="mb-3 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Full Scorecard</p>
            <p className="mb-4 leading-relaxed text-foreground/80">
              Browse all 100 charities, filter by sector, sort by composite score, and click any
              charity for its full breakdown with evaluator cross-references.
            </p>
            <Link href="/charity-scorecard" className="border-b border-brand-gold/30 font-mono text-xs tracking-wide text-brand-gold">
              View Full Charity Scorecard →
            </Link>
          </GlassCard>
        </div>

        <div className={activeTab === "iRR Framework" ? "" : "hidden"}>
          <h2 className="mb-2 font-heading text-2xl font-bold text-foreground">Impact Rate of Return (iRR)</h2>
          <p className="mb-3 max-w-2xl leading-relaxed text-muted-foreground">
            Howard W. Buffett&apos;s framework calculates the impact value of each dollar, not the
            dollar value of impact. Key Impact Indicator multiplied by Future Impact, divided by
            Efficiency multiplied by Multiplier, over Time.
          </p>
          <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
            Combined with David Hawkins&apos; Map of Consciousness (20-1000), which calibrates the
            energetic frequency of each organization&apos;s mission. 200+ is the integrity
            threshold. 500+ is love-driven. 700+ is enlightened.
          </p>

          <GlassCard className="mb-8 p-6">
            <p className="mb-3 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">The Formula</p>
            <code className="block rounded-md bg-brand-gold/5 p-4 font-mono text-sm leading-loose text-foreground">
              iRR = (Key Impact Indicator × Future Impact) ÷ (Efficiency × Multiplier) / Time
              <br />
              C-NPV = Σ [FCF_t × Consciousness_Multiplier / (1 + r_adjusted)^t]
              <br />
              Consciousness Multiplier = 1.0 + (Hawkins - 100) / 1000
            </code>
          </GlassCard>

          <p className="mb-4 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Top Impact Returns</p>
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
            <p className="mb-4 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Hawkins Consciousness Zones</p>
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
            <p className="mb-3 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Calculate Your Own</p>
            <p className="mb-4 leading-relaxed text-foreground/80">
              Use the interactive SoulScore engine to calculate Consciousness-Adjusted NPV for any
              entity. See what happens when consciousness enters the discount rate.
            </p>
            <ComingSoonLink label="Launch C-NPV Calculator" />
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
