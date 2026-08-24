import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";

/* ── Type metadata ── */
const TYPE_LABELS: Record<string, string> = {
  therapy: "Find Your Therapy",
  dharma: "Find Your Purpose",
  consciousness: "Find Your Level",
  "grant-study": "Grant Study",
  "find-your-me": "Find My",
  mirror: "Find Your Mirror",
  spirit: "Find Your Spirit",
  religion: "Find Your Religion",
  diet: "Find Your Diet",
  movement: "Find Your Movement",
  sleep: "Find Your Sleep",
  coffee: "Find Your Coffee",
  kitchen: "Find Your Kitchen",
  style: "Find Your Style",
  "attachment": "Attachment Style",
  "love-language": "Love Language",
  sexuality: "Find Your Sexuality",
  peptide: "Find Your Peptide",
  sake: "Find Your Sake",
  soulscore: "SoulScore",
  "self-portrait": "Self-Portrait",
  kava: "Kava Assessment",
  "brewsoul-quiz": "BrewSoul Quiz",
  "psychedelic-readiness": "Psychedelic Readiness",
};

const TYPE_COLORS: Record<string, string> = {
  therapy: "#6A5ACD",
  dharma: "#8B6914",
  consciousness: "#2E8B57",
  spirit: "#9370DB",
  religion: "#CD853F",
  mirror: "#DC143C",
  diet: "#3CB371",
  movement: "#FF6347",
  sleep: "#4169E1",
  coffee: "#8B4513",
  kitchen: "#DAA520",
  style: "#FF69B4",
  attachment: "#20B2AA",
  "love-language": "#DB7093",
  sexuality: "#BA55D3",
  peptide: "#4682B4",
  sake: "#B8860B",
  soulscore: "#FF8C00",
  "self-portrait": "#778899",
  kava: "#556B2F",
  "brewsoul-quiz": "#A0522D",
  "psychedelic-readiness": "#8B008B",
  "find-your-me": "#2F4F4F",
  "grant-study": "#708090",
};

/* ── Date range presets ── */
type DateRange = "all" | "today" | "7d" | "30d" | "90d";
const DATE_LABELS: Record<DateRange, string> = {
  all: "All Time",
  today: "Today",
  "7d": "Past 7 Days",
  "30d": "Past 30 Days",
  "90d": "Past 90 Days",
};

function getDateCutoff(range: DateRange): Date | null {
  if (range === "all") return null;
  const now = new Date();
  switch (range) {
    case "today": return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case "7d": return new Date(now.getTime() - 7 * 86400000);
    case "30d": return new Date(now.getTime() - 30 * 86400000);
    case "90d": return new Date(now.getTime() - 90 * 86400000);
  }
}

/* ── Parse JSON result summary into readable key-value pairs ── */
function parseSummary(raw: string | null): { label: string; value: string }[] {
  if (!raw) return [];
  try {
    const obj = JSON.parse(raw);
    const pairs: { label: string; value: string }[] = [];

    if (obj.archetype) pairs.push({ label: "Archetype", value: obj.archetype });
    if (obj.primaryType) pairs.push({ label: "Primary Type", value: obj.primaryType });
    if (obj.level) pairs.push({ label: "Level", value: String(obj.level) });
    if (obj.levelName) pairs.push({ label: "Level Name", value: obj.levelName });
    if (obj.type) pairs.push({ label: "Type", value: obj.type });
    if (obj.profile) pairs.push({ label: "Profile", value: obj.profile });
    if (obj.result) pairs.push({ label: "Result", value: typeof obj.result === "string" ? obj.result : JSON.stringify(obj.result) });

    // Scores object
    if (obj.scores && typeof obj.scores === "object") {
      Object.entries(obj.scores).forEach(([k, v]) => {
        pairs.push({
          label: k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase()),
          value: typeof v === "number" ? (v as number).toFixed(1) : String(v),
        });
      });
    }

    // Dimensions array
    if (Array.isArray(obj.dimensions)) {
      obj.dimensions.forEach((d: { name?: string; score?: number }) => {
        if (d.name) pairs.push({ label: d.name, value: d.score != null ? String(d.score) : "—" });
      });
    }

    // If nothing was parsed, show raw (truncated)
    if (pairs.length === 0) {
      pairs.push({ label: "Raw", value: raw.length > 300 ? raw.slice(0, 300) + "…" : raw });
    }

    return pairs;
  } catch {
    return [{ label: "Raw", value: raw.length > 300 ? raw.slice(0, 300) + "…" : raw }];
  }
}

