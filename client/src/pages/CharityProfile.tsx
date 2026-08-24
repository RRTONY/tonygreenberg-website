import { useMemo } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, ExternalLink, Award, BarChart3, Eye, EyeOff, Shield, Users, Star, TrendingUp, Lightbulb, MapPin, Calendar, DollarSign, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import {
  CHARITIES, SCORE_DIMENSIONS,
  type Charity, type CloakStatus, type Grade,
} from "@/data/charityData";

/* ─── GRADE BADGE ─── */
function GradeBadge({ grade, size = "lg" }: { grade: Grade; size?: "sm" | "lg" }) {
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
    ? "px-4 py-2 text-2xl font-bold"
    : "px-2 py-0.5 text-xs font-bold";
  return (
    <span className={`inline-flex items-center rounded border font-mono ${colors[grade] || "bg-gray-50 text-gray-600 border-gray-200"} ${cls}`}>
      {grade}
    </span>
  );
}

/* ─── CLOAK BADGE ─── */
function CloakBadge({ status }: { status: CloakStatus }) {
  const config: Record<CloakStatus, { icon: typeof Eye; label: string; cls: string; desc: string }> = {
    clear: { icon: Eye, label: "Clear", cls: "text-emerald-600 bg-emerald-50 border-emerald-200", desc: "Full transparency. Open data. Nothing hidden." },
    "mostly-clear": { icon: Eye, label: "Mostly Clear", cls: "text-blue-600 bg-blue-50 border-blue-200", desc: "Good disclosure with minor gaps." },
    hazy: { icon: EyeOff, label: "Hazy", cls: "text-amber-600 bg-amber-50 border-amber-200", desc: "Significant information gaps." },
    opaque: { icon: EyeOff, label: "Opaque", cls: "text-red-600 bg-red-50 border-red-200", desc: "Material information withheld." },
  };
  const { icon: Icon, label, cls, desc } = config[status];
  return (
<div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${cls}`}>
      <Icon className="w-5 h-5" />
      <div>
        <span className="font-semibold text-sm">{label}</span>
        <p className="text-xs opacity-80">{desc}</p>
      </div>
    </div>
  );
}

/* ─── RADAR CHART (SVG) ─── */
function RadarChart({ scores }: { scores: Charity["scores"] }) {
  const dims = SCORE_DIMENSIONS;
  const cx = 150, cy = 150, r = 120;
  const n = dims.length;

  const getPoint = (i: number, value: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const dist = (value / 100) * r;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  };

  // Grid rings
  const rings = [20, 40, 60, 80, 100];

  // Data polygon
  const dataPoints = dims.map((d, i) => getPoint(i, scores[d.key]));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[320px] mx-auto">
      {/* Grid rings */}
      {rings.map(val => {
        const pts = dims.map((_, i) => getPoint(i, val));
        const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
        return <path key={val} d={path} fill="none" stroke="oklch(0.85 0.06 80)" strokeWidth="0.5" opacity="0.5" />;
      })}

      {/* Axis lines */}
      {dims.map((_, i) => {
        const p = getPoint(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="oklch(0.85 0.06 80)" strokeWidth="0.5" opacity="0.5" />;
      })}

      {/* Data polygon */}
      <path d={dataPath} fill="oklch(0.55 0.12 80 / 0.15)" stroke="oklch(0.55 0.12 80)" strokeWidth="2" />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="oklch(0.55 0.12 80)" stroke="white" strokeWidth="2" />
      ))}

      {/* Labels */}
      {dims.map((d, i) => {
        const p = getPoint(i, 115);
        const anchor = p.x < cx - 10 ? "end" : p.x > cx + 10 ? "start" : "middle";
        return (
          <text key={d.key} x={p.x} y={p.y} textAnchor={anchor} dominantBaseline="middle" className="text-[9px] fill-current text-muted-foreground" fontFamily="'DM Mono', monospace">
            {d.label.split(" ").slice(0, 2).join(" ")}
          </text>
        );
      })}
    </svg>
  );
}

/* ─── SCORE BAR ─── */
function ScoreBar({ score, label, weight }: { score: number; label: string; weight: number }) {
  const color = score >= 90 ? "bg-emerald-500" : score >= 80 ? "bg-blue-500" : score >= 70 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{weight}%</span>
          <span className="font-mono font-bold text-sm">{score}</span>
        </div>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function CharityProfile() {
  const { slug } = useParams<{ slug: string }>();
  const charity = CHARITIES.find(c => c.slug === slug);
  const rank = charity ? CHARITIES.indexOf(charity) + 1 : 0;

  // Find similar charities (same sector, excluding self)
  const similar = useMemo(() => {
    if (!charity) return [];
    return CHARITIES
      .filter(c => c.sector === charity.sector && c.slug !== charity.slug)
      .slice(0, 5);
  }, [charity]);

  if (!charity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Charity Not Found</h1>
          <p className="text-muted-foreground mb-6">The charity you're looking for isn't in our index.</p>
          <Link href="/charity-scorecard">
            <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Index</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-ink via-dark-bg to-ink py-12 md:py-16">
        <div className="container max-w-5xl mx-auto px-4">
          <Link href="/charity-scorecard">
            <button className="flex items-center gap-1.5 text-parchment/60 hover:text-gold text-sm mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Index
            </button>
          </Link>

          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-1">
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-gold mb-2">
                Rank #{rank} of {CHARITIES.length}
              </p>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-parchment mb-3" style={{ textWrap: "balance" }}>
                {charity.name}
              </h1>
              <p className="text-lg text-parchment/80 mb-4" style={{ textWrap: "pretty" }}>{charity.tagline}</p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs px-2.5 py-1 rounded-full bg-parchment/10 text-parchment/70 border border-parchment/20">{charity.sector}</span>
                <CloakBadge status={charity.cloakStatus} />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <GradeBadge grade={charity.grade} size="lg" />
              <span className="font-mono text-3xl font-bold text-gold">{charity.totalScore}</span>
              <span className="text-xs text-parchment/50 uppercase tracking-wide">Unified Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Radar + Score Breakdown */}
          <div>
            <h2 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gold" /> Score Profile
            </h2>
            <div className="border border-border rounded-lg p-6 bg-card mb-6">
              <RadarChart scores={charity.scores} />
            </div>
            <div className="space-y-4">
              {SCORE_DIMENSIONS.map(d => (
                <ScoreBar key={d.key} score={charity.scores[d.key]} label={d.label} weight={d.weight} />
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Quick Facts */}
            <div>
              <h2 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-gold" /> Quick Facts
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: TrendingUp, label: "Impact Metric", value: charity.impactMetric },
                  { icon: Users, label: "Beneficiaries", value: charity.beneficiaries },
                  { icon: DollarSign, label: "Annual Donations", value: `$${charity.donationsM}M` },
                  { icon: Calendar, label: "Founded", value: String(charity.founded) },
                  { icon: MapPin, label: "Headquarters", value: charity.hq },
                  { icon: Globe, label: "Website", value: new URL(charity.website).hostname },
                ].map(f => (
                  <div key={f.label} className="border border-border rounded-lg p-3 bg-card">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      <f.icon className="w-3.5 h-3.5" />
                      <span className="text-xs">{f.label}</span>
                    </div>
                    <p className="font-medium text-sm">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* External Ratings */}
            <div>
              <h2 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-gold" /> External Ratings
              </h2>
              <div className="border border-border rounded-lg p-4 bg-card space-y-3">
                {charity.givewell && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">GiveWell</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${charity.givewell === "top" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"}`}>
                      {charity.givewell === "top" ? "Top Charity" : "Standout Charity"}
                    </span>
                  </div>
                )}
                {charity.cnStars !== null && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Charity Navigator</span>
                    <span className="text-sm font-bold">{charity.cnStars} / 4 Stars</span>
                  </div>
                )}
                {charity.charityWatch && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CharityWatch</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${charity.charityWatch.startsWith("A") ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                      {charity.charityWatch}
                    </span>
                  </div>
                )}
                {charity.candidSeal && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Candid Seal</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded capitalize ${charity.candidSeal === "platinum" ? "bg-purple-100 text-purple-800" : "bg-amber-100 text-amber-800"}`}>
                      {charity.candidSeal}
                    </span>
                  </div>
                )}
                {!charity.givewell && charity.cnStars === null && !charity.charityWatch && !charity.candidSeal && (
                  <p className="text-sm text-muted-foreground italic">Not rated by major evaluators</p>
                )}
              </div>
            </div>

            {/* Visit */}
            <a href={charity.website} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-gold hover:bg-gold-light text-ink font-semibold">
                <ExternalLink className="w-4 h-4 mr-2" /> Visit {charity.name}
              </Button>
            </a>
          </div>
        </div>

        {/* Similar Charities */}
        {similar.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="font-serif text-xl font-bold mb-4">Other {charity.sector} Charities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {similar.map(c => {
                const cRank = CHARITIES.indexOf(c) + 1;
                return (
                  <Link key={c.slug} href={`/charity-scorecard/${c.slug}`}>
      <SEO
        title="Charity Profile"
        description="Deep-dive profiles on charitable organizations vetted through Tony Greenberg's impact framework."
        path="/charity-profile"
        keywords="Tony Greenberg, charity, impact, philanthropy, vetting"
        indexable={true}
      />
                    <div className="border border-border rounded-lg p-4 bg-card hover:shadow-md hover:border-gold/30 transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs text-muted-foreground">#{cRank}</span>
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded border font-mono ${
                          c.grade.startsWith("A") ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          c.grade.startsWith("B") ? "bg-blue-50 text-blue-700 border-blue-200" :
                          "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>{c.grade}</span>
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{c.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{c.tagline}</p>
                      <div className="mt-2 font-mono text-sm font-bold text-gold">{c.totalScore}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
