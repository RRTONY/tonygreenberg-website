/**
 * ClarisseCommunity — A humble/proud community CTA for the Clarisse article.
 * 
 * Tone: "If they're weird, we are weird."
 * Invites readers to help grow understanding of this type of work and these people.
 * Not a sales pitch. A genuine ask from someone who doesn't fully understand
 * why this matters so much, but knows that it does.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function ClarisseCommunity({ postSlug }: { postSlug: string }) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const submitResponse = trpc.comments.add.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setMessage("");
    },
  });

  const handleSubmit = () => {
    if (!message.trim()) return;
    submitResponse.mutate({
      postSlug,
      content: `[COMMUNITY RESPONSE] ${message}`,
      name: user?.name || 'Anonymous',
      parentId: undefined,
    });
  };

  return (
    <div style={{
      maxWidth: "780px",
      margin: "2.5rem 0",
      padding: "2.5rem clamp(1.5rem, 4vw, 2.5rem)",
      background: "linear-gradient(160deg, #0A0A10 0%, #141418 60%, #1a1a22 100%)",
      borderRadius: "8px",
      border: "1px solid rgba(212,185,106,0.15)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Subtle gold accent line at top */}
      <div style={{
        position: "absolute",
        top: 0,
        left: "10%",
        right: "10%",
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(212,185,106,0.4), transparent)",
      }} />

      {/* Label */}
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.68rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "rgba(212,185,106,0.6)",
        marginBottom: "1.2rem",
      }}>
        A NOTE FROM TONY
      </div>

      {/* The humble/proud statement */}
      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
        fontWeight: 400,
        fontStyle: "italic",
        color: "#F5F0E0",
        lineHeight: 1.7,
        marginBottom: "1.2rem",
      }}>
        I don't fully understand why this story matters so much to me. But it does.
      </p>

      <p style={{
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: "1rem",
        color: "rgba(245,240,224,0.75)",
        lineHeight: 1.8,
        marginBottom: "1rem",
      }}>
        Clarisse paints what the body knows before the mind catches up. A million people stopped scrolling. That's not supposed to happen. The algorithm is designed to prevent exactly that kind of stillness.
      </p>

      <p style={{
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: "1rem",
        color: "rgba(245,240,224,0.75)",
        lineHeight: 1.8,
        marginBottom: "1rem",
      }}>
        I think there are more of us than anyone realizes — people who feel pulled toward work that makes them uncomfortable in the best way. Work that asks something of the viewer. Work that refuses to be easy.
      </p>

      {/* The "weird" line — bold, gold, standout */}
      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
        fontWeight: 600,
        color: "#D4B96A",
        lineHeight: 1.6,
        marginBottom: "1.2rem",
        textAlign: "center",
        padding: "0.8rem 0",
      }}>
        If they're weird, we are weird.
      </p>

      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          style={{
            display: "block",
            margin: "0 auto",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.78rem",
            letterSpacing: "0.1em",
            color: "#D4B96A",
            background: "transparent",
            border: "1px solid rgba(212,185,106,0.3)",
            padding: "0.7rem 1.8rem",
            borderRadius: "3px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          I FEEL THIS TOO →
        </button>
      ) : (
        <div style={{ marginTop: "1rem" }}>
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.95rem",
            color: "rgba(245,240,224,0.7)",
            lineHeight: 1.7,
            marginBottom: "1.2rem",
          }}>
            So here's what I'm asking — not selling, not pitching, just genuinely wondering: <strong style={{ color: "#F5F0E0" }}>How do we help grow this?</strong> How do we find more people who feel this pull? How do we make space for work that the platforms are trying to flatten?
          </p>

          <p style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.95rem",
            color: "rgba(245,240,224,0.6)",
            lineHeight: 1.7,
            marginBottom: "1.5rem",
          }}>
            If you have an idea — a gallery, a publication, a community, a conversation you think should happen — I want to hear it. Not because I have the answer. Because I think the answer is somewhere between all of us.
          </p>

          {/* Response mechanism */}
          {submitted ? (
            <div style={{
              textAlign: "center",
              padding: "1.2rem",
              background: "rgba(212,185,106,0.08)",
              borderRadius: "4px",
              border: "1px solid rgba(212,185,106,0.2)",
            }}>
              <p style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.95rem",
                color: "#D4B96A",
                margin: 0,
              }}>
                Thank you. I read every single one of these.
              </p>
            </div>
          ) : (
            <div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={user ? "What comes to mind? A gallery, a person, an idea, a feeling..." : "Sign in to share your thoughts..."}
                disabled={!user}
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "1rem",
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.95rem",
                  color: "#F5F0E0",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(212,185,106,0.2)",
                  borderRadius: "4px",
                  resize: "vertical",
                  outline: "none",
                  lineHeight: 1.6,
                  boxSizing: "border-box",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(212,185,106,0.5)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(212,185,106,0.2)"; }}
              />
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "0.8rem",
                flexWrap: "wrap",
                gap: "0.8rem",
              }}>
                {user ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!message.trim() || submitResponse.isPending}
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      color: message.trim() ? "#0A0A10" : "rgba(245,240,224,0.3)",
                      background: message.trim() ? "#D4B96A" : "rgba(212,185,106,0.1)",
                      border: "none",
                      padding: "0.7rem 1.5rem",
                      borderRadius: "3px",
                      cursor: message.trim() ? "pointer" : "default",
                      transition: "all 0.2s",
                    }}
                  >
                    {submitResponse.isPending ? "SENDING..." : "SEND TO TONY"}
                  </button>
                ) : (
                  <a
                    href="/api/oauth/login"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      color: "#D4B96A",
                      textDecoration: "none",
                      borderBottom: "1px solid rgba(212,185,106,0.3)",
                    }}
                  >
                    SIGN IN TO RESPOND →
                  </a>
                )}
                <a
                  href="mailto:tony@impactsoul.is?subject=Re: Clarisse, the weird ones, and what comes next"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.72rem",
                    letterSpacing: "0.06em",
                    color: "rgba(245,240,224,0.4)",
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(245,240,224,0.15)",
                  }}
                >
                  or email me directly
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
