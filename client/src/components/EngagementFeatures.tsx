/**
 * Engagement Features — Reusable components for the 10 engagement features
 * 1. ReadingStreakBadge — flame icon in nav showing streak
 * 2. HighlightSaveButton — floating button when text is selected
 * 3. MicroCommitmentBox — "What will you do differently?" after blog rating
 * 4. ProvocationBlock — homepage dynamic provocation
 * 5. ReferralTracker — records referral code from URL on page load
 */
import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

// ── 1. Reading Streak Badge ──
export function ReadingStreakBadge() {
  const { isAuthenticated } = useAuth();
  const { data: streak } = trpc.streaks.get.useQuery(undefined, { enabled: isAuthenticated });
  const recordMutation = trpc.streaks.record.useMutation({
    onSuccess: (data) => {
      if (data?.milestone === 7) {
        toast.success("7-Day Streak! You've unlocked a hidden essay.", { duration: 6000 });
      } else if (data?.milestone === 30) {
        toast.success("30-Day Streak! A hidden essay awaits you.", { duration: 6000 });
      }
    },
  });

  // Record a read on mount (once per page load)
  useEffect(() => {
    if (isAuthenticated) {
      recordMutation.mutate();
    }
  }, [isAuthenticated]); // eslint-disable-line

  if (!streak || streak.currentStreak < 2) return null;

  return (
    <div
      title={`${streak.currentStreak}-day reading streak! (Best: ${streak.longestStreak})`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.7rem",
        color: "#D4B96A",
        padding: "4px 8px",
        borderRadius: 12,
        background: "rgba(212,185,106,0.1)",
      }}
    >
      <span style={{ fontSize: "0.9rem" }}>🔥</span>
      {streak.currentStreak}
    </div>
  );
}

// ── 2. Highlight Save Button (appears on text selection) ──
export function HighlightSaveButton({ postSlug }: { postSlug: string }) {
  const { isAuthenticated } = useAuth();
  const [selection, setSelection] = useState<{ text: string; x: number; y: number } | null>(null);
  const saveMutation = trpc.highlights.save.useMutation({
    onSuccess: () => {
      toast.success("Saved to your Commonplace Book");
      setSelection(null);
    },
  });

  const handleMouseUp = useCallback(() => {
    if (!isAuthenticated) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      setSelection(null);
      return;
    }
    const text = sel.toString().trim();
    if (text.length < 10 || text.length > 2000) {
      setSelection(null);
      return;
    }
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setSelection({ text, x: rect.left + rect.width / 2, y: rect.top - 10 });
  }, [isAuthenticated]);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseUp]);

  if (!selection) return null;

  return (
    <button
      onClick={() => saveMutation.mutate({ postSlug, text: selection.text })}
      style={{
        position: "fixed",
        left: Math.min(selection.x, window.innerWidth - 120),
        top: Math.max(selection.y + window.scrollY - 40, 10),
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: "#0A0A10",
        color: "#D4B96A",
        border: "1px solid #D4B96A",
        borderRadius: 8,
        padding: "6px 14px",
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.7rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        cursor: "pointer",
        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
        whiteSpace: "nowrap",
      }}
    >
      {saveMutation.isPending ? "Saving..." : "Save Highlight"}
    </button>
  );
}

