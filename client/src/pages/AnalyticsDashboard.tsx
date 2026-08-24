/**
 * AnalyticsDashboard — Owner-only analytics view.
 * Shows pageview data, top pages, daily trends, referrers, hourly distribution.
 * Uses the editorial broadsheet style.
 */
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import SEO from "@/components/SEO";

const PERIODS = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
  { label: "All time", days: 365 },
];

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

function BarChart({ data, labelKey, valueKey, maxBars = 25, color = "#8B6914" }: {
  data: any[];
  labelKey: string;
  valueKey: string;
  maxBars?: number;
  color?: string;
}) {
  const sliced = data.slice(0, maxBars);
  const maxVal = Math.max(...sliced.map(d => d[valueKey]), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {sliced.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.65rem",
            color: "#666",
            width: "200px",
            minWidth: "200px",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textAlign: "right",
          }}>
            {item[labelKey]}
          </div>
          <div style={{ flex: 1, background: "rgba(139,105,20,0.08)", borderRadius: "2px", height: "18px", position: "relative" }}>
            <div style={{
              width: `${(item[valueKey] / maxVal) * 100}%`,
              background: color,
              height: "100%",
              borderRadius: "2px",
              minWidth: "2px",
              transition: "width 0.3s ease",
            }} />
          </div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.65rem",
            color: "#333",
            width: "50px",
            minWidth: "50px",
            textAlign: "right",
            fontWeight: 700,
          }}>
            {formatNumber(item[valueKey])}
          </div>
        </div>
      ))}
    </div>
  );
}

