/**
 * PRI Research Dashboard — Admin-only page showing anonymized research data
 * Compares simulation predictions with live calibration results
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import SEO from "@/components/SEO";

export default function PriResearch() {
  const { user, loading } = useAuth();
  const { data: stats } = trpc.priCalibration.stats.useQuery();
  const { data: researchData, isLoading: loadingResearch } = trpc.priCalibration.researchData.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  if (loading) return <div style={{ minHeight: "100vh", background: "#0A0A10", display: "flex", alignItems: "center", justifyContent: "center", color: "#F4F0E8" }}>Loading...</div>;
  if (!user || user.role !== "admin") return (
    <>
    <SEO
        title="PRI Research — Psychedelic Readiness Index"
        description="The research foundation of the Psychedelic Readiness Index."
        path="/psychedelic-readiness-index/research"
        keywords="Tony Greenberg, psychedelic research, PRI research, ibogaine research, psilocybin research"
        indexable={true}
      />
      <div style={{ minHeight: "100vh", background: "#0A0A10", display: "flex", alignItems: "center", justifyContent: "center", color: "#F4F0E8", flexDirection: "column", gap: "1rem" }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif" }}>Access Denied</h1>
      <p style={{ color: "rgba(244,240,232,.5)" }}>This page requires admin access.</p>
      <a href="/pri-efficacy" style={{ color: "#A855F7" }}>← View Public Efficacy Report</a>
    </div>
    </>);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A10", color: "#F4F0E8", fontFamily: "'Source Sans 3', sans-serif", padding: "2rem 1.5rem" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <header style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".15em", color: "#A855F7", marginBottom: ".5rem" }}>Admin · Research Dashboard</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", margin: 0 }}>PRI Research Data</h1>
          <p style={{ color: "rgba(244,240,232,.5)", marginTop: ".5rem" }}>Anonymized calibration data from opt-in participants. {stats?.total ?? 0} total calibrations, {stats?.researchOptIn ?? 0} research opt-ins.</p>
        </header>

        {/* Summary Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ background: "rgba(107,33,168,.08)", border: "1px solid rgba(107,33,168,.25)", borderRadius: 8, padding: "1rem", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#A855F7" }}>{stats?.total ?? 0}</div>
            <div style={{ fontSize: ".75rem", color: "rgba(244,240,232,.5)" }}>Total Calibrations</div>
          </div>
          <div style={{ background: "rgba(107,33,168,.08)", border: "1px solid rgba(107,33,168,.25)", borderRadius: 8, padding: "1rem", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#10B981" }}>{stats?.researchOptIn ?? 0}</div>
            <div style={{ fontSize: ".75rem", color: "rgba(244,240,232,.5)" }}>Research Opt-Ins</div>
          </div>
          <div style={{ background: "rgba(107,33,168,.08)", border: "1px solid rgba(107,33,168,.25)", borderRadius: 8, padding: "1rem", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#F59E0B" }}>{stats?.total ? `${Math.round((stats.researchOptIn / stats.total) * 100)}%` : "—"}</div>
            <div style={{ fontSize: ".75rem", color: "rgba(244,240,232,.5)" }}>Opt-In Rate</div>
          </div>
        </div>

        {/* Research Data Table */}
        <div style={{ background: "rgba(244,240,232,.03)", border: "1px solid rgba(244,240,232,.08)", borderRadius: 12, padding: "1.5rem" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: "1rem" }}>Anonymized Research Entries</h3>
          {loadingResearch ? (
            <p style={{ color: "rgba(244,240,232,.4)" }}>Loading research data...</p>
          ) : !researchData || researchData.length === 0 ? (
            <p style={{ color: "rgba(244,240,232,.4)" }}>No research opt-in data available yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".8rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(244,240,232,.15)" }}>
                    <th style={{ textAlign: "left", padding: ".5rem", color: "rgba(244,240,232,.5)" }}>ID</th>
                    <th style={{ textAlign: "left", padding: ".5rem", color: "rgba(244,240,232,.5)" }}>Date</th>
                    <th style={{ textAlign: "left", padding: ".5rem", color: "rgba(244,240,232,.5)" }}>Rankings</th>
                    <th style={{ textAlign: "left", padding: ".5rem", color: "rgba(244,240,232,.5)" }}>Dim Scores</th>
                    <th style={{ textAlign: "left", padding: ".5rem", color: "rgba(244,240,232,.5)" }}>Pairwise Choices</th>
                  </tr>
                </thead>
                <tbody>
                  {researchData.map((row) => {
                    let rankings: string[] = [];
                    let dimScores: Record<string, number> = {};
                    let pairCount = 0;
                    try { rankings = JSON.parse(row.rankings); } catch {}
                    try { dimScores = JSON.parse(row.dimScores); } catch {}
                    try { pairCount = JSON.parse(row.pairwiseChoices).length; } catch {}
                    return (
                      <tr key={row.id} style={{ borderBottom: "1px solid rgba(244,240,232,.05)" }}>
                        <td style={{ padding: ".5rem", color: "rgba(244,240,232,.6)" }}>#{row.id}</td>
                        <td style={{ padding: ".5rem", color: "rgba(244,240,232,.6)" }}>{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"}</td>
                        <td style={{ padding: ".5rem", color: "rgba(244,240,232,.6)" }}>{rankings.join(" → ")}</td>
                        <td style={{ padding: ".5rem", color: "rgba(244,240,232,.6)" }}>
                          {Object.entries(dimScores).map(([k, v]) => `${k}:${v}`).join(", ")}
                        </td>
                        <td style={{ padding: ".5rem", color: "rgba(244,240,232,.6)" }}>{pairCount} pairs</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Export */}
        <div style={{ marginTop: "1.5rem", textAlign: "right" }}>
          <button
            onClick={() => {
              if (!researchData) return;
              const csv = "id,date,rankings,dimScores,pairwiseChoices\n" + researchData.map(r => 
                `${r.id},${r.createdAt},${r.rankings.replace(/,/g, ";")},${r.dimScores.replace(/,/g, ";")},${r.pairwiseChoices.replace(/,/g, ";")}`
              ).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = "pri-research-data.csv"; a.click();
            }}
            style={{ padding: ".5rem 1rem", borderRadius: 6, background: "#6B21A8", color: "#F4F0E8", border: "none", cursor: "pointer", fontSize: ".85rem" }}
          >
            Export CSV
          </button>
        </div>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <a href="/pri-efficacy" style={{ color: "#A855F7", fontSize: ".9rem" }}>← Public Efficacy Report</a>
        </div>
      </div>
    </div>
  );
}
