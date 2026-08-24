import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Section, Spacer, FadeIn } from "@/components/Editorial";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function MyReferrals() {
  const { isAuthenticated, loading } = useAuth();
  const { data: stats, isLoading } = trpc.referral.stats.useQuery(undefined, { enabled: isAuthenticated });

  if (loading || isLoading) {
    return (
      <div style={{ background: "#FAFAF7", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "'DM Mono', monospace", color: "#999" }}>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
        <Spacer />
        <Section>
          <FadeIn>
            <div style={{ textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", color: "#0A0A10" }}>
                Your Impact
              </h1>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#666", marginTop: 12 }}>
                Sign in to see your referral impact and share your unique link.
              </p>
              <a href={getLoginUrl()} style={{
                display: "inline-block", marginTop: 24,
                fontFamily: "'DM Mono', monospace", fontSize: "0.8rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
                background: "#0A0A10", color: "#D4B96A",
                padding: "12px 28px", borderRadius: 8, textDecoration: "none",
              }}>Sign In</a>
            </div>
          </FadeIn>
        </Section>
      </div>
    );
  }

  const shareUrl = stats?.code ? `${window.location.origin}?ref=${stats.code}` : "";

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Referral link copied!");
  };

  return (
    <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      <Spacer />
      <Section>
        <FadeIn>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <p style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.75rem",
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "#8B6914", marginBottom: 8,
            }}>Your Network</p>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700, color: "#0A0A10", marginBottom: 32,
            }}>Referral Impact</h1>

            {/* Stats Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 40 }}>
              <div style={{ background: "white", border: "1px solid #e8e4dc", borderRadius: 12, padding: "24px 20px", textAlign: "center" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", color: "#0A0A10", fontWeight: 700 }}>
                  {stats?.referralCount || 0}
                </p>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#999", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>
                  People Referred
                </p>
              </div>
              <div style={{ background: "white", border: "1px solid #e8e4dc", borderRadius: 12, padding: "24px 20px", textAlign: "center" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", color: "#D4B96A", fontWeight: 700 }}>
                  {stats?.totalDepth || 0}
                </p>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#999", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>
                  Depth Score
                </p>
              </div>
              <div style={{ background: "white", border: "1px solid #e8e4dc", borderRadius: 12, padding: "24px 20px", textAlign: "center" }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", color: "#0A0A10", fontWeight: 700 }}>
                  {stats?.totalDepth && stats.referralCount ? Math.round(stats.totalDepth / stats.referralCount) : 0}
                </p>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#999", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>
                  Avg Depth
                </p>
              </div>
            </div>

            {/* Share Link */}
            <div style={{ background: "#0A0A10", borderRadius: 16, padding: "32px", textAlign: "center", marginBottom: 40 }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#D4B96A", marginBottom: 12 }}>
                Your Referral Link
              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                <code style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "0.85rem",
                  color: "#FAFAF7", background: "rgba(255,255,255,0.08)",
                  padding: "10px 16px", borderRadius: 8, wordBreak: "break-all",
                }}>
                  {shareUrl}
                </code>
                <button
                  onClick={copyLink}
                  style={{
                    background: "#D4B96A", color: "#0A0A10",
                    fontFamily: "'DM Mono', monospace", fontSize: "0.75rem",
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    padding: "10px 20px", borderRadius: 8, border: "none",
                    cursor: "pointer", fontWeight: 600,
                  }}
                >
                  Copy
                </button>
              </div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#888", marginTop: 16 }}>
                When someone joins through your link and engages deeply, your depth score grows.
              </p>
            </div>

            {/* Referral List */}
            {stats?.referrals && stats.referrals.length > 0 && (
              <div>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B6914", marginBottom: 12 }}>
                  Your Referrals
                </p>
                {stats.referrals.map((r, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "14px 0", borderBottom: "1px solid #f0ece4",
                  }}>
                    <span style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#444" }}>
                      User #{r.referredUserId}
                    </span>
                    <span style={{
                      fontFamily: "'DM Mono', monospace", fontSize: "0.8rem",
                      color: r.depthScore > 10 ? "#8B6914" : "#999",
                    }}>
                      Depth: {r.depthScore}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FadeIn>
      </Section>
    </div>
  );
}