/* ── Shared styles ── */
const mono = "'DM Mono', monospace";
const serif = "'Playfair Display', Georgia, serif";
const sans = "'Source Sans 3', sans-serif";

function AdminAssessments() {
  const { user, loading: authLoading } = useAuth();
  const { data: results, isLoading } = trpc.assessments.listShared.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
    retry: false,
  });

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [userSearch, setUserSearch] = useState("");

  /* ── Derived data ── */
  const filtered = useMemo(() => {
    let items = results || [];

    // Type filter
    if (filterType !== "all") {
      items = items.filter(r => r.assessmentType === filterType);
    }

    // Date filter
    const cutoff = getDateCutoff(dateRange);
    if (cutoff) {
      items = items.filter(r => r.createdAt && new Date(r.createdAt) >= cutoff);
    }

    // User search
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase().trim();
      items = items.filter(r =>
        (r.userName || "").toLowerCase().includes(q) ||
        (r.userEmail || "").toLowerCase().includes(q)
      );
    }

    return items;
  }, [results, filterType, dateRange, userSearch]);

  const uniqueTypes = useMemo(
    () => Array.from(new Set((results || []).map(r => r.assessmentType))).sort(),
    [results],
  );

  /* ── Loading state ── */
  if (authLoading || isLoading) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        minHeight: "100vh", background: "#0A0A10",
        fontFamily: mono, fontSize: "0.85rem",
        color: "#666", letterSpacing: "0.1em",
      }}>
        <div style={{ width: 24, height: 24, border: "2px solid #333", borderTopColor: "#D4B96A", borderRadius: "50%", animation: "spin 0.8s linear infinite", marginBottom: "1rem" }} />
        Loading shared assessments…
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* ── Auth gate ── */
  if (!user || user.role !== "admin") {
    return (
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        minHeight: "100vh", background: "#0A0A10",
        fontFamily: mono, color: "#666", gap: "1rem",
      }}>
        <div style={{ fontSize: "2.5rem", opacity: 0.4 }}>🔒</div>
        <div style={{ fontSize: "0.8rem", letterSpacing: "0.15em" }}>ADMIN ACCESS REQUIRED</div>
        <a href="/" style={{ color: "#D4B96A", fontSize: "0.75rem", fontFamily: mono, letterSpacing: "0.1em", marginTop: "1rem", textDecoration: "none" }}>← BACK TO SITE</a>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A10",
      color: "#FAFAF7",
      fontFamily: sans,
    }}>
      {/* ── Header ── */}
      <header style={{
        maxWidth: "1200px", margin: "0 auto",
        padding: "2rem 2rem 1.5rem",
        borderBottom: "1px solid rgba(139,105,20,0.2)",
      }}>
        <a href="/" style={{
          color: "#555", fontSize: "0.7rem", fontFamily: mono,
          letterSpacing: "0.15em", textDecoration: "none",
          display: "inline-block", marginBottom: "1rem",
        }}>← HOME</a>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{
              fontFamily: serif,
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              fontWeight: 400,
              color: "#D4B96A",
              margin: 0,
              lineHeight: 1.2,
            }}>
              Shared Assessment Results
            </h1>
            <p style={{
              fontFamily: mono,
              fontSize: "0.72rem",
              color: "#666",
              letterSpacing: "0.12em",
              marginTop: "0.5rem",
            }}>
              {filtered.length} OF {results?.length || 0} RESULT{(results?.length || 0) !== 1 ? "S" : ""} · {uniqueTypes.length} TYPE{uniqueTypes.length !== 1 ? "S" : ""}
            </p>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {[
              { label: "Total", value: results?.length || 0 },
              { label: "Types", value: uniqueTypes.length },
              { label: "Showing", value: filtered.length },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: serif, fontSize: "1.5rem", color: "#D4B96A", lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontFamily: mono, fontSize: "0.6rem", color: "#555", letterSpacing: "0.1em", marginTop: "0.25rem" }}>{stat.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Filter bar ── */}
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        padding: "1.25rem 2rem",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        display: "flex", flexDirection: "column", gap: "1rem",
      }}>
        {/* Row 1: Date range + User search */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          {/* Date range pills */}
          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
            {(Object.keys(DATE_LABELS) as DateRange[]).map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                style={{
                  padding: "0.3rem 0.65rem",
                  background: dateRange === range ? "rgba(212,185,106,0.15)" : "transparent",
                  color: dateRange === range ? "#D4B96A" : "#555",
                  border: `1px solid ${dateRange === range ? "rgba(212,185,106,0.4)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: "4px",
                  fontFamily: mono,
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {DATE_LABELS[range]}
              </button>
            ))}
          </div>

          {/* User search */}
          <div style={{ flex: 1, minWidth: "200px", maxWidth: "320px", position: "relative" }}>
            <span style={{
              position: "absolute", left: "0.6rem", top: "50%", transform: "translateY(-50%)",
              fontSize: "0.8rem", color: "#444", pointerEvents: "none",
            }}>🔍</span>
            <input
              type="text"
              placeholder="Search by name or email…"
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "0.4rem 0.6rem 0.4rem 2rem",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "4px",
                color: "#ccc",
                fontFamily: mono,
                fontSize: "0.72rem",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Row 2: Type filter pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          <button
            onClick={() => setFilterType("all")}
            style={{
              padding: "0.28rem 0.6rem",
              background: filterType === "all" ? "#8B6914" : "rgba(255,255,255,0.04)",
              color: filterType === "all" ? "#fff" : "#666",
              border: `1px solid ${filterType === "all" ? "#8B6914" : "rgba(255,255,255,0.08)"}`,
              borderRadius: "3px",
              fontFamily: mono,
              fontSize: "0.62rem",
              letterSpacing: "0.08em",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            ALL ({results?.length || 0})
          </button>
          {uniqueTypes.map(type => {
            const count = (results || []).filter(r => r.assessmentType === type).length;
            const color = TYPE_COLORS[type] || "#8B6914";
            return (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                style={{
                  padding: "0.28rem 0.6rem",
                  background: filterType === type ? color : "rgba(255,255,255,0.04)",
                  color: filterType === type ? "#fff" : "#666",
                  border: `1px solid ${filterType === type ? color : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "3px",
                  fontFamily: mono,
                  fontSize: "0.62rem",
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {(TYPE_LABELS[type] || type).toUpperCase()} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Results list ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem 2rem 4rem" }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "5rem 2rem",
            color: "#444", fontFamily: mono, fontSize: "0.82rem",
            letterSpacing: "0.05em", lineHeight: 1.8,
          }}>
            {results?.length === 0
              ? <>No shared results yet.<br />Results appear here when someone clicks "Send to Tony" after completing an assessment.</>
              : <>No results match your current filters.<br />Try adjusting the type, date range, or search query.</>
            }
          </div>
        ) : (
          filtered.map(result => {
            const isExpanded = expandedId === result.id;
            const color = TYPE_COLORS[result.assessmentType] || "#8B6914";
            const date = result.createdAt
              ? new Date(result.createdAt).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                })
              : "Unknown";
            const time = result.createdAt
              ? new Date(result.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit", minute: "2-digit",
                })
              : "";
            const summaryPairs = parseSummary(result.resultSummary);
            const headline = summaryPairs.find(p =>
              ["Archetype", "Primary Type", "Level Name", "Type", "Profile", "Result"].includes(p.label)
            );

            return (
              <div
                key={result.id}
                onClick={() => setExpandedId(isExpanded ? null : result.id)}
                style={{
                  background: isExpanded ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.015)",
                  border: `1px solid ${isExpanded ? `${color}66` : "rgba(255,255,255,0.06)"}`,
                  borderLeft: `3px solid ${color}`,
                  borderRadius: "6px",
                  padding: "0.9rem 1.2rem",
                  marginBottom: "0.6rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {/* ── Row header ── */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  {/* Type badge */}
                  <span style={{
                    background: `${color}22`,
                    color: color,
                    padding: "0.18rem 0.5rem",
                    borderRadius: "3px",
                    fontFamily: mono,
                    fontSize: "0.6rem",
                    letterSpacing: "0.08em",
                    whiteSpace: "nowrap",
                    border: `1px solid ${color}44`,
                  }}>
                    {(TYPE_LABELS[result.assessmentType] || result.assessmentType).toUpperCase()}
                  </span>

                  {/* Name */}
                  <span style={{
                    fontFamily: serif,
                    fontSize: "1rem",
                    color: "#FAFAF7",
                    flex: 1,
                    minWidth: "100px",
                  }}>
                    {result.userName || "Anonymous"}
                  </span>

                  {/* Headline result */}
                  {headline && (
                    <span style={{
                      fontFamily: sans,
                      fontSize: "0.82rem",
                      color: "#aaa",
                      fontStyle: "italic",
                    }}>
                      {headline.value}
                    </span>
                  )}

                  {/* Score */}
                  {result.totalScore != null && (
                    <span style={{
                      fontFamily: mono,
                      fontSize: "0.75rem",
                      color: "#D4B96A",
                      background: "rgba(212,185,106,0.1)",
                      padding: "0.15rem 0.4rem",
                      borderRadius: "3px",
                    }}>
                      {typeof result.totalScore === "number" ? result.totalScore.toFixed(1) : result.totalScore}
                    </span>
                  )}

                  {/* Date */}
                  <span style={{
                    fontFamily: mono,
                    fontSize: "0.65rem",
                    color: "#555",
                    whiteSpace: "nowrap",
                  }}>
                    {date}
                  </span>

                  {/* Expand indicator */}
                  <span style={{
                    color: "#444",
                    fontSize: "0.7rem",
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                    flexShrink: 0,
                  }}>▼</span>
                </div>

                {/* ── Expanded detail ── */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: "1rem",
                      paddingTop: "1rem",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                      gap: "1rem",
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    {/* Contact info */}
                    <div>
                      <div style={{ fontFamily: mono, fontSize: "0.6rem", color: "#555", letterSpacing: "0.12em", marginBottom: "0.35rem" }}>CONTACT</div>
                      <div style={{ fontSize: "0.88rem", color: "#ccc", lineHeight: 1.6 }}>
                        <div>{result.userName || "Anonymous"}</div>
                        {result.userEmail ? (
                          <a href={`mailto:${result.userEmail}`} style={{ color: "#D4B96A", textDecoration: "none", fontSize: "0.82rem" }}>
                            {result.userEmail}
                          </a>
                        ) : (
                          <span style={{ color: "#444", fontSize: "0.82rem" }}>No email provided</span>
                        )}
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div>
                      <div style={{ fontFamily: mono, fontSize: "0.6rem", color: "#555", letterSpacing: "0.12em", marginBottom: "0.35rem" }}>SUBMITTED</div>
                      <div style={{ fontSize: "0.88rem", color: "#ccc" }}>
                        {date}{time ? ` at ${time}` : ""}
                      </div>
                    </div>

                    {/* Score */}
                    {result.totalScore != null && (
                      <div>
                        <div style={{ fontFamily: mono, fontSize: "0.6rem", color: "#555", letterSpacing: "0.12em", marginBottom: "0.35rem" }}>SCORE</div>
                        <div style={{ fontSize: "1.4rem", fontFamily: serif, color: "#D4B96A" }}>
                          {typeof result.totalScore === "number" ? result.totalScore.toFixed(1) : result.totalScore}
                        </div>
                      </div>
                    )}

                    {/* Parsed result summary */}
                    {summaryPairs.length > 0 && (
                      <div style={{ gridColumn: "1 / -1" }}>
                        <div style={{ fontFamily: mono, fontSize: "0.6rem", color: "#555", letterSpacing: "0.12em", marginBottom: "0.5rem" }}>RESULT DETAILS</div>
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                          gap: "0.6rem",
                        }}>
                          {summaryPairs.map((pair, i) => (
                            <div
                              key={i}
                              style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.05)",
                                borderRadius: "4px",
                                padding: "0.5rem 0.65rem",
                              }}
                            >
                              <div style={{ fontFamily: mono, fontSize: "0.55rem", color: "#555", letterSpacing: "0.1em", marginBottom: "0.2rem" }}>
                                {pair.label.toUpperCase()}
                              </div>
                              <div style={{
                                fontSize: "0.85rem",
                                color: pair.label === "Raw" ? "#888" : "#D4B96A",
                                fontFamily: pair.label === "Raw" ? mono : sans,
                                wordBreak: "break-word",
                              }}>
                                {pair.value}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default AdminAssessments;
