import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

interface BlogCommentsProps {
  postSlug: string;
  postTitle?: string;
}

export default function BlogComments({ postSlug, postTitle }: BlogCommentsProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data: comments, refetch } = trpc.comments.list.useQuery(
    { postSlug },
    { staleTime: 30_000 }
  );

  const addComment = trpc.comments.add.useMutation({
    onSuccess: () => {
      setContent("");
      setName("");
      setEmail("");
      setSubmitting(false);
      setSubmitted(true);
      refetch();
    },
    onError: () => {
      setSubmitting(false);
    },
  });

  const deleteComment = trpc.comments.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedContent = content.trim();
    const trimmedName = (user?.name || name).trim();
    if (!trimmedContent || !trimmedName || submitting) return;
    setSubmitting(true);
    addComment.mutate({
      postSlug,
      content: trimmedContent,
      name: trimmedName,
      email: email.trim() || undefined,
      postTitle,
    });
  };

  const commentCount = comments?.length || 0;

  return (
    <div style={{ maxWidth: "780px", marginTop: "2rem", marginBottom: "2rem" }}>
      {/* Header */}
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.78rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "#8B6914",
        marginBottom: "1rem",
        paddingBottom: "0.4rem",
        borderBottom: "1px solid rgba(139,105,20,0.15)",
      }}>
        DISCOURSE {commentCount > 0 && `· ${commentCount}`}
      </div>

      {/* Submission confirmation */}
      {submitted && (
        <div style={{
          padding: "1rem 1.2rem",
          background: "rgba(139,105,20,0.06)",
          border: "1px solid rgba(139,105,20,0.2)",
          borderRadius: "4px",
          marginBottom: "1.5rem",
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: "0.92rem",
          color: "#555",
        }}>
          ✦ Your thought has been received. Thank you for adding to the conversation.
        </div>
      )}

      {/* Comment Form */}
      {!submitted && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
          {/* Name + Email row for anonymous users */}
          {!user && (
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name *"
                required
                maxLength={128}
                style={{
                  flex: "1 1 180px",
                  padding: "0.65rem 0.9rem",
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.9rem",
                  border: "1px solid rgba(139,105,20,0.25)",
                  borderRadius: "4px",
                  background: "#FAFAF7",
                  color: "#333",
                  outline: "none",
                  minWidth: "0",
                }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (optional, not published)"
                maxLength={320}
                style={{
                  flex: "1 1 220px",
                  padding: "0.65rem 0.9rem",
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.9rem",
                  border: "1px solid rgba(139,105,20,0.25)",
                  borderRadius: "4px",
                  background: "#FAFAF7",
                  color: "#333",
                  outline: "none",
                  minWidth: "0",
                }}
              />
            </div>
          )}
          {user && (
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              color: "#8B6914",
              marginBottom: "0.5rem",
              letterSpacing: "0.05em",
            }}>
              Commenting as {user.name}
            </div>
          )}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What does this stir in you? Add to the conversation…"
            maxLength={2000}
            required
            style={{
              width: "100%",
              minHeight: "90px",
              padding: "0.8rem 1rem",
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "0.95rem",
              lineHeight: 1.6,
              border: "1px solid rgba(139,105,20,0.25)",
              borderRadius: "4px",
              background: "#FAFAF7",
              color: "#333",
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: "0.75rem",
            }}
          />
          <button
            type="submit"
            disabled={submitting || !content.trim() || (!user && !name.trim())}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "0.55rem 1.4rem",
              background: submitting ? "#999" : "#111",
              color: "#F5F0E0",
              border: "none",
              borderRadius: "3px",
              cursor: submitting ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {submitting ? "Sending…" : "Leave Your Thought"}
          </button>
        </form>
      )}

      {/* Comments List */}
      {comments && comments.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                padding: "1rem 1.2rem",
                background: "#FAFAF7",
                border: "1px solid rgba(0,0,0,0.04)",
                borderRadius: "4px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.72rem",
                  color: "#8B6914",
                  fontWeight: 600,
                }}>
                  {comment.userName}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.68rem",
                    color: "#999",
                  }}>
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {user && user.id === comment.userId && (
                    <button
                      onClick={() => deleteComment.mutate({ commentId: comment.id })}
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.65rem",
                        color: "#999",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0.2rem 0.4rem",
                      }}
                      title="Delete comment"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
              <p style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.92rem",
                lineHeight: 1.6,
                color: "#333",
                margin: 0,
                whiteSpace: "pre-wrap",
              }}>
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {comments && comments.length === 0 && (
        <p style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: "0.9rem",
          color: "#999",
          fontStyle: "italic",
          textAlign: "center",
          padding: "1rem 0",
        }}>
          Be the first to add to this conversation.
        </p>
      )}
    </div>
  );
}
