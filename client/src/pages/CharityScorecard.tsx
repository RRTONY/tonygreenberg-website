import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Search, Filter, ArrowUpDown, ChevronDown, ChevronUp, ExternalLink, Shield, Eye, EyeOff, Award, Star, TrendingUp, BarChart3, Users, Lightbulb, Scale, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import {
  CHARITIES, STATS, ALL_SECTORS, SCORE_DIMENSIONS, EVALUATORS,
  type Charity, type Sector, type CloakStatus, type Grade,
} from "@/data/charityData";

/* ─── GRADE BADGE ─── */
function GradeBadge({ grade, size = "sm" }: { grade: Grade; size?: "sm" | "lg" }) {
  const colors: Record<string, string> = {
    "A+": "bg-emerald-100 text-emerald-800 border-emerald-300",
    "A": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "A-": "bg-green-50 text-green-700 border-green-200",
    "B+": "bg-blue-50 text-blue-700 border-blue-200",
    "B": "bg-blue-50 text-blue-600 border-blue-200",
    "B-": "bg-sky-50 text-sky-700 border-sky-200",
    "C+": "bg-amber-50 text-amber-700 border-amber-200",
    "C": "bg-amber-50 text-amber-600 border-amber-200",
    "C-": "bg-orange-50 text-orange-700 border-orange-200",
    "D": "bg-red-50 text-red-600 border-red-200",
    "F": "bg-red-100 text-red-800 border-red-300",
  };
  const cls = size === "lg"
    ? "px-3 py-1.5 text-lg font-bold"
    : "px-2 py-0.5 text-xs font-bold";
  return (
    <span className={`inline-flex items-center rounded border font-mono ${colors[grade] || "bg-gray-50 text-gray-600 border-gray-200"} ${cls}`}>
      {grade}
    </span>
  );
}

/* ─── CLOAK STATUS ─── */
function CloakBadge({ status }: { status: CloakStatus }) {
  const config: Record<CloakStatus, { icon: typeof Eye; label: string; cls: string }> = {
    clear: { icon: Eye, label: "Clear", cls: "text-emerald-600" },
    "mostly-clear": { icon: Eye, label: "Mostly Clear", cls: "text-blue-600" },
    hazy: { icon: EyeOff, label: "Hazy", cls: "text-amber-600" },
    opaque: { icon: EyeOff, label: "Opaque", cls: "text-red-600" },
  };
  const { icon: Icon, label, cls } = config[status];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${cls}`}>
      <Icon className="w-3 h-3" /> {label}
    </span>
  );
}

/* ─── SCORE BAR ─── */
function ScoreBar({ score, label, weight }: { score: number; label: string; weight: number }) {
  const color = score >= 90 ? "bg-emerald-500" : score >= 80 ? "bg-blue-500" : score >= 70 ? "bg-amber-500" : "bg-red-500";
  return (
<div className="space-y-1">
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{weight}% weight · <span className="font-mono font-bold">{score}</span>/100</span>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

/* ─── EVALUATOR BADGES ─── */
function EvaluatorBadges({ charity }: { charity: Charity }) {
  const badges: { label: string; value: string; cls: string }[] = [];
  if (charity.givewell) badges.push({ label: "GiveWell", value: charity.givewell === "top" ? "Top" : "Standout", cls: charity.givewell === "top" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800" });
  if (charity.cnStars) badges.push({ label: "CN", value: `${charity.cnStars}★`, cls: charity.cnStars >= 4 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800" });
  if (charity.charityWatch) badges.push({ label: "CW", value: charity.charityWatch, cls: charity.charityWatch.startsWith("A") ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800" });
  if (charity.candidSeal) badges.push({ label: "Candid", value: charity.candidSeal.charAt(0).toUpperCase() + charity.candidSeal.slice(1), cls: charity.candidSeal === "platinum" ? "bg-purple-100 text-purple-800" : "bg-amber-100 text-amber-800" });
  if (badges.length === 0) return <span className="text-xs text-muted-foreground italic">Not rated</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {badges.map(b => (
        <span key={b.label} className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${b.cls}`}>
          {b.label}: {b.value}
        </span>
      ))}
    </div>
  );
}

