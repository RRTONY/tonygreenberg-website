import { useState } from "react";
import { trpc } from "@/lib/trpc";

interface EmailGateProps {
  assessmentName: string;
  onUnlock: () => void;
}

export default function EmailGate({ assessmentName, onUnlock }: EmailGateProps) {
  const [email, setEmail] = useState("");
  const subscribeMutation = trpc.subscribe.add.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    try {
      await subscribeMutation.mutateAsync({
        email,
        source: `assessment-gate:${assessmentName}`,
      });
    } catch {
      // Don't block unlock if API fails
    }
    onUnlock();
  };

  return (
    <div style={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      /* Hero-level spacing for this gate screen */
      padding: "clamp(6rem, 10vw, 8rem) 2rem",
    }}>
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>🔮</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.6rem, 3vw, 2rem)",
          fontWeight: 400,
          color: "#D4B96A",
          lineHeight: 1.3,
          marginBottom: "1rem",
        }}>
          Enter your email to receive your full personalized report
        </h2>
        <p style={{
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: "1.05rem",
          color: "rgba(232,228,220,0.6)",
          lineHeight: 1.8,
          marginBottom: "2.5rem",
        }}>
          Your results are ready. We'll send your full analysis to your inbox along with actionable next steps.
        </p>
        {/* CTA: isolated with 2x breathing room above */}
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            style={{
              flex: 1,
              padding: "0.85rem 1.2rem",
              border: "1px solid rgba(212,185,106,0.3)",
              background: "rgba(255,255,255,0.05)",
              color: "#E8E4DC",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.88rem",
              outline: "none",
              minHeight: "48px",
            }}
          />
          <button
            type="submit"
            disabled={subscribeMutation.isPending}
            style={{
              padding: "0.85rem 1.5rem",
              background: subscribeMutation.isPending ? "#a89050" : "linear-gradient(135deg, #8B6914 0%, #D4B96A 100%)",
              color: "#0A0A10",
              border: "none",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.82rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: subscribeMutation.isPending ? "wait" : "pointer",
              minHeight: "48px",
              transition: "all 0.3s ease",
            }}
          >{subscribeMutation.isPending ? "UNLOCKING..." : "GET MY RESULTS"}</button>
        </form>
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.68rem",
          color: "rgba(232,228,220,0.3)",
          marginTop: "1.5rem",
          letterSpacing: "0.05em",
        }}>
          We respect your privacy. Your results and email are never shared or sold.
        </p>
      </div>
    </div>
  );
}
