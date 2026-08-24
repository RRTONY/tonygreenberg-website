/**
 * THE CLOCK KEEPER CHRONICLES: PART II — Response Form
 * 
 * An interactive page where the Clock Keeper (or anyone) can answer
 * the 5 questions from Part I. Reframed as an offering — not an
 * intellectual challenge, but a container for what already exists.
 * 
 * Supports multiple response modes.
 */

import { useState, useRef } from "react";
import {
  Section,
  FadeIn,
  Divider,
  Spacer,
  Pullquote,
  Eyebrow,
} from "@/components/Editorial";
import SEO from "@/components/SEO";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

/* ── QUESTION DATA ── */

interface QuestionDef {
  key: string;
  num: number;
  title: string;
  prompt: string;
  placeholder: string;
}

const QUESTIONS: QuestionDef[] = [
  {
    key: "q1",
    num: 1,
    title: "The Model",
    prompt: "You developed a model to explain how people behave and what they say. You said you're satisfied with it. What does it look like? Not the full architecture — just enough that someone encountering it could recognize whether they're inside the same pattern.",
    placeholder: "The model, in whatever form it takes...",
  },
  {
    key: "q2",
    num: 2,
    title: "The Practice",
    prompt: "\"Seek first to understand before being understood.\" What did fifty years of that practice teach you that couldn't have been learned any other way? What did it cost? What did it reveal?",
    placeholder: "What understanding taught you...",
  },
  {
    key: "q3",
    num: 3,
    title: "The Spectrum",
    prompt: "Wilber's 8 memes. Where do you sit on that spectrum — and what does the world look like from there? What do the people at the other memes look like from your vantage point?",
    placeholder: "The view from where you stand...",
  },
  {
    key: "q4",
    num: 4,
    title: "The Form",
    prompt: "You said your work was to be understood, and you were of limited success. If successful transmission were possible — not probable, just possible — what form would it take? A book? A conversation? A structure? Silence with annotations?",
    placeholder: "The shape transmission could take...",
  },
  {
    key: "q5",
    num: 5,
    title: "The Offering",
    prompt: "If this were a gift to God — not to Tony, not to humanity, not to posterity — just an offering to the pattern itself. What would you leave?",
    placeholder: "The gift to the pattern...",
  },
];

const MODES = [
  { id: "direct", label: "Direct Response", desc: "Answer 1–5 questions with whatever precision feels right" },
  { id: "meta", label: "The Pattern Itself", desc: "Skip all 5 — just describe the model directly" },
  { id: "reframe", label: "Reframe Entirely", desc: "These are the wrong questions. Provide the right ones." },
  { id: "jazz", label: "Jazz Improvisation", desc: "Pick a theme and let it find its own structure" },
  { id: "minimum", label: "Minimum Viable Trace", desc: "One thing. The most important thing. Nothing else." },
];

type FormData = {
  respondentName: string;
  respondentEmail: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  reframe: string;
};

const EMPTY_FORM: FormData = {
  respondentName: "",
  respondentEmail: "",
  q1: "", q2: "", q3: "", q4: "", q5: "",
  reframe: "",
};

