/**
 * AskTonyModal — A focused "Ask Tony a direct question" modal.
 * Triggered by a subtle button at the bottom of every article.
 * Sends directly to tony@tonygreenberg.com + Manus notification.
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

interface AskTonyModalProps {
  postTitle?: string;
  postSlug?: string;
  onClose: () => void;
}

export function AskTonyModal({ postTitle, postSlug, onClose }: AskTonyModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = trpc.askTony.submit.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !question.trim() || submit.isPending) return;
    submit.mutate({
      name: name.trim(),
      email: email.trim() || undefined,
      question: question.trim(),
      postTitle,
      postSlug,
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#FAFAF7",
        borderRadius: "6px",
        padding: "clamp(1.5rem, 5vw, 2.5rem)",
        maxWidth: "520px",
        width: "100%",
        position: "relative",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        border: "1px solid rgba(139,105,20,0.15)",
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#999",
            fontSize: "1.2rem",
            lineHeight: 1,
            padding: "0.25rem",
          }}
          aria-label="Close"
        >
          ×
        </button>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{
              fontFamily: "'IM Fell English', serif",
              fontSize: "2rem",
              color: "#8B6914",
              marginBottom: "1rem",
            }}>✦</div>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.3rem",
              fontWeight: 400,
              color: "#1a1a1a",
              marginBottom: "0.75rem",
            }}>
              Tony will read this.
            </h3>
            <p style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "0.95rem",
              color: "#666",
              lineHeight: 1.6,
            }}>
              Your question has been sent directly to him. He reads everything.
              He does not respond to everything. But he reads everything.
            </p>
            <button
              onClick={onClose}
              style={{
                marginTop: "1.5rem",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.55rem 1.4rem",
                background: "#111",
                color: "#F5F0E0",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#8B6914",
                marginBottom: "0.5rem",
              }}>
                ASK TONY DIRECTLY
              </div>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.25rem",
                fontWeight: 400,
                fontStyle: "italic",
                color: "#1a1a1a",
                margin: 0,
                lineHeight: 1.4,
              }}>
                {postTitle ? `A question about "${postTitle}"` : "What's on your mind?"}
              </h3>
              <p style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.88rem",
                color: "#888",
                margin: "0.4rem 0 0",
                lineHeight: 1.5,
              }}>
                This goes directly to Tony. Not a bot. Not a form that disappears into a CRM.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Name + Email */}
              <div style={{ display: "flex", gap: "0.6rem", marginBottom: "0.65rem", flexWrap: "wrap" }}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name *"
                  required
                  maxLength={128}
                  style={{
                    flex: "1 1 160px",
                    padding: "0.65rem 0.9rem",
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.9rem",
                    border: "1px solid rgba(139,105,20,0.25)",
                    borderRadius: "4px",
                    background: "#fff",
                    color: "#333",
                    outline: "none",
                    minWidth: "0",
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email (so he can reply)"
                  maxLength={320}
                  style={{
                    flex: "1 1 200px",
                    padding: "0.65rem 0.9rem",
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.9rem",
                    border: "1px solid rgba(139,105,20,0.25)",
                    borderRadius: "4px",
                    background: "#fff",
                    color: "#333",
                    outline: "none",
                    minWidth: "0",
                  }}
                />
              </div>

              {/* Question */}
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything. The weirder the better."
                required
                maxLength={2000}
                style={{
                  width: "100%",
                  minHeight: "110px",
                  padding: "0.8rem 1rem",
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                  border: "1px solid rgba(139,105,20,0.25)",
                  borderRadius: "4px",
                  background: "#fff",
                  color: "#333",
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                  marginBottom: "0.75rem",
                }}
              />

              <button
                type="submit"
                disabled={submit.isPending || !name.trim() || !question.trim()}
                style={{
                  width: "100%",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "0.75rem",
                  background: submit.isPending ? "#999" : "#111",
                  color: "#F5F0E0",
                  border: "none",
                  borderRadius: "3px",
                  cursor: submit.isPending ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                {submit.isPending ? "Sending…" : "Send to Tony →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ── TRIGGER BUTTON ── */
interface AskTonyButtonProps {
  postTitle?: string;
  postSlug?: string;
}

export function AskTonyButton({ postTitle, postSlug }: AskTonyButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div style={{ textAlign: "center", margin: "2rem 0 1rem" }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "0.65rem 1.8rem",
            background: "transparent",
            color: "#8B6914",
            border: "1px solid rgba(139,105,20,0.35)",
            borderRadius: "3px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(139,105,20,0.06)";
            e.currentTarget.style.borderColor = "#8B6914";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(139,105,20,0.35)";
          }}
        >
          ✦ Ask Tony Directly
        </button>
      </div>
      {open && (
        <AskTonyModal
          postTitle={postTitle}
          postSlug={postSlug}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
