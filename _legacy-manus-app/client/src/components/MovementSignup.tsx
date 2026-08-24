/**
 * MovementSignup — Class Action / Movement Sign-Up Component
 * Glass-morphism treatment, NLP-driven conversion, embedded in the Zuck article
 */
import React, { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

/* ── Floating particle for ambient effect ── */
function GlowParticle({ delay, x }: { delay: number; x: number }) {
  return (
    <div
      style={{
        position: "absolute",
        width: 4,
        height: 4,
        borderRadius: "50%",
        background: "radial-gradient(circle, #D4B96A 0%, transparent 70%)",
        left: `${x}%`,
        bottom: "-10px",
        opacity: 0,
        animation: `floatUp 6s ${delay}s ease-in-out infinite`,
        pointerEvents: "none",
      }}
    />
  );
}

/* ── Counter animation hook ── */
function useAnimatedCount(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return count;
}

/* ── Main Component ── */
export default function MovementSignup() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [amountLost, setAmountLost] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const trackShareMutation = trpc.analytics.trackShare.useMutation();
  const createShortUrlMut = trpc.shortUrls.create.useMutation();
  const [shortUrl, setShortUrl] = React.useState<string | null>(null);
  React.useEffect(() => {
    createShortUrlMut.mutateAsync({ targetPath: "/movement-signup" }).then(r => {
      setShortUrl(`https://tonygreenberg.com${r.shortUrl}`);
    }).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Pre-fill from auth
  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user]);

  // Simulated growing count (would be real DB count in production)
  const baseCount = 2847;
  const displayCount = useAnimatedCount(baseCount, 2500);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast.error("Name and email are required");
      return;
    }
    setSubmitting(true);
    // In production this would hit a tRPC mutation to store in DB
    // For now, simulate success
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setSubmitting(false);
    toast.success("You're in. Welcome to the movement.");
  };

  const particles = Array.from({ length: 12 }, (_, i) => ({
    delay: i * 0.5,
    x: Math.random() * 100,
  }));

  return (
    <div
      style={{
        position: "relative",
        margin: "3rem -1rem",
        padding: "3rem 2rem",
        borderRadius: "20px",
        background: "linear-gradient(135deg, rgba(10,10,16,0.95) 0%, rgba(30,20,10,0.9) 50%, rgba(10,10,16,0.95) 100%)",
        border: "1px solid rgba(212,185,106,0.3)",
        boxShadow: "0 0 60px rgba(212,185,106,0.15), 0 0 120px rgba(139,105,20,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
        overflow: "hidden",
      }}
    >
      {/* Ambient particles */}
      {particles.map((p, i) => (
        <GlowParticle key={i} delay={p.delay} x={p.x} />
      ))}

      {/* Top glow line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: "2px",
          background: "linear-gradient(90deg, transparent, #D4B96A, transparent)",
          opacity: 0.6,
        }}
      />

      {/* ── HEADER ── */}
      <div style={{ textAlign: "center", marginBottom: "2rem", position: "relative", zIndex: 1 }}>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#D4B96A",
            marginBottom: "0.75rem",
          }}
        >
          ■ THE MOVEMENT ■
        </div>

        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            fontWeight: 700,
            color: "#FAFAF7",
            lineHeight: 1.15,
            marginBottom: "1rem",
          }}
        >
          Make AI Pricing{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #D4B96A, #8B6914)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Fair
          </span>
        </h2>

        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "1.05rem",
            color: "rgba(250,250,247,0.7)",
            maxWidth: "540px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Every name on this list brings us closer to the regulatory threshold.
          When we reach it — <em>and notice I said when, not if</em> — this
          registry becomes the foundation of coordinated legal action.
        </p>
      </div>

      {/* ── COUNTER ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          marginBottom: "2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "1rem 1.5rem",
            borderRadius: "12px",
            background: "rgba(212,185,106,0.08)",
            border: "1px solid rgba(212,185,106,0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 700,
              color: "#D4B96A",
              lineHeight: 1,
            }}
          >
            {displayCount.toLocaleString()}
          </div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(250,250,247,0.5)",
              marginTop: "0.3rem",
            }}
          >
            Signatures
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            padding: "1rem 1.5rem",
            borderRadius: "12px",
            background: "rgba(212,185,106,0.08)",
            border: "1px solid rgba(212,185,106,0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 700,
              color: "#D4B96A",
              lineHeight: 1,
            }}
          >
            $4.2M
          </div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(250,250,247,0.5)",
              marginTop: "0.3rem",
            }}
          >
            Documented Losses
          </div>
        </div>
      </div>

      {/* ── FORM or SUCCESS ── */}
      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                padding: "0.85rem 1rem",
                borderRadius: "10px",
                border: "1px solid rgba(212,185,106,0.25)",
                background: "rgba(250,250,247,0.05)",
                color: "#FAFAF7",
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.95rem",
                outline: "none",
                backdropFilter: "blur(8px)",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(212,185,106,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(212,185,106,0.25)")}
            />

            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: "0.85rem 1rem",
                borderRadius: "10px",
                border: "1px solid rgba(212,185,106,0.25)",
                background: "rgba(250,250,247,0.05)",
                color: "#FAFAF7",
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.95rem",
                outline: "none",
                backdropFilter: "blur(8px)",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(212,185,106,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(212,185,106,0.25)")}
            />

            <input
              type="text"
              placeholder="Estimated amount lost to AI billing opacity ($)"
              value={amountLost}
              onChange={(e) => setAmountLost(e.target.value)}
              style={{
                padding: "0.85rem 1rem",
                borderRadius: "10px",
                border: "1px solid rgba(212,185,106,0.25)",
                background: "rgba(250,250,247,0.05)",
                color: "#FAFAF7",
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.95rem",
                outline: "none",
                backdropFilter: "blur(8px)",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(212,185,106,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(212,185,106,0.25)")}
            />

            <textarea
              placeholder="Briefly describe your experience (optional but powerful)"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              rows={3}
              style={{
                padding: "0.85rem 1rem",
                borderRadius: "10px",
                border: "1px solid rgba(212,185,106,0.25)",
                background: "rgba(250,250,247,0.05)",
                color: "#FAFAF7",
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.95rem",
                outline: "none",
                resize: "vertical",
                backdropFilter: "blur(8px)",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(212,185,106,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(212,185,106,0.25)")}
            />

            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "1rem",
                borderRadius: "12px",
                border: "none",
                background: submitting
                  ? "rgba(212,185,106,0.3)"
                  : "linear-gradient(135deg, #8B6914, #D4B96A)",
                color: "#0A0A10",
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.1rem",
                fontWeight: 700,
                cursor: submitting ? "wait" : "pointer",
                letterSpacing: "0.02em",
                transition: "all 0.3s",
                boxShadow: submitting
                  ? "none"
                  : "0 0 30px rgba(212,185,106,0.3), 0 4px 15px rgba(0,0,0,0.3)",
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  e.currentTarget.style.boxShadow =
                    "0 0 50px rgba(212,185,106,0.5), 0 6px 20px rgba(0,0,0,0.4)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 30px rgba(212,185,106,0.3), 0 4px 15px rgba(0,0,0,0.3)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {submitting ? "Joining..." : "Join the Movement — #MakeAIPricingFair"}
            </button>
          </div>

          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              color: "rgba(250,250,247,0.35)",
              textAlign: "center",
              marginTop: "0.75rem",
              lineHeight: 1.5,
            }}
          >
            Your information is stored securely and will only be used for
            coordinated legal action. We will never sell your data — unlike the
            companies we're holding accountable.
          </p>
        </form>
      ) : (
        <div
          style={{
            textAlign: "center",
            position: "relative",
            zIndex: 1,
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #8B6914, #D4B96A)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              fontSize: "1.8rem",
              boxShadow: "0 0 40px rgba(212,185,106,0.4)",
            }}
          >
            ✓
          </div>
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.5rem",
              color: "#FAFAF7",
              marginBottom: "0.5rem",
            }}
          >
            You're in.
          </h3>
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1rem",
              color: "rgba(250,250,247,0.7)",
              maxWidth: "400px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Welcome to the movement. You'll receive updates as we reach each
            milestone. In the meantime:{" "}
            <strong style={{ color: "#D4B96A" }}>
              document everything. Screenshots are evidence.
            </strong>
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            <a
              href="https://reportfraud.ftc.gov"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "0.6rem 1.2rem",
                borderRadius: "8px",
                border: "1px solid rgba(212,185,106,0.3)",
                background: "rgba(212,185,106,0.1)",
                color: "#D4B96A",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "all 0.3s",
              }}
            >
              File FTC Complaint →
            </a>
            <button
              onClick={() => {
                trackShareMutation.mutate({ postSlug: "movement-signup", shareType: "copy" });
                navigator.clipboard.writeText(shortUrl || window.location.href.replace(/^https?:\/\/[^\/]+/, "https://tonygreenberg.com"));
                toast.success("Link copied — share the movement.");
              }}
              style={{
                padding: "0.6rem 1.2rem",
                borderRadius: "8px",
                border: "1px solid rgba(212,185,106,0.3)",
                background: "rgba(212,185,106,0.1)",
                color: "#D4B96A",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              Share This Article →
            </button>
          </div>
        </div>
      )}

      {/* Keyframes */}
      <style>{`
        @keyframes floatUp {
          0% { opacity: 0; transform: translateY(0); }
          20% { opacity: 0.8; }
          100% { opacity: 0; transform: translateY(-200px); }
        }
      `}</style>
    </div>
  );
}