// ── 3. Micro-Commitment Box ──
export function MicroCommitmentBox({ postSlug }: { postSlug: string }) {
  const [commitment, setCommitment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { data: existing } = trpc.commitments.getForPost.useQuery({ postSlug });
  const submitMutation = trpc.commitments.submit.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  const sessionId = typeof window !== "undefined"
    ? (sessionStorage.getItem("tg_sid") || Math.random().toString(36).slice(2))
    : "";

  if (submitted) {
    return (
      <div style={{
        background: "rgba(212,185,106,0.06)", border: "1px solid rgba(212,185,106,0.2)",
        borderRadius: 12, padding: "24px", textAlign: "center", marginTop: 32,
      }}>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#8B6914", fontSize: "1rem" }}>
          Commitment recorded. Come back and tell us how it went.
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 32, padding: "28px", background: "white", border: "1px solid #e8e4dc", borderRadius: 14 }}>
      <p style={{
        fontFamily: "'DM Mono', monospace", fontSize: "0.72rem",
        letterSpacing: "0.1em", textTransform: "uppercase",
        color: "#8B6914", marginBottom: 8,
      }}>
        Micro-Commitment
      </p>
      <p style={{
        fontFamily: "'Playfair Display', serif", fontSize: "1.3rem",
        color: "#0A0A10", marginBottom: 16, lineHeight: 1.3,
      }}>
        What's one thing you'll do differently after reading this?
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="text"
          value={commitment}
          onChange={(e) => setCommitment(e.target.value)}
          placeholder="I will..."
          maxLength={500}
          style={{
            flex: 1, padding: "12px 16px", border: "1px solid #e0dcd4",
            borderRadius: 8, fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "1rem", outline: "none",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && commitment.trim()) {
              submitMutation.mutate({ postSlug, commitment: commitment.trim(), sessionId });
            }
          }}
        />
        <button
          onClick={() => {
            if (commitment.trim()) submitMutation.mutate({ postSlug, commitment: commitment.trim(), sessionId });
          }}
          disabled={!commitment.trim() || submitMutation.isPending}
          style={{
            background: "#0A0A10", color: "#D4B96A",
            fontFamily: "'DM Mono', monospace", fontSize: "0.75rem",
            letterSpacing: "0.08em", textTransform: "uppercase",
            padding: "12px 20px", borderRadius: 8, border: "none",
            cursor: commitment.trim() ? "pointer" : "default",
            opacity: commitment.trim() ? 1 : 0.5,
          }}
        >
          Commit
        </button>
      </div>

      {/* Show previous commitments as social proof */}
      {existing && existing.length > 0 && (
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #f0ece4" }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#bbb", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
            Others committed to:
          </p>
          {existing.slice(0, 3).map((c, i) => (
            <p key={i} style={{
              fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem",
              color: "#666", fontStyle: "italic", marginBottom: 4,
            }}>
              "{c.commitment}"
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 4. Provocation of the Day Block ──
export function ProvocationBlock() {
  const { data: provocation } = trpc.provocation.today.useQuery();

  if (!provocation) return null;

  return (
    <div style={{
      background: "rgba(212,185,106,0.04)",
      borderTop: "1px solid rgba(212,185,106,0.15)",
      borderBottom: "1px solid rgba(212,185,106,0.15)",
      padding: "20px 0",
      textAlign: "center",
    }}>
      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "1.1rem",
        fontStyle: "italic",
        color: "#333",
        maxWidth: 600,
        margin: "0 auto",
        lineHeight: 1.6,
      }}>
        "{provocation.text}"
      </p>
      {provocation.sourceSlug && (
        <a
          href={`/blog/${provocation.sourceSlug}`}
          style={{
            fontFamily: "'DM Mono', monospace", fontSize: "0.68rem",
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: "#8B6914", textDecoration: "none", marginTop: 8,
            display: "inline-block",
          }}
        >
          Read the full essay →
        </a>
      )}
    </div>
  );
}

// ── 5. Referral Tracker (records referral code from URL) ──
export function ReferralTracker() {
  const { isAuthenticated } = useAuth();
  const recordMutation = trpc.referral.record.useMutation();

  useEffect(() => {
    if (!isAuthenticated) return;
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get("ref");
    if (refCode) {
      // Store it and try to record
      const alreadyRecorded = localStorage.getItem("tg_ref_recorded");
      if (!alreadyRecorded) {
        recordMutation.mutate({ code: refCode });
        localStorage.setItem("tg_ref_recorded", "true");
      }
      // Clean URL
      params.delete("ref");
      const newUrl = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [isAuthenticated]); // eslint-disable-line

  return null;
}