function SparkLine({ data, width = 600, height = 120 }: { data: { date: string; views: number; sessions: number }[]; width?: number; height?: number }) {
  if (!data.length) return null;
  const maxViews = Math.max(...data.map(d => d.views), 1);
  const points = data.map((d, i) => ({
    x: (i / Math.max(data.length - 1, 1)) * width,
    y: height - (d.views / maxViews) * (height - 20) - 10,
  }));
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaD = pathD + ` L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto", maxHeight: "160px" }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B6914" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8B6914" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#areaGrad)" />
      <path d={pathD} fill="none" stroke="#8B6914" strokeWidth="2" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#8B6914" opacity="0.6" />
      ))}
    </svg>
  );
}

function HourlyHeatmap({ data }: { data: { hour: number; views: number }[] }) {
  const maxViews = Math.max(...data.map(d => d.views), 1);
  const hours = Array.from({ length: 24 }, (_, i) => {
    const found = data.find(d => d.hour === i);
    return { hour: i, views: found?.views || 0 };
  });

  return (
    <div style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "60px" }}>
      {hours.map(h => (
        <div key={h.hour} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
          <div style={{
            width: "100%",
            height: `${Math.max((h.views / maxViews) * 50, 2)}px`,
            background: h.views > 0 ? `rgba(139,105,20,${0.2 + (h.views / maxViews) * 0.8})` : "rgba(139,105,20,0.05)",
            borderRadius: "2px",
            transition: "height 0.3s ease",
          }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", color: "#999" }}>
            {h.hour}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState(1); // 30 days default
  const days = PERIODS[selectedPeriod].days;

  const { data, isLoading, error } = trpc.analytics.getDashboard.useQuery(
    { days },
    { enabled: !!user && user.role === "admin" }
  );

  const { data: shareData } = trpc.analytics.getShareDashboard.useQuery(
    { days },
    { enabled: !!user && user.role === "admin" }
  );

  // Category grouping
  const categoryData = useMemo(() => {
    if (!data?.topPages) return [];
    const categories: Record<string, { name: string; views: number; pages: number }> = {};
    data.topPages.forEach(p => {
      let cat = "Other";
      if (p.path === "/") cat = "Homepage";
      else if (p.path.startsWith("/blog/")) cat = "Blog Posts";
      else if (p.path.startsWith("/brewsoul")) cat = "BrewSoul";
      else if (p.path.includes("peptide") || p.path === "/quiz_25q" || p.path === "/supplier-intake") cat = "Peptide Ecosystem";
      else if (p.path.startsWith("/find-your") || p.path.startsWith("/find-my") || p.path.startsWith("/assessments") || p.path === "/soulscore" || p.path === "/life-assessment" || p.path === "/self-portrait") cat = "Assessments";
      else if (p.path.startsWith("/psychedelic") || p.path === "/peyote-mescaline") cat = "Psychedelic (PRI)";
      else if (["/about", "/start-here", "/walk-through", "/the-index", "/the-letter", "/the-territory", "/the-web", "/the-body", "/the-nightstand", "/the-open-door", "/published", "/series", "/journeys"].includes(p.path)) cat = "Core Pages";
      else if (["/ecosystem", "/amplifier", "/diamond-cut", "/invest", "/engine-room", "/intel", "/under-nda", "/clients", "/pick-up-the-phone"].includes(p.path)) cat = "Business & Commerce";
      if (!categories[cat]) categories[cat] = { name: cat, views: 0, pages: 0 };
      categories[cat].views += p.views;
      categories[cat].pages += 1;
    });
    return Object.values(categories).sort((a, b) => b.views - a.views);
  }, [data]);

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#FAFAF7", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "'DM Mono', monospace", color: "#888" }}>Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div style={{ minHeight: "100vh", background: "#FAFAF7", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#111" }}>Access Denied</h1>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#666", marginTop: "1rem" }}>This page is only available to the site owner.</p>
        </div>
      </div>
    );
  }

  const s = data?.summary;

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF7", padding: "2rem 1rem" }}>
      <SEO title="Analytics Dashboard" description="Site analytics and engagement metrics" />
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#8B6914", marginBottom: "0.25rem" }}>ANALYTICS</p>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", color: "#111", margin: 0 }}>The Numbers</h1>
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {PERIODS.map((p, i) => (
              <button
                key={i}
                onClick={() => setSelectedPeriod(i)}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  padding: "6px 12px",
                  border: "1px solid rgba(139,105,20,0.3)",
                  borderRadius: "4px",
                  background: i === selectedPeriod ? "#8B6914" : "transparent",
                  color: i === selectedPeriod ? "#fff" : "#8B6914",
                  cursor: "pointer",
                  textTransform: "uppercase",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <p style={{ fontFamily: "'DM Mono', monospace", color: "#888" }}>Loading analytics...</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#C84B2A" }}>Error loading analytics: {error.message}</p>
          </div>
        )}

        {data && s && (
          <>
            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
              {[
                { label: "Total Views", value: formatNumber(s.totalViews), sub: `${PERIODS[selectedPeriod].label}`, highlight: false },
                { label: "Unique Sessions", value: formatNumber(s.uniqueSessions), sub: `${((s.totalViews / Math.max(s.uniqueSessions, 1))).toFixed(1)} pages/session`, highlight: false },
                { label: "Avg Read Time", value: s.avgReadTimeSec > 0 ? `${s.avgReadTimeSec}s` : "—", sub: s.avgReadTimeSec > 0 ? "per page" : "tracking starting", highlight: false },
                { label: "Avg Scroll Depth", value: s.avgScrollDepth > 0 ? `${s.avgScrollDepth}%` : "—", sub: s.avgScrollDepth > 0 ? "of page" : "tracking starting", highlight: false },
              ].map((card, i) => (
                <div key={i} style={{
                  background: "#fff",
                  border: "1px solid rgba(139,105,20,0.15)",
                  borderRadius: "8px",
                  padding: "1.25rem",
                  textAlign: "center",
                }}>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B6914", marginBottom: "0.5rem" }}>{card.label}</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#111", margin: 0, lineHeight: 1 }}>{card.value}</p>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", color: "#999", marginTop: "0.25rem" }}>{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Engaged Visitor Panel — the metric that actually matters */}
            {(data as any).humanSummary && (
              <div style={{ background: "linear-gradient(135deg, rgba(45,74,30,0.06) 0%, rgba(250,250,247,1) 100%)", border: "1px solid rgba(45,74,30,0.2)", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#2D4A1E", marginBottom: "1rem" }}>ENGAGED VISITORS — HUMANS ONLY (bots excluded)</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
                  {[
                    {
                      label: "Human Views",
                      value: formatNumber((data as any).humanSummary.totalViews),
                      sub: `${Math.round(((data as any).humanSummary.totalViews / Math.max(s.totalViews, 1)) * 100)}% of total`,
                      color: "#2D4A1E",
                    },
                    {
                      label: "Engaged Sessions",
                      value: formatNumber((data as any).humanSummary.engagedSessions),
                      sub: `45s+ read or 50%+ scroll`,
                      color: "#2D4A1E",
                    },
                    {
                      label: "Engagement Rate",
                      value: (data as any).humanSummary.uniqueSessions > 0
                        ? `${Math.round(((data as any).humanSummary.engagedSessions / (data as any).humanSummary.uniqueSessions) * 100)}%`
                        : "—",
                      sub: "of human sessions",
                      color: "#2D4A1E",
                    },
                    {
                      label: "Second Page Rate",
                      value: `${(data as any).humanSummary.secondPageRate}%`,
                      sub: "visited 2+ pages",
                      color: "#2D4A1E",
                    },
                    {
                      label: "Bot Views Filtered",
                      value: formatNumber((data as any).humanSummary.botViews),
                      sub: "excluded from above",
                      color: "#999",
                    },
                  ].map((card, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase", color: card.color, marginBottom: "0.3rem", opacity: 0.8 }}>{card.label}</p>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.75rem", color: card.color, margin: 0, lineHeight: 1 }}>{card.value}</p>
                      <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", color: "#999", marginTop: "0.2rem" }}>{card.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Daily Trend */}
            <div style={{ background: "#fff", border: "1px solid rgba(139,105,20,0.15)", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B6914", marginBottom: "1rem" }}>DAILY VIEWS</p>
              <SparkLine data={data.dailyViews} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#999" }}>{data.dailyViews[0]?.date || ""}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#999" }}>{data.dailyViews[data.dailyViews.length - 1]?.date || ""}</span>
              </div>
            </div>

            {/* Two Column: Top Pages + Categories */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
              {/* Top Pages */}
              <div style={{ background: "#fff", border: "1px solid rgba(139,105,20,0.15)", borderRadius: "8px", padding: "1.5rem", gridColumn: window.innerWidth < 768 ? "1 / -1" : undefined }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B6914", marginBottom: "1rem" }}>TOP PAGES</p>
                <BarChart data={data.topPages} labelKey="path" valueKey="views" maxBars={20} />
              </div>

              {/* Categories */}
              <div style={{ background: "#fff", border: "1px solid rgba(139,105,20,0.15)", borderRadius: "8px", padding: "1.5rem", gridColumn: window.innerWidth < 768 ? "1 / -1" : undefined }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B6914", marginBottom: "1rem" }}>BY CATEGORY</p>
                <BarChart data={categoryData} labelKey="name" valueKey="views" color="#2D5A27" />
                <div style={{ marginTop: "1rem", borderTop: "1px solid rgba(139,105,20,0.1)", paddingTop: "1rem" }}>
                  {categoryData.map((cat, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: "#333" }}>{cat.name}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#666" }}>{cat.pages} pages · {formatNumber(cat.views)} views</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hourly Distribution */}
            <div style={{ background: "#fff", border: "1px solid rgba(139,105,20,0.15)", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B6914", marginBottom: "1rem" }}>HOURLY DISTRIBUTION (UTC)</p>
              <HourlyHeatmap data={data.hourlyDistribution} />
            </div>

            {/* Referrers */}
            {data.topReferrers.length > 0 && (
              <div style={{ background: "#fff", border: "1px solid rgba(139,105,20,0.15)", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B6914", marginBottom: "1rem" }}>TOP REFERRERS</p>
                <BarChart data={data.topReferrers} labelKey="referrer" valueKey="views" color="#4A3B8C" />
              </div>
            )}

            {/* Share Analytics */}
            {shareData && shareData.totalShares > 0 && (
              <div style={{ background: "#fff", border: "1px solid rgba(139,105,20,0.15)", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B6914", marginBottom: "1rem" }}>SHARE ANALYTICS — {shareData.totalShares} TOTAL SHARES</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#666", marginBottom: "0.5rem" }}>BY PLATFORM</p>
                    <BarChart data={shareData.byPlatform} labelKey="shareType" valueKey="count" color="#2E7D32" />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#666", marginBottom: "0.5rem" }}>TOP SHARED POSTS</p>
                    <BarChart data={shareData.byPost} labelKey="postSlug" valueKey="count" color="#C62828" />
                  </div>
                </div>
                {shareData.dailyTrend.length > 1 && (
                  <div style={{ marginTop: "1.5rem" }}>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#666", marginBottom: "0.5rem" }}>DAILY SHARE TREND</p>
                    <SparkLine data={shareData.dailyTrend.map(d => ({ date: d.date, views: d.count, sessions: 0 }))} />
                  </div>
                )}
              </div>
            )}

            {/* Detailed Page Table */}
            <div style={{ background: "#fff", border: "1px solid rgba(139,105,20,0.15)", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem", overflowX: "auto" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8B6914", marginBottom: "1rem" }}>ALL PAGES — DETAILED</p>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid rgba(139,105,20,0.2)" }}>
                    <th style={{ textAlign: "left", padding: "8px 4px", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B6914" }}>Page</th>
                    <th style={{ textAlign: "right", padding: "8px 4px", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B6914" }}>Views</th>
                    <th style={{ textAlign: "right", padding: "8px 4px", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B6914" }}>Unique</th>
                    <th style={{ textAlign: "right", padding: "8px 4px", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B6914" }}>Avg Read</th>
                    <th style={{ textAlign: "right", padding: "8px 4px", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B6914" }}>Scroll %</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topPages.map((page, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "6px 4px", color: "#333", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        <a href={page.path} style={{ color: "#333", textDecoration: "none" }}>{page.path}</a>
                      </td>
                      <td style={{ textAlign: "right", padding: "6px 4px", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", fontWeight: 700 }}>{page.views}</td>
                      <td style={{ textAlign: "right", padding: "6px 4px", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#666" }}>{page.uniqueVisitors}</td>
                      <td style={{ textAlign: "right", padding: "6px 4px", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#666" }}>{page.avgReadTimeSec > 0 ? `${page.avgReadTimeSec}s` : "—"}</td>
                      <td style={{ textAlign: "right", padding: "6px 4px", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#666" }}>{page.avgScrollPct > 0 ? `${page.avgScrollPct}%` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
