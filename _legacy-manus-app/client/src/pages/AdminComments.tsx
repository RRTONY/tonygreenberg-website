import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";

type Comment = {
  id: number;
  postSlug: string;
  userId: number | null;
  userName: string;
  anonEmail: string | null;
  content: string;
  parentId: number | null;
  createdAt: Date;
};

export default function AdminComments() {
  const { user, loading } = useAuth();
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sent, setSent] = useState<number | null>(null);
  const [filter, setFilter] = useState("");

  const { data: comments, isLoading, refetch } = trpc.comments.listAll.useQuery(undefined, {
    enabled: !!user && (user as any).role === "admin",
  });

  const deleteComment = trpc.comments.delete.useMutation({
    onSuccess: () => refetch(),
  });

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#FAFAF7", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", color: "#999", letterSpacing: "0.12em" }}>LOADING…</div>
    </div>
  );

  if (!user || (user as any).role !== "admin") return (
    <div style={{ minHeight: "100vh", background: "#FAFAF7", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", color: "#c00", letterSpacing: "0.12em" }}>ACCESS DENIED</div>
    </div>
  );

  const filtered = (comments || []).filter((c: Comment) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return c.userName.toLowerCase().includes(q) || c.content.toLowerCase().includes(q) || c.postSlug.toLowerCase().includes(q);
  });

  const handleReply = async () => {
    if (!replyTo || !replyText.trim()) return;
    const email = replyTo.anonEmail;
    if (!email) {
      alert("No email address for this reader — cannot send reply.");
      return;
    }
    // Open mailto with pre-filled reply
    const subject = encodeURIComponent(`Re: Your comment on "${replyTo.postSlug}"`);
    const body = encodeURIComponent(
      `Hi ${replyTo.userName},\n\nThank you for your comment on "${replyTo.postSlug}":\n\n"${replyTo.content}"\n\n${replyText}\n\n— Tony\ntonygreenberg.com`
    );
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
    setSent(replyTo.id);
    setReplyTo(null);
    setReplyText("");
  };

  const formatDate = (d: Date) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF7", fontFamily: "'Source Sans 3', sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#0A0A10", borderBottom: "1px solid rgba(139,105,20,0.3)", padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link href="/" style={{ color: "rgba(212,185,106,0.7)", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.12em", textDecoration: "none" }}>← SITE</Link>
          <span style={{ color: "#D4B96A", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", letterSpacing: "0.15em" }}>READER COMMENTS</span>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/admin/assessments" style={{ color: "rgba(212,185,106,0.6)", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", textDecoration: "none" }}>ASSESSMENTS</Link>
          <Link href="/analytics" style={{ color: "rgba(212,185,106,0.6)", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", textDecoration: "none" }}>ANALYTICS</Link>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Stats bar */}
        <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem", padding: "1rem 1.5rem", background: "#fff", border: "1px solid rgba(139,105,20,0.15)", borderRadius: "4px" }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#999", letterSpacing: "0.12em", marginBottom: "0.25rem" }}>TOTAL COMMENTS</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "#2C1810" }}>{(comments || []).length}</div>
          </div>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#999", letterSpacing: "0.12em", marginBottom: "0.25rem" }}>WITH EMAIL</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "#2C1810" }}>{(comments || []).filter((c: Comment) => c.anonEmail).length}</div>
          </div>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#999", letterSpacing: "0.12em", marginBottom: "0.25rem" }}>UNIQUE ARTICLES</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "#2C1810" }}>{new Set((comments || []).map((c: Comment) => c.postSlug)).size}</div>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Filter by name, article, or content…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            marginBottom: "1.5rem",
            border: "1px solid rgba(139,105,20,0.2)",
            borderRadius: "4px",
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "0.95rem",
            background: "#fff",
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        {/* Comments list */}
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#999", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", letterSpacing: "0.1em" }}>LOADING COMMENTS…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#999", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", letterSpacing: "0.1em" }}>
            {filter ? "NO COMMENTS MATCH YOUR FILTER" : "NO COMMENTS YET — THE DISCOURSE AWAITS"}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filtered.map((comment: Comment) => (
              <div key={comment.id} style={{
                background: "#fff",
                border: sent === comment.id ? "1px solid #2a7d3f" : "1px solid rgba(139,105,20,0.15)",
                borderLeft: sent === comment.id ? "3px solid #2a7d3f" : "3px solid rgba(139,105,20,0.3)",
                borderRadius: "4px",
                padding: "1.25rem 1.5rem",
                transition: "border-color 0.3s",
              }}>
                {/* Comment header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <span style={{ fontWeight: 600, color: "#2C1810", fontSize: "0.95rem" }}>{comment.userName}</span>
                    {comment.anonEmail && (
                      <span style={{ marginLeft: "0.5rem", fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "#8B6914" }}>
                        &lt;{comment.anonEmail}&gt;
                      </span>
                    )}
                    <div style={{ marginTop: "0.2rem" }}>
                      <Link href={`/blog/${comment.postSlug}`} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#999", letterSpacing: "0.08em", textDecoration: "none" }}>
                        {comment.postSlug}
                      </Link>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#bbb" }}>{formatDate(comment.createdAt)}</span>
                    {sent === comment.id && (
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#2a7d3f", letterSpacing: "0.08em" }}>✓ REPLIED</span>
                    )}
                  </div>
                </div>

                {/* Comment body */}
                <p style={{ fontSize: "0.95rem", lineHeight: 1.65, color: "#333", margin: "0 0 1rem 0", fontStyle: "italic" }}>
                  "{comment.content}"
                </p>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  {comment.anonEmail && (
                    <button
                      onClick={() => { setReplyTo(comment); setReplyText(""); }}
                      style={{
                        padding: "0.45rem 1rem",
                        background: "#8B6914",
                        color: "#FAFAF7",
                        border: "none",
                        borderRadius: "3px",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.7rem",
                        letterSpacing: "0.1em",
                        cursor: "pointer",
                      }}
                    >
                      REPLY
                    </button>
                  )}
                  <a
                    href={`/blog/${comment.postSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "0.45rem 1rem",
                      background: "transparent",
                      color: "#8B6914",
                      border: "1px solid rgba(139,105,20,0.3)",
                      borderRadius: "3px",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.7rem",
                      letterSpacing: "0.1em",
                      textDecoration: "none",
                    }}
                  >
                    VIEW ARTICLE
                  </a>
                  <button
                    onClick={() => {
                      if (confirm("Delete this comment?")) {
                        deleteComment.mutate({ commentId: comment.id });
                      }
                    }}
                    style={{
                      padding: "0.45rem 1rem",
                      background: "transparent",
                      color: "#c00",
                      border: "1px solid rgba(200,0,0,0.2)",
                      borderRadius: "3px",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.7rem",
                      letterSpacing: "0.1em",
                      cursor: "pointer",
                    }}
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply modal */}
      {replyTo && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
        }} onClick={e => { if (e.target === e.currentTarget) setReplyTo(null); }}>
          <div style={{
            background: "#FAFAF7", borderRadius: "6px", padding: "2rem",
            maxWidth: "560px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: "#8B6914", marginBottom: "1rem" }}>
              REPLY TO {replyTo.userName.toUpperCase()} · {replyTo.anonEmail}
            </div>
            <div style={{
              background: "rgba(139,105,20,0.06)", border: "1px solid rgba(139,105,20,0.15)",
              borderRadius: "4px", padding: "0.75rem 1rem", marginBottom: "1rem",
              fontStyle: "italic", fontSize: "0.9rem", color: "#666", lineHeight: 1.6,
            }}>
              "{replyTo.content}"
            </div>
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Write your reply…"
              rows={5}
              style={{
                width: "100%", padding: "0.75rem 1rem", border: "1px solid rgba(139,105,20,0.25)",
                borderRadius: "4px", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem",
                lineHeight: 1.6, resize: "vertical", outline: "none", boxSizing: "border-box",
                background: "#fff",
              }}
            />
            <p style={{ fontSize: "0.8rem", color: "#999", margin: "0.5rem 0 1rem", fontStyle: "italic" }}>
              This will open your email client with a pre-filled reply to {replyTo.anonEmail}.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button onClick={() => setReplyTo(null)} style={{
                padding: "0.6rem 1.25rem", background: "transparent", border: "1px solid rgba(139,105,20,0.25)",
                borderRadius: "3px", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem",
                letterSpacing: "0.1em", cursor: "pointer", color: "#666",
              }}>CANCEL</button>
              <button onClick={handleReply} disabled={!replyText.trim()} style={{
                padding: "0.6rem 1.5rem", background: replyText.trim() ? "#8B6914" : "#ccc",
                color: "#FAFAF7", border: "none", borderRadius: "3px",
                fontFamily: "'DM Mono', monospace", fontSize: "0.75rem",
                letterSpacing: "0.1em", cursor: replyText.trim() ? "pointer" : "default",
              }}>SEND REPLY</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
