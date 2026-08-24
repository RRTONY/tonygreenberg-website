import React, { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";

const SLUG = "frqncy-the-bus-that-restores-the-world";

export default function GuestEditor() {
  const [passphrase, setPassphrase] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [content, setContent] = useState("");
  const [contributorName, setContributorName] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const verifyMutation = trpc.guestEdit.verify.useMutation({
    onSuccess: (data) => {
      setContent(data.content);
      setContributorName(data.contributorName);
      setUnlocked(true);
      setError("");
    },
    onError: (err) => {
      setError(err.message === "Wrong passphrase" ? "Wrong passphrase. Try again." : "Something went wrong.");
    },
  });

  const saveMutation = trpc.guestEdit.save.useMutation({
    onSuccess: () => {
      setSaved(true);
      setSaving(false);
      setTimeout(() => setSaved(false), 4000);
    },
    onError: () => {
      setSaving(false);
      setError("Save failed. Try again.");
    },
  });

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    verifyMutation.mutate({ slug: SLUG, passphrase });
  };

  const handleSave = () => {
    if (!content.trim()) return;
    setSaving(true);
    setError("");
    saveMutation.mutate({ slug: SLUG, passphrase, content });
  };

  const mono = "'DM Mono', monospace";
  const serif = "'Playfair Display', serif";
  const sans = "'Source Sans 3', sans-serif";
  const gold = "#8B6914";
  const parchment = "#FAFAF7";
  const dark = "#0A0A10";

  if (!unlocked) {
    return (
      <div style={{ minHeight: "100vh", background: parchment, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>
          {/* Header */}
          <div style={{ fontFamily: mono, fontSize: "0.6rem", letterSpacing: "0.28em", textTransform: "uppercase", color: gold, marginBottom: "0.75rem" }}>
            FRQNCY · Contributor Access
          </div>
          <h1 style={{ fontFamily: serif, fontSize: "1.8rem", color: dark, marginBottom: "0.5rem", fontWeight: 400 }}>
            Edit Your Article
          </h1>
          <p style={{ fontFamily: sans, fontSize: "0.95rem", color: "#666", marginBottom: "2.5rem", lineHeight: 1.6 }}>
            Tony gave you a passphrase. Type it below and you're in.
          </p>

          <form onSubmit={handleUnlock}>
            <input
              type="password"
              value={passphrase}
              onChange={e => setPassphrase(e.target.value)}
              placeholder="your passphrase"
              autoFocus
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                fontFamily: mono,
                fontSize: "0.85rem",
                letterSpacing: "0.1em",
                border: `1px solid ${error ? "#c0392b" : "rgba(139,105,20,0.3)"}`,
                borderRadius: "3px",
                background: "#fff",
                color: dark,
                outline: "none",
                marginBottom: "0.75rem",
                boxSizing: "border-box",
              }}
            />
            {error && (
              <p style={{ fontFamily: mono, fontSize: "0.65rem", color: "#c0392b", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={verifyMutation.isPending || !passphrase}
              style={{
                width: "100%",
                padding: "0.85rem",
                fontFamily: mono,
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                background: gold,
                color: parchment,
                border: "none",
                borderRadius: "3px",
                cursor: verifyMutation.isPending ? "wait" : "pointer",
                opacity: verifyMutation.isPending || !passphrase ? 0.6 : 1,
              }}
            >
              {verifyMutation.isPending ? "Checking..." : "Enter"}
            </button>
          </form>

          <p style={{ fontFamily: sans, fontSize: "0.78rem", color: "#aaa", marginTop: "2rem" }}>
            Don't have a passphrase? Text Tony.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: parchment }}>
      {/* Top bar */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: dark,
        padding: "0.85rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid rgba(139,105,20,0.3)`,
      }}>
        <div>
          <span style={{ fontFamily: mono, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(196,168,130,0.7)" }}>
            Editing as
          </span>
          <span style={{ fontFamily: mono, fontSize: "0.7rem", letterSpacing: "0.1em", color: "#D4B96A", marginLeft: "0.5rem" }}>
            {contributorName}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {saved && (
            <span style={{ fontFamily: mono, fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#4CAF50" }}>
              ✓ Saved & Live
            </span>
          )}
          {error && (
            <span style={{ fontFamily: mono, fontSize: "0.6rem", color: "#e74c3c" }}>{error}</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !content.trim()}
            style={{
              padding: "0.5rem 1.25rem",
              fontFamily: mono,
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              background: gold,
              color: parchment,
              border: "none",
              borderRadius: "3px",
              cursor: saving ? "wait" : "pointer",
              opacity: saving || !content.trim() ? 0.6 : 1,
            }}
          >
            {saving ? "Saving..." : "Save & Publish"}
          </button>
        </div>
      </div>

      {/* Editor area */}
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "3rem 2rem" }}>
        <div style={{ fontFamily: mono, fontSize: "0.55rem", letterSpacing: "0.28em", textTransform: "uppercase", color: gold, marginBottom: "0.5rem" }}>
          FRQNCY: The Bus That Restores the World
        </div>
        <p style={{ fontFamily: sans, fontSize: "0.85rem", color: "#888", marginBottom: "1.5rem", lineHeight: 1.5 }}>
          Write in plain text. Use **bold** for emphasis, *italic* for titles, and blank lines between paragraphs.
          What you type here goes live on tonygreenberg.com the moment you hit Save.
        </p>

        <textarea
          ref={textareaRef}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Start writing here. Your words go live when you save."
          style={{
            width: "100%",
            minHeight: "70vh",
            padding: "1.5rem",
            fontFamily: sans,
            fontSize: "1rem",
            lineHeight: 1.8,
            color: dark,
            background: "#fff",
            border: "1px solid rgba(139,105,20,0.2)",
            borderRadius: "3px",
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
          <span style={{ fontFamily: mono, fontSize: "0.6rem", color: "#aaa", letterSpacing: "0.1em" }}>
            {content.split(/\s+/).filter(Boolean).length} words
          </span>
          <button
            onClick={handleSave}
            disabled={saving || !content.trim()}
            style={{
              padding: "0.75rem 2rem",
              fontFamily: mono,
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              background: gold,
              color: parchment,
              border: "none",
              borderRadius: "3px",
              cursor: saving ? "wait" : "pointer",
              opacity: saving || !content.trim() ? 0.6 : 1,
            }}
          >
            {saving ? "Saving..." : "Save & Publish"}
          </button>
        </div>

        <div style={{ marginTop: "3rem", padding: "1.25rem", background: "#F5F0E8", borderRadius: "3px", border: "1px solid rgba(139,105,20,0.15)" }}>
          <div style={{ fontFamily: mono, fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: gold, marginBottom: "0.5rem" }}>
            How this works
          </div>
          <ul style={{ fontFamily: sans, fontSize: "0.85rem", color: "#555", lineHeight: 1.8, margin: 0, paddingLeft: "1.2rem" }}>
            <li>Type your changes in the box above.</li>
            <li>Hit <strong>Save & Publish</strong> — your version goes live on tonygreenberg.com immediately.</li>
            <li>You can come back and edit again anytime with the same passphrase.</li>
            <li>Tony can see everything you change.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