export default function ClockKeeperPartII() {
  const { user } = useAuth();
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submitMutation = trpc.clockKeeper.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setSubmitting(false);
    },
    onError: () => {
      setSubmitting(false);
    },
  });

  const { data: countData } = trpc.clockKeeper.count.useQuery();

  const handleSubmit = () => {
    const hasContent = Object.entries(formData)
      .filter(([k]) => k !== "respondentName" && k !== "respondentEmail")
      .some(([, v]) => v.trim().length > 10);
    if (!hasContent) return;
    setSubmitting(true);
    submitMutation.mutate(formData);
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const answeredCount = Object.entries(formData)
    .filter(([k]) => k.startsWith("q"))
    .filter(([, v]) => v.trim().length > 10)
    .length;

  // Show reframe textarea for modes that need it
  const showReframe = selectedMode === "reframe" || selectedMode === "meta" || selectedMode === "minimum";
  // Show individual questions for modes that need them
  const showQuestions = !showReframe || selectedMode === "reframe";

  return (
    <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      <SEO
        title="The Clock Keeper Chronicles: Part II — Your Response | Tony Greenberg"
        description="Five questions. Not an intellectual challenge — a container for what already exists. A form for the offering, in whatever shape it takes."
        path="/clock-keeper-part-2"
        indexable={true}
      />

      {/* ── CINEMATIC HERO ── */}
      <div
        style={{
          position: "relative",
          minHeight: "85vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A10",
          overflow: "hidden",
        }}
      >
        {/* Animated clock grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.06,
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 80px,
              rgba(212, 185, 106, 0.3) 80px,
              rgba(212, 185, 106, 0.3) 81px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 80px,
              rgba(212, 185, 106, 0.3) 80px,
              rgba(212, 185, 106, 0.3) 81px
            )`,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            padding: "clamp(2rem, 6vw, 5rem)",
            maxWidth: "800px",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.7rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#D4B96A",
              marginBottom: "1.5rem",
            }}
          >
            THE CLOCK KEEPER CHRONICLES
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
              fontWeight: 700,
              color: "#F5F0E0",
              lineHeight: 1.15,
              marginBottom: "1.5rem",
            }}
          >
            Part II:{" "}
            <em style={{ color: "#D4B96A", fontStyle: "italic" }}>
              The Offering
            </em>
          </h1>

          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "clamp(1.05rem, 2vw, 1.2rem)",
              color: "rgba(245, 240, 224, 0.7)",
              lineHeight: 1.8,
              maxWidth: "600px",
              margin: "0 auto 2rem",
            }}
          >
            Not an intellectual challenge. Not an interview.
            A container for what already exists — in whatever
            shape it chooses to take.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={scrollToForm}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#0A0A10",
                background: "#D4B96A",
                border: "none",
                padding: "0.9rem 2.2rem",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#E8D08A";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#D4B96A";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Begin Your Response
            </button>
            <Link
              href="/blog/the-clock-keeper-chronicles-part-1"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(245, 240, 224, 0.6)",
                background: "transparent",
                border: "1px solid rgba(212, 185, 106, 0.3)",
                padding: "0.9rem 2.2rem",
                borderRadius: "4px",
                textDecoration: "none",
                display: "inline-block",
                transition: "all 0.3s",
              }}
            >
              Read Part I First
            </Link>
          </div>

          {countData && countData.count > 0 && (
            <div
              style={{
                marginTop: "2rem",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem",
                color: "rgba(212, 185, 106, 0.5)",
                letterSpacing: "0.15em",
              }}
            >
              {countData.count} {countData.count === 1 ? "response" : "responses"} received
            </div>
          )}
        </div>
      </div>

      {/* ── INTRO SECTION ── */}
      <Section>
        <FadeIn>
          <Eyebrow>THE FORM FOR THE OFFERING</Eyebrow>
          <Pullquote>
            "The form doesn't matter. The trace does."
          </Pullquote>
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "1.1rem",
              lineHeight: 1.9,
              color: "#2A2A2A",
              maxWidth: "680px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            Answer all 5. Answer 1. Reframe them entirely.
            Record a voice memo while stretching. Write it longhand.
            Dictate it to your phone between yoga and cardio.
            The container adapts to whatever shape the offering takes.
          </p>
        </FadeIn>
      </Section>

      <Divider />

      {/* ── MODE SELECTION ── */}
      <Section>
        <FadeIn>
          <Eyebrow>CHOOSE YOUR MODE</Eyebrow>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1rem",
              maxWidth: "900px",
              margin: "2rem auto",
            }}
          >
            {MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                style={{
                  textAlign: "left",
                  padding: "1.5rem",
                  border: selectedMode === mode.id
                    ? "2px solid #D4B96A"
                    : "1px solid #E0DCD4",
                  borderRadius: "8px",
                  background: selectedMode === mode.id
                    ? "rgba(212, 185, 106, 0.05)"
                    : "#FFF",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.72rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: selectedMode === mode.id ? "#8B6914" : "#666",
                    marginBottom: "0.5rem",
                  }}
                >
                  {mode.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.9rem",
                    color: "#444",
                    lineHeight: 1.5,
                  }}
                >
                  {mode.desc}
                </div>
              </button>
            ))}
          </div>
        </FadeIn>
      </Section>

      <Spacer />

      {/* ── FORM ── */}
      <div ref={formRef}>
        <Section>
          {submitted ? (
            <FadeIn>
              <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <div
                  style={{
                    fontSize: "3rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  🕰️
                </div>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "2rem",
                    color: "#1A1A1A",
                    marginBottom: "1rem",
                  }}
                >
                  The trace is recorded.
                </h2>
                <p
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "1.1rem",
                    color: "#555",
                    maxWidth: "500px",
                    margin: "0 auto",
                    lineHeight: 1.8,
                  }}
                >
                  Thank you. Whatever form this took — it now exists
                  outside the conversation. The pattern has a record.
                </p>
              </div>
            </FadeIn>
          ) : (
            <FadeIn>
              {/* Name/Email (optional) */}
              <div
                style={{
                  maxWidth: "680px",
                  margin: "0 auto 3rem",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.68rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#888",
                      display: "block",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Name (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.respondentName}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, respondentName: e.target.value }))
                    }
                    placeholder={user?.name || "Anonymous is fine"}
                    style={{
                      width: "100%",
                      padding: "0.8rem 1rem",
                      border: "1px solid #E0DCD4",
                      borderRadius: "6px",
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "0.95rem",
                      background: "#FFF",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.68rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#888",
                      display: "block",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    value={formData.respondentEmail}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, respondentEmail: e.target.value }))
                    }
                    placeholder="For follow-up only"
                    style={{
                      width: "100%",
                      padding: "0.8rem 1rem",
                      border: "1px solid #E0DCD4",
                      borderRadius: "6px",
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "0.95rem",
                      background: "#FFF",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Reframe / Meta / Minimum textarea */}
              {showReframe && (
                <div style={{ maxWidth: "680px", margin: "0 auto 3rem" }}>
                  <label
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.72rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#8B6914",
                      display: "block",
                      marginBottom: "0.8rem",
                    }}
                  >
                    {selectedMode === "reframe"
                      ? "Reframe — provide the right questions, or answer in your own structure"
                      : selectedMode === "meta"
                      ? "The pattern itself — describe the model directly"
                      : "The one thing. Nothing else."}
                  </label>
                  <textarea
                    value={formData.reframe}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, reframe: e.target.value }))
                    }
                    placeholder={
                      selectedMode === "reframe"
                        ? "The questions should have been..."
                        : selectedMode === "meta"
                        ? "The model looks like this..."
                        : "The one thing..."
                    }
                    rows={12}
                    style={{
                      width: "100%",
                      padding: "1.2rem",
                      border: "2px solid #D4B96A",
                      borderRadius: "8px",
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "1rem",
                      lineHeight: 1.8,
                      background: "rgba(212, 185, 106, 0.03)",
                      outline: "none",
                      resize: "vertical",
                      minHeight: "200px",
                    }}
                  />
                </div>
              )}

              {/* Individual questions */}
              {showQuestions && (
                <div style={{ maxWidth: "680px", margin: "0 auto" }}>
                  {QUESTIONS.map((q, idx) => (
                    <div
                      key={q.key}
                      style={{
                        marginBottom: "3rem",
                        paddingBottom: "3rem",
                        borderBottom:
                          idx < QUESTIONS.length - 1
                            ? "1px solid #E8E4DC"
                            : "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "0.7rem",
                            letterSpacing: "0.2em",
                            color: "#D4B96A",
                            flexShrink: 0,
                          }}
                        >
                          Q{q.num}
                        </span>
                        <h3
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "1.4rem",
                            fontWeight: 600,
                            color: "#1A1A1A",
                            margin: 0,
                          }}
                        >
                          {q.title}
                        </h3>
                      </div>

                      <p
                        style={{
                          fontFamily: "'Source Sans 3', sans-serif",
                          fontSize: "1rem",
                          color: "#444",
                          lineHeight: 1.8,
                          marginBottom: "1.2rem",
                        }}
                      >
                        {q.prompt}
                      </p>

                      <textarea
                        value={formData[q.key as keyof FormData]}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            [q.key]: e.target.value,
                          }))
                        }
                        placeholder={q.placeholder}
                        rows={6}
                        style={{
                          width: "100%",
                          padding: "1rem",
                          border: "1px solid #E0DCD4",
                          borderRadius: "6px",
                          fontFamily: "'Source Sans 3', sans-serif",
                          fontSize: "0.95rem",
                          lineHeight: 1.7,
                          background: "#FFF",
                          outline: "none",
                          resize: "vertical",
                          transition: "border-color 0.2s",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#D4B96A";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#E0DCD4";
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Submit */}
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem 0 4rem",
                }}
              >
                {answeredCount > 0 && (
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.72rem",
                      color: "#8B6914",
                      letterSpacing: "0.12em",
                      marginBottom: "1rem",
                    }}
                  >
                    {answeredCount} of 5 questions answered
                  </div>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.82rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#0A0A10",
                    background: "#D4B96A",
                    border: "none",
                    padding: "1rem 3rem",
                    borderRadius: "4px",
                    cursor: submitting ? "wait" : "pointer",
                    opacity: submitting ? 0.6 : 1,
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting) {
                      e.currentTarget.style.background = "#E8D08A";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#D4B96A";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {submitting ? "Recording..." : "Leave Your Trace"}
                </button>
                <p
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.85rem",
                    color: "#888",
                    marginTop: "1rem",
                    lineHeight: 1.6,
                  }}
                >
                  Answer any number of questions in any order.
                  Partial responses are welcomed and valued.
                </p>
              </div>
            </FadeIn>
          )}
        </Section>
      </div>

      <Divider />

      {/* ── FOOTER NAV ── */}
      <Section>
        <FadeIn>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "2rem 0",
              maxWidth: "680px",
              margin: "0 auto",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <Link
              href="/blog/the-clock-keeper-chronicles-part-1"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#8B6914",
                textDecoration: "none",
              }}
            >
              ← Back to Part I
            </Link>
            <Link
              href="/humanos"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#8B6914",
                textDecoration: "none",
              }}
            >
              Human OS →
            </Link>
          </div>
        </FadeIn>
      </Section>

      <Spacer />
    </div>
  );
}