/* ─── TABS ─── */
type Tab = "rankings" | "scorecard" | "evaluators";

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function CharityScorecard() {
  const [tab, setTab] = useState<Tab>("rankings");

  return (
    <div className="min-h-screen bg-background">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-dark-bg to-ink py-16 md:py-24">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, oklch(0.55 0.12 80 / 0.3), transparent 50%), radial-gradient(circle at 80% 20%, oklch(0.55 0.12 80 / 0.2), transparent 40%)" }} />
        <div className="container relative z-10 max-w-5xl mx-auto px-4">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-gold mb-4">The Grand Impact Accountability Index</p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-parchment leading-tight mb-6" style={{ textWrap: "balance" }}>
            Where Does Your Dollar<br className="hidden md:block" /> Actually Go?
          </h1>
          <p className="text-lg md:text-xl text-parchment/80 max-w-2xl leading-relaxed mb-4" style={{ textWrap: "pretty" }}>
            One hundred charities. Eight existing scorecards unified. Seven new dimensions measured. The first accountability framework that asks the question every donor deserves answered: <em className="text-gold">what actually happened with my money?</em>
          </p>

          {/* ─── CONTEXTUAL INTRO: What / Why / What To Do ─── */}
          <div className="bg-parchment/5 border border-parchment/10 rounded-lg p-5 max-w-2xl mb-8 backdrop-blur-sm">
            <p className="text-sm text-parchment/70 leading-relaxed mb-3">
              <strong className="text-gold">What you're looking at:</strong> An aggregate scorecard that unifies GiveWell, Charity Navigator, CharityWatch, and Candid ratings with seven proprietary dimensions — including Cloak Score (transparency), Innovation, and Lived-Experience Leadership — into a single composite grade for each charity.
            </p>
            <p className="text-sm text-parchment/70 leading-relaxed mb-3">
              <strong className="text-gold">Why it matters:</strong> No single evaluator tells the whole story. Some measure efficiency but ignore impact. Others track outcomes but miss governance. This scorecard cross-references all of them so you can see where the consensus is — and where it breaks down.
            </p>
            <p className="text-sm text-parchment/70 leading-relaxed">
              <strong className="text-gold">What to do with it:</strong> Use the <em>Rankings</em> tab to compare charities by composite score. Switch to <em>Scorecard</em> to see how the seven dimensions are weighted. Check <em>Evaluators</em> to understand whose ratings feed the model. Click any charity to see its full breakdown.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            {[
              { label: "Charities Scored", value: STATS.totalCharities.toString() },
              { label: "Average Score", value: STATS.avgScore.toString() },
              { label: "A-Tier Charities", value: STATS.aTierCount.toString() },
              { label: "Opacity Warnings", value: STATS.opacityWarnings.toString() },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold font-mono text-gold">{s.value}</div>
                <div className="text-parchment/60 text-xs tracking-wide uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TAB NAV ─── */}
      <nav className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="container max-w-5xl mx-auto px-4 flex gap-0">
          {([
            { id: "rankings" as Tab, label: "Rankings", icon: TrendingUp },
            { id: "scorecard" as Tab, label: "Scorecard", icon: BarChart3 },
            { id: "evaluators" as Tab, label: "Evaluators", icon: Scale },
          ]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? "border-gold text-gold"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ─── TAB CONTENT ─── */}
      <div className="container max-w-5xl mx-auto px-4 py-8">
        {tab === "rankings" && <RankingsTab />}
        {tab === "scorecard" && <ScorecardTab />}
        {tab === "evaluators" && <EvaluatorsTab />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   RANKINGS TAB
   ═══════════════════════════════════════════════════════════════════ */
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
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.sector.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q));
    }
    if (sectorFilter !== "all") {
      list = list.filter(c => c.sector === sectorFilter);
    }
    // Sort
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "rank": cmp = b.totalScore - a.totalScore; break;
        case "name": cmp = a.name.localeCompare(b.name); break;
        case "totalScore": cmp = b.totalScore - a.totalScore; break;
        case "sector": cmp = a.sector.localeCompare(b.sector); break;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });
    return list;
  }, [search, sectorFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir(key === "name" || key === "sector" ? "asc" : "desc"); }
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  };

  const displayed = filtered.slice(0, showCount);

  return (
    <div>
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search charities, sectors, missions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            value={sectorFilter}
            onChange={e => setSectorFilter(e.target.value as Sector | "all")}
            className="pl-10 pr-8 py-2 border border-border rounded-md bg-background text-sm appearance-none cursor-pointer min-w-[180px]"
          >
            <option value="all">All Sectors ({CHARITIES.length})</option>
            {ALL_SECTORS.map(s => (
              <option key={s} value={s}>{s} ({CHARITIES.filter(c => c.sector === s).length})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing {displayed.length} of {filtered.length} charities
        {sectorFilter !== "all" && <span> in <strong>{sectorFilter}</strong></span>}
        {search && <span> matching "<strong>{search}</strong>"</span>}
      </p>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="hidden md:grid grid-cols-[60px_1fr_100px_140px_100px] bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <button onClick={() => toggleSort("rank")} className="flex items-center gap-1 px-3 py-3 hover:text-foreground transition-colors">
            # <SortIcon k="rank" />
          </button>
          <button onClick={() => toggleSort("name")} className="flex items-center gap-1 px-3 py-3 hover:text-foreground transition-colors">
            Charity <SortIcon k="name" />
          </button>
          <button onClick={() => toggleSort("totalScore")} className="flex items-center gap-1 px-3 py-3 hover:text-foreground transition-colors justify-end">
            Score <SortIcon k="totalScore" />
          </button>
          <button onClick={() => toggleSort("sector")} className="flex items-center gap-1 px-3 py-3 hover:text-foreground transition-colors">
            Sector <SortIcon k="sector" />
          </button>
          <div className="px-3 py-3 text-center">Cloak</div>
        </div>

        {/* Rows */}
        {displayed.map((c, i) => {
          const rank = CHARITIES.indexOf(c) + 1;
          const isExpanded = expanded === c.slug;
          return (
            <div key={c.slug} className={`border-t border-border ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}>
              {/* Main row */}
              <button
                onClick={() => setExpanded(isExpanded ? null : c.slug)}
                className="w-full grid grid-cols-[1fr_auto] md:grid-cols-[60px_1fr_100px_140px_100px] items-center text-left hover:bg-muted/40 transition-colors"
              >
                <span className="hidden md:block px-3 py-3 font-mono text-sm text-muted-foreground">
                  {rank}
                </span>
                <div className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className="md:hidden font-mono text-xs text-muted-foreground">#{rank}</span>
                    <span className="font-medium text-sm">{c.name}</span>
                    <GradeBadge grade={c.grade} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{c.tagline}</p>
                </div>
                <div className="hidden md:flex justify-end px-3 py-3">
                  <span className="font-mono font-bold text-sm">{c.totalScore}</span>
                </div>
                <div className="hidden md:block px-3 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{c.sector}</span>
                </div>
                <div className="hidden md:flex justify-center px-3 py-3">
                  <CloakBadge status={c.cloakStatus} />
                </div>
                <div className="flex items-center gap-2 px-3 py-3 md:hidden">
                  <span className="font-mono font-bold text-sm">{c.totalScore}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 bg-card border-t border-border/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Score breakdown */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold flex items-center gap-1.5">
                        <BarChart3 className="w-4 h-4 text-gold" /> Score Breakdown
                      </h4>
                      {SCORE_DIMENSIONS.map(d => (
                        <ScoreBar key={d.key} score={c.scores[d.key]} label={d.label} weight={d.weight} />
                      ))}
                    </div>
                    {/* Right: Details */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-2">
                          <Award className="w-4 h-4 text-gold" /> External Ratings
                        </h4>
                        <EvaluatorBadges charity={c} />
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground text-xs">Impact Metric</span>
                          <p className="font-medium">{c.impactMetric}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Beneficiaries</span>
                          <p className="font-medium">{c.beneficiaries}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Annual Donations</span>
                          <p className="font-medium">${c.donationsM}M</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">Founded</span>
                          <p className="font-medium">{c.founded} · {c.hq}</p>
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
                            Full Profile →
                          </Button>
                        </Link>
                        <a href={c.website} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm" className="text-xs">
                            <ExternalLink className="w-3 h-3 mr-1" /> Website
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

      {/* Load more */}
      {showCount < filtered.length && (
        <div className="text-center mt-6">
          <Button variant="outline" onClick={() => setShowCount(s => s + 25)}>
            Show More ({filtered.length - showCount} remaining)
          </Button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SCORECARD TAB
   ═══════════════════════════════════════════════════════════════════ */
function ScorecardTab() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">The Unified Impact Scorecard</h2>
        <p className="text-muted-foreground leading-relaxed mb-4" style={{ textWrap: "pretty" }}>
          Existing charity evaluators each measure one slice of the picture. Charity Navigator checks the books. GiveWell checks the evidence. CharityWatch checks efficiency. Candid checks transparency. None of them ask the full question: <em>did the money actually change lives, and can you prove it?</em>
        </p>
        <p className="text-muted-foreground leading-relaxed" style={{ textWrap: "pretty" }}>
          The Grand Impact Accountability Index unifies all eight evaluators into a single weighted framework with seven dimensions. Every charity gets one score, one grade, and one Cloak-vs-Clear rating. No more cross-referencing four websites to figure out if your donation matters.
        </p>
      </div>

      {/* Dimensions */}
      <div className="space-y-6">
        {SCORE_DIMENSIONS.map((d, i) => {
          const icons = [TrendingUp, Eye, Award, Lightbulb, Shield, Users, Star];
          const Icon = icons[i] || Info;
          return (
            <div key={d.key} className="border border-border rounded-lg p-5 bg-card">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="font-semibold text-base">{d.label}</h3>
                    <span className="text-xs font-mono text-gold font-bold">{d.weight}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed" style={{ textWrap: "pretty" }}>{d.description}</p>
                </div>
              </div>
              {/* Weight bar */}
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gold rounded-full" style={{ width: `${d.weight * 4}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Cloak-vs-Clear */}
      <div className="mt-10 border border-border rounded-lg p-6 bg-card">
        <h3 className="font-serif text-xl font-bold mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5 text-gold" /> The Cloak-vs-Clear Score
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4" style={{ textWrap: "pretty" }}>
          Our proprietary transparency metric goes beyond what charities disclose voluntarily. We run Benford's Law analysis on financial reports, check for accessibility of impact data, audit disclosure completeness, and flag organizations that obscure what matters. Every charity gets one of four ratings:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {([
            { status: "clear" as CloakStatus, desc: "Full transparency. Open data. Nothing hidden." },
            { status: "mostly-clear" as CloakStatus, desc: "Good disclosure with minor gaps." },
            { status: "hazy" as CloakStatus, desc: "Significant information gaps." },
            { status: "opaque" as CloakStatus, desc: "Material information withheld." },
          ]).map(s => (
            <div key={s.status} className="text-center p-3 rounded-lg bg-muted/50">
              <CloakBadge status={s.status} />
              <p className="text-xs text-muted-foreground mt-1.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Grading Scale */}
      <div className="mt-8 border border-border rounded-lg p-6 bg-card">
        <h3 className="font-serif text-xl font-bold mb-3">Grading Scale</h3>
        <div className="flex flex-wrap gap-2">
          {(["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"] as Grade[]).map(g => (
            <GradeBadge key={g} grade={g} />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Grades are computed from the weighted total score: A+ (97+), A (93–96), A- (90–92), B+ (87–89), B (83–86), B- (80–82), C+ (77–79), C (73–76), C- (70–72), D (60–69), F (&lt;60).
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   EVALUATORS TAB
   ═══════════════════════════════════════════════════════════════════ */
function EvaluatorsTab() {
  return (
    <div className="max-w-4xl">
      <SEO
        title="Charity Scorecard"
        description="Transparency scores and impact metrics for charitable organizations."
        path="/charity-scorecard"
        keywords="Tony Greenberg, charity scorecard, nonprofit transparency, impact metrics"
        indexable={true}
      />
      <div className="mb-8">
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">The Evaluator Landscape</h2>
        <p className="text-muted-foreground leading-relaxed" style={{ textWrap: "pretty" }}>
          Eight organizations currently evaluate charities. Each one does something valuable. None of them does everything. Here is what each measures, what it misses, and why a unified framework was necessary.
        </p>
      </div>

      <div className="space-y-4">
        {EVALUATORS.map((ev, i) => (
          <div key={ev.name} className="border border-border rounded-lg p-5 bg-card hover:shadow-sm transition-shadow">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs text-gold font-bold">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-semibold">{ev.name}</h3>
                  <a href={ev.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-gold transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Focus</span>
                    <p className="font-medium">{ev.focus}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Metric</span>
                    <p className="font-medium">{ev.metric}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Coverage</span>
                    <p className="font-medium">{ev.charityCount} charities</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 px-3 py-2 bg-destructive/5 rounded text-sm text-destructive/80 border border-destructive/10">
              <strong className="text-destructive">Gap:</strong> {ev.limitation}
            </div>
          </div>
        ))}
      </div>

      {/* Why unified */}
      <div className="mt-10 border-2 border-gold/30 rounded-lg p-6 bg-gold/5">
        <h3 className="font-serif text-xl font-bold mb-3 text-gold">Why One Framework?</h3>
        <p className="text-sm leading-relaxed" style={{ textWrap: "pretty" }}>
          A donor checking Charity Navigator sees financial health. The same donor checking GiveWell sees cost-effectiveness. CharityWatch shows efficiency. Candid shows transparency. But nobody shows all four together, weighted by what actually matters for impact. The Grand Impact Accountability Index does. One score. One grade. One Cloak-vs-Clear rating. No more tab-switching. No more guessing.
        </p>
      </div>
    </div>
  );
}
