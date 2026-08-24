import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Section, Spacer, FadeIn } from "@/components/Editorial";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function MyHighlights() {
  const { isAuthenticated, loading } = useAuth();
  const { data: highlights, isLoading, refetch } = trpc.highlights.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  const deleteMutation = trpc.highlights.delete.useMutation({
    onSuccess: () => refetch(),
  });

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
                Your Commonplace Book
              </h1>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#666", marginTop: 12, lineHeight: 1.7 }}>
                Sign in to save and revisit your favorite passages from across the site.
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

  const items = highlights || [];
  const grouped = items.reduce((acc, h) => {
    if (!acc[h.postSlug]) acc[h.postSlug] = [];
    acc[h.postSlug]!.push(h);
    return acc;
  }, {} as Record<string, Array<(typeof items)[number]>>);

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
            }}>Your Collection</p>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700, color: "#0A0A10", marginBottom: 8,
            }}>Commonplace Book</h1>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1.05rem", color: "#666", lineHeight: 1.7, marginBottom: 40,
            }}>
              {(highlights || []).length} passages saved from {Object.keys(grouped).length} essays
            </p>

            {(highlights || []).length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", border: "1px dashed #e0dcd4", borderRadius: 12 }}>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#999", fontSize: "1.05rem" }}>
                  No highlights yet. Select text in any essay to save it here.
                </p>
              </div>
            ) : (
              Object.entries(grouped).map(([slug, items]) => (
                <div key={slug} style={{ marginBottom: 40 }}>
                  <Link href={`/blog/${slug}`} style={{
                    fontFamily: "'DM Mono', monospace", fontSize: "0.72rem",
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "#8B6914", textDecoration: "none",
                  }}>
                    {slug.replace(/-/g, " ")}
                  </Link>
                  <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
                    {(items || []).map((h) => (
                      <div key={h.id} style={{
                        background: "white", border: "1px solid #e8e4dc",
                        borderLeft: "3px solid #D4B96A", borderRadius: "0 8px 8px 0",
                        padding: "16px 20px", position: "relative",
                      }}>
                        <p style={{
                          fontFamily: "'Source Sans 3', sans-serif",
                          fontSize: "1rem", lineHeight: 1.7, color: "#333",
                          fontStyle: "italic",
                        }}>
                          "{h.text}"
                        </p>
                        <button
                          onClick={() => deleteMutation.mutate({ id: h.id })}
                          style={{
                            position: "absolute", top: 8, right: 12,
                            background: "none", border: "none", color: "#ccc",
                            cursor: "pointer", fontSize: "1.2rem",
                          }}
                          title="Remove highlight"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </FadeIn>
      </Section>
    </div>
  );
}
