/**
 * Assessment page — 5 questions, one at a time, smooth transitions, scoring, results.
 * Uses the EXISTING site visual style: parchment bg, gold accents, Playfair/Source Sans/DM Mono.
 */
import { useState, useCallback } from "react";
import { Link } from "wouter";
import { ASSESSMENT_QUESTIONS, ARCHETYPES, type ArchetypeKey } from "@/data/archetypes";
import { AUTHORITY_ITEMS } from "@/data/archetypes";
import { useBehavior } from "@/hooks/useBehavior";
import { trpc } from "@/lib/trpc";
import SEO from "@/components/SEO";

export default function Assessment() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({ builder: 0, crusader: 0, investor: 0 });
  const [result, setResult] = useState<ArchetypeKey | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subError, setSubError] = useState("");
  const { setArchetype } = useBehavior();
  const subscribeMutation = trpc.subscribe.add.useMutation({
    onSuccess: () => setSubscribed(true),
    onError: (err) => setSubError(err.message),
  });

  const handleSubscribe = () => {
    if (!email || subscribed) return;
    setSubError("");
    subscribeMutation.mutate({
      email,
      source: result ? `assessment-${result}` : "assessment",
    });
  };

  const handleAnswer = useCallback(
    (archetype: ArchetypeKey) => {
      const newScores = { ...scores, [archetype]: scores[archetype] + 1 };
      setScores(newScores);

      if (step < ASSESSMENT_QUESTIONS.length - 1) {
        setStep(step + 1);
      } else {
        const winner = (Object.entries(newScores) as [ArchetypeKey, number][]).reduce((a, b) =>
          a[1] >= b[1] ? a : b
        )[0];
        setResult(winner);
        setArchetype(winner);
      }
    },
    [step, scores, setArchetype]
  );

  const q = ASSESSMENT_QUESTIONS[step];
  const arch = result ? ARCHETYPES[result] : null;

  return (
    <>
    <SEO
        title="Assessment"
        description="Take a diagnostic assessment to clarify your thinking, identify your gaps, and find your next move."
        path="/assessment"
        keywords="Tony Greenberg, assessment, diagnostic, self-assessment"
        indexable={true}
      />
      <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      {/* Authority bar */}
      <div
        style={{
          background: "#1A1A1A",
          padding: "10px 0",
          textAlign: "center",
          letterSpacing: "0.15em",
          fontSize: "11px",
          fontFamily: "'DM Mono', monospace",
          color: "#D4B96A",
        }}
      >
        {AUTHORITY_ITEMS.join("  ·  ")}
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px 120px" }}>
        {!result ? (
          <>
            {/* Progress */}
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 12,
                letterSpacing: "0.15em",
                color: "#8B6914",
                marginBottom: 8,
                textTransform: "uppercase",
              }}
            >
              Question {step + 1} of {ASSESSMENT_QUESTIONS.length}
            </div>
            <div
              style={{
                height: 3,
                background: "#E8E4DA",
                borderRadius: 2,
                marginBottom: 48,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${((step + 1) / ASSESSMENT_QUESTIONS.length) * 100}%`,
                  background: "#8B6914",
                  transition: "width 0.4s ease",
                  borderRadius: 2,
                }}
              />
            </div>

            {/* Question */}
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(24px, 4vw, 36px)",
                color: "#111",
                lineHeight: 1.3,
                marginBottom: 40,
              }}
            >
              {q.question}
            </h2>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.archetype)}
                  style={{
                    background: "#fff",
                    border: "1px solid #D4C9A8",
                    borderRadius: 8,
                    padding: "20px 24px",
                    textAlign: "left",
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: 17,
                    color: "#222",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    lineHeight: 1.5,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#8B6914";
                    e.currentTarget.style.background = "#FFFDF5";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#D4C9A8";
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </>
        ) : (
          /* Results */
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{arch!.icon}</div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(32px, 5vw, 48px)",
                color: "#111",
                marginBottom: 8,
              }}
            >
              {arch!.name}
            </h1>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 13,
                letterSpacing: "0.2em",
                color: "#8B6914",
                textTransform: "uppercase",
                marginBottom: 32,
              }}
            >
              {arch!.tagline}
            </div>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 18,
                color: "#333",
                lineHeight: 1.7,
                maxWidth: 560,
                margin: "0 auto 40px",
              }}
            >
              {arch!.description}
            </p>

            {/* Where do you want to start? */}
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#8B6914",
                marginBottom: 20,
              }}
            >
              Where do you want to start?
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                maxWidth: 480,
                margin: "0 auto 40px",
              }}
            >
              <Link
                href="/impact-dashboard"
                style={{
                  display: "block",
                  background: "#8B6914",
                  color: "#fff",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 13,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "16px 24px",
                  borderRadius: 6,
                  textDecoration: "none",
                  textAlign: "center",
                }}
              >
                Go to My Dashboard →
              </Link>
              <Link
                href="/soulscore"
                style={{
                  display: "block",
                  background: "#fff",
                  color: "#111",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 13,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "16px 24px",
                  borderRadius: 6,
                  textDecoration: "none",
                  textAlign: "center",
                  border: "1px solid #D4C9A8",
                }}
              >
                Explore the SoulScore →
              </Link>
              <Link
                href="/find-your-me"
                style={{
                  display: "block",
                  background: "#fff",
                  color: "#111",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 13,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "16px 24px",
                  borderRadius: 6,
                  textDecoration: "none",
                  textAlign: "center",
                  border: "1px solid #D4C9A8",
                }}
              >
                Find Your Me →
              </Link>
              <Link
                href="/living-declaration"
                style={{
                  display: "block",
                  background: "#fff",
                  color: "#111",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 13,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "16px 24px",
                  borderRadius: 6,
                  textDecoration: "none",
                  textAlign: "center",
                  border: "1px solid #D4C9A8",
                }}
              >
                Read the Living Declaration →
              </Link>
              <Link
                href="/blog/boiling-the-human-summit-harvard-kurzweil"
                style={{
                  display: "block",
                  background: "#fff",
                  color: "#111",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 13,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "16px 24px",
                  borderRadius: 6,
                  textDecoration: "none",
                  textAlign: "center",
                  border: "1px solid #D4C9A8",
                }}
              >
                Read "Boiling the Human" →
              </Link>
              <Link
                href="/humanos"
                style={{
                  display: "block",
                  background: "#0A0A10",
                  color: "#e53e3e",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 13,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "16px 24px",
                  borderRadius: 6,
                  textDecoration: "none",
                  textAlign: "center",
                  border: "1px solid rgba(229,62,62,0.4)",
                }}
              >
                Explore Human OS V2.0 →
              </Link>
            </div>

            {/* Email capture */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #D4C9A8",
                borderRadius: 8,
                padding: "32px 24px",
                maxWidth: 480,
                margin: "0 auto 32px",
              }}
            >
              <p
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: 15,
                  color: "#444",
                  marginBottom: 16,
                }}
              >
                Get essays curated for your archetype — delivered weekly.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    border: "1px solid #D4C9A8",
                    borderRadius: 4,
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: 15,
                    background: "#FAFAF7",
                    color: "#222",
                  }}
                />
                <button
                  onClick={handleSubscribe}
                  disabled={subscribeMutation.isPending || subscribed || !email}
                  style={{
                    background: subscribed ? "#2D5A27" : "#8B6914",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    padding: "10px 20px",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 12,
                    letterSpacing: "0.1em",
                    cursor: subscribed ? "default" : "pointer",
                    opacity: subscribeMutation.isPending ? 0.7 : 1,
                  }}
                >
                  {subscribed ? "Subscribed ✓" : subscribeMutation.isPending ? "..." : "Subscribe"}
                </button>
              </div>
            </div>

            <a
              href="https://impactsoul.is"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 12,
                letterSpacing: "0.1em",
                color: "#8B6914",
                textDecoration: "none",
              }}
            >
              Explore ImpactSoul →
            </a>
          </div>
        )}
      </div>
    </div>
    </>);
}
