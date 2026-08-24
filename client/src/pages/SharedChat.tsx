import { trpc } from "@/lib/trpc";
import { useRoute } from "wouter";
import { Section, Spacer, FadeIn } from "@/components/Editorial";
import { Streamdown } from "streamdown";

export default function SharedChat() {
  const [, params] = useRoute("/shared-chat/:shareId");
  const shareId = params?.shareId || "";
  const { data, isLoading } = trpc.sharedChat.get.useQuery(
    { shareId },
    { enabled: !!shareId }
  );

  if (isLoading) {
    return (
      <div style={{ background: "#FAFAF7", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "'DM Mono', monospace", color: "#999" }}>Loading conversation...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
        <Spacer />
        <Section>
          <FadeIn>
            <div style={{ textAlign: "center" }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#0A0A10" }}>
                Conversation Not Found
              </h1>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#666", marginTop: 12 }}>
                This shared conversation may have been removed or the link is invalid.
              </p>
            </div>
          </FadeIn>
        </Section>
      </div>
    );
  }

  return (
    <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      <Spacer />
      <Section>
        <FadeIn>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#8B6914",
              marginBottom: 8,
            }}>
              Shared Conversation · {data.messageCount} messages
            </p>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              fontWeight: 700,
              color: "#0A0A10",
              lineHeight: 1.2,
              marginBottom: 32,
            }}>
              {data.title}
            </h1>

            {/* Messages */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {data.messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "85%",
                      padding: "16px 20px",
                      borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      background: msg.role === "user" ? "#0A0A10" : "white",
                      color: msg.role === "user" ? "#FAFAF7" : "#222",
                      border: msg.role === "user" ? "none" : "1px solid #e8e4dc",
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "1rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {msg.role === "user" ? (
                      msg.content
                    ) : (
                      <Streamdown>{msg.content}</Streamdown>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ textAlign: "center", marginTop: 48, paddingTop: 24, borderTop: "1px solid #e8e4dc" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "#999", letterSpacing: "0.08em" }}>
                Powered by FauxTony · <a href="/ask-tony" style={{ color: "#8B6914" }}>Start your own conversation</a>
              </p>
            </div>
          </div>
        </FadeIn>
      </Section>
    </div>
  );
}
