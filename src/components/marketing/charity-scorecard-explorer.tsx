"use client";

import { ForwardIcon } from "@/components/ui/inline-icons";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Shield,
  Eye,
  Award,
  Star,
  TrendingUp,
  BarChart3,
  Users,
  Lightbulb,
  Scale,
  Info,
  type LucideIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CHARITIES,
  ALL_SECTORS,
  SCORE_DIMENSIONS,
  EVALUATORS,
  type Sector,
} from "@/lib/content/charity-data";
import {
  GradeBadge,
  CloakBadge,
  ScoreBar,
  EvaluatorBadges,
} from "@/components/marketing/charity-badges";

// Ported from legacy client/src/pages/CharityScorecard.tsx. Real content,
// unchanged — 98 real named charities, 3 tabs (Rankings/Scorecard/
// Evaluators), search/filter/sort/expand. No backend dependency at all in
// the legacy source (fully client-side data), so this ports directly.

type Tab = "rankings" | "scorecard" | "evaluators";

export function CharityScorecardExplorer() {
  const [tab, setTab] = useState<Tab>("rankings");

  return (
    <div>
      <nav className="sticky top-14 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl gap-0 px-4">
          {(
            [
              { id: "rankings" as Tab, label: "Rankings", icon: TrendingUp },
              { id: "scorecard" as Tab, label: "Scorecard", icon: BarChart3 },
              { id: "evaluators" as Tab, label: "Evaluators", icon: Scale },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "border-brand-gold text-brand-gold"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              <t.icon className="size-4" />
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* All three tabs render always — Scorecard and Evaluators hold real,
          substantial content (dimension descriptions, evaluator profiles)
          that needs to exist in the raw SSR HTML for crawlers, not just
          after a click. Toggled via `hidden` rather than conditional
          unmounting, matching the site's accordion-crawlability rule (see
          peptide-watch's fraud patterns/role checklists). */}
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className={tab === "rankings" ? "" : "hidden"}>
          <RankingsTab />
        </div>
        <div className={tab === "scorecard" ? "" : "hidden"}>
          <ScorecardTab />
        </div>
        <div className={tab === "evaluators" ? "" : "hidden"}>
          <EvaluatorsTab />
        </div>
      </div>
    </div>
  );
}

type SortKey = "rank" | "name" | "totalScore" | "sector";
type SortDir = "asc" | "desc";

function RankingsTab() {
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState<Sector | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showCount, setShowCount] = useState(25);

  const filtered = useMemo(() => {
    let list = [...CHARITIES];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.sector.toLowerCase().includes(q) ||
          c.tagline.toLowerCase().includes(q),
      );
    }
    if (sectorFilter !== "all") {
      list = list.filter((c) => c.sector === sectorFilter);
    }
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "rank":
        case "totalScore":
          cmp = b.totalScore - a.totalScore;
          break;
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "sector":
          cmp = a.sector.localeCompare(b.sector);
          break;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });
    return list;
  }, [search, sectorFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "name" || key === "sector" ? "asc" : "desc");
    }
  };

  const sortIcon = (k: SortKey) => {
    if (sortKey !== k) return <ArrowUpDown className="size-3 opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp className="size-3" />
    ) : (
      <ChevronDown className="size-3" />
    );
  };

  const displayed = filtered.slice(0, showCount);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search charities, sectors, missions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Filter className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value as Sector | "all")}
            className="min-w-45 cursor-pointer appearance-none rounded-md border border-border bg-background py-2 pr-8 pl-10 text-sm"
          >
            <option value="all">All Sectors ({CHARITIES.length})</option>
            {ALL_SECTORS.map((s) => (
              <option key={s} value={s}>
                {s} ({CHARITIES.filter((c) => c.sector === s).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        Showing {displayed.length} of {filtered.length} charities
        {sectorFilter !== "all" && (
          <span>
            {" "}
            in <strong>{sectorFilter}</strong>
          </span>
        )}
        {search && (
          <span>
            {" "}
            matching &quot;<strong>{search}</strong>&quot;
          </span>
        )}
      </p>

      <div className="overflow-hidden rounded-lg border border-border">
        <div className="hidden grid-cols-[60px_1fr_100px_140px_100px] bg-muted/50 text-xs font-medium tracking-wide text-muted-foreground uppercase md:grid">
          <button
            onClick={() => toggleSort("rank")}
            className="flex items-center gap-1 px-3 py-3 transition-colors hover:text-foreground"
          >
            # {sortIcon("rank")}
          </button>
          <button
            onClick={() => toggleSort("name")}
            className="flex items-center gap-1 px-3 py-3 transition-colors hover:text-foreground"
          >
            Charity {sortIcon("name")}
          </button>
          <button
            onClick={() => toggleSort("totalScore")}
            className="flex items-center justify-end gap-1 px-3 py-3 transition-colors hover:text-foreground"
          >
            Score {sortIcon("totalScore")}
          </button>
          <button
            onClick={() => toggleSort("sector")}
            className="flex items-center gap-1 px-3 py-3 transition-colors hover:text-foreground"
          >
            Sector {sortIcon("sector")}
          </button>
          <div className="px-3 py-3 text-center">Cloak</div>
        </div>

        {displayed.map((c, i) => {
          const rank = CHARITIES.indexOf(c) + 1;
          const isExpanded = expanded === c.slug;
          return (
            <div
              key={c.slug}
              className={`border-t border-border ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : c.slug)}
                className="grid w-full grid-cols-[1fr_auto] items-center text-left transition-colors hover:bg-muted/40 md:grid-cols-[60px_1fr_100px_140px_100px]"
              >
                <span className="hidden px-3 py-3 font-mono text-sm text-muted-foreground md:block">
                  {rank}
                </span>
                <div className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground md:hidden">
                      #{rank}
                    </span>
                    <span className="text-sm font-medium">{c.name}</span>
                    <GradeBadge grade={c.grade} />
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{c.tagline}</p>
                </div>
                <div className="hidden justify-end px-3 py-3 md:flex">
                  <span className="font-mono text-sm font-bold">{c.totalScore}</span>
                </div>
                <div className="hidden px-3 py-3 md:block">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {c.sector}
                  </span>
                </div>
                <div className="hidden justify-center px-3 py-3 md:flex">
                  <CloakBadge status={c.cloakStatus} />
                </div>
                <div className="flex items-center gap-2 px-3 py-3 md:hidden">
                  <span className="font-mono text-sm font-bold">{c.totalScore}</span>
                  {isExpanded ? (
                    <ChevronUp className="size-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="size-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-border/50 bg-card px-4 pt-2 pb-4">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="flex items-center gap-1.5 text-sm font-semibold">
                        <BarChart3 className="size-4 text-brand-gold" /> Score Breakdown
                      </h4>
                      {SCORE_DIMENSIONS.map((d) => (
                        <ScoreBar
                          key={d.key}
                          score={c.scores[d.key]}
                          label={d.label}
                          weight={d.weight}
                        />
                      ))}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                          <Award className="size-4 text-brand-gold" /> External Ratings
                        </h4>
                        <EvaluatorBadges charity={c} />
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-xs text-muted-foreground">Impact Metric</span>
                          <p className="font-medium">{c.impactMetric}</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Beneficiaries</span>
                          <p className="font-medium">{c.beneficiaries}</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Annual Donations</span>
                          <p className="font-medium">${c.donationsM}M</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Founded</span>
                          <p className="font-medium">
                            {c.founded} · {c.hq}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CloakBadge status={c.cloakStatus} />
                        <span>·</span>
                        <span>{c.sector}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Link href={`/charity-scorecard/${c.slug}`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            Full Profile <ForwardIcon aria-hidden="true" />
                          </Button>
                        </Link>
                        <a href={c.website} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm" className="text-xs">
                            <ExternalLink className="mr-1 size-3" /> Website
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showCount < filtered.length && (
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => setShowCount((s) => s + 25)}>
            Show More ({filtered.length - showCount} remaining)
          </Button>
        </div>
      )}
    </div>
  );
}

const DIMENSION_ICONS: LucideIcon[] = [TrendingUp, Eye, Award, Lightbulb, Shield, Users, Star];

function ScorecardTab() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="mb-4 font-heading text-2xl font-bold md:text-3xl">
          The Unified Impact Scorecard
        </h2>
        <p className="mb-4 leading-relaxed text-muted-foreground">
          Existing charity evaluators each measure one slice of the picture. Charity Navigator
          checks the books. GiveWell checks the evidence. CharityWatch checks efficiency. Candid
          checks transparency. None of them ask the full question:{" "}
          <em>did the money actually change lives, and can you prove it?</em>
        </p>
        <p className="leading-relaxed text-muted-foreground">
          The Grand Impact Accountability Index unifies all eight evaluators into a single weighted
          framework with seven dimensions. Every charity gets one score, one grade, and one
          Cloak-vs-Clear rating. No more cross-referencing four websites to figure out if your
          donation matters.
        </p>
      </div>

      <div className="space-y-6">
        {SCORE_DIMENSIONS.map((d, i) => {
          const Icon = DIMENSION_ICONS[i] ?? Info;
          return (
            <div key={d.key} className="rounded-lg border border-border bg-card p-5">
              <div className="mb-3 flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-gold/10">
                  <Icon className="size-5 text-brand-gold" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-baseline gap-2">
                    <h3 className="text-base font-semibold">{d.label}</h3>
                    <span className="font-mono text-xs font-bold text-brand-gold">{d.weight}%</span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{d.description}</p>
                </div>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-brand-gold"
                  style={{ width: `${d.weight * 4}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 rounded-lg border border-border bg-card p-6">
        <h3 className="mb-3 flex items-center gap-2 font-heading text-xl font-bold">
          <Shield className="size-5 text-brand-gold" /> The Cloak-vs-Clear Score
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          Our proprietary transparency metric goes beyond what charities disclose voluntarily. We
          run Benford&apos;s Law analysis on financial reports, check for accessibility of impact
          data, audit disclosure completeness, and flag organizations that obscure what matters.
          Every charity gets one of four ratings:
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { status: "clear" as const, desc: "Full transparency. Open data. Nothing hidden." },
            { status: "mostly-clear" as const, desc: "Good disclosure with minor gaps." },
            { status: "hazy" as const, desc: "Significant information gaps." },
            { status: "opaque" as const, desc: "Material information withheld." },
          ].map((s) => (
            <div key={s.status} className="rounded-lg bg-muted/50 p-3 text-center">
              <CloakBadge status={s.status} />
              <p className="mt-1.5 text-xs text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-card p-6">
        <h3 className="mb-3 font-heading text-xl font-bold">Grading Scale</h3>
        <div className="flex flex-wrap gap-2">
          {(["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"] as const).map((g) => (
            <GradeBadge key={g} grade={g} />
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Grades are computed from the weighted total score: A+ (97+), A (93–96), A- (90–92), B+
          (87–89), B (83–86), B- (80–82), C+ (77–79), C (73–76), C- (70–72), D (60–69), F (&lt;60).
        </p>
      </div>
    </div>
  );
}

function EvaluatorsTab() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="mb-4 font-heading text-2xl font-bold md:text-3xl">
          The Evaluator Landscape
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Eight organizations currently evaluate charities. Each one does something valuable. None
          of them does everything. Here is what each measures, what it misses, and why a unified
          framework was necessary.
        </p>
      </div>

      <div className="space-y-4">
        {EVALUATORS.map((ev, i) => (
          <div
            key={ev.name}
            className="rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-sm"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-brand-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-semibold">{ev.name}</h3>
                  <a
                    href={ev.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-brand-gold"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
                <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
                  <div>
                    <span className="text-xs tracking-wide text-muted-foreground uppercase">
                      Focus
                    </span>
                    <p className="font-medium">{ev.focus}</p>
                  </div>
                  <div>
                    <span className="text-xs tracking-wide text-muted-foreground uppercase">
                      Metric
                    </span>
                    <p className="font-medium">{ev.metric}</p>
                  </div>
                  <div>
                    <span className="text-xs tracking-wide text-muted-foreground uppercase">
                      Coverage
                    </span>
                    <p className="font-medium">{ev.charityCount} charities</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 rounded border border-destructive/10 bg-destructive/5 px-3 py-2 text-sm text-destructive/80">
              <strong className="text-destructive">Gap:</strong> {ev.limitation}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-lg border-2 border-brand-gold/30 bg-brand-gold/5 p-6">
        <h3 className="mb-3 font-heading text-xl font-bold text-brand-gold">Why One Framework?</h3>
        <p className="text-sm leading-relaxed">
          A donor checking Charity Navigator sees financial health. The same donor checking GiveWell
          sees cost-effectiveness. CharityWatch shows efficiency. Candid shows transparency. But
          nobody shows all four together, weighted by what actually matters for impact. The Grand
          Impact Accountability Index does. One score. One grade. One Cloak-vs-Clear rating. No more
          tab-switching. No more guessing.
        </p>
      </div>
    </div>
  );
}
