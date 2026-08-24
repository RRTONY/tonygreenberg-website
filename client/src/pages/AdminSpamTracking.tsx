/**
 * Admin Spam Tracking Dashboard
 * Visualizes page view stats, forwarded emails, open rates,
 * and Wall of Shame activity for the spammer confrontation system.
 */
import { trpc } from "@/lib/trpc";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import {
  Eye,
  Send,
  Shield,
  AlertTriangle,
  Globe,
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Check,
  ArrowLeft,
  BarChart3,
  Mail,
  Skull,
  Activity,
} from "lucide-react";

/* ── Stat Card ── */
function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "12px",
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Icon size={18} color={color} />
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.08em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>{label}</span>
      </div>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: "2rem", fontWeight: 700, color }}>
        {value}
      </div>
      {sub && <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>{sub}</span>}
    </div>
  );
}

/* ── View Entry Row ── */
function ViewEntry({ entry, onCopyUrl }: { entry: any; onCopyUrl: (url: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const company = entry.company || "Unknown";
  const domain = entry.domain || "—";
  const viewCount = entry.viewCount || 1;
  const firstViewed = entry.firstViewedAt ? new Date(entry.firstViewedAt) : null;
  const lastViewed = entry.lastViewedAt ? new Date(entry.lastViewedAt) : null;

  const generatedUrl = `/youve-been-reported?company=${encodeURIComponent(company)}${domain !== "—" ? `&domain=${encodeURIComponent(domain)}` : ""}${entry.email ? `&email=${encodeURIComponent(entry.email)}` : ""}`;

  return (
    <div style={{
      background: expanded ? "rgba(220,20,60,0.05)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${expanded ? "rgba(220,20,60,0.2)" : "rgba(255,255,255,0.06)"}`,
      borderRadius: "10px",
      overflow: "hidden",
      transition: "all 0.2s ease",
    }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "inherit",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: 0 }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            background: viewCount > 5 ? "rgba(220,20,60,0.15)" : viewCount > 1 ? "rgba(255,165,0,0.15)" : "rgba(139,105,20,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <Eye size={16} color={viewCount > 5 ? "#DC143C" : viewCount > 1 ? "#FFA500" : "#8B6914"} />
          </div>
          <div style={{ textAlign: "left", minWidth: 0 }}>
            <div style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 600,
              fontSize: "0.95rem",
              color: "#F5F0E8",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {company}
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.4)",
            }}>
              {domain}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: viewCount > 5 ? "#DC143C" : viewCount > 1 ? "#FFA500" : "#D4B96A",
            }}>
              {viewCount}
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.65rem",
              color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase",
            }}>
              {viewCount === 1 ? "view" : "views"}
            </div>
          </div>
          {expanded ? <ChevronUp size={16} color="rgba(255,255,255,0.3)" /> : <ChevronDown size={16} color="rgba(255,255,255,0.3)" />}
        </div>
      </button>

      {expanded && (
        <div style={{
          padding: "0 1.25rem 1.25rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "1rem",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
            {entry.email && (
              <div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Email</span>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#F5F0E8" }}>{entry.email}</div>
              </div>
            )}
            {firstViewed && (
              <div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>First Opened</span>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#F5F0E8" }}>{firstViewed.toLocaleString()}</div>
              </div>
            )}
            {lastViewed && (
              <div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Last Opened</span>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#F5F0E8" }}>{lastViewed.toLocaleString()}</div>
              </div>
            )}
            {entry.userAgent && (
              <div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>User Agent</span>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", wordBreak: "break-all" }}>{entry.userAgent.substring(0, 120)}</div>
              </div>
            )}
            {entry.ipAddress && (
              <div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>IP Address</span>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#F5F0E8" }}>{entry.ipAddress}</div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <CopyUrlButton url={generatedUrl} onCopy={onCopyUrl} />
            <Link href={generatedUrl}>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.4rem 0.8rem",
                borderRadius: "6px",
                background: "rgba(220,20,60,0.1)",
                border: "1px solid rgba(220,20,60,0.3)",
                color: "#DC143C",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem",
                cursor: "pointer",
                textDecoration: "none",
              }}>
                <ExternalLink size={12} /> View Page
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Forward Entry Row ── */
function ForwardEntry({ entry }: { entry: any }) {
  const [expanded, setExpanded] = useState(false);
  const company = entry.extractedCompany || entry.company || "Unknown";
  const domain = entry.extractedDomain || entry.domain || "—";
  const createdAt = entry.createdAt ? new Date(entry.createdAt) : null;

  return (
    <div style={{
      background: expanded ? "rgba(139,105,20,0.05)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${expanded ? "rgba(139,105,20,0.2)" : "rgba(255,255,255,0.06)"}`,
      borderRadius: "10px",
      overflow: "hidden",
      transition: "all 0.2s ease",
    }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "inherit",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: 0 }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            background: "rgba(139,105,20,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <Mail size={16} color="#D4B96A" />
          </div>
          <div style={{ textAlign: "left", minWidth: 0 }}>
            <div style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 600,
              fontSize: "0.95rem",
              color: "#F5F0E8",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {company}
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.4)",
            }}>
              {entry.rawSubject || domain}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
          {createdAt && (
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.35)",
            }}>
              {createdAt.toLocaleDateString()}
            </span>
          )}
          {expanded ? <ChevronUp size={16} color="rgba(255,255,255,0.3)" /> : <ChevronDown size={16} color="rgba(255,255,255,0.3)" />}
        </div>
      </button>

      {expanded && (
        <div style={{
          padding: "0 1.25rem 1.25rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "1rem",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
            {entry.rawFrom && (
              <div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>From</span>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#F5F0E8" }}>{entry.rawFrom}</div>
              </div>
            )}
            {entry.extractedEmail && (
              <div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Extracted Email</span>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#F5F0E8" }}>{entry.extractedEmail}</div>
              </div>
            )}
            {domain !== "—" && (
              <div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Domain</span>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#F5F0E8" }}>{domain}</div>
              </div>
            )}
            {entry.generatedUrl && (
              <div>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Generated URL</span>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#D4B96A", wordBreak: "break-all" }}>{entry.generatedUrl}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Copy URL Button ── */
function CopyUrlButton({ url, onCopy }: { url: string; onCopy: (url: string) => void }) {
  const [copied, setCopied] = useState(false);
  const fullUrl = `https://tonygreenberg.com${url}`;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        onCopy(fullUrl);
        setTimeout(() => setCopied(false), 2000);
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.4rem 0.8rem",
        borderRadius: "6px",
        background: copied ? "rgba(34,197,94,0.1)" : "rgba(139,105,20,0.1)",
        border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(139,105,20,0.3)"}`,
        color: copied ? "#22C55E" : "#D4B96A",
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.7rem",
        cursor: "pointer",
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied" : "Copy URL"}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════════════════════════ */
export default function AdminSpamTracking() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"views" | "forwards" | "reports">("views");
  const [copiedUrl, setCopiedUrl] = useState("");

  // Auth gate
  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0A0A10", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div style={{ minHeight: "100vh", background: "#0A0A10", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
        <Shield size={48} color="#DC143C" />
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.5rem", color: "#F5F0E8" }}>Admin Access Required</div>
        <div style={{ fontFamily: "'Source Sans 3', sans-serif", color: "rgba(255,255,255,0.5)" }}>
          {!user ? (
            <a href={getLoginUrl()} style={{ color: "#D4B96A" }}>Sign in to continue</a>
          ) : (
            "You don't have permission to view this page."
          )}
        </div>
      </div>
    );
  }

  return <DashboardContent activeTab={activeTab} setActiveTab={setActiveTab} copiedUrl={copiedUrl} setCopiedUrl={setCopiedUrl} />;
}

function DashboardContent({ activeTab, setActiveTab, copiedUrl, setCopiedUrl }: {
  activeTab: "views" | "forwards" | "reports";
  setActiveTab: (tab: "views" | "forwards" | "reports") => void;
  copiedUrl: string;
  setCopiedUrl: (url: string) => void;
}) {
  const { data: viewStats, isLoading: viewsLoading } = trpc.spam.viewStats.useQuery({ limit: 100 });
  const { data: forwards, isLoading: forwardsLoading } = trpc.spam.listForwards.useQuery({ limit: 100 });
  const { data: wallOfShame } = trpc.spam.wallOfShame.useQuery();

  // Computed stats
  const totalViews = useMemo(() => {
    if (!viewStats) return 0;
    return viewStats.reduce((sum: number, v: any) => sum + (v.viewCount || 1), 0);
  }, [viewStats]);

  const uniqueSpammers = viewStats?.length || 0;
  const totalForwards = forwards?.length || 0;
  const totalReports = wallOfShame?.length || 0;

  // Spammers who opened more than once = "rattled"
  const rattledCount = useMemo(() => {
    if (!viewStats) return 0;
    return viewStats.filter((v: any) => (v.viewCount || 1) > 1).length;
  }, [viewStats]);

  const openRate = uniqueSpammers > 0 ? Math.round((rattledCount / uniqueSpammers) * 100) : 0;

  useEffect(() => {
    document.title = "Spam Command Center — Admin";
  }, []);

  const tabs = [
    { id: "views" as const, label: "Page Views", icon: Eye, count: uniqueSpammers },
    { id: "forwards" as const, label: "Forwarded Spam", icon: Mail, count: totalForwards },
    { id: "reports" as const, label: "Wall of Shame", icon: Skull, count: totalReports },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A10",
      color: "#F5F0E8",
    }}>
      {/* ── Header ── */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "1.5rem 2rem",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Link href="/">
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  textDecoration: "none",
                  cursor: "pointer",
                }}>
                  <ArrowLeft size={14} /> Home
                </span>
              </Link>
              <div>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.12em",
                  color: "#DC143C",
                  textTransform: "uppercase",
                  marginBottom: "0.25rem",
                }}>
                  Admin / Attention Theft
                </div>
                <h1 style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#F5F0E8",
                  margin: 0,
                }}>
                  Spam Command Center
                </h1>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link href="/attention-theft/report">
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  background: "rgba(139,105,20,0.15)",
                  border: "1px solid rgba(212,185,106,0.3)",
                  color: "#D4B96A",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  textDecoration: "none",
                  cursor: "pointer",
                }}>
                  <AlertTriangle size={14} /> Report Spammer
                </span>
              </Link>
              <Link href="/admin/assessments">
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  textDecoration: "none",
                  cursor: "pointer",
                }}>
                  <BarChart3 size={14} /> Assessments
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        {/* ── Stats Grid ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}>
          <StatCard icon={Eye} label="Total Page Views" value={totalViews} sub={`${uniqueSpammers} unique spammers`} color="#DC143C" />
          <StatCard icon={Activity} label="Re-Openers" value={rattledCount} sub={`${openRate}% came back`} color="#FFA500" />
          <StatCard icon={Mail} label="Forwarded Spam" value={totalForwards} sub="auto-processed" color="#D4B96A" />
          <StatCard icon={Skull} label="Wall of Shame" value={totalReports} sub="reported companies" color="#8B6914" />
        </div>

        {/* ── Tab Navigation ── */}
        <div style={{
          display: "flex",
          gap: "0.25rem",
          marginBottom: "1.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          paddingBottom: "0",
        }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.25rem",
                  background: "none",
                  border: "none",
                  borderBottom: isActive ? "2px solid #DC143C" : "2px solid transparent",
                  color: isActive ? "#F5F0E8" : "rgba(255,255,255,0.4)",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  marginBottom: "-1px",
                }}
              >
                <tab.icon size={14} />
                {tab.label}
                <span style={{
                  background: isActive ? "rgba(220,20,60,0.2)" : "rgba(255,255,255,0.08)",
                  color: isActive ? "#DC143C" : "rgba(255,255,255,0.4)",
                  padding: "0.1rem 0.5rem",
                  borderRadius: "10px",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ── */}
        {activeTab === "views" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {viewsLoading ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace", fontSize: "0.85rem" }}>
                Loading tracking data...
              </div>
            ) : !viewStats || viewStats.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "4rem 2rem",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <Eye size={48} color="rgba(255,255,255,0.15)" style={{ marginBottom: "1rem" }} />
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.2rem", color: "#F5F0E8", marginBottom: "0.5rem" }}>
                  No spammers have opened their notice yet
                </div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.4)" }}>
                  Send a spammer their personalized URL and watch the views roll in.
                </div>
              </div>
            ) : (
              viewStats.map((entry: any, i: number) => (
                <ViewEntry key={entry.id || i} entry={entry} onCopyUrl={setCopiedUrl} />
              ))
            )}
          </div>
        )}

        {activeTab === "forwards" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {forwardsLoading ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace", fontSize: "0.85rem" }}>
                Loading forwarded spam...
              </div>
            ) : !forwards || forwards.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "4rem 2rem",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <Mail size={48} color="rgba(255,255,255,0.15)" style={{ marginBottom: "1rem" }} />
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.2rem", color: "#F5F0E8", marginBottom: "0.5rem" }}>
                  No forwarded spam yet
                </div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.4)" }}>
                  Forward spam emails to the processing endpoint to auto-generate confrontation URLs.
                </div>
              </div>
            ) : (
              forwards.map((entry: any, i: number) => (
                <ForwardEntry key={entry.id || i} entry={entry} />
              ))
            )}
          </div>
        )}

        {activeTab === "reports" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {!wallOfShame || wallOfShame.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "4rem 2rem",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <Skull size={48} color="rgba(255,255,255,0.15)" style={{ marginBottom: "1rem" }} />
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: "1.2rem", color: "#F5F0E8", marginBottom: "0.5rem" }}>
                  Wall of Shame is empty
                </div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.4)" }}>
                  Report spammers via the Attention Theft manifesto to populate the wall.
                </div>
              </div>
            ) : (
              wallOfShame.map((entry: any, i: number) => {
                const generatedUrl = `/youve-been-reported?company=${encodeURIComponent(entry.companyName || "")}${entry.senderDomain ? `&domain=${encodeURIComponent(entry.senderDomain)}` : ""}`;
                return (
                  <div key={entry.id || i} style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "10px",
                    padding: "1rem 1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", minWidth: 0 }}>
                      <div style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "8px",
                        background: "rgba(220,20,60,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <Skull size={16} color="#DC143C" />
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: "0.95rem", color: "#F5F0E8" }}>
                          {entry.companyName}
                        </div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>
                          {entry.spamType} | {entry.senderEmail} | {entry.reportCount || 1} report{(entry.reportCount || 1) > 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <CopyUrlButton url={generatedUrl} onCopy={setCopiedUrl} />
                      <Link href={generatedUrl}>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          padding: "0.4rem 0.8rem",
                          borderRadius: "6px",
                          background: "rgba(220,20,60,0.1)",
                          border: "1px solid rgba(220,20,60,0.3)",
                          color: "#DC143C",
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.7rem",
                          cursor: "pointer",
                          textDecoration: "none",
                        }}>
                          <Send size={12} /> Send Notice
                        </span>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── Copied URL Toast ── */}
        {copiedUrl && (
          <div style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            background: "rgba(34,197,94,0.15)",
            border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: "10px",
            padding: "0.75rem 1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#22C55E",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.75rem",
            zIndex: 1000,
            animation: "fadeIn 0.2s ease",
          }}>
            <Check size={14} /> URL copied to clipboard
          </div>
        )}
      </div>
    </div>
  );
}
